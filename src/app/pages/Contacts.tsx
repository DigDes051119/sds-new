import { useContext } from "react";
import { LanguageContext } from "../i18n";
import { Map, MapMarker, MarkerContent } from "../components/ui/map";

export function Contacts() {
  const { t, locale } = useContext(LanguageContext);

  // IT Hub Technopark coordinates: Bishkek, 74.6186, 42.8710
  const longitude = 74.6186;
  const latitude = 42.8710;

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="border-b border-[#808080] pb-4 mb-[100px] grid grid-cols-1 md:grid-cols-12 gap-[28px] items-start w-auto">
        <div className="md:col-span-5">
          <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {t.contacts.title}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 block">
            [CONNECT/CONTACT]
          </span>
        </div>
        <div className="md:col-span-7 md:pl-[59px]">
          <p className="text-[17px] leading-[1.44] text-black m-0 max-w-[500px]">
            {locale === "ru" 
              ? "Свяжитесь с нами для обсуждения вашего проекта или сотрудничества." 
              : "Reach out to us to initiate a collaboration or learn more about our design monograph."}
          </p>
        </div>
      </section>

      {/* Contact Channels (Tabular Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-[28px] items-start mb-[100px]">
        <div className="md:col-span-5 select-none">
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
            [DIRECTORY]
          </span>
        </div>

        <div className="md:col-span-7 md:pl-[59px] flex flex-col w-full gap-8">
          
          {/* Write Us */}
          <div className="border-b border-[#808080] pb-6 flex flex-col gap-2">
            <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
              {t.contacts.writeUs}
            </span>
            <div>
              <a 
                href="mailto:contact@steeldrakestudio.com" 
                className="text-[21px] font-normal tracking-[-0.21px] text-black border-b border-[#808080] pb-1 hover:opacity-60 transition-opacity"
              >
                contact@steeldrakestudio.com
              </a>
            </div>
          </div>

          {/* Call Us */}
          <div className="border-b border-[#808080] pb-6 flex flex-col gap-2">
            <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
              {t.contacts.callUs}
            </span>
            <div>
              <a 
                href="https://wa.me/996702507888" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[21px] font-normal tracking-[-0.21px] text-black border-b border-[#808080] pb-1 hover:opacity-60 transition-opacity"
              >
                +996 702 507 888
              </a>
            </div>
          </div>

          {/* Office Address */}
          <div className="border-b border-[#808080] pb-6 flex flex-col gap-2">
            <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
              {t.contacts.officeTitle}
            </span>
            <div className="text-[17px] leading-[1.44] text-black whitespace-pre-line max-w-[400px]">
              {t.contacts.officeAddress}
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="w-full border border-[#808080] relative select-none">
        <div className="w-full h-[450px]">
          <Map
            viewport={{
              center: [longitude, latitude],
              zoom: 15,
              bearing: 0,
              pitch: 0
            }}
            theme="light"
          >
            <MapMarker longitude={longitude} latitude={latitude}>
              <MarkerContent>
                <div className="w-6 h-6 rounded-full bg-[#0000FF] border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
              </MarkerContent>
            </MapMarker>
          </Map>
        </div>
      </section>

    </div>
  );
}
