import { useEffect, useRef } from "react";
import { getYouTubeId, getEmbedUrl } from "../videoHelper";

export function InlineVideoPlayer({ videoUrl, alt }: { videoUrl: string; alt?: string }) {
  const ytId = getYouTubeId(videoUrl);
  const isInstagram = videoUrl.includes("instagram.com");
  const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg|mov|mov\?|mp4\?)(.*)?$/i) || videoUrl.startsWith("data:video");
  const embedUrl = getEmbedUrl(videoUrl);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!ytId || isDirectVideo || isInstagram) return;

    // Send play command to YouTube iframe to force start playing
    const timer = setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
      }
    }, 800);

    const interval = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [ytId, isDirectVideo, isInstagram]);

  if (isDirectVideo) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          title={alt || "Video Player"}
        />
      </div>
    );
  }

  if (isInstagram) {
    return (
      <div className="relative w-full h-full bg-[#111] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full" style={{ overflow: "hidden" }}>
          <iframe
            src={`${embedUrl}?autoplay=1&mute=1`}
            className="absolute border-0"
            style={{
              top: "-45px",
              left: "0",
              width: "100%",
              height: "calc(100% + 90px)",
              pointerEvents: "none",
            }}
            allowFullScreen
            scrolling="no"
            title="Instagram Reel"
          />
        </div>
      </div>
    );
  }

  // YouTube player: autoplay and loop immediately, hide all UI (controls=0, pointer-events-none)
  // We use scale(1.5) to push black bars and overlays out of bounds
  const finalEmbedUrl = embedUrl.includes("?") 
    ? `${embedUrl}&autoplay=1&mute=1&controls=0&playsinline=1&showinfo=0&rel=0&enablejsapi=1`
    : `${embedUrl}?autoplay=1&mute=1&controls=0&playsinline=1&showinfo=0&rel=0&enablejsapi=1`;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center pointer-events-none">
      <iframe
        ref={iframeRef}
        src={finalEmbedUrl}
        className="absolute border-0 pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          transform: "scale(1.5)",
          transformOrigin: "center center",
        }}
        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        title={alt || "Video Player"}
      />
    </div>
  );
}
