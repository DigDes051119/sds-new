import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { LanguageContext } from "../i18n";
import { cmsService } from "../cmsService";

export interface ProjectDetailData {
  name: string;
  desc: string;
  client: string;
  year: string;
  service: string;
  studio: string;
  designer: string;
  location: string;
  projectType: string;
  class: string;
  challenge: string;
  processImages: string[];
  collageBlocks: string[][];
  results: string[];
  resultsDesc: string;
  collageTheme?: string;
  videoUrl?: string;
}

import { cleanSlug, findInObjectCaseInsensitive, matchProjectKey } from "./slugUtils";
export { cleanSlug, findInObjectCaseInsensitive, matchProjectKey };

export function useProjectDetail(catalogType: "projects" | "products" | "concepts" | "architects" | "gamedev" | "webUiUx") {
  const { locale, t } = useContext(LanguageContext);
  const { id } = useParams();

  const [siteTranslations, setSiteTranslations] = useState(() => cmsService.getTranslations());
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setSiteTranslations(cmsService.getTranslations());
      setProductDetails(cmsService.getProductDetails());
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  const targetClean = id ? cleanSlug(id) : "";

  // 1. Find the catalog list items (with language fallbacks)
  const currentSection = (siteTranslations[locale] || siteTranslations.en || siteTranslations.ru || {})[catalogType];
  const items = ((currentSection?.items && currentSection.items.length > 0)
    ? currentSection.items
    : (siteTranslations.en?.[catalogType]?.items || siteTranslations.ru?.[catalogType]?.items || [])) as any[];

  const listItem = items.find((p: any) => cleanSlug(p.id) === targetClean || cleanSlug(p.name) === targetClean)
    || (siteTranslations.en?.[catalogType]?.items || []).find((p: any) => cleanSlug(p.id) === targetClean || cleanSlug(p.name) === targetClean)
    || (siteTranslations.ru?.[catalogType]?.items || []).find((p: any) => cleanSlug(p.id) === targetClean || cleanSlug(p.name) === targetClean)
    || (siteTranslations.kg?.[catalogType]?.items || []).find((p: any) => cleanSlug(p.id) === targetClean || cleanSlug(p.name) === targetClean);

  // 2. Find detail record (supporting both sds_project_details and sds_translations.productDetail)
  const isGeneralProject = catalogType === "projects" || catalogType === "webUiUx";

  const specificData = id ? (
    // Check productDetails (sds_translations productDetail.products / concepts)
    findInObjectCaseInsensitive(productDetails[locale], id) ||
    findInObjectCaseInsensitive(productDetails.en, id) ||
    findInObjectCaseInsensitive(productDetails.ru, id) ||
    findInObjectCaseInsensitive(siteTranslations[locale]?.productDetail?.products, id) ||
    findInObjectCaseInsensitive(siteTranslations.en?.productDetail?.products, id) ||
    findInObjectCaseInsensitive(siteTranslations.ru?.productDetail?.products, id) ||
    findInObjectCaseInsensitive(siteTranslations[locale]?.productDetail?.concepts, id) ||
    findInObjectCaseInsensitive(siteTranslations.en?.productDetail?.concepts, id) ||
    findInObjectCaseInsensitive(siteTranslations.ru?.productDetail?.concepts, id) ||
    // Check projectDetails (sds_project_details table)
    findInObjectCaseInsensitive(projectDetails[locale], id) ||
    findInObjectCaseInsensitive(projectDetails.en, id) ||
    findInObjectCaseInsensitive(projectDetails.ru, id)
  ) : null;

  const defaultName = id ? id.toUpperCase().replace(/-/g, " ") : "PROJECT";

  const data: ProjectDetailData = {
    name: specificData?.name || listItem?.name || defaultName,
    desc: (specificData?.desc && specificData.desc.trim()) || listItem?.desc || listItem?.challenge || "",
    client: specificData?.client || listItem?.client || (isGeneralProject ? "Client" : "Personal project"),
    year: specificData?.year || listItem?.year || "2026",
    service: specificData?.service || listItem?.service || (catalogType === "concepts" ? "Concept & Vision" : "Design"),
    studio: specificData?.studio || listItem?.studio || "Steel Drake Studio",
    designer: specificData?.designer || listItem?.designer || "Steel Drake Team",
    location: specificData?.location || listItem?.location || "International",
    projectType: specificData?.projectType || listItem?.projectType || "Concept",
    class: specificData?.class || listItem?.class || "Concept",
    challenge: (specificData?.challenge && specificData.challenge.trim()) || listItem?.challenge || "",
    processImages: (specificData?.processImages && specificData.processImages.length > 0)
      ? specificData.processImages
      : (listItem?.img ? [listItem.img] : []),
    collageBlocks: (specificData?.collageBlocks && specificData.collageBlocks.length > 0)
      ? specificData.collageBlocks
      : [],
    results: (specificData?.results && Array.isArray(specificData.results)) ? specificData.results : [],
    resultsDesc: specificData?.resultsDesc || "",
    collageTheme: specificData?.collageTheme || "light",
    videoUrl: specificData?.videoUrl || listItem?.videoUrl
  };

  const rawCollageBlocks: string[][] = data.collageBlocks && data.collageBlocks.length > 0
    ? data.collageBlocks
    : (data.processImages || []).map((img: string) => [img]);

  const [activeTab, setActiveTab] = useState<"gallery" | "video">("gallery");

  const hasVideos = rawCollageBlocks.some((block: string[]) =>
    block?.some((url: string) => url?.startsWith("video:") || url?.endsWith(".webm") || url?.endsWith(".mp4"))
  );

  const filteredBlocks = activeTab === "video"
    ? rawCollageBlocks
        .map((block: string[]) => block.filter((url: string) => url?.startsWith("video:") || url?.endsWith(".webm") || url?.endsWith(".mp4") || url?.startsWith("text:")))
        .filter((block: string[]) => block.length > 0)
    : rawCollageBlocks;

  const heroImage = listItem?.img || rawCollageBlocks[0]?.[0] || data.processImages[0] || "";

  return {
    id,
    locale,
    t,
    data,
    listItem,
    items,
    productDetails,
    projectDetails,
    collageBlocks: rawCollageBlocks,
    filteredBlocks,
    activeTab,
    setActiveTab,
    hasVideos,
    heroImage
  };
}
