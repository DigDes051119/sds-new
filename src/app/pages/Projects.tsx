import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const projects = [
  { 
    id: "sandyq", 
    name: "Sandyq", 
    category: "Брендинг & Архитектура", 
    img: projectImg1 
  },
  { 
    id: "ala-too", 
    name: "Ala-Too", 
    category: "Продукт Дизайн", 
    img: projectImg2 
  },
  { 
    id: "salkyn", 
    name: "Salkyn", 
    category: "Индустриальный Дизайн", 
    img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600" 
  },
  { 
    id: "one-ordo", 
    name: "One Ordo Resort", 
    category: "Архитектура", 
    img: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600" 
  },
];

export function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1440px] mx-auto px-6 py-20"
    >
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.08] text-[#0000FF] mb-20">
        Проекты
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className="group relative h-[600px] rounded-3xl overflow-hidden interactive-element block"
          >
            <div className="absolute inset-0 bg-black/10 z-10 transition-opacity group-hover:opacity-0" />
            <ImageWithFallback 
              src={project.img} 
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Arrow on hover */}
            <div className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight className="text-[#0000FF]" size={24} />
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
              <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-2xl transition-colors duration-300 group-hover:bg-[#0000FF] group-hover:text-white flex flex-col w-full md:w-auto">
                <h3 className="text-3xl font-bold mb-2">{project.name}</h3>
                <p className="text-base opacity-80">{project.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
