import { useFramework } from "../lib/FrameworkContext";
import { Code } from "./Code";
import { FwSwitcher, FwBtn } from "../components/switcher.capsule.css";
import { CodePair } from "../components/code.capsule.css";

interface FwCodeProps {
  css?: string;
  cssFile?: string;
  react: string;
  reactFile?: string;
  vanilla: string;
  vanillaFile?: string;
}

export function FwCode({ css, cssFile, react, reactFile, vanilla, vanillaFile }: FwCodeProps) {
  const { fw, setFw } = useFramework();
  const code = fw === "react" ? react : vanilla;
  const file = fw === "react" ? (reactFile ?? "App.tsx") : (vanillaFile ?? "main.js");
  const lang = fw === "react" ? "typescript" : "javascript";

  const switcher = (
    <FwSwitcher style={{ marginBottom: 12 }}>
      <FwBtn data-active={fw === "react" || undefined} onClick={() => setFw("react")}>React</FwBtn>
      <FwBtn data-active={fw === "vanilla" || undefined} onClick={() => setFw("vanilla")}>Vanilla JS</FwBtn>
    </FwSwitcher>
  );

  if (css) {
    return (
      <>
        {switcher}
        <CodePair>
          <Code filename={cssFile ?? "component.capsule.css"} lang="css">{css}</Code>
          <Code filename={file} lang={lang}>{code}</Code>
        </CodePair>
      </>
    );
  }

  return (
    <>
      {switcher}
      <Code filename={file} lang={lang}>{code}</Code>
    </>
  );
}
