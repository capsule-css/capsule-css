package parser

import (
	"fmt"
	"regexp"
	"strings"
)

var (
	tagRe = regexp.MustCompile(`@tag\s+([a-z][a-z0-9-]*)\s*;`)
)

type FileDef struct {
	Components []ComponentDef
}

type ComponentDef struct {
	Name     string
	Tag      string
	Variants []VariantDef
}

type VariantDef struct {
	Name    string
	Values  []string // empty means boolean variant
	Boolean bool
}

type ParseError struct {
	Line    int
	Col     int
	Message string
}

func (e *ParseError) Error() string {
	return fmt.Sprintf("line %d, col %d: %s", e.Line, e.Col, e.Message)
}

// Parse parses a .capsule.css source file and returns a FileDef.
func Parse(src []byte) (*FileDef, error) {
	s := &scanner{src: src, line: 1, col: 1}
	file := &FileDef{}

	for {
		s.skip()
		if s.done() {
			break
		}
		if s.peek() != '@' {
			return nil, &ParseError{s.line, s.col, fmt.Sprintf("unexpected %q, expected @scope", s.peek())}
		}
		s.advance() // @

		kw := s.readIdent()
		if kw != "scope" {
			return nil, &ParseError{s.line, s.col, fmt.Sprintf("unexpected @%s, expected @scope", kw)}
		}

		comp, err := parseScopeBlock(s)
		if err != nil {
			return nil, err
		}
		file.Components = append(file.Components, *comp)
	}

	return file, nil
}

func parseScopeBlock(s *scanner) (*ComponentDef, error) {
	s.skip()
	if err := s.expect('('); err != nil {
		return nil, err
	}
	s.skip()
	if err := s.expect('.'); err != nil {
		return nil, err
	}

	name := s.readIdent()
	if name == "" {
		return nil, &ParseError{s.line, s.col, "expected component name after '.'"}
	}
	if !isPascalCase(name) {
		return nil, &ParseError{s.line, s.col, fmt.Sprintf("component name must be PascalCase, got %q", name)}
	}

	if err := s.expect(')'); err != nil {
		return nil, err
	}
	if err := s.expect('{'); err != nil {
		return nil, err
	}

	body, err := s.readBlock()
	if err != nil {
		return nil, err
	}

	comp := &ComponentDef{
		Name: name,
		Tag:  "div",
	}
	if tag := extractTag(body); tag != "" {
		comp.Tag = tag
	}
	comp.Variants = extractVariants(body)

	return comp, nil
}

func extractTag(body string) string {
	m := tagRe.FindStringSubmatch(body)
	if m != nil {
		return m[1]
	}
	return ""
}

// rawAttr is a single [data-X] or [data-X="Y"] occurrence found while walking.
type rawAttr struct {
	name  string
	value string // empty when the bracket has no value (boolean form)
	hasValue bool
}

// extractVariants walks every selector that contains :scope and collects all
// data-* attributes attached to the :scope element. Handles:
//
//   - chained brackets:    :scope[data-a][data-b]
//   - :not() / :is() / :where() — transparent, recurses into them
//   - :has(...)            — opaque, attributes inside describe descendants
//   - descendant selectors — :scope .Child[data-x] is NOT a scope variant
//   - substring matchers   — [data-x^="..."] etc. are skipped (no enum value)
func extractVariants(body string) []VariantDef {
	var raw []rawAttr
	i := 0
	for {
		idx := indexFrom(body, ":scope", i)
		if idx < 0 {
			break
		}
		i = idx + len(":scope")
		i = walkScopeChain(body, i, &raw)
	}

	if len(raw) == 0 {
		return nil
	}

	nameOrder := []string{}
	namesSeen := map[string]bool{}
	booleans := map[string]bool{}
	valuesSeen := map[string]map[string]bool{}
	valueOrder := map[string][]string{}

	for _, a := range raw {
		if !namesSeen[a.name] {
			namesSeen[a.name] = true
			nameOrder = append(nameOrder, a.name)
			valuesSeen[a.name] = map[string]bool{}
		}
		if a.hasValue {
			if !valuesSeen[a.name][a.value] {
				valuesSeen[a.name][a.value] = true
				valueOrder[a.name] = append(valueOrder[a.name], a.value)
			}
		} else {
			booleans[a.name] = true
		}
	}

	variants := make([]VariantDef, 0, len(nameOrder))
	for _, name := range nameOrder {
		variants = append(variants, VariantDef{
			Name:    name,
			Values:  valueOrder[name],
			Boolean: booleans[name],
		})
	}
	return variants
}

// walkScopeChain reads the chain of selector segments attached to :scope
// (brackets and pseudo-classes) and collects every data-* attribute that
// targets the :scope element. Returns the position after the chain ends.
func walkScopeChain(s string, i int, out *[]rawAttr) int {
	for i < len(s) {
		switch {
		case s[i] == '[':
			end := strings.IndexByte(s[i:], ']')
			if end < 0 {
				return i
			}
			if a, ok := parseDataAttrBracket(s[i+1 : i+end]); ok {
				*out = append(*out, a)
			}
			i += end + 1
		case s[i] == ':':
			j := i + 1
			for j < len(s) && (isAlpha(s[j]) || s[j] == '-') {
				j++
			}
			pseudo := s[i+1 : j]
			if j < len(s) && s[j] == '(' {
				k := matchParen(s, j)
				if k < 0 {
					return i
				}
				if pseudo != "has" {
					extractAttrsFromSegment(s[j+1:k-1], out)
				}
				i = k
			} else {
				i = j
			}
		default:
			// whitespace, combinator, comma, '{' — chain ends.
			return i
		}
	}
	return i
}

// extractAttrsFromSegment finds every [data-X] inside an arbitrary selector
// segment. Used inside :not() / :is() / :where(), which apply to the same
// element as the outer :scope.
func extractAttrsFromSegment(seg string, out *[]rawAttr) {
	i := 0
	for i < len(seg) {
		if seg[i] != '[' {
			i++
			continue
		}
		end := strings.IndexByte(seg[i:], ']')
		if end < 0 {
			return
		}
		if a, ok := parseDataAttrBracket(seg[i+1 : i+end]); ok {
			*out = append(*out, a)
		}
		i += end + 1
	}
}

// parseDataAttrBracket parses the contents of a [...] bracket and returns
// the data-* attribute it represents, if any. Substring matchers (^=, $=,
// *=, ~=, |=) are skipped — they don't yield a discrete enum value.
func parseDataAttrBracket(inner string) (rawAttr, bool) {
	inner = strings.TrimSpace(inner)
	if !strings.HasPrefix(inner, "data-") {
		return rawAttr{}, false
	}
	rest := inner[len("data-"):]

	nameEnd := 0
	for nameEnd < len(rest) {
		c := rest[nameEnd]
		if !(isAlphaLower(c) || isDigit(c) || c == '-') {
			break
		}
		nameEnd++
	}
	if nameEnd == 0 {
		return rawAttr{}, false
	}
	name := rest[:nameEnd]
	rest = strings.TrimSpace(rest[nameEnd:])

	if rest == "" {
		return rawAttr{name: name}, true
	}
	if !strings.HasPrefix(rest, "=") {
		// substring matcher (^=, *=, $=, ~=, |=) or unknown — skip.
		return rawAttr{}, false
	}
	rest = strings.TrimSpace(rest[1:])
	if len(rest) >= 2 && (rest[0] == '"' || rest[0] == '\'') && rest[len(rest)-1] == rest[0] {
		return rawAttr{name: name, value: rest[1 : len(rest)-1], hasValue: true}, true
	}
	return rawAttr{name: name, value: rest, hasValue: true}, true
}

func matchParen(s string, openIdx int) int {
	depth := 1
	for k := openIdx + 1; k < len(s); k++ {
		switch s[k] {
		case '(':
			depth++
		case ')':
			depth--
			if depth == 0 {
				return k + 1
			}
		}
	}
	return -1
}

func indexFrom(s, sub string, from int) int {
	if from >= len(s) {
		return -1
	}
	idx := strings.Index(s[from:], sub)
	if idx < 0 {
		return -1
	}
	return from + idx
}

func isPascalCase(s string) bool {
	if len(s) == 0 {
		return false
	}
	ch := s[0]
	return ch >= 'A' && ch <= 'Z'
}

func isAlpha(c byte) bool      { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') }
func isAlphaLower(c byte) bool { return c >= 'a' && c <= 'z' }
func isDigit(c byte) bool      { return c >= '0' && c <= '9' }
