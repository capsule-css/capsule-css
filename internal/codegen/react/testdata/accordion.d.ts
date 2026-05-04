import type * as React from "react";

export type AccordionProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const Accordion: <T extends React.ElementType = "div">(props: AccordionProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;

export type AccordionItemProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const AccordionItem: <T extends React.ElementType = "div">(props: AccordionItemProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;

export type AccordionTriggerProps<T extends React.ElementType = "button"> = {
  as?: T;
  state?: "open" | "closed";
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "state">;

export const AccordionTrigger: <T extends React.ElementType = "button">(props: AccordionTriggerProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;

export type AccordionContentProps<T extends React.ElementType = "div"> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const AccordionContent: <T extends React.ElementType = "div">(props: AccordionContentProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;
