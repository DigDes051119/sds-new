import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { cmsService } from "../cmsService";
import { InlineVideoPlayer } from "../components/InlineVideoPlayer";

export function ProductDetail() {
  const { t, locale } = useContext(LanguageContext);
  const { id } = useParams();

  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const localeData = productDetails[locale] || productDetails.ru || {};
  const data = id && localeData[id]
    ? localeData[id]
    : { name: "", client: "", year: "", service: "", desc: "", challenge: "", results: [], collageBlocks: [] };

  const productsList = t.products?.items || [];
  const productListItem = productsList.find((p: any) => p.id === id);
  const coverImg = productListItem?.img || data.collageBlocks?.[0]?.[0] || "";

  const blocks: string[][] = data.collageBlocks && data.collageBlocks.length > 0
    ? data.collageBlocks
    : [];

  const parseResult = (text: string) => {
    const match = text.match(/(\d+%\s*(?:higher|reduction|увеличение|снижение|жогорулоо|төмөндөө)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i);
    if (match) {
      const stat = match[0];
      const desc = text.replace(stat, "").replace(/^[-–—:]\s*/, "").trim();
      return { stat, desc };
    }
    return { stat: "✓", desc: text };
  };

  return (
    <div className="w-full flex flex-col pb-[150px] gap-[80px]">
      
      {/* 1 БЛОК: Hero Section with Full-Width Cover and Overlay Metadata */}
      <section 
        data-theme="dark" 
        className="relative h-[94vh] min-h-[600px] w-[calc(100%+80px)] md:w-[calc(100%+160px)] mx-[-40px] md:mx-[-80px] mt-[-24px] bg-black flex flex-col justify-end px-[40px] md:px-[80px] pb-[40px] md:pb-[60px] overflow-hidden"
      >
        {/* Cover Image */}
        {coverImg && (
          <div className="absolute inset-0 w-full h-full">
            <ImageWithFallback
              src={coverImg}
              className="w-full h-full object-cover block opacity-80"
              alt={data.name || productListItem?.name || "Product Cover"}
              priority={true}
            />
            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>
        )}

        {/* Text and Metadata at the bottom, directly on the cover */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-end w-full">
          <div className="lg:col-span-7">
            {/* Back Button inside Hero */}
            <div className="mb-4">
              <Link 
                to="/products" 
                className="text-[14px] font-mono tracking-wider uppercase text-white/70 hover:text-white transition-colors"
              >
                &larr; {locale === "ru" ? "к продуктам" : "back to products"}
              </Link>
            </div>
            <h1 className="text-[48px] md:text-[72px] lg:text-[96px] font-normal leading-[1.0] tracking-[-0.04em] text-white m-0 uppercase">
              {data.name || productListItem?.name}
            </h1>
          </div>
          <div className="lg:col-span-5 flex flex-nowrap justify-end gap-8 md:gap-[48px] uppercase tracking-wider font-mono text-white">
            <div className="border-l border-white/40 pl-6 md:pl-8">
              <span className="text-white/50 block mb-2 text-[12px] md:text-[14px]">{locale === "ru" ? "Студия" : "Brand"}</span>
              <span className="font-normal text-[18px] md:text-[22px] tracking-tight block whitespace-nowrap">{data.client || "STEEL DRAKE"}</span>
            </div>
            <div>
              <span className="text-white/50 block mb-2 text-[12px] md:text-[14px]">{locale === "ru" ? "Год" : "Year"}</span>
              <span className="font-normal text-[18px] md:text-[22px] tracking-tight block whitespace-nowrap">{data.year || "2026"}</span>
            </div>
            <div>
              <span className="text-white/50 block mb-2 text-[12px] md:text-[14px]">{locale === "ru" ? "Категория" : "Category"}</span>
              <span className="font-normal text-[18px] md:text-[22px] tracking-tight block whitespace-nowrap">{data.service || "Product"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start pt-[10px]">
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase text-black m-0 leading-none">
            {locale === "ru" ? "задача и вызов" : locale === "kg" ? "маселе жана чакырык" : "challenge"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[01/CHALLENGE]</span>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <p className="text-[20px] md:text-[28px] font-light leading-[1.35] tracking-[-0.03em] text-black m-0">
            {data.challenge || data.desc}
          </p>
          {data.challenge && (
            <p className="text-[17px] leading-[1.5] text-[#808080] m-0 font-normal">
              {data.desc}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#808080] pt-8 mt-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[14px] text-[#808080] uppercase">[01/SCOPE]</span>
              <span className="text-[17px] text-black font-normal">{data.service || "Product Design & R&D"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[14px] text-[#808080] uppercase">[02/FOCUS]</span>
              <span className="text-[17px] text-black font-normal">
                {locale === "ru" 
                  ? "Удовлетворение потребностей рынка и создание нового пользовательского опыта." 
                  : locale === "kg" 
                    ? "Рыноктун муктаждыктарын канааттандыруу жана жаңы колдонуучу тажрыйбасын түзүү."
                    : "Addressing market needs and developing next-generation physical or digital user journeys."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Wall / Image Stack */}
      {blocks.length > 0 && (
        <section className="w-full flex flex-col gap-[4px] reveal-visible">
          {blocks.map((block: string[], blockIdx: number) => {
            if (!block || block.length === 0) return null;
            
            return (
              <div 
                key={blockIdx} 
                className={`grid w-full gap-[4px] ${
                  block.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                  block.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 
                  block.length === 4 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 
                  block.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' : 
                  'grid-cols-1'
                }`}
              >
                {block.map((imgUrl: string, imgIdx: number) => {
                  const isVideo = imgUrl?.startsWith("video:");
                  const videoUrl = isVideo ? imgUrl.slice(6) : "";

                  return (
                    <div key={`${blockIdx}-${imgIdx}`} className="w-full overflow-hidden bg-[#fafaf6] border border-[#808080]/10">
                      {isVideo ? (
                        <div className="w-full aspect-[16/9]">
                          <InlineVideoPlayer videoUrl={videoUrl} alt={`${data.name || "Product"} media`} />
                        </div>
                      ) : (
                        <ImageWithFallback
                          src={imgUrl}
                          className="w-full block object-contain"
                          alt={`${data.name || "Product"} process`}
                          loading="eager"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      )}

      {/* Results Section */}
      {data.results && data.results.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start border-t border-[#808080] pt-[40px] mt-8">
          {/* Left Column: Heading and Tag */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase text-black m-0 leading-none">
              {locale === "ru" ? "результаты" : locale === "kg" ? "натыйжалар" : "results"}
            </h2>
            <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[02/RESULTS]</span>
          </div>

          {/* Right Column: 2-column Card Grid */}
          <div className="lg:col-span-7 flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {data.results.map((result: string, idx: number) => {
                const parsed = parseResult(result);
                const isStat = parsed.stat !== "✓";
                const indexStr = String(idx + 1).padStart(2, "0");
                return (
                  <div 
                    key={idx} 
                    className="flex flex-col group gap-2"
                  >
                    {isStat ? (
                      <>
                        <span className="text-[48px] md:text-[60px] font-normal text-black leading-none tracking-tighter group-hover:text-[#0000FF] transition-colors duration-500">
                          {parsed.stat}
                        </span>
                        <p className="text-[16px] md:text-[17px] leading-[1.45] text-[#808080] group-hover:text-black transition-colors duration-500 m-0">
                          {parsed.desc}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-wider">
                          [{indexStr}/OUTCOME]
                        </span>
                        <p className="text-[18px] md:text-[22px] font-normal leading-[1.4] text-black group-hover:text-[#0000FF] transition-colors duration-500 m-0">
                          {parsed.desc}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Loop Previous / Next Product Navigation */}
      {(() => {
        const items = productsList;
        const currentIdx = items.findIndex((p: any) => p.id === id);
        if (currentIdx === -1 || items.length <= 1) return null;

        const prevIdx = (currentIdx - 1 + items.length) % items.length;
        const nextIdx = (currentIdx + 1) % items.length;
        
        const prevProduct = items[prevIdx];
        const nextProduct = items[nextIdx];

        const getProdCover = (pid: string) => {
          const pItem = items.find((p: any) => p.id === pid);
          const pDetail = localeData[pid];
          return pItem?.img || pDetail?.collageBlocks?.[0]?.[0] || null;
        };

        const getProdDesc = (pid: string) => {
          const detail = localeData[pid];
          return detail?.desc || detail?.challenge || '';
        };

        const tiles = [
          { dir: 'prev', product: prevProduct },
          { dir: 'next', product: nextProduct }
        ];

        return (
          <section className="w-full border-t border-[#808080] pt-[40px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px]">
              {tiles.map(({ dir, product }) => {
                const cover = getProdCover(product.id);
                const desc = getProdDesc(product.id);
                const label = dir === 'prev'
                  ? (locale === "ru" ? "предыдущий продукт" : "previous product")
                  : (locale === "ru" ? "следующий продукт" : "next product");
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group w-full border border-[#808080]/30 hover:border-black transition-colors flex flex-col"
                  >
                    {/* Cover Image */}
                    {cover && (
                      <div className="w-full aspect-[16/9] overflow-hidden bg-[#fafaf6] border-b border-[#808080]/30">
                        <img 
                          src={cover} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                      </div>
                    )}
                    
                    {/* Label & Details */}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-wider">{label}</span>
                        <h3 className="text-[28px] md:text-[38px] font-normal leading-tight tracking-[-0.03em] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-[15px] leading-relaxed text-[#808080] line-clamp-2 m-0">
                        {desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })()}

    </div>
  );
}
