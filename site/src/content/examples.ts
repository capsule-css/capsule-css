// ─── Installation ────────────────────────────────────────────────────────────

export const INSTALL_SHELL = `# npm
npm install -D @capsule-css/vite

# pnpm
pnpm add -D @capsule-css/vite

# yarn
yarn add -D @capsule-css/vite`;

export const INSTALL_CONFIG_REACT = `// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { capsule } from "@capsule-css/vite";

export default defineConfig({
  plugins: [react(), capsule()],
});`;

export const INSTALL_CONFIG_VANILLA = `// vite.config.js
import { defineConfig } from "vite";
import { capsule } from "@capsule-css/vite";

export default defineConfig({
  plugins: [capsule()],
});`;

// ─── First component ─────────────────────────────────────────────────────────

export const FIRST_CSS = `/* button.capsule.css */
@scope (.Button) {
  @tag button;

  :scope {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: #0066ff;
    color: #ffffff;
    transition: opacity 0.15s;

    &:hover { opacity: 0.85; }
  }
}`;

export const FIRST_REACT = `import { Button } from "./button.capsule.css";

export default function App() {
  return (
    <Button onClick={() => alert("Hello!")}>
      Click me
    </Button>
  );
}`;

export const FIRST_VANILLA = `import { Button } from "./button.capsule.css";

const btn = Button();
btn.textContent = "Click me";
btn.onclick = () => alert("Hello!");

document.getElementById("app").appendChild(btn);`;

// ─── @tag directive ───────────────────────────────────────────────────────────

export const TAG_CSS = `@scope (.NavLink) {
  @tag a;          /* renders as <a> */
  :scope {
    color: #6b7280;
    text-decoration: none;
    font-size: 14px;
    &:hover { color: #111827; }
  }
}

@scope (.Heading) {
  @tag h2;         /* renders as <h2> */
  :scope {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
}`;

export const TAG_REACT = `import { NavLink, Heading } from "./nav.capsule.css";

// NavLink renders as <a>, Heading as <h2>
export default function App() {
  return (
    <>
      <NavLink href="/docs">Documentation</NavLink>
      <Heading>Getting started</Heading>
    </>
  );
}`;

export const TAG_VANILLA = `import { NavLink, Heading } from "./nav.capsule.css";

// NavLink() returns an HTMLAnchorElement
const link = NavLink();
link.href = "/docs";
link.textContent = "Documentation";

// Heading() returns an HTMLHeadingElement
const heading = Heading();
heading.textContent = "Getting started";

document.getElementById("app").append(link, heading);`;

// ─── Polymorphic as prop ─────────────────────────────────────────────────────

export const AS_CSS = `@scope (.Link) {
  @tag a;          /* default element */
  :scope {
    color: #0066ff;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
    &:hover { opacity: 0.8; }
  }
}`;

export const AS_REACT = `import { Link } from "./link.capsule.css";
import NextLink from "next/link";

// Default — renders an <a>, href is required, target is typed
export function Docs() {
  return <Link href="/docs" target="_blank">Docs</Link>;
}

// Override to <button> — disabled and onClick are typed for buttons
export function SignOut() {
  return (
    <Link as="button" disabled onClick={() => alert("hi")}>
      Sign out
    </Link>
  );
}

// Render a custom component — props inferred from NextLink
export function About() {
  return (
    <Link as={NextLink} href="/about" prefetch>
      About
    </Link>
  );
}`;

export const AS_VANILLA = `import { Link } from "./link.capsule.css";

// Default — returns HTMLAnchorElement (inferred from @tag a)
const docs = Link({ children: "Docs" });
docs.href = "/docs";

// Override — Link({ as: "button" }) is typed as HTMLButtonElement
const signOut = Link({ as: "button", children: "Sign out" });
signOut.disabled = true;
signOut.addEventListener("click", () => alert("hi"));

// Wrong attribute on inferred element — TS catches it
const span = Link({ as: "span", children: "Label" });
// span.href = "/x"; // ❌ Property 'href' does not exist on HTMLSpanElement

document.getElementById("app").append(docs, signOut, span);`;

// ─── Variants – valued ───────────────────────────────────────────────────────

export const VALUED_CSS = `@scope (.Button) {
  @tag button;
  :scope {
    display: inline-flex;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  /* each selector becomes a typed "intent" prop value */
  :scope[data-intent="primary"]   { background: #0066ff; color: #fff; }
  :scope[data-intent="secondary"] { background: #f3f4f6; color: #374151; }
  :scope[data-intent="danger"]    { background: #ef4444; color: #fff; }
}`;

export const VALUED_REACT = `import { Button } from "./button.capsule.css";

// intent is typed: "primary" | "secondary" | "danger"
export default function App() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button intent="primary">Save</Button>
      <Button intent="secondary">Cancel</Button>
      <Button intent="danger">Delete</Button>
    </div>
  );
}`;

export const VALUED_VANILLA = `import { Button } from "./button.capsule.css";

const wrap = document.createElement("div");
Object.assign(wrap.style, { display: "flex", gap: "8px" });

const save   = Button({ intent: "primary" });
const cancel = Button({ intent: "secondary" });
const del    = Button({ intent: "danger" });

save.textContent   = "Save";
cancel.textContent = "Cancel";
del.textContent    = "Delete";

wrap.append(save, cancel, del);
document.getElementById("app").appendChild(wrap);`;

// ─── Variants – boolean ──────────────────────────────────────────────────────

export const BOOL_CSS = `@scope (.Button) {
  @tag button;
  :scope {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    background: #0066ff;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  /* no value → generates a boolean prop */
  :scope[data-loading] {
    opacity: 0.6;
    pointer-events: none;
    cursor: wait;
  }
}`;

export const BOOL_REACT = `import { useState } from "react";
import { Button } from "./button.capsule.css";

// "loading" is typed as: boolean | undefined
export default function App() {
  const [saving, setSaving] = useState(false);

  return (
    <Button
      loading={saving}
      onClick={() => setSaving(true)}
    >
      {saving ? "Saving…" : "Save"}
    </Button>
  );
}`;

export const BOOL_VANILLA = `import { Button } from "./button.capsule.css";

const btn = Button();
btn.textContent = "Save";

btn.onclick = () => {
  // pass true at creation or set the attribute directly
  btn.dataset.loading = "";
  btn.textContent = "Saving…";
};

document.getElementById("app").appendChild(btn);`;

// ─── Variants – mixed ────────────────────────────────────────────────────────

export const MIXED_CSS = `@scope (.Avatar) {
  @tag img;
  :scope {
    border-radius: 50%;
    object-fit: cover;
    width: 32px;
    height: 32px;
  }

  /* boolean form sets a default size */
  :scope[data-size]      { width: 32px;  height: 32px; }

  /* valued forms override it */
  :scope[data-size="sm"] { width: 24px;  height: 24px; }
  :scope[data-size="md"] { width: 32px;  height: 32px; }
  :scope[data-size="lg"] { width: 48px;  height: 48px; }
  :scope[data-size="xl"] { width: 64px;  height: 64px; }
}`;

export const MIXED_REACT = `import { Avatar } from "./avatar.capsule.css";

// size is typed: boolean | "sm" | "md" | "lg" | "xl"
export default function App() {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {/* specific size */}
      <Avatar src="/user.jpg" alt="User" size="xl" />
      <Avatar src="/user.jpg" alt="User" size="lg" />
      <Avatar src="/user.jpg" alt="User" size="md" />

      {/* boolean — uses the :scope[data-size] default (32px) */}
      <Avatar src="/user.jpg" alt="User" size />
    </div>
  );
}`;

export const MIXED_VANILLA = `import { Avatar } from "./avatar.capsule.css";

// specific size
const xl = Avatar({ src: "/user.jpg", alt: "User", size: "xl" });
const lg = Avatar({ src: "/user.jpg", alt: "User", size: "lg" });

// boolean — passes true, sets data-size="" on the element
const def = Avatar({ src: "/user.jpg", alt: "User", size: true });

document.getElementById("app").append(xl, lg, def);`;

// ─── Pseudo-classes ──────────────────────────────────────────────────────────

export const PSEUDO_CSS = `@scope (.Input) {
  @tag input;
  :scope {
    padding: 10px 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:hover { border-color: #9ca3af; }

    &:focus {
      border-color: #0066ff;
      box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.12);
    }

    &::placeholder { color: #9ca3af; }

    &:disabled {
      background: #f9fafb;
      color: #9ca3af;
      cursor: not-allowed;
    }
  }
}`;

export const PSEUDO_REACT = `import { Input } from "./input.capsule.css";

export default function App() {
  return (
    <Input
      type="email"
      placeholder="you@example.com"
    />
  );
}`;

export const PSEUDO_VANILLA = `import { Input } from "./input.capsule.css";

const input = Input({
  type: "email",
  placeholder: "you@example.com",
});

document.getElementById("app").appendChild(input);`;

// ─── Pseudo-elements ─────────────────────────────────────────────────────────

export const PSEUDO_EL_CSS = `@scope (.StatusBadge) {
  @tag span;
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;

    &::before {
      content: "";
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  }

  :scope[data-status="online"]  { color: #16a34a; background: #dcfce7; }
  :scope[data-status="away"]    { color: #d97706; background: #fef3c7; }
  :scope[data-status="offline"] { color: #9ca3af; background: #f3f4f6; }
}`;

export const PSEUDO_EL_REACT = `import { StatusBadge } from "./badge.capsule.css";

export default function App() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <StatusBadge status="online">Online</StatusBadge>
      <StatusBadge status="away">Away</StatusBadge>
      <StatusBadge status="offline">Offline</StatusBadge>
    </div>
  );
}`;

export const PSEUDO_EL_VANILLA = `import { StatusBadge } from "./badge.capsule.css";

const online  = StatusBadge({ status: "online" });
const away    = StatusBadge({ status: "away" });
const offline = StatusBadge({ status: "offline" });

online.textContent  = "Online";
away.textContent    = "Away";
offline.textContent = "Offline";

document.getElementById("app").append(online, away, offline);`;

// ─── Nesting ─────────────────────────────────────────────────────────────────

export const NESTING_CSS = `@scope (.Card) {
  @tag article;
  :scope {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    transition: box-shadow 0.2s;

    /* style children directly with CSS nesting */
    & > h3 {
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #111827;
    }

    & > p {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
    }

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }
}`;

export const NESTING_REACT = `import { Card } from "./card.capsule.css";

export default function App() {
  return (
    <Card>
      <h3>Zero runtime</h3>
      <p>No CSS-in-JS, no style injection. Output is plain CSS.</p>
    </Card>
  );
}`;

export const NESTING_VANILLA = `import { Card } from "./card.capsule.css";

const card = Card();
card.innerHTML = \`
  <h3>Zero runtime</h3>
  <p>No CSS-in-JS, no style injection. Output is plain CSS.</p>
\`;

document.getElementById("app").appendChild(card);`;

// ─── Selector forms ──────────────────────────────────────────────────────────

export const SELECTORS_OK_CSS = `@scope (.Toggle) {
  @tag button;

  /* simple — both forms generate typed props */
  :scope[data-pressed]            { background: blue; }
  :scope[data-intent="primary"]   { color: white; }

  /* chained brackets — both pressed and readonly are typed */
  :scope[data-pressed][data-readonly] { cursor: not-allowed; }

  /* :not() — disabled is typed even though it appears nowhere else */
  :scope[data-pressed]:not([data-disabled]) { opacity: 1; }

  /* :is() / :where() — every embedded data-* becomes a typed value */
  :scope:is([data-state="open"], [data-state="closed"]) {
    transition: opacity 200ms;
  }
}`;

export const SELECTORS_SKIP_CSS = `@scope (.List) {
  @tag ul;

  /* descendant — data-x is on a child element, not on :scope */
  :scope .Item[data-selected] { background: yellow; }

  /* :has() — describes descendants by definition */
  :scope:has([data-error]) { border: 1px solid red; }
}`;

export const SELECTORS_UNSUPPORTED_CSS = `@scope (.Icon) {
  @tag svg;

  /* substring matchers — valid CSS, no enum value to extract */
  :scope[data-name^="arrow-"]   { color: blue; }    /* prefix  */
  :scope[data-name$="-large"]   { width: 32px; }    /* suffix  */
  :scope[data-name*="circle"]   { border-radius: 50%; } /* contains */
  :scope[data-name~="word"]     { font-weight: 700; }   /* word    */
  :scope[data-name|="lang"]     { color: gray; }    /* lang    */
}`;

// ─── Media queries ───────────────────────────────────────────────────────────

export const MEDIA_CSS = `@scope (.Grid) {
  @tag div;
  :scope {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@scope (.Card) {
  @tag article;
  :scope {
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #e5e7eb;

    @media (prefers-color-scheme: dark) {
      background: #1e293b;
      border-color: #334155;
    }
  }
}`;

export const MEDIA_REACT = `import { Grid, Card } from "./layout.capsule.css";

export default function App() {
  return (
    <Grid>
      <Card>Item one</Card>
      <Card>Item two</Card>
      <Card>Item three</Card>
    </Grid>
  );
}`;

export const MEDIA_VANILLA = `import { Grid, Card } from "./layout.capsule.css";

const grid = Grid();

["Item one", "Item two", "Item three"].forEach((text) => {
  const card = Card();
  card.textContent = text;
  grid.appendChild(card);
});

document.getElementById("app").appendChild(grid);`;

// ─── Responsive — container queries ──────────────────────────────────────────

export const CONTAINER_CSS = `@scope (.Card) {
  @tag article;
  :scope {
    /* declare a container context — name is optional */
    container-type: inline-size;
    container-name: card;

    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;

    /* respond to the card's own width, not the viewport */
    @container card (min-width: 360px) {
      grid-template-columns: 80px 1fr;
      gap: 16px;
    }
    @container card (min-width: 600px) {
      padding: 24px;
      gap: 24px;
    }
  }
}`;

// ─── Responsive — fluid sizing ───────────────────────────────────────────────

export const FLUID_CSS = `@scope (.HeroTitle) {
  @tag h1;
  :scope {
    /* font-size scales smoothly between 28px and 64px,
       targeting ~5vw in the middle of the range */
    font-size: clamp(1.75rem, 5vw, 4rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 clamp(0.75rem, 2vw, 1.5rem);
  }
}

@scope (.Container) {
  @tag div;
  :scope {
    /* width never exceeds 1200px and has fluid horizontal padding */
    width: min(100%, 1200px);
    margin-inline: auto;
    padding-inline: clamp(1rem, 4vw, 3rem);
  }
}`;

// ─── Responsive — accessibility queries ──────────────────────────────────────

export const A11Y_QUERIES_CSS = `@scope (.Modal) {
  @tag dialog;
  :scope {
    padding: 24px;
    border-radius: 12px;
    transform: scale(1);
    opacity: 1;
    transition: transform 200ms ease, opacity 200ms ease;

    &[open] {
      animation: pop-in 200ms ease;
    }

    /* honor users who opted out of animations */
    @media (prefers-reduced-motion: reduce) {
      transition: none;
      &[open] { animation: none; }
    }

    /* high-contrast users get heavier borders */
    @media (prefers-contrast: more) {
      border: 2px solid currentColor;
    }
  }
}

@keyframes pop-in {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

document.getElementById("app").appendChild(grid);`;

// ─── Theming ─────────────────────────────────────────────────────────────────

export const THEMING_GLOBAL = `/* global.css — define tokens once */
:root {
  --color-primary:       #0066ff;
  --color-primary-hover: #0052cc;
  --color-surface:       #ffffff;
  --color-border:        #e5e7eb;
  --radius-md:           8px;
  --shadow-sm:           0 1px 3px rgba(0, 0, 0, 0.1);
}

/* automatic dark-mode swap — no ThemeProvider needed */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary:       #3b82f6;
    --color-primary-hover: #60a5fa;
    --color-surface:       #1e293b;
    --color-border:        #334155;
  }
}`;

export const THEMING_CSS = `@scope (.Button) {
  @tag button;
  :scope {
    background: var(--color-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;

    &:hover { background: var(--color-primary-hover); }
  }
}

@scope (.Card) {
  @tag article;
  :scope {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 24px;
  }
}`;

// ─── TypeScript ──────────────────────────────────────────────────────────────

export const TS_INPUT_CSS = `@scope (.Button) {
  @tag button;
  :scope { /* base styles */ }

  :scope[data-intent="primary"] { background: #0066ff; color: #fff; }
  :scope[data-intent="danger"]  { background: #ef4444; color: #fff; }
  :scope[data-loading]          { opacity: 0.6; pointer-events: none; }
}`;

export const TS_GENERATED_DTS = `// button.capsule.css.d.ts  (auto-generated, do not edit)
import type * as React from "react";

export type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  intent?: "primary" | "danger";
  loading?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "loading">;

// Runtime is wrapped in React.forwardRef — ref is typed via the polymorphic
// ComponentPropsWithRef<T>, so it tracks the value of \`as\`.
export const Button: <T extends React.ElementType = "button">(
  props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }
) => React.ReactElement | null;`;

export const TS_EXTEND_REACT = `import type { ButtonProps } from "./button.capsule.css";
import { Button } from "./button.capsule.css";

// Extend the generated props to add your own.
// ButtonProps is generic — pass through T to keep the polymorphic as.
type IconButtonProps<T extends React.ElementType = "button"> =
  ButtonProps<T> & { icon: React.ReactNode };

function IconButton<T extends React.ElementType = "button">({
  icon, children, ...rest
}: IconButtonProps<T>) {
  return (
    <Button {...rest as ButtonProps<T>}>
      {icon}
      {children}
    </Button>
  );
}

// Usage — fully typed
<IconButton intent="primary" icon={<SaveIcon />} loading={saving}>
  Save
</IconButton>`;

// ─── Production build ────────────────────────────────────────────────────────

export const PROD_CONFIG_REACT = `// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { capsule } from "@capsule-css/vite";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default defineConfig({
  plugins: [
    react(),
    // @tag directives are stripped and CSS is
    // extracted to a single capsule.css file
    capsule(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), cssnano()],
    },
  },
});`;

export const PROD_CONFIG_VANILLA = `// vite.config.js
import { defineConfig } from "vite";
import { capsule } from "@capsule-css/vite";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default defineConfig({
  plugins: [capsule()],
  css: {
    postcss: {
      plugins: [autoprefixer(), cssnano()],
    },
  },
});`;

export const PROD_OUTPUT = `dist/
  index.html              ← <link rel="stylesheet" href="/capsule.css"> injected
  capsule.css         ← all @scope blocks, @tag stripped, minified
  assets/
    index-[hash].js       ← your app bundle`;


// ─── Contributing ────────────────────────────────────────────────────────────

export const CONTRIB_ARCHITECTURE = `┌────────────────────┐    invokes via execFile    ┌────────────────────┐
│  Bundler plugin    │ ─────────────────────────► │  capsule-css (Go)  │
│  (Vite / Webpack…) │                            │  parser + codegen  │
└────────────────────┘ ◄───────────────────────── └────────────────────┘
         │              JS module + CSS                │
         │                                             │
         ▼                                             ▼
   Dev/build pipeline                          .capsule.css source`;

export const CONTRIB_PLUGIN_SKELETON = `import { compile, compileTypes } from "@capsule-css/core";

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

    handleHotUpdate({ file, server }) {
      if (!file.endsWith(".capsule.css")) return;
      const newDts = compileTypes(file, options);
      const oldDts = dtsRegistry.get(file);
      dtsRegistry.set(file, newDts);

      const mod = server.moduleGraph.getModuleById(toVirtualId(file));
      if (mod) server.moduleGraph.invalidateModule(mod);

      if (oldDts === newDts) {
        // CSS-only: hot-swap without remounting
        const { css } = compile(file, options);
        server.ws.send({
          type: "custom",
          event: "capsule-css:css-update",
          data: { id: file, css },
        });
        return mod ? [mod] : [];
      }

      // Structural change: full module reload
      return mod ? [mod] : [];
    },
  };
}`;

export const CONTRIB_TARGET_SKELETON = `package myframework

import "capsule-css/internal/parser"

// Generate produces the full component module for the target framework.
// Honor every "Required behavior" convention listed above.
func Generate(file *parser.FileDef) string { /* ... */ }

// GenerateJS — optional, only if your framework distinguishes a JS-only
// variant from a TS-aware one (e.g. React does, Vue SFC does not).
func GenerateJS(file *parser.FileDef) string { /* ... */ }

// GenerateDTS produces the .d.ts declaration file for TypeScript users.
func GenerateDTS(file *parser.FileDef) string { /* ... */ }`;

