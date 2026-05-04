import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

export type Target = "react" | "vanilla";
export type Format = "ts" | "js";

export interface CompileOptions {
  target?: Target;
  format?: Format;
  /**
   * Override the path to the capsule-css binary. By default, the binary is
   * resolved from the platform-specific package (`@capsule-css/cli-<platform>-<arch>`)
   * installed automatically via optionalDependencies.
   */
  binaryPath?: string;
}

export interface CompileResult {
  js: string;
  css: string;
}

const require = createRequire(import.meta.url);

const SUPPORTED = new Set([
  "darwin-arm64",
  "darwin-x64",
  "linux-x64",
  "linux-arm64",
  "win32-x64",
]);

let cachedBinary: string | null = null;

function resolveBinary(override?: string): string {
  if (override) return override;
  if (cachedBinary) return cachedBinary;

  const key = `${process.platform}-${process.arch}`;
  if (!SUPPORTED.has(key)) {
    throw new Error(
      `capsule-css: no prebuilt binary for ${key}.\n` +
      `Supported platforms: ${[...SUPPORTED].join(", ")}.\n` +
      `You can build from source and pass binaryPath to the plugin options.`
    );
  }

  const exe = process.platform === "win32" ? "capsule.exe" : "capsule";
  const pkg = `@capsule-css/cli-${key}/bin/${exe}`;

  try {
    cachedBinary = require.resolve(pkg);
    return cachedBinary;
  } catch {
    // Workspace fallback: in this monorepo the binary may live at the repo
    // root as ./capsule during compiler development.
    const local = process.cwd() + "/capsule";
    if (existsSync(local)) {
      cachedBinary = local;
      return cachedBinary;
    }
    throw new Error(
      `capsule-css: could not resolve binary for ${key}.\n` +
      `Expected to find ${pkg} (installed via optionalDependencies of @capsule-css/vite).\n` +
      `Try reinstalling dependencies, or pass binaryPath explicitly.`
    );
  }
}

export function compile(tssPath: string, options: CompileOptions = {}): CompileResult {
  const binary = resolveBinary(options.binaryPath);
  const target = options.target ?? "react";
  const format = options.format ?? "ts";

  let js: string;
  try {
    js = execFileSync(binary, ["build", tssPath, "--target", target, "--format", format], {
      encoding: "utf8",
    });
  } catch (err: any) {
    const msg = err.stderr?.toString() ?? err.message;
    throw new Error(`capsule-css: failed to compile ${tssPath}\n${msg}`);
  }

  const css = readFileSync(tssPath, "utf8");

  return { js, css };
}

export function compileTypes(tssPath: string, options: CompileOptions = {}): string {
  const binary = resolveBinary(options.binaryPath);
  const target = options.target ?? "react";

  try {
    return execFileSync(binary, ["types", tssPath, "--target", target], {
      encoding: "utf8",
    });
  } catch (err: any) {
    const msg = err.stderr?.toString() ?? err.message;
    throw new Error(`capsule-css: failed to generate types for ${tssPath}\n${msg}`);
  }
}
