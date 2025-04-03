// ---- react ----
import { useState, useMemo, useCallback } from "react";

// ---- react-router-dom ----
import { NavLink, Outlet } from "react-router-dom";

// ---- shadcn components ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- components ----
import AppointmentModal from "@/components/modal/appointment-modal";
import { APPOINTMENT_CARDS } from "@/components/card/card-list";
import LoadingCard from "@/components/loading/loading-card";
import Heading from "@/components/header/page-heading";

// ---- custom hooks ----
import { useFetchData } from "@/hooks/use-fetch-data";

// ---- libraries ----
import { CalendarPlus } from "lucide-react";
import axios from "axios";

// ---- dayjs config ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// ---- api endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AdminAppointmentPage() {
  // ---- state management ----
  const [appointmentData, setAppointmentData] = useState([]); // ---- appointment table data
  const [truckData, setTruckData] = useState([]); // ---- truck table data

  // ---- modal state to open the create appt ----
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- loading states ----
  const [loadingStates, setLoadingStates] = useState({
    appointment: false,
    truck: false,
  });

  const setLoading = useCallback((key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ---- fetch the appointment using custom hooks ----
  useFetchData(
    `${API_ENDPOINT}/api/appointment`,
    setAppointmentData,
    "appointment",
    setLoadingStates,
    "We could not retrieve your appointment data. Please try again later."
  );

  // ---- fetch the truck data using custom hooks ----
  useFetchData(
    `${API_ENDPOINT}/api/truck`,
    setTruckData,
    "truck",
    setLoadingStates,
    "We could not load your truck list data. Please try again later."
  );

  // ---- memoized values
  const todayPHT = useMemo(() => dayjs().tz("Asia/Manila").startOf("day"), []);

  // ---- show the today's appt
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

  // ---- card values ----
  const cardValues = useMemo(
    () => ({
      today: todayAppointmentsCount,
      total: appointmentData.length,
      trucks: truckData.length,
    }),
    [todayAppointmentsCount, appointmentData.length, truckData.length]
  );

  // ---- loading ----
  const isLoading = loadingStates.appointment || loadingStates.truck;

  // ---- card list ----
  const cardData = APPOINTMENT_CARDS(
    todayAppointmentsCount,
    appointmentData,
    truckData
  );

  return (
    <>
      <AppointmentModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onSuccess={() => {
          setLoading("appointment", true);
          axios
            .get(`${API_ENDPOINT}/api/appointment`)
            .then((res) => setAppointmentData(res.data))
            .catch(console.error)
            .finally(() => setLoading("appointment", false));
        }}
      />

      <div className="my-5 mx-4">
        <Heading
          title="Appointment"
          description="Below is an overview of your appointments."
        />

        {isLoading ? (
          <LoadingCard />
        ) : (
          <div className="card_section flex gap-x-3">
            {cardData.map((card) => (
              <Card key={card.id} className="max-w-[320px]">
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
                    {cardValues[card.id] || 0}
                  </h1>
                  <p className="text-sm text-[#6c757d] mt-5">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="outlet_todays_all_appointment my-5">
          <div className="outlet_navigation flex gap-x-5 items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Create appointment"
            >
              <CalendarPlus className="cursor-pointer" />
            </button>

            <NavLink
              to="/admin/appointments/today-appointments"
              className={({ isActive }) =>
                `font-bold uppercase ${
                  isActive
                    ? "text-blue-500 underline decoration-2 underline-offset-5"
                    : "text-[#979090] hover:text-blue-500"
                }`
              }
            >
              Today’s Appointment
            </NavLink>
            <NavLink
              to="/admin/appointments/all-appointments"
              className={({ isActive }) =>
                `font-bold uppercase ${
                  isActive
                    ? "text-blue-500 underline decoration-2 underline-offset-5"
                    : "text-[#979090] hover:text-blue-500"
                }`
              }
            >
              All Appointments
            </NavLink>
          </div>

          <div className="outlet_table my-5">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
