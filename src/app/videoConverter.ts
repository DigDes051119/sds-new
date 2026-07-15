// We load FFmpeg and utility helpers dynamically from a CDN (esm.sh) at runtime.
// This allows us to use FFmpeg.wasm without requiring any npm package installation,
// preventing "Access Denied" locked-file errors or package-lock issues.

async function loadFFmpegModules() {
  const { FFmpeg } = await import(
    /* @vite-ignore */ "https://esm.sh/@ffmpeg/ffmpeg@0.12.10"
  );
  const { fetchFile, toBlobURL } = await import(
    /* @vite-ignore */ "https://esm.sh/@ffmpeg/util@0.12.4"
  );
  return { FFmpeg, fetchFile, toBlobURL };
}

let ffmpegInstance: any = null;

async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance;

  const { FFmpeg, toBlobURL } = await loadFFmpegModules();
  const ffmpeg = new FFmpeg();

  // We use the single-thread version of ffmpeg-core (@ffmpeg/core-dist)
  // which runs without SharedArrayBuffer and doesn't require COOP/COEP HTTP headers.
  const baseURL = "https://unpkg.com/@ffmpeg/core-dist@0.1.1/dist/esm";
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

/**
 * Converts any video file to highly optimized, silent WebM format in the browser.
 */
export async function convertToWebM(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  const { fetchFile } = await loadFFmpegModules();
  const ffmpeg = await getFFmpeg();

  // Handle progress events
  const progressHandler = ({ progress }: { progress: number }) => {
    if (onProgress) {
      onProgress(Math.min(99, Math.round(progress * 100)));
    }
  };

  ffmpeg.on("progress", progressHandler);

  const inputName = `input_${Date.now()}`;
  // Extract extension or default to mp4
  const ext = file.name.split(".").pop() || "mp4";
  const inputFileName = `${inputName}.${ext}`;
  const outputFileName = `output_${Date.now()}.webm`;

  try {
    // Write original video file to virtual file system
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputFileName, fileData);

    // Convert video to WebM:
    // -c:v libvpx: VP8 WebM codec
    // -crf 33: constant rate factor (good quality-to-size balance)
    // -b:v 0: enable constant quality mode
    // -speed 5: speed encoding up (fastest encoding)
    // -an: remove audio track to save bandwidth (project videos are autoPlay muted anyway)
    await ffmpeg.exec([
      "-i",
      inputFileName,
      "-c:v",
      "libvpx",
      "-crf",
      "33",
      "-b:v",
      "0",
      "-speed",
      "5",
      "-an",
      outputFileName,
    ]);

    // Read converted WebM file
    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = data as Uint8Array;
    
    const webmBlob = new Blob([uint8Array.buffer], { type: "video/webm" });
    const originalBaseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const finalFileName = `${originalBaseName}.webm`;

    return new File([webmBlob], finalFileName, { type: "video/webm" });
  } finally {
    // Unsubscribe progress listener and clean up virtual files
    ffmpeg.off("progress", progressHandler);
    try {
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
    } catch (e) {
      // ignore deletion errors
    }
  }
}
