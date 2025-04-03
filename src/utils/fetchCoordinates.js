/**
 * Fetches the latitude and longitude coordinates for a given address using the OpenCage Geocoding API.
 *
 * This function first checks if the coordinates for the given address are already cached in `localStorage`.
 * If cached data exists, it returns the stored coordinates to reduce API calls. Otherwise, it makes a request
 * to the OpenCage API to retrieve the coordinates, caches them for future use, and returns the result.
 *
 * @example
 * fetchCoordinates("Manila, Philippines").then(coords => {
 *   if (coords) {
 *     console.log(`Latitude: ${coords.lat}, Longitude: ${coords.lng}`);
 *   } else {
 *     console.log("Coordinates not found.");
 *   }
 * });
 */

// ---- library ----
import axios from "axios";

// ---- open cage api .env ----
const API_KEY = import.meta.env.VITE_OPENCAGE_API;

// function to convert the warehouse address and customer address to lat & long. (used for geocoding to determine the nearest drop-off)
export const fetchCoordinates = async (address) => {
  const cachedCoords = localStorage.getItem(address);

  if (cachedCoords) {
    return JSON.parse(cachedCoords);
  }

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      const coords = { lat, lng };
      localStorage.setItem(address, JSON.stringify(coords));
      return coords;
    }
    return null;
  } catch (error) {
    console.error("Opencage geocoding failed. Please try again later:", error);

    return null; // return null when the API call fails
  }
};
