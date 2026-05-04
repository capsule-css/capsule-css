import { describe, expect, it } from "vitest";
import { stripTagDirectives } from "../src/index.ts";

describe("stripTagDirectives", () => {
  it("removes a top-level @tag directive", () => {
    const css = `@scope (.Button) {\n  @tag button;\n  :scope { padding: 8px; }\n}\n`;
    const out = stripTagDirectives(css);
    expect(out).not.toContain("@tag");
    expect(out).toContain(":scope { padding: 8px; }");
  });

  it("removes leading indentation but preserves structure", () => {
    const css = `@scope (.X) {\n    @tag a;\n    :scope { color: red; }\n}\n`;
    const out = stripTagDirectives(css);
    const lines = out.split("\n");
    expect(lines.some((l) => l.includes("@tag"))).toBe(false);
    expect(lines.some((l) => l.includes(":scope { color: red; }"))).toBe(true);
  });

  it("does NOT strip @tag inside a /* comment */", () => {
    const css = `@scope (.X) {\n  /* @tag a; */\n  :scope { color: red; }\n}\n`;
    const out = stripTagDirectives(css);
    expect(out).toContain("/* @tag a; */");
  });

  it('does NOT strip @tag inside a "string" literal', () => {
    const css = `@scope (.X) {\n  :scope { content: "@tag a;"; color: red; }\n}\n`;
    const out = stripTagDirectives(css);
    expect(out).toContain('"@tag a;"');
  });

  it("does NOT strip @tag inside a 'string' literal", () => {
    const css = `@scope (.X) {\n  :scope { content: '@tag a;'; }\n}\n`;
    const out = stripTagDirectives(css);
    expect(out).toContain("'@tag a;'");
  });

  it("removes multiple @tag directives across components", () => {
    const css = `@scope (.A) { @tag a; :scope {} }\n@scope (.B) { @tag b; :scope {} }`;
    const out = stripTagDirectives(css);
    expect(out).not.toContain("@tag");
    expect(out).toContain("@scope (.A)");
    expect(out).toContain("@scope (.B)");
  });

  it("leaves CSS without @tag unchanged", () => {
    const css = `@scope (.X) { :scope { color: red; } }`;
    expect(stripTagDirectives(css)).toBe(css);
  });

  it("handles escaped quotes inside string literals", () => {
    const css = `@scope (.X) { :scope { content: "he said \\"@tag a;\\""; } }`;
    const out = stripTagDirectives(css);
    expect(out).toContain('\\"@tag a;\\"');
  });
});
