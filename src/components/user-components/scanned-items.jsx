// ---- react ----
import { useState, useEffect, useCallback } from "react";

// ---- useTrackingNo (hold the data of scanned barcode) ----
import { useTrackingNo } from "@/context/TrackingNoContextProvider";

// ---- components ----
import ScannedHeading from "./scanned-heading";
import ScannedForms from "./scanned-forms";

// ---- library ----
import { toast } from "sonner";
import axios from "axios";

// ---- utils ----
import { fetchTime } from "@/utils/getCurrentTime";

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function ScannedItems() {
  // ---- context to get the data from scan barcode (shipmentdata)
  const { trackingNoData } = useTrackingNo();

  // ---- desctructure the data from the context (trackingNoData)
  const { tracking_no, load_no, uom, product_count } = trackingNoData;

  // ---- product codes state (products table)
  const [productCodes, setProductCodes] = useState([]);

  // ---- preDeliveries state for (pre-deliveries table)
  const [preDeliveries, setPreDeliveries] = useState(null);

  // state to track the product code submitted
  const [submittedProductCodes, setSubmittedProductCodes] = useState([]);

  // ---- state for current date - received date (get the current date)
  const [currentDate, setCurrentDate] = useState("");

  // ---- state for required fields
  const [receivedBy, setReceivedBy] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [receivedQuantity, setReceivedQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  // ---- error state for certain fields
  const [receivedByError, setReceivedByError] = useState("");
  const [receivedQuantityError, setReceivedQuantityError] = useState("");
  const [selectedProductCodeError, setSelectedProductCodeError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  // ---- loading state and empty state for data fetched
  const [isLoading, setIsLoading] = useState(false);
  const [isScannedDataFieldEmpty, setIsScannedDataFieldEmpty] = useState("");

  // ---- fetch the product codes from (products table)
  useEffect(() => {
    const fetchProductCodes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_ENDPOINT}/api/product/${tracking_no}`
        );

        setProductCodes(response.data || []);
      } catch (err) {
        console.error("Error fetching product codes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // if tracking_no is not empty, fetch the product codes
    if (tracking_no) {
      fetchProductCodes();
    }
  }, [tracking_no]);

  // ---- fetch the pre-delivery from (pre-deliveries table)
  const getPreDeliveryByTrackingNo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_ENDPOINT}/api/pre-delivery/${tracking_no}`
      );

      // check if the response is an object and store it directly
      const preDeliveryData =
        response.data && typeof response.data === "object"
          ? response.data
          : null;

      setPreDeliveries(preDeliveryData);
    } catch (err) {
      console.error("Error fetching pre-deliveries:", err);
    } finally {
      setIsLoading(false);
    }
  }, [tracking_no]);

  // ---- function to update the epod_status
  const updateEPODStatus = useCallback(
    async (status) => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.patch(
          `${API_ENDPOINT}/api/shipment/${tracking_no}/update-epod-status`,
          { epod_status: status }
        );
      } catch (err) {
        console.error(`Failed to update EPOD status:`, err);
      }
    },
    [tracking_no]
  );

  // ---- selected product codes
  const availableProductCodes = productCodes.filter(
    (item) => !submittedProductCodes.includes(item.product_code)
  );

  // ---- check if the button should be disabled
  const isButtonDisabled = availableProductCodes.length === 0 || isLoading;

  // function to handle the pre-delivery data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check if fetched data is empty
    if (!tracking_no && !load_no && !selectedProductCode && !uom) {
      setIsScannedDataFieldEmpty("No data found. Scan barcode first.");
      setIsLoading(false);
      return;
    }

    // check if they select a product code
    if (!selectedProductCode) {
      setSelectedProductCodeError("Please select a product code.");
      setIsLoading(false);
      return;
    }

    // check if required fields are empty
    if (!receivedBy && !receivedQuantity) {
      setReceivedByError("Received by field cannot be empty.");
      setReceivedQuantityError("Received quantity field cannot be empty.");
      setIsLoading(false);
      return;
    }

    // check if received by field are empty
    if (!receivedBy) {
      setReceivedByError("Received by field cannot be empty.");
      setIsLoading(false);
      return;
    }

    // check if received qty field are empty
    if (!receivedQuantity) {
      setReceivedQuantityError("Received quantity field cannot be empty.");
      setIsLoading(false);
      return;
    }

    // find the selected product and get its shipped quantity
    const selectedProduct = productCodes.find(
      (item) => item.product_code === selectedProductCode
    );
    const shippedQty = selectedProduct ? selectedProduct.shipped_qty : 0;

    // check if received quantity is greater than shipped quantity
    if (parseInt(receivedQuantity) > parseInt(shippedQty)) {
      setReceivedQuantityError(
        `Received quantity cannot exceed shipped quantity ${shippedQty}.`
      );

      setIsLoading(false);
      return;
    }

    // check if received quantity is less than shipped quantity
    if (parseInt(receivedQuantity) < parseInt(shippedQty)) {
      // check the remarks if its valid reason
      if (
        !remarks.trim() ||
        remarks.toLowerCase() === "n/a" ||
        remarks.toLowerCase() === "na"
      ) {
        setRemarksError(
          "Please provide a valid reason in the remarks when the received quantity is less than the shipped quantity."
        );
        setIsLoading(false);
        return;
      }

      // show the confirmation message
      const confirmProceed = window.confirm(
        `Received quantity is less than the shipped quantity ${shippedQty}. Do you want to proceed?`
      );

      // if user cancel
      if (!confirmProceed) {
        setIsLoading(false);
        return;
      }
    }

    // request to backend
    try {
      // JSON cannot handle file uploads, so we must use FormData to send files. (built-in)
      const formData = new FormData();
      formData.append("tracking_no", tracking_no);
      formData.append("load_no", load_no);
      formData.append("received_date", currentDate);
      formData.append("received_by", receivedBy);
      formData.append("product_code", selectedProductCode);
      formData.append("received_qty", receivedQuantity);
      formData.append("uom", uom);
      formData.append("remarks", remarks);

      // Append images to formData
      uploadedImages.forEach((image) => {
        formData.append("image", image); // "image" should match backend field name
      });

      // send the data to the backend
      const response = await axios.post(
        `${API_ENDPOINT}/api/pre-delivery/create-pre-delivery`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // check if response is successful
      if (response.status === 201) {
        toast.success("Successfully processed!", {
          style: {
            backgroundColor: "#28a745",
            color: "#fff",
          },
        });

        // add submitted code to the state
        setSubmittedProductCodes((prev) => [...prev, selectedProductCode]);
        setReceivedQuantity("");
        setRemarks("");
        setRemarksError("");
        setIsLoading(false);
        setUploadedImages([]);

        await getPreDeliveryByTrackingNo();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.", {
        style: {
          backgroundColor: "#ff4d4d",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- useEfffect for getPreDeliveryByTrackingNo function
  useEffect(() => {
    getPreDeliveryByTrackingNo();
  }, [getPreDeliveryByTrackingNo]);

  // ---- update the EPOD status when preDeliveries is not empty
  useEffect(() => {
    const hasData =
      (Array.isArray(preDeliveries) && preDeliveries.length > 0) ||
      (preDeliveries &&
        typeof preDeliveries === "object" &&
        Object.keys(preDeliveries).length > 0);

    // update the EPOD status to "In Receiving" if preDeliveries is not empty
    if (hasData) {
      updateEPODStatus("In Receiving");
    }
  }, [preDeliveries, updateEPODStatus]);

  // ---- check if the product count (shipments) is equal to the products(pre-deliveries)
  useEffect(() => {
    if (preDeliveries && preDeliveries.products) {
      const receivedProductCount = preDeliveries.products.length;

      // check if the received product count is equal to the product count
      if (receivedProductCount === product_count) {
        updateEPODStatus("Delivered");
      }
    }
  }, [preDeliveries, product_count, updateEPODStatus]);

  // ---- useEffect for date/time
  useEffect(() => {
    const updateTime = async () => {
      const time = await fetchTime();
      if (time) setCurrentDate(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // ---- clear the error when valid data is detected
  useEffect(() => {
    if (tracking_no || load_no || selectedProductCode || uom) {
      setIsScannedDataFieldEmpty("");
    }
  }, [tracking_no, load_no, selectedProductCode, uom]);

  // ---- clear the field when component unmounts (menu changes)
  useEffect(() => {
    return () => {
      setReceivedBy("");
      setReceivedQuantity("");
      setRemarks("");
      setUploadedImages([]);

      setReceivedByError("");
      setReceivedQuantityError("");
      setRemarksError("");
    };
  }, [
    setReceivedBy,
    setReceivedQuantity,
    setRemarks,
    setUploadedImages,
    setReceivedByError,
    setReceivedQuantityError,
    setRemarksError,
  ]);

  // ---- reset these field when a new scan is detected
  useEffect(() => {
    setReceivedBy("");
    setReceivedBy("");
    setReceivedQuantity("");
    setRemarks("");
    setUploadedImages([]);

    setReceivedByError("");
    setReceivedQuantityError("");
    setRemarksError("");
  }, [
    setReceivedBy,
    setReceivedQuantity,
    setRemarks,
    setUploadedImages,
    trackingNoData,
    setReceivedByError,
    setReceivedQuantityError,
    setRemarksError,
  ]);

  return (
    <div className="mt-5 py-5 px-2 rounded-md lg:w-3/5 lg:py-0 xl:w-2/3 lg:mt-0 ">
      <ScannedHeading />

      <div className="data_section mt-5">
        <ScannedForms
          trackingNo={tracking_no}
          isScannedDataFieldEmpty={isScannedDataFieldEmpty}
          loadNo={load_no}
          currentDate={currentDate}
          receivedBy={receivedBy}
          setReceivedBy={setReceivedBy}
          receivedByError={receivedByError}
          setReceivedByError={setReceivedByError}
          selectedProductCode={selectedProductCode}
          setSelectedProductCode={setSelectedProductCode}
          selectedProductCodeError={selectedProductCodeError}
          setSelectedProductCodeError={setSelectedProductCodeError}
          availableProductCodes={availableProductCodes}
          receivedQuantity={receivedQuantity}
          setReceivedQuantity={setReceivedQuantity}
          receivedQuantityError={receivedQuantityError}
          setReceivedQuantityError={setReceivedQuantityError}
          uom={uom}
          remarks={remarks}
          setRemarks={setRemarks}
          remarksError={remarksError}
          setRemarksError={setRemarksError}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isButtonDisabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}
