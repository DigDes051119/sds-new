const fs = require("fs");
const path = require("path");

const translateText = async (text, targetLang, sourceLang = "en") => {
  if (!text || !text.trim() || typeof text !== "string") return text;
  // If it's a number, url, image path or icon tag, don't translate
  if (text.startsWith("http") || text.includes("/") || /^\d+$/.test(text) || text.length <= 2) {
    return text;
  }
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return text;
    const data = await response.json();
    return data[0].map((x) => x[0]).join("");
  } catch (error) {
    return text;
  }
};

const translateObject = async (obj, targetLang) => {
  if (typeof obj === "string") {
    return await translateText(obj, targetLang);
  }
  if (Array.isArray(obj)) {
    const result = [];
    for (const item of obj) {
      result.push(await translateObject(item, targetLang));
    }
    return result;
  }
  if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await translateObject(value, targetLang);
    }
    return result;
  }
  return obj;
};

async function run() {
  const i18nPath = path.join(__dirname, "i18n.ts");
  let content = fs.readFileSync(i18nPath, "utf8");

  // We can mock the imports to evaluate translations object in JS
  // Or we can just import the parsed i18n translations by isolating it.
  // Actually, let's extract the translations.en section using JS string search, convert it to JSON-like object, translate it, and format it back!
  const startIdx = content.indexOf("en: {");
  const endIdx = content.indexOf("kg: {");
  
  if (startIdx === -1 || endIdx === -1) {
    console.error("Could not locate en or kg section");
    return;
  }

  const enBlock = content.substring(startIdx + 4, endIdx).trim();
  // Clean up trailing comma
  const cleanedEnBlock = enBlock.endsWith(",") ? enBlock.substring(0, enBlock.length - 1) : enBlock;
  
  // Evaluate the en block by wrapping in eval
  let enObj;
  try {
    enObj = eval(`(${cleanedEnBlock})`);
  } catch (e) {
    console.error("Failed to parse EN block", e);
    return;
  }

  console.log("Translating to Chinese (zh)...");
  const zhObj = await translateObject(enObj, "zh");
  console.log("Translating to Arabic (ar)...");
  const arObj = await translateObject(enObj, "ar");
  console.log("Translating to German (de)...");
  const deObj = await translateObject(enObj, "de");

  // Convert objects back to string format
  const formatObj = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const zhStr = `  zh: ${formatObj(zhObj)},\n`;
  const arStr = `  ar: ${formatObj(arObj)},\n`;
  const deStr = `  de: ${formatObj(deObj)},\n`;

  // Insert them into i18n.ts before the final closing brace of translations object
  const insertIndex = content.lastIndexOf("} as const;");
  if (insertIndex === -1) {
    console.error("Could not find } as const;");
    return;
  }

  const beforeInsert = content.substring(0, insertIndex);
  const afterInsert = content.substring(insertIndex);

  // We also need to add them to Language type and languageOptions at the top of the file!
  let updatedContent = beforeInsert.trim();
  if (!updatedContent.endsWith(",")) {
    updatedContent += ",";
  }
  updatedContent += "\n" + zhStr + arStr + deStr + "\n" + afterInsert;

  // Let's replace the Language type and languageOptions
  updatedContent = updatedContent.replace(
    `export type Language = "en" | "kg" | "ru";`,
    `export type Language = "en" | "kg" | "ru" | "zh" | "ar" | "de";`
  );

  updatedContent = updatedContent.replace(
    `export const languageOptions: { code: Language; label: string }[] = [\n  { code: "en", label: "EN" },\n  { code: "kg", label: "KG" },\n  { code: "ru", label: "RU" },\n];`,
    `export const languageOptions: { code: Language; label: string }[] = [\n  { code: "en", label: "EN" },\n  { code: "kg", label: "KG" },\n  { code: "ru", label: "RU" },\n  { code: "zh", label: "ZH" },\n  { code: "ar", label: "AR" },\n  { code: "de", label: "DE" },\n];`
  );

  fs.writeFileSync(i18nPath, updatedContent, "utf8");
  console.log("i18n.ts successfully updated with zh, ar, and de!");
}

run();
