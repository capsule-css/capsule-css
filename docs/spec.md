# capsule-css — Language Specification v0.1

## Motivation

I have been writing CSS for fifteen years. These days most of it is written by
AI — but when I sit down to review, it becomes harder and harder to hold the
whole picture in my head. That friction is what capsule-css is trying to fix.

**A long tour of the ecosystem.** Over the years I have worked with plain CSS,
LESS, Sass, Bootstrap, Foundation, BEM, then Tailwind (back in v1), CSS
Modules, Emotion, styled-components (with Styled System, which I loved), and
more recently Linaria, Stitches, vanilla-extract, Meta's StyleX, and Panda CSS.
Each one had something I appreciated, but none of them felt complete. Some
require learning an entire new ecosystem. Others haven't kept up with the
broader ecosystem — styled-components, for instance, still lacks full support
for React Server Components. If I were starting a project today I would reach
for CSS Modules or styled-components, because based on my own experience those
are the tools that give me the most control and let me build components quickly.

**The library that stuck.** The idea that stuck with me most was
[nyancss](https://github.com/nyancss/nyancss), a small library with around 500
GitHub stars. It did one clever thing: generate and import components directly
from CSS files — similar in spirit to how CSS Modules exports class name
strings, but at the component level. When it was released, TypeScript wasn't yet
as ubiquitous as it is today, which is probably why it worked well as a proof of
concept but was never evolved further.

**What I didn't want to build.** I had been thinking about this problem for
years. I tried CSS Modules typing tools — they work, but they scatter `.d.ts`
files across the source tree and create noise that makes the repository harder
to navigate. I also didn't want to reinvent CSS itself. I wanted to write
standard CSS, plain and unmodified, with no class-name hashing that makes
production debugging painful and no extra build step that slows everything down.

**capsule-css.** The core idea: generate typed components from CSS files, using
the native `@scope` at-rule to isolate styles to the exported component. The
library adds a small number of custom directives — `@tag` to declare the HTML
element — and parsing is done by a fast Go binary that extracts the component
name and tag. Everything else is left untouched. The same `.capsule.css` file is
valid CSS that you can open in any browser without the library.

We are in an agentic era where code review has become the bottleneck. Simplicity
is the key — and that is the second problem capsule-css is designed to solve.
When the CSS is the source of truth and the component is generated from it,
there is one fewer layer to reason about during review.

---

## Overview

capsule-css is a component generator that reads CSS and produces framework-specific
components. It is not a CSS preprocessor. The CSS you write is the CSS that reaches
the browser, minus capsule-css-owned directives (`@tag`).

**Input:** `.capsule.css` file  
**Output:** JS/TS component module + CSS (as-is in dev, extracted to a file in build)

---

## Mental model

```
.capsule.css file
  → capsule-css parser (extracts metadata)
  → generates JS/TS component
  → CSS: as-is in dev / strip @tag + emit capsule-css.css in build
```

capsule-css owns exactly one CSS transformation: stripping its own directives.
Everything else (autoprefixer, minification, etc.) is delegated to PostCSS.

---

## File format

A `.capsule.css` file contains one or more components. The file contains standard CSS with:

- One or more `@scope` blocks — each defines one component
- One `@tag` directive — declares the HTML element (optional, defaults to `div`)
- Standard CSS nesting via `&`
- Variant styles via `:scope[data-*="..."]` and `:scope[data-*]` selectors
- Component references via `:scope .ComponentName`

### Example — single component

```css
@scope (.Button) {
  @tag button;

  :scope {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 14px;

    &:hover { opacity: 0.85; }

    &:disabled,
    &[aria-disabled="true"] {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  :scope[data-intent="primary"]   { background: #0066ff; color: white; }
  :scope[data-intent="secondary"] { background: transparent; border: 1px solid #0066ff; color: #0066ff; }

  :scope[data-size="sm"] { padding: 4px 8px; font-size: 12px; }
  :scope[data-size="md"] { padding: 8px 12px; font-size: 14px; }
  :scope[data-size="lg"] { padding: 12px 24px; font-size: 16px; }
}
```

### Example — multiple components in one file

```css
/* accordion.capsule.css */

@scope (.Accordion) {
  @tag div;

  :scope {
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }
}

@scope (.AccordionItem) {
  @tag div;

  :scope {
    border-bottom: 1px solid #e2e8f0;

    &:last-child { border-bottom: none; }
  }
}

@scope (.AccordionTrigger) {
  @tag button;

  :scope {
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-weight: 500;

    &:hover { background: #f7fafc; }
  }

  :scope[data-state="open"]   { color: #0066ff; }
  :scope[data-state="closed"] { color: inherit; }
}

@scope (.AccordionContent) {
  :scope {
    padding: 12px 16px;

    &[data-state="closed"] { display: none; }
  }
}
```

Import:

```ts
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion.capsule.css";
```

---

## Directives

### `@scope (.ComponentName)`

Defines a component. The class name inside the selector becomes the component
name and the CSS class applied to the root element.

- Must be a top-level rule in the file
- One or more per file — each produces one named export
- The selector must be a single class: `.ComponentName`
- Component names must be PascalCase

```css
@scope (.Card) { ... }          /* valid */
@scope (.my-card) { ... }       /* invalid — not PascalCase */
@scope (.Card, .Box) { ... }    /* invalid — single class only */
```

### `@tag`

Declares the HTML element the component renders. Stripped from CSS output in
build mode. Ignored by browser in dev mode (unknown at-rules are silently skipped
per CSS spec).

```css
@tag button;   /* renders <button> */
@tag a;        /* renders <a> */
@tag section;  /* renders <section> */
```

- Must appear inside `@scope`, before `:scope` rules
- Optional — defaults to `div` if omitted
- Value must be a valid HTML element name

---

## Variants

Variants are declared as CSS attribute selectors on `:scope`. Three forms are supported.

### Valued variants

```css
:scope[data-intent="primary"]   { ... }
:scope[data-intent="secondary"] { ... }
```

Generates a union-typed prop:

```ts
intent?: "primary" | "secondary"
```

The component sets `data-intent={intent}` on the element. If the prop is omitted, the attribute is not set — it does not override any `data-intent` passed via spread.

### Boolean variants

```css
:scope[data-disabled] { ... }
```

Generates a boolean prop:

```ts
disabled?: boolean
```

Passing `disabled` (or `disabled={true}`) sets `data-disabled=""` on the element, which matches the CSS presence selector. `false` or omitted leaves the attribute off.

### Mixed variants

A single attribute can appear as both a presence selector and a valued selector:

```css
:scope[data-kind]        { font-weight: bold; }   /* any value */
:scope[data-kind="pill"] { border-radius: 999px; }
:scope[data-kind="flat"] { border-radius: 0; }
```

Generates:

```ts
kind?: boolean | "pill" | "flat"
```

- `kind={true}` → `data-kind=""` (matches the bare selector)
- `kind="pill"` → `data-kind="pill"` (matches both selectors)
- omitted / `false` → no attribute

### Selector forms recognized

The parser walks every selector starting at `:scope` and collects each
`[data-*]` attribute attached to the scope element. All of these forms
contribute typed props:

```css
:scope[data-x]                          /* simple */
:scope[data-x="y"]                      /* simple, valued */
:scope[data-x][data-y]                  /* chained brackets */
:scope[data-x="a"][data-y="b"]          /* chained, both valued */
:scope[data-x]:not([data-y])            /* :not() — y is still typed */
:scope:is([data-a], [data-b])           /* :is() / :where() — both typed */
:scope:where([data-x])                  /* same */
```

A variant declared *only* inside a chain or a functional pseudo-class is
still extracted — you don't need a separate standalone declaration.

### What is *not* extracted

```css
:scope .Child[data-x]   /* descendant — data-x is on a child element */
:scope:has([data-x])    /* :has() targets descendants by definition */
```

These are valid CSS but don't generate scope-level props. `:has()` is
treated as opaque on purpose; if you want `data-x` typed, declare it
separately on `:scope` somewhere.

### Currently unsupported

Substring-matching attribute selectors are recognized as CSS but skipped by
the variant extractor — they produce no enum value:

```css
:scope[data-name^="arrow-"]   /* prefix match */
:scope[data-name$="-large"]   /* suffix match */
:scope[data-name*="circle"]   /* contains */
:scope[data-name~="word"]     /* whitespace-separated word */
:scope[data-name|="lang"]     /* lang-code prefix */
```

The styles still apply at runtime, but `name` does not become a typed
prop. Workaround: also add a discrete `:scope[data-name]` declaration
(yields `name?: boolean`) or a `:scope[data-name="exact"]` for each known
value. A future version may add an "open string" variant for these.

### Rules

- Only `data-*` attributes targeting the `:scope` element are extracted
- Attribute values must be string literals (no expressions or interpolation)
- Multiple variants per component are supported
- Variant prop names drop the `data-` prefix: `data-intent` → `intent` prop

---

## Nesting

Standard CSS nesting is supported inside `:scope`:

```css
:scope {
  /* pseudo-classes */
  &:hover { }
  &:focus-visible { }
  &:disabled { }

  /* pseudo-elements */
  &::before { }
  &::after { }

  /* attribute selectors */
  &[aria-expanded="true"] { }
  &[data-loading] { }

  /* combinators */
  & > .child { }
  & + .sibling { }
  & .descendant { }
}
```

### Component references

To style a child component inside a parent:

```css
@scope (.Card) {
  :scope .Button {
    margin-top: 8px;
  }
}
```

`.Button` refers to another capsule-css component by class name. No special
syntax required — it is a standard CSS descendant selector. The compiler does not
need to resolve it; the CSS is valid as written.

---

## Imports

All components are named exports. There is no default export.

```ts
import { Button } from "./Button.capsule.css";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion.capsule.css";
```

Cross-file CSS references need no import declaration in `.capsule.css` files —
component names are their own class names, so the CSS is self-consistent.

---

## Generated output

### JS/TS (React target)

All files produce named exports only — no default export. Components are
**polymorphic** via the `as` prop and **forward refs** automatically.
TypeScript infers the element-specific props (and the ref type) from the
`as` value.

```ts
// generated from Button.capsule.css
import * as React from "react";

export type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  intent?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "size">;

export const Button = React.forwardRef(function Button(
  { as, intent, size, className = "", ...rest }: ButtonProps<any>,
  ref: any,
) {
  const Tag = as ?? "button";
  const cls = ["Button", className].filter(Boolean).join(" ");
  return React.createElement(Tag, {
    ...rest,
    ref,
    className: cls,
    ...(intent !== undefined && { "data-intent": intent }),
    ...(size   !== undefined && { "data-size":   size   }),
  });
}) as <T extends React.ElementType = "button">(
  props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] },
) => React.ReactElement | null;
```

The `forwardRef` wrapper is paired with a hand-written generic call signature
cast (the `as <T extends ...>` clause), because TypeScript cannot infer
generics through `forwardRef` natively. The cast preserves the polymorphic
typing for both props and `ref`.

Usage:

```tsx
<Button intent="primary" onClick={fn}>Save</Button>
// → <button data-intent="primary" class="Button"> — onClick typed for HTMLButtonElement

<Button as="a" href="/docs">Read docs</Button>
// → <a href="/docs" class="Button"> — href required, typed for HTMLAnchorElement

<Button as={NextLink} href="/docs">Next link</Button>
// → renders NextLink — props inferred from NextLink's signature

const ref = React.useRef<HTMLButtonElement>(null);
<Button ref={ref} intent="primary">Save</Button>
// → ref is RefObject<HTMLButtonElement> by default
//   With as="a", ref would be RefObject<HTMLAnchorElement>
```

Variant props use conditional spreading so that omitted props never clobber
`data-*` attributes passed directly via `...rest`.

For boolean variants the spread condition is truthy rather than `!== undefined`:

```ts
// :scope[data-active] → active?: boolean
...(active && { "data-active": "" })
```

For mixed variants:

```ts
// :scope[data-kind] + :scope[data-kind="pill"] → kind?: boolean | "pill"
...(kind !== undefined && kind !== false && { "data-kind": kind === true ? "" : kind })
```

### CSS

**Dev mode:** file served as-is. `@tag` left in place, ignored by browser.

**Build mode:** `@tag` directives stripped, all `.capsule.css` files merged into
`capsule-css.css` and a `<link>` tag injected automatically into `index.html`.

```css
/* build output — @tag removed */
@scope (.Button) {
  :scope {
    display: inline-flex;
    /* ... */
  }
  /* ... */
}
```

---

## Dev vs build pipeline

| | Dev | Build |
|---|---|---|
| CSS delivery | Runtime `<style>` tag injection | `capsule-css.css` asset + `<link>` tag |
| `@tag` in output | Left in (browser ignores) | Stripped |
| Class names | Semantic (`.Button`) | Semantic (`.Button`) |
| JS output | Full, readable | Minified |
| Source maps | Yes | Yes |
| Speed priority | Maximum | Correctness + optimization |

---

## HMR

The Vite plugin distinguishes two kinds of changes:

**CSS-only change** — a declaration value changes but the component structure
(name, tag, variants) is unchanged. The plugin sends a `capsule-css:css-update`
WebSocket event. Each module listens for it and patches its `<style>` tag
in-place, with no component remount.

**Structural change** — a variant is added/removed, `@tag` changes, or a
component is renamed. The plugin invalidates the JS virtual module, triggering
a full module reload.

---

## Parser — what it extracts

The parser reads the `.capsule.css` file and produces a `FileDef`:

```go
type FileDef struct {
    Components []ComponentDef
}

type ComponentDef struct {
    Name     string       // "Button" — from @scope (.Button)
    Tag      string       // "button" — from @tag, default "div"
    Variants []VariantDef
}

type VariantDef struct {
    Name    string   // "intent"
    Values  []string // ["primary", "secondary"] — empty for boolean-only
    Boolean bool     // true when :scope[data-name] (no value) is present
}
```

The parser does **not** process CSS declarations. It only scans for:
1. The `@scope` selector → component name
2. `@tag` value → HTML tag
3. `:scope[data-*="..."]` selectors → valued variant names and values
4. `:scope[data-*]` selectors → boolean variant names

Everything else in the file is treated as opaque CSS and passed through.

---

## TypeScript declarations

The Vite plugin generates a single `capsule-css.d.ts` file at the project root,
aggregating declarations for every `.capsule.css` file it has processed. Each file
gets a wildcard `declare module` block:

```ts
// capsule-css.d.ts — generated by capsule-css, do not edit

declare module "*/Button.capsule.css" {
  import type * as React from "react";

  export type ButtonProps<T extends React.ElementType = "button"> = {
    as?: T;
    intent?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
  } & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "size">;

  export const Button: <T extends React.ElementType = "button">(
    props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] },
  ) => React.ReactElement | null;
}
```

The file is regenerated on every save (dev) or build. It should be added to
`.gitignore` and listed in `tsconfig.json`'s `include` array.

---

## Bundler integration

### Vite plugin

```ts
// vite.config.ts
import { capsule-css } from "@capsule-css/vite";

export default {
  plugins: [capsule-css({ target: "react" })]
};
```

The plugin:
1. Intercepts `*.capsule.css` imports via `resolveId`, returning a virtual module
   id of the form `\0capsule-css:/abs/path.capsule.css.js` (no `.css` suffix, so
   Vite's CSS pipeline never sees it)
2. In `load`, calls the Go compiler and returns the generated JS + a CSS
   injection snippet (dev) or stores the CSS for bundle emission (build)
3. In `generateBundle`, emits a single `capsule-css.css` asset and records its
   filename for HTML injection
4. In `transformIndexHtml`, injects `<link rel="stylesheet">` pointing to the
   emitted asset
5. In `handleHotUpdate`, diffs the old and new type signatures to decide between
   a CSS-only push or a full module invalidation

---

## Constraints (v0.1)

- React and vanilla JS are the supported targets
- No runtime beyond the generated component function
- No theming / design token system
- No expression evaluation in CSS values
- No conditional logic in component generation
- PostCSS pipeline not yet wired in build mode (CSS is emitted as-is after `@tag` stripping)

---

## Future (out of scope for v0.1)

- Angular / Vue targets
- PostCSS pipeline integration in build mode
- `@default variant value;` directive
- `@export false;` to define internal-only components
- Design token integration
- VS Code extension with syntax highlighting and `@tag` diagnostics
