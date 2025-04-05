// ---- react ----
import React, { useEffect, useState, useMemo } from "react";

// ---- component ----
import { ADMIN_APPOINTMENT_TABLE_HEADERS } from "@/components/header/table-headers";
import AppointmentDropdown from "@/components/dropdown/admin-appointment-dropdown";
import DeleteAppointmentModal from "@/components/modal/delete-appointment-modal";
import EditAppointmentModal from "@/components/modal/edit-appointment-modal";
import OrderSummaryPagination from "../admin-order-summary-pagination";
import AppointmentModal from "@/components/modal/appointment-modal";
import LoadingTable from "@/components/loading/loading-table";
import AppointmentReport from "@/report/appointment-report";
import DateRangePicker from "../date-range-picker-filter";
import SearchBar from "@/components/search/search-bar";

// ---- library ----
import dayjs from "dayjs"; // ---- dayjs
import axios from "axios"; // ---- axios
import { toast } from "sonner"; // ---- toast
import { Buffer } from "buffer"; // ---- buffer
import { useDebounce } from "react-use"; // ---- useDebounce
import { PDFDownloadLink } from "@react-pdf/renderer"; // ---- react-pdf
import {
  IdCard,
  FileChartColumnIncreasing,
  CalendarPlus,
  Pencil,
  Trash,
} from "lucide-react"; // ---- icons

// ---- utils ----
import { DELIVERY_STATUS_COLOR } from "@/utils/Color";
import { generateGatePass } from "@/utils/generateGatePass";

// prevent warning side of buffer is not define cause by react-pdf
window.Buffer = Buffer;

// ---- memoize ----
const MemoizedSearchBar = React.memo(SearchBar);
const MemoizedDateRangePicker = React.memo(DateRangePicker);

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AllAppointment() {
  // ---- stored the appointment data
  const [appointmentData, setAppointmentData] = useState([]);

  // ---- pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // ---- modal state check if its open
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- state for selected appointment id
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // ---- state for selected appointment to edit
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ---- state for handling the search input
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // debounce the search input (search engine)

  // ---- state for date range
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ---- state for dropdown
  const [appointmentType] = useState("all");

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

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

  // useDebounce hook helps us to prevent making too many requests to the api (search engine)
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // ---- filtered the data based on the search and date
  const filteredData = useMemo(() => {
    return appointmentData // search engine
      .filter((appointment) =>
        Object.values(appointment).some((value) =>
          String(value)
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
        )
      )
      .filter((appointment) => {
        // date range
        if (!startDate || !endDate) return true;

        const appointmentDate = new Date(appointment.appointment_date);

        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        return (
          appointmentDate >= startDate && appointmentDate <= adjustedEndDate
        );
      });
  }, [appointmentData, debouncedSearchTerm, startDate, endDate]);

  // ---- sort the data by date and time (nearest first)
  // ---- sort the data by status, date, and time
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      // Define status priority
      const statusPriority = { pending: 1, "in progress": 2, completed: 3 };

      // Compare based on status priority
      const statusA = statusPriority[a.status.toLowerCase()] || 4;
      const statusB = statusPriority[b.status.toLowerCase()] || 4;

      if (statusA !== statusB) {
        return statusA - statusB; // Lower priority number comes first
      }

      // If statuses are the same, compare by date and time
      const dateTimeA = new Date(a.appointment_date).setHours(
        new Date(a.appointment_time).getHours(),
        new Date(a.appointment_time).getMinutes(),
        new Date(a.appointment_time).getSeconds()
      );

      const dateTimeB = new Date(b.appointment_date).setHours(
        new Date(b.appointment_time).getHours(),
        new Date(b.appointment_time).getMinutes(),
        new Date(b.appointment_time).getSeconds()
      );

      return dateTimeA - dateTimeB; // Sort by earliest date & time
    });
  }, [filteredData]);

  // ---- pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // ---- fn to open create appointment modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

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
      {isModalOpen && (
        <AppointmentModal open={isModalOpen} setOpen={setIsModalOpen} />
      )}

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

      {isLoading ? (
        <LoadingTable />
      ) : appointmentData.length > 0 ? (
        <div className="table_section mt-5 font-inter w-full">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="border rounded-lg divide-y divide-gray-200">
                  <div className="py-5 px-4 flex justify-between items-center">
                    <div className="flex items-center justify-between gap-x-2 w-full">
                      <div className="flex items-center justify-center gap-x-2">
                        {/* search bar and filter */}
                        <MemoizedSearchBar
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                        />
                        <AppointmentDropdown
                          allData={appointmentData}
                          type={appointmentType}
                          startDate={startDate}
                          endDate={endDate}
                        />
                      </div>

                      <div>
                        {/* date-range filter*/}
                        <MemoizedDateRangePicker
                          startDate={startDate}
                          endDate={endDate}
                          setStartDate={setStartDate}
                          setEndDate={setEndDate}
                        />
                      </div>
                    </div>
                  </div>
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
                        {paginatedData.map((item, index) => (
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
                                title={`Download gate pass id ${item.appointment_id}`}
                              >
                                <IdCard
                                  size={20}
                                  className="mx-auto text-indigo-500"
                                />
                              </button>
                            </td>
                            <td className="td-admin-table">
                              <PDFDownloadLink
                                title={`Download appt report id ${item.appointment_id}`}
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
                                <Pencil size={15} />
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
                                <Trash size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <OrderSummaryPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 font-medium flex">
          No scheduled appointments. Click
          <CalendarPlus
            onClick={handleOpenModal}
            className="mx-2 text-blue-500 cursor-pointer"
          />
          to create a new appointment.
        </p>
      )}
    </>
  );
}
