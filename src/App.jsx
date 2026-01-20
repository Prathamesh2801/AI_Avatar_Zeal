import { Toaster } from "react-hot-toast";
import MainRoutes from "./routes/MainRoutes";

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <MainRoutes />
    </>
  );
}
