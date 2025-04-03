// ---- react ----
import { useState, useEffect } from "react";

// ---- component ----
import PriorityListTable from "@/components/admin-components/admin-priority-table";
import LoadingTable from "@/components/loading/loading-table";
import Heading from "@/components/header/page-heading";

// ---- library ----
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminPriorityPage() {
  // ---- state to stored the truck data
  const [truckData, setTruckData] = useState([]);

  const [shipmentData, setShipmentData] = useState([]);

  // ---- loading state
  const [loadingTruckData, setLoadingTruckData] = useState(false);
  const [loadingShipmentData, setLoadingShipmentData] = useState(false);

  // ---- function to fetch all truck data
  useEffect(() => {
    const fetchTruckData = async () => {
      setLoadingTruckData(true);

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
        setLoadingTruckData(false);
      }
    };

    fetchTruckData();
  }, []);

  // ---- function to fetch all the shipment data of particular truck
  useEffect(() => {
    if (truckData.length === 0) return; // Ensure trucks exist before fetching

    const fetchAllShipments = async () => {
      setLoadingShipmentData(true);
      try {
        const shipmentRequests = truckData.map((truck) =>
          axios.get(`${API_ENDPOINT}/api/shipment/${truck.plate_no}/driver`)
        );

        const responses = await Promise.all(shipmentRequests);
        const shipments = responses.map((res) => res.data.shipments);

        setShipmentData(shipments);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoadingShipmentData(false);
      }
    };

    fetchAllShipments();
  }, [truckData]);
  return (
    <div className="my-5 mx-4 w-full">
      <Heading
        title={"Order Priority"}
        description={`Check the list of tracking numbers for your trucks scheduled for delivery and set a priority order.`}
      />
      {loadingTruckData || loadingShipmentData ? (
        <LoadingTable />
      ) : (
        <PriorityListTable data={truckData} shipmentData={shipmentData} />
      )}
    </div>
  );
}
