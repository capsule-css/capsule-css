import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { safeResolveCapsulePath } from "../src/index.ts";

const ROOT = "/var/project";

describe("safeResolveCapsulePath", () => {
  it("resolves a normal request to an absolute path inside root", () => {
    const out = safeResolveCapsulePath(ROOT, "/src/Button.capsule.css");
    expect(out).toBe(resolve(ROOT, "src/Button.capsule.css"));
  });

  it("rejects requests with .. that escape the root", () => {
    expect(safeResolveCapsulePath(ROOT, "/../etc/passwd.capsule.css")).toBeNull();
    expect(safeResolveCapsulePath(ROOT, "/../../etc/passwd.capsule.css")).toBeNull();
    expect(
      safeResolveCapsulePath(ROOT, "/foo/../../../etc/passwd.capsule.css"),
    ).toBeNull();
  });

  it("rejects URLs that do not end in .capsule.css", () => {
    expect(safeResolveCapsulePath(ROOT, "/src/index.html")).toBeNull();
    expect(safeResolveCapsulePath(ROOT, "/")).toBeNull();
    expect(safeResolveCapsulePath(ROOT, "")).toBeNull();
  });

  it("strips query strings and fragments before checking the extension", () => {
    expect(
      safeResolveCapsulePath(ROOT, "/src/Button.capsule.css?t=1"),
    ).toBe(resolve(ROOT, "src/Button.capsule.css"));
    expect(
      safeResolveCapsulePath(ROOT, "/src/Button.capsule.css#x"),
    ).toBe(resolve(ROOT, "src/Button.capsule.css"));
  });

  it("rejects a query-string smuggled traversal", () => {
    // Even with a fake fragment trying to satisfy the .capsule.css suffix
    // check, the path itself is normalised first.
    expect(
      safeResolveCapsulePath(ROOT, "/../escape.capsule.css"),
    ).toBeNull();
  });

  it("rejects empty path resolution", () => {
    // Resolving "" against root would yield root itself — reject.
    expect(safeResolveCapsulePath(ROOT, "/.capsule.css")).not.toBeNull();
    expect(safeResolveCapsulePath(ROOT, "/")).toBeNull();
  });
});
