import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import { ArrowUpRight } from "lucide-react";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Projects() {
  const { t } = useContext(LanguageContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam]);

  const projects = t.projects.items.map((project) => ({
    ...project,
    img: project.id === "sandyq" ? projectImg1 : project.id === "ala-too" ? projectImg2 : project.img,
  }));

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.categoryKey === selectedCategory);

  const categories = [
    { key: "all", label: t.projectCategories.all },
    { key: "branding", label: t.projectCategories.branding },
    { key: "industrial", label: t.projectCategories.industrial },
    { key: "marketing", label: t.projectCategories.marketing },
    { key: "concept", label: t.projectCategories.concept },
    { key: "graphic", label: t.projectCategories.graphic },
    { key: "automotive", label: t.projectCategories.automotive },
    { key: "architectural", label: t.projectCategories.architectural },
    { key: "product", label: t.projectCategories.product },
    { key: "motion", label: t.projectCategories.motion },
    { key: "music", label: t.projectCategories.music },
    { key: "web", label: t.projectCategories.web },
    { key: "uiux", label: t.projectCategories.uiux },
  ];

  const scrollRevealConfig = {
    initial: { y: 45, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-8%" },
    transition: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }
  };

  return (
    <div
      className="max-w-[1440px] mx-auto px-6 py-20"
    >
      <motion.h1 
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[1.08] text-[#0000FF] mb-12"
      >
        {t.projects.title}
      </motion.h1>

      {/* Category Changer */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`relative rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors duration-300 whitespace-nowrap interactive-element ${
                isActive ? "text-white" : "text-black/65 bg-black/[0.04] hover:bg-black/[0.08] hover:text-black"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#0000FF] rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <motion.div 
            key={project.id}
            {...scrollRevealConfig}
            layout
          >
            <Link 
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
