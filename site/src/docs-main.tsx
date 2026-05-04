import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import DocsApp from "./DocsApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DocsApp />
  </StrictMode>
);
