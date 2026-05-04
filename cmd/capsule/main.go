package main

import (
	"encoding/json"
	"fmt"
	"os"

	"capsule-css/internal/codegen/react"
	"capsule-css/internal/codegen/vanilla"
	"capsule-css/internal/parser"
)

const usage = `usage: capsule <command> <file.tss> [flags]

commands:
  parse   print AST as JSON
  build   generate component module
  types   generate .d.ts declaration file

flags:
  --target  react | vanilla (default: react)
  --format  ts | js (default: ts)
`

func main() {
	if len(os.Args) < 3 {
		fmt.Fprint(os.Stderr, usage)
		os.Exit(1)
	}

	cmd, file := os.Args[1], os.Args[2]

	src, err := os.ReadFile(file)
	if err != nil {
		fatalf("cannot read %s: %v", file, err)
	}

	fileDef, err := parser.Parse(src)
	if err != nil {
		fatalf("%s: %v", file, err)
	}

	switch cmd {
	case "parse":
		enc := json.NewEncoder(os.Stdout)
		enc.SetIndent("", "  ")
		if err := enc.Encode(fileDef); err != nil {
			fatalf("json: %v", err)
		}

	case "build":
		target := flag("--target", "react")
		format := flag("--format", "ts")
		switch target {
		case "react":
			if format == "js" {
				fmt.Print(react.GenerateJS(fileDef))
			} else {
				fmt.Print(react.Generate(fileDef))
			}
		case "vanilla":
			fmt.Print(vanilla.Generate(fileDef))
		default:
			fatalf("unknown target %q", target)
		}

	case "types":
		target := flag("--target", "react")
		switch target {
		case "react":
			fmt.Print(react.GenerateDTS(fileDef))
		case "vanilla":
			fmt.Print(vanilla.GenerateDTS(fileDef))
		default:
			fatalf("unknown target %q", target)
		}

	default:
		fmt.Fprint(os.Stderr, usage)
		os.Exit(1)
	}
}

func flag(name, def string) string {
	for i, arg := range os.Args {
		if arg == name && i+1 < len(os.Args) {
			return os.Args[i+1]
		}
	}
	return def
}

func fatalf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "error: "+format+"\n", args...)
	os.Exit(1)
}
