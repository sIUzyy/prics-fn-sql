// ---- shadcn ui ----
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// ---- shadcn ui end ----

// icons
import {
  LayoutDashboard,
  CalendarPlus,
  Settings2,
  ChevronDown,
  Truck,
  Users,
  Wrench,
  ScanQrCode,
  Calendar,
  Map,
  Warehouse,
  Package,
  Clock12,
  Clock3,
  ListOrdered,
} from "lucide-react";

// image
import nav_logo from "../assets/nav_logo.webp";

// react Router Dom
import { NavLink } from "react-router-dom";

// context
import { useAuth } from "@/context/AuthContextProvider";
import { useWarehouse } from "@/context/WarehouseContextProvider";

// side-bar menu of admin
const adminMenu = [
  // add a menu
  {
    title: "Dashboard",
    url: "/admin/ordersummary",
    icon: <LayoutDashboard size={18} />,
  },

  {
    title: "Order Priority",
    url: "/admin/priority",
    icon: <ListOrdered size={18} />,
  },
  {
    title: "Appointment",
    url: "/admin/appointments/today-appointments",
    icon: <CalendarPlus size={18} />,
  },
  {
    title: "Maintenance",
    url: "/admin/maintenance",
    icon: <Wrench size={18} />,
    // add a submenu under maintenance menu
    submenu: [
      {
        title: "User List",
        url: "/admin/maintenance/create-account",
        sub_icon: <Users size={18} />,
      },

      {
        title: "Activity",
        url: "/admin/maintenance/activity",
        sub_icon: <Package size={18} />,
      },

      {
        title: "Driver List",
        url: "/admin/maintenance/driver-list",
        sub_icon: <Users size={18} />,
      },

      {
        title: "Truck List",
        url: "/admin/maintenance/truck-list",
        sub_icon: <Truck size={18} />,
      },

      {
        title: "Warehouse",
        url: "/admin/maintenance/warehouse-list",
        sub_icon: <Warehouse size={18} />,
      },
    ],
  },

  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings2 size={18} />,
  },
];

// side-bar menu of security guard
const securityMenu = [
  // {
  //   title: "Dashboard",
  //   url: "/access-pass/security",
  //   icon: <LayoutDashboard size={18} />,
  // },

  {
    title: "Time In",
    url: "/access-pass/time-in",
    icon: <Clock12 size={18} />,
  },

  {
    title: "Time Out",
    url: "/access-pass/time-out",
    icon: <Clock3 size={18} />,
  },

  {
    title: "Settings",
    url: "/access-pass/settings",
    icon: <Settings2 size={18} />,
  },
];

export function AppSidebar() {
  // auth-context
  const { user } = useAuth();

  // warehouse-context
  const { selectedWarehouse } = useWarehouse();

  // function to generate google maps URL
  const googleMapsURL = selectedWarehouse
    ? `https://www.google.com/maps/dir/${encodeURIComponent(selectedWarehouse)}` // pass the selectedWarehouse so when they click it will show in destination
    : "https://www.google.com/maps";

  // determine which menu to show based on the user's role
  let menuItems = [];

  if (user?.role === "driver") {
    // if user is driver show this menu
    menuItems = [
      {
        title: "Dashboard",
        url: "/plate-no/alldeliveries",
        icon: <LayoutDashboard size={18} />,
      },
      {
        title: "Pre-Delivery",
        url: "/plate-no/predeliveries",
        icon: <ScanQrCode size={18} />,
      },

      {
        title: "My Appointment",
        url: "/plate-no/my-appointment",
        icon: <Calendar size={18} />,
      },
      {
        title: "Google Map",
        url: googleMapsURL,
        icon: <Map size={18} />,
        external: true,
      },

      {
        title: "Settings",
        url: "/plate-no/settings",
        icon: <Settings2 size={18} />,
      },
    ];
  } else if (user?.role === "admin") {
    // if admin, so this menu
    menuItems = adminMenu;
  } else if (user?.role === "guard") {
    // if guard, so this menu
    menuItems = securityMenu;
  }

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        {/* Sidebar logo */}
        <div className="mx-auto">
          <img
            src={nav_logo}
            alt="PRICS Technologies Inc."
            className="w-56 h-20 object-cover"
            loading="lazy"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <div className="p-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.submenu ? (
                  <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center justify-between px-4 py-2 rounded-md transition-colors hover:bg-gray-100">
                        <span className="flex gap-x-2 items-center font-medium text-[#6c757d] ">
                          {item.icon}
                          {item.title}
                        </span>
                        <ChevronDown
                          size={14}
                          className="ml-auto transition-transform"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {/* Use a <ul> for the submenu to avoid nested <li> */}
                      <ul className="border-l-1 border-gray-300 ml-4">
                        {item.submenu.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <NavLink
                              to={subItem.url}
                              className={({ isActive }) =>
                                `flex items-center gap-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium my-2 ml-2  ${
                                  isActive
                                    ? "bg-sidebar-accent text-[#333333]"
                                    : "text-[#6c757d] hover:bg-gray-100"
                                }`
                              }
                            >
                              {subItem.sub_icon}
                              {subItem.title}
                            </NavLink>
                          </SidebarMenuItem>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : item.external ? (
                  // External link (e.g., Google Maps)
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium my-2 text-[#6c757d] hover:bg-gray-100"
                  >
                    {item.icon}
                    {item.title}
                  </a>
                ) : (
                  // Regular sidebar item
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `flex items-center gap-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium my-2 ${
                        isActive
                          ? "bg-sidebar-accent text-[#333333]"
                          : "text-[#6c757d] hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.icon}
                    {item.title}
                  </NavLink>
                )}
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
