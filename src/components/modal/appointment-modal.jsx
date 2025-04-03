// ---- headlessui ----
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// ---- icon ----
import { CalendarPlus, ChevronDown } from "lucide-react";

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

// ---- uuid (generate id) ----
import { v4 as uuidv4 } from "uuid";

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

// Get the current date/time in Philippine Time (PHT)
const today = dayjs().tz("Asia/Manila");

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function AppointmentModal({ open, setOpen }) {
  // auto-generated
  const [appointmentId, setAppointmentId] = useState("");

  // date/time state
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(today);

  // state for fields
  const [carrierName, setCarrierName] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");
  const [driverName, setDriverName] = useState("");
  const [helperName, setHelperName] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [dock, setDock] = useState("");

  // state for selected plate no.
  const [selectedPlate, setSelectedPlate] = useState("");

  // state for selected activity
  const [selectedActivity, setSelectedActivity] = useState("");

  // appointment status
  const [status] = useState("Pending");

  // state for truck data ( get the plate no)
  const [truckData, setTruckData] = useState([]);

  // state for activity data
  const [activityData, setActivityData] = useState([]);

  // state for appointment data list
  const [appointmentData, setAppointmentData] = useState([]);

  // loading state
  const [, setIsAppointmentLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsActivityLoading] = useState(false);
  const [, setIsTruckLoading] = useState(false);

  // error state
  const [carrierNameError, setCarrierNameError] = useState("");
  const [warehouseNameError, setWarehouseNameError] = useState("");
  const [warehouseAddressError, setWarehouseAddressError] = useState("");
  const [driverNameError, setDriverNameError] = useState("");
  const [helperNameError, setHelperNameError] = useState("");
  const [parkingSlotError, setParkingSlotError] = useState("");
  const [dockError, setDockError] = useState("");
  const [selectedPlateError, setSelectedPlateError] = useState("");
  const [selectedActivityError, setSelectedActivityError] = useState("");

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
          "We could not retrieve your plate number data. Please try again later.",
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

  // function to create an appointment
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !carrierName &&
      !warehouseName &&
      !warehouseAddress &&
      !driverName &&
      !helperName &&
      !parkingSlot &&
      !dock &&
      !selectedPlate &&
      !selectedActivity
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

    if (!carrierName) {
      setCarrierNameError("Carrier name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!warehouseName) {
      setWarehouseNameError("Warehouse name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!warehouseAddress) {
      setWarehouseAddressError("Warehouse address cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!driverName) {
      setDriverNameError("Driver name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!helperName) {
      setHelperNameError("Helper name cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!parkingSlot) {
      setParkingSlotError("Parking slot cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!dock) {
      setDockError("Dock cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!selectedPlate) {
      setSelectedPlateError("Please select a plate no.");
      setIsLoading(false);
      return;
    }

    if (!selectedActivity) {
      setSelectedActivityError("Please select an activity");
      setIsLoading(false);
      return;
    }

    // check if the plate no have alr an appointment
    if (hasExistingAppointment(appointmentData, selectedPlate, selectedDate)) {
      const formattedDate = dayjs(selectedDate)
        .tz("Asia/Manila")
        .format("MMMM D, YYYY");
      toast.warning(
        `Plate No. ${selectedPlate} already has an appointment on the ${formattedDate}.`,
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
      const appointmentData = {
        appointment_id: appointmentId,
        appointment_date: selectedDate.toISOString(),
        appointment_time: selectedTime.toISOString(),
        carrier_name: carrierName,
        warehouse_name: warehouseName,
        warehouse_address: warehouseAddress,
        driver_name: driverName,
        helper_name: helperName,
        parking_slot: parkingSlot,
        dock,
        plate_no: selectedPlate,
        activity: selectedActivity,
        status,
      };

      const response = await axios.post(
        `${API_ENDPOINT}/api/appointment/create-appointment`,
        appointmentData
      );

      if (response.status === 201) {
        toast.success("Successfully created an appointment", {
          style: {
            backgroundColor: "#28a745",
            color: "#fff",
          },
        });

        setCarrierName("");
        setDriverName("");
        setHelperName("");
        setParkingSlot("");
        setDock("");
        setSelectedPlate("");
        setSelectedActivity("");
        setOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create an appointment. Please try again later.", {
        style: {
          backgroundColor: "#ff4d4d",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // generate a short UID when modal opens
  useEffect(() => {
    if (open) {
      setAppointmentId(uuidv4().split("-")[0]);
    }
  }, [open]);

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
                <CalendarPlus size={20} /> Create an Appointment
              </DialogTitle>

              <div className="mt-5 flex gap-x-5">
                <div className="flex flex-col items-center ">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      value={selectedDate}
                      onChange={(newDate) =>
                        setSelectedDate(dayjs(newDate).tz("Asia/Manila"))
                      }
                      disablePast
                    />
                    <TimePicker
                      value={selectedTime}
                      onChange={(newTime) =>
                        setSelectedTime(dayjs(newTime).tz("Asia/Manila"))
                      }
                    />
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
                        value={appointmentId}
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
                        value={carrierName}
                        onChange={(e) => {
                          setCarrierName(e.target.value);
                          if (carrierNameError) setCarrierNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                        ${
                          carrierNameError
                            ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                            : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                        }`}
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
                        value={warehouseName}
                        onChange={(e) => {
                          setWarehouseName(e.target.value);
                          if (warehouseNameError) setWarehouseNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            warehouseNameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
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
                        value={warehouseAddress}
                        onChange={(e) => {
                          setWarehouseAddress(e.target.value);
                          if (warehouseAddressError)
                            setWarehouseAddressError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            warehouseAddressError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
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
                        value={driverName}
                        onChange={(e) => {
                          setDriverName(e.target.value);
                          if (driverNameError) setDriverNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            driverNameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
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
                        value={helperName}
                        onChange={(e) => {
                          setHelperName(e.target.value);
                          if (helperNameError) setHelperNameError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            helperNameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
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
                        value={parkingSlot}
                        onChange={(e) => {
                          setParkingSlot(e.target.value);
                          if (parkingSlotError) setParkingSlotError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            parkingSlotError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-inter text-[#979090]">
                        Dock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={dockError ? dockError : "Enter dock"}
                        value={dock}
                        onChange={(e) => {
                          setDock(e.target.value);
                          if (dockError) setDockError("");
                        }}
                        className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            dockError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
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
                              : selectedPlate
                              ? "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                              : "text-gray-400"
                          } 
                          outline-0 appearance-none pr-10`}
                          value={selectedPlate}
                          onChange={(e) => {
                            setSelectedPlate(e.target.value);
                            if (selectedPlateError) setSelectedPlateError("");
                          }}
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
                              : selectedActivity
                              ? "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                              : "text-gray-400"
                          } 
                          outline-0 appearance-none pr-10`}
                          value={selectedActivity}
                          onChange={(e) => {
                            setSelectedActivity(e.target.value);
                            if (selectedActivityError)
                              setSelectedActivityError("");
                          }}
                        >
                          <option value="">
                            {selectedActivityError
                              ? selectedActivityError
                              : "Select activity"}
                          </option>
                          {activityData.map((item, index) => (
                            <option key={index} value={item.activity_name}>
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
                onClick={handleCreateAppointment}
                className={
                  isLoading
                    ? "inline-flex w-full justify-center rounded-sm bg-green-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs opacity-50 sm:ml-3 sm:w-auto cursor-progress   "
                    : "inline-flex w-full justify-center rounded-sm bg-green-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs hover:opacity-80 sm:ml-3 sm:w-auto cursor-pointer  "
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    Creating an appointment <LoadingSpinner />
                  </div>
                ) : (
                  "Create an appointment"
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
AppointmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
