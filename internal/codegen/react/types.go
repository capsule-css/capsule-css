package react

import (
	"fmt"
	"strings"

	"capsule-css/internal/parser"
)

// GenerateDTS produces a .d.ts declaration file for a .capsule.css source.
func GenerateDTS(file *parser.FileDef) string {
	var b strings.Builder

	b.WriteString(`import type * as React from "react";` + "\n")

	for _, comp := range file.Components {
		b.WriteByte('\n')
		writeDTSComponent(&b, comp)
	}

	return b.String()
}

func writeDTSComponent(b *strings.Builder, comp parser.ComponentDef) {
	propsType := comp.Name + "Props"
	tag := comp.Tag
	if tag == "" {
		tag = "div"
	}

	b.WriteString(propsTypeAlias(propsType, tag, comp.Variants))
	b.WriteByte('\n')
	b.WriteString(fmt.Sprintf(
		"export const %s: <T extends React.ElementType = %q>(props: %s<T> & { ref?: React.ComponentPropsWithRef<T>[\"ref\"] }) => React.ReactElement | null;\n",
		comp.Name, tag, propsType,
	))
}
