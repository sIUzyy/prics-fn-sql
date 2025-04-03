// ---- react ----
import { useState } from "react";
import PropTypes from "prop-types"; // ---- props-validation

// ---- headlessui ----
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// ---- components ----
import LoadingSpinner from "../loading/loading-spinner";

// ---- library ----
import { User } from "lucide-react"; // ---- icons
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function UserListModal({ open, setOpen }) {
  // ---- state for creating a user
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [role, setRole] = useState("guard");

  // ---- loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ---- function to create a user
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check all if empty
    if (!name && !username && !password) {
      setNameError("Name field cannot be empty");
      setUsernameError("Username field cannot be empty");
      setPasswordError("Password field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check name field if empty
    if (!name) {
      setNameError("Name field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check username field if empty
    if (!username) {
      setUsernameError("Username field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check password field if empty
    if (!password) {
      setPasswordError("Password field cannot be empty");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name,
        username,
        password,
        role,
      };

      const response = await axios.post(
        `${API_ENDPOINT}/api/user/signup`,
        userData
      );

      if (response.status === 201) {
        toast.success("Successfully created an account for the guard role!", {
          style: {
            backgroundColor: "#28a745",
            color: "#fff",
          },
        });

        setName("");
        setUsername("");
        setPassword("");
        setOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to create guard account:", error);

      toast.error("Failed to create an account. Please try again later.", {
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
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white   px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <DialogTitle
                as="h1"
                className="font-inter flex items-center gap-x-2 font-medium text-base tracking-widest"
              >
                <User size={20} /> Create an Account
              </DialogTitle>
              <div className="forms mt-5">
                <div className="flex-1">
                  <label className="text-sm font-inter text-[#979090]">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                        ${
                          nameError
                            ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                            : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                        }`}
                  />
                  {nameError && (
                    <p className="my-1 text-red-500 text-sm">{nameError}</p>
                  )}
                </div>

                <div className="flex-1 my-5">
                  <label className="text-sm font-inter text-[#979090]">
                    Username <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError("");
                    }}
                    className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                        ${
                          usernameError
                            ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                            : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                        }`}
                  />
                  {usernameError && (
                    <p className="my-1 text-red-500 text-sm">{usernameError}</p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="text-sm font-inter text-[#979090]">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                        ${
                          passwordError
                            ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                            : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                        }`}
                  />
                  {passwordError && (
                    <p className="my-1 text-red-500 text-sm">{passwordError}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleRegister}
                className={
                  isLoading
                    ? "inline-flex w-full justify-center rounded-md bg-green-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs opacity-50 cursor-progress sm:ml-3 sm:w-auto"
                    : "inline-flex w-full justify-center rounded-md bg-green-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs hover:opacity-80 cursor-pointer sm:ml-3 sm:w-auto"
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    Registering <LoadingSpinner />
                  </div>
                ) : (
                  "Register"
                )}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-10 py-2 text-sm font-medium text-gray-900 ring-1 shadow-xs ring-gray-300 cursor-pointer  ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

// prop-validation
UserListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
