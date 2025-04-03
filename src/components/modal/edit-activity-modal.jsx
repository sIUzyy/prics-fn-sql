// ---- headlessui ----
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// ---- icon ----
import { Pencil } from "lucide-react";

// ---- props validation ----
import PropTypes from "prop-types";

// ---- react ----
import { useState } from "react";

// ---- axios ----
import axios from "axios";

// ---- toast ----
import { toast } from "sonner";

// ---- component ----
import LoadingSpinner from "../loading/loading-spinner";

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function EditActivityModal({ open, setOpen, selectedActivity }) {
  const { activity_id, activity_name, description } = selectedActivity || {};

  console.log(selectedActivity);

  // state for fields
  const [editActivityName, setEditActivityName] = useState(activity_name);
  const [editDescription, setEditDescription] = useState(description);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // error state
  const [nameError, setNameError] = useState("");

  // function to handle update appointment
  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check if name is empty
    if (!editActivityName) {
      setNameError("Activity name field cannot be empty");
      setIsLoading(false);
      return;
    }

    try {
      const updatedActivityData = {
        activity_name: editActivityName,
        description: editDescription,
      };

      const response = await axios.patch(
        `${API_ENDPOINT}/api/activity/${activity_id}/update-activity`,
        updatedActivityData
      );

      if (response.status === 200) {
        toast.success("Successfully update the activity", {
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
      toast.error("Failed to update the activity. Please try again later.", {
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
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white   px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <DialogTitle
                as="h1"
                className="font-inter flex items-center gap-x-2 font-medium text-base tracking-wider"
              >
                <Pencil size={20} /> Edit Activity {editActivityName}
              </DialogTitle>

              <div className="mt-5 flex gap-x-5">
                <div className="forms w-full">
                  <div className="flex-1  ">
                    <label className="text-sm font-inter text-[#979090]">
                      Activity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={
                        nameError ? nameError : "Enter activity name"
                      }
                      value={editActivityName}
                      onChange={(e) => {
                        setEditActivityName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 
                          ${
                            nameError
                              ? "border-red-500 focus:ring-red-500 placeholder-red-500"
                              : "border-gray-300 focus:ring-blue-500 placeholder-gray-400"
                          }`}
                    />
                  </div>

                  <div className="flex-1 mt-5">
                    <label className="text-sm font-inter text-[#979090]">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder={"Enter Helper Name"}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={`border p-4 w-full mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                           `}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleUpdateActivity}
                className={
                  isLoading
                    ? "inline-flex w-full justify-center rounded-sm px-10 py-2 text-center text-sm font-medium text-white shadow-xs sm:ml-3 sm:w-auto bg-green-600 cursor-progress opacity-50"
                    : "inline-flex w-full justify-center rounded-sm px-10 py-2 text-center text-sm font-medium text-white shadow-xs sm:ml-3 sm:w-auto bg-green-600 cursor-pointer"
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    Editing an activity <LoadingSpinner />
                  </div>
                ) : (
                  "Edit an activity"
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
EditActivityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedActivity: PropTypes.object,
};
