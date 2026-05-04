// ─── Token definitions ────────────────────────────────────────────────────────

export interface Tokens {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorDanger: string;
  colorText: string;
  colorTextMuted: string;
  colorSurface: string;
  colorBorder: string;
  colorFocus: string;
  fontSansSerif: string;
  fontMono: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  spacingBase: string;
  shadowSm: string;
  shadowMd: string;
  transitionFast: string;
}

export interface PresetPair {
  light: Tokens;
  dark: Tokens;
}

export const PRESETS: Record<string, PresetPair> = {
  Neutral: {
    light: {
      colorPrimary:      "#0066ff",
      colorPrimaryHover: "#0052cc",
      colorDanger:       "#ef4444",
      colorText:         "#111827",
      colorTextMuted:    "#6b7280",
      colorSurface:      "#ffffff",
      colorBorder:       "#e5e7eb",
      colorFocus:        "rgba(0,102,255,0.18)",
      fontSansSerif:     "system-ui, -apple-system, sans-serif",
      fontMono:          '"SF Mono","Fira Code",Menlo,monospace',
      radiusSm:          "4px",
      radiusMd:          "8px",
      radiusLg:          "12px",
      spacingBase:       "4px",
      shadowSm:          "0 1px 3px rgba(0,0,0,0.08)",
      shadowMd:          "0 4px 16px rgba(0,0,0,0.10)",
      transitionFast:    "0.15s ease",
    },
    dark: {
      colorPrimary:      "#3b82f6",
      colorPrimaryHover: "#60a5fa",
      colorDanger:       "#f87171",
      colorText:         "#fafafa",
      colorTextMuted:    "#71717a",
      colorSurface:      "#09090b",
      colorBorder:       "#27272a",
      colorFocus:        "rgba(59,130,246,0.25)",
      fontSansSerif:     "system-ui, -apple-system, sans-serif",
      fontMono:          '"SF Mono","Fira Code",Menlo,monospace',
      radiusSm:          "4px",
      radiusMd:          "8px",
      radiusLg:          "12px",
      spacingBase:       "4px",
      shadowSm:          "0 1px 3px rgba(0,0,0,0.4)",
      shadowMd:          "0 4px 16px rgba(0,0,0,0.5)",
      transitionFast:    "0.15s ease",
    },
  },
  Warm: {
    light: {
      colorPrimary:      "#e85d04",
      colorPrimaryHover: "#c94e00",
      colorDanger:       "#dc2626",
      colorText:         "#1c1917",
      colorTextMuted:    "#78716c",
      colorSurface:      "#fffbf5",
      colorBorder:       "#e7e5e4",
      colorFocus:        "rgba(232,93,4,0.18)",
      fontSansSerif:     "system-ui, -apple-system, sans-serif",
      fontMono:          '"SF Mono","Fira Code",Menlo,monospace',
      radiusSm:          "3px",
      radiusMd:          "6px",
      radiusLg:          "10px",
      spacingBase:       "4px",
      shadowSm:          "0 1px 3px rgba(0,0,0,0.08)",
      shadowMd:          "0 4px 16px rgba(0,0,0,0.10)",
      transitionFast:    "0.15s ease",
    },
    dark: {
      colorPrimary:      "#fb923c",
      colorPrimaryHover: "#fdba74",
      colorDanger:       "#f87171",
      colorText:         "#fafaf9",
      colorTextMuted:    "#a8a29e",
      colorSurface:      "#0c0a09",
      colorBorder:       "#292524",
      colorFocus:        "rgba(251,146,60,0.25)",
      fontSansSerif:     "system-ui, -apple-system, sans-serif",
      fontMono:          '"SF Mono","Fira Code",Menlo,monospace',
      radiusSm:          "3px",
      radiusMd:          "6px",
      radiusLg:          "10px",
      spacingBase:       "4px",
      shadowSm:          "0 1px 3px rgba(0,0,0,0.4)",
      shadowMd:          "0 4px 16px rgba(0,0,0,0.5)",
      transitionFast:    "0.15s ease",
    },
  },
  Cool: {
    light: {
      colorPrimary:      "#7c3aed",
      colorPrimaryHover: "#6d28d9",
      colorDanger:       "#e11d48",
      colorText:         "#0f172a",
      colorTextMuted:    "#64748b",
      colorSurface:      "#f8faff",
      colorBorder:       "#e2e8f0",
      colorFocus:        "rgba(124,58,237,0.18)",
      fontSansSerif:     "system-ui, -apple-system, sans-serif",
      fontMono:          '"SF Mono","Fira Code",Menlo,monospace',
      radiusSm:          "6px",
      radiusMd:          "10px",
      radiusLg:          "16px",
      spacingBase:       "4px",
      shadowSm:          "0 1px 3px rgba(0,0,0,0.08)",
      shadowMd:          "0 4px 16px rgba(0,0,0,0.10)",
      transitionFast:    "0.15s ease",
    },
    dark: {
      colorPrimary:      "#a78bfa",
      colorPrimaryHover: "#c4b5fd",
      colorDanger:       "#fb7185",
      colorText:         "#f1f5f9",
      colorTextMuted:    "#94a3b8",
      colorSurface:      "#020617",
      colorBorder:       "#1e293b",
      colorFocus:        "rgba(167,139,250,0.25)",
      fontSansSerif:     "system-ui, -apple-system, sans-serif",
      fontMono:          '"SF Mono","Fira Code",Menlo,monospace',
      radiusSm:          "6px",
      radiusMd:          "10px",
      radiusLg:          "16px",
      spacingBase:       "4px",
      shadowSm:          "0 1px 3px rgba(0,0,0,0.4)",
      shadowMd:          "0 4px 16px rgba(0,0,0,0.5)",
      transitionFast:    "0.15s ease",
    },
  },
};

// ─── Component IDs ────────────────────────────────────────────────────────────

export type ComponentId =
  | "reset"
  | "tokens"
  | "typography"
  | "link"
  | "button"
  | "buttonlink"
  | "flex"
  | "stack"
  | "container";

export interface ComponentDef {
  id: ComponentId;
  label: string;
  description: string;
  group: string;
}

export const COMPONENTS: ComponentDef[] = [
  { id: "reset",      group: "Base",       label: "CSS Reset",     description: "Modern box-sizing + margin reset" },
  { id: "tokens",     group: "Base",       label: "Design Tokens", description: "CSS custom properties on :root" },
  { id: "typography", group: "Base",       label: "Typography",    description: "H1–H4, Body, Lead, Caption" },
  { id: "link",       group: "Elements",   label: "Link",          description: "Inline link with underline" },
  { id: "button",     group: "Elements",   label: "Button",        description: "solid / outline / ghost × sm/md/lg" },
  { id: "buttonlink", group: "Elements",   label: "ButtonLink",    description: "Button rendered as <a>" },
  { id: "flex",       group: "Layout",     label: "Flex",          description: "Row/col + align/justify variants" },
  { id: "stack",      group: "Layout",     label: "Stack",         description: "Vertical flex with gap token" },
  { id: "container",  group: "Layout",     label: "Container",     description: "Max-width centered wrapper" },
];

// ─── Component props ─────────────────────────────────────────────────────────

export interface TypographyProps {
  h1: string; h2: string; h3: string; h4: string;
  body: string; lead: string; caption: string;
}

export interface ButtonProps {
  paddingSmV: string; paddingSmH: string;
  paddingMdV: string; paddingMdH: string;
  paddingLgV: string; paddingLgH: string;
  fontSizeSm: string; fontSizeMd: string; fontSizeLg: string;
}

export interface FlexProps {
  gap: string;
}

export interface StackProps {
  gap: string;
}

export interface ContainerProps {
  maxWidth: string;
}

export interface AllComponentProps {
  typography: TypographyProps;
  button: ButtonProps;
  flex: FlexProps;
  stack: StackProps;
  container: ContainerProps;
}

export const DEFAULT_COMPONENT_PROPS: AllComponentProps = {
  typography: {
    h1: "clamp(2rem, 5vw, 3rem)",
    h2: "clamp(1.5rem, 3.5vw, 2rem)",
    h3: "1.25rem",
    h4: "1rem",
    body: "1rem",
    lead: "1.125rem",
    caption: "0.75rem",
  },
  button: {
    paddingSmV: "6px",  paddingSmH: "12px",
    paddingMdV: "10px", paddingMdH: "20px",
    paddingLgV: "14px", paddingLgH: "28px",
    fontSizeSm: "0.75rem", fontSizeMd: "0.875rem", fontSizeLg: "1rem",
  },
  flex: { gap: "16px" },
  stack: { gap: "16px" },
  container: { maxWidth: "1200px" },
};

export const STACK_GAP_PRESETS = ["0px", "8px", "16px", "24px", "32px"];
export const FLEX_GAP_PRESETS  = ["0px", "8px", "16px", "24px", "32px"];

// ─── Template generators ──────────────────────────────────────────────────────

function block(name: string, tag: string, body: string): string {
  return `@scope (.${name}) {\n  @tag ${tag};\n${body}\n}\n`;
}

function gen_reset(): string {
  return `/* ── Reset ─────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
`;
}

function gen_tokens(light: Tokens, dark: Tokens): string {
  return `/* ── Design Tokens ──────────────────────────────────────────────────────── */
:root {
  --color-primary:       ${light.colorPrimary};
  --color-primary-hover: ${light.colorPrimaryHover};
  --color-danger:        ${light.colorDanger};
  --color-text:          ${light.colorText};
  --color-text-muted:    ${light.colorTextMuted};
  --color-surface:       ${light.colorSurface};
  --color-border:        ${light.colorBorder};
  --color-focus:         ${light.colorFocus};

  --font-sans: ${light.fontSansSerif};
  --font-mono: ${light.fontMono};

  --radius-sm: ${light.radiusSm};
  --radius-md: ${light.radiusMd};
  --radius-lg: ${light.radiusLg};

  --space:     ${light.spacingBase};

  --shadow-sm: ${light.shadowSm};
  --shadow-md: ${light.shadowMd};

  --transition-fast: ${light.transitionFast};
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary:       ${dark.colorPrimary};
    --color-primary-hover: ${dark.colorPrimaryHover};
    --color-danger:        ${dark.colorDanger};
    --color-text:          ${dark.colorText};
    --color-text-muted:    ${dark.colorTextMuted};
    --color-surface:       ${dark.colorSurface};
    --color-border:        ${dark.colorBorder};
    --color-focus:         ${dark.colorFocus};

    --shadow-sm: ${dark.shadowSm};
    --shadow-md: ${dark.shadowMd};
  }
}
`;
}

function gen_typography(p: TypographyProps): string {
  return `/* ── Typography ─────────────────────────────────────────────────────────── */
${block("H1", "h1", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.h1};
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--color-text);
  }`)}
${block("H2", "h2", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.h2};
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }`)}
${block("H3", "h3", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.h3};
    font-weight: 700;
    line-height: 1.3;
    color: var(--color-text);
  }`)}
${block("H4", "h4", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.h4};
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-text);
  }`)}
${block("Body", "p", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.body};
    line-height: 1.75;
    color: var(--color-text);
  }`)}
${block("Lead", "p", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.lead};
    line-height: 1.75;
    color: var(--color-text-muted);
  }`)}
${block("Caption", "span", `  :scope {
    font-family: var(--font-sans);
    font-size: ${p.caption};
    line-height: 1.5;
    color: var(--color-text-muted);
  }`)}`;
}

function gen_link(): string {
  return `/* ── Link ───────────────────────────────────────────────────────────────── */
${block("Link", "a", `  :scope {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
    cursor: pointer;
    transition: opacity var(--transition-fast);

    &:hover { opacity: 0.75; }
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }
  }`)}`;
}

function gen_button(p: ButtonProps): string {
  return `/* ── Button ─────────────────────────────────────────────────────────────── */
${block("Button", "button", `  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--space) * 2);
    font-family: var(--font-sans);
    font-weight: 600;
    border: 1.5px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    white-space: nowrap;

    /* default size md */
    padding: ${p.paddingMdV} ${p.paddingMdH};
    font-size: ${p.fontSizeMd};

    &:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }
    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  /* ── sizes ── */
  :scope[data-size="sm"] {
    padding: ${p.paddingSmV} ${p.paddingSmH};
    font-size: ${p.fontSizeSm};
    border-radius: var(--radius-sm);
  }
  :scope[data-size="md"] {
    padding: ${p.paddingMdV} ${p.paddingMdH};
    font-size: ${p.fontSizeMd};
  }
  :scope[data-size="lg"] {
    padding: ${p.paddingLgV} ${p.paddingLgH};
    font-size: ${p.fontSizeLg};
    border-radius: var(--radius-lg);
  }

  /* ── intents ── */
  :scope[data-intent="primary"] {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
    box-shadow: var(--shadow-sm);
    &:hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }
  }
  :scope[data-intent="outline"] {
    background: transparent;
    border-color: var(--color-border);
    color: var(--color-text);
    &:hover { border-color: var(--color-primary); color: var(--color-primary); }
  }
  :scope[data-intent="ghost"] {
    background: transparent;
    border-color: transparent;
    color: var(--color-text-muted);
    &:hover { background: var(--color-border); color: var(--color-text); }
  }
  :scope[data-intent="danger"] {
    background: var(--color-danger);
    border-color: var(--color-danger);
    color: #fff;
    &:hover { opacity: 0.88; }
  }

  /* ── loading ── */
  :scope[data-loading] {
    opacity: 0.65;
    cursor: wait;
    pointer-events: none;
  }`)}`;
}

function gen_buttonlink(p: ButtonProps): string {
  return `/* ── ButtonLink ─────────────────────────────────────────────────────────── */
${block("ButtonLink", "a", `  :scope {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--space) * 2);
    font-family: var(--font-sans);
    font-weight: 600;
    border: 1.5px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    white-space: nowrap;
    padding: ${p.paddingMdV} ${p.paddingMdH};
    font-size: ${p.fontSizeMd};

    &:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }
  }
  :scope[data-size="sm"] {
    padding: ${p.paddingSmV} ${p.paddingSmH};
    font-size: ${p.fontSizeSm};
    border-radius: var(--radius-sm);
  }
  :scope[data-size="lg"] {
    padding: ${p.paddingLgV} ${p.paddingLgH};
    font-size: ${p.fontSizeLg};
    border-radius: var(--radius-lg);
  }
  :scope[data-intent="primary"] {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
    box-shadow: var(--shadow-sm);
    &:hover { background: var(--color-primary-hover); border-color: var(--color-primary-hover); }
  }
  :scope[data-intent="outline"] {
    background: transparent;
    border-color: var(--color-border);
    color: var(--color-text);
    &:hover { border-color: var(--color-primary); color: var(--color-primary); }
  }
  :scope[data-intent="ghost"] {
    background: transparent;
    border-color: transparent;
    color: var(--color-text-muted);
    &:hover { background: var(--color-border); color: var(--color-text); }
  }`)}`;
}

function gen_flex(p: FlexProps): string {
  return `/* ── Flex ───────────────────────────────────────────────────────────────── */
${block("Flex", "div", `  :scope {
    display: flex;
    gap: ${p.gap};
  }

  /* ── direction ── */
  :scope[data-dir="row"]    { flex-direction: row; }
  :scope[data-dir="col"]    { flex-direction: column; }

  /* ── wrap ── */
  :scope[data-wrap]         { flex-wrap: wrap; }

  /* ── align (cross-axis) ── */
  :scope[data-align="start"]    { align-items: flex-start; }
  :scope[data-align="center"]   { align-items: center; }
  :scope[data-align="end"]      { align-items: flex-end; }
  :scope[data-align="stretch"]  { align-items: stretch; }
  :scope[data-align="baseline"] { align-items: baseline; }

  /* ── justify (main-axis) ── */
  :scope[data-justify="start"]   { justify-content: flex-start; }
  :scope[data-justify="center"]  { justify-content: center; }
  :scope[data-justify="end"]     { justify-content: flex-end; }
  :scope[data-justify="between"] { justify-content: space-between; }
  :scope[data-justify="around"]  { justify-content: space-around; }
  :scope[data-justify="evenly"]  { justify-content: space-evenly; }

  /* ── gap override ── */
  :scope[data-gap="xs"] { gap: calc(var(--space) * 1); }
  :scope[data-gap="sm"] { gap: calc(var(--space) * 2); }
  :scope[data-gap="md"] { gap: calc(var(--space) * 4); }
  :scope[data-gap="lg"] { gap: calc(var(--space) * 8); }
  :scope[data-gap="xl"] { gap: calc(var(--space) * 12); }`)}`;
}

function gen_stack(p: StackProps): string {
  return `/* ── Stack ──────────────────────────────────────────────────────────────── */
${block("Stack", "div", `  :scope {
    display: flex;
    flex-direction: column;
    gap: ${p.gap};
  }
  :scope[data-gap="xs"] { gap: calc(var(--space) * 1); }
  :scope[data-gap="sm"] { gap: calc(var(--space) * 2); }
  :scope[data-gap="md"] { gap: calc(var(--space) * 4); }
  :scope[data-gap="lg"] { gap: calc(var(--space) * 8); }
  :scope[data-gap="xl"] { gap: calc(var(--space) * 12); }`)}`;
}

function gen_container(p: ContainerProps): string {
  return `/* ── Container ──────────────────────────────────────────────────────────── */
${block("Container", "div", `  :scope {
    width: min(100%, ${p.maxWidth});
    margin-inline: auto;
    padding-inline: clamp(1rem, 4vw, 3rem);
  }

  :scope[data-size="sm"]  { max-width: 640px; }
  :scope[data-size="md"]  { max-width: 768px; }
  :scope[data-size="lg"]  { max-width: 1024px; }
  :scope[data-size="xl"]  { max-width: 1280px; }
  :scope[data-size="full"]{ max-width: 100%; }`)}`;
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateCSS(
  light: Tokens,
  dark: Tokens,
  selected: Set<ComponentId>,
  props: AllComponentProps,
): string {
  const parts: string[] = [];

  if (selected.has("reset"))      parts.push(gen_reset());
  if (selected.has("tokens"))     parts.push(gen_tokens(light, dark));
  if (selected.has("typography")) parts.push(gen_typography(props.typography));
  if (selected.has("link"))       parts.push(gen_link());
  if (selected.has("button"))     parts.push(gen_button(props.button));
  if (selected.has("buttonlink")) parts.push(gen_buttonlink(props.button));
  if (selected.has("flex"))       parts.push(gen_flex(props.flex));
  if (selected.has("stack"))      parts.push(gen_stack(props.stack));
  if (selected.has("container"))  parts.push(gen_container(props.container));

  if (parts.length === 0) return "/* Select components to generate your starter file */\n";

  return `/* starter.capsule.css — generated by capsule-css Starter */\n/* https://capsule-css.dev */\n\n` + parts.join("\n");
}
