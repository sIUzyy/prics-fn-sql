// axios
import axios from "axios";

import { BrowserMultiFormatReader } from "@zxing/browser";

import { useState, useRef } from "react";
import LoadingSpinner from "../loading/loading-spinner";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Load plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function ScannedGatePass() {
  const [appointmentData, setAppointmentData] = useState([]);

  // state for loading
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsApptLoading] = useState(false);

  // state for error
  const [error, setError] = useState("");

  // reference for video element
  const videoRef = useRef(null);

  // function to start the scanner
  const startScanner = async () => {
    setIsLoading(true);
    setError("");

    try {
      const constraints = {
        video: { facingMode: { exact: "environment" } }, // Forces back camera
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
        `${API_ENDPOINT}/api/appointment/${apptId}/scan`
      );

      if (response.status === 200) {
        console.log("Appointment scan updated successfully:", response.data);
        setAppointmentData([response.data.appointment]);

        // Check if the appointment is completely scanned
        // if (response.data.appointment.scanned) {
        //   setError("Appointment already scanned completely");
        // }

        // ** Refresh the page after 5 seconds **
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (err) {
      setError("Failed to update scan. Try scanning again.");
      console.error("Error updating scan:", err.response?.data || err.message);
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
