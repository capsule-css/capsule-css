export interface ButtonOptions<T extends keyof HTMLElementTagNameMap = "button"> {
  as?: T;
  intent?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: string | Node;
}
export function Button<T extends keyof HTMLElementTagNameMap = "button">(options?: ButtonOptions<T>): HTMLElementTagNameMap[T];
