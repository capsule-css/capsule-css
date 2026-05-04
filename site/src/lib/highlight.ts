import hljs from "highlight.js/lib/core";
import hljsCss from "highlight.js/lib/languages/css";
import hljsTs from "highlight.js/lib/languages/typescript";
import hljsJs from "highlight.js/lib/languages/javascript";
import hljsBash from "highlight.js/lib/languages/bash";
import hljsXml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("css", hljsCss);
hljs.registerLanguage("typescript", hljsTs);
hljs.registerLanguage("javascript", hljsJs);
hljs.registerLanguage("bash", hljsBash);
// JSX/TSX: the typescript and javascript grammars delegate tag bodies to
// the xml sub-language. Without this registration, JSX renders unhighlighted.
hljs.registerLanguage("xml", hljsXml);

export type Lang = "css" | "typescript" | "javascript" | "bash";

export function highlight(code: string, lang: Lang): string {
  return hljs.highlight(code.trim(), { language: lang }).value;
}
