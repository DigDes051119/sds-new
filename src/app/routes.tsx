import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Projects } from "./pages/Projects";
import { OldProjects } from "./pages/OldProjects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { WebUiUx } from "./pages/WebUiUx";
import { WebUiUxDetail } from "./pages/WebUiUxDetail";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Contacts } from "./pages/Contacts";
import { ConceptsAndVision } from "./pages/ConceptsAndVision";
import { ConceptsAndVisionDetail } from "./pages/ConceptsAndVisionDetail";
import { ArchitectProjects } from "./pages/ArchitectProjects";
import { ArchitectProjectsDetail } from "./pages/ArchitectProjectsDetail";
import { GameDev } from "./pages/GameDev";
import { GameDevDetail } from "./pages/GameDevDetail";

import { AdminLayout } from "./components/AdminLayout";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProjectsEditor } from "./pages/AdminProjectsEditor";
import { AdminWebUiUxEditor } from "./pages/AdminWebUiUxEditor";
import { AdminProductsEditor } from "./pages/AdminProductsEditor";
import { AdminConceptsEditor, AdminArchitectsEditor, AdminGameDevEditor } from "./pages/AdminCatalogEditor";
import { AdminFeaturedProjects } from "./pages/AdminFeaturedProjects";
import { AdminAboutEditor } from "./pages/AdminAboutEditor";
import { AdminContactsEditor } from "./pages/AdminContactsEditor";
import { AdminUsersManager } from "./pages/AdminUsersManager";
import { AdminServicesEditor } from "./pages/AdminServicesEditor";
import { AdminBrandsEditor } from "./pages/AdminBrandsEditor";
import { AdminArchiveEditor } from "./pages/AdminArchiveEditor";
import { AdminLeads } from "./pages/AdminLeads";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
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
      { path: "gamedev", Component: GameDev },
      { path: "gamedev/:id", Component: GameDevDetail },
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
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
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
      { path: "contacts", Component: AdminContactsEditor },
      { path: "services", Component: AdminServicesEditor },
      { path: "brands", Component: AdminBrandsEditor },
      { path: "archive", Component: AdminArchiveEditor },
      { path: "leads", Component: AdminLeads },
      { path: "administration", Component: AdminUsersManager },
    ],
  },
]);

