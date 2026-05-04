import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import StarterApp from "./StarterApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarterApp />
  </StrictMode>
);
