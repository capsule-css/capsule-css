import { Button } from "./button.capsule.css";

const root = document.getElementById("root");
root.style.cssText = "font-family:sans-serif;padding:32px;background:#f7fafc;min-height:100vh;display:flex;flex-direction:column;gap:32px";

// intent
const s1 = document.createElement("section");
const h1 = document.createElement("h2");
h1.textContent = "Button — intent";
h1.style.cssText = "margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#718096";
const row1 = document.createElement("div");
row1.style.cssText = "display:flex;gap:8px;align-items:center";
row1.append(
  Button({ intent: "primary",   children: "Primary" }),
  Button({ intent: "secondary", children: "Secondary" }),
  Button({ intent: "danger",    children: "Danger" }),
);
s1.append(h1, row1);

// size
const s2 = document.createElement("section");
const h2 = document.createElement("h2");
h2.textContent = "Button — size";
h2.style.cssText = h1.style.cssText;
const row2 = document.createElement("div");
row2.style.cssText = row1.style.cssText;
row2.append(
  Button({ intent: "primary", size: "sm", children: "Small" }),
  Button({ intent: "primary", size: "md", children: "Medium" }),
  Button({ intent: "primary", size: "lg", children: "Large" }),
);
s2.append(h2, row2);

root.append(s1, s2);
