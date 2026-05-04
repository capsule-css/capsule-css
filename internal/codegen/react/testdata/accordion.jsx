import * as React from "react";

export const Accordion = React.forwardRef(function Accordion({ as, className = "", ...rest }, ref) {
  const Tag = as ?? "div";
  const cls = ["Accordion", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls });
});

export const AccordionItem = React.forwardRef(function AccordionItem({ as, className = "", ...rest }, ref) {
  const Tag = as ?? "div";
  const cls = ["AccordionItem", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls });
});

export const AccordionTrigger = React.forwardRef(function AccordionTrigger({ as, state, className = "", ...rest }, ref) {
  const Tag = as ?? "button";
  const cls = ["AccordionTrigger", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls, ...(state !== undefined && { "data-state": state }) });
});

export const AccordionContent = React.forwardRef(function AccordionContent({ as, className = "", ...rest }, ref) {
  const Tag = as ?? "div";
  const cls = ["AccordionContent", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls });
});
