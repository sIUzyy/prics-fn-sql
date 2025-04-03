// ---- prevent warning side of buffer is not defined caused by react-pdf
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

// ---- react
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// ---- headlessui - tailwind
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// ---- reports
import AppointmentGeneralToday from "@/report/appointment-general-today";
import AppointmentGeneralAll from "@/report/appointment-general-all";

// ---- library
import { pdf } from "@react-pdf/renderer"; // ---- generate pdf
import { Filter } from "lucide-react"; // ---- icon

export default function AppointmentDropdown({
  todayData,
  allData,
  startDate,
  endDate,
  type,
}) {
  // ---- state for today appointment report (today-appointment)
  const [todayReportUrl, setTodayReportUrl] = useState(null);

  // ---- state for all appointment report (all-appointment)
  const [allReportUrl, setAllReportUrl] = useState(null);

  // ---- state for all appointment report (all-appointment - date range)
  const [filteredReportUrl, setFilteredReportUrl] = useState(null);

  // ---- get today's date for filename (memoized)
  const todayDate = useMemo(() => {
    return new Date().toLocaleString("en-PH", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      timeZone: "Asia/Manila",
    });
  }, []);

  // ---- filter appointments by date range
  const filteredData = useMemo(() => {
    return allData?.filter((item) => {
      const appointmentDate = new Date(item.appointment_date);
      if (startDate && appointmentDate < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (appointmentDate > endOfDay) return false;
      }
      return true;
    });
  }, [allData, startDate, endDate]);

  // ---- generate PDFs
  useEffect(() => {
    const generatePdf = async () => {
      try {
        if (type === "today" && todayData?.length > 0) {
          const pdfBlob = await pdf(
            <AppointmentGeneralToday data={todayData} />
          ).toBlob();
          setTodayReportUrl(URL.createObjectURL(pdfBlob));
        }

        if (type === "all" && allData?.length > 0) {
          const pdfBlob = await pdf(
            <AppointmentGeneralAll data={allData} />
          ).toBlob();
          setAllReportUrl(URL.createObjectURL(pdfBlob));
        }

        if (type === "all" && filteredData?.length > 0) {
          const pdfBlob = await pdf(
            <AppointmentGeneralAll data={filteredData} />
          ).toBlob();
          setFilteredReportUrl(URL.createObjectURL(pdfBlob));
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    generatePdf();
  }, [todayData, allData, filteredData, type]);

  // Format date to "Month Day, Year" (e.g., "March 1, 2024")
  const formatDate = (date) => {
    return (
      date?.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) || ""
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          title="filter"
          aria-label="Open filter menu"
          className="outline-none cursor-pointer inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          <Filter size={18} />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 border-1">
        <div className="py-1 flex flex-col">
          {type === "all" ? (
            <>
              {/* Download All Report */}
              <MenuItem as="div">
                {allReportUrl ? (
                  <a
                    href={allReportUrl}
                    download="ALL_APPOINTMENT_REPORT.pdf"
                    className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    Download All Report
                  </a>
                ) : (
                  <span className="px-3 py-2 text-sm text-gray-500">
                    Generating PDF...
                  </span>
                )}
              </MenuItem>

              <MenuItem as="div">
                {filteredReportUrl ? (
                  <a
                    href={filteredReportUrl}
                    download={`${startDate ? formatDate(startDate) : "Start"}_${
                      endDate ? formatDate(endDate) : "End"
                    }_APPOINTMENT_REPORT.pdf`}
                    className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    Download Report (Date Range)
                  </a>
                ) : (
                  <span className="px-3 py-2 text-sm text-gray-500">
                    Generating PDF...
                  </span>
                )}
              </MenuItem>
            </>
          ) : (
            // Download Today's Report
            <MenuItem as="div">
              {todayReportUrl ? (
                <a
                  href={todayReportUrl}
                  download={`APPOINTMENT_REPORT_${todayDate.replace(
                    " ",
                    "_"
                  )}.pdf`}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                >
                  Download today’s report
                </a>
              ) : (
                <span className="px-3 py-2 text-sm text-gray-500">
                  {/*when loading show this... */}
                  Download today’s report
                </span>
              )}
            </MenuItem>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}

AppointmentDropdown.propTypes = {
  todayData: PropTypes.array.isRequired,
  allData: PropTypes.array.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  type: PropTypes.string.isRequired,
};
