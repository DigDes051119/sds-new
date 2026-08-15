import { useContext } from "react";
import { LanguageContext, getLocText } from "../i18n";
import { Map, MapMarker, MarkerContent } from "../components/ui/map";

export function Contacts() {
  const { t, locale } = useContext(LanguageContext);

  // IT Hub Technopark coordinates: Bishkek, 74.634200, 42.857150
  const longitude = 74.634200;
  const latitude = 42.857150;

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="border-b border-[#808080] pb-4 mb-[40px] md:mb-[100px] grid grid-cols-1 md:grid-cols-12 gap-[20px] md:gap-[28px] items-start w-auto">
        <div className="md:col-span-5">
          <h1 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {t.contacts.title}
          </h1>
          <span className="font-mono text-[13px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 block">
            [CONNECT/CONTACT]
          </span>
        </div>
        <div className="md:col-span-7 pl-0 md:pl-[59px]">
          <p className="text-[15px] sm:text-[17px] leading-[1.44] text-black m-0 max-w-[500px]">
            {getLocText(
              locale,
              "Свяжитесь с нами для обсуждения вашего проекта или сотрудничества.",
              "Reach out to us to initiate a collaboration or learn more about our design monograph.",
              "Долбооруңузду же кызматташууну талкуулоо үчүн биз менен байланышыңыз.",
              "与我们联系，讨论您的项目或合作事宜。",
              "تواصل معنا لمناقشة مشروعك أو التعاون.",
              "Nehmen Sie Kontakt mit uns auf, um Ihr Projekt или eine Zusammenarbeit zu besprechen."
            )}
          </p>
        </div>
      </section>

      {/* Contact Channels (Tabular Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-[20px] md:gap-[28px] items-start mb-[50px] md:mb-[100px]">
        <div className="md:col-span-5">
          <span className="font-mono text-[14px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase">
            [DIRECTORY]
          </span>
        </div>

        <div className="md:col-span-7 pl-0 md:pl-[59px] flex flex-col w-full gap-6 md:gap-8">
          
          {/* Write Us */}
          <div className="border-b border-[#808080] pb-5 sm:pb-6 flex flex-col gap-2">
            <span className="font-mono text-[13px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase">
              {t.contacts.writeUs}
            </span>
            <div>
              <a 
                href="mailto:contact@steeldrakestudio.com" 
                className="text-[17px] sm:text-[21px] font-normal tracking-[-0.21px] text-black border-b border-[#808080] pb-1 hover:opacity-60 transition-opacity break-all"
              >
                contact@steeldrakestudio.com
              </a>
            </div>
          </div>

          {/* Call Us */}
          <div className="border-b border-[#808080] pb-5 sm:pb-6 flex flex-col gap-2">
            <span className="font-mono text-[13px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase">
              {t.contacts.callUs}
            </span>
            <div>
              <a 
                href="https://wa.me/996702507888" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[17px] sm:text-[21px] font-normal tracking-[-0.21px] text-black border-b border-[#808080] pb-1 hover:opacity-60 transition-opacity"
              >
                +996 702 507 888
              </a>
            </div>
          </div>

          {/* Office Address */}
          <div className="border-b border-[#808080] pb-5 sm:pb-6 flex flex-col gap-2">
            <span className="font-mono text-[13px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase">
              {t.contacts.officeTitle}
            </span>
            <div className="text-[15px] sm:text-[17px] leading-[1.44] text-black whitespace-pre-line max-w-[400px]">
              {t.contacts.officeAddress}
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="w-full border border-[#808080] relative">
        <div className="w-full h-[320px] sm:h-[450px]">
          <Map
            viewport={{
              center: [longitude, latitude],
              zoom: 15,
              bearing: 0,
              pitch: 0
            }}
            theme="light"
            locale={locale}
          >
            <MapMarker longitude={longitude} latitude={latitude}>
              <MarkerContent>
                <div className="w-6 h-6 rounded-full bg-[#0000FF] border-2 border-white flex items-center justify-center animate-pulse">
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
