package vanilla

import (
	"fmt"
	"strings"

	"capsule-css/internal/parser"
)

// GenerateDTS produces a .d.ts declaration file for vanilla JS — no React types.
//
// Components are polymorphic via the `as` option, with the return type inferred
// through TypeScript's built-in HTMLElementTagNameMap. Example:
//
//	export interface ButtonOptions<T extends keyof HTMLElementTagNameMap = "button"> {
//	  as?: T;
//	  intent?: "primary" | "secondary";
//	  className?: string;
//	  children?: string | Node;
//	}
//
//	export function Button<T extends keyof HTMLElementTagNameMap = "button">(
//	  options?: ButtonOptions<T>
//	): HTMLElementTagNameMap[T];
func GenerateDTS(file *parser.FileDef) string {
	var b strings.Builder

	for i, comp := range file.Components {
		if i > 0 {
			b.WriteByte('\n')
		}
		writeDTSComponent(&b, comp)
	}

	return b.String()
}

func writeDTSComponent(b *strings.Builder, comp parser.ComponentDef) {
	optsType := comp.Name + "Options"
	tag := comp.Tag
	if tag == "" {
		tag = "div"
	}

	b.WriteString(fmt.Sprintf(
		"export interface %s<T extends keyof HTMLElementTagNameMap = %q> {\n",
		optsType, tag,
	))
	b.WriteString("  as?: T;\n")
	for _, v := range comp.Variants {
		b.WriteString(fmt.Sprintf("  %s?: %s;\n", v.Name, variantType(v)))
	}
	b.WriteString("  className?: string;\n")
	b.WriteString("  children?: string | Node;\n")
	b.WriteString("}\n")

	b.WriteString(fmt.Sprintf(
		"export function %s<T extends keyof HTMLElementTagNameMap = %q>(options?: %s<T>): HTMLElementTagNameMap[T];\n",
		comp.Name, tag, optsType,
	))
}

func variantType(v parser.VariantDef) string {
	parts := []string{}
	if v.Boolean {
		parts = append(parts, "boolean")
	}
	for _, val := range v.Values {
		parts = append(parts, fmt.Sprintf("%q", val))
	}
	return strings.Join(parts, " | ")
}
