import { createHashRouter, RouterProvider } from "react-router-dom";
import StartupPage from "../pages/StartupPage";
import ModelSelectionPage from "../pages/ModelSelectionPage";
import CameraPage from "../pages/CameraPage";
import FormPage from "../pages/FormPage";
import SuccessScreen from "../pages/SuccessScreen";
import TVScreen from "../pages/TVScreen";

export default function MainRoutes() {
  const router = createHashRouter([
    { path: "/", element: <StartupPage /> },
    { path: "/model", element: <ModelSelectionPage /> },
    { path: "/camera", element: <CameraPage /> },
    { path: "/form", element: <FormPage /> },
    { path: "/success", element: <SuccessScreen /> },
    { path: "/tv", element: <TVScreen /> },
  ]);
  return <RouterProvider router={router} />;
}
