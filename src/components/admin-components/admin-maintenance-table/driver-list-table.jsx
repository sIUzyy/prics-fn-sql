import { useState } from "react";

import PropTypes from "prop-types"; // prop validation

import OrderSummaryPagination from "../admin-order-summary-pagination"; // components
import { ADMIN_DRIVER_LIST_TABLE_HEADERS } from "@/components/header/table-headers"; // components - header

// display on AdminOrderSummary page
export default function DriverListTable({ data }) {
  // state for pagination (pagination)
  const [currentPage, setCurrentPage] = useState(1);

  // show 10 items per page (pagination)
  const itemsPerPage = 10;

  // calculate total page (pagination)
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // get the current items for the page (pagination)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="table_section mt-5 font-inter w-full  ">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="th-user-table">
                    <tr>
                      {ADMIN_DRIVER_LIST_TABLE_HEADERS.map((headers, index) => (
                        <th key={index} className="px-6 py-3">
                          {headers}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                      >
                        <td className="td-admin-table ">{index + 1}</td>

                        <td className="td-admin-table ">{item.driver_name}</td>
                        <td className="td-admin-table ">{item.address}</td>
                        <td className="td-admin-table ">{item.license_no}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <OrderSummaryPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// props validation
DriverListTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      driverName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      driverLicense: PropTypes.string.isRequired,
    })
  ).isRequired,
};
