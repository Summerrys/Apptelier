import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const el =
  document.getElementById("apptelier-app") ||
  document.getElementById("root");

if (el) {
  ReactDOM.createRoot(el).render(<App />);
} else {
  console.error("Apptelier: mount element not found");
}

// Mount to WordPress shortcode container if present; otherwise fall back to CRA's default #root.
const mountNode =
  document.getElementById("apptelier-app") ||
  document.getElementById("root");

if (!mountNode) {
  // eslint-disable-next-line no-console
  console.error("[Apptelier] Mount element not found (#apptelier-app or #root).");
} else {
  const root = ReactDOM.createRoot(mountNode);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
