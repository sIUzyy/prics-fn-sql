// ---- react----
import { useEffect, useState } from "react";

// ---- component ----
import TruckListTable from "@/components/admin-components/admin-maintenance-table/truck-list-table";
import LoadingTable from "@/components/loading/loading-table";
import Heading from "@/components/header/page-heading";

// ---- library ----
import { toast } from "sonner";
import axios from "axios";

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminMaintenanceTruckList() {
  // state to stored the truck data
  const [truckData, setTruckData] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // fetch all truck data
  useEffect(() => {
    const fetchTruckData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/truck`);
        const data = response.data.trucks;

        setTruckData(data);
      } catch (error) {
        console.error("Failed to fetch truck:", error);

        toast.error(
          "We could not load your truck list data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTruckData();
  }, []);

  return (
    <div className="my-5 mx-4 w-[100vh]">
      <div>
        <Heading
          title={"truck list"}
          description={` Total number of trucks you own and have available for your
            operations or transport needs.`}
        />

        {isLoading ? <LoadingTable /> : <TruckListTable data={truckData} />}
      </div>
    </div>
  );
}
