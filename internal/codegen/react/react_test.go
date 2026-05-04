package react

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

// TypeScript output

func TestGenerateTS_Basic(t *testing.T) {
	file := parse(t, `
@scope (.Button) {
  @tag button;
  :scope { display: flex; }
  :scope[data-intent="primary"]   { background: blue; }
  :scope[data-intent="secondary"] { background: white; }
  :scope[data-size="sm"] { font-size: 12px; }
  :scope[data-size="lg"] { font-size: 16px; }
}`)
	out := Generate(file)

	assertContains(t, out, `import * as React from "react"`)
	assertContains(t, out, `export type ButtonProps<T extends React.ElementType = "button">`)
	assertContains(t, out, `as?: T;`)
	assertContains(t, out, `intent?: "primary" | "secondary"`)
	assertContains(t, out, `size?: "sm" | "lg"`)
	assertContains(t, out, `Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "size">`)
	// New: forwardRef wrapper around the render function
	assertContains(t, out, `export const Button = React.forwardRef(function Button({ as, intent, size, className = "", ...rest }: ButtonProps<any>, ref: any)`)
	assertContains(t, out, `const Tag = as ?? "button"`)
	assertContains(t, out, `React.createElement(Tag,`)
	// ref must be forwarded into the rendered element
	assertContains(t, out, `...rest, ref, className: cls`)
	assertContains(t, out, `"data-intent": intent`)
	assertContains(t, out, `"data-size": size`)
	// Polymorphic cast preserving ref typing across `as`
	assertContains(t, out, `as <T extends React.ElementType = "button">(props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null`)
}

func TestGenerateTS_DefaultTag(t *testing.T) {
	file := parse(t, `@scope (.Card) { :scope { padding: 16px; } }`)
	out := Generate(file)

	assertContains(t, out, `export type CardProps<T extends React.ElementType = "div">`)
	assertContains(t, out, `const Tag = as ?? "div"`)
}

func TestGenerateTS_NoTagDefaultsToDiv(t *testing.T) {
	file := parse(t, `@scope (.Wrap) { :scope { display: block; } }`)
	out := Generate(file)

	assertContains(t, out, `<T extends React.ElementType = "div">`)
	assertContains(t, out, `as ?? "div"`)
}

func TestGenerateTS_NoVariants(t *testing.T) {
	file := parse(t, `@scope (.Badge) { @tag span; :scope { display: inline; } }`)
	out := Generate(file)

	assertContains(t, out, `export type BadgeProps<T extends React.ElementType = "span">`)
	assertContains(t, out, `Omit<React.ComponentPropsWithoutRef<T>, "as">`)
	assertContains(t, out, `export const Badge = React.forwardRef(function Badge({ as, className = "", ...rest }: BadgeProps<any>, ref: any)`)
}

func TestGenerateTS_MultipleComponents(t *testing.T) {
	file := parse(t, `
@scope (.Root) { @tag div; :scope { display: flex; } }
@scope (.Trigger) { @tag button; :scope[data-open] { color: blue; } }`)
	out := Generate(file)

	assertContains(t, out, `export const Root = React.forwardRef`)
	assertContains(t, out, `export const Trigger = React.forwardRef`)
	assertNotContains(t, out, `export default`)
}

// JavaScript output

func TestGenerateJS_NoInterfaces(t *testing.T) {
	file := parse(t, `
@scope (.Button) {
  @tag button;
  :scope[data-intent="primary"] { background: blue; }
}`)
	out := GenerateJS(file)

	assertNotContains(t, out, `interface`)
	assertNotContains(t, out, `type ButtonProps`)
	assertNotContains(t, out, `<T extends`)
	assertNotContains(t, out, ` as React.ElementType`)
	assertContains(t, out, `export const Button = React.forwardRef(function Button({ as, intent, className = "", ...rest }, ref)`)
	assertContains(t, out, `const Tag = as ?? "button"`)
	assertContains(t, out, `React.createElement(Tag,`)
	assertContains(t, out, `...rest, ref, className: cls`)
}

func TestGenerateJS_NoTypeAnnotations(t *testing.T) {
	file := parse(t, `@scope (.Foo) { :scope[data-x="a"] { color: red; } }`)
	out := GenerateJS(file)

	assertNotContains(t, out, `}: FooProps`)
	assertContains(t, out, `function Foo({ as, x, className = "", ...rest }, ref)`)
}

// boolean variants

func TestGenerateTS_BooleanVariant(t *testing.T) {
	file := parse(t, `
@scope (.Label) {
  @tag label;
  :scope[data-primary] { background: blue; }
}`)
	out := Generate(file)

	assertContains(t, out, `primary?: boolean`)
	assertContains(t, out, `primary && { "data-primary": "" }`)
}

func TestGenerateJS_BooleanVariant(t *testing.T) {
	file := parse(t, `@scope (.Label) { :scope[data-active] { opacity: 1; } }`)
	out := GenerateJS(file)

	assertNotContains(t, out, `interface`)
	assertContains(t, out, `active && { "data-active": "" }`)
}

// mixed variants

func TestGenerateTS_MixedVariant(t *testing.T) {
	file := parse(t, `
@scope (.Tag) {
  :scope[data-kind]       { font-weight: bold; }
  :scope[data-kind="pill"] { border-radius: 999px; }
  :scope[data-kind="flat"] { border-radius: 0; }
}`)
	out := Generate(file)

	assertContains(t, out, `kind?: boolean | "pill" | "flat"`)
	assertContains(t, out, `kind !== undefined && kind !== false`)
	assertContains(t, out, `kind === true ? "" : kind`)
}

// conditional spread — undefined values must not override rest

func TestGenerate_UndefinedVariantDoesNotOverrideRest(t *testing.T) {
	file := parse(t, `@scope (.Foo) { :scope[data-x="a"] { color: red; } }`)
	out := GenerateJS(file)

	assertContains(t, out, `x !== undefined && { "data-x": x }`)
	assertNotContains(t, out, `{ ...rest, ref, className: cls, "data-x"`)
}

// ref forwarding — the ref MUST appear in the createElement call

func TestGenerate_RefForwarded_TS(t *testing.T) {
	file := parse(t, `@scope (.Foo) { @tag div; :scope {} }`)
	out := Generate(file)

	assertContains(t, out, `React.forwardRef`)
	assertContains(t, out, `, ref: any`)
	assertContains(t, out, `...rest, ref, className: cls`)
}

func TestGenerate_RefForwarded_JS(t *testing.T) {
	file := parse(t, `@scope (.Foo) { @tag div; :scope {} }`)
	out := GenerateJS(file)

	assertContains(t, out, `React.forwardRef`)
	assertContains(t, out, `, ref)`)
	assertContains(t, out, `...rest, ref, className: cls`)
}

// .d.ts generation

func TestGenerateDTS_Basic(t *testing.T) {
	file := parse(t, `
@scope (.Button) {
  @tag button;
  :scope[data-intent="primary"] { background: blue; }
}`)
	out := GenerateDTS(file)

	assertContains(t, out, `import type * as React from "react"`)
	assertContains(t, out, `export type ButtonProps<T extends React.ElementType = "button">`)
	assertContains(t, out, `as?: T;`)
	assertContains(t, out, `intent?: "primary"`)
	assertContains(t, out, `Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent">`)
	assertContains(t, out, `export const Button: <T extends React.ElementType = "button">(props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null`)
	// no function body in .d.ts
	assertNotContains(t, out, `createElement`)
	assertNotContains(t, out, `forwardRef(`)
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
  :scope[data-color="red"]  { border-color: red; }
}`)
	out := GenerateDTS(file)

	assertContains(t, out, `color?: boolean | "blue" | "red"`)
}

// Polymorphic default tag is captured per-component

func TestGenerateTS_PolymorphicDefaultTag(t *testing.T) {
	cases := []struct{ tag, wantDefault string }{
		{"button", `<T extends React.ElementType = "button">`},
		{"a", `<T extends React.ElementType = "a">`},
		{"input", `<T extends React.ElementType = "input">`},
		{"div", `<T extends React.ElementType = "div">`},
		{"span", `<T extends React.ElementType = "span">`},
		{"section", `<T extends React.ElementType = "section">`},
	}
	for _, c := range cases {
		file := parse(t, `@scope (.C) { @tag `+c.tag+`; }`)
		out := Generate(file)
		assertContains(t, out, c.wantDefault)
	}
}
