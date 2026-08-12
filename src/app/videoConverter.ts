/**
 * Native Browser HTML5 Canvas + MediaRecorder WebM Video Converter.
 * 100% Offline & Hardware-Accelerated (Zero network/CDN requests required).
 */
export async function convertToWebMNative(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;

    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      let width = video.videoWidth || 1920;
      let height = video.videoHeight || 1080;

      // Scale to max 1920px width for fast hardware encoding & optimal high-quality WebM size
      if (width > 1920) {
        height = Math.round((height * 1920) / width);
        width = 1920;
      }
      // Dimensions must be even numbers
      width = width - (width % 2);
      height = height - (height % 2);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      const fps = 30;
      const stream = canvas.captureStream(fps);

      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 16000000 // 16 Mbps ultra-high quality WebM
        });
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(videoUrl);
        const webmBlob = new Blob(chunks, { type: "video/webm" });
        const originalBaseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const finalFileName = `${originalBaseName}.webm`;
        const resultFile = new File([webmBlob], finalFileName, { type: "video/webm" });
        resolve(resultFile);
      };

      let animId: number;
      const duration = video.duration || 1;

      function renderFrame() {
        if (video.paused || video.ended) return;
        ctx?.drawImage(video, 0, 0, width, height);

        if (onProgress) {
          const pct = Math.min(99, Math.round((video.currentTime / duration) * 100));
          onProgress(pct);
        }

        animId = requestAnimationFrame(renderFrame);
      }

      video.onended = () => {
        cancelAnimationFrame(animId);
        if (onProgress) onProgress(100);
        setTimeout(() => {
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        }, 150);
      };

      recorder.start(100);
      video.play().then(() => {
        renderFrame();
      }).catch((err) => {
        URL.revokeObjectURL(videoUrl);
        reject(err);
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error("Не удалось загрузить видео в браузер для конвертации."));
    };
  });
}

// Fallback WASM Helpers (if native recorder is unavailable)
export async function fetchFile(file: File | Blob | string): Promise<Uint8Array> {
  if (file instanceof File || file instanceof Blob) {
    return new Uint8Array(await file.arrayBuffer());
  }
  if (typeof file === "string") {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status} when fetching ${file}`);
    return new Uint8Array(await res.arrayBuffer());
  }
  throw new Error("Invalid file input");
}

export async function toBlobURL(url: string, mimeType: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`);
  const blob = await res.blob();
  return URL.createObjectURL(new Blob([blob], { type: mimeType }));
}

async function loadFFmpegClass() {
  const cdnList = [
    "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm/index.js",
    "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/+esm",
    "https://esm.sh/@ffmpeg/ffmpeg@0.12.10"
  ];

  for (const url of cdnList) {
    try {
      const mod = await import(/* @vite-ignore */ url);
      if (mod && mod.FFmpeg) return mod.FFmpeg;
    } catch (e) {
      console.warn(`Failed loading FFmpeg class from ${url}:`, e);
    }
  }

  throw new Error("Не удалось загрузить библиотеку FFmpeg.");
}

let ffmpegInstance: any = null;

async function loadFFmpegCoreBlob(baseURL: string) {
  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");
  return { coreURL, wasmURL };
}

async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance;

  const FFmpegClass = await loadFFmpegClass();
  const ffmpeg = new FFmpegClass();

  const cdnList = [
    "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm",
    "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm",
    "https://unpkg.com/@ffmpeg/core-dist@0.1.1/dist/esm"
  ];

  let loaded = false;
  let lastErr: any = null;

  for (const baseURL of cdnList) {
    try {
      const { coreURL, wasmURL } = await loadFFmpegCoreBlob(baseURL);
      await ffmpeg.load({ coreURL, wasmURL });
      loaded = true;
      break;
    } catch (e) {
      console.warn(`Failed loading FFmpeg core from ${baseURL}:`, e);
      lastErr = e;
    }
  }

  if (!loaded) {
    throw new Error(`Не удалось загрузить видеоконвертер FFmpeg: ${lastErr?.message || lastErr || "ошибка сети"}`);
  }

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

/**
 * Main WebM Video Conversion Entry Point.
 * 1. Tries Native Offline Browser Canvas + MediaRecorder (100% reliable, zero network).
 * 2. Falls back to FFmpeg WASM if native converter fails.
 */
export async function convertToWebM(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  // If file is already a WebM video, return immediately
  if (file.type === "video/webm" || file.name.endsWith(".webm")) {
    if (onProgress) onProgress(100);
    return file;
  }

  // 1. Try Native Offline Hardware-Accelerated Browser Conversion (0 Network Requests!)
  try {
    return await convertToWebMNative(file, onProgress);
  } catch (nativeErr) {
    console.warn("Native browser conversion failed, trying WASM FFmpeg...", nativeErr);
  }

  // 2. Fallback to FFmpeg WASM Converter
  const ffmpeg = await getFFmpeg();

  const progressHandler = ({ progress }: { progress: number }) => {
    if (onProgress) {
      onProgress(Math.min(99, Math.round(progress * 100)));
    }
  };

  ffmpeg.on("progress", progressHandler);

  const inputName = `input_${Date.now()}`;
  const ext = file.name.split(".").pop() || "mp4";
  const inputFileName = `${inputName}.${ext}`;
  const outputFileName = `output_${Date.now()}.webm`;

  try {
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputFileName, fileData);

    await ffmpeg.exec([
      "-i",
      inputFileName,
      "-c:v",
      "libvpx",
      "-crf",
      "20",
      "-b:v",
      "0",
      "-speed",
      "5",
      "-an",
      outputFileName,
    ]);

    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = data as Uint8Array;
    
    const webmBlob = new Blob([uint8Array.buffer], { type: "video/webm" });
    const originalBaseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const finalFileName = `${originalBaseName}.webm`;

    return new File([webmBlob], finalFileName, { type: "video/webm" });
  } finally {
    ffmpeg.off("progress", progressHandler);
    try {
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
    } catch (e) {
      // ignore deletion errors
    }
  }
}

/**
 * Extracts a frame at 0.5s from the video file and exports it as a JPEG File.
 */
export async function extractVideoFrame(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    video.onloadeddata = () => {
      video.currentTime = 0.5;
    };

    video.onseeked = () => {
      try {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(videoUrl);
          reject(new Error("Failed to get canvas 2d context"));
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(videoUrl);
          if (blob) {
            const originalBaseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const coverFile = new File([blob], `${originalBaseName}_cover.jpg`, { type: "image/jpeg" });
            resolve(coverFile);
          } else {
            reject(new Error("Failed to export canvas to blob"));
          }
        }, "image/jpeg", 0.9);
      } catch (err) {
        URL.revokeObjectURL(videoUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error("Failed to load video for frame extraction."));
    };
  });
}
