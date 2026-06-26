import { motion } from "motion/react";
import { useContext } from "react";
import { LanguageContext } from "../i18n";
import { Map, MapMarker, MarkerContent, MapPopup } from "../components/ui/map";
import { MapPin } from "lucide-react";

export function Contacts() {
  const { t, locale } = useContext(LanguageContext);

  const scrollRevealConfig = {
    initial: { y: 40, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }
  };

  // Technopark coordinates: [lng, lat]
  const technoparkCoords: [number, number] = [74.6337947, 42.8569854];

  return (
    <div
      className="max-w-[1380px] mx-auto px-6 min-[1380px]:px-0 pt-20 pb-32 md:pb-20 flex flex-col gap-20 md:gap-32 text-black"
    >
      <motion.h1 
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[1.08] text-[#0000FF]"
      >
        {t.contacts.title}
      </motion.h1>

      <div className="grid lg:grid-cols-2 gap-16 md:gap-20">
        {/* Contact Info */}
        <motion.div 
          {...scrollRevealConfig}
          className="flex flex-col gap-12 md:gap-16"
        >
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.writeUs}</h3>
            <a href="mailto:contact@steeldrakestudio.com" className="text-lg sm:text-2xl md:text-3xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block break-all sm:break-normal">
              contact@steeldrakestudio.com
            </a>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.callUs}</h3>
            <a href="https://wa.me/996702507888" target="_blank" rel="noopener noreferrer" className="text-xl sm:text-2xl md:text-3xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              +996 702 507 888
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.officeTitle}</h3>
            <a 
              href="https://www.google.com/maps/place/IT+-+Hub+Technopark/@42.8571582,74.6336433,413m/data=!3m1!1e3!4m15!1m8!3m7!1s0x389eb649ed50dd4f:0xfa828968edacc1ba!2zMS8yINGD0LsuINCT0L7RgNGM0LrQvtCz0L4sINCR0LjRiNC60LXQuiA3MjAwMDE!3b1!8m2!3d42.856828!4d74.6180463!16s%2Fg%2F11ym4g96dn!3m5!1s0x389eb73dd9a2891f:0x8d714c952939f7fc!8m2!3d42.8569854!4d74.6337947!16s%2Fg%2F11tsp7r28d?hl=ru&entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl md:text-3xl font-light whitespace-pre-line hover:text-[#0000FF] transition-colors interactive-element inline-block"
            >
              {t.contacts.officeAddress}
            </a>
          </div>


        </motion.div>

        {/* Interactive Map (Using mapcn component wrapper around MapLibre GL) */}
        <motion.div 
          {...scrollRevealConfig}
          className="h-[600px] bg-[#eeeee9] rounded-3xl overflow-hidden relative border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.06)]"
        >
          <Map
            theme="light"
            viewport={{
              center: technoparkCoords,
              zoom: 15.5,
              bearing: 0,
              pitch: 0,
            }}
            className="w-full h-full"
          >
            <MapMarker
              longitude={technoparkCoords[0]}
              latitude={technoparkCoords[1]}
            >
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full bg-[#0000FF]/25 animate-ping" />
                  <div className="relative w-5 h-5 rounded-full bg-[#0000FF] border-2 border-white shadow-[0_2px_12px_rgba(0,0,255,0.4)]" />
                </div>
              </MarkerContent>

              {/* MapPopup translations matching locale selection */}
              <MapPopup closeOnClick={false} anchor="left" offset={16} permanent={true}>
                <a
                  href="https://www.google.com/maps/place/IT+-+Hub+Technopark/@42.8571582,74.6336433,413m/data=!3m1!1e3!4m15!1m8!3m7!1s0x389eb649ed50dd4f:0xfa828968edacc1ba!2zMS8yINGD0LsuINCT0L7RgNGM0LrQvtCz0L4sINCR0LjRiNC60LXQuiA3MjAwMDE!3b1!8m2!3d42.856828!4d74.6180463!16s%2Fg%2F11ym4g96dn!3m5!1s0x389eb73dd9a2891f:0x8d714c952939f7fc!8m2!3d42.8569854!4d74.6337947!16s%2Fg%2F11tsp7r28d?hl=ru&entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 backdrop-blur-md text-black py-4 px-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex items-center gap-4 border border-black/[0.08] min-w-[300px] hover:text-[#0000FF] transition-colors group/popup cursor-pointer block"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0000FF]/8 text-[#0000FF] shrink-0 transition-transform duration-300 group-hover/popup:scale-105">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#0000FF] text-[17px] font-mono uppercase tracking-wider font-semibold">
                      {t.contacts.markerLabel}
                    </span>
                    <span className="text-black/85 text-lg font-medium leading-snug group-hover/popup:text-[#0000FF] transition-colors">
                      {t.contacts.addressFooter}
                    </span>
                  </div>
                </a>
              </MapPopup>
            </MapMarker>
          </Map>
        </motion.div>
      </div>
    </div>
  );
}
