export const translateText = async (text: string, targetLang: string, sourceLang: string = "ru"): Promise<string> => {
  if (!text || !text.trim()) return "";
  const langMap: Record<string, string> = {
    kg: "ky",
    zh: "zh-CN",
    ar: "ar",
    de: "de",
    ru: "ru",
    en: "en",
  };
  const googleTarget = langMap[targetLang] || targetLang;
  const googleSource = langMap[sourceLang] || sourceLang;
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

export const autoTranslateProjectAllLanguages = async (
  item: { name?: string; desc?: string; challenge?: string; service?: string; client?: string },
  sourceLang: string = "ru"
) => {
  const targetLangs = ["ru", "en", "kg", "zh", "ar", "de"] as const;
  const res: Record<string, typeof item> = {};

  for (const lang of targetLangs) {
    if (lang === sourceLang) {
      res[lang] = { ...item };
    } else {
      res[lang] = {
        name: item.name ? await translateText(item.name, lang, sourceLang) : "",
        desc: item.desc ? await translateText(item.desc, lang, sourceLang) : "",
        challenge: item.challenge ? await translateText(item.challenge, lang, sourceLang) : "",
        service: item.service ? await translateText(item.service, lang, sourceLang) : "",
        client: item.client ? await translateText(item.client, lang, sourceLang) : "",
      };
    }
  }

  return res;
};
