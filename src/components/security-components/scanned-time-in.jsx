// ---- react ----
import { useState, useRef } from "react";

// ---- components ----
import LoadingSpinner from "../loading/loading-spinner";

// ---- library to scan the barcode ----
import { BrowserMultiFormatReader } from "@zxing/browser";

// ---- dayjs ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ---- axios ----
import axios from "axios";

// ---- load plugins ----
dayjs.extend(utc);
dayjs.extend(timezone);

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function ScannedTimeIn() {
  // ---- state to stored the appointment list data
  const [appointmentData, setAppointmentData] = useState([]);

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsApptLoading] = useState(false);

  // ---- error state
  const [error, setError] = useState("");

  // ---- reference for video element
  const videoRef = useRef(null);

  // ---- function to start the scanner
  const startScanner = async () => {
    setIsLoading(true);
    setError("");

    try {
      // ---- forces back camera
      const constraints = {
        video: { facingMode: { exact: "environment" } },
      };

      await navigator.mediaDevices.getUserMedia(constraints);
      // await navigator.mediaDevices.getUserMedia({ video: true });

      const codeReader = new BrowserMultiFormatReader();

      // check if the video element is available
      if (!videoRef.current) {
        setError("An unexpected error occurred while accessing the video.");
        setIsLoading(false);
        return;
      }

      // start the scanner
      codeReader.decodeFromVideoDevice(
        undefined, // use the default camera
        videoRef.current,
        (result, err) => {
          if (result) {
            setIsLoading(false);

            // get the scanned code
            const scannedCode = result.getText();

            // pass the scanned code to fetch the shipment data function
            fetchAppointmentData(scannedCode);

            // stop the scanner
            codeReader.reset();
          } else if (err) {
            // ignore NotFoundException **meaning there's no barcode was found in the frame
            if (err.name !== "NotFoundException") {
              // console.error("Scanner Error:", err);
            }
          }
        }
      );
    } catch (err) {
      console.error("Scanner Initialization Error:", err);
      setError(
        "Camera access is blocked. Please allow camera permissions and try again."
      );
      setIsLoading(false);
    }
  };

  // ---- function to fetch the appointment list data
  const fetchAppointmentData = async (apptId) => {
    setIsApptLoading(true);
    setError("");

    if (!apptId) {
      setError("No appointment ID found. Please try again.");
      setIsApptLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_ENDPOINT}/api/appointment/${apptId}/gate-pass/time-in`
      );

      if (response.status === 200) {
        console.log(response.data.appointment);
        setAppointmentData([response.data.appointment]);

        // ** Refresh the page after 20 seconds **
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message;

        if (errorMessage === "Appointment ID already exists in the system.") {
          setError("Appointment ID already exists in the system.");
        } else if (
          errorMessage === "This appointment is not scheduled for today."
        ) {
          setError(
            "This appointment is not scheduled for today. Please check the date."
          );
        } else if (errorMessage === "Time-in already recorded") {
          setError("Time-in has already been recorded for this appointment.");
        } else {
          setError("Failed to update scan. Try scanning again.");
        }
      } else if (err.response?.status === 404) {
        setError(
          "No appointment record found. Please verify the ID and retry."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      // ** Refresh the page after 5 seconds on error **
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } finally {
      setIsApptLoading(false);
    }
  };

  return (
    <div>
      {/* video preview for barcode scanning */}
      {isLoading && (
        <video
          ref={videoRef}
          className="w-full my-3 rounded-lg"
          autoPlay
          playsInline
        />
      )}
      <button
        onClick={startScanner}
        disabled={isLoading}
        className={
          isLoading
            ? "w-full p-3 rounded-md bg-black text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-progress"
            : "w-full p-3 rounded-md bg-black text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-pointer"
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-x-2">
            <span>Scanning</span>
            <LoadingSpinner />
          </div>
        ) : (
          "  Scan Barcode"
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm font-bold mt-5 text-center">
          {error}
        </p>
      )}
      {appointmentData.map((appt, index) => (
        <div key={index} className="my-5">
          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Appointment Id
            </label>
            <input
              type="text"
              value={appt.appointment_id}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Appointment Date
            </label>
            <input
              type="text"
              value={dayjs
                .utc(appt.appointment_date)
                .tz("Asia/Manila")
                .format("MMMM D, YYYY")}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Appointment Time
            </label>
            <input
              type="text"
              value={dayjs
                .utc(appt.appointment_time)
                .tz("Asia/Manila")
                .format("hh:mm A")}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Driver name
            </label>
            <input
              type="text"
              value={appt.driver_name}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Plate No.
            </label>
            <input
              type="text"
              value={appt.plate_no}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Parking Slot
            </label>
            <input
              type="text"
              value={appt.parking_slot}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">Dock</label>
            <input
              type="text"
              value={appt.dock}
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">Time In</label>
            <input
              type="text"
              value={
                appt.time_in
                  ? dayjs(appt.time_in).format("MMMM D, YYYY hh:mm A") // Example: March 13, 2025 01:45 PM
                  : "N/A"
              }
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>

          <div className="my-5">
            <label className="text-sm font-inter text-[#979090]">
              Time Out
            </label>
            <input
              type="text"
              value={
                appt.time_out
                  ? dayjs(appt.time_out).format("MMMM D, YYYY hh:mm A") // Example: March 13, 2025 01:45 PM
                  : "N/A"
              }
              readOnly
              className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
