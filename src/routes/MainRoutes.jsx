import { lazy, Suspense } from "react";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

// Only the landing screen is eager so the first paint has nothing to wait on;
// the rest load as the user walks the flow.
import StartupPage from "../pages/StartupPage";

const ModelSelectionPage = lazy(() => import("../pages/ModelSelectionPage"));
const CameraPage = lazy(() => import("../pages/CameraPage"));
const ResultPage = lazy(() => import("../pages/ResultPage"));

function Loading() {
  return <div className="min-h-dvh app-bg bg-black/30" />;
}

const wrap = (element) => <Suspense fallback={<Loading />}>{element}</Suspense>;

const router = createHashRouter([
  { path: "/", element: <StartupPage /> },
  { path: "/model", element: wrap(<ModelSelectionPage />) },
  { path: "/camera", element: wrap(<CameraPage />) },
  { path: "/result", element: wrap(<ResultPage />) },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function MainRoutes() {
  return <RouterProvider router={router} />;
}
