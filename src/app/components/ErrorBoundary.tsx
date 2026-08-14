import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";
import { RotateCw, AlertTriangle, Home } from "lucide-react";

export function RouteErrorBoundary() {
  const error = useRouteError();

  // Check if it's a dynamic chunk loading error (happens after new deployments)
  const isChunkLoadError =
    error instanceof Error &&
    (error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed") ||
      error.message.includes("dynamically imported module") ||
      error.name === "ChunkLoadError");

  React.useEffect(() => {
    if (isChunkLoadError) {
      const lastReload = sessionStorage.getItem("last_chunk_reload");
      const now = Date.now();
      // Auto-reload once if not reloaded in the last 10 seconds
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem("last_chunk_reload", String(now));
        window.location.reload();
      }
    }
  }, [isChunkLoadError]);

  const handleReload = () => {
    sessionStorage.removeItem("last_chunk_reload");
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  let errorMessage = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="max-w-md w-full bg-[#141418] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">
          {isChunkLoadError ? "Обновление приложения" : "Что-то пошло не так"}
        </h1>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {isChunkLoadError
            ? "Вышла новая версия сайта. Обновите страницу, чтобы загрузить актуальные данные."
            : "Произошла ошибка при загрузке раздела. Попробуйте перезагрузить страницу."}
        </p>

        {errorMessage && !isChunkLoadError && (
          <div className="w-full mb-6 p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-500 font-mono text-left overflow-auto max-h-24">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-lg active:scale-95 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            Обновить страницу
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-sm transition-colors active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}
