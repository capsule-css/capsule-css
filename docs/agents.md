# capsule-css — AI Agent Reference

This document is a self-contained reference for AI coding agents, LLMs, and
automated tools working with capsule-css. It covers the full syntax, all output
formats, and common patterns so you can generate correct `.capsule.css` files
without reading the full documentation.

---

## What is capsule-css?

capsule-css is a CSS-first component generator. It reads `.capsule.css` files —
plain CSS using the native `@scope` at-rule — and emits typed component modules
for React and vanilla JS (DOM element factories). There is no custom CSS syntax
beyond `@tag`, which is a capsule-css-only directive described below.

---

## File format: `.capsule.css`

A `.capsule.css` file contains one or more `@scope` blocks. Each block becomes a
named export.

```css
@scope (.ComponentName) {
  @tag tagname;        /* capsule-css directive — sets the HTML element */

  :scope {            /* styles for the component root */
    /* any valid CSS */
  }

  /* optional variant selectors */
  :scope[data-variant-name="value"] { /* ... */ }
  :scope[data-boolean-flag]         { /* ... */ }
}
```

### Rules

- The class name inside `@scope (.Name)` becomes the export name (PascalCase).
- `@tag` is optional and sets the default HTML element. If omitted, the
  component defaults to `<div>`. Valid values: any HTML element tag.
- `@tag` is stripped from the output CSS — it never reaches the browser.
- All components accept an `as` prop/option that overrides `@tag` per instance.
  In React, the element-specific props are inferred (e.g.
  `<Link as="button" disabled />`). In vanilla, the return type is inferred via
  TypeScript's `HTMLElementTagNameMap` (e.g. `Link({ as: "a" })` →
  `HTMLAnchorElement`). React additionally accepts custom components
  (`as={NextLink}`); vanilla accepts intrinsic tag names only.
- Everything inside `:scope { }` is plain CSS. All standard features work:
  nesting (`&`), pseudo-classes, pseudo-elements, `@media`, `@keyframes`,
  CSS custom properties.
- Multiple `@scope` blocks in the same file are all exported from the same module.

---

## Variants

Variants map CSS attribute selectors to typed props in the generated component.

### Valued variant

A selector with a quoted value generates a union-type prop.

```css
:scope[data-intent="primary"]   { background: #0066ff; }
:scope[data-intent="secondary"] { background: #f3f4f6; }
:scope[data-intent="danger"]    { background: #ef4444; }
```

Generated prop: `intent?: "primary" | "secondary" | "danger"`

### Boolean variant

A selector with no value generates a `boolean` prop.

```css
:scope[data-loading] { opacity: 0.6; pointer-events: none; }
:scope[data-disabled] { opacity: 0.4; cursor: not-allowed; }
```

Generated props: `loading?: boolean`, `disabled?: boolean`

### Mixed variant

When both valueless and valued selectors exist for the same attribute name,
capsule-css generates a union of `boolean` and the string values.

```css
:scope[data-size]      { width: 32px; height: 32px; }   /* boolean form */
:scope[data-size="sm"] { width: 24px; height: 24px; }
:scope[data-size="lg"] { width: 48px; height: 48px; }
```

Generated prop: `size?: boolean | "sm" | "lg"`

Passing `true` sets `data-size=""` (triggers the valueless selector).
Passing `"lg"` sets `data-size="lg"`.

### Selector forms recognized

The parser walks every selector starting at `:scope` and collects each
`[data-*]` attribute targeting the scope element. All of these contribute
typed props — including attributes declared **only** inside a chain or a
functional pseudo-class:

```css
:scope[data-x]                   /* simple boolean */
:scope[data-x="y"]               /* simple valued */
:scope[data-x][data-y]           /* chained — both x and y are typed */
:scope[data-x]:not([data-y])     /* :not() — y is still typed */
:scope:is([data-a], [data-b])    /* :is() / :where() — both typed */
:scope:where([data-x])           /* same */
```

`:not()`, `:is()`, and `:where()` are treated as transparent: their
contents apply to the same `:scope` element, so attributes inside them
are extracted as scope variants.

### What is NOT extracted

```css
:scope .Child[data-x]   /* descendant — data-x is on a child element */
:scope:has([data-x])    /* :has() targets descendants by definition */
```

These are valid CSS but do not generate scope-level props. `:has()` is
opaque on purpose; if you want `data-x` typed, declare it separately on
`:scope` somewhere.

### Currently unsupported

Substring-matching attribute selectors are recognized as CSS but skipped
by the variant extractor — they yield no enum value:

```css
:scope[data-name^="arrow-"]   /* prefix match */
:scope[data-name$="-large"]   /* suffix match */
:scope[data-name*="circle"]   /* contains */
:scope[data-name~="word"]     /* whitespace-separated word */
:scope[data-name|="lang"]     /* lang-code prefix */
```

The styles still apply at runtime, but `name` is not exposed as a typed
prop. Workaround: also add a discrete `:scope[data-name]` declaration
(yields `name?: boolean`) or one `:scope[data-name="exact"]` per known
value. A future version may add an "open string" variant for this case.

---

## Generated output: React

For a component defined as:

```css
@scope (.Button) {
  @tag button;
  :scope { padding: 10px 20px; background: #0066ff; color: #fff; }
  :scope[data-intent="primary"] { background: #0066ff; }
  :scope[data-intent="danger"]  { background: #ef4444; }
  :scope[data-loading]          { opacity: 0.6; }
}
```

The generated `.d.ts` is:

```ts
import type * as React from "react";

export type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  intent?: "primary" | "danger";
  loading?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "loading">;

export const Button: <T extends React.ElementType = "button">(
  props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] },
) => React.ReactElement | null;
```

The runtime is wrapped in `React.forwardRef`, so `ref` is forwarded to the
rendered element. With `as`, ref is re-typed: `<Button ref={r}>` types `r`
for `HTMLButtonElement`; `<Button as="a" ref={r}>` types it for
`HTMLAnchorElement`.

Usage in React (TypeScript):

```tsx
import { Button } from "./button.capsule.css";

<Button intent="primary" loading={isSaving} onClick={handleSave}>
  Save
</Button>
```

The generated JS function renders a `<button>` element, applies `className="Button"`,
and maps `intent` → `data-intent`, `loading` → `data-loading` on the DOM node.

---

## Generated output: Vanilla JS (DOM element factories)

The same `.capsule.css` compiled for vanilla JS generates a factory function:

```js
import { Button } from "./button.capsule.css";

// Button() returns an HTMLButtonElement
const btn = Button({ intent: "primary" });
btn.textContent = "Save";
btn.onclick = handleSave;

document.getElementById("app").appendChild(btn);
```

The factory accepts all standard HTML attributes plus the variant props as an
optional plain object. It returns the native DOM element.

To update a variant after creation, set `dataset` directly:

```js
btn.dataset.intent = "danger";
btn.dataset.loading = "";      // boolean variant → empty string
delete btn.dataset.loading;    // remove boolean variant
```

---

## TypeScript inference table

| CSS selector form                     | TypeScript prop type           |
|---------------------------------------|--------------------------------|
| `:scope[data-x="a"]`                  | `x?: "a"`                      |
| `:scope[data-x="a"]`, `[data-x="b"]`  | `x?: "a" \| "b"`               |
| `:scope[data-x]`                      | `x?: boolean`                  |
| `:scope[data-x]` + `[data-x="a"]`     | `x?: boolean \| "a"`           |

All variant props are optional. Non-variant HTML attributes are passed through
via the extended HTML attributes interface.

---

## Common patterns

### Button with variants

```css
@scope (.Button) {
  @tag button;
  :scope {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
    &:hover { opacity: 0.85; }
    &:focus-visible { outline: 2px solid #0066ff; outline-offset: 2px; }
  }
  :scope[data-intent="primary"]   { background: #0066ff; color: #fff; }
  :scope[data-intent="secondary"] { background: #f3f4f6; color: #374151; }
  :scope[data-intent="danger"]    { background: #ef4444; color: #fff; }
  :scope[data-loading] { opacity: 0.6; pointer-events: none; cursor: wait; }
}
```

### Card

```css
@scope (.Card) {
  @tag article;
  :scope {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    & > h3 { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
    & > p  { font-size: 14px; color: #6b7280; margin: 0; }
  }
  :scope[data-elevated] { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  @media (prefers-color-scheme: dark) {
    :scope { background: #1e293b; border-color: #334155; }
  }
}
```

### Input

```css
@scope (.Input) {
  @tag input;
  :scope {
    padding: 10px 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    width: 100%;
    &:hover { border-color: #9ca3af; }
    &:focus { border-color: #0066ff; box-shadow: 0 0 0 3px rgba(0,102,255,0.12); }
    &::placeholder { color: #9ca3af; }
    &:disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }
  }
  :scope[data-error] { border-color: #ef4444; }
}
```

### Avatar with mixed size variant

```css
@scope (.Avatar) {
  @tag img;
  :scope { border-radius: 50%; object-fit: cover; }
  :scope[data-size]      { width: 32px; height: 32px; }
  :scope[data-size="xs"] { width: 20px; height: 20px; }
  :scope[data-size="sm"] { width: 24px; height: 24px; }
  :scope[data-size="md"] { width: 32px; height: 32px; }
  :scope[data-size="lg"] { width: 48px; height: 48px; }
  :scope[data-size="xl"] { width: 64px; height: 64px; }
}
```

---

## Theming

Use CSS custom properties defined on `:root`. Components reference tokens with
`var()`. Dark mode is handled with a single `@media (prefers-color-scheme: dark)`
block on `:root` in `global.css` — no ThemeProvider needed.

```css
/* global.css */
:root {
  --color-primary: #0066ff;
  --radius-md: 8px;
}
@media (prefers-color-scheme: dark) {
  :root { --color-primary: #3b82f6; }
}
```

```css
/* button.capsule.css */
@scope (.Button) {
  @tag button;
  :scope { background: var(--color-primary); border-radius: var(--radius-md); }
}
```

---

## Vite plugin configuration

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import capsule-css from "@capsule-css/vite";

export default defineConfig({
  plugins: [react(), capsule-css()],
});
```

The plugin handles:
- Virtual module resolution for `.capsule.css` imports
- `@tag` stripping in development
- Build-time CSS extraction to `capsule-css.css`
- HMR: CSS-only changes → instant swap; structural changes → module invalidation

---

## Constraints

- `@tag` must come before `:scope` inside the `@scope` block.
- Variant attribute names must be lowercase kebab-case: `data-my-variant`.
- Only `data-*` attributes are used for variants. Standard attributes
  (`disabled`, `type`, etc.) are passed through as normal HTML attributes.
- Multiple components in one file are all exported from the same module path.
- The output CSS contains `@scope` rules — browsers that don't support `@scope`
  natively need a PostCSS polyfill (`@csstools/postcss-cascade-layers` or
  `postcss-scope`).


---

## Contributing

This document covers usage only. For architecture details, how to build the Go
compiler, how to write a bundler plugin, and the full test checklist, see
[CONTRIBUTING.md](../CONTRIBUTING.md).
