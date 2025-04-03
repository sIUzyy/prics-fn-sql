// ---- react ----
import { useEffect, useState } from "react";

// ---- context ----
import { useAuth } from "@/context/AuthContextProvider";

// ---- shadcn component ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- components ----
import UserDeliveryCard from "@/components/user-components/user-delivery-card"; // ---- user components
import UserTable from "@/components/user-components/user-table"; // ---- user components
import LoadingTable from "@/components/loading/loading-table"; // ---- loading components
import LoadingCard from "@/components/loading/loading-card"; // ---- loading components
import Heading from "@/components/header/page-heading"; // ---- header components

// ---- library ----
import axios from "axios"; // ---- axios
import { toast } from "sonner"; // ---- toast
import { CalendarCheck2, Package } from "lucide-react"; // ---- icons

// ---- daysjs (library) ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ---- this setup ensures that all date and time operations can be correctly
dayjs.extend(utc);
dayjs.extend(timezone);

// ---- asia/manila timezone
const PH_TZ = "Asia/Manila";

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function UserDashboardPage() {
  // ---- user-context
  const { user } = useAuth();

  // ----state to stored the shipment list data
  const [shipmentData, setShipmentData] = useState([]);

  // ---- state to stored the pre-delivery data (when driver scan the tracking no)
  const [preDeliveryData, setPreDeliveryData] = useState([]);

  // ---- stored the appointment list data
  const [appointmentData, setAppointmentData] = useState([]);

  // ---- state to check if the device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ---- loading state
  const [loadingPlate, setLoadingPlate] = useState(false);
  const [loadingPreDelivery, setLoadingPreDelivery] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(false);

  // conditional rendered the loading states
  const isLoading = loadingPlate || loadingPreDelivery || loadingAppointment;

  // ---- fetch data by plate number
  useEffect(() => {
    const getShipmentByPlateNo = async () => {
      setLoadingPlate(true);
      try {
        const plate_no = user.plateNo;
        const response = await axios.get(
          `${API_ENDPOINT}/api/shipment/${plate_no}/driver`
        );

        const shipments = response.data.shipments || [];

        setShipmentData(shipments);
      } catch (error) {
        console.error("Error fetching shipments:", error);
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

    getShipmentByPlateNo();
  }, [user.plateNo]);

  // ---- fetch pre-delivery data for each shipment data
  useEffect(() => {
    // If shipment data is empty, clear error and stop execution
    if (shipmentData.length === 0) {
      return;
    }

    // function to fetch delivery data by tracking no.
    const getPreDeliveryByTrackingNo = async () => {
      setLoadingPreDelivery(true);

      try {
        // request to backend
        const requests = shipmentData.map((shipment) =>
          axios.get(
            `${API_ENDPOINT}/api/pre-delivery/${shipment.tracking_no}` // pass down the shipment track no to see if its match to track no of pre delivery
          )
        );

        // wait for all API calls
        const responses = await Promise.all(requests);

        // map thru each pre-delivery data
        const preDeliveryResults = responses.map((res) => res.data);

        // extract the data to state
        setPreDeliveryData(preDeliveryResults);
      } catch (error) {
        console.error("Failed to fetch pre-delivery data:", error);

        toast.error(
          "We could not load your pre-delivery data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingPreDelivery(false);
      }
    };

    getPreDeliveryByTrackingNo();
  }, [shipmentData]);

  // ---- fetch appointment list by plate no
  useEffect(() => {
    const getAppointmentByPlateNo = async () => {
      setLoadingAppointment(true);

      try {
        const plate_no = user.plateNo;
        const response = await axios.get(
          `${API_ENDPOINT}/api/appointment/${plate_no}/driver`
        );

        const appointments = response.data.appointments || [];

        setAppointmentData(appointments);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast.error(
          "We could not retrieve your appointment data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingAppointment(false);
      }
    };

    getAppointmentByPlateNo();
  }, [user.plateNo]);

  // ---- get the todayPh timezone
  const todayPH = dayjs().tz(PH_TZ).startOf("day");

  // ---- filter the shipment data show the today's delivery
  const todayShipments = shipmentData.filter((shipment) =>
    shipment.shipped_date
      ? dayjs(shipment.shipped_date).tz(PH_TZ).isSame(todayPH, "day")
      : false
  );

  // ---- filter the appointment data show the today's appointment
  const todayAppointments = appointmentData.filter((appointment) =>
    appointment.appointment_date
      ? dayjs(appointment.appointment_date).tz(PH_TZ).isSame(todayPH, "day")
      : false
  );

  // ---- check if the window width is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="my-5 mx-4">
      <Heading
        title={"dashboard"}
        description={`Below is an overview of all deliveries, your plate number and your schedule.`}
      />
      {isLoading ? (
        <div>
          <LoadingCard />
          <LoadingTable />
        </div>
      ) : (
        <>
          <div className="card_section flex flex-col gap-y-5 md:flex-row md:gap-x-2">
            <Card className={"max-w-[330px] "}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Today’s Delivery
                  </CardTitle>
                  <Package size={25} />
                </div>
              </CardHeader>

              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {todayShipments.length}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Summary of the deliveries scheduled for today, including
                  details such as tracking no., customer name, addresses.
                </p>
              </CardContent>
            </Card>

            <Card className={"max-w-[330px]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Today’s Appointments
                  </CardTitle>
                  <CalendarCheck2 size={25} />
                </div>
              </CardHeader>

              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {todayAppointments.length}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  You can view your all appointments in the My Appointment menu.
                </p>
              </CardContent>
            </Card>
          </div>

          {isMobile ? (
            <UserDeliveryCard
              data={shipmentData}
              preDeliveryData={preDeliveryData}
            />
          ) : (
            <UserTable data={shipmentData} preDeliveryData={preDeliveryData} />
          )}
        </>
      )}
    </div>
  );
}
