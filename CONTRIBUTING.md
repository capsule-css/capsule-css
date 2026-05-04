# Contributing to capsule-css

Thanks for considering a contribution. This guide focuses on the two most
impactful ways to extend capsule-css:

1. **Building a plugin for a new bundler** (Webpack, Rollup, esbuild, Rspack,
   Parcel, Turbopack, Bun, …)
2. **Adding a new framework target** (Vue, Svelte, Solid, Angular, Qwik,
   Astro, Lit, …)

Both extensions plug into the same compiler core (the Go binary +
`@capsule-css/core`) — you don't need to touch the parser or the existing
codegens.

---

## Architecture in 30 seconds

```
┌────────────────────┐    invokes via execFile    ┌────────────────────┐
│  Bundler plugin    │ ─────────────────────────► │  capsule-css (Go)  │
│  (Vite / Webpack…) │                            │  parser + codegen  │
└────────────────────┘ ◄───────────────────────── └────────────────────┘
         │              JS module + CSS                │
         │                                             │
         ▼                                             ▼
   Dev/build pipeline                          .capsule.css source
```

- **Compiler (Go)** — pure text-in / text-out. Reads a `.capsule.css` file,
  emits a JS module + (optionally) a `.d.ts`. No filesystem assumptions
  beyond the input file. Lives in [`cmd/capsule`](cmd/capsule/),
  [`internal/parser`](internal/parser/), [`internal/codegen`](internal/codegen/).
- **`@capsule-css/core`** — thin Node wrapper that shells out to the binary
  and resolves the right native binary for the current platform. See
  [`packages/core/src/index.ts`](packages/core/src/index.ts).
- **Bundler plugins** — wrap `core` to integrate with a specific dev/build
  pipeline. The reference implementation is
  [`packages/vite`](packages/vite/src/index.ts).

---

## Part 1 — Building a plugin for a new bundler

A bundler plugin's job is to make `import { Button } from "./button.capsule.css"`
work end-to-end. That means transforming the import into a JS module, serving
the CSS to the browser, and producing the right artifacts in build mode.

### Required behavior

A correct plugin MUST do all of these. The Vite plugin is the spec; check
[`packages/vite/src/index.ts`](packages/vite/src/index.ts) when in doubt.

#### 1. Intercept `.capsule.css` imports

Any module specifier ending in `.capsule.css` (relative, absolute, or aliased)
must be routed to your plugin instead of the bundler's default CSS loader.
**Do not let the file go through the CSS pipeline** — the file is JS-shaped
output, not a stylesheet to inject as-is.

The Vite plugin uses a virtual module id (`\0capsule-css:<abs-path>.js`) so
Vite treats it as JS. Other bundlers have their own virtual module mechanisms
(Webpack: virtual loader + `pitch` hook; Rollup: `resolveId`/`load` hooks;
esbuild: `onResolve`/`onLoad` plugin hooks).

#### 2. Compile `.capsule.css` → JS

Call `compile()` from `@capsule-css/core`:

```ts
import { compile } from "@capsule-css/core";

const { js, css } = compile(absolutePath, {
  target: "react",  // or "vanilla", or any future target
  format: "ts",     // "ts" for projects with TS support, "js" otherwise
});
```

Return the `js` string as the module body. **Do not bundle the CSS into the
JS output** — CSS goes through a separate pipeline (steps 4 & 5).

#### 3. Generate and aggregate `.d.ts`

Call `compileTypes()` per file and merge results into a single
`capsule.d.ts` at the project root, with one `declare module` block per
source file using a wildcard pattern (`*/<basename>`):

```ts
import { compileTypes } from "@capsule-css/core";

const dts = compileTypes(absolutePath, { target: "react" });
const block = `declare module "*/${basename(absolutePath)}" {\n${indent(dts)}\n}\n`;
// ... write all blocks to <projectRoot>/capsule.d.ts
```

The wildcard pattern lets users import from any path (`./button.capsule.css`,
`../components/button.capsule.css`, etc.) without per-path declarations.

The `.d.ts` must be regenerated whenever the **structure** changes (new
component, new variant, new tag). For pure style changes you can skip the
rewrite to avoid editor TS server churn.

#### 4. Strip `@tag` from CSS output

`@tag` is a capsule-css-only directive. Even though browsers ignore unknown
at-rules per spec, it must not appear in the production stylesheet. Use the
helper pattern from the Vite plugin:

```ts
function stripTagDirectives(css: string): string {
  return css.replace(/[ \t]*@tag\s+[a-z][a-z0-9-]*\s*;\n?/g, "");
}
```

#### 5. CSS handling — dev vs build

**Dev mode**: inject the CSS at runtime via a `<style data-tss="<file-id>">`
element appended to `<head>`. The injection code goes inside the JS module
body so the style mounts when the component module is imported. See the
`load` hook in the Vite plugin for the exact template.

**Build mode**: collect every `.capsule.css`'s CSS into a single
`capsule.css` asset. Optionally run it through the host project's PostCSS
config (autoprefixer, cssnano, etc.). Inject a `<link rel="stylesheet">` tag
into the generated `index.html`.

#### 6. HMR — two semantics

Hot module reload must distinguish two cases:

- **CSS-only change** (e.g. user tweaked a color): the `.d.ts` is byte-identical
  before and after. Swap the existing `<style>` tag's content in place via a
  custom WebSocket event. Do NOT remount React components — that loses state.
  But DO invalidate the module in the bundler's graph so a fresh page load
  also gets the updated CSS.

- **Structural change** (variant added, tag changed, component renamed): the
  `.d.ts` differs. Invalidate the module and let the bundler perform a normal
  module reload. Components will rebuild from the new generated code.

Reference: `handleHotUpdate` in
[`packages/vite/src/index.ts`](packages/vite/src/index.ts).

#### 7. Serve raw `.capsule.css` for dev tooling (optional but recommended)

Some debugging tools and source-map workflows need to fetch the original
`.capsule.css` over HTTP. Add a dev middleware that returns the raw file with
`Content-Type: text/css` for `.capsule.css` requests.

### Optional behavior

- **Asset hashing in build mode**: emit `capsule.[hash].css` and update
  the injected `<link>` accordingly. Most bundlers do this automatically if
  you use the right asset-emission API.
- **Source maps**: not currently supported by the compiler, but plugins can
  forward the input file path so PostCSS-generated maps point at the original
  `.capsule.css`.
- **Multi-page apps**: the `capsule.css` asset should be linked into all
  generated HTML entry points, not just `index.html`.

### Plugin skeleton (pseudocode)

This works for any bundler with the standard hooks:

```ts
import { compile, compileTypes } from "@capsule-css/core";

export function capsule(options = {}) {
  const dtsRegistry = new Map<string, string>();

  return {
    name: "capsule-css",

    resolveId(id, importer) {
      if (!id.endsWith(".capsule.css")) return null;
      const abs = resolve(dirname(importer ?? cwd()), id);
      return toVirtualId(abs);  // bundler-specific
    },

    load(id) {
      const file = fromVirtualId(id);
      if (!file) return null;

      const { js, css } = compile(file, options);
      dtsRegistry.set(file, compileTypes(file, options));
      writeAggregatedDts(dtsRegistry, projectRoot);

      if (isBuild) {
        cssAssets.set(file, stripTagDirectives(css));
        return js;
      }

      // dev: inject CSS at runtime
      return cssInjectionPreamble(file, css) + js;
    },

    generateBundle() {
      // build only: emit single capsule.css
      const combined = [...cssAssets.values()].join("\n");
      this.emitFile({ type: "asset", name: "capsule.css", source: combined });
    },

    transformIndexHtml() {
      // build only: inject <link rel="stylesheet" href="...capsule.css">
    },

    handleHotUpdate({ file, server }) {
      if (!file.endsWith(".capsule.css")) return;
      const newDts = compileTypes(file, options);
      const oldDts = dtsRegistry.get(file);
      dtsRegistry.set(file, newDts);
      writeAggregatedDts(dtsRegistry, projectRoot);

      const mod = server.moduleGraph.getModuleById(toVirtualId(file));
      if (mod) server.moduleGraph.invalidateModule(mod);

      if (oldDts === newDts) {
        // CSS-only: hot-swap the style tag without remounting
        const { css } = compile(file, options);
        server.ws.send({ type: "custom", event: "capsule-css:css-update",
          data: { id: file, css } });
        return mod ? [mod] : [];
      }

      // Structural: full module reload
      return mod ? [mod] : [];
    },
  };
}
```

### Where to put your plugin

For first-party plugins, send a PR adding `packages/<bundler>/` with the same
structure as `packages/vite/`. For third-party plugins, publish under your
own scope and we'll link it from the README and docs.

### Testing checklist

Run the [`playground/react`](playground/react/) and
[`playground/vanilla`](playground/vanilla/) sample apps through your plugin.
A correct implementation should:

- [ ] Import `.capsule.css` → component renders with correct class and `data-*` attributes
- [ ] Edit a CSS color → change appears without page reload, React state preserved
- [ ] Add a new `:scope[data-foo]` variant → page reloads and TS picks up the new prop
- [ ] Run a production build → single `capsule.css` asset emitted, `<link>` injected, no `.capsule.css` files in output
- [ ] `@tag` not present in built CSS

---

## Part 2 — Adding a new framework target

Targets live in [`internal/codegen/<framework>/`](internal/codegen/) and are
written in Go. The parser and the directive layer (`@scope`, `@tag`, variants)
are shared — you only emit the framework-specific module.

### Required behavior

A correct target MUST honor these conventions, which together make
capsule-css components interoperable across frameworks:

1. **Class name** — the rendered element MUST have `class="ComponentName"`
   (PascalCase, exact match of the `@scope (.Name)` declaration). Other
   classes from the user's own `className` prop/option are concatenated, not
   replaced.

2. **Variant attributes** — for each `:scope[data-X="value"]` selector, set
   `data-X="value"` on the element when the user passes the matching prop.
   For `:scope[data-X]` (no value), set `data-X=""` when the prop is truthy.
   For mixed (both forms exist for the same name), accept `boolean | "value1"
   | …`: `true` sets `data-X=""`, a string sets `data-X="value"`, `false` /
   `undefined` omits the attribute entirely.

3. **`@tag` default** — components default to `<div>` if `@tag` is missing.
   The HTML element must match `@tag` (or `div`) at render time.

4. **Polymorphic `as` prop** — components SHOULD accept an `as`
   prop/option that overrides `@tag` per instance. Type inference is
   framework-specific (see existing targets for patterns).

5. **Conditional spreading** — variant `data-*` attributes MUST use
   conditional spreading so undefined values don't clobber any attribute the
   user passes through the framework's prop spread (`...rest`). Anti-pattern:

   ```js
   // ❌ wrong — overrides user's data-intent even when intent is undefined
   {{ ...rest, "data-intent": intent }}
   ```

   Correct:

   ```js
   // ✅ right
   {{ ...rest, ...(intent !== undefined && { "data-intent": intent }) }}
   ```

6. **Named exports only** — one `export function ComponentName` per `@scope`
   block. No default exports. Multiple components in one file → multiple
   exports from one module.

7. **No runtime CSS injection from the component** — the bundler plugin
   handles CSS delivery. The component module only sets attributes.

### Required functions per target package

Following the React/vanilla convention:

```go
package myframework

import "capsule-css/internal/parser"

// Generate produces the full component module (TS or framework-native).
func Generate(file *parser.FileDef) string { ... }

// GenerateJS produces a JavaScript-only variant if the target supports both.
// Optional — only if your framework distinguishes (React does, Vue's SFC doesn't).
func GenerateJS(file *parser.FileDef) string { ... }

// GenerateDTS produces a .d.ts declaration file. Required if target consumers
// will use TypeScript.
func GenerateDTS(file *parser.FileDef) string { ... }
```

### Wiring the target into the CLI

Add your target to the switch in
[`cmd/capsule/main.go`](cmd/capsule/main.go):

```go
case "myframework":
    if format == "js" {
        fmt.Print(myframework.GenerateJS(fileDef))
    } else {
        fmt.Print(myframework.Generate(fileDef))
    }
```

And to the `types` switch:

```go
case "myframework":
    fmt.Print(myframework.GenerateDTS(fileDef))
```

### Tests

Mirror the structure in
[`internal/codegen/react/react_test.go`](internal/codegen/react/react_test.go).
At minimum:

- Basic component with valued variants
- Default `@tag` behavior (missing `@tag` → `div`)
- Boolean variants
- Mixed variants
- Multiple components in one file
- `.d.ts` declarations for all of the above
- `as` polymorphic typing (if your framework supports it)
- Conditional-spread regression test

### Docs

Add a section to [`docs/spec.md`](docs/spec.md) under "Generated output"
showing what your target emits, and update the README/site to list the new
framework on the supported list.

---

## Conventions for both kinds of contributions

### `.capsule.css` is the canonical extension

Don't introduce alternative extensions, file naming schemes, or in-source
configuration. The whole pitch is "write standard CSS in a `.capsule.css` file
and you're done." Anything that breaks that promise needs a strong reason.

### Don't fork the parser

If you find a parsing limitation (e.g. a CSS feature that doesn't survive the
scanner), open an issue and fix it in the shared parser. Do not parse CSS in
your bundler plugin or in your codegen target — the parser is the single
source of truth.

### Don't add bundler-specific behavior to the compiler

The Go compiler is text-in / text-out and platform-agnostic. Bundler concerns
(virtual modules, HMR events, asset emission) live in the plugin layer.

### Match the existing API surface

Plugins should default to zero config: `capsule()` with no arguments must
work in a fresh project. If you add options, document the defaults and keep
them minimal.

### Tests are required for compiler changes

Anything in `internal/parser` or `internal/codegen` needs a test. Plugin
changes are reviewed against the playground apps; if you change behavior,
update or add a playground sample.

---

## Project layout reference

```
capsule-css/
├── cmd/capsule/        # CLI entrypoint (Go)
├── internal/
│   ├── parser/             # @scope / @tag / variant scanner + AST
│   └── codegen/
│       ├── react/          # React target (TSX + .d.ts)
│       └── vanilla/        # Vanilla JS target (DOM + .d.ts)
├── packages/
│   ├── core/               # Node wrapper around the Go binary
│   ├── vite/               # Vite plugin (reference impl)
│   └── cli-<platform>/     # Prebuilt binaries published to npm
├── playground/
│   ├── react/              # React sample app
│   └── vanilla/            # Vanilla sample app
├── site/                   # Documentation site (built with capsule-css)
├── docs/                   # Spec and agent docs
└── testdata/               # Fixture .capsule.css files for tests
```

---

## Getting your dev environment ready

```bash
# Compiler
go build -o capsule ./cmd/capsule
go test ./...

# Node packages (pnpm 9+)
pnpm install
pnpm --filter @capsule-css/core build
pnpm --filter @capsule-css/vite build

# Run the playground
pnpm --filter playground-react dev
```

When iterating on the compiler, rebuild and copy the binary into the
platform sub-package so the workspace picks it up:

```bash
go build -o packages/cli-darwin-arm64/bin/capsule ./cmd/capsule
```

(Replace the platform suffix for your machine.)

---

## Questions, ideas, RFCs

Open a GitHub discussion before starting any non-trivial work — especially
new directives in the CSS layer, changes to `@scope` semantics, or any
convention listed under "Required behavior" above. Those affect every plugin
and every target, and we want to keep the surface area small.
