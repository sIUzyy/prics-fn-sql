/**
 * ProtectedRoute Component
 *
 * This component restricts access to routes based on user authentication and role.
 * It ensures that only authenticated users with the required role can access the wrapped content.
 * Unauthorized users will be redirected accordingly.
 *
 * @param {object} props - Component properties
 * @param {ReactNode} props.children - The protected content to render if authorized
 * @param {string} [props.requiredRole] - The required role to access the route
 *
 * @returns {ReactNode} - Either the protected content or a redirect component
 *
 * @example
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 */

// prop-types validation
import PropTypes from "prop-types";

// ---- library ----
import { Navigate } from "react-router"; // ---- react-router dom

// ---- context ----
import { useAuth } from "@/context/AuthContextProvider";

// ---- utils ----
import { getRedirectPath } from "@/utils/getRedirectPath";

// this component will protect the authenticated route, role-based route by someone who want to access.
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // or show a loading screen

  // if no user. meaning not logged in, redirect to sign in page.
  if (!user) {
    return <Navigate to={"/signin"} replace />;
  }

  // check their role and redirect the user based on their role.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};
