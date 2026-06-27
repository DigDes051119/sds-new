import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";

export function Projects() {
  const { t, locale } = useContext(LanguageContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam]);

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  const localizedDetails = projectDetails[locale] || projectDetails["ru"] || {};

  const projects = t.projects.items.map((project) => {
    const detail = localizedDetails[project.id] || {};
    return {
      ...project,
      img: project.id === "sandyq" ? projectImg1 : project.id === "ala-too" ? projectImg2 : project.img,
      desc: detail.desc || "",
      year: detail.year || "2026",
    };
  });

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
      className="max-w-[1380px] mx-auto px-6 min-[1380px]:px-0 py-20"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div 
            key={project.id}
            {...scrollRevealConfig}
            whileHover={{ y: -6 }}
            className="group flex flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition interactive-element"
          >
            <div className="w-full aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6 bg-[#eeeee9]">
              <ImageWithFallback src={project.img} alt={project.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-102" />
            </div>
            <span className="text-sm text-black/45">
              {project.category && !["projects", "проекты", "проекттер"].includes(project.category.toLowerCase())
                ? project.category 
                : (t.projectCategories[project.categoryKey] || project.category)}
            </span>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">{project.name}</h3>
            <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed tracking-[-0.02em] text-black/70 line-clamp-3">{project.desc}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
              <span>{locale === "ru" ? "Опубликовано" : locale === "kg" ? "Жарыяланды" : "Published"}</span>
              <span>{project.year}</span>
            </div>
            <Link to={`/projects/${project.id}`} className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-[#0000FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">
              {locale === "ru" ? "Посмотреть" : locale === "kg" ? "Караңыз" : "View"}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
