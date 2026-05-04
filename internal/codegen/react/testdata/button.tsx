import * as React from "react";

export type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  intent?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "size">;

export const Button = React.forwardRef(function Button({ as, intent, size, className = "", ...rest }: ButtonProps<any>, ref: any) {
  const Tag = as ?? "button";
  const cls = ["Button", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls, ...(intent !== undefined && { "data-intent": intent }), ...(size !== undefined && { "data-size": size }) });
}) as <T extends React.ElementType = "button">(props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;
