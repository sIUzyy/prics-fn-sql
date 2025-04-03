// ---- react ----
import React, { useEffect, useState, useMemo } from "react";

// ---- component ----
import { ADMIN_APPOINTMENT_TABLE_HEADERS } from "@/components/header/table-headers";
import AppointmentDropdown from "@/components/dropdown/admin-appointment-dropdown";
import DeleteAppointmentModal from "@/components/modal/delete-appointment-modal";
import EditAppointmentModal from "@/components/modal/edit-appointment-modal";
import LoadingTable from "@/components/loading/loading-table";
import AppointmentReport from "@/report/appointment-report";
import SearchBar from "@/components/search/search-bar";

// ---- icons ----
import { IdCard, FileChartColumnIncreasing } from "lucide-react";

// ---- react-router ----
import { Link } from "react-router";

// ---- library ----
import axios from "axios"; // ---- axios
import dayjs from "dayjs"; // ---- dayjs
import { toast } from "sonner"; // ---- toast
import { Buffer } from "buffer"; // ---- buffer
import { useDebounce } from "react-use"; // ---- useDebounce
import { PDFDownloadLink } from "@react-pdf/renderer"; // ---- react-pdf

// ---- utils ----
import { DELIVERY_STATUS_COLOR } from "@/utils/Color";
import { generateGatePass } from "@/utils/generateGatePass";

// ---- memoize ----
const MemoizedSearchBar = React.memo(SearchBar);

// prevent warning side of buffer is not define cause by react-pdf
window.Buffer = Buffer;

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function TodayAppointment() {
  // ---- stored the appointment data
  const [appointmentData, setAppointmentData] = useState([]);

  // ---- modal state check if its open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- state for selected appointment id
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // ---- state for selected appointment to edit
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ---- state for handling the search input
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // debounce the search input (search engine)

  // ---- state for dropdown
  const [appointmentType] = useState("today");

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

  // useDebounce hook helps us to prevent making too many requests to the api (search engine)
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // ---- fn to fetch all the appointments
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/appointment`);
        const data = response.data;
        setAppointmentData(data);
      } catch (error) {
        console.error("Failed to fetch appointment", error);
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
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchAppointmentData();
  }, []);

  // ---- fn to open delete appointment modal
  const handleDeleteModal = (apptId) => {
    setSelectedAppointmentId(apptId);
    setIsDeleteModalOpen(true);
  };

  // ---- fn to open edit appointment modal
  const handleEditModal = (apptId) => {
    const appointment = appointmentData.find(
      (appt) => appt.appointment_id === apptId
    );
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // ---- get today's date in Philippine Time (PHT) using Intl.DateTimeFormat
  const todayPHT = useMemo(() => {
    return dayjs().tz("Asia/Manila").startOf("day");
  }, []);

  // ---- filter and sort today's appointments
  const todayAppointments = useMemo(() => {
    return appointmentData
      .filter((appointment) => {
        const appointmentDate = dayjs(appointment.appointment_date)
          .tz("Asia/Manila")
          .startOf("day");
        return appointmentDate.isSame(todayPHT, "day");
      })
      .filter((appointment) =>
        Object.values(appointment).some((value) => {
          const valueStr = String(value).toLowerCase();
          const searchStr = debouncedSearchTerm.toLowerCase();

          // Handle time formatting for searching
          if (appointment.appointment_time) {
            const formattedTime = dayjs(appointment.appointment_time)
              .tz("Asia/Manila")
              .format("hh:mm A") // Convert to 12-hour format
              .toLowerCase();

            if (formattedTime.includes(searchStr)) {
              return true;
            }
          }

          // Check if the search term is a number
          if (!isNaN(debouncedSearchTerm) && !isNaN(value)) {
            return String(value).includes(debouncedSearchTerm);
          }

          return valueStr.includes(searchStr);
        })
      )
      .sort((a, b) => {
        // Define the priority of statuses
        const statusPriority = { pending: 1, "in progress": 2, delivered: 3 };

        // Compare based on status priority
        const statusA = statusPriority[a.status.toLowerCase()] || 4;
        const statusB = statusPriority[b.status.toLowerCase()] || 4;

        if (statusA !== statusB) {
          return statusA - statusB; // Lower number means higher priority
        }

        // If statuses are the same, sort by appointment time
        const timeA = dayjs(a.appointment_time).tz("Asia/Manila");
        const timeB = dayjs(b.appointment_time).tz("Asia/Manila");
        return timeA.diff(timeB); // Sort by earliest time first
      });
  }, [appointmentData, todayPHT, debouncedSearchTerm]);

  // ---- change the status color depends on its status
  const getStatusClass = (status) => {
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return formattedStatus === "Pending"
      ? `${DELIVERY_STATUS_COLOR.transit} text-white px-5 py-1 rounded-full capitalize`
      : formattedStatus === "In progress"
      ? `${DELIVERY_STATUS_COLOR.receiving} text-white px-5 py-1 rounded-full capitalize`
      : formattedStatus === "Completed"
      ? `${DELIVERY_STATUS_COLOR.delivered} text-white px-5 py-1 rounded-full capitalize`
      : "bg-gray-400 text-white px-5 py-1 rounded-full capitalize";
  };

  return (
    <>
      {isDeleteModalOpen && (
        <DeleteAppointmentModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          selectedAppointmentId={selectedAppointmentId}
        />
      )}

      {isEditModalOpen && (
        <EditAppointmentModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          selectedAppointment={selectedAppointment}
        />
      )}

      <div className="table_section mt-5 font-inter w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-5 px-4 flex justify-between items-center">
                  <div className="flex items-center justify-center gap-x-2">
                    <div>
                      <MemoizedSearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    </div>
                    <AppointmentDropdown
                      todayData={todayAppointments}
                      type={appointmentType}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <LoadingTable />
                ) : todayAppointments.length > 0 ? (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="th-user-table">
                        <tr>
                          {ADMIN_APPOINTMENT_TABLE_HEADERS.map(
                            (header, index) => (
                              <th key={index} className="px-6 py-2">
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {todayAppointments.map((item, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                          >
                            <td className="td-admin-table">
                              {item.appointment_id}
                            </td>
                            <td className="td-admin-table">
                              {item.carrier_name}
                            </td>
                            <td className="td-admin-table uppercase">
                              {item.plate_no}
                            </td>
                            <td className="td-admin-table">
                              {dayjs(item.appointment_date)
                                .tz("Asia/Manila")
                                .format("MMMM DD, YYYY")}
                            </td>
                            <td className="td-admin-table">
                              {dayjs(item.appointment_time)
                                .tz("Asia/Manila")
                                .format("hh:mm A")}
                            </td>
                            <td className="td-admin-table capitalize">
                              {item.warehouse_name}
                            </td>

                            <td className="td-admin-table capitalize">
                              {item.warehouse_address}
                            </td>
                            <td className="td-admin-table capitalize">
                              {item.activity}
                            </td>
                            <td className="td-admin-table capitalize">
                              {item.driver_name}
                            </td>
                            <td className="td-admin-table capitalize">
                              {item.helper_name}
                            </td>
                            <td className="td-admin-table">
                              {item.parking_slot}
                            </td>
                            <td className="td-admin-table">{item.dock}</td>
                            <td className="td-admin-table">
                              {item.time_in
                                ? dayjs(item.time_in).format(
                                    "MMMM D, YYYY hh:mm A"
                                  ) // Example: March 13, 2025 01:45 PM
                                : "-"}
                            </td>
                            <td className="td-admin-table">
                              {item.time_out
                                ? dayjs(item.time_out).format(
                                    "MMMM D, YYYY hh:mm A"
                                  ) // Example: March 13, 2025 01:45 PM
                                : "-"}
                            </td>
                            <td className="td-admin-table capitalize">
                              <span className={getStatusClass(item.status)}>
                                {item.status}
                              </span>
                            </td>
                            <td className="td-admin-table flex justify-center">
                              <button
                                onClick={() =>
                                  generateGatePass(item.appointment_id)
                                }
                                className="cursor-pointer outline-none"
                                title={`Download appointment id ${item.appointment_id}`}
                              >
                                <IdCard
                                  size={20}
                                  className="mx-auto text-indigo-500"
                                />
                              </button>
                            </td>
                            <td className="td-admin-table">
                              <PDFDownloadLink
                                document={
                                  <AppointmentReport
                                    data={appointmentData.filter(
                                      (appt) =>
                                        appt.appointment_id ===
                                        item.appointment_id
                                    )}
                                  />
                                }
                                fileName={`APPOINTMENT_ID:${item.appointment_id}_APPT_REPORT.pdf`}
                              >
                                <FileChartColumnIncreasing
                                  size={20}
                                  className="mx-auto text-indigo-500 outline-none"
                                />
                              </PDFDownloadLink>
                            </td>
                            <td className="td-admin-table">
                              <button
                                title={`Edit appt. id ${item.appointment_id}`}
                                className="text-green-600 mr-2 cursor-pointer outline-none"
                                onClick={() =>
                                  handleEditModal(item.appointment_id)
                                }
                              >
                                Edit
                              </button>
                              <button
                                title={`Delete appt. id ${item.appointment_id}`}
                                className={`text-red-600 outline-none ${
                                  item.status === "Completed"
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                                }`}
                                onClick={() =>
                                  handleDeleteModal(item.appointment_id)
                                }
                                disabled={item.status === "Completed"}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 font-medium px-4 py-5">
                    No scheduled appointments for today. View{" "}
                    <Link
                      to={"/admin/appointments/all-appointments"}
                      className="text-blue-500 underline"
                    >
                      all appointments
                    </Link>{" "}
                    for more information.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
