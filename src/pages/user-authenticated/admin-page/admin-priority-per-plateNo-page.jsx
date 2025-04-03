// ---- react ----
import { useState, useEffect } from "react";

// ---- shadcn component ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- library ----
import { useParams } from "react-router"; // ---- react-router
import { Hash } from "lucide-react"; // ---- icons
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios

// ---- components ----
import AdminPriorityPerPlateNoTable from "@/components/admin-components/admin-priority-per-plateNo";

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminPriorityPerPlateNoPage() {
  // ---- get the plate no /:id
  const { id } = useParams();

  // state to stored the shipment data
  const [shipmentData, setShipmentData] = useState([]);

  // ---- loading state
  const [loadingPlate, setLoadingPlate] = useState(false);

  // ---- fetch tracking no by plate no
  useEffect(() => {
    const getShipmentDataByPlateNo = async () => {
      setLoadingPlate(true);
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/shipment/${id}/driver`
        );
        setShipmentData(response.data.shipments);
      } catch (error) {
        console.log(error);

        toast.error(
          "We could not retrieve your shipment data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingPlate(false); // Ensure loading state is reset
      }
    };

    getShipmentDataByPlateNo();
  }, [id]);
  return (
    <div className="my-5 mx-4">
      <Card className={"max-w-[320px]"}>
        <CardHeader>
          <div className="flex justify-between items-center ">
            <CardTitle className={"font-inter text-base font-medium"}>
              Plate Number
            </CardTitle>
            <Hash size={25} />
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-5xl font-bebas tracking-wider">{id}</h1>
          <p className="text-sm text-[#6c757d] mt-5">
            This truck’s plate number is associated with a list of tracking
            numbers, and you can set an order priority.
          </p>
        </CardContent>
      </Card>

      {loadingPlate ? (
        <p className="mt-5">Loading...</p>
      ) : (
        <AdminPriorityPerPlateNoTable data={shipmentData} />
      )}
    </div>
  );
}
