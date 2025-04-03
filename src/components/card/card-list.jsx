// ---- icons ----
import { CalendarCheck2, NotepadText, Truck } from "lucide-react";

// ---- admin dashboard cards ----
export const DASHBOARD_CARDS = (
  todayAppointmentsCount,
  shipmentsData,
  truckData
) => [
  {
    id: "appointments",
    title: "Today's Appointment",
    icon: <CalendarCheck2 size={25} />,
    value: todayAppointmentsCount,
    description:
      "Go to the Appointment menu to create and view the list of appointments.",
  },
  {
    id: "tracking",
    title: "Total Tracking No.",
    icon: <NotepadText size={25} />,
    value: shipmentsData.length,
    description:
      "Use this tracking number to monitor the movement and status of items within the warehouse.",
  },
  {
    id: "trucks",
    title: "Total Trucks",
    icon: <Truck size={25} />,
    value: truckData.length,
    description:
      "Total number of trucks you own and have available for your operations or transport needs.",
  },
];

// ---- admin appointment cards ----
export const APPOINTMENT_CARDS = (
  todayAppointmentsCount,
  appointmentData,
  truckData
) => [
  {
    id: "today",
    title: "Today's Appointment",
    icon: <CalendarCheck2 size={25} />,
    value: todayAppointmentsCount,
    description: "Total Number of Appointments Scheduled for Today",
  },
  {
    id: "total",
    title: "Total Appointment",
    icon: <CalendarCheck2 size={25} />,
    value: appointmentData.length,
    description: "Total number of appointments recorded in the system.",
  },
  {
    id: "trucks",
    title: "Total Trucks",
    icon: <Truck size={25} />,
    value: truckData.length,
    description: "Total number of trucks available for operations.",
  },
];
