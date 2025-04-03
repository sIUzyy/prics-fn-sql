// for validation only - react
import PropTypes from "prop-types";

// shadcn-ui
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// react-router-dom
import { Outlet } from "react-router";

// --- layout for the sidebar
export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <div className="flex mx-2 items-center py-3 ">
          <SidebarTrigger />
          <span className="mx-2 text-[#27272A]"> | </span>
          <h1 className="text-[#8C8C95]">E-POD - PRICS Technology Inc.</h1>
        </div>

        {children}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

// props validation for Layout component
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
