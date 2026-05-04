import React from "react";
import "./components/layout.capsule.css";
import "./components/hero.capsule.css";
import "./components/section.capsule.css";
import "./components/card.capsule.css";
import "./components/code.capsule.css";
import "./components/badge.capsule.css";
import "./components/button.capsule.css";
import "./components/frameworks.capsule.css";
import "./components/compat.capsule.css";

import { Nav, NavInner, NavBrandGroup, NavBrand, NavAlpha, NavLinks, NavLink, NavGitHub, Footer, FooterCode } from "./components/layout.capsule.css";
import { HeroWrap, HeroEyebrow, HeroTitle, HeroSub, HeroActions, HeroDemo } from "./components/hero.capsule.css";
import { Section, SectionInner, SectionLabel, SectionTitle, SectionDesc } from "./components/section.capsule.css";
import { FeatureGrid, FeatureCard, FeatureIcon, FeatureTitle, FeatureText } from "./components/card.capsule.css";
import { CodePair, CodeHeader, CodeDot, CodeFilename, CodePre } from "./components/code.capsule.css";
import { Button } from "./components/button.capsule.css";
import { FrameworkGrid, FrameworkItem, FrameworkStatus, FrameworkIcon } from "./components/frameworks.capsule.css";
import { CompatTable, CompatHeader, CompatFeature, CompatHint, CompatCell, CompatDot, CompatNote } from "./components/compat.capsule.css";
import { Code } from "./components/Code";
import { highlight } from "./lib/highlight";

const CSS_EXAMPLE = `/* Plain CSS — no new syntax */
@scope (.Button) {
  @tag a;           /* sets the HTML element */

  :scope {
    display: inline-flex;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
  }

  /* data-* selectors become typed props */
  :scope[data-intent="primary"] {
    background: #0066ff;
    color: #ffffff;
  }
  :scope[data-intent="outline"] {
    background: transparent;
    border: 1.5px solid #d1d5db;
  }
}`;

const TSX_EXAMPLE = `import { Button } from "./button.capsule.css";

function App() {
  return (
    <>
      <Button intent="primary" href="/docs">
        Get started
      </Button>
      <Button intent="outline" href="/examples">
        View examples
      </Button>
    </>
  );
}`;

const VARIANT_CSS = `@scope (.Badge) {
  @tag span;
  :scope { padding: 3px 8px; border-radius: 6px; }

  /* valued variant → Badge accepts intent prop */
  :scope[data-intent="react"]   { background: #eff6ff; color: #2563eb; }
  :scope[data-intent="vanilla"] { background: #fef9c3; color: #a16207; }
  :scope[data-intent="css"]     { background: #f0fdf4; color: #15803d; }

  /* boolean variant → Badge accepts disabled prop */
  :scope[data-disabled] { opacity: 0.4; pointer-events: none; }
}`;

const VARIANT_DTS = `export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  intent?: "react" | "vanilla" | "css";
  disabled?: boolean;
}
export function Badge(props: BadgeProps): JSX.Element;`;

const features = [
  { icon: "📝", title: "Standard CSS syntax",
    text: "No DSL, no custom format. Just native @scope rules — valid in any editor, linter, or formatter." },
  { icon: "⚡", title: "Vite-native HMR",
    text: "CSS changes update instantly without a full reload. Structural changes invalidate the module cleanly." },
  { icon: "🔒", title: "Type-safe variants",
    text: "data-* selectors become typed props. Boolean, valued, and mixed variants all covered." },
  { icon: "📦", title: "Build-time extraction",
    text: "All scoped CSS is extracted to a single capsule.css file, injected into your HTML automatically." },
  { icon: "🎨", title: "PostCSS ready",
    text: "Runs through your existing PostCSS config — autoprefixer, cssnano, anything you already have." },
  { icon: "🔧", title: "Zero runtime",
    text: "No CSS-in-JS, no style injection at runtime. Output is a static JS module that sets data-* attributes." },
];

type CompatStatus = "full" | "partial" | "none";
const compatRows: { feature: string; hint: string; chrome: string; safari: string; firefox: string; edge: string; statuses: [CompatStatus, CompatStatus, CompatStatus, CompatStatus] }[] = [
  {
    feature: "@scope at-rule",
    hint: "core to capsule-css",
    chrome: "118+", edge: "118+", safari: "17.4+", firefox: "behind flag",
    statuses: ["full", "full", "full", "partial"],
  },
  {
    feature: ":scope pseudo-class",
    hint: "scope-element selector",
    chrome: "27+", edge: "79+", safari: "7+", firefox: "32+",
    statuses: ["full", "full", "full", "full"],
  },
  {
    feature: "CSS Nesting (&)",
    hint: "native, no transform",
    chrome: "120+", edge: "120+", safari: "17.2+", firefox: "117+",
    statuses: ["full", "full", "full", "full"],
  },
  {
    feature: "Container queries",
    hint: "@container",
    chrome: "105+", edge: "105+", safari: "16+", firefox: "110+",
    statuses: ["full", "full", "full", "full"],
  },
  {
    feature: "data-* attribute selectors",
    hint: "for variants",
    chrome: "all", edge: "all", safari: "all", firefox: "all",
    statuses: ["full", "full", "full", "full"],
  },
];

const frameworks = [
  { icon: "⚛️",  name: "React",      status: "available" as const },
  { icon: "🍦",  name: "Vanilla JS", status: "available" as const },
  { icon: "💚",  name: "Vue",        status: "soon" as const },
  { icon: "🔥",  name: "Svelte",     status: "soon" as const },
  { icon: "💎",  name: "Solid",      status: "soon" as const },
  { icon: "🔺",  name: "Angular",    status: "soon" as const },
  { icon: "🦕",  name: "Qwik",       status: "soon" as const },
  { icon: "🏝️", name: "Astro",      status: "soon" as const },
];

export default function App() {
  return (
    <>
      <Nav>
        <NavInner>
          <NavBrandGroup>
            <NavBrand href="/">💊 capsule-css</NavBrand>
            <NavAlpha>alpha</NavAlpha>
          </NavBrandGroup>
          <NavLinks>
            <NavLink href="/docs.html">Docs</NavLink>
            <NavLink href="/starter.html">Starter</NavLink>
            <NavLink href="/agents.md">Agents</NavLink>
            <NavGitHub href="https://github.com/capsule-css/capsule-css" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </NavGitHub>
          </NavLinks>
        </NavInner>
      </Nav>

      <HeroWrap>
        <HeroEyebrow>Typed components from native CSS @scope</HeroEyebrow>
        <HeroTitle>
          Write CSS.{" "}
          <span style={{ color: "#0066ff" }}>Import</span> the component.
        </HeroTitle>
        <HeroSub>
          Standard{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/@scope"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066ff", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            <code style={{ color: "inherit" }}>@scope</code>
          </a>{" "}
          CSS in, typed React or vanilla JS components out. No DSL,
          no runtime, no class-name hashing — just the CSS you already write.
        </HeroSub>
        <HeroActions>
          <Button intent="primary" href="/starter.html">Try the starter</Button>
          <Button intent="outline" href="https://github.com/capsule-css/capsule-css" target="_blank" rel="noopener noreferrer">Star on GitHub</Button>
        </HeroActions>
        <HeroDemo>
          <CodeHeader>
            <CodeDot color="red" />
            <CodeDot color="yellow" />
            <CodeDot color="green" />
            <CodeFilename>button.capsule.css</CodeFilename>
          </CodeHeader>
          <CodePre dangerouslySetInnerHTML={{ __html: highlight(CSS_EXAMPLE, "css") }} />
        </HeroDemo>
      </HeroWrap>

      <Section id="features">
        <SectionInner>
          <SectionLabel>Why capsule-css</SectionLabel>
          <SectionTitle>CSS as the source of truth</SectionTitle>
          <SectionDesc>
            No config files, no decorators, no separate schema. Your{" "}
            <code>.capsule.css</code> file declares everything — the element,
            the styles, the variants.
          </SectionDesc>
          <FeatureGrid>
            {features.map((f) => (
              <FeatureCard key={f.title}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureText>{f.text}</FeatureText>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </SectionInner>
      </Section>

      <Section data-alt id="frameworks">
        <SectionInner>
          <SectionLabel>Framework agnostic</SectionLabel>
          <SectionTitle>One stylesheet, any framework</SectionTitle>
          <SectionDesc>
            The same <code>.capsule.css</code> file generates the right output
            for your stack. React and Vanilla JS ship today — more targets
            on the roadmap.
          </SectionDesc>
          <FrameworkGrid>
            {frameworks.map(({ icon, name, status }) => (
              <FrameworkItem key={name} status={status}>
                <FrameworkIcon>{icon}</FrameworkIcon>
                {name}
                <FrameworkStatus type={status === "available" ? "available" : undefined}>
                  {status === "available" ? "Available" : "Roadmap"}
                </FrameworkStatus>
              </FrameworkItem>
            ))}
          </FrameworkGrid>
        </SectionInner>
      </Section>

      <Section id="compat">
        <SectionInner>
          <SectionLabel>Browser support</SectionLabel>
          <SectionTitle>Built on standard CSS</SectionTitle>
          <SectionDesc>
            capsule-css leans on baseline CSS features rather than a custom
            runtime. The only relatively new piece is the{" "}
            <code>@scope</code> at-rule, which shipped in Chrome 118 and
            Safari 17.4. Firefox is expected to follow — track progress on{" "}
            <a href="https://caniuse.com/css-cascade-scope" target="_blank" rel="noopener noreferrer" style={{ color: "#0066ff" }}>
              caniuse.com
            </a>. Until then, target modern Chromium/Safari, or wait for the
            planned <code>legacyScope</code> compile option that lowers{" "}
            <code>@scope</code> to flat class selectors.
          </SectionDesc>
          <CompatTable>
            <CompatHeader>Feature</CompatHeader>
            <CompatHeader>
              <span aria-hidden>🌐</span> Chrome
            </CompatHeader>
            <CompatHeader>
              <span aria-hidden>🧭</span> Safari
            </CompatHeader>
            <CompatHeader>
              <span aria-hidden>🦊</span> Firefox
            </CompatHeader>
            <CompatHeader>
              <span aria-hidden>🪟</span> Edge
            </CompatHeader>
            {compatRows.map((row, i) => {
              const last = i === compatRows.length - 1;
              return (
                <React.Fragment key={row.feature}>
                  <CompatFeature {...(last && { "data-last": "" } as any)}>
                    {row.feature}
                    <CompatHint>{row.hint}</CompatHint>
                  </CompatFeature>
                  <CompatCell key={`c-${row.feature}`} status={row.statuses[0]} {...(last && { "data-last": "" } as any)}>
                    <CompatDot /> {row.chrome}
                  </CompatCell>
                  <CompatCell key={`s-${row.feature}`} status={row.statuses[1]} {...(last && { "data-last": "" } as any)}>
                    <CompatDot /> {row.safari}
                  </CompatCell>
                  <CompatCell key={`fx-${row.feature}`} status={row.statuses[2]} {...(last && { "data-last": "" } as any)}>
                    <CompatDot /> {row.firefox}
                  </CompatCell>
                  <CompatCell key={`e-${row.feature}`} status={row.statuses[3]} {...(last && { "data-last": "" } as any)}>
                    <CompatDot /> {row.edge}
                  </CompatCell>
                </React.Fragment>
              );
            })}
          </CompatTable>
          <CompatNote>
            Always check{" "}
            <a href="https://caniuse.com/css-cascade-scope" target="_blank" rel="noopener noreferrer" style={{ color: "#0066ff" }}>
              caniuse.com
            </a>{" "}
            for the most recent numbers — these are kept manually and may lag.
          </CompatNote>
        </SectionInner>
      </Section>

      <Section data-alt id="syntax">
        <SectionInner>
          <SectionLabel>Syntax</SectionLabel>
          <SectionTitle>Write CSS, import components</SectionTitle>
          <SectionDesc>
            Each <code>@scope (.Name)</code> block becomes a named export. The{" "}
            <code>@tag</code> directive sets the HTML element. Everything else
            is plain CSS.
          </SectionDesc>
          <CodePair>
            <Code filename="button.capsule.css" lang="css">{CSS_EXAMPLE}</Code>
            <Code filename="App.tsx" lang="typescript" badge="react">{TSX_EXAMPLE}</Code>
          </CodePair>
        </SectionInner>
      </Section>

      <Section id="variants">
        <SectionInner>
          <SectionLabel>Variants</SectionLabel>
          <SectionTitle>data-* selectors become typed props</SectionTitle>
          <SectionDesc>
            Attribute selectors are parsed into three forms: valued, boolean,
            or mixed. capsule-css generates the correct TypeScript union for each.
          </SectionDesc>
          <CodePair>
            <Code filename="badge.capsule.css" lang="css" badge="css">{VARIANT_CSS}</Code>
            <Code filename="badge.capsule.css.d.ts" lang="typescript" badge="ts">{VARIANT_DTS}</Code>
          </CodePair>
        </SectionInner>
      </Section>

      <Footer>
        <p>
          Built with 💊 capsule-css ·{" "}
          <FooterCode>{"import { Footer } from './layout.capsule.css'"}</FooterCode>
        </p>
        <p style={{ marginTop: "12px", fontSize: "13px", opacity: 0.7 }}>
          Builds on the idea of{" "}
          <a
            href="https://github.com/nyancss/nyancss"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            nyancss
          </a>{" "}
          (2018) — generating components from CSS — extended for the era of
          native <code>@scope</code> and TypeScript-first frontends.
        </p>
      </Footer>
    </>
  );
}
