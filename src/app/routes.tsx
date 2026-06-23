import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Contacts } from "./pages/Contacts";

import { AdminLayout } from "./components/AdminLayout";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProjectsEditor } from "./pages/AdminProjectsEditor";
import { AdminFeaturedProjects } from "./pages/AdminFeaturedProjects";
import { AdminAboutEditor } from "./pages/AdminAboutEditor";
import { AdminContactsEditor } from "./pages/AdminContactsEditor";
import { AdminUsersManager } from "./pages/AdminUsersManager";
import { AdminServicesEditor } from "./pages/AdminServicesEditor";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "contacts", Component: Contacts },
    ],
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
      { path: "contacts", Component: AdminContactsEditor },
      { path: "services", Component: AdminServicesEditor },
      { path: "administration", Component: AdminUsersManager },
    ],
  },
]);

