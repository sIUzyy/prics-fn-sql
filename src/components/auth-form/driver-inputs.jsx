// react
import { useEffect, useState } from "react";

// context
import { useAuth } from "@/context/AuthContextProvider";
import { useWarehouse } from "@/context/WarehouseContextProvider";

// react router dom
import { useNavigate } from "react-router";

// react-icons
import { MdArrowDropDown } from "react-icons/md";

// axios
import axios from "axios";

// toast
import { toast } from "sonner";

// component
import ErrorMessage from "../error/ErrorMessage";
import LoadingSpinner from "../loading/loading-spinner";

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

// NOTE: THIS IS DRIVER FORM
export default function DriverInputsForm() {
  // auth context
  const { signIn } = useAuth();

  // warehouse context
  const { selectedWarehouse, setSelectedWarehouse } = useWarehouse();

  // react router
  const navigate = useNavigate();

  // state for name and plateNo of driver
  const [name, setName] = useState("");
  const [plateNo, setPlateNo] = useState("");

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [, setWarehouseLoading] = useState(false);

  // error state
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [plateNoError, setPlateNoError] = useState("");
  const [warehouseError, setWarehouseError] = useState("");

  // state for warehouse
  const [warehouseData, setWarehouseData] = useState([]);

  // function to login
  const handleDriverLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // check if both fields are empty
    if (!name && !plateNo && !selectedWarehouse) {
      setNameError("Name field cannot be empty");
      setPlateNoError("Plate Number field cannot be empty");
      setWarehouseError("Warehouse selection is required.");
      setIsLoading(false);
      return;
    }

    // check if empty
    if (!name) {
      setNameError("Name field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check if empty
    if (!plateNo) {
      setPlateNoError("Plate Number field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check if empty
    if (!selectedWarehouse) {
      setWarehouseError("Warehouse selection is required.");
      setIsLoading(false);
      return;
    }

    try {
      // request to backend
      const response = await axios.post(
        `${API_ENDPOINT}/api/user/signin-as-driver`,
        {
          // send these data to backend
          plate_no: plateNo,
        }
      );

      // if the login is success
      if (response.status === 200) {
        signIn({ name, plateNo, role: "driver" });
        // console.log("Driver login successfully...");
        navigate("/plate-no");
      }
    } catch (error) {
      // console.error("Login failed:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Login failed. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // fetch all warehouse data
  useEffect(() => {
    const fetchWarehouseData = async () => {
      setWarehouseLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/warehouse`);
        const data = response.data.warehouses;

        setWarehouseData(data);
      } catch (error) {
        console.error("Failed to fetch warehouse:", error);

        toast.error(
          "We could not load your warehouse list data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setWarehouseLoading(false);
      }
    };

    fetchWarehouseData();
  }, []);

  return (
    <div className="w-full my-5 text-[#979090]">
      <input
        type="text"
        placeholder={nameError ? nameError : "Name"}
        className={`border-1 p-3 w-full rounded-lg border-[#979090] focus:outline-none focus:ring-2 focus:ring-blue-500 2xl:p-4 
          ${nameError ? "placeholder-red-500 border-red-500" : ""}`}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(""); // remove error when typing
        }}
      />

      <input
        type="text"
        placeholder={plateNoError ? plateNoError : "Plate Number"}
        className={`border-1 p-3 w-full mt-4 rounded-lg border-[#979090] focus:outline-none focus:ring-2 focus:ring-blue-500 2xl:p-4 
          ${plateNoError ? "placeholder-red-500 border-red-500" : ""}`}
        value={plateNo}
        onChange={(e) => {
          setPlateNo(e.target.value);
          if (plateNoError) setPlateNoError("");
        }}
      />

      <div className="relative mt-4">
        <select
          className={`border-1 p-3 w-full rounded-lg 
            ${
              warehouseError
                ? "border-red-500 focus:ring-red-500"
                : "border-[#979090] focus:ring-blue-500"
            } 
            outline-0 appearance-none pr-10`}
          value={selectedWarehouse || ""}
          onChange={(e) => {
            setSelectedWarehouse(e.target.value);
            if (warehouseError) setWarehouseError("");
          }}
        >
          <option value="">
            {warehouseError ? warehouseError : "Select Warehouse"}
          </option>
          {warehouseData.map((warehouse, index) => (
            <option key={index} value={warehouse.address}>
              {warehouse.warehouse_name}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <MdArrowDropDown size={20} />
        </div>
      </div>

      <button
        onClick={handleDriverLogin}
        className={
          isLoading
            ? "w-full mt-10 p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 opacity-50 cursor-not-allowed"
            : "w-full mt-10 p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4  cursor-pointer"
        }
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Log In"}
      </button>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
