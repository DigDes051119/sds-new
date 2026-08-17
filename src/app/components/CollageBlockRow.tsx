import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { InlineVideoPlayer } from "./InlineVideoPlayer";
import { TextBlockRenderer, parseTextBlock } from "./TextBlockRenderer";

interface CollageBlockRowProps {
  block: string[];
  blockIdx: number;
  projectName?: string;
}

export function CollageBlockRow({ block, blockIdx, projectName = "Project" }: CollageBlockRowProps) {
  if (!block || block.length === 0) return null;

  // Handle Text Block
  if (block[0]?.startsWith("text:")) {
    const textData = parseTextBlock(block[0]);
    return textData ? <TextBlockRenderer key={blockIdx} data={textData} /> : null;
  }

  const items = block.filter(Boolean);
  if (items.length === 0) return null;

  // Single Item: Full width with max-height constraint
  if (items.length === 1) {
    const imgUrl = items[0];
    const isVideo = imgUrl?.startsWith("video:") || imgUrl?.endsWith(".webm") || imgUrl?.endsWith(".mp4");
    const videoUrl = isVideo ? (imgUrl.startsWith("video:") ? imgUrl.slice(6) : imgUrl) : "";

    return (
      <div className="w-full flex items-center justify-center overflow-hidden">
        {isVideo ? (
          <div className="w-full flex items-center justify-center max-h-[88vh]">
            <InlineVideoPlayer videoUrl={videoUrl} alt={`${projectName} media`} />
          </div>
        ) : (
          <ImageWithFallback
            src={imgUrl}
            className="w-full h-auto max-h-[88vh] block max-w-full object-contain"
            alt={`${projectName} process`}
            loading="eager"
          />
        )}
      </div>
    );
  }

  // Multiple Items (2-5): Justified Row Layout (equal row height on desktop, stacked on mobile)
  const getRowHeightClass = (count: number) => {
    if (count === 2) return "md:h-[500px] lg:h-[620px] xl:h-[700px]";
    if (count === 3) return "md:h-[420px] lg:h-[540px] xl:h-[620px]";
    if (count === 4) return "md:h-[360px] lg:h-[460px] xl:h-[540px]";
    return "md:h-[320px] lg:h-[420px] xl:h-[480px]";
  };

  return (
    <div
      className={`w-full flex flex-col md:flex-row items-center justify-center gap-[12px] ${getRowHeightClass(
        items.length
      )}`}
    >
      {items.map((imgUrl, imgIdx) => {
        const isVideo = imgUrl?.startsWith("video:") || imgUrl?.endsWith(".webm") || imgUrl?.endsWith(".mp4");
        const videoUrl = isVideo ? (imgUrl.startsWith("video:") ? imgUrl.slice(6) : imgUrl) : "";

        return (
          <div
            key={`${blockIdx}-${imgIdx}`}
            className="w-full md:w-auto h-auto md:h-full md:flex-1 min-w-0 max-w-full flex items-center justify-center overflow-hidden"
          >
            {isVideo ? (
              <div className="w-full h-auto md:w-auto md:h-full max-w-full max-h-full flex items-center justify-center">
                <InlineVideoPlayer videoUrl={videoUrl} alt={`${projectName} media ${imgIdx + 1}`} />
              </div>
            ) : (
              <ImageWithFallback
                src={imgUrl}
                className="w-full h-auto md:w-auto md:h-full max-w-full max-h-full object-contain block select-none"
                alt={`${projectName} process ${imgIdx + 1}`}
                loading="eager"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
