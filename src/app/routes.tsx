import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { RouteErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";

const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const Projects = lazy(() => import("./pages/Projects").then(m => ({ default: m.Projects })));
const Contacts = lazy(() => import("./pages/Contacts").then(m => ({ default: m.Contacts })));
const OldProjects = lazy(() => import("./pages/OldProjects").then(m => ({ default: m.OldProjects })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail").then(m => ({ default: m.ProjectDetail })));
const WebUiUx = lazy(() => import("./pages/WebUiUx").then(m => ({ default: m.WebUiUx })));
const WebUiUxDetail = lazy(() => import("./pages/WebUiUxDetail").then(m => ({ default: m.WebUiUxDetail })));
const Products = lazy(() => import("./pages/Products").then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const ConceptsAndVision = lazy(() => import("./pages/ConceptsAndVision").then(m => ({ default: m.ConceptsAndVision })));
const ConceptsAndVisionDetail = lazy(() => import("./pages/ConceptsAndVisionDetail").then(m => ({ default: m.ConceptsAndVisionDetail })));
const ArchitectProjects = lazy(() => import("./pages/ArchitectProjects").then(m => ({ default: m.ArchitectProjects })));
const ArchitectProjectsDetail = lazy(() => import("./pages/ArchitectProjectsDetail").then(m => ({ default: m.ArchitectProjectsDetail })));
const GameDev = lazy(() => import("./pages/GameDev").then(m => ({ default: m.GameDev })));
const GameDevDetail = lazy(() => import("./pages/GameDevDetail").then(m => ({ default: m.GameDevDetail })));
const Video = lazy(() => import("./pages/Video").then(m => ({ default: m.Video })));
const Music = lazy(() => import("./pages/Music").then(m => ({ default: m.Music })));

// Admin pages lazy (heavy admin bundle separated)
const AdminLayout = lazy(() => import("./components/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("./pages/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminProjectsEditor = lazy(() => import("./pages/AdminProjectsEditor").then(m => ({ default: m.AdminProjectsEditor })));
const AdminWebUiUxEditor = lazy(() => import("./pages/AdminWebUiUxEditor").then(m => ({ default: m.AdminWebUiUxEditor })));
const AdminProductsEditor = lazy(() => import("./pages/AdminProductsEditor").then(m => ({ default: m.AdminProductsEditor })));
const AdminConceptsEditor = lazy(() => import("./pages/AdminCatalogEditor").then(m => ({ default: m.AdminConceptsEditor })));
const AdminArchitectsEditor = lazy(() => import("./pages/AdminCatalogEditor").then(m => ({ default: m.AdminArchitectsEditor })));
const AdminGameDevEditor = lazy(() => import("./pages/AdminCatalogEditor").then(m => ({ default: m.AdminGameDevEditor })));
const AdminVideoEditor = lazy(() => import("./pages/AdminCatalogEditor").then(m => ({ default: m.AdminVideoEditor })));
const AdminMusicEditor = lazy(() => import("./pages/AdminCatalogEditor").then(m => ({ default: m.AdminMusicEditor })));
const AdminFeaturedProjects = lazy(() => import("./pages/AdminFeaturedProjects").then(m => ({ default: m.AdminFeaturedProjects })));
const AdminAboutEditor = lazy(() => import("./pages/AdminAboutEditor").then(m => ({ default: m.AdminAboutEditor })));
const AdminContactsEditor = lazy(() => import("./pages/AdminContactsEditor").then(m => ({ default: m.AdminContactsEditor })));
const AdminUsersManager = lazy(() => import("./pages/AdminUsersManager").then(m => ({ default: m.AdminUsersManager })));
const AdminServicesEditor = lazy(() => import("./pages/AdminServicesEditor").then(m => ({ default: m.AdminServicesEditor })));
const AdminBrandsEditor = lazy(() => import("./pages/AdminBrandsEditor").then(m => ({ default: m.AdminBrandsEditor })));
const AdminArchiveEditor = lazy(() => import("./pages/AdminArchiveEditor").then(m => ({ default: m.AdminArchiveEditor })));
const AdminLeads = lazy(() => import("./pages/AdminLeads").then(m => ({ default: m.AdminLeads })));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "projects", Component: Projects },
      { path: "projects/old", Component: OldProjects },
      { path: "old-projects", Component: OldProjects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "web-ui-ux", Component: WebUiUx },
      { path: "web-ui-ux/:id", Component: WebUiUxDetail },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "concepts-and-vision", Component: ConceptsAndVision },
      { path: "concepts-and-vision/:id", Component: ConceptsAndVisionDetail },
      { path: "architect-projects", Component: ArchitectProjects },
      { path: "architect-projects/:id", Component: ArchitectProjectsDetail },
      { path: "architectural-projects", Component: ArchitectProjects },
      { path: "architectural-projects/:id", Component: ArchitectProjectsDetail },
      { path: "gamedev", Component: GameDev },
      { path: "gamedev/:id", Component: GameDevDetail },
      { path: "video", Component: Video },
      { path: "music", Component: Music },
      { path: "contacts", Component: Contacts },
    ],
  },
  {
    path: "/old",
    loader: () => {
      window.location.replace("/old/index.html");
      return null;
    },
    Component: () => null,
  },
  {
    path: "/sanarip-med-ai",
    lazy: () => import("./pages/SanaripMedAi").then(m => ({ Component: m.SanaripMedAi })),
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: "/sanarip-med-ai/*",
    lazy: () => import("./pages/SanaripMedAi").then(m => ({ Component: m.SanaripMedAi })),
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "featured", Component: AdminFeaturedProjects },
      { path: "about", Component: AdminAboutEditor },
      { path: "projects", Component: AdminProjectsEditor },
      { path: "web-ui-ux", Component: AdminWebUiUxEditor },
      { path: "products", Component: AdminProductsEditor },
      { path: "concepts", Component: AdminConceptsEditor },
      { path: "architects", Component: AdminArchitectsEditor },
      { path: "gamedev", Component: AdminGameDevEditor },
      { path: "video", Component: AdminVideoEditor },
      { path: "music", Component: AdminMusicEditor },
      { path: "contacts", Component: AdminContactsEditor },
      { path: "services", Component: AdminServicesEditor },
      { path: "brands", Component: AdminBrandsEditor },
      { path: "archive", Component: AdminArchiveEditor },
      { path: "leads", Component: AdminLeads },
      { path: "administration", Component: AdminUsersManager },
    ],
  },
]);
