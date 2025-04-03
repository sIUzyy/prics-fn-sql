// headlessui
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// icon
import { TriangleAlert } from "lucide-react";

// props validation
import PropTypes from "prop-types";

// react
import { useState } from "react";

// axios
import axios from "axios";

// toast
import { toast } from "sonner";

// component
import LoadingSpinner from "../loading/loading-spinner";

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

export default function DeleteModal({ open, setOpen, selectedTrackingNo }) {
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // function to delete the tracking no
  const handleDelete = async () => {
    setIsLoading(true);

    if (!selectedTrackingNo) return;

    try {
      const response = await axios.delete(
        `${API_ENDPOINT}/api/shipment/${selectedTrackingNo}/delete-shipment`
      );

      if (response.status === 200) {
        toast.success(
          `Successfully deleted the tracking no. ${selectedTrackingNo}`,
          {
            style: {
              backgroundColor: "#28a745",
              color: "#fff",
            },
          }
        );

        setOpen(false); // close modal
      }
    } catch (error) {
      console.error("Failed to delete tracking no.:", error);
      toast.error(
        `Failed to delete tracking no ${selectedTrackingNo}. Please try again later.`,
        {
          style: {
            backgroundColor: "#ff4d4d",
            color: "#fff",
          },
        }
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        window.location.reload();
      }, 1000);
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
                className="font-inter flex items-center gap-x-2 font-medium text-base tracking-wider"
              >
                <TriangleAlert size={25} className="text-red-500" /> Confirm
                deletion of Tracking No. {selectedTrackingNo}?
              </DialogTitle>

              <div className="mt-5 ">
                <p>
                  This action cannot be undone. Once deleted, you will not be
                  able to recover it.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleDelete}
                className={
                  isLoading
                    ? "inline-flex min-w-[120px] justify-center rounded-sm bg-red-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs  sm:ml-3 sm:w-auto cursor-progress opacity-50  "
                    : "inline-flex w-full justify-center rounded-sm bg-red-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs hover:opacity-80 sm:ml-3 sm:w-auto cursor-pointer  "
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-x-2">
                    Deleting
                    <LoadingSpinner />
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className={
                  isLoading
                    ? "mt-3 inline-flex w-full justify-center rounded-sm bg-white px-10 py-2 text-sm font-medium text-gray-900   cursor-not-allowed   hover:bg-gray-50 sm:mt-0 sm:w-auto border-1"
                    : "mt-3 inline-flex w-full justify-center rounded-sm bg-white px-10 py-2 text-sm font-medium text-gray-900   cursor-pointer   hover:bg-gray-50 sm:mt-0 sm:w-auto border-1"
                }
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
DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedTrackingNo: PropTypes.string.isRequired,
};
