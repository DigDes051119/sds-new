
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Auto-handle new deployments / dynamic chunk load errors
window.addEventListener("vite:preloadError", (event) => {
  const lastReload = sessionStorage.getItem("last_chunk_reload");
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem("last_chunk_reload", String(now));
    window.location.reload();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const msg = String(event?.reason?.message || event?.reason || "");
  if (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module")
  ) {
    const lastReload = sessionStorage.getItem("last_chunk_reload");
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem("last_chunk_reload", String(now));
      window.location.reload();
    }
  }
});

createRoot(document.getElementById("root")!).render(<App />);

  