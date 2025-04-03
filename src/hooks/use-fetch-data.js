// ---- react ----
import { useEffect } from "react";

// ---- library ----
import { toast } from "sonner";
import axios from "axios";

// ---- customer hook for admin dashboard/appointment
export const useFetchData = (
  url,
  setData,
  loadingKey,
  setLoadingStates,
  errorMessage
) => {
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      try {
        const response = await axios.get(url, { signal: controller.signal });
        setData(
          response.data?.shipments ||
            response.data?.trucks ||
            response.data?.appointments ||
            response.data ||
            []
        );
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
          toast.error(errorMessage, {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, loadingKey, errorMessage, setData, setLoadingStates]);
};
