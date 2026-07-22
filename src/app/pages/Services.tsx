import { useContext } from "react";
import { LanguageContext } from "../i18n";

export function Services() {
  const { t, locale } = useContext(LanguageContext);
  const services = t.services.items;

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title block */}
      <section className="border-b border-[#808080] pb-4 mb-[100px] grid grid-cols-1 md:grid-cols-12 gap-[28px] items-start w-auto">
        <div className="md:col-span-5">
          <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {t.services.title}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 block">
            [SERVICES/CAPABILITIES]
          </span>
        </div>
        <div className="md:col-span-7 md:pl-[59px] flex justify-end">
          <p className="text-[17px] leading-[1.44] text-black m-0 max-w-[500px]">
            {locale === "ru" 
              ? "Наши специализированные инженерные и дизайнерские решения." 
              : locale === "kg"
                ? "Биздин атайын инженердик жана дизайн чечимдерибиз."
                : "Our engineering and design systems designed to deliver uncompromising physical and digital experiences."}
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="flex flex-col gap-[80px]">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className={`grid grid-cols-1 md:grid-cols-12 gap-[28px] py-8 transition-all duration-300 group ${
              index === 0 ? '' : 'border-t border-[#808080]/30'
            }`}
          >
            {/* Service Number / Index */}
            <div className="md:col-span-4 flex flex-col gap-1">
              <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
                [{String(index + 1).padStart(2, '0')}/SERVICE]
              </span>
              <h2 className="text-[21px] font-bold leading-[1.40] tracking-[-0.21px] text-black group-hover:text-[#0000FF] transition-colors duration-300 m-0 uppercase pr-4">
                {service.title}
              </h2>
            </div>

            {/* Service details & Work stages */}
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <p className="text-[17px] leading-[1.44] text-black m-0 max-w-[500px]">
                  {service.desc}
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("sds:open-contact-modal"))}
                  className="shrink-0 w-full sm:w-auto border border-[#0000FF] text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.06em] cursor-pointer select-none text-center md:-mt-1"
                >
                  {locale === "ru" ? "Заказать услугу →" : locale === "kg" ? "Кызматка буйрутма берүү →" : "Order service →"}
                </button>
              </div>

              {service.steps && service.steps.length > 0 && (
                <div className="pt-8 mt-2 border-t border-[#808080]/15 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {service.steps.map((stepText: string, stepIdx: number) => (
                    <div key={stepIdx} className="flex flex-col gap-4">
                      <span className="font-mono text-[13px] text-[#0000FF] font-bold tracking-[0.04em] uppercase">
                        [0{stepIdx + 1}/STAGE]
                      </span>
                      <p className="text-[15px] leading-[1.5] text-black m-0 font-normal pr-4">
                        {stepText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
