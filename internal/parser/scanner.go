package parser

import "fmt"

type scanner struct {
	src  []byte
	pos  int
	line int
	col  int
}

func (s *scanner) done() bool {
	return s.pos >= len(s.src)
}

func (s *scanner) peek() byte {
	if s.done() {
		return 0
	}
	return s.src[s.pos]
}

func (s *scanner) advance() byte {
	if s.done() {
		return 0
	}
	ch := s.src[s.pos]
	s.pos++
	if ch == '\n' {
		s.line++
		s.col = 1
	} else {
		s.col++
	}
	return ch
}

func (s *scanner) skipWS() {
	for !s.done() && isWS(s.src[s.pos]) {
		s.advance()
	}
}

func (s *scanner) skipComment() bool {
	if s.pos+1 >= len(s.src) || s.src[s.pos] != '/' || s.src[s.pos+1] != '*' {
		return false
	}
	s.advance() // /
	s.advance() // *
	for s.pos+1 < len(s.src) {
		if s.src[s.pos] == '*' && s.src[s.pos+1] == '/' {
			s.advance() // *
			s.advance() // /
			return true
		}
		s.advance()
	}
	return false
}

// skip advances past whitespace and /* */ comments.
func (s *scanner) skip() {
	for {
		s.skipWS()
		if !s.skipComment() {
			break
		}
	}
}

func (s *scanner) readIdent() string {
	start := s.pos
	for !s.done() && isIdentByte(s.src[s.pos]) {
		s.advance()
	}
	return string(s.src[start:s.pos])
}

func (s *scanner) expect(ch byte) error {
	s.skip()
	if s.done() {
		return &ParseError{s.line, s.col, fmt.Sprintf("expected '%c', got EOF", ch)}
	}
	if s.src[s.pos] != ch {
		return &ParseError{s.line, s.col, fmt.Sprintf("expected '%c', got '%c'", ch, s.src[s.pos])}
	}
	s.advance()
	return nil
}

// readBlock reads the content of a block, starting after the opening '{'.
// Returns the inner content (without braces) and advances past the closing '}'.
func (s *scanner) readBlock() (string, error) {
	start := s.pos
	depth := 1

	for !s.done() {
		ch := s.src[s.pos]

		if ch == '/' && s.pos+1 < len(s.src) && s.src[s.pos+1] == '*' {
			s.skipComment()
			continue
		}

		if ch == '"' || ch == '\'' {
			s.skipString(ch)
			continue
		}

		if ch == '{' {
			depth++
			s.advance()
			continue
		}

		if ch == '}' {
			depth--
			if depth == 0 {
				break
			}
			s.advance()
			continue
		}

		s.advance()
	}

	if depth != 0 {
		return "", &ParseError{s.line, s.col, "unclosed block"}
	}

	content := string(s.src[start:s.pos])
	s.advance() // consume closing '}'
	return content, nil
}

func (s *scanner) skipString(quote byte) {
	s.advance() // opening quote
	for !s.done() {
		ch := s.advance()
		if ch == '\\' {
			s.advance()
			continue
		}
		if ch == quote {
			return
		}
	}
}

func isWS(ch byte) bool {
	return ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r'
}

func isIdentByte(ch byte) bool {
	return ch == '-' || ch == '_' ||
		(ch >= 'a' && ch <= 'z') ||
		(ch >= 'A' && ch <= 'Z') ||
		(ch >= '0' && ch <= '9')
}
