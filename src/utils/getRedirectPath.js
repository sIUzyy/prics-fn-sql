/**
 * Determines the redirect path based on the user's role.
 *
 * This function returns a specific route depending on the provided `role`.
 * If the role is not recognized, it defaults to the home page (`"/"`).
 *
 * @param {string} role - The role of the user (e.g., "admin", "driver", "guard").
 * @returns {string} The corresponding redirect path for the given role.
 *
 * @example
 * console.log(getRedirectPath("admin"));  // "/admin"
 * console.log(getRedirectPath("driver")); // "/plate-no"
 * console.log(getRedirectPath("guard"));  // "/access-pass"
 * console.log(getRedirectPath("user"));   // "/" (default case)
 */
export const getRedirectPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "driver":
      return "/plate-no";
    case "guard":
      return "/access-pass";
    default:
      return "/";
  }
};
