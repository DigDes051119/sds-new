export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || !text.trim()) return "";
  const googleLang = targetLang === "kg" ? "ky" : targetLang;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=${googleLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Translation request failed");
    const data = await response.json();
    return data[0].map((x: any) => x[0]).join("");
  } catch (error) {
    console.error(`Failed to translate to ${targetLang}:`, error);
    return text;
  }
};
