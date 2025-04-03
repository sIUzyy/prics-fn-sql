// ---- headlessui ----
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// ---- icon ----
import { Pencil, ChevronDown } from "lucide-react";

// ---- props validation ----
import PropTypes from "prop-types";

// ---- react-datepicker
import "react-datepicker/dist/react-datepicker.css";

// ---- mui ----
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// ---- dayjs ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ---- react ----
import { useEffect, useState } from "react";

// ---- axios ----
import axios from "axios";

// ---- toast ----
import { toast } from "sonner";

// ---- component ----
import LoadingSpinner from "../loading/loading-spinner";

// ---- utils ----
import { hasExistingAppointment } from "@/utils/checkAppointment";

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function EditAppointmentModal({
  open,
  setOpen,
  selectedAppointment,
}) {
  const {
    appointment_id,
    carrier_name,
    driver_name,
    helper_name,
    parking_slot,
    dock,
    plate_no,
    appointment_date,
    appointment_time,
    activity,
    warehouse_name,
    warehouse_address,
  } = selectedAppointment || {}; // Prevents errors if `selectedAppointment` is null/undefined

  // state for appointment data list
  const [appointmentData, setAppointmentData] = useState([]);

  // auto-generated
  const [editAppointmentId] = useState(appointment_id);

  // date/time state
  const [editSelectedDate, setEditSelectedDate] = useState(
    appointment_date ? dayjs(appointment_date) : dayjs().tz("Asia/Manila")
  );
  const [editSelectedTime, setEditSelectedTime] = useState(
    appointment_time ? dayjs(appointment_time) : dayjs().tz("Asia/Manila")
  );

  // state for fields
  const [editWarehouseAddress, setEditWarehouseAddress] =
    useState(warehouse_address);
  const [editWarehouseName, setEditWarehouseName] = useState(warehouse_name);
  const [editCarrierName, setEditCarrierName] = useState(carrier_name);
  const [editParkingSlot, setEditParkingSlot] = useState(parking_slot);
  const [editDriverName, setEditDriverName] = useState(driver_name);
  const [editHelperName, setEditHelperName] = useState(helper_name);
  const [editDock, setEditDock] = useState(dock);

  // state for selected plate no.
  const [editSelectedActivity, setEditSelectedActivity] = useState(activity);
  const [editSelectedPlate, setEditSelectedPlate] = useState(plate_no);

  // state for truck data ( get the plate no)
  const [truckData, setTruckData] = useState([]);

  // state for activity data
  const [activityData, setActivityData] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsTruckLoading] = useState(false);
  const [, setIsActivityLoading] = useState(false);
  const [, setIsAppointmentLoading] = useState(false);

  // error state
  const [warehouseAddressError, setWarehouseAddressError] = useState("");
  const [selectedActivityError, setSelectedActivityError] = useState("");
  const [warehouseNameError, setWarehouseNameError] = useState("");
  const [selectedPlateError, setSelectedPlateError] = useState("");
  const [parkingSlotError, setParkingSlotError] = useState("");
  const [carrierNameError, setCarrierNameError] = useState("");
  const [driverNameError, setDriverNameError] = useState("");
  const [helperNameError, setHelperNameError] = useState("");
  const [dockError, setDockError] = useState("");

  // function to get the list of plate no
  useEffect(() => {
    const fetchPlateNo = async () => {
      setIsTruckLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/truck`);
        const data = response.data.trucks;

        setTruckData(data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error(
          "We could not load your plate no. list data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setIsTruckLoading(false);
      }
    };

    fetchPlateNo();
  }, []);

  // function to get the list of activity
  useEffect(() => {
    const fetchActivity = async () => {
      setIsActivityLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/activity`);
        const data = response.data.activities;

        setActivityData(data);

        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error(
          "We could not retrieve your activity data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setIsActivityLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // function to fetch all the appointments
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setIsAppointmentLoading(true);
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
        setIsAppointmentLoading(false);
      }
    };

    fetchAppointmentData();
  }, []);

  // function to handle update appointment
  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !editCarrierName &&
      !editWarehouseName &&
      !editWarehouseAddress &&
      !editDriverName &&
      !editHelperName &&
      !editParkingSlot &&
      !editDock &&
      !editSelectedPlate &&
      !editSelectedActivity
    ) {
      setCarrierNameError("Carrier name cannot be empty.");
      setWarehouseNameError("Warehouse name cannot be empty.");
      setWarehouseAddressError("Warehouse address cannot be empty.");
      setDriverNameError("Driver name cannot be empty.");
      setHelperNameError("Helper name cannot be empty.");
      setParkingSlotError("Parking slot cannot be empty.");
      setDockError("Dock cannot be empty.");
      setSelectedPlateError("Please select a plate no.");
      setSelectedActivityError("Please select an activity");
      setIsLoading(false);
      return;
    }

    if (!editCarrierName) {
      setCarrierNameError("Carrier name cannot be empty.");
      setIsLoading(false);
      return;
    }

    if (!editWarehouseName) {
      setWarehouseNameError("Warehouse name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!editWarehouseAddress) {
      setWarehouseAddressError("Warehouse address cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!editDriverName) {
      setDriverNameError("Driver name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!editHelperName) {
      setHelperNameError("Helper name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!editParkingSlot) {
      setParkingSlotError("Parking slot cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!editDock) {
      setDockError("Dock cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!editSelectedPlate) {
      setSelectedPlateError("Please select a plate no.");
      setIsLoading(false);
      return;
    }

    if (!editSelectedActivity) {
      setSelectedActivityError("Please select an activity");
      setIsLoading(false);
      return;
    }

    // check if the plate no have alr an appointment
    if (
      hasExistingAppointment(
        appointmentData,
        editSelectedPlate,
        editSelectedDate,
        appointment_id
      )
    ) {
      const formattedDate = dayjs(editSelectedDate)
        .tz("Asia/Manila")
        .format("MMMM D, YYYY");
      toast.warning(
        `Plate No. ${editSelectedPlate} already has an appointment on the ${formattedDate}.`,
        {
          style: {
            backgroundColor: "#ffa500",
            color: "#fff",
          },
        }
      );
      setIsLoading(false);
      return;
    }

    try {
      const updatedAppointmentData = {
        appointment_date: editSelectedDate.toISOString(),
        appointment_time: editSelectedTime.toISOString(),
        carrier_name: editCarrierName,
        warehouse_name: editWarehouseName,
        warehouse_address: editWarehouseAddress,
        driver_name: editDriverName,
        helper_name: editHelperName,
        parking_slot: editParkingSlot,
        dock: editDock,
        plate_no: editSelectedPlate,
        activity: editSelectedActivity,
      };

      const response = await axios.patch(
        `${API_ENDPOINT}/api/appointment/${appointment_id}/update-appointment`,
        updatedAppointmentData
      );

      if (response.status === 200) {
        toast.success("Successfully update the appointment", {
          style: {
            backgroundColor: "#28a745",
            color: "#fff",
          },
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the appointment. Please try again later.", {
        style: {
          backgroundColor: "#ff4d4d",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen  overflow-y-auto">
        <div className="flex w-full min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="w-[1200px] max-w-full sm:w-[800px] md:w-[1000px] lg:w-[1000px] relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
          >
            <div className="bg-white   px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <DialogTitle
                as="h1"
                className="font-inter flex items-center gap-x-2 font-medium text-base tracking-wider"
              >
                <Pencil size={20} /> Edit Appointment Id: {editAppointmentId}
              </DialogTitle>

              <div className="mt-5 flex gap-x-5">
                <div className="flex flex-col items-center ">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div
                      className={`${
                        ["In Progress", "Completed"].includes(
                          selectedAppointment?.status
                        )
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <DateCalendar
                        value={
                          editSelectedDate ? dayjs(editSelectedDate) : null
                        }
                        onChange={(newDate) =>
                          newDate &&
                          setEditSelectedDate(dayjs(newDate).tz("Asia/Manila"))
                        }
                        disablePast
                        disabled={["In Progress", "Completed"].includes(
                          selectedAppointment?.status
                        )}
                      />
                    </div>

                    <div
                      className={`${
                        ["In Progress", "Completed"].includes(
                          selectedAppointment?.status
                        )
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <TimePicker
                        value={
                          editSelectedTime ? dayjs(editSelectedTime) : null
                        }
                        onChange={(newTime) =>
                          newTime &&
                          setEditSelectedTime(dayjs(newTime).tz("Asia/Manila"))
                        }
                        disabled={["In Progress", "Completed"].includes(
                          selectedAppointment?.status
                        )}
                      />
                    </div>
                  </LocalizationProvider>
                </div>

                <div className="forms">
                  <div className="flex gap-x-5">
                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Appointment ID
                      </label>
                      <input
                        type="text"
                        value={editAppointmentId}
                        readOnly
                        placeholder="Appointment ID"
                        disabled
                        className=" p-4 w-full mt-1 rounded-md  cursor-not-allowed bg-gray-100 "
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Carrier Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          carrierNameError
                            ? carrierNameError
                            : "Enter carrier name"
                        }
                        value={editCarrierName}
                        onChange={(e) => {
                          setEditCarrierName(e.target.value);
                          if (carrierNameError) setCarrierNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                        ${
                          carrierNameError
                            ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                            : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                        } ${
                          selectedAppointment?.status === "Completed"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="flex gap-x-5 mt-5">
                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Warehouse Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          warehouseNameError
                            ? warehouseNameError
                            : "Enter warehouse name"
                        }
                        value={editWarehouseName}
                        onChange={(e) => {
                          setEditWarehouseName(e.target.value);
                          if (warehouseNameError) setWarehouseNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            warehouseNameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          } ${
                          selectedAppointment?.status === "Completed"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Warehouse Address{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          warehouseAddressError
                            ? warehouseAddressError
                            : "Enter warehouse address"
                        }
                        value={editWarehouseAddress}
                        onChange={(e) => {
                          setEditWarehouseAddress(e.target.value);
                          if (warehouseAddressError)
                            setWarehouseAddressError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            warehouseAddressError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          } ${
                          selectedAppointment?.status === "Completed"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="flex gap-x-5 mt-5">
                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Driver Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          driverNameError
                            ? driverNameError
                            : "Enter driver name"
                        }
                        value={editDriverName}
                        onChange={(e) => {
                          setEditDriverName(e.target.value);
                          if (driverNameError) setDriverNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            driverNameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          } ${
                          selectedAppointment?.status === "Completed"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Helper Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          helperNameError
                            ? helperNameError
                            : "Enter helper name"
                        }
                        value={editHelperName}
                        onChange={(e) => {
                          setEditHelperName(e.target.value);
                          if (helperNameError) setHelperNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            helperNameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          } ${
                          selectedAppointment?.status === "Completed"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="flex gap-x-5 mt-5">
                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Parking Slot <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          parkingSlotError
                            ? parkingSlotError
                            : "Enter parking slot"
                        }
                        value={editParkingSlot}
                        onChange={(e) => {
                          setEditParkingSlot(e.target.value);
                          if (parkingSlotError) setParkingSlotError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            parkingSlotError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }
                           ${
                             selectedAppointment?.status === "Completed"
                               ? "cursor-not-allowed opacity-50"
                               : ""
                           }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Dock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={dockError ? dockError : "Enter dock"}
                        value={editDock}
                        onChange={(e) => {
                          setEditDock(e.target.value);
                          if (dockError) setDockError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            dockError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }
                          ${
                            selectedAppointment?.status === "Completed"
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        disabled={selectedAppointment?.status === "Completed"}
                      />
                    </div>
                  </div>

                  <div className="flex gap-x-5 mt-5">
                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Plate No. <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-0">
                        <select
                          className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            selectedPlateError
                              ? "border-red-500 focus:ring-red-500 text-red-500"
                              : editSelectedPlate
                              ? "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                              : "text-gray-400"
                          } 
                          outline-0 appearance-none pr-10
                          ${
                            ["In Progress", "Completed"].includes(
                              selectedAppointment?.status
                            )
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          value={editSelectedPlate}
                          onChange={(e) => {
                            setEditSelectedPlate(e.target.value);
                            if (selectedPlateError) setSelectedPlateError("");
                          }}
                          disabled={["In Progress", "Completed"].includes(
                            selectedAppointment?.status
                          )}
                        >
                          <option value="">
                            {selectedPlateError
                              ? selectedPlateError
                              : "Select plate no."}
                          </option>
                          {truckData.map((plateNo, index) => (
                            <option key={index} value={plateNo.plate_no}>
                              {plateNo.plate_no}
                            </option>
                          ))}
                        </select>

                        {/* Custom Arrow */}
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <ChevronDown className="text-gray-400" size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Activity <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-0">
                        <select
                          className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            selectedActivityError
                              ? "border-red-500 focus:ring-red-500 text-red-500"
                              : editSelectedActivity
                              ? "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                              : "text-gray-400"
                          } 
                          outline-0 appearance-none pr-10
                          ${
                            ["In Progress", "Completed"].includes(
                              selectedAppointment?.status
                            )
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          value={editSelectedActivity}
                          onChange={(e) => {
                            setEditSelectedActivity(e.target.value);
                            if (selectedActivityError)
                              setSelectedActivityError("");
                          }}
                          disabled={["In Progress", "Completed"].includes(
                            selectedAppointment?.status
                          )}
                        >
                          <option value="">
                            {selectedActivityError
                              ? selectedActivityError
                              : "Select select activity"}
                          </option>
                          {activityData.map((item, index) => (
                            <option key={index} value={item.activty_name}>
                              {item.activity_name}
                            </option>
                          ))}
                        </select>

                        {/* Custom Arrow */}
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <ChevronDown className="text-gray-400" size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleUpdateAppointment}
                className={`
    inline-flex w-full justify-center rounded-sm px-10 py-2 text-center text-sm font-medium text-white shadow-xs sm:ml-3 sm:w-auto
    ${
      isLoading || selectedAppointment?.status === "Completed"
        ? "bg-green-600 opacity-50 cursor-not-allowed"
        : "bg-green-600 hover:opacity-80 cursor-pointer"
    }
  `}
                disabled={
                  isLoading || selectedAppointment?.status === "Completed"
                }
              >
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    Editing an appointment <LoadingSpinner />
                  </div>
                ) : (
                  "Edit an appointment"
                )}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className={
                  isLoading
                    ? "mt-3 inline-flex w-full justify-center rounded-sm bg-white px-10 py-2 text-sm font-medium text-gray-900   cursor-not-allowed   hover:bg-gray-50 sm:mt-0 sm:w-auto border-1"
                    : "mt-3 inline-flex w-full justify-center rounded-sm bg-white px-10 py-2 text-sm font-medium text-gray-900   cursor-pointer   hover:bg-gray-50 sm:mt-0 sm:w-auto border-1"
                }
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

// Prop Validation
EditAppointmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.array,
};
