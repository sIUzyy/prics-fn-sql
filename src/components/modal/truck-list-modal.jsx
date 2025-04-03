// headlessui
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// props validation
import PropTypes from "prop-types";

export default function TruckListModal({ open, setOpen }) {
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
                className="font-bebas tracking-widest text-2xl text-gray-900"
              >
                ADD TRUCK DETAILS
              </DialogTitle>
              <div className="mt-5 ">
                <div className="flex flex-col  ">
                  <label className="font-inter text-sm">Truck Model</label>
                  <input
                    type="text"
                    placeholder="Enter truck model"
                    className="border-1 outline-none p-3 rounded-lg mt-2 "
                  />
                </div>

                <div className="flex flex-col my-5  ">
                  <label className="font-inter text-sm">Weight Capacity</label>
                  <input
                    type="text"
                    placeholder="Enter weight capacity in kg"
                    className="border-1 outline-none p-3 rounded-lg mt-2 "
                  />
                </div>

                <div className="flex flex-col my-5  ">
                  <label className="font-inter text-sm">Plate Number</label>
                  <input
                    type="text"
                    placeholder="Enter plate number"
                    className="border-1 outline-none p-3 rounded-lg mt-2 "
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-10 py-2 text-center text-sm font-medium text-white shadow-xs hover:opacity-80 cursor-pointer sm:ml-3 sm:w-auto"
              >
                Create
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

// Prop Validation
TruckListModal.propTypes = {
  open: PropTypes.bool.isRequired, // Must be a boolean and required
  setOpen: PropTypes.func.isRequired, // Must be a function and required
};
