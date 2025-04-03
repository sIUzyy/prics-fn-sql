// -- this context will get the scanned items data and store it in the global state ([user-page]: pre-delivery)

import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

// create a context
const TrackingNoContext = createContext();

export const useTrackingNo = () => useContext(TrackingNoContext);

export default function TrackingNoContextProvider({ children }) {
  const [trackingNoData, setTrackingNoData] = useState([]);
  const [trackingError, setTrackingError] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);

  const value = {
    trackingNoData,
    setTrackingNoData,
    trackingError,
    setTrackingError,
    trackingLoading,
    setTrackingLoading,
  };

  return (
    <TrackingNoContext.Provider value={value}>
      {children}
    </TrackingNoContext.Provider>
  );
}

TrackingNoContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
