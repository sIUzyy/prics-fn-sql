// -- context for authentication

// react
import { useState, createContext, useContext, useEffect } from "react";

// image
import loading_logo from "../assets/nav_logo.webp";

// prop-types validation
import PropTypes from "prop-types";

// create a context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// context
import { useWarehouse } from "./WarehouseContextProvider";

// Main provider component
export default function AuthContextProvider({ children }) {
  // context for selected warehouse
  const { setSelectedWarehouse } = useWarehouse();

  // global state where the user info stored
  const [user, setUser] = useState(null);

  // loading state
  const [isLoading, setIsLoading] = useState(true);

  // load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // sign in fn
  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // save user to localStorage
  };

  // sign out fn
  const signOut = () => {
    try {
      setUser(null);
      setSelectedWarehouse("");
      localStorage.clear(); // clears everything in localStorage
    } catch (error) {
      console.error("Sign out failed...", error);
    }
  };

  // wait for localStorage check before rendering children
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={loading_logo} alt="loading-logo" />
      </div>
    );
  }

  const value = { user, isLoading, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Props validation
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
