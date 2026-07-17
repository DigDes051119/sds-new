import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";

export function Products() {
  const { t, locale } = useContext(LanguageContext);
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const localizedDetails = productDetails[locale] || productDetails["ru"] || {};
  const productsList = t.products?.items || [];
  
  const products = productsList.map((product: any) => {
    const detail = localizedDetails[product.id] || {};
    return {
      ...product,
      tags: detail.service || "Product",
      year: detail.year || "2026",
      desc: detail.desc || "",
      client: detail.client || "",
      studio: detail.studio || "-",
      designer: detail.designer || "-",
      location: detail.location || "-",
      projectType: detail.projectType || "-",
      class: detail.class || "-"
    };
  });

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="border-b border-[#808080] pb-4 mb-[100px] w-auto">
        <h1 className="text-[40px] md:text-[54px] font-normal leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0 lowercase">
          {t.products?.title || (locale === "ru" ? "продукты студии" : locale === "kg" ? "студиянын продукциялары" : "studio products")}
        </h1>
        <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 block">
          [PRODUCTS/CATALOGUE]
        </span>
      </section>

      {/* Products Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-[59px]">
        {products.map((product: any, index: number) => (
          <div key={product.id} className="w-full flex flex-col">
            <Link to={`/products/${product.id}`} className="group flex flex-col flex-1">
              
              {/* Image band container */}
              <div className="w-full bg-[#191919] overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                <ImageWithFallback 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>

              {/* Meta details — two columns with vertical divider */}
              <div className="mt-[20px] flex justify-between items-stretch gap-0">
                {/* Left column: title + tags + desc */}
                <div className="flex-[3] min-w-0 flex flex-col pr-5">
                  <h2 className="text-[28px] md:text-[34px] font-medium leading-[1.2] tracking-[-0.03em] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                    {product.name}
                  </h2>
                  {product.category && (
                    <span className="text-[12px] md:text-[13px] font-mono tracking-[0.1em] text-[#808080] uppercase mt-1 block">
                      {product.category}
                    </span>
                  )}

                  {/* Horizontal row of metadata (Category, Class, Year) without icons */}
                  <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6 mb-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {locale === "ru" ? "КАТЕГОРИЯ" : locale === "kg" ? "КАТЕГОРИЯ" : "CATEGORY"}
                      </span>
                      <span className="text-[14px] md:text-[15px] text-black font-normal mt-1">
                        {product.tags}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {locale === "ru" ? "КЛАСС" : locale === "kg" ? "КЛАСС" : "CLASS"}
                      </span>
                      <span className="text-[14px] md:text-[15px] text-black font-normal mt-1">
                        {product.class}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {locale === "ru" ? "ГОД" : locale === "kg" ? "ЖЫЛ" : "YEAR"}
                      </span>
                      <span className="text-[14px] md:text-[15px] text-black font-normal mt-1">
                        {product.year}
                      </span>
                    </div>
                  </div>

                  {product.desc && (
                    <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-3">
                      {product.desc}
                    </p>
                  )}
                </div>
                {/* Vertical divider */}
                <div className="w-[1px] bg-[#D0D0D0] shrink-0"></div>
                {/* Right column: index + metadata */}
                <div className="flex-[2] min-w-0 flex flex-col pl-5">

                  {/* Metadata rows with full-width borders */}
                  <div className="w-full flex flex-col">
                    {[
                      { label: t.productDetail?.labels?.project || "Project", value: String(index + 1).padStart(2, '0') },
                      { label: t.productDetail?.labels?.studio || "Studio", value: product.studio },
                      { label: t.productDetail?.labels?.designer || "Designer", value: product.designer },
                      { label: t.productDetail?.labels?.location || "Location", value: product.location },
                      { label: t.productDetail?.labels?.projectType || "Project Type", value: product.projectType },
                    ].map((item, rowIdx) => (
                      <div key={rowIdx} className="flex justify-between items-center py-2.5 border-b border-[#E5E5E5] gap-4">
                        <span className="font-mono text-[11px] md:text-[12px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                          {item.label}
                        </span>
                        <span className="text-[14px] md:text-[15px] text-black font-normal text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </Link>
          </div>
        ))}
      </section>

    </div>
  );
}
