// date-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// props-validation
import PropTypes from "prop-types";

import { TimerReset } from "lucide-react";

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  // fn to reset the date
  const handleResetDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <div className="">
      <div className="flex gap-x-3 items-center">
        <h1 className="text-sm">Date range</h1>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="border rounded-sm py-2 text-xs max-w-[120px] text-center outline-0 ring-gray-300 cursor-pointer"
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="border rounded-sm py-2 text-xs max-w-[130px] text-center outline-0 ring-gray-300 cursor-pointer"
          placeholderText="End Date"
        />

        <button
          onClick={handleResetDateRange}
          title="reset date range"
          className="cursor-pointer"
        >
          <TimerReset size={18} className="text-indigo-500" />
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;

DateRangePicker.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
};
