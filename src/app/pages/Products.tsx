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
      year: detail.year || "2026"
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
              <div className="w-full bg-[#191919] aspect-[4/3] overflow-hidden relative">
                <ImageWithFallback 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>

              {/* Meta details */}
              <div className="mt-[15px] flex justify-between items-start border-b border-[#808080] pb-[12px] group-hover:border-black transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080]">
                    [{String(index + 1).padStart(2, '0')}/PRODUCT]
                  </span>
                  <h2 className="text-[21px] font-normal leading-[1.40] tracking-[-0.21px] text-black m-0">
                    {product.name}
                  </h2>
                </div>
                <div className="text-right flex flex-col gap-1">
                  <span className="text-[16px] tracking-[0.04em] text-[#808080] uppercase">
                    {product.tags}
                  </span>
                  <span className="font-mono text-[16px] tracking-[0.04em] text-black">
                    {product.year}
                  </span>
                </div>
              </div>

            </Link>
          </div>
        ))}
      </section>

    </div>
  );
}
