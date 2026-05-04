import { highlight, type Lang } from "../lib/highlight";
import {
  CodeBlock, CodeHeader, CodeDot, CodeFilename, CodePre,
} from "./code.capsule.css";
import { Badge } from "./badge.capsule.css";

type BadgeIntent = "react" | "vanilla" | "css" | "go" | "ts";

interface CodeProps {
  filename: string;
  lang: Lang;
  badge?: BadgeIntent;
  children: string;
}

export function Code({ filename, lang, badge, children }: CodeProps) {
  return (
    <CodeBlock>
      <CodeHeader>
        <CodeDot color="red" />
        <CodeDot color="yellow" />
        <CodeDot color="green" />
        <CodeFilename>{filename}</CodeFilename>
        {badge && (
          <Badge intent={badge} style={{ marginLeft: "auto" }}>
            {badge === "react" ? "React" : badge.toUpperCase()}
          </Badge>
        )}
      </CodeHeader>
      <CodePre dangerouslySetInnerHTML={{ __html: highlight(children, lang) }} />
    </CodeBlock>
  );
}
