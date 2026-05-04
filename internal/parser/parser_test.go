package parser

import (
	"testing"
)

// helpers

func assertNoErr(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func assertComponents(t *testing.T, file *FileDef, n int) {
	t.Helper()
	if len(file.Components) != n {
		t.Fatalf("want %d component(s), got %d", n, len(file.Components))
	}
}

func assertVariant(t *testing.T, v VariantDef, name string, boolean bool, values ...string) {
	t.Helper()
	if v.Name != name {
		t.Errorf("want variant name=%q, got %q", name, v.Name)
	}
	if v.Boolean != boolean {
		t.Errorf("variant %q: want Boolean=%v, got %v", name, boolean, v.Boolean)
	}
	if len(v.Values) != len(values) {
		t.Errorf("variant %q: want %d value(s) %v, got %v", name, len(values), values, v.Values)
		return
	}
	for i, want := range values {
		if v.Values[i] != want {
			t.Errorf("variant %q value[%d]: want %q, got %q", name, i, want, v.Values[i])
		}
	}
}

// basic parsing

func TestParseSingleComponent(t *testing.T) {
	src := `
@scope (.Button) {
  @tag button;
  :scope { padding: 8px 12px; &:hover { opacity: 0.85; } }
  :scope[data-intent="primary"] { background: #0066ff; color: white; }
  :scope[data-intent="secondary"] { border: 1px solid #0066ff; }
  :scope[data-size="sm"] { padding: 4px 8px; }
  :scope[data-size="md"] { padding: 8px 12px; }
  :scope[data-size="lg"] { padding: 12px 24px; }
}`

	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	assertComponents(t, file, 1)

	comp := file.Components[0]
	if comp.Name != "Button" {
		t.Errorf("want Name=Button, got %q", comp.Name)
	}
	if comp.Tag != "button" {
		t.Errorf("want Tag=button, got %q", comp.Tag)
	}
	if len(comp.Variants) != 2 {
		t.Fatalf("want 2 variants, got %d", len(comp.Variants))
	}
	assertVariant(t, comp.Variants[0], "intent", false, "primary", "secondary")
	assertVariant(t, comp.Variants[1], "size", false, "sm", "md", "lg")
}

func TestParseMultipleComponents(t *testing.T) {
	src := `
@scope (.AccordionRoot) {
  @tag div;
  :scope { display: flex; flex-direction: column; }
}
@scope (.AccordionTrigger) {
  @tag button;
  :scope { cursor: pointer; }
  :scope[data-state="open"]   { color: #0066ff; }
  :scope[data-state="closed"] { color: inherit; }
}`

	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	assertComponents(t, file, 2)

	if file.Components[0].Name != "AccordionRoot" {
		t.Errorf("want Components[0].Name=AccordionRoot, got %q", file.Components[0].Name)
	}
	if file.Components[1].Name != "AccordionTrigger" {
		t.Errorf("want Components[1].Name=AccordionTrigger, got %q", file.Components[1].Name)
	}
	if len(file.Components[1].Variants) != 1 {
		t.Fatalf("want 1 variant on AccordionTrigger, got %d", len(file.Components[1].Variants))
	}
	assertVariant(t, file.Components[1].Variants[0], "state", false, "open", "closed")
}

func TestParseDefaultTag(t *testing.T) {
	src := `@scope (.Card) { :scope { padding: 16px; } }`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	if file.Components[0].Tag != "div" {
		t.Errorf("want default Tag=div, got %q", file.Components[0].Tag)
	}
}

func TestParseNoVariants(t *testing.T) {
	src := `@scope (.Badge) { @tag span; :scope { display: inline; } }`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	if len(file.Components[0].Variants) != 0 {
		t.Errorf("want no variants, got %v", file.Components[0].Variants)
	}
}

// boolean variants

func TestParseBooleanVariant(t *testing.T) {
	src := `
@scope (.Label) {
  @tag label;
  :scope { display: flex; }
  :scope[data-primary] { background: blue; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	assertComponents(t, file, 1)
	if len(file.Components[0].Variants) != 1 {
		t.Fatalf("want 1 variant, got %d", len(file.Components[0].Variants))
	}
	assertVariant(t, file.Components[0].Variants[0], "primary", true)
}

func TestParseMixedVariant(t *testing.T) {
	src := `
@scope (.Label) {
  :scope { background: green; }
  :scope[data-primary]          { background: blue; }
  :scope[data-primary="hello"]  { background: yellow; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	assertComponents(t, file, 1)
	if len(file.Components[0].Variants) != 1 {
		t.Fatalf("want 1 variant, got %d", len(file.Components[0].Variants))
	}
	assertVariant(t, file.Components[0].Variants[0], "primary", true, "hello")
}

func TestParseMixedVariantValuedFirst(t *testing.T) {
	// valued selector appears before bare — order in CSS should not matter
	src := `
@scope (.Tag) {
  :scope[data-kind="a"] { color: red; }
  :scope[data-kind]     { font-weight: bold; }
  :scope[data-kind="b"] { color: blue; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	v := file.Components[0].Variants[0]
	if !v.Boolean {
		t.Error("want Boolean=true for mixed variant")
	}
	if len(v.Values) != 2 {
		t.Errorf("want 2 values, got %v", v.Values)
	}
}

// insertion order

func TestParseVariantInsertionOrder(t *testing.T) {
	src := `
@scope (.Button) {
  :scope[data-size="lg"]   { font-size: 16px; }
  :scope[data-size="sm"]   { font-size: 12px; }
  :scope[data-size="md"]   { font-size: 14px; }
  :scope[data-intent="danger"]    { background: red; }
  :scope[data-intent="primary"]   { background: blue; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	if len(file.Components[0].Variants) != 2 {
		t.Fatalf("want 2 variants, got %d", len(file.Components[0].Variants))
	}
	// variant order: size first (appears first in source), intent second
	assertVariant(t, file.Components[0].Variants[0], "size", false, "lg", "sm", "md")
	assertVariant(t, file.Components[0].Variants[1], "intent", false, "danger", "primary")
}

// comments

func TestParseWithComments(t *testing.T) {
	src := `
/* accordion components */
@scope (.Accordion) {
  /* root container */
  @tag div;
  :scope { display: flex; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	assertComponents(t, file, 1)
	if file.Components[0].Name != "Accordion" {
		t.Errorf("want Name=Accordion, got %q", file.Components[0].Name)
	}
}

// tags

func TestParseVariousTags(t *testing.T) {
	cases := []struct{ tag, src string }{
		{"a", `@scope (.Link) { @tag a; }`},
		{"input", `@scope (.Input) { @tag input; }`},
		{"section", `@scope (.Section) { @tag section; }`},
	}
	for _, c := range cases {
		file, err := Parse([]byte(c.src))
		assertNoErr(t, err)
		if file.Components[0].Tag != c.tag {
			t.Errorf("want Tag=%q, got %q", c.tag, file.Components[0].Tag)
		}
	}
}

// errors

func TestParseErrorNotPascalCase(t *testing.T) {
	_, err := Parse([]byte(`@scope (.button) { }`))
	if err == nil {
		t.Fatal("want error for non-PascalCase name, got nil")
	}
}

func TestParseErrorUnclosedBlock(t *testing.T) {
	_, err := Parse([]byte(`@scope (.Button) { :scope { padding: 8px; }`))
	if err == nil {
		t.Fatal("want error for unclosed block, got nil")
	}
}

func TestParseErrorUnknownAtRule(t *testing.T) {
	_, err := Parse([]byte(`@media (max-width: 768px) { }`))
	if err == nil {
		t.Fatal("want error for top-level @media, got nil")
	}
}

func TestParseErrorMissingDot(t *testing.T) {
	_, err := Parse([]byte(`@scope (Button) { }`))
	if err == nil {
		t.Fatal("want error for missing dot before component name, got nil")
	}
}

// chained brackets and functional pseudo-classes

func TestParseChainedBrackets(t *testing.T) {
	src := `
@scope (.Button) {
  :scope[data-loading][data-disabled] { opacity: 0.4; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 2 {
		t.Fatalf("want 2 variants, got %d", len(c.Variants))
	}
	assertVariant(t, c.Variants[0], "loading", true)
	assertVariant(t, c.Variants[1], "disabled", true)
}

func TestParseChainedBracketsWithValue(t *testing.T) {
	src := `
@scope (.Button) {
  :scope[data-intent="primary"][data-size="lg"] { padding: 16px; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 2 {
		t.Fatalf("want 2 variants, got %d", len(c.Variants))
	}
	assertVariant(t, c.Variants[0], "intent", false, "primary")
	assertVariant(t, c.Variants[1], "size", false, "lg")
}

func TestParseNotPseudoClass(t *testing.T) {
	src := `
@scope (.Button) {
  :scope[data-loading]:not([data-disabled]) { cursor: wait; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 2 {
		t.Fatalf("want 2 variants, got %d", len(c.Variants))
	}
	assertVariant(t, c.Variants[0], "loading", true)
	assertVariant(t, c.Variants[1], "disabled", true)
}

func TestParseIsPseudoClass(t *testing.T) {
	src := `
@scope (.Card) {
  :scope:is([data-state="open"], [data-state="loading"]) { background: yellow; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 1 {
		t.Fatalf("want 1 variant, got %d", len(c.Variants))
	}
	assertVariant(t, c.Variants[0], "state", false, "open", "loading")
}

func TestParseWherePseudoClass(t *testing.T) {
	src := `
@scope (.Item) {
  :scope:where([data-active]) { color: blue; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 1 {
		t.Fatalf("want 1 variant, got %d", len(c.Variants))
	}
	assertVariant(t, c.Variants[0], "active", true)
}

func TestParseHasIsOpaque(t *testing.T) {
	// :has() targets descendants — attributes inside MUST NOT become scope variants.
	src := `
@scope (.List) {
  :scope[data-loading] { opacity: 0.5; }
  :scope:has([data-error]) { border: 1px solid red; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 1 {
		t.Fatalf("want only 1 variant (data-error inside :has must be ignored), got %d: %+v", len(c.Variants), c.Variants)
	}
	assertVariant(t, c.Variants[0], "loading", true)
}

func TestParseDescendantSelectorIgnored(t *testing.T) {
	// data-* on a descendant element MUST NOT become a scope variant.
	src := `
@scope (.Form) {
  :scope[data-submitted] { opacity: 0.6; }
  :scope .Input[data-invalid] { border-color: red; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 1 {
		t.Fatalf("want only 1 variant (descendant data-invalid must be ignored), got %d: %+v", len(c.Variants), c.Variants)
	}
	assertVariant(t, c.Variants[0], "submitted", true)
}

func TestParseSubstringMatchersIgnored(t *testing.T) {
	// Substring matchers (^=, $=, *=) yield no enum value — skip for now.
	src := `
@scope (.Icon) {
  :scope[data-name^="arrow-"] { color: blue; }
  :scope[data-tone] { opacity: 0.8; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 1 {
		t.Fatalf("want 1 variant (substring matcher skipped), got %d: %+v", len(c.Variants), c.Variants)
	}
	assertVariant(t, c.Variants[0], "tone", true)
}

func TestParseChainedAttrOnlyDeclaredInChain(t *testing.T) {
	// data-attr2 appears only inside a chain — must still be typed.
	src := `
@scope (.Toggle) {
  :scope[data-checked] { color: green; }
  :scope[data-checked][data-readonly] { cursor: not-allowed; }
}`
	file, err := Parse([]byte(src))
	assertNoErr(t, err)
	c := file.Components[0]
	if len(c.Variants) != 2 {
		t.Fatalf("want 2 variants, got %d: %+v", len(c.Variants), c.Variants)
	}
	assertVariant(t, c.Variants[0], "checked", true)
	assertVariant(t, c.Variants[1], "readonly", true)
}
