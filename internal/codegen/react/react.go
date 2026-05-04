package react

import (
	"fmt"
	"strings"

	"capsule-css/internal/parser"
)

type Format int

const (
	TypeScript Format = iota
	JavaScript
)

// Generate produces a TypeScript React module from a FileDef.
func Generate(file *parser.FileDef) string {
	return generate(file, TypeScript)
}

// GenerateJS produces a plain JavaScript ES module, omitting TypeScript interfaces.
func GenerateJS(file *parser.FileDef) string {
	return generate(file, JavaScript)
}

func generate(file *parser.FileDef, format Format) string {
	var b strings.Builder

	b.WriteString(`import * as React from "react";` + "\n")

	for _, comp := range file.Components {
		b.WriteByte('\n')
		writeComponent(&b, comp, format)
	}

	return b.String()
}

func writeComponent(b *strings.Builder, comp parser.ComponentDef, format Format) {
	propsType := comp.Name + "Props"
	tag := comp.Tag
	if tag == "" {
		tag = "div"
	}

	if format == TypeScript {
		b.WriteString(propsTypeAlias(propsType, tag, comp.Variants))
		b.WriteByte('\n')
	}

	params := buildParams(comp.Variants)

	// Inner forwardRef render function. The polymorphic type is preserved by
	// casting the forwardRef result to a hand-written generic call signature
	// below — TypeScript cannot infer through forwardRef on its own.
	if format == TypeScript {
		b.WriteString(fmt.Sprintf(
			"export const %s = React.forwardRef(function %s({ %s }: %s<any>, ref: any) {\n",
			comp.Name, comp.Name, params, propsType,
		))
	} else {
		b.WriteString(fmt.Sprintf(
			"export const %s = React.forwardRef(function %s({ %s }, ref) {\n",
			comp.Name, comp.Name, params,
		))
	}

	b.WriteString(fmt.Sprintf("  const Tag = as ?? %q;\n", tag))
	b.WriteString(fmt.Sprintf("  const cls = [%q, className].filter(Boolean).join(\" \");\n", comp.Name))

	var dataAttrs strings.Builder
	for _, v := range comp.Variants {
		if v.Boolean && len(v.Values) > 0 {
			dataAttrs.WriteString(fmt.Sprintf(
				", ...(%s !== undefined && %s !== false && { \"data-%s\": %s === true ? \"\" : %s })",
				v.Name, v.Name, v.Name, v.Name, v.Name,
			))
		} else if v.Boolean {
			dataAttrs.WriteString(fmt.Sprintf(", ...(%s && { \"data-%s\": \"\" })", v.Name, v.Name))
		} else {
			dataAttrs.WriteString(fmt.Sprintf(", ...(%s !== undefined && { \"data-%s\": %s })", v.Name, v.Name, v.Name))
		}
	}

	b.WriteString(fmt.Sprintf(
		"  return React.createElement(Tag, { ...rest, ref, className: cls%s });\n",
		dataAttrs.String(),
	))
	b.WriteString("})")

	if format == TypeScript {
		// Cast to the polymorphic signature with ref typed via ComponentPropsWithRef.
		b.WriteString(fmt.Sprintf(
			" as <T extends React.ElementType = %q>(props: %s<T> & { ref?: React.ComponentPropsWithRef<T>[\"ref\"] }) => React.ReactElement | null",
			tag, propsType,
		))
	}
	b.WriteString(";\n")
}

// propsTypeAlias emits a polymorphic type alias for the component props.
//
//	export type ButtonProps<T extends React.ElementType = "a"> = {
//	  as?: T;
//	  intent?: "primary" | "outline";
//	} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent">;
func propsTypeAlias(propsType, tag string, variants []parser.VariantDef) string {
	var b strings.Builder
	b.WriteString(fmt.Sprintf(
		"export type %s<T extends React.ElementType = %q> = {\n",
		propsType, tag,
	))
	b.WriteString("  as?: T;\n")
	for _, v := range variants {
		b.WriteString(fmt.Sprintf("  %s?: %s;\n", v.Name, variantType(v)))
	}
	b.WriteString("} & Omit<React.ComponentPropsWithoutRef<T>, ")
	omitKeys := []string{"\"as\""}
	for _, v := range variants {
		omitKeys = append(omitKeys, fmt.Sprintf("%q", v.Name))
	}
	b.WriteString(strings.Join(omitKeys, " | "))
	b.WriteString(">;\n")
	return b.String()
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

func buildParams(variants []parser.VariantDef) string {
	parts := []string{"as"}
	for _, v := range variants {
		parts = append(parts, v.Name)
	}
	parts = append(parts, `className = ""`, "...rest")
	return strings.Join(parts, ", ")
}
