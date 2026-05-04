package vanilla

import (
	"fmt"
	"strings"

	"capsule-css/internal/parser"
)

// Generate produces a plain JS ES module (no React, no TypeScript) from a FileDef.
func Generate(file *parser.FileDef) string {
	var b strings.Builder

	for i, comp := range file.Components {
		if i > 0 {
			b.WriteByte('\n')
		}
		writeComponent(&b, comp)
	}

	return b.String()
}

func writeComponent(b *strings.Builder, comp parser.ComponentDef) {
	params := buildParams(comp.Variants)
	tag := comp.Tag
	if tag == "" {
		tag = "div"
	}

	b.WriteString(fmt.Sprintf("export function %s({ %s } = {}) {\n", comp.Name, params))
	b.WriteString(fmt.Sprintf("  const el = document.createElement(as ?? %q);\n", tag))
	b.WriteString(fmt.Sprintf("  el.className = [%q, className].filter(Boolean).join(\" \");\n", comp.Name))

	for _, v := range comp.Variants {
		if v.Boolean && len(v.Values) > 0 {
			b.WriteString(fmt.Sprintf(
				"  if (%s !== undefined && %s !== false) el.dataset.%s = %s === true ? \"\" : String(%s);\n",
				v.Name, v.Name, v.Name, v.Name, v.Name,
			))
		} else if v.Boolean {
			b.WriteString(fmt.Sprintf("  if (%s) el.dataset.%s = \"\";\n", v.Name, v.Name))
		} else {
			b.WriteString(fmt.Sprintf("  if (%s !== undefined) el.dataset.%s = %s;\n", v.Name, v.Name, v.Name))
		}
	}

	b.WriteString("  if (children !== undefined) {\n")
	b.WriteString("    if (typeof children === \"string\") el.textContent = children;\n")
	b.WriteString("    else if (children instanceof Node) el.appendChild(children);\n")
	b.WriteString("  }\n")
	b.WriteString("  return el;\n")
	b.WriteString("}\n")
}

func buildParams(variants []parser.VariantDef) string {
	parts := []string{"as"}
	for _, v := range variants {
		parts = append(parts, v.Name)
	}
	parts = append(parts, `className = ""`, "children")
	return strings.Join(parts, ", ")
}
