// ---- react ----
import { useEffect, useState } from "react";

// ---- component ----
import WarehouseListTable from "@/components/admin-components/admin-maintenance-table/warehouse-list-table";
import LoadingTable from "@/components/loading/loading-table";
import Heading from "@/components/header/page-heading";

// ---- library ----
import { toast } from "sonner";
import axios from "axios";

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminMaintenanceWarehouseList() {
  // state to stored the warehouse data
  const [warehouseData, setWarehouseData] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // fetch all warehouse data
  useEffect(() => {
    const fetchWarehouseData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/warehouse`);
        const data = response.data.warehouses;

        setWarehouseData(data);
      } catch (error) {
        console.error("Failed to fetch warehouse:", error);

        toast.error(
          "We could not load your warehouse list data. Please try again later.",
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

    fetchWarehouseData();
  }, []);
  return (
    <div className="my-5 mx-4 w-[100vh]">
      <div>
        <Heading
          title={"Warehouse List"}
          description={"Overview of the warehouses you operate"}
        />

        {isLoading ? (
          <LoadingTable />
        ) : (
          <WarehouseListTable data={warehouseData} />
        )}
      </div>
    </div>
  );
}
