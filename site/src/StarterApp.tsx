import React, { useState, useMemo, useCallback } from "react";
import "./components/layout.capsule.css";
import "./components/starter.capsule.css";

import { Nav, NavInner, NavBrandGroup, NavBrand, NavAlpha, NavLinks, NavLink, NavGitHub, Footer, FooterCode } from "./components/layout.capsule.css";
import {
  StarterLayout, StarterHeader, StarterHeaderTitle, StarterHeaderSub,
  StarterPanel, StarterPanelTitle,
  TokenGroup, TokenGroupLabel, TokenRow, TokenSwatch, TokenInput, TokenLabel,
  PresetRow, PresetBtn,
  ComponentGroup, ComponentGroupLabel, ComponentCheckbox, ComponentCheckboxInput, ComponentCheckboxDesc,
  StarterOutput, StarterOutputToolbar, StarterOutputTabs, StarterOutputTab,
  StarterOutputActions, StarterActionBtn, StarterCode, StarterPreview,
  PreviewSection, PreviewSectionLabel, PreviewRow,
  StarterLinesCount,
  ThemeToggle,
  PropsAccordion, PropsToggle, PropsChevron, PropsPanel,
  PropRow, PropLabel, PropInput, PropPills, PropPill, PropSectionLabel,
} from "./components/starter.capsule.css";

import {
  Tokens, PRESETS, COMPONENTS, ComponentId, generateCSS,
  AllComponentProps, DEFAULT_COMPONENT_PROPS,
  STACK_GAP_PRESETS, FLEX_GAP_PRESETS,
} from "./lib/starterGenerator";
import { highlight } from "./lib/highlight";

// ─── Token field definitions ──────────────────────────────────────────────────

const TOKEN_GROUPS: { label: string; fields: { key: keyof Tokens; label: string; isColor?: boolean }[] }[] = [
  {
    label: "Colors",
    fields: [
      { key: "colorPrimary",      label: "Primary",      isColor: true },
      { key: "colorPrimaryHover", label: "Primary hover", isColor: true },
      { key: "colorDanger",       label: "Danger",        isColor: true },
      { key: "colorText",         label: "Text",          isColor: true },
      { key: "colorTextMuted",    label: "Text muted",    isColor: true },
      { key: "colorSurface",      label: "Surface",       isColor: true },
      { key: "colorBorder",       label: "Border",        isColor: true },
    ],
  },
  {
    label: "Radius",
    fields: [
      { key: "radiusSm", label: "sm" },
      { key: "radiusMd", label: "md" },
      { key: "radiusLg", label: "lg" },
    ],
  },
  {
    label: "Spacing",
    fields: [
      { key: "spacingBase", label: "Base unit" },
    ],
  },
  {
    label: "Shadows",
    fields: [
      { key: "shadowSm", label: "sm" },
      { key: "shadowMd", label: "md" },
    ],
  },
];

// ─── Component groups ─────────────────────────────────────────────────────────

const COMPONENT_GROUPS = Array.from(
  COMPONENTS.reduce((map, c) => {
    if (!map.has(c.group)) map.set(c.group, []);
    map.get(c.group)!.push(c);
    return map;
  }, new Map<string, typeof COMPONENTS>()),
);

// ─── Props accordion per component ───────────────────────────────────────────

function TypographyPropsPanel({
  props, onChange,
}: {
  props: AllComponentProps["typography"];
  onChange: (k: keyof AllComponentProps["typography"], v: string) => void;
}) {
  const fields: { key: keyof typeof props; label: string }[] = [
    { key: "h1",      label: "H1" },
    { key: "h2",      label: "H2" },
    { key: "h3",      label: "H3" },
    { key: "h4",      label: "H4" },
    { key: "body",    label: "Body" },
    { key: "lead",    label: "Lead" },
    { key: "caption", label: "Caption" },
  ];
  return (
    <>
      <PropSectionLabel data-first="">Font sizes</PropSectionLabel>
      {fields.map(({ key, label }) => (
        <PropRow key={key}>
          <PropLabel>{label}</PropLabel>
          <PropInput
            value={props[key]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(key, e.target.value)}
            spellCheck={false}
          />
        </PropRow>
      ))}
    </>
  );
}

function ButtonPropsPanel({
  props, onChange,
}: {
  props: AllComponentProps["button"];
  onChange: (k: keyof AllComponentProps["button"], v: string) => void;
}) {
  return (
    <>
      <PropSectionLabel data-first="">Padding (V / H)</PropSectionLabel>
      {(["Sm", "Md", "Lg"] as const).map((s) => {
        const vKey = `padding${s}V` as keyof AllComponentProps["button"];
        const hKey = `padding${s}H` as keyof AllComponentProps["button"];
        return (
          <PropRow key={s}>
            <PropLabel>{s}</PropLabel>
            <PropInput value={props[vKey]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(vKey, e.target.value)} spellCheck={false} />
            <PropInput value={props[hKey]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(hKey, e.target.value)} spellCheck={false} />
          </PropRow>
        );
      })}
      <PropSectionLabel>Font sizes</PropSectionLabel>
      {(["Sm", "Md", "Lg"] as const).map((s) => {
        const key = `fontSize${s}` as keyof AllComponentProps["button"];
        return (
          <PropRow key={key}>
            <PropLabel>{s}</PropLabel>
            <PropInput value={props[key]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(key, e.target.value)} spellCheck={false} />
          </PropRow>
        );
      })}
    </>
  );
}

function GapPropsPanel({
  value, presets, onChange,
}: {
  value: string;
  presets: string[];
  onChange: (v: string) => void;
}) {
  return (
    <>
      <PropSectionLabel data-first="">Default gap</PropSectionLabel>
      <PropPills>
        {presets.map((p) => (
          <PropPill
            key={p}
            onClick={() => onChange(p)}
            {...(value === p ? { "data-active": "" } : {})}
          >{p}</PropPill>
        ))}
      </PropPills>
      <PropRow style={{ marginTop: "6px" }}>
        <PropLabel>Custom</PropLabel>
        <PropInput
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          spellCheck={false}
        />
      </PropRow>
    </>
  );
}

function ContainerPropsPanel({
  value, onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const presets = ["960px", "1024px", "1200px", "1280px", "1440px"];
  return (
    <>
      <PropSectionLabel data-first="">Max width</PropSectionLabel>
      <PropPills>
        {presets.map((p) => (
          <PropPill
            key={p}
            onClick={() => onChange(p)}
            {...(value === p ? { "data-active": "" } : {})}
          >{p}</PropPill>
        ))}
      </PropPills>
      <PropRow style={{ marginTop: "6px" }}>
        <PropLabel>Custom</PropLabel>
        <PropInput
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          spellCheck={false}
        />
      </PropRow>
    </>
  );
}

// ─── Dark mode hook ───────────────────────────────────────────────────────────

function useSystemDark(): boolean {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return dark;
}

// ─── Live preview ─────────────────────────────────────────────────────────────

function LivePreview({
  light, dark, isDark, selected, compProps,
}: {
  light: Tokens; dark: Tokens; isDark: boolean;
  selected: Set<ComponentId>;
  compProps: AllComponentProps;
}) {
  const t = isDark ? dark : light;

  const vars = {
    "--color-primary":       t.colorPrimary,
    "--color-primary-hover": t.colorPrimaryHover,
    "--color-danger":        t.colorDanger,
    "--color-text":          t.colorText,
    "--color-text-muted":    t.colorTextMuted,
    "--color-surface":       t.colorSurface,
    "--color-border":        t.colorBorder,
    "--color-focus":         t.colorFocus,
    "--font-sans":           t.fontSansSerif,
    "--radius-sm":           t.radiusSm,
    "--radius-md":           t.radiusMd,
    "--radius-lg":           t.radiusLg,
    "--space":               t.spacingBase,
    "--shadow-sm":           t.shadowSm,
    "--shadow-md":           t.shadowMd,
    "--transition-fast":     t.transitionFast,
  } as React.CSSProperties;

  const bp = compProps.button;

  return (
    <StarterPreview style={{ ...vars, background: t.colorSurface }}>
      {selected.has("typography") && (
        <PreviewSection>
          <PreviewSectionLabel>Typography</PreviewSectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(["h1","h2","h3","h4","body","lead","caption"] as const).map((k) => {
              const styles: React.CSSProperties = {
                fontFamily: "var(--font-sans)",
                fontSize: compProps.typography[k],
                color: (k === "lead" || k === "caption") ? "var(--color-text-muted)" : "var(--color-text)",
                fontWeight: k === "h1" ? 800 : k === "h2" ? 700 : k === "h3" ? 700 : k === "h4" ? 600 : 400,
                lineHeight: k === "h1" ? 1.1 : k === "h2" ? 1.2 : k === "h3" ? 1.3 : 1.6,
                letterSpacing: k === "h1" ? "-0.03em" : k === "h2" ? "-0.02em" : undefined,
              };
              const labels: Record<string, string> = {
                h1: "H1 — Display heading", h2: "H2 — Section heading",
                h3: "H3 — Subsection", h4: "H4 — Label",
                body: "Body — Standard paragraph text", lead: "Lead — Intro paragraph",
                caption: "Caption — Auxiliary text",
              };
              return <div key={k} style={styles}>{labels[k]}</div>;
            })}
          </div>
        </PreviewSection>
      )}

      {selected.has("link") && (
        <PreviewSection>
          <PreviewSectionLabel>Link</PreviewSectionLabel>
          <PreviewRow>
            <a href="#" style={{ color: "var(--color-primary)", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }} onClick={(e: React.MouseEvent) => e.preventDefault()}>Default link</a>
            <a href="#" style={{ color: "var(--color-primary)", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: "var(--font-sans)", fontSize: "0.875rem", opacity: 0.75 }} onClick={(e: React.MouseEvent) => e.preventDefault()}>Hovered</a>
          </PreviewRow>
        </PreviewSection>
      )}

      {(selected.has("button") || selected.has("buttonlink")) && (
        <PreviewSection>
          <PreviewSectionLabel>Button</PreviewSectionLabel>
          <PreviewRow>
            {(["primary", "outline", "ghost", "danger"] as const).map((intent) => (
              <button key={intent} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-sans)", fontWeight: 600,
                padding: `${bp.paddingMdV} ${bp.paddingMdH}`,
                fontSize: bp.fontSizeMd,
                borderRadius: "var(--radius-md)",
                border: "1.5px solid transparent", cursor: "pointer",
                ...(intent === "primary"  ? { background: "var(--color-primary)", borderColor: "var(--color-primary)", color: "#fff" } : {}),
                ...(intent === "outline"  ? { background: "transparent", borderColor: "var(--color-border)", color: "var(--color-text)" } : {}),
                ...(intent === "ghost"    ? { background: "transparent", borderColor: "transparent", color: "var(--color-text-muted)" } : {}),
                ...(intent === "danger"   ? { background: "var(--color-danger)", borderColor: "var(--color-danger)", color: "#fff" } : {}),
              }}>{intent.charAt(0).toUpperCase() + intent.slice(1)}</button>
            ))}
          </PreviewRow>
          <PreviewRow>
            {(["sm", "md", "lg"] as const).map((size) => (
              <button key={size} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-sans)", fontWeight: 600, cursor: "pointer",
                background: "var(--color-primary)", borderColor: "var(--color-primary)", color: "#fff",
                border: "1.5px solid transparent",
                borderRadius: size === "lg" ? "var(--radius-lg)" : size === "sm" ? "var(--radius-sm)" : "var(--radius-md)",
                padding: size === "sm" ? `${bp.paddingSmV} ${bp.paddingSmH}` : size === "lg" ? `${bp.paddingLgV} ${bp.paddingLgH}` : `${bp.paddingMdV} ${bp.paddingMdH}`,
                fontSize: size === "sm" ? bp.fontSizeSm : size === "lg" ? bp.fontSizeLg : bp.fontSizeMd,
              }}>Size {size}</button>
            ))}
          </PreviewRow>
        </PreviewSection>
      )}

      {selected.has("flex") && (
        <PreviewSection>
          <PreviewSectionLabel>Flex</PreviewSectionLabel>
          <div style={{ display: "flex", gap: compProps.flex.gap, flexWrap: "wrap" }}>
            {["A", "B", "C", "D"].map((l) => (
              <div key={l} style={{ padding: "8px 16px", background: "var(--color-border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text)" }}>{l}</div>
            ))}
          </div>
        </PreviewSection>
      )}

      {selected.has("stack") && (
        <PreviewSection>
          <PreviewSectionLabel>Stack</PreviewSectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: compProps.stack.gap }}>
            {["Stack item 1", "Stack item 2", "Stack item 3"].map((l) => (
              <div key={l} style={{ padding: "6px 12px", background: "var(--color-border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text)" }}>{l}</div>
            ))}
          </div>
        </PreviewSection>
      )}

      {selected.has("container") && (
        <PreviewSection>
          <PreviewSectionLabel>Container</PreviewSectionLabel>
          <div style={{ border: "1.5px dashed var(--color-border)", borderRadius: "var(--radius-md)", padding: "12px 16px", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Container — max-width {compProps.container.maxWidth}, centered, fluid padding
          </div>
        </PreviewSection>
      )}

      {selected.size === 0 && (
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-muted)", textAlign: "center", paddingTop: "48px" }}>
          Select components on the left to see a preview.
        </div>
      )}
    </StarterPreview>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function StarterApp() {
  const systemDark = useSystemDark();
  const [manualDark, setManualDark] = useState<boolean | null>(null);
  const isDark = manualDark !== null ? manualDark : systemDark;

  const [preset, setPreset]     = useState<string>("Neutral");
  const [lightTokens, setLight] = useState<Tokens>({ ...PRESETS["Neutral"].light });
  const [darkTokens,  setDarkT] = useState<Tokens>({ ...PRESETS["Neutral"].dark });
  const [selected, setSelected] = useState<Set<ComponentId>>(
    new Set(COMPONENTS.map((c) => c.id))
  );
  const [compProps, setCompProps] = useState<AllComponentProps>({ ...DEFAULT_COMPONENT_PROPS });
  const [openProps, setOpenProps] = useState<Set<ComponentId>>(new Set());
  const [tab, setTab]     = useState<"source" | "preview">("preview");
  const [copied, setCopied] = useState(false);

  const css = useMemo(
    () => generateCSS(lightTokens, darkTokens, selected, compProps),
    [lightTokens, darkTokens, selected, compProps]
  );
  const lineCount = useMemo(() => css.split("\n").length, [css]);

  const applyPreset = useCallback((name: string) => {
    setPreset(name);
    setLight({ ...PRESETS[name].light });
    setDarkT({ ...PRESETS[name].dark });
  }, []);

  const updateToken = useCallback((key: keyof Tokens, value: string) => {
    setPreset("Custom");
    if (isDark) {
      setDarkT((prev) => ({ ...prev, [key]: value }));
    } else {
      setLight((prev) => ({ ...prev, [key]: value }));
    }
  }, [isDark]);

  const toggleComponent = useCallback((id: ComponentId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleProps = useCallback((id: ComponentId) => {
    setOpenProps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const updateCompProp = useCallback(<K extends keyof AllComponentProps>(
    section: K,
    key: keyof AllComponentProps[K],
    value: string,
  ) => {
    setCompProps((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [css]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([css], { type: "text/css" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "starter.capsule.css"; a.click();
    URL.revokeObjectURL(url);
  }, [css]);

  // Map component IDs to their props panel (only for components that have one)
  function renderPropsPanel(id: ComponentId) {
    if (!openProps.has(id)) return null;
    switch (id) {
      case "typography":
        return (
          <TypographyPropsPanel
            props={compProps.typography}
            onChange={(k, v) => updateCompProp("typography", k, v)}
          />
        );
      case "button":
      case "buttonlink":
        return (
          <ButtonPropsPanel
            props={compProps.button}
            onChange={(k, v) => updateCompProp("button", k, v)}
          />
        );
      case "flex":
        return (
          <GapPropsPanel
            value={compProps.flex.gap}
            presets={FLEX_GAP_PRESETS}
            onChange={(v) => updateCompProp("flex", "gap", v)}
          />
        );
      case "stack":
        return (
          <GapPropsPanel
            value={compProps.stack.gap}
            presets={STACK_GAP_PRESETS}
            onChange={(v) => updateCompProp("stack", "gap", v)}
          />
        );
      case "container":
        return (
          <ContainerPropsPanel
            value={compProps.container.maxWidth}
            onChange={(v) => updateCompProp("container", "maxWidth", v)}
          />
        );
      default:
        return null;
    }
  }

  const HAS_PROPS = new Set<ComponentId>(["typography", "button", "buttonlink", "flex", "stack", "container"]);

  return (
    <>
      <Nav>
        <NavInner>
          <NavBrandGroup>
            <NavBrand href="/">💊 capsule-css</NavBrand>
            <NavAlpha>alpha</NavAlpha>
          </NavBrandGroup>
          <NavLinks>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/docs.html">Docs</NavLink>
            <NavLink href="/agents.md">Agents</NavLink>
            <NavGitHub href="https://github.com/capsule-css/capsule-css" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </NavGitHub>
          </NavLinks>
        </NavInner>
      </Nav>

      <StarterLayout>
        <StarterHeader>
          <StarterHeaderTitle>Starter</StarterHeaderTitle>
          <StarterHeaderSub>
            Configure your design tokens, pick your components, and download a ready-to-use{" "}
            <code style={{ fontSize: "13px" }}>starter.capsule.css</code> file.
          </StarterHeaderSub>
        </StarterHeader>

        {/* ── Tokens panel ── */}
        <StarterPanel>
          <StarterPanelTitle>Tokens</StarterPanelTitle>

          <PresetRow>
            {Object.keys(PRESETS).map((name) => (
              <PresetBtn
                key={name}
                onClick={() => applyPreset(name)}
                {...(preset === name ? { "data-active": "" } : {})}
              >{name}</PresetBtn>
            ))}
            {preset === "Custom" && <PresetBtn data-active="">Custom</PresetBtn>}
          </PresetRow>

          {TOKEN_GROUPS.map((group) => (
            <TokenGroup key={group.label}>
              <TokenGroupLabel>{group.label}</TokenGroupLabel>
              {group.fields.map(({ key, label, isColor }) => {
                const tokenValue = isDark ? darkTokens[key] : lightTokens[key];
                return (
                  <TokenRow key={key}>
                    {isColor && (
                      <TokenSwatch style={{ background: tokenValue }}>
                        <input
                          type="color"
                          value={tokenValue.startsWith("#") ? tokenValue : "#000000"}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateToken(key, e.target.value)}
                        />
                      </TokenSwatch>
                    )}
                    <TokenLabel>{label}</TokenLabel>
                    <TokenInput
                      value={tokenValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateToken(key, e.target.value)}
                      spellCheck={false}
                    />
                  </TokenRow>
                );
              })}
            </TokenGroup>
          ))}
        </StarterPanel>

        {/* ── Components panel ── */}
        <StarterPanel>
          <StarterPanelTitle>Components</StarterPanelTitle>

          {COMPONENT_GROUPS.map(([group, items]) => (
            <ComponentGroup key={group}>
              <ComponentGroupLabel>{group}</ComponentGroupLabel>
              {items.map((c) => (
                <div key={c.id}>
                  <ComponentCheckbox>
                    <ComponentCheckboxInput
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleComponent(c.id)}
                    />
                    {c.label}
                  </ComponentCheckbox>
                  <ComponentCheckboxDesc>{c.description}</ComponentCheckboxDesc>
                  {HAS_PROPS.has(c.id) && selected.has(c.id) && (
                    <PropsAccordion>
                      <PropsToggle
                        onClick={() => toggleProps(c.id)}
                        {...(openProps.has(c.id) ? { "data-open": "" } : {})}
                      >
                        <PropsChevron {...(openProps.has(c.id) ? { "data-open": "" } : {})}>▶</PropsChevron>
                        Properties
                      </PropsToggle>
                      <PropsPanel {...(openProps.has(c.id) ? { "data-open": "" } : {})}>
                        {renderPropsPanel(c.id)}
                      </PropsPanel>
                    </PropsAccordion>
                  )}
                </div>
              ))}
            </ComponentGroup>
          ))}
        </StarterPanel>

        {/* ── Output panel ── */}
        <StarterOutput>
          <StarterOutputToolbar>
            <StarterOutputTabs>
              <StarterOutputTab
                onClick={() => setTab("preview")}
                {...(tab === "preview" ? { "data-active": "" } : {})}
              >Preview</StarterOutputTab>
              <StarterOutputTab
                onClick={() => setTab("source")}
                {...(tab === "source" ? { "data-active": "" } : {})}
              >Source</StarterOutputTab>
            </StarterOutputTabs>

            <StarterOutputActions>
              <ThemeToggle
                onClick={() => setManualDark(!isDark)}
                {...(isDark ? { "data-mode": "dark" } : {})}
              >
                {isDark ? "☀ Light" : "◑ Dark"}
              </ThemeToggle>
              {tab === "source" && <StarterLinesCount>{lineCount} lines</StarterLinesCount>}
              <StarterActionBtn
                onClick={handleCopy}
                {...(copied ? { "data-copied": "" } : {})}
              >{copied ? "Copied!" : "Copy"}</StarterActionBtn>
              <StarterActionBtn data-intent="primary" onClick={handleDownload}>
                Download
              </StarterActionBtn>
            </StarterOutputActions>
          </StarterOutputToolbar>

          {tab === "source" ? (
            <StarterCode dangerouslySetInnerHTML={{ __html: highlight(css, "css") }} />
          ) : (
            <LivePreview
              light={lightTokens}
              dark={darkTokens}
              isDark={isDark}
              selected={selected}
              compProps={compProps}
            />
          )}
        </StarterOutput>
      </StarterLayout>

      <Footer>
        <p>
          Built with 💊 capsule-css ·{" "}
          <FooterCode>{"import { Button } from './starter.capsule.css'"}</FooterCode>
        </p>
      </Footer>
    </>
  );
}
