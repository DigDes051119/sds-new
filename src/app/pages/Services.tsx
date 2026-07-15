import { useContext } from "react";
import { LanguageContext } from "../i18n";

export function Services() {
  const { t } = useContext(LanguageContext);
  const services = t.services.items;

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title block */}
      <section className="border-b border-[#808080] pb-4 mb-[100px] grid grid-cols-1 md:grid-cols-12 gap-[28px] items-start w-auto">
        <div className="md:col-span-5">
          <h1 className="text-[40px] md:text-[54px] font-normal leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0 lowercase">
            {t.services.title}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 block">
            [SERVICES/CAPABILITIES]
          </span>
        </div>
        <div className="md:col-span-7 md:pl-[59px]">
          <p className="text-[17px] leading-[1.44] text-black m-0 max-w-[500px]">
            {t.nav.services === "услуги" 
              ? "Наши специализированные инженерные и дизайнерские решения." 
              : "Our engineering and design systems designed to deliver uncompromising physical and digital experiences."}
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="flex flex-col gap-[80px]">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="grid grid-cols-1 md:grid-cols-12 gap-[28px] border-t border-[#808080] pt-[28px]"
          >
            {/* Service Number / Index */}
            <div className="md:col-span-5 flex flex-col gap-1">
              <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
                [{String(index + 1).padStart(2, '0')}/SERVICE]
              </span>
              <h2 className="text-[21px] font-normal leading-[1.40] tracking-[-0.21px] text-[#0000FF] m-0">
                {service.title}
              </h2>
            </div>

            {/* Service details */}
            <div className="md:col-span-7 md:pl-[59px] flex flex-col gap-4">
              <p className="text-[17px] leading-[1.44] text-black m-0 max-w-[500px]">
                {service.desc}
              </p>
              
              {service.steps && service.steps.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-[#808080]">
                  <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase block mb-2">
                    {t.nav.services === "услуги" ? "Процесс" : "Workflow"}
                  </span>
                  <div className="font-mono text-[16px] tracking-[0.04em] text-black uppercase leading-relaxed">
                    {service.steps.join(' / ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
