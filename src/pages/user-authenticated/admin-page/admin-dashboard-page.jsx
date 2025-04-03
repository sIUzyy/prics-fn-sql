// ---- react ----
import { useState, useEffect, useMemo } from "react";

// ---- shadcn components ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- components  ----
import AdminSummaryTable from "@/components/admin-components/admin-summary-table";
import LoadingTable from "@/components/loading/loading-table";
import { DASHBOARD_CARDS } from "@/components/card/card-list";
import LoadingCard from "@/components/loading/loading-card";
import Heading from "@/components/header/page-heading";

// ---- libraries ----
import { toast } from "sonner";
import axios from "axios";

// ---- custom hooks ----
import { useFetchData } from "@/hooks/use-fetch-data";

// // ---- dayjs config ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// ---- API ENDPOINT ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminOrderSummary() {
  // ---- state management ---
  const [preDeliveryData, setPreDeliveryData] = useState([]); // ---- pre-delivery table data
  const [appointmentData, setAppointmentData] = useState([]); // ---- appointment table data
  const [shipmentsData, setShipmentsData] = useState([]); // ---- shipments table data
  const [products, setProductsData] = useState([]); // ---- products table data
  const [truckData, setTruckData] = useState([]); // ---- truck table data

  // ---- loading states ----
  const [loadingStates, setLoadingStates] = useState({
    shipments: false,
    preDelivery: false,
    truckData: false,
    appointment: false,
    products: false,
  });

  // ---- derived loading state ----
  const isLoading = Object.values(loadingStates).some((state) => state);

  // ---- fetch shipment data using custom hook ----
  useFetchData(
    `${API_ENDPOINT}/api/shipment`,
    setShipmentsData,
    "shipments",
    setLoadingStates,
    "We could not load your dashboard data. Please try again later."
  );

  // ---- fetch truck  data using custom hook ----
  useFetchData(
    `${API_ENDPOINT}/api/truck`,
    setTruckData,
    "truckData",
    setLoadingStates,
    "We could not load your truck data. Please try again later."
  );

  // ---- fetch appointment data using custom hook ----
  useFetchData(
    `${API_ENDPOINT}/api/appointment`,
    setAppointmentData,
    "appointment",
    setLoadingStates,
    "We could not retrieve your appointment data. Please try again later."
  );

  // ---- fetch pre-delivery data for each shipment ----
  useEffect(() => {
    if (!shipmentsData.length) return;

    const fetchPreDeliveryData = async () => {
      setLoadingStates((prev) => ({ ...prev, preDelivery: true }));
      try {
        const responses = await Promise.all(
          shipmentsData.map((shipment) =>
            axios.get(
              `${API_ENDPOINT}/api/pre-delivery/${shipment.tracking_no}`
            )
          )
        );
        setPreDeliveryData(responses.map((res) => res.data));
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
        setLoadingStates((prev) => ({ ...prev, preDelivery: false }));
      }
    };

    fetchPreDeliveryData();
  }, [shipmentsData]);

  // ---- fetch products data ----
  useEffect(() => {
    if (!shipmentsData.length) return;

    const fetchProducts = async () => {
      setLoadingStates((prev) => ({ ...prev, products: true }));
      try {
        const trackingNumbers = shipmentsData
          .map((item) => item.tracking_no)
          .filter(Boolean);

        const responses = await Promise.all(
          trackingNumbers.map((trackingNo) =>
            axios.get(`${API_ENDPOINT}/api/product/${trackingNo}`)
          )
        );

        setProductsData(responses.flatMap((res) => res.data || []));
      } catch (error) {
        console.error("Error fetching product codes:", error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, products: false }));
      }
    };

    fetchProducts();
  }, [shipmentsData]);

  // ---- memoized values
  const todayPHT = useMemo(() => dayjs().tz("Asia/Manila").startOf("day"), []);

  // ---- show the today's appointment
  const todayAppointmentsCount = useMemo(
    () =>
      appointmentData.filter((appointment) =>
        dayjs(appointment.appointment_date)
          .tz("Asia/Manila")
          .startOf("day")
          .isSame(todayPHT, "day")
      ).length,
    [appointmentData, todayPHT]
  );

  // ---- card list
  const cardData = DASHBOARD_CARDS(
    todayAppointmentsCount,
    shipmentsData,
    truckData
  );

  return (
    <div className="my-5 mx-4">
      <Heading
        title="dashboard"
        description="Below is an overview of all orders, including transit, shipped, and completed transaction"
      />

      {isLoading ? (
        <div>
          <LoadingCard />
          <LoadingTable />
        </div>
      ) : (
        <>
          <div className="card_section flex gap-x-3">
            {cardData.map((card, index) => (
              <Card key={index} className="max-w-[320px]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-inter text-base font-medium">
                      {card.title}
                    </CardTitle>
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <h1 className="text-5xl font-bebas tracking-wider">
                    {card.value || 0}
                  </h1>
                  <p className="text-sm text-[#6c757d] mt-5">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <AdminSummaryTable
            data={shipmentsData}
            preDeliveryData={preDeliveryData}
            products={products}
          />
        </>
      )}
    </div>
  );
}
