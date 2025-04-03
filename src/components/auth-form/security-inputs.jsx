// ---- react ----
import { useState } from "react";

// ---- context ----
import { useAuth } from "@/context/AuthContextProvider";

// ---- library ----
import { useNavigate } from "react-router";
import axios from "axios";

// ---- component ----
import ErrorMessage from "../error/ErrorMessage";
import LoadingSpinner from "../loading/loading-spinner";

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function SecurityInputsForm() {
  // auth context
  const { signIn } = useAuth();

  // react router
  const navigate = useNavigate();

  // state for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // error state
  const [usernameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  // function to login
  const handleSecurityLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check if both fields are empty
    if (!username && !password) {
      setUserNameError("Username field cannot be empty");
      setPasswordError("Password field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check if empty
    if (!username) {
      setUserNameError("Username field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check if empty
    if (!password) {
      setPasswordError("Password field cannot be empty");
      setIsLoading(false);
      return;
    }

    try {
      // request to backend
      const response = await axios.post(
        `${API_ENDPOINT}/api/user/signin`,
        { username, password } // send these data to backend
      );

      if (response.status === 200) {
        // get whole data from backend response
        const userData = response.data.user;

        if (userData.role == "guard") {
          signIn(userData);
          navigate("/access-pass");
        } else {
          setError("Access denied! You do not have the necessary permissions.");
        }
      }
    } catch (error) {
      // console.log(error);
      setError(
        error.response?.data?.message || "Login failed. Please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full my-5">
      <input
        type="email"
        placeholder={usernameError ? usernameError : "Username"}
        className={`border-1 p-3 w-full rounded-lg border-[#979090]  focus:outline-none focus:ring-2 focus:ring-blue-500 2xl:p-4 ${
          usernameError ? "placeholder-red-500 border-red-500" : ""
        }`}
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (usernameError) setUserNameError("");
        }}
      />

      <input
        type="password"
        placeholder={passwordError ? passwordError : "Password"}
        className={`border-1 p-3 w-full mt-4 rounded-lg border-[#979090]  focus:outline-none focus:ring-2 focus:ring-blue-500 2xl:p-4 ${
          passwordError ? "placeholder-red-500 border-red-500" : ""
        } `}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError("");
        }}
      />

      <button
        onClick={handleSecurityLogin}
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
