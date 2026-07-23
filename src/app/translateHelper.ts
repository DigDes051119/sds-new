export const translateText = async (text: string, targetLang: string, sourceLang: string = "ru"): Promise<string> => {
  if (!text || !text.trim()) return "";
  const googleTarget = targetLang === "kg" ? "ky" : targetLang;
  const googleSource = sourceLang === "kg" ? "ky" : sourceLang;
  if (googleSource === googleTarget) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${googleSource}&tl=${googleTarget}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Translation request failed");
    const data = await response.json();
    return data[0].map((x: any) => x[0]).join("");
  } catch (error) {
    console.error(`Failed to translate from ${sourceLang} to ${targetLang}:`, error);
    return text;
  }
};
