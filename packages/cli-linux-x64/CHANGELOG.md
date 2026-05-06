# @capsule-css/cli-linux-x64

## 0.1.2

### Patch Changes

- [`f41c5c8`](https://github.com/capsule-css/capsule-css/commit/f41c5c8f1bf20a0506ce61bb553c925e95abae26) Thanks [@MarcoPal](https://github.com/MarcoPal)! - Harden the parser and Vite dev server in preparation for the 1.0 launch.

  - **Vite dev middleware: prevent path traversal.** The middleware that serves
    `.capsule.css` files now resolves requests against the project root and
    rejects URLs that would escape it. Previously a request such as
    `GET /../../etc/passwd.capsule.css` could reach `readFileSync` with a
    CWD-relative path. Extracted the safe-resolution logic into the exported
    `safeResolveCapsulePath` helper so it can be unit-tested directly.

  - **`stripTagDirectives` now respects strings and comments.** The previous
    regex-based implementation would also strip `@tag` text appearing inside
    CSS string literals (e.g. `content: "@tag a;"`) or inside `/* … */`
    comments. The new implementation skips both transparently.

  - **Parser: validate `@tag` position and uniqueness.** `@tag` must appear at
    the top level of a `@scope` block, before any `:scope` rule, and may
    appear at most once per component. Misuse now produces a parse error with
    line/column information instead of being silently accepted. `@tag`
    occurrences inside CSS strings, comments, and nested rules are
    transparently ignored.

  - **Tests.** Added vitest setup to `@capsule-css/vite` covering both
    `stripTagDirectives` and `safeResolveCapsulePath`. Added golden-file
    snapshot tests for the React and vanilla code generators against the
    shared fixtures in `testdata/`.

  - **CI.** New `ci.yml` workflow runs `go test -race` and the TypeScript
    build + vitest suite on every pull request and push to `main`. The
    existing `release.yml` and `deploy-site.yml` keep their roles.

## 0.1.1

### Patch Changes

- [`eb6f3a4`](https://github.com/capsule-css/capsule-css/commit/eb6f3a49b53001019564e102238b26e57f880a89) Thanks [@MarcoPal](https://github.com/MarcoPal)! - updated packages README

## 0.1.0

### Patch Changes

- [`c8b7c57`](https://github.com/capsule-css/capsule-css/commit/c8b7c5793007e46ee0540c6c6f64861a9a638856) Thanks [@MarcoPal](https://github.com/MarcoPal)! - initial alpha release
