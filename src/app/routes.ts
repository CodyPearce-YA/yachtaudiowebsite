import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import LegalNotice from "./pages/LegalNotice";
import Projects from "./pages/Projects";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/legal-notice",
    Component: LegalNotice,
  },
  {
    path: "/projects",
    Component: Projects,
  },
]);
