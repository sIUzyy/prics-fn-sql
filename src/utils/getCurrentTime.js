/**
 * Fetches the current date and time for the Asia/Manila timezone.
 *
 * This function retrieves the real-time date and time from the TimeZoneDB API,
 * ensuring that even if the user manipulates their local device time,
 * the fetched time remains accurate.
 *
 * @returns {Promise<string | null>} A promise that resolves to the formatted date-time string (e.g., "2024-03-21 14:30:00"),
 *                                   or `null` if the request fails.
 *
 * @example
 * fetchTime().then(time => console.log(time)); // "2024-03-21 14:30:00"
 */

// ---- timezone api-key ----
const TIMEDB_APIKEY = import.meta.env.VITE_TIMEZONEDB_API;

// this utility fetches the current date and time in PH, ensuring that user time manipulation has no effect.
export const fetchTime = async () => {
  try {
    const response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEDB_APIKEY}&format=json&by=zone&zone=Asia/Manila`
    );
    const data = await response.json();
    return data.formatted;
  } catch (error) {
    console.error("Error fetching time:", error);
    return null;
  }
};
