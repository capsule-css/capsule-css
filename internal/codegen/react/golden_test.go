package react

import (
	"flag"
	"os"
	"path/filepath"
	"testing"

	"capsule-css/internal/parser"
)

// Golden file tests for the React code generator.
//
// Each fixture in /testdata is parsed once and we assert that the
// JS/TS/.d.ts output matches the byte-for-byte snapshot in this package's
// testdata/ directory. To regenerate the snapshots after an intentional
// codegen change, run:
//
//	go test ./internal/codegen/react/... -update
//
// These tests catch formatting drift that the assertContains tests cannot.
var update = flag.Bool("update", false, "rewrite golden files instead of asserting")

type goldenCase struct {
	name    string
	fixture string
}

var reactCases = []goldenCase{
	{"button", "button.capsule.css"},
	{"accordion", "accordion.capsule.css"},
}

func loadFixture(t *testing.T, name string) *parser.FileDef {
	t.Helper()
	path := filepath.Join("..", "..", "..", "testdata", name)
	src, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read fixture %s: %v", path, err)
	}
	file, err := parser.Parse(src)
	if err != nil {
		t.Fatalf("parse %s: %v", path, err)
	}
	return file
}

func assertGolden(t *testing.T, goldenName, got string) {
	t.Helper()
	goldenPath := filepath.Join("testdata", goldenName)
	if *update {
		if err := os.MkdirAll(filepath.Dir(goldenPath), 0o755); err != nil {
			t.Fatalf("mkdir: %v", err)
		}
		if err := os.WriteFile(goldenPath, []byte(got), 0o644); err != nil {
			t.Fatalf("write golden %s: %v", goldenPath, err)
		}
		return
	}
	want, err := os.ReadFile(goldenPath)
	if err != nil {
		t.Fatalf("read golden %s: %v\n(re-run with `go test ./... -update` to create it)", goldenPath, err)
	}
	if string(want) != got {
		t.Errorf("output drift for %s\n--- want\n%s\n--- got\n%s", goldenName, want, got)
	}
}

func TestReactGoldenTS(t *testing.T) {
	for _, c := range reactCases {
		t.Run(c.name, func(t *testing.T) {
			file := loadFixture(t, c.fixture)
			assertGolden(t, c.name+".tsx", Generate(file))
		})
	}
}

func TestReactGoldenJS(t *testing.T) {
	for _, c := range reactCases {
		t.Run(c.name, func(t *testing.T) {
			file := loadFixture(t, c.fixture)
			assertGolden(t, c.name+".jsx", GenerateJS(file))
		})
	}
}

func TestReactGoldenDTS(t *testing.T) {
	for _, c := range reactCases {
		t.Run(c.name, func(t *testing.T) {
			file := loadFixture(t, c.fixture)
			assertGolden(t, c.name+".d.ts", GenerateDTS(file))
		})
	}
}
