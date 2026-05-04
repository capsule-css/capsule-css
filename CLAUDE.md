# capsule-css — Claude Code context

## What this repo is

capsule-css is a CSS-first typed component generator. It reads `.capsule.css` files — plain CSS using the native `@scope` at-rule plus a single custom directive `@tag` — and emits typed component modules for React and vanilla JS. No runtime, no DSL.

## Repo structure

```
cmd/capsule/          # Go CLI entrypoint (build → compile/types subcommands)
internal/
  parser/             # .capsule.css parser (Go)
  codegen/react/      # React JS + .d.ts generator
  codegen/vanilla/    # Vanilla JS + .d.ts generator
packages/
  core/               # Node wrapper that shells out to the Go binary
  vite/               # Vite plugin (resolveId / load / HMR / CSS extraction)
  cli-*/              # Platform-specific binary packages (npm optionalDependencies)
playground/react/     # Minimal React playground
playground/vanilla/   # Minimal vanilla JS playground
site/                 # Documentation + Starter generator (React, multi-entry Vite)
  src/components/     # UI built with .capsule.css files
  src/content/        # Code examples shown in docs
docs/
  spec.md             # Language specification
  agents.md           # AI agent reference
testdata/             # Fixture .capsule.css files for Go tests
```

## Build

### Go binary (required for all dev work)

```bash
# Local dev binary (used by Vite plugin when @capsule-css/cli-* not installed)
go build -o capsule ./cmd/capsule

# Platform binary for npm distribution
go build -o packages/cli-darwin-arm64/bin/capsule ./cmd/capsule

# Run Go tests
go test ./...
```

### TypeScript packages

```bash
pnpm --filter @capsule-css/core build
pnpm --filter @capsule-css/vite build
```

### Site / dev server

```bash
# From repo root — requires ./capsule binary to exist
cd site && pnpm dev
# or
pnpm --filter site dev
```

## Key concepts

### `.capsule.css` format

Each `@scope (.ComponentName)` block becomes a named export. The `@tag` directive sets the HTML element (default: `div`). Everything else is standard CSS.

```css
@scope (.Button) {
  @tag a;                         /* sets rendered element */

  :scope { display: inline-flex; }

  :scope[data-intent="primary"] { background: #0066ff; } /* valued variant */
  :scope[data-disabled]         { opacity: 0.4; }        /* boolean variant */
}
```

### Variants

- `[data-foo="bar"]` → valued variant → `foo?: "bar" | ...`
- `[data-foo]` → boolean variant → `foo?: boolean`
- Mixed (both present) → `foo?: "bar" | true`

### Generated output

The Vite plugin intercepts `*.capsule.css` imports via a virtual module (`\0capsule-css:<path>.js`). In dev it injects styles via a `<style data-cap>` tag. In build it collects all CSS into a single `capsule.css` asset and injects a `<link>` into HTML.

Type declarations are written to `capsule.d.ts` at the project root on every compile.

## Important gotchas

- **`./capsule` binary must exist** in the repo root for the Vite plugin to work in dev. It looks for it via `process.cwd() + "/capsule"` before falling back to `@capsule-css/cli-*` packages.
- **`capsule.d.ts` is generated** at runtime by the Vite plugin — it's in `.gitignore`, don't commit it.
- **`@tag` must come before `:scope`** inside a `@scope` block.
- **Variant attribute names must be lowercase kebab-case**: `data-my-variant`.
- The site is a multi-entry Vite build: `index.html`, `docs.html`, `starter.html`.
