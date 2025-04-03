// ---- react ----
import React, { useState, useMemo } from "react"; // react
import PropTypes from "prop-types"; // prop validation

// ---- library ----
import { Link } from "react-router"; // react-router-dom
import { useDebounce } from "react-use"; // npm install react-use. this is a hook that helps us to debounce the search input.
import { PDFDownloadLink } from "@react-pdf/renderer"; // react-pdf
import dayjs from "dayjs"; // dayjs

// ---- utils ----
import { DELIVERY_STATUS_COLOR } from "../../utils/Color"; // color
import { generateBarcode } from "@/utils/generateBarcode";

// ---- component ----
import SearchBar from "../search/search-bar"; // search bar
import DeleteModal from "../modal/delete-modal"; // modal when deleting a tracking no
import DateRangePicker from "./date-range-picker-filter"; // date range
import Dropdown from "../dropdown/admin-dashboard-dropdown"; // dropdown to show the download all reports
import OrderSummaryPagination from "./admin-order-summary-pagination"; // pagination
import { ADMIN_DASHBOARD_TABLE_HEADERS } from "../header/table-headers"; // headers
import EPODReportByTrackingNo from "@/report/e-pod-report-by-tracking-no"; // this will generate a template report

// memoize
const MemoizedDeleteModal = React.memo(DeleteModal);
const MemoizedSearchBar = React.memo(SearchBar);
const MemoizedDropdown = React.memo(Dropdown);
const MemoizedDateRangePicker = React.memo(DateRangePicker);

// ---- icons ----
import { ArrowDownToLine, FileChartColumnIncreasing } from "lucide-react";

// CHILD OF ADMIN-DASHBOARD-PAGE AND THE DATA IS FROM WMS WHILE PRE-DELIVERY-DATA IS FROM E-POD
export default function AdminSummaryTable({ data, preDeliveryData, products }) {
  const [startDate, setStartDate] = useState(null); // state for date range filtering (date-range)
  const [endDate, setEndDate] = useState(null); // state for date range filtering (date-range)
  const [isModalOpen, setIsModalOpen] = useState(false); // state for the delete modal
  const [selectedTrackingNo, setSelectedTrackingNo] = useState(null); // state to track the selected tracking no (modal purpose)
  const [searchTerm, setSearchTerm] = useState(""); // state for handling the search input data (search engine)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // debounce the search input (search engine)
  const [currentPage, setCurrentPage] = useState(1); // state for pagination (pagination)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]); // useDebounce hook helps us to prevent making too many requests to the api (search engine)

  // function to filter data based on date range, search term, and sort by shipped date
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const shippedDate = dayjs(item.shipped_date);
        if (startDate && shippedDate.isBefore(dayjs(startDate))) return false;
        if (endDate) {
          const endOfDay = dayjs(endDate).endOf("day");
          if (shippedDate.isAfter(endOfDay)) return false;
        }

        const preDeliveryItem = preDeliveryData.find(
          (pre) => pre.pre_delivery_tracking_no === item.tracking_no
        );

        if (debouncedSearchTerm) {
          const searchLower = debouncedSearchTerm
            .toLowerCase()
            .replace(/\s+/g, "");

          const matchesItem = Object.values(item).some((value) => {
            if (typeof value === "string") {
              return value
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(searchLower);
            }
            if (typeof value === "number") {
              return value.toString().includes(debouncedSearchTerm);
            }
            return false;
          });

          const matchesPreDelivery = preDeliveryItem
            ? Object.values(preDeliveryItem).some((value) => {
                if (typeof value === "string") {
                  return value
                    .toLowerCase()
                    .replace(/\s+/g, "")
                    .includes(searchLower);
                }
                return false;
              })
            : false;

          return matchesItem || matchesPreDelivery;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by createdAt in descending order (latest created first)
        return dayjs(b.createdAt).isBefore(dayjs(a.createdAt)) ? -1 : 1;
      });
  }, [data, preDeliveryData, debouncedSearchTerm, startDate, endDate]);

  const itemsPerPage = 10; // show 10 items per page (pagination)

  // Calculate total pages within useMemo to optimize re-rendering
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData]);

  // Memoize paginatedData to optimize re-rendering
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // track the selected tracking no. also open the modal
  // const handleDeleteButton = (trackingNo) => {
  //   setSelectedTrackingNo(trackingNo); // store the tracking number
  //   setIsModalOpen(true); // open the modal
  // };

  // change the bg color depends on the status
  const getStatusClass = (status) => {
    return status === "In Transit"
      ? `${DELIVERY_STATUS_COLOR.transit} text-white px-5 py-1 rounded-full capitalize`
      : status === "In Receiving"
      ? `${DELIVERY_STATUS_COLOR.receiving} text-white px-5 py-1 rounded-full capitalize`
      : status === "Delivered"
      ? `${DELIVERY_STATUS_COLOR.delivered} text-white px-5 py-1 rounded-full capitalize`
      : "bg-gray-400 text-white px-5 py-1 rounded-full capitalize";
  };

  return (
    <>
      {/* delete modal */}
      {isModalOpen && (
        <MemoizedDeleteModal
          selectedTrackingNo={selectedTrackingNo}
          open={isModalOpen}
          setOpen={setIsModalOpen}
        />
      )}

      <div className="table_section mt-5 font-inter w-full  ">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-5 px-4 flex justify-between items-center">
                  <div className="flex items-center justify-center gap-x-2">
                    {/* search bar */}
                    <MemoizedSearchBar
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />

                    {/*filter */}
                    <MemoizedDropdown
                      data={data}
                      preDeliveryData={preDeliveryData}
                      products={products}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </div>

                  <div>
                    {/* date-range filter*/}
                    <MemoizedDateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                    />
                  </div>
                </div>

                <div className="overflow-hidden ">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="th-user-table">
                      <tr>
                        {ADMIN_DASHBOARD_TABLE_HEADERS.map((header, index) => (
                          <th key={index} className="px-5 py-2 tracking-wide">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 ">
                      {paginatedData.map((item, index) => {
                        // find matching pre-delivery-tracking no === shipment data tracking no
                        const preDeliveryItem = preDeliveryData.find(
                          (pre) =>
                            pre.pre_delivery_tracking_no === item.tracking_no
                        );

                        return (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                          >
                            <td className="td-admin-table">
                              <Link
                                to={`/admin/ordersummary/${item.tracking_no}`}
                              >
                                <div className="bg-[#343A40] px-4 text-white py-1 rounded-full flex items-center">
                                  <span>{item.tracking_no}</span>
                                  <span className="ml-2 text-[#FFD166]">
                                    [
                                    {item.product_count
                                      ? item.product_count
                                      : 0}
                                    ]
                                  </span>
                                </div>
                              </Link>
                            </td>

                            <td className="td-admin-table">
                              {new Date(item.shipped_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </td>

                            {/*display the pre-delivery data */}
                            <td className="td-admin-table">
                              {preDeliveryItem
                                ? new Date(
                                    preDeliveryItem.pre_delivery_received_date
                                  ).toLocaleString("en-US", {
                                    timeZone: "Asia/Manila", // Ensures the correct PH time
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true, // 24-hour format (use `true` for AM/PM)
                                  })
                                : "-"}
                            </td>
                            <td className="td-admin-table">
                              {item.waybill_no}
                            </td>
                            <td className="td-admin-table">{item.cv_no}</td>
                            <td className="td-admin-table">{item.plate_no}</td>
                            <td className="td-admin-table">
                              {item.driver_name}
                            </td>

                            {/*display the pre-delivery data */}
                            <td className="td-admin-table">
                              {preDeliveryItem
                                ? preDeliveryItem.pre_delivery_received_by
                                : "-"}
                            </td>
                            <td className="td-admin-table">
                              {item.customer_name}
                            </td>
                            <td className="td-admin-table">
                              {item.total_cbm} kg
                            </td>

                            <td className="td-admin-table capitalize">
                              <span
                                className={getStatusClass(item.epod_status)}
                              >
                                {item.epod_status}
                              </span>
                            </td>

                            <td className="td-admin-table w-full  flex justify-center  ">
                              <button
                                onClick={() =>
                                  generateBarcode(item.tracking_no)
                                }
                                className="cursor-pointer outline-none "
                                title={`Download tracking no. ${item.tracking_no}`}
                              >
                                <ArrowDownToLine
                                  size={20}
                                  className="mx-auto text-indigo-500"
                                />
                              </button>
                            </td>
                            <td
                              className="td-admin-table"
                              title={`Download report for ${item.tracking_no}`}
                            >
                              <PDFDownloadLink
                                document={
                                  <EPODReportByTrackingNo
                                    data={data.filter(
                                      (d) => d.tracking_no === item.tracking_no
                                    )}
                                    preDeliveryData={preDeliveryData.filter(
                                      (pre) =>
                                        pre.pre_delivery_tracking_no ===
                                        item.tracking_no
                                    )}
                                    products={products.filter(
                                      (p) => p.tracking_no === item.tracking_no
                                    )}
                                  />
                                }
                                fileName={`TRACKING_NO:${item.tracking_no}_EPOD_REPORT.pdf`}
                              >
                                <FileChartColumnIncreasing
                                  size={20}
                                  className="mx-auto text-indigo-500 outline-none"
                                />
                              </PDFDownloadLink>
                            </td>

                            {/* <td className="td-admin-table">
                              <button
                                onClick={() =>
                                  handleDeleteButton(item.tracking_no)
                                }
                                className="text-[#EB191D] cursor-pointer outline-none "
                                title={`Delete ${item.tracking_no}`}
                              >
                                Delete
                              </button>
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Component */}
                <OrderSummaryPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            </div>
            {paginatedData && paginatedData.length === 0 && (
              <p className="ml-2 mt-2 text-gray-500  font-medium">
                No records found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// props validation
AdminSummaryTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trackingNo: PropTypes.string.isRequired,
      productCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
      shippedDate: PropTypes.string.isRequired,
      waybillNo: PropTypes.string.isRequired,
      cvNo: PropTypes.string.isRequired,
      plateNo: PropTypes.string.isRequired,
      driverName: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      totalCbm: PropTypes.number.isRequired,
      delivery_status: PropTypes.string,
    })
  ).isRequired,
  preDeliveryData: PropTypes.arrayOf(
    PropTypes.shape({
      pre_delivery_trackingNo: PropTypes.string.isRequired,
      pre_delivery_receivedDate: PropTypes.string.isRequired,
      pre_delivery_receivedBy: PropTypes.string.isRequired,
    })
  ).isRequired,

  products: PropTypes.arrayOf(
    PropTypes.shape({
      product_code: PropTypes.string.isRequired,
      tracking_no: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      shipped_qty: PropTypes.number.isRequired,
      total_cbm_per_item: PropTypes.number.isRequired,
    })
  ).isRequired,
};
