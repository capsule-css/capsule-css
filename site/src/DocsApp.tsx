import { useEffect, useState } from "react";
import "./components/layout.capsule.css";
import "./components/sidebar.capsule.css";
import "./components/docs.capsule.css";
import "./components/switcher.capsule.css";
import "./components/code.capsule.css";
import "./components/badge.capsule.css";
import "./components/button.capsule.css";
import "./components/mobilenav.capsule.css";

import { Nav, NavInner, NavBrandGroup, NavBrand, NavAlpha, NavLinks, NavLink, NavGitHub, Footer, FooterLinks, FooterLink, FooterCode } from "./components/layout.capsule.css";
import { Sidebar, SidebarGroup, SidebarLabel, SidebarLink } from "./components/sidebar.capsule.css";
import { DocLayout, DocContent, DocSection, DocTitle, DocLead, DocHeading, DocSubheading, DocProse, DocNote, DocShell } from "./components/docs.capsule.css";
import { MobileNav, MobileNavTrigger, MobileNavCurrent, MobileNavChevron, MobileNavDropdown, MobileNavGroup, MobileNavLabel, MobileNavLink } from "./components/mobilenav.capsule.css";
import { Code } from "./components/Code";
import { FwCode } from "./components/FwCode";
import { FrameworkProvider } from "./lib/FrameworkContext";
import { url } from "./lib/url";

import * as ex from "./content/examples";

// ─── sidebar nav structure ───────────────────────────────────────────────────

const NAV = [
  { label: "Introduction", links: [
    { id: "motivation", title: "Motivation" },
  ]},
  { label: "Getting Started", links: [
    { id: "installation", title: "Installation" },
    { id: "first-component", title: "Your first component" },
    { id: "tag-directive", title: "The @tag directive" },
    { id: "polymorphic-as", title: "Polymorphic as prop" },
  ]},
  { label: "Variants", links: [
    { id: "variants-valued", title: "Valued variants" },
    { id: "variants-boolean", title: "Boolean variants" },
    { id: "variants-mixed", title: "Mixed variants" },
    { id: "variants-selectors", title: "Selector forms" },
  ]},
  { label: "Styling", links: [
    { id: "pseudo-classes", title: "Pseudo-classes" },
    { id: "pseudo-elements", title: "Pseudo-elements" },
    { id: "nesting", title: "Nesting" },
    { id: "responsive", title: "Responsive design" },
  ]},
  { label: "Advanced", links: [
    { id: "theming", title: "Theming with CSS variables" },
    { id: "typescript", title: "TypeScript" },
    { id: "production", title: "Production build" },
    { id: "hmr", title: "HMR" },
  ]},
  { label: "Contributing", links: [
    { id: "contrib-architecture", title: "Architecture" },
    { id: "contrib-bundler", title: "Build a bundler plugin" },
    { id: "contrib-target", title: "Add a framework target" },
  ]},
];

const ALL_IDS = NAV.flatMap((g) => g.links.map((l) => l.id));

// ─── active section hook ─────────────────────────────────────────────────────

function useActiveSection(): string {
  const [active, setActive] = useState(ALL_IDS[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ALL_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-15% 0px -70% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

// ─── inner app (needs framework context) ────────────────────────────────────

function DocApp() {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeTitle = NAV.flatMap((g) => g.links).find((l) => l.id === active)?.title ?? "";

  return (
    <>
      <Nav>
        <NavInner>
          <NavBrandGroup>
            <NavBrand href={url("/")}>
              <picture>
                <source srcSet={url("/capsule-dark.png")} media="(prefers-color-scheme: dark)" />
                <img src={url("/capsule.png")} alt="" width="22" height="22" />
              </picture>
              capsule-css
            </NavBrand>
            <NavAlpha>alpha</NavAlpha>
          </NavBrandGroup>
          <NavLinks>
            <NavLink href={url("/")}>Home</NavLink>
            <NavLink href={url("/starter.html")} hide="sm">Starter</NavLink>
            <NavLink href={url("/agents.md")} hide="md">Agents</NavLink>
            <NavGitHub href="https://github.com/capsule-css/capsule-css" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </NavGitHub>
          </NavLinks>
        </NavInner>
      </Nav>

      <MobileNav>
        <MobileNavTrigger onClick={() => setMenuOpen((o) => !o)}>
          <MobileNavCurrent>{activeTitle}</MobileNavCurrent>
          <MobileNavChevron {...(menuOpen ? { "data-open": "" } : {})}>▼</MobileNavChevron>
        </MobileNavTrigger>
        <MobileNavDropdown {...(menuOpen ? { "data-open": "" } : {})}>
          {NAV.map((group) => (
            <MobileNavGroup key={group.label}>
              <MobileNavLabel>{group.label}</MobileNavLabel>
              {group.links.map((link) => (
                <MobileNavLink
                  key={link.id}
                  href={`#${link.id}`}
                  {...(active === link.id ? { "data-active": "" } : {})}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.title}
                </MobileNavLink>
              ))}
            </MobileNavGroup>
          ))}
        </MobileNavDropdown>
      </MobileNav>

      <DocLayout>
        <Sidebar>
          {NAV.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarLabel>{group.label}</SidebarLabel>
              {group.links.map((link) => (
                <SidebarLink
                  key={link.id}
                  href={`#${link.id}`}
                  data-active={active === link.id || undefined}
                >
                  {link.title}
                </SidebarLink>
              ))}
            </SidebarGroup>
          ))}
        </Sidebar>

        <DocContent>
          <DocTitle>Documentation</DocTitle>
          <DocLead>
            capsule-css reads native{" "}
            <a
              href="https://www.w3schools.com/cssref/atrule_scope.php"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0066ff", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              <code style={{ color: "inherit" }}>@scope</code>
            </a>{" "}
            CSS and generates typed components for any framework or plain DOM —
            with zero runtime overhead, Vite HMR, and build-time CSS extraction.
          </DocLead>

          {/* ── Motivation ───────────────────────────────────────── */}
          <DocSection id="motivation">
            <DocHeading>Motivation</DocHeading>
            <DocProse>
              I have been writing CSS for fifteen years. These days most of it is
              written by AI — but when I sit down to review, it becomes harder and
              harder to hold the whole picture in my head. That friction is what
              capsule-css is trying to fix.
            </DocProse>
            <DocSubheading>A long tour of the ecosystem</DocSubheading>
            <DocProse>
              Over the years I have worked with plain CSS, LESS, Sass, Bootstrap,
              Foundation, BEM, then Tailwind (back in v1), CSS Modules,
              Emotion, styled-components (with Styled System, which I loved), and
              more recently Linaria, Stitches, vanilla-extract, Meta's StyleX, and
              Panda CSS.
            </DocProse>
            <DocProse>
              Each one had something I appreciated, but none of them felt complete.
              Some require learning an entire new ecosystem. Others haven't kept up
              with the broader ecosystem — styled-components, for instance, still
              lacks full support for React Server Components. If I were starting a
              project today I would reach for CSS Modules or styled-components,
              because based on my own experience those are the tools that give me the
              most control and let me build components quickly.
            </DocProse>
            <DocSubheading>The library that stuck</DocSubheading>
            <DocProse>
              The idea that stuck with me most was{" "}
              <a
                href="https://github.com/nyancss/nyancss"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0066ff", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                nyancss
              </a>
              , a small library with around 500 GitHub stars. It did one clever
              thing: it let you generate and import components directly from CSS
              files — similar in spirit to how CSS Modules exports class name
              strings, but at the component level. When it was released, TypeScript
              wasn't yet as ubiquitous as it is today, which is probably why it
              worked well as a proof of concept but was never evolved further.
            </DocProse>
            <DocSubheading>What I didn't want to build</DocSubheading>
            <DocProse>
              I had been thinking about this problem for years. I tried CSS Modules
              typing tools — they work, but they scatter{" "}
              <code>.d.ts</code> files across the source tree and create noise that
              makes the repository harder to navigate. I also didn't want to reinvent
              CSS itself. I wanted to write standard CSS, plain and unmodified, with
              no class-name hashing that makes production debugging painful and no
              extra build step that slows everything down.
            </DocProse>
            <DocSubheading>capsule-css</DocSubheading>
            <DocProse>
              capsule-css is the sum of all those experiences. The core idea: generate
              typed components from CSS files, using the native{" "}
              <code>@scope</code> at-rule to isolate styles to the exported component.
              The library adds a small number of custom directives — <code>@tag</code>{" "}
              to declare the HTML element — and parsing is done by a fast Go binary
              that extracts the component name and tag. Everything else is left
              untouched. The same <code>.capsule.css</code> file is valid CSS that you
              can open in any browser without the library.
            </DocProse>
            <DocProse>
              We are in an agentic era where code review has become the bottleneck.
              I believe simplicity is the key — and that is the second problem
              capsule-css is designed to solve. When the CSS is the source of truth
              and the component is generated from it, there is one fewer layer to
              reason about during review.
            </DocProse>
            <DocNote type="info">
              <code>@scope</code> is a{" "}
              <a
                href="https://www.w3schools.com/cssref/atrule_scope.php"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                native CSS at-rule
              </a>{" "}
              shipping in all modern browsers. capsule-css reads it as input format
              and emits it verbatim — no proprietary syntax ever reaches the browser.
            </DocNote>
          </DocSection>

          {/* ── Installation ─────────────────────────────────────── */}
          <DocSection id="installation">
            <DocHeading>Installation</DocHeading>
            <DocProse>
              Install the Vite plugin. The right native binary for your platform is
              pulled in automatically as an optional dependency — no separate download,
              no <code>PATH</code> setup.
            </DocProse>
            <DocShell>{ex.INSTALL_SHELL}</DocShell>
            <DocProse>
              Add the plugin to your Vite config:
            </DocProse>
            <FwCode
              react={ex.INSTALL_CONFIG_REACT}
              reactFile="vite.config.ts"
              vanilla={ex.INSTALL_CONFIG_VANILLA}
              vanillaFile="vite.config.js"
            />
            <DocNote type="info">
              Supported platforms: macOS (Apple Silicon &amp; Intel), Linux (x64 &amp; ARM64),
              Windows (x64). On unsupported platforms, build the binary from source and
              pass <code>binaryPath</code> to <code>capsule()</code>.
            </DocNote>
          </DocSection>

          {/* ── First component ───────────────────────────────────── */}
          <DocSection id="first-component">
            <DocHeading>Your first component</DocHeading>
            <DocProse>
              Create a <code>.capsule.css</code> file and write a standard{" "}
              <code>@scope</code> block. The <code>@tag</code> directive tells
              capsule-css which HTML element to render.
            </DocProse>
            <FwCode
              css={ex.FIRST_CSS}
              cssFile="button.capsule.css"
              react={ex.FIRST_REACT}
              vanilla={ex.FIRST_VANILLA}
            />
            <DocNote type="tip">
              The <code>.capsule.css</code> file is valid CSS. Your editor, linter,
              and formatter treat it exactly like any other stylesheet.
            </DocNote>
          </DocSection>

          {/* ── @tag directive ────────────────────────────────────── */}
          <DocSection id="tag-directive">
            <DocHeading>The @tag directive</DocHeading>
            <DocProse>
              <code>@tag</code> sets the default HTML element for the generated
              component. capsule-css uses it as the inferred default for the React
              type signature (so <code>onClick</code>, <code>type</code>,{" "}
              <code>href</code>, etc. are typed correctly), and strips it from the
              output CSS during the build.
            </DocProse>
            <FwCode
              css={ex.TAG_CSS}
              cssFile="nav.capsule.css"
              react={ex.TAG_REACT}
              vanilla={ex.TAG_VANILLA}
            />
            <DocNote type="info">
              <code>@tag</code> is optional. If omitted, the component defaults to{" "}
              <code>&lt;div&gt;</code>. It is a capsule-css-only directive — removed
              from the output so browsers never see it.
            </DocNote>
          </DocSection>

          {/* ── Polymorphic as prop ───────────────────────────────── */}
          <DocSection id="polymorphic-as">
            <DocHeading>Polymorphic as prop</DocHeading>
            <DocProse>
              Every React component accepts an <code>as</code> prop that overrides
              the default <code>@tag</code> for that instance. TypeScript re-infers
              the element-specific props from <code>as</code>, so you get the right
              completions and errors for whatever element you render.
            </DocProse>
            <FwCode
              css={ex.AS_CSS}
              cssFile="link.capsule.css"
              react={ex.AS_REACT}
              vanilla={ex.AS_VANILLA}
            />
            <DocNote type="info">
              In React, <code>as</code> works with intrinsic elements
              (<code>"a"</code>, <code>"button"</code>, …) and with custom
              components (<code>as=&#123;NextLink&#125;</code>). Props are
              inferred from whatever you pass.
            </DocNote>
            <DocNote type="info">
              In vanilla JS, <code>as</code> accepts intrinsic tag names. The
              return type is inferred via TypeScript's{" "}
              <code>HTMLElementTagNameMap</code> — so{" "}
              <code>Link(&#123; as: "a" &#125;)</code> is typed as{" "}
              <code>HTMLAnchorElement</code>,{" "}
              <code>Link(&#123; as: "button" &#125;)</code> as{" "}
              <code>HTMLButtonElement</code>, and so on.
            </DocNote>
          </DocSection>

          {/* ── Valued variants ───────────────────────────────────── */}
          <DocSection id="variants-valued">
            <DocHeading>Valued variants</DocHeading>
            <DocProse>
              Any <code>:scope[data-*="value"]</code> selector generates a typed
              prop. capsule-css collects all values for the same attribute name into
              a union type.
            </DocProse>
            <FwCode
              css={ex.VALUED_CSS}
              cssFile="button.capsule.css"
              react={ex.VALUED_REACT}
              vanilla={ex.VALUED_VANILLA}
            />
            <DocNote type="info">
              The generated type for <code>intent</code> is{" "}
              <code>"primary" | "secondary" | "danger"</code>. TypeScript will
              catch any typos at compile time.
            </DocNote>
          </DocSection>

          {/* ── Boolean variants ──────────────────────────────────── */}
          <DocSection id="variants-boolean">
            <DocHeading>Boolean variants</DocHeading>
            <DocProse>
              A selector with no value — <code>:scope[data-loading]</code> — generates
              a <code>boolean</code> prop. Setting it to <code>true</code> adds the
              attribute to the element; <code>false</code> or <code>undefined</code>{" "}
              removes it.
            </DocProse>
            <FwCode
              css={ex.BOOL_CSS}
              cssFile="button.capsule.css"
              react={ex.BOOL_REACT}
              vanilla={ex.BOOL_VANILLA}
            />
          </DocSection>

          {/* ── Mixed variants ────────────────────────────────────── */}
          <DocSection id="variants-mixed">
            <DocHeading>Mixed variants</DocHeading>
            <DocProse>
              When both <code>:scope[data-size]</code> and{" "}
              <code>:scope[data-size="lg"]</code> exist for the same attribute,
              capsule-css generates a <em>mixed</em> type:{" "}
              <code>boolean | "sm" | "lg" | …</code>. Pass <code>true</code> to
              trigger the valueless selector (e.g. a default size) or a string for
              a specific value.
            </DocProse>
            <FwCode
              css={ex.MIXED_CSS}
              cssFile="avatar.capsule.css"
              react={ex.MIXED_REACT}
              vanilla={ex.MIXED_VANILLA}
            />
          </DocSection>

          {/* ── Selector forms ────────────────────────────────────── */}
          <DocSection id="variants-selectors">
            <DocHeading>Selector forms</DocHeading>
            <DocProse>
              The parser walks every selector starting at <code>:scope</code> and
              collects each <code>[data-*]</code> attribute that targets the
              scope element. All of these forms contribute typed props —
              including attributes declared <em>only</em> inside a chain or a
              functional pseudo-class.
            </DocProse>
            <DocSubheading>Recognized</DocSubheading>
            <Code filename="recognized.capsule.css" lang="css">{ex.SELECTORS_OK_CSS}</Code>
            <DocProse>
              <code>:not()</code>, <code>:is()</code>, and <code>:where()</code>{" "}
              are treated as transparent: their contents apply to the same{" "}
              <code>:scope</code> element, so attributes inside them are
              extracted as scope variants.
            </DocProse>

            <DocSubheading>Not extracted</DocSubheading>
            <Code filename="not-extracted.capsule.css" lang="css">{ex.SELECTORS_SKIP_CSS}</Code>
            <DocNote type="info">
              These are valid CSS but don't generate scope-level props.{" "}
              <code>:has()</code> is opaque on purpose — its contents describe
              descendants, not the scope element itself.
            </DocNote>

            <DocSubheading>Currently unsupported</DocSubheading>
            <DocProse>
              Substring-matching attribute selectors are recognized as CSS but
              skipped by the variant extractor — they yield no enum value:
            </DocProse>
            <Code filename="unsupported.capsule.css" lang="css">{ex.SELECTORS_UNSUPPORTED_CSS}</Code>
            <DocNote type="warning">
              The styles still apply at runtime, but <code>name</code> won't be
              exposed as a typed prop. Workaround: also add a discrete{" "}
              <code>:scope[data-name]</code> declaration (yields{" "}
              <code>name?: boolean</code>) or one{" "}
              <code>:scope[data-name="exact"]</code> per known value. A future
              version may add an "open string" variant for these.
            </DocNote>
          </DocSection>

          {/* ── Pseudo-classes ────────────────────────────────────── */}
          <DocSection id="pseudo-classes">
            <DocHeading>Pseudo-classes &amp; states</DocHeading>
            <DocProse>
              Use CSS nesting with <code>&amp;</code> to write pseudo-class rules
              inside the <code>:scope</code> block. No special syntax — it's
              standard CSS.
            </DocProse>
            <FwCode
              css={ex.PSEUDO_CSS}
              cssFile="input.capsule.css"
              react={ex.PSEUDO_REACT}
              vanilla={ex.PSEUDO_VANILLA}
            />
          </DocSection>

          {/* ── Pseudo-elements ───────────────────────────────────── */}
          <DocSection id="pseudo-elements">
            <DocHeading>Pseudo-elements</DocHeading>
            <DocProse>
              <code>::before</code> and <code>::after</code> work exactly as in
              regular CSS. Combine them with variants for expressive visual states
              without extra DOM nodes.
            </DocProse>
            <FwCode
              css={ex.PSEUDO_EL_CSS}
              cssFile="badge.capsule.css"
              react={ex.PSEUDO_EL_REACT}
              vanilla={ex.PSEUDO_EL_VANILLA}
            />
          </DocSection>

          {/* ── Nesting ───────────────────────────────────────────── */}
          <DocSection id="nesting">
            <DocHeading>Nesting</DocHeading>
            <DocProse>
              CSS nesting (<code>&amp;</code>) is fully supported inside{" "}
              <code>:scope</code>. Style child elements, add hover effects, and
              combine selectors — all without leaving the block.
            </DocProse>
            <FwCode
              css={ex.NESTING_CSS}
              cssFile="card.capsule.css"
              react={ex.NESTING_REACT}
              vanilla={ex.NESTING_VANILLA}
            />
            <DocNote type="info">
              <strong>Native, not transformed.</strong> capsule-css's parser
              doesn't touch <code>&amp;</code> — the body of every{" "}
              <code>:scope</code> block is passed through verbatim. Nesting
              works because it's a baseline CSS feature in Chrome 120+, Safari
              17.2+, and Firefox 117+ (all shipped in 2023). Same goes for
              every other CSS feature: <code>@media</code>, <code>@container</code>,
              <code>@keyframes</code>, custom properties, pseudo-elements — they
              all just work.
            </DocNote>
            <DocNote type="tip">
              For older browsers, add <code>postcss-nesting</code> to your
              PostCSS config — the build pipeline will expand{" "}
              <code>&amp;</code> automatically.
            </DocNote>
          </DocSection>

          {/* ── Responsive design ────────────────────────────────── */}
          <DocSection id="responsive">
            <DocHeading>Responsive design</DocHeading>
            <DocProse>
              Responsive styles in capsule-css are just CSS — there is no
              proprietary breakpoint system, no special syntax, no JS-side prop
              for "small / medium / large". Everything you can write in modern
              CSS works inside <code>:scope</code>.
            </DocProse>

            <DocSubheading>Media queries</DocSubheading>
            <DocProse>
              Write <code>@media</code> rules inside <code>:scope</code>. They
              apply only to that component and are deduplicated in the output
              CSS.
            </DocProse>
            <FwCode
              css={ex.MEDIA_CSS}
              cssFile="layout.capsule.css"
              react={ex.MEDIA_REACT}
              vanilla={ex.MEDIA_VANILLA}
            />
            <DocNote type="info">
              capsule-css doesn't ship breakpoints. Common conventions: mobile
              first (<code>min-width</code>), 640 / 768 / 1024 / 1280 (Tailwind),
              or 600 / 900 / 1200 (Material). Pick whatever fits your design
              system and keep it consistent across components.
            </DocNote>

            <DocSubheading>Container queries</DocSubheading>
            <DocProse>
              When a component must adapt to its parent's width (not the
              viewport), use <code>@container</code>. The component declares a
              container context on <code>:scope</code> and reads it inside.
            </DocProse>
            <Code filename="card.capsule.css" lang="css">{ex.CONTAINER_CSS}</Code>
            <DocNote type="info">
              Container queries are supported in all modern browsers (Chrome,
              Edge, Safari, Firefox 110+). They are the right tool whenever the
              same component needs to look different in a sidebar vs a main
              column — viewport-based media queries can't see that.
            </DocNote>

            <DocSubheading>Fluid sizing with clamp()</DocSubheading>
            <DocProse>
              For typography and spacing that should scale smoothly across
              breakpoints, use <code>clamp(min, preferred, max)</code> instead
              of stepped media queries. One declaration handles the whole range.
            </DocProse>
            <Code filename="hero.capsule.css" lang="css">{ex.FLUID_CSS}</Code>

            <DocSubheading>Accessibility-aware queries</DocSubheading>
            <DocProse>
              Respect user preferences for motion, contrast, and color scheme.
              These are media queries too — they sit alongside breakpoints in
              the same <code>:scope</code> block.
            </DocProse>
            <Code filename="modal.capsule.css" lang="css">{ex.A11Y_QUERIES_CSS}</Code>
            <DocNote type="warning">
              <code>prefers-reduced-motion</code> is the only one of these you
              should treat as mandatory in every animated component. The others
              (color scheme, contrast) usually live in your global theme rather
              than per-component.
            </DocNote>
          </DocSection>

          {/* ── Theming ───────────────────────────────────────────── */}
          <DocSection id="theming">
            <DocHeading>Theming with CSS variables</DocHeading>
            <DocProse>
              Define design tokens as CSS custom properties in your global
              stylesheet. Components consume them via <code>var()</code>. Dark mode
              is a single <code>@media</code> block on <code>:root</code> — no
              ThemeProvider, no runtime.
            </DocProse>
            <DocSubheading>Define tokens</DocSubheading>
            <Code filename="global.css" lang="css">{ex.THEMING_GLOBAL}</Code>
            <DocSubheading>Use in components</DocSubheading>
            <Code filename="components.capsule.css" lang="css">{ex.THEMING_CSS}</Code>
            <DocNote type="tip">
              Because the token swap happens entirely in CSS, dark mode works even
              when JavaScript is disabled or not yet loaded.
            </DocNote>
          </DocSection>

          {/* ── TypeScript ────────────────────────────────────────── */}
          <DocSection id="typescript">
            <DocHeading>TypeScript</DocHeading>
            <DocProse>
              capsule-css generates a <code>.d.ts</code> file alongside each{" "}
              <code>.capsule.css</code>. The props interface extends the correct HTML
              attributes type for the element declared with <code>@tag</code>.
            </DocProse>
            <DocSubheading>Input</DocSubheading>
            <Code filename="button.capsule.css" lang="css">{ex.TS_INPUT_CSS}</Code>
            <DocSubheading>Generated declarations</DocSubheading>
            <Code filename="button.capsule.css.d.ts" lang="typescript">{ex.TS_GENERATED_DTS}</Code>
            <DocSubheading>Extending generated types</DocSubheading>
            <DocProse>
              Import the generated interface to build on top of it — useful for
              wrapper components that add extra props.
            </DocProse>
            <Code filename="IconButton.tsx" lang="typescript">{ex.TS_EXTEND_REACT}</Code>
            <DocNote type="info">
              Declaration files are re-generated whenever the CSS structure changes.
              Commit them to source control so CI picks up type errors without
              running the compiler.
            </DocNote>
          </DocSection>

          {/* ── Production build ──────────────────────────────────── */}
          <DocSection id="production">
            <DocHeading>Production build</DocHeading>
            <DocProse>
              During <code>vite build</code> the plugin does three things:
              strips <code>@tag</code> directives, collects all{" "}
              <code>@scope</code> blocks into a single{" "}
              <code>capsule.css</code> asset, and injects a{" "}
              <code>&lt;link&gt;</code> into your <code>index.html</code>.
            </DocProse>
            <FwCode
              react={ex.PROD_CONFIG_REACT}
              reactFile="vite.config.ts"
              vanilla={ex.PROD_CONFIG_VANILLA}
              vanillaFile="vite.config.js"
            />
            <DocSubheading>Output structure</DocSubheading>
            <DocShell>{ex.PROD_OUTPUT}</DocShell>
            <DocNote type="tip">
              Pair the plugin with <code>autoprefixer</code> and{" "}
              <code>cssnano</code> in your PostCSS config for vendor prefixes and
              minification at no extra cost.
            </DocNote>
          </DocSection>

          {/* ── HMR ───────────────────────────────────────────────── */}
          <DocSection id="hmr">
            <DocHeading>HMR</DocHeading>
            <DocProse>
              capsule-css differentiates between two types of changes when a{" "}
              <code>.capsule.css</code> file is saved:
            </DocProse>
            <DocSubheading>CSS-only change</DocSubheading>
            <DocProse>
              Colour tweaks, spacing, transitions — anything that doesn't add or
              remove a variant. The plugin sends a <code>capsule-css:css-update</code>{" "}
              WebSocket event. The browser swaps the stylesheet in place without
              a full reload, so React state and scroll position are preserved.
            </DocProse>
            <DocSubheading>Structural change</DocSubheading>
            <DocProse>
              Adding a new variant or changing a component name updates the
              generated TypeScript declarations. The plugin invalidates the virtual
              module so Vite triggers a full module reload, ensuring the new props
              are available immediately.
            </DocProse>
            <DocNote type="info">
              The two-level HMR is automatic — no configuration needed. The plugin
              compares the old and new <code>.d.ts</code> string to decide which
              path to take.
            </DocNote>
          </DocSection>

          {/* ── Architecture ──────────────────────────────────────── */}
          <DocSection id="contrib-architecture">
            <DocHeading>Architecture</DocHeading>
            <DocProse>
              capsule-css splits cleanly into three layers. The compiler is text-in
              / text-out, written in Go. <code>@capsule-css/core</code> is a thin
              Node wrapper that resolves the right native binary and shells out to
              it. Bundler plugins wrap <code>core</code> to integrate with a
              specific dev/build pipeline.
            </DocProse>
            <Code filename="architecture" lang="bash">{ex.CONTRIB_ARCHITECTURE}</Code>
            <DocProse>
              The split means new bundlers and new framework targets are independent
              extension points. A new bundler doesn't touch the compiler; a new
              framework target doesn't touch any plugin.
            </DocProse>
            <DocNote type="info">
              The full contributor guide lives in{" "}
              <code>CONTRIBUTING.md</code> at the repo root. The sections below
              are a quick orientation.
            </DocNote>
          </DocSection>

          {/* ── Bundler plugin guide ──────────────────────────────── */}
          <DocSection id="contrib-bundler">
            <DocHeading>Build a bundler plugin</DocHeading>
            <DocProse>
              The Vite plugin in <code>packages/vite</code> is the reference
              implementation. A new plugin (Webpack, Rollup, esbuild, Rspack,
              Parcel, Bun, …) needs to do the same seven things.
            </DocProse>
            <DocSubheading>Required behavior</DocSubheading>
            <DocProse as="div">
              <ol>
                <li>
                  <strong>Intercept <code>.capsule.css</code> imports</strong> —
                  route them to your plugin via a virtual module. Do not let the
                  file go through the bundler's default CSS pipeline.
                </li>
                <li>
                  <strong>Compile to JS</strong> — call <code>compile()</code>{" "}
                  from <code>@capsule-css/core</code>. Return the <code>js</code>{" "}
                  string as the module body.
                </li>
                <li>
                  <strong>Aggregate <code>.d.ts</code></strong> — call{" "}
                  <code>compileTypes()</code> per file and merge into a single{" "}
                  <code>capsule.d.ts</code> at the project root, with one{" "}
                  <code>declare module</code> block per file using a wildcard
                  pattern.
                </li>
                <li>
                  <strong>Strip <code>@tag</code> from CSS output</strong> —
                  the directive must not reach production stylesheets.
                </li>
                <li>
                  <strong>Dev: inject CSS at runtime</strong> — append a{" "}
                  <code>&lt;style data-tss="..."&gt;</code> tag from inside the
                  generated module body.
                </li>
                <li>
                  <strong>Build: extract CSS to a single asset</strong> — emit
                  one <code>capsule.css</code> and inject the <code>&lt;link&gt;</code>{" "}
                  into all HTML entry points.
                </li>
                <li>
                  <strong>HMR with two semantics</strong> — CSS-only changes
                  hot-swap the style tag in place; structural changes (variant
                  added, tag renamed) invalidate the module for a full reload.
                </li>
              </ol>
            </DocProse>
            <DocSubheading>Plugin skeleton</DocSubheading>
            <DocProse>
              The shape of a bundler-agnostic plugin, in pseudocode:
            </DocProse>
            <Code filename="my-plugin.ts" lang="typescript">{ex.CONTRIB_PLUGIN_SKELETON}</Code>
            <DocNote type="info">
              Read{" "}
              <code>packages/vite/src/index.ts</code> for the working reference,
              then translate the hooks to your bundler's API. The compiler calls
              and HMR semantics are identical across bundlers.
            </DocNote>
          </DocSection>

          {/* ── Framework target guide ────────────────────────────── */}
          <DocSection id="contrib-target">
            <DocHeading>Add a framework target</DocHeading>
            <DocProse>
              Targets live in <code>internal/codegen/&lt;framework&gt;/</code> and
              are written in Go. The parser and the directive layer
              (<code>@scope</code>, <code>@tag</code>, variants) are shared — you
              only emit the framework-specific module and{" "}
              <code>.d.ts</code>.
            </DocProse>
            <DocSubheading>Conventions every target must honor</DocSubheading>
            <DocProse>
              These are what make capsule-css components interoperable across
              frameworks. Skip any of them and the same{" "}
              <code>.capsule.css</code> stops behaving the same way:
            </DocProse>
            <DocProse as="div">
              <ul>
                <li>
                  <strong>Class name</strong> — render with{" "}
                  <code>class="ComponentName"</code> exactly. User-supplied{" "}
                  <code>className</code> is concatenated, not replaced.
                </li>
                <li>
                  <strong>Variant attributes</strong> — emit{" "}
                  <code>data-X="value"</code> for valued variants,{" "}
                  <code>data-X=""</code> for boolean truthy, omit when{" "}
                  <code>undefined</code> / <code>false</code>.
                </li>
                <li>
                  <strong>Default tag</strong> — components default to{" "}
                  <code>&lt;div&gt;</code> if <code>@tag</code> is missing.
                </li>
                <li>
                  <strong>Polymorphic <code>as</code></strong> — components
                  should accept <code>as</code> to override <code>@tag</code>{" "}
                  per instance, with framework-appropriate type inference.
                </li>
                <li>
                  <strong>Conditional spreading</strong> — variant attributes
                  must use conditional spread so undefined values don't clobber
                  HTML attributes the user passed via{" "}
                  <code>...rest</code>.
                </li>
                <li>
                  <strong>Named exports only</strong> — one{" "}
                  <code>export function ComponentName</code> per{" "}
                  <code>@scope</code> block. No default exports.
                </li>
                <li>
                  <strong>No CSS injection from the component</strong> — the
                  bundler plugin owns CSS delivery. The component module only
                  sets attributes.
                </li>
              </ul>
            </DocProse>
            <DocSubheading>Required functions</DocSubheading>
            <Code filename="internal/codegen/myframework/myframework.go" lang="typescript">{ex.CONTRIB_TARGET_SKELETON}</Code>
            <DocSubheading>Wiring the target</DocSubheading>
            <DocProse>
              Add cases to the switch statements in{" "}
              <code>cmd/capsule/main.go</code> for both the{" "}
              <code>build</code> and <code>types</code> commands. Mirror the
              existing test structure in{" "}
              <code>internal/codegen/react/react_test.go</code>.
            </DocProse>
            <DocNote type="warning">
              Don't fork the parser. If you hit a CSS feature that doesn't
              survive the scanner, fix it in the shared parser instead of working
              around it in your codegen.
            </DocNote>
          </DocSection>

        </DocContent>
      </DocLayout>

      <Footer>
        <FooterLinks>
          <FooterLink href={url("/")}>Home</FooterLink>
          <FooterLink href={url("/starter.html")}>Starter</FooterLink>
          <FooterLink href={url("/agents.md")}>Agents</FooterLink>
          <FooterLink href="https://github.com/capsule-css/capsule-css" target="_blank" rel="noopener noreferrer">GitHub</FooterLink>
        </FooterLinks>
        <p>
          <picture>
            <source srcSet={url("/capsule-dark.png")} media="(prefers-color-scheme: dark)" />
            <img src={url("/capsule.png")} alt="" width="16" height="16" />
          </picture>
          {" "}Built with capsule-css ·{" "}
          <FooterCode>{"import { Footer } from './layout.capsule.css'"}</FooterCode>
        </p>
      </Footer>
    </>
  );
}

export default function DocsApp() {
  return (
    <FrameworkProvider>
      <DocApp />
    </FrameworkProvider>
  );
}
