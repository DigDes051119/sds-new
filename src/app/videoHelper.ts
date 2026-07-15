export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([^"&?\/ ]{11})/i);
  if (ytShortsMatch && ytShortsMatch[1]) return ytShortsMatch[1];

  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  if (ytMatch && ytMatch[1]) return ytMatch[1];

  return null;
}

export function getEmbedUrl(url: string): string {
  if (!url) return "";

  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`;
  }

  // Instagram Reel / Post / TV
  const igMatch = url.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    return `https://www.instagram.com/p/${igMatch[1]}/embed/`;
  }

  return url;
}

export function getAspectClass(aspect: string): string {
  switch (aspect) {
    case "9-16":
      return "aspect-[9/16] max-w-[450px] mx-auto";
    case "1-1":
      return "aspect-square max-w-[550px] mx-auto";
    case "16-9":
    default:
      return "aspect-video w-full";
  }
}
