// ---- react ----
import { useEffect, useState } from "react";

// ---- component ----
import UserListTable from "@/components/admin-components/admin-maintenance-table/user-list-table"; // ---- table header
import LoadingTable from "@/components/loading/loading-table"; // ---- loading table (skeleton)
import Heading from "@/components/header/page-heading"; // ---- heading

// ---- libary ----
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios

//  ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminMaintenanceCreateAccount() {
  // ---- state to stored the user-data
  const [userData, setUserData] = useState([]);

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

  // ---- useEffect to fetch (get) the user data
  useEffect(() => {
    const fetchUserAccount = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/user/guard-role`);
        const data = response.data.guards;

        setUserData(data);
      } catch (error) {
        console.error("Failed to retrieve user:", error);

        toast.error(
          "We could not retrieve your user list data. Please try again later.",
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

    fetchUserAccount();
  }, []);

  return (
    <div className="my-5 mx-4 w-[100vh]">
      <Heading
        title={"User List"}
        description={`Overview of the guard account list for scanning the gate pass barcode.`}
      />

      {/*if loading, show the skeleton, otherwise show the table */}
      {isLoading ? <LoadingTable /> : <UserListTable data={userData} />}
    </div>
  );
}
