// --this context will track the selected warehouse of driver to locate the nearest drop off

// react
import { useState, useEffect, createContext, useContext } from "react";

// props-validation
import PropTypes from "prop-types";

// create a context
const WarehouseContext = createContext();

export const useWarehouse = () => useContext(WarehouseContext);

export default function WarehouseContextProvider({ children }) {
  const [selectedWarehouse, setSelectedWarehouse] = useState(() => {
    return localStorage.getItem("selectedWarehouse") || "";
  });

  useEffect(() => {
    localStorage.setItem("selectedWarehouse", selectedWarehouse);
  }, [selectedWarehouse]);

  const value = {
    selectedWarehouse,
    setSelectedWarehouse,
  };

  return (
    <WarehouseContext.Provider value={value}>
      {children}
    </WarehouseContext.Provider>
  );
}

WarehouseContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
