export function Accordion({ as, className = "", children } = {}) {
  const el = document.createElement(as ?? "div");
  el.className = ["Accordion", className].filter(Boolean).join(" ");
  if (children !== undefined) {
    if (typeof children === "string") el.textContent = children;
    else if (children instanceof Node) el.appendChild(children);
  }
  return el;
}

export function AccordionItem({ as, className = "", children } = {}) {
  const el = document.createElement(as ?? "div");
  el.className = ["AccordionItem", className].filter(Boolean).join(" ");
  if (children !== undefined) {
    if (typeof children === "string") el.textContent = children;
    else if (children instanceof Node) el.appendChild(children);
  }
  return el;
}

export function AccordionTrigger({ as, state, className = "", children } = {}) {
  const el = document.createElement(as ?? "button");
  el.className = ["AccordionTrigger", className].filter(Boolean).join(" ");
  if (state !== undefined) el.dataset.state = state;
  if (children !== undefined) {
    if (typeof children === "string") el.textContent = children;
    else if (children instanceof Node) el.appendChild(children);
  }
  return el;
}

export function AccordionContent({ as, className = "", children } = {}) {
  const el = document.createElement(as ?? "div");
  el.className = ["AccordionContent", className].filter(Boolean).join(" ");
  if (children !== undefined) {
    if (typeof children === "string") el.textContent = children;
    else if (children instanceof Node) el.appendChild(children);
  }
  return el;
}
