
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Auto-handle new deployments / dynamic chunk load errors (production only with loop prevention)
if (!import.meta.env.DEV && typeof window !== "undefined") {
  const checkAndReload = () => {
    try {
      const reloadCount = parseInt(sessionStorage.getItem("sds_chunk_reload_count") || "0", 10);
      const lastReload = parseInt(sessionStorage.getItem("last_chunk_reload") || "0", 10);
      const now = Date.now();

      // Reset count if last reload was more than 30s ago
      if (now - lastReload > 30000) {
        sessionStorage.setItem("sds_chunk_reload_count", "1");
        sessionStorage.setItem("last_chunk_reload", String(now));
        window.location.reload();
        return;
      }

      // Max 2 reload attempts to avoid infinite looping
      if (reloadCount < 2) {
        sessionStorage.setItem("sds_chunk_reload_count", String(reloadCount + 1));
        sessionStorage.setItem("last_chunk_reload", String(now));
        window.location.reload();
      }
    } catch {
      // ignore
    }
  };

  window.addEventListener("vite:preloadError", checkAndReload);

  window.addEventListener("unhandledrejection", (event) => {
    const msg = String(event?.reason?.message || event?.reason || "");
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("error loading dynamically imported module")
    ) {
      checkAndReload();
    }
  });
}

// Purge any obsolete service workers to prevent Safari from serving old builds
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);

  