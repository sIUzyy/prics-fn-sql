import { useRef, useState, useEffect } from "react"; // react

import { useTrackingNo } from "../../context/TrackingNoContextProvider"; // trackingNo-context

import scan_logo from "../../assets/scan_items_image.svg"; // images

import { Button } from "../ui/button"; // shadcn ui button

import axios from "axios"; // axios

import { BrowserMultiFormatReader } from "@zxing/browser"; // ZXing barcode scanner

import LoadingSpinner from "../loading/loading-spinner"; // component

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function ScanItems() {
  // context to stored the scanned items data
  const { setTrackingNoData, setTrackingError, setTrackingLoading } =
    useTrackingNo();

  // state for loading
  const [isLoading, setIsLoading] = useState(false);

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
            getShipmentByTrackingNo(scannedCode);

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

  // function to fetch the shipment data
  const getShipmentByTrackingNo = async (tracking_no) => {
    setTrackingLoading(true);

    // check if tracking number is empty
    if (!tracking_no) {
      setError("No tracking number found. Please try again later.");
      setTrackingLoading(false);
      return;
    }

    // request to backend to fetch the data
    try {
      // send the scanned barcode to the backend to fetch the shipment data
      const response = await axios.get(
        `${API_ENDPOINT}/api/shipment/pre-delivery/${tracking_no}/driver`
      );

      console.log(response.data.shipment);

      // check if response contains shipment data
      if (response.data?.shipment) {
        setTrackingNoData(response.data.shipment);
      } else {
        setTrackingError("No data found for this tracking number.");
      }
    } catch (err) {
      setError("Invalid barcode detected. Please scan a barcode again.");
      console.error("Data fetch error:", err.response?.data || err.message);
    } finally {
      setTrackingLoading(false);
    }
  };

  // reset data when component unmounts (menu changes)
  useEffect(() => {
    return () => {
      setTrackingNoData([]);
      setTrackingError("");
      setTrackingLoading(false);
    };
  }, [setTrackingNoData, setTrackingError, setTrackingLoading]);

  return (
    <div className="border-1 py-5 px-4 shadow-sm rounded-md lg:w-1/2 lg:max-h-fit xl:w-1/3">
      <div className="flex justify-between">
        <div className="heading_section">
          <h1 className="font-inter font-bold text-2xl tracking-widest">
            Scan Items
          </h1>
          <p className="text-sm">Scan QR or Barcode</p>
        </div>

        <div className="image_section">
          <img src={scan_logo} alt="scan-items-image" />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-base">Position the code within the scanner frame</p>

        {/* video preview for barcode scanning */}
        {isLoading && (
          <video
            ref={videoRef}
            className="w-full my-3 rounded-lg"
            autoPlay
            playsInline
          />
        )}

        {/* scan a barcode button */}
        <Button
          onClick={startScanner}
          disabled={isLoading}
          className={
            isLoading
              ? "w-full mt-3 py-6 bg-black rounded-md cursor-not-allowed opacity-70 "
              : "w-full mt-3 py-6 bg-black rounded-md cursor-pointer"
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-x-2">
              <span>Scanning</span>
              <LoadingSpinner />
            </div>
          ) : (
            "Scan a Barcode"
          )}
        </Button>

        {error && (
          <p className="text-red-500 text-sm font-bold mt-5 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
