// ---- react ----
import { useState } from "react";
import PropTypes from "prop-types"; // prop validation

// ---- component ----
import { ADMIN_PRIORITY_PER_PLATE_NO_TABLE_HEADERS } from "../header/table-headers";
import EditPriorityModal from "../modal/edit-priority-modal";

// ---- utils ----
import { DELIVERY_STATUS_COLOR } from "@/utils/Color";

// ---- library ----
import { Pencil } from "lucide-react";

export default function AdminPriorityPerPlateNoTable({ data }) {
  // ---- modal state check if its open
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- state for store the selected tracking no (edit)
  const [selectedTrackingNo, setSelectedTrackingNo] = useState(null);

  // ---- function to handle edit modal
  const handleEditModal = (trackingNo) => {
    const selectedTrackingNumber = data.find(
      (item) => item.tracking_no === trackingNo
    );
    setSelectedTrackingNo(selectedTrackingNumber);
    setIsEditModalOpen(true);
  };

  // ---- change the bg color depends on the status
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
      {/* edit activity modal */}
      {isEditModalOpen && (
        <EditPriorityModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          selectedTrackingNo={selectedTrackingNo}
        />
      )}

      <div className="table_section font-inter w-full mt-5  ">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-5 px-4"></div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="th-user-table">
                      <tr>
                        {ADMIN_PRIORITY_PER_PLATE_NO_TABLE_HEADERS.map(
                          (header, index) => (
                            <th key={index} className="px-6 py-3">
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.map((shipment, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                        >
                          <td className="td-admin-table  ">{index + 1} </td>

                          <td className="td-admin-table ">
                            {shipment.tracking_no}
                          </td>
                          <td className="td-admin-table capitalize ">
                            {shipment.customer_name}
                          </td>
                          <td className="td-admin-table  capitalize">
                            {shipment.address}
                          </td>

                          <td className="td-admin-table capitalize">
                            <span
                              className={getStatusClass(shipment.epod_status)}
                            >
                              {shipment.epod_status}
                            </span>
                          </td>

                          <td className="td-admin-table ">
                            {shipment.priority || " - "}
                          </td>

                          <td className="td-admin-table ">
                            <button
                              title={`Edit priority order for ${shipment.tracking_no}`}
                              onClick={() =>
                                handleEditModal(shipment.tracking_no)
                              }
                              className="text-green-600 cursor-pointer outline-none"
                            >
                              <Pencil size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.length === 0 && (
                    <p className="text-gray-500 font-medium ml-5 py-5">
                      No deliveries found for the selected plate number.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AdminPriorityPerPlateNoTable.propTypes = {
  data: PropTypes.array.isRequired, // Ensures `data` is required
};
