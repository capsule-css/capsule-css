# @capsule-css/vite

Vite plugin for [capsule-css](https://github.com/capsule-css/capsule-css) — zero-runtime typed components from plain CSS.

## Install

```bash
npm install -D @capsule-css/vite
```

## Setup

```ts
// vite.config.ts
import { capsule } from "@capsule-css/vite";

export default {
  plugins: [capsule({ target: "react" })]
};
```

## Usage

Write a `.capsule.css` file using native `@scope`:

```css
@scope (.Button) {
  @tag button;

  :scope { display: inline-flex; padding: 8px 16px; }
  :scope[data-intent="primary"] { background: #0066ff; color: white; }
  :scope[data-intent="secondary"] { background: transparent; border: 1px solid #0066ff; }
}
```

Import typed components directly:

```tsx
import { Button } from "./Button.capsule.css";

<Button intent="primary">Save</Button>
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `target` | `"react"` \| `"vanilla"` | `"react"` | Output target |
| `binaryPath` | `string` | auto | Path to the capsule binary |

## Links

- [Documentation](https://capsule-css.github.io/capsule-css/)
- [GitHub](https://github.com/capsule-css/capsule-css)
- [Language spec](https://github.com/capsule-css/capsule-css/blob/main/docs/spec.md)
