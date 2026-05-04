export function Button({ as, intent, size, className = "", children } = {}) {
  const el = document.createElement(as ?? "button");
  el.className = ["Button", className].filter(Boolean).join(" ");
  if (intent !== undefined) el.dataset.intent = intent;
  if (size !== undefined) el.dataset.size = size;
  if (children !== undefined) {
    if (typeof children === "string") el.textContent = children;
    else if (children instanceof Node) el.appendChild(children);
  }
  return el;
}
