export interface AccordionOptions<T extends keyof HTMLElementTagNameMap = "div"> {
  as?: T;
  className?: string;
  children?: string | Node;
}
export function Accordion<T extends keyof HTMLElementTagNameMap = "div">(options?: AccordionOptions<T>): HTMLElementTagNameMap[T];

export interface AccordionItemOptions<T extends keyof HTMLElementTagNameMap = "div"> {
  as?: T;
  className?: string;
  children?: string | Node;
}
export function AccordionItem<T extends keyof HTMLElementTagNameMap = "div">(options?: AccordionItemOptions<T>): HTMLElementTagNameMap[T];

export interface AccordionTriggerOptions<T extends keyof HTMLElementTagNameMap = "button"> {
  as?: T;
  state?: "open" | "closed";
  className?: string;
  children?: string | Node;
}
export function AccordionTrigger<T extends keyof HTMLElementTagNameMap = "button">(options?: AccordionTriggerOptions<T>): HTMLElementTagNameMap[T];

export interface AccordionContentOptions<T extends keyof HTMLElementTagNameMap = "div"> {
  as?: T;
  className?: string;
  children?: string | Node;
}
export function AccordionContent<T extends keyof HTMLElementTagNameMap = "div">(options?: AccordionContentOptions<T>): HTMLElementTagNameMap[T];
