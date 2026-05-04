import type * as React from "react";

export type ButtonProps<T extends React.ElementType = "button"> = {
  as?: T;
  intent?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "intent" | "size">;

export const Button: <T extends React.ElementType = "button">(props: ButtonProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] }) => React.ReactElement | null;
