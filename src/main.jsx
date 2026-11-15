import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter-tight";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/mockups.css";
import "./styles/effects.css";
import App from "./App.jsx";

if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
