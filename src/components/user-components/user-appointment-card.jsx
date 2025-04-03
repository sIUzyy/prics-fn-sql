// ---- react ----
import { useRef, useEffect } from "react";

// ---- generate barcode ----
import JsBarcode from "jsbarcode";

// ---- props validation ----
import PropTypes from "prop-types";

// ---- generate gate pass (download) ----
import { generateGatePass } from "@/utils/generateGatePass";

// ---- day js
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
const PH_TZ = "Asia/Manila";

export default function AppointmentCard({ appt }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, appt.appointment_id, {
        format: "CODE128",
        displayValue: true,
      });
    }
  }, [appt.appointment_id]);

  return (
    <div className="my-5 ">
      <canvas ref={barcodeRef} className="w-full "></canvas>

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
        <label className="text-sm font-inter text-[#979090] ">
          Appointment Date
        </label>
        <input
          type="text"
          value={dayjs(appt.appointment_date).tz(PH_TZ).format("MMMM DD, YYYY")}
          readOnly
          className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
        />
      </div>

      <div className="my-5">
        <label className="text-sm font-inter text-[#979090] ">
          Appointment Time
        </label>
        <input
          type="text"
          value={dayjs(appt.appointment_time).tz(PH_TZ).format("hh:mm A")}
          readOnly
          className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
        />
      </div>

      <div className="my-5">
        <label className="text-sm font-inter text-[#979090] ">
          Warehouse Name
        </label>
        <input
          type="text"
          value={appt.warehouse_name}
          readOnly
          className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
        />
      </div>

      <div className="my-5">
        <label className="text-sm font-inter text-[#979090] ">
          Warehouse Name
        </label>
        <input
          type="text"
          value={appt.warehouse_address}
          readOnly
          className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
        />
      </div>

      <div className="my-5">
        <label className="text-sm font-inter text-[#979090] ">Activity</label>
        <input
          type="text"
          value={appt.activity}
          readOnly
          className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
        />
      </div>

      <div className="my-5">
        <label className="text-sm font-inter text-[#979090] ">
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
        <label className="text-sm font-inter text-[#979090] ">Dock</label>
        <input
          type="text"
          value={appt.dock}
          readOnly
          className="p-4 w-full mt-2 rounded-md cursor-not-allowed bg-gray-100 outline-none"
        />
      </div>

      <button
        onClick={() => generateGatePass(appt.appointment_id)}
        className="w-full p-3 rounded-md bg-black text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-pointer"
      >
        Download Barcode
      </button>
    </div>
  );
}

AppointmentCard.propTypes = {
  appt: PropTypes.array,
};
