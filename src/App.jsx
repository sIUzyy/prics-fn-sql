// ---- library ----
import { RouterProvider } from "react-router-dom"; // ---- react-router-dom
import { Toaster } from "sonner"; // ---- toaster

// ---- pages (routing) ----
import router from "./routing/MainRouting";

// ---- context ----
import TrackingNoContextProvider from "./context/TrackingNoContextProvider";
import WarehouseContextProvider from "./context/WarehouseContextProvider";
import AuthContextProvider from "./context/AuthContextProvider";

// auth-context
import { useAuth } from "@/context/AuthContextProvider";

// responsible to display all of the content
function AppContent() {
  // get the user context to determine the user role
  const { user } = useAuth();

  // determine toaster position based on role
  const toasterPosition =
    user?.role === "admin" ? "bottom-right" : "bottom-left";

  return (
    <>
      {/*display all the route page */}
      <RouterProvider router={router} />
      {/*toast message position */}
      <Toaster position={toasterPosition} />
    </>
  );
}

// main app
export default function App() {
  return (
    <WarehouseContextProvider>
      <AuthContextProvider>
        <TrackingNoContextProvider>
          <AppContent />
        </TrackingNoContextProvider>
      </AuthContextProvider>
    </WarehouseContextProvider>
  );
}
