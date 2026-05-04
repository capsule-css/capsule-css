package vanilla

import (
	"strings"
	"testing"

	"capsule-css/internal/parser"
)

func parse(t *testing.T, src string) *parser.FileDef {
	t.Helper()
	file, err := parser.Parse([]byte(src))
	if err != nil {
		t.Fatalf("parse error: %v", err)
	}
	return file
}

func assertContains(t *testing.T, got, want string) {
	t.Helper()
	if !strings.Contains(got, want) {
		t.Errorf("output missing %q\n\ngot:\n%s", want, got)
	}
}

func assertNotContains(t *testing.T, got, want string) {
	t.Helper()
	if strings.Contains(got, want) {
		t.Errorf("output should not contain %q\n\ngot:\n%s", want, got)
	}
}

// JS output

func TestGenerate_Basic(t *testing.T) {
	file := parse(t, `
@scope (.Button) {
  @tag button;
  :scope { display: flex; }
  :scope[data-intent="primary"]   { background: blue; }
  :scope[data-intent="secondary"] { background: white; }
  :scope[data-size="sm"] { font-size: 12px; }
}`)
	out := Generate(file)

	assertContains(t, out, `export function Button({ as, intent, size, className = "", children } = {})`)
	assertContains(t, out, `document.createElement(as ?? "button")`)
	assertContains(t, out, `["Button", className].filter(Boolean).join(" ")`)
	assertContains(t, out, `if (intent !== undefined) el.dataset.intent = intent`)
	assertContains(t, out, `if (size !== undefined) el.dataset.size = size`)
	assertContains(t, out, `el.textContent = children`)
	assertContains(t, out, `return el`)
	// no React, no TypeScript
	assertNotContains(t, out, `React`)
	assertNotContains(t, out, `interface`)
}

func TestGenerate_DefaultTag(t *testing.T) {
	file := parse(t, `@scope (.Card) { :scope { padding: 16px; } }`)
	out := Generate(file)
	assertContains(t, out, `document.createElement(as ?? "div")`)
}

func TestGenerate_AsOverride(t *testing.T) {
	// The destructured `as` parameter should be present even when the component
	// has no variants — every component is polymorphic.
	file := parse(t, `@scope (.Wrap) { :scope { display: block; } }`)
	out := Generate(file)
	assertContains(t, out, `export function Wrap({ as, className = "", children } = {})`)
	assertContains(t, out, `document.createElement(as ?? "div")`)
}

func TestGenerate_NoVariants(t *testing.T) {
	file := parse(t, `@scope (.Badge) { @tag span; :scope { display: inline; } }`)
	out := Generate(file)

	assertContains(t, out, `export function Badge({ as, className = "", children } = {})`)
	assertNotContains(t, out, `dataset`)
}

func TestGenerate_MultipleComponents(t *testing.T) {
	file := parse(t, `
@scope (.Root)    { @tag div;    :scope { display: flex; } }
@scope (.Trigger) { @tag button; :scope { cursor: pointer; } }`)
	out := Generate(file)

	assertContains(t, out, `export function Root(`)
	assertContains(t, out, `export function Trigger(`)
}

// boolean variants

func TestGenerate_BooleanVariant(t *testing.T) {
	file := parse(t, `@scope (.Label) { :scope[data-active] { opacity: 1; } }`)
	out := Generate(file)

	assertContains(t, out, `active`)
	assertContains(t, out, `if (active) el.dataset.active = ""`)
	assertNotContains(t, out, `el.dataset.active = active`)
}

func TestGenerate_MixedVariant(t *testing.T) {
	file := parse(t, `
@scope (.Tag) {
  :scope[data-kind]        { font-weight: bold; }
  :scope[data-kind="pill"] { border-radius: 999px; }
  :scope[data-kind="flat"] { border-radius: 0; }
}`)
	out := Generate(file)

	assertContains(t, out, `kind !== undefined && kind !== false`)
	assertContains(t, out, `kind === true ? "" : String(kind)`)
}

// children

func TestGenerate_ChildrenNodeBranch(t *testing.T) {
	file := parse(t, `@scope (.Wrap) { @tag div; :scope {} }`)
	out := Generate(file)

	assertContains(t, out, `children instanceof Node`)
	assertContains(t, out, `el.appendChild(children)`)
}

// .d.ts output — polymorphic via HTMLElementTagNameMap

func TestGenerateDTS_Basic(t *testing.T) {
	file := parse(t, `
@scope (.Button) {
  @tag button;
  :scope[data-intent="primary"]   { background: blue; }
  :scope[data-intent="secondary"] { background: white; }
}`)
	out := GenerateDTS(file)

	assertContains(t, out, `export interface ButtonOptions<T extends keyof HTMLElementTagNameMap = "button">`)
	assertContains(t, out, `as?: T;`)
	assertContains(t, out, `intent?: "primary" | "secondary"`)
	assertContains(t, out, `className?: string`)
	assertContains(t, out, `children?: string | Node`)
	assertContains(t, out, `export function Button<T extends keyof HTMLElementTagNameMap = "button">(options?: ButtonOptions<T>): HTMLElementTagNameMap[T]`)
	// no React imports
	assertNotContains(t, out, `React`)
	assertNotContains(t, out, `import`)
}

func TestGenerateDTS_DefaultTag(t *testing.T) {
	file := parse(t, `@scope (.Card) { :scope { padding: 16px; } }`)
	out := GenerateDTS(file)
	assertContains(t, out, `<T extends keyof HTMLElementTagNameMap = "div">`)
}

func TestGenerateDTS_BooleanVariant(t *testing.T) {
	file := parse(t, `@scope (.Toggle) { :scope[data-on] { opacity: 1; } }`)
	out := GenerateDTS(file)
	assertContains(t, out, `on?: boolean`)
}

func TestGenerateDTS_MixedVariant(t *testing.T) {
	file := parse(t, `
@scope (.Chip) {
  :scope[data-color]        { border: 1px solid; }
  :scope[data-color="blue"] { border-color: blue; }
}`)
	out := GenerateDTS(file)
	assertContains(t, out, `color?: boolean | "blue"`)
}

func TestGenerateDTS_PolymorphicDefaultTag(t *testing.T) {
	cases := []struct{ tag, wantDefault string }{
		{"button", `= "button">`},
		{"a", `= "a">`},
		{"input", `= "input">`},
		{"div", `= "div">`},
		{"span", `= "span">`},
		{"section", `= "section">`},
	}
	for _, c := range cases {
		file := parse(t, `@scope (.C) { @tag `+c.tag+`; }`)
		out := GenerateDTS(file)
		assertContains(t, out, c.wantDefault)
	}
}
