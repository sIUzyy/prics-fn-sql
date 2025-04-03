// react
import { Suspense, lazy } from "react";

// react-router-dom
import { createBrowserRouter, Navigate } from "react-router";

// loading
import LazyLoading from "@/components/loading/loading-logo";
import LoadingForm from "@/components/loading/loading-form";

// src/pages - anyone have access
const LandingPage = lazy(() => import("../pages/landing-page"));
const AuthenticationPage = lazy(() => import("../pages/authentication-page"));

// src/page - if page does not exist show this page
const ErrorPage = lazy(() => import("../pages/error-page/error-page"));

// src/pages/user-authenticated - user
const UserDashboardPage = lazy(() =>
  import("@/pages/user-authenticated/user-page/user-dashboard-page")
);
const UserPreDeliveryPage = lazy(() =>
  import("@/pages/user-authenticated/user-page/user-pre-delivery-page")
);
const UserAppointmentPage = lazy(() =>
  import("@/pages/user-authenticated/user-page/user-appointment-page")
);
const UserSettingsPage = lazy(() =>
  import("@/pages/user-authenticated/user-page/user-settings")
);

// src/pages/user-authenticated - admin
const AdminOrderSummary = lazy(() =>
  import("@/pages/user-authenticated/admin-page/admin-dashboard-page")
);
const AdminOrderSummaryById = lazy(() =>
  import("@/pages/user-authenticated/admin-page/admin-by-tracking-no-page")
);

const AdminPriorityPage = lazy(() =>
  import("@/pages/user-authenticated/admin-page/admin-priority-page")
);
const AdminPriorityPerPlateNoPage = lazy(() =>
  import(
    "@/pages/user-authenticated/admin-page/admin-priority-per-plateNo-page"
  )
);
const AdminAppointmentPage = lazy(() =>
  import("@/pages/user-authenticated/admin-page/admin-appointment-page")
);
const AdminSettingsPage = lazy(() =>
  import("@/pages/user-authenticated/admin-page/admin-settings-page")
);

const AdminTodayAppointment = lazy(() =>
  import(
    "@/components/admin-components/admin-appointment-table/admin-today-appointment"
  )
);

const AdminAllAppointment = lazy(() =>
  import(
    "@/components/admin-components/admin-appointment-table/admin-all-appointment"
  )
);

const AdminMaintenanceCreateAccount = lazy(() =>
  import(
    "@/pages/user-authenticated/admin-page/maintenance-pages/admin-maintenance-create-account"
  )
);

const AdminMaintenanceActivity = lazy(() =>
  import(
    "@/pages/user-authenticated/admin-page/maintenance-pages/admin-maintenance-activity"
  )
);
const AdminMaintenanceDriverList = lazy(() =>
  import(
    "@/pages/user-authenticated/admin-page/maintenance-pages/admin-maintenance-driver-list"
  )
);
const AdminMaintenanceTruckList = lazy(() =>
  import(
    "@/pages/user-authenticated/admin-page/maintenance-pages/admin-maintenance-truck-list"
  )
);
const AdminMaintenanceWarehouseList = lazy(() =>
  import(
    "@/pages/user-authenticated/admin-page/maintenance-pages/admin-maintenance-warehouse-list"
  )
);

// src/pages/user-authenticated - security(guard)
const SecurityTimeIn = lazy(() =>
  import("@/pages/user-authenticated/security-page/access-time-in-page")
);

const SecurityTimeOut = lazy(() =>
  import("@/pages/user-authenticated/security-page/access-time-out-page")
);
const SecuritySettingsPage = lazy(() =>
  import("@/pages/user-authenticated/security-page/security-settings-page")
);

// outlet-component-auth
const AdminInputsForm = lazy(() =>
  import("@/components/auth-form/admin-inputs")
);
const DriverInputsForm = lazy(() =>
  import("@/components/auth-form/driver-inputs")
);
const SecurityInputsForm = lazy(() =>
  import("@/components/auth-form/security-inputs")
);

// outlet-layout
const Layout = lazy(() => import("./Layout"));

// protected route - prevent unauthorized access
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

const router = createBrowserRouter([
  // public route - anyone can access
  {
    path: "/",
    element: (
      // using lazy will improve our website, using suspense so theres a fallback while loading
      <Suspense fallback={<LazyLoading />}>
        <LandingPage />
      </Suspense>
    ),
  },

  // public route - anyone can access
  {
    path: "/signin",
    element: (
      <Suspense fallback={<LazyLoading />}>
        <AuthenticationPage />
      </Suspense>
    ),
    children: [
      // force to navigate to driver page, by default.
      { index: true, element: <Navigate to="driver" replace /> },
      {
        path: "driver",
        element: (
          <Suspense fallback={<LoadingForm />}>
            <DriverInputsForm />
          </Suspense>
        ),
      },
      {
        path: "security",
        element: (
          <Suspense fallback={<LoadingForm />}>
            <SecurityInputsForm />
          </Suspense>
        ),
      },
      {
        path: "admin",
        element: (
          <Suspense fallback={<LoadingForm />}>
            <AdminInputsForm />
          </Suspense>
        ),
      },
    ],
  },

  // protected route - only admin have access
  {
    path: "/admin",
    element: (
      <Suspense fallback={""}>
        <ProtectedRoute requiredRole="admin">
          <Layout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="ordersummary" replace /> },
      {
        path: "ordersummary",
        element: (
          <Suspense fallback={""}>
            <AdminOrderSummary />
          </Suspense>
        ),
      },
      {
        path: "ordersummary/:id",
        element: (
          <Suspense fallback={""}>
            <AdminOrderSummaryById />
          </Suspense>
        ),
      },
      {
        path: "priority",
        element: (
          <Suspense fallback={""}>
            <AdminPriorityPage />
          </Suspense>
        ),
      },

      {
        path: "priority/:id",
        element: (
          <Suspense fallback={""}>
            <AdminPriorityPerPlateNoPage />
          </Suspense>
        ),
      },
      {
        path: "appointments",
        element: (
          <Suspense fallback={""}>
            <AdminAppointmentPage />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="today-appointments" replace />,
          },
          {
            path: "today-appointments",
            element: (
              <Suspense fallback={""}>
                <AdminTodayAppointment />
              </Suspense>
            ),
          },

          {
            path: "all-appointments",
            element: (
              <Suspense fallback={""}>
                <AdminAllAppointment />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "maintenance/create-account",
        element: (
          <Suspense fallback={""}>
            <AdminMaintenanceCreateAccount />
          </Suspense>
        ),
      },
      {
        path: "maintenance/activity",
        element: (
          <Suspense fallback={""}>
            <AdminMaintenanceActivity />
          </Suspense>
        ),
      },

      {
        path: "maintenance/driver-list",
        element: (
          <Suspense fallback={""}>
            <AdminMaintenanceDriverList />
          </Suspense>
        ),
      },
      {
        path: "maintenance/truck-list",
        element: (
          <Suspense fallback={""}>
            <AdminMaintenanceTruckList />
          </Suspense>
        ),
      },

      {
        path: "maintenance/warehouse-list",
        element: (
          <Suspense fallback={""}>
            <AdminMaintenanceWarehouseList />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={""}>
            <AdminSettingsPage />
          </Suspense>
        ),
      },
    ],
  },

  // protected route - only security guard have access
  {
    path: "/access-pass",
    element: (
      <Suspense fallback={<LazyLoading />}>
        <ProtectedRoute requiredRole="guard">
          <Layout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="time-in" replace /> },

      {
        path: "time-in",
        element: (
          <Suspense fallback={""}>
            <SecurityTimeIn />
          </Suspense>
        ),
      },

      {
        path: "time-out",
        element: (
          <Suspense fallback={""}>
            <SecurityTimeOut />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={""}>
            <SecuritySettingsPage />
          </Suspense>
        ),
      },
    ],
  },

  // protected route - only driver have access
  {
    path: "/plate-no",
    element: (
      <Suspense fallback={<LazyLoading />}>
        <ProtectedRoute requiredRole="driver">
          <Layout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="alldeliveries" replace /> },
      {
        path: "alldeliveries",
        element: (
          <Suspense fallback={""}>
            <UserDashboardPage />
          </Suspense>
        ),
      },
      {
        path: "predeliveries",
        element: (
          <Suspense fallback={""}>
            <UserPreDeliveryPage />
          </Suspense>
        ),
      },
      {
        path: "my-appointment",
        element: (
          <Suspense fallback={""}>
            <UserAppointmentPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={""}>
            <UserSettingsPage />
          </Suspense>
        ),
      },
    ],
  },

  // if page does not exist, show this component.
  {
    path: "*",
    element: (
      <Suspense fallback={""}>
        <ErrorPage />
      </Suspense>
    ),
  },
]);

export default router;
