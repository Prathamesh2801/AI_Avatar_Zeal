import { createHashRouter, RouterProvider } from "react-router-dom";
import StartupPage from "../pages/StartupPage";
import ModelSelectionPage from "../pages/ModelSelectionPage";
import CameraPage from "../pages/CameraPage";
import FormPage from "../pages/FormPage";

export default function MainRoutes() {
  const router = createHashRouter([
    { path: "/", element: <StartupPage /> },
    { path: "/model", element: <ModelSelectionPage /> },
    { path: "/camera", element: <CameraPage /> },
    { path: "/form", element: <FormPage /> },
  ]);
  return <RouterProvider router={router} />;
}
