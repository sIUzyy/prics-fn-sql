// ---- react ----
import { useEffect, useState } from "react";

// ---- component ----
import ActivityListTable from "@/components/admin-components/admin-maintenance-table/activity-list-table";
import LoadingTable from "@/components/loading/loading-table";
import Heading from "@/components/header/page-heading";

// ---- libary ----
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios

//  ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminMaintenanceActivity() {
  // ---- state to stored the activity-data
  const [activityData, setActivityData] = useState([]);

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

  // ---- useEffect to fetch (get) the activity data
  useEffect(() => {
    const fetchActivityList = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/activity`);
        const data = response.data.activities;
        console.log("Activity data:", data);

        setActivityData(data);
      } catch (error) {
        console.error("Failed to retrieve activity:", error);

        toast.error(
          "We could not retrieve your activity list data. Please try again later.",
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

    fetchActivityList();
  }, []);

  return (
    <div className="my-5 mx-4 w-[100vh]">
      <Heading
        title={"activity"}
        description={`Overview of the activity list for your appointment.`}
      />

      {/*if loading, show the skeleton, otherwise show the table */}
      {isLoading ? <LoadingTable /> : <ActivityListTable data={activityData} />}
    </div>
  );
}
