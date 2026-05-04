<div align="center">

# 💊 capsule-css

**Plain CSS → Typed Components.**

Write standard [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) CSS.  
Import typed React or vanilla JS components — straight from your stylesheet.

[![npm](https://img.shields.io/npm/v/@capsule-css/vite?label=%40capsule-css%2Fvite&color=7c3aed)](https://www.npmjs.com/package/@capsule-css/vite)
[![license](https://img.shields.io/badge/license-MIT-7c3aed)](./LICENSE)
[![alpha](https://img.shields.io/badge/status-alpha-7c3aed)](https://github.com/capsule-css/capsule-css)

</div>

---

## The idea

Most CSS tooling asks you to write styles _inside_ JavaScript. capsule-css does the opposite: it reads your CSS and generates the JavaScript.

Write a `.capsule.css` file using standard `@scope` rules. capsule-css generates a typed component module — no runtime, no DSL, no separate schema.

```css
/* button.capsule.css */
@scope (.Button) {
  @tag a;

  :scope {
    display: inline-flex;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
  }

  :scope[data-intent="primary"] { background: #0066ff; color: #fff; }
  :scope[data-intent="outline"] { background: transparent; border: 1.5px solid #d1d5db; }
}
```

```tsx
import { Button } from "./button.capsule.css";

function App() {
  return (
    <Button intent="primary" href="/docs">
      Get started
    </Button>
  );
}
```

The `intent` prop is inferred from the `data-intent` selectors in your CSS. No extra steps.

---

## Features

- **Standard CSS syntax** — no DSL, no custom format. Just native `@scope` rules, valid in any editor or linter.
- **Type-safe variants** — `data-*` selectors become typed props. Boolean, valued, and mixed variants all covered.
- **Vite-native HMR** — CSS-only changes update in place without a full reload.
- **Build-time extraction** — all scoped styles are collected into a single `capsule.css`, injected into your HTML automatically.
- **PostCSS ready** — runs through your existing PostCSS config (autoprefixer, cssnano, anything you have).
- **Zero runtime** — output is a static JS module that sets `data-*` attributes. No style injection at runtime.

---

## Installation

```bash
pnpm add -D @capsule-css/vite
```

```ts
// vite.config.ts
import { capsule } from "@capsule-css/vite";
import react from "@vitejs/plugin-react";

export default {
  plugins: [capsule({ target: "react" }), react()],
};
```

---

## Variants

`data-*` attribute selectors are parsed into typed props automatically.

```css
/* badge.capsule.css */
@scope (.Badge) {
  @tag span;
  :scope { padding: 3px 8px; border-radius: 6px; }

  /* valued variant */
  :scope[data-intent="info"]    { background: #eff6ff; color: #2563eb; }
  :scope[data-intent="success"] { background: #f0fdf4; color: #15803d; }
  :scope[data-intent="danger"]  { background: #fef2f2; color: #dc2626; }

  /* boolean variant */
  :scope[data-subtle] { opacity: 0.6; }
}
```

Generated types:

```ts
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  intent?: "info" | "success" | "danger";
  subtle?: boolean;
}
export function Badge(props: BadgeProps): JSX.Element;
```

---

## Theming

Use CSS custom properties for tokens. capsule-css outputs plain CSS — theming is just CSS.

```css
@scope (.Button) {
  @tag button;

  :scope {
    background: var(--color-primary);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
  }
}
```

Dark mode via `@media (prefers-color-scheme: dark)` — no JavaScript involved.

---

## Documentation

- [Getting started](https://capsule-css.dev/docs.html)
- [Starter generator](https://capsule-css.dev/starter.html)
- [Language spec](./docs/spec.md)
- [AI agent reference](./docs/agents.md)

---

## Framework support

| Framework  | Status    |
|------------|-----------|
| React      | Available |
| Vanilla JS | Available |
| Vue        | Roadmap   |
| Svelte     | Roadmap   |
| Solid      | Roadmap   |
| Angular    | Roadmap   |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for architecture details, how to build the Go compiler, and how to write a bundler plugin.

---

## License

MIT © capsule-css contributors
