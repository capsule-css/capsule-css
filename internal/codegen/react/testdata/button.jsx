import * as React from "react";

export const Button = React.forwardRef(function Button({ as, intent, size, className = "", ...rest }, ref) {
  const Tag = as ?? "button";
  const cls = ["Button", className].filter(Boolean).join(" ");
  return React.createElement(Tag, { ...rest, ref, className: cls, ...(intent !== undefined && { "data-intent": intent }), ...(size !== undefined && { "data-size": size }) });
});
