import * as React from "react";

export type AccordionProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const Accordion = React.forwardRef(function Accordion({ as, className = "", ...rest }: AccordionProps<any>, ref: any) {
  const Tag = as ?? "div";
  const cls = ["Accordion", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls });
}) as <T extends React.ElementType = "div">(props: AccordionProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;

export type AccordionItemProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const AccordionItem = React.forwardRef(function AccordionItem({ as, className = "", ...rest }: AccordionItemProps<any>, ref: any) {
  const Tag = as ?? "div";
  const cls = ["AccordionItem", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls });
}) as <T extends React.ElementType = "div">(props: AccordionItemProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;

export type AccordionTriggerProps<T extends React.ElementType = "button"> = {
  as?: T;
  state?: "open" | "closed";
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "state">;

export const AccordionTrigger = React.forwardRef(function AccordionTrigger({ as, state, className = "", ...rest }: AccordionTriggerProps<any>, ref: any) {
  const Tag = as ?? "button";
  const cls = ["AccordionTrigger", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls, ...(state !== undefined && { "data-state": state }) });
}) as <T extends React.ElementType = "button">(props: AccordionTriggerProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;

export type AccordionContentProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const AccordionContent = React.forwardRef(function AccordionContent({ as, className = "", ...rest }: AccordionContentProps<any>, ref: any) {
  const Tag = as ?? "div";
  const cls = ["AccordionContent", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls });
}) as <T extends React.ElementType = "div">(props: AccordionContentProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;
