// ---- react ----
import { useState } from "react";
import PropTypes from "prop-types"; // ---- props-validation

// ---- component ----
import { ADMIN_ACTIVITY_LIST_TABLE_HEADERS } from "@/components/header/table-headers"; // ---- table headers
import OrderSummaryPagination from "../admin-order-summary-pagination"; // ---- pagination
import EditActivityModal from "@/components/modal/edit-activity-modal"; // ---- modal
import ActivityListModal from "@/components/modal/activity-list-modal"; // ---- modal
import DeleteActivityModal from "@/components/modal/delete-activity"; // ---- modal
import SearchBar from "@/components/search/search-bar"; // ---- search bar

// ---- library ----
import { Plus } from "lucide-react"; // ---- icons
import { useDebounce } from "react-use"; // ---- npm install react-use. this is a hook that helps us to debounce the search input.

export default function ActivityListTable({ data }) {
  // ---- modal state check if its open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- state for handling the search input data (search engine)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // ---- state for pagination (pagination)
  const [currentPage, setCurrentPage] = useState(1);

  // ---- state for store the selected activity (edit)
  const [selectedActivity, setSelectedActivity] = useState(null);

  // ---- state for selected id and username (delete)
  const [selectedActivitiyId, setSelectedActivityId] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState(null);

  // ---- useDebounce hook helps us to prevent making too many requests to the api (search engine)
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // ---- filter activities based on search term
  const filteredData = data.filter(
    (activity) =>
      activity.activity_name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      activity.description
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
  );

  // ---- show 10 items per page (pagination)
  const itemsPerPage = 10;

  // ---- calculate total page (pagination)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // ---- get the current items for the page (pagination)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ---- function to handle delete modal
  const handleDeleteModal = (id, name) => {
    setSelectedActivityId(id);
    setSelectedActivityName(name);
    setIsDeleteModalOpen(true);
  };

  // ---- function to handle edit modal
  const handleEditModal = (id) => {
    const selectedItem = currentItems.find((item) => item.activity_id === id);
    setSelectedActivity(selectedItem);
    setIsEditModalOpen(true);
  };

  return (
    <>
      {/* create activity modal */}
      {isModalOpen && (
        <ActivityListModal open={isModalOpen} setOpen={setIsModalOpen} />
      )}

      {/* edit activity modal */}
      {isEditModalOpen && (
        <EditActivityModal
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          selectedActivity={selectedActivity}
        />
      )}

      {/* delete activity modal */}
      {isDeleteModalOpen && (
        <DeleteActivityModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          selectedActivitiyId={selectedActivitiyId}
          selectedActivityName={selectedActivityName}
        />
      )}

      <div className="table_section mt-5 font-inter w-full  ">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200">
                <div className="py-5 px-4 flex justify-between items-center">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <div>
                    <button
                      title="Add Activity"
                      className="cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="th-user-table">
                      <tr>
                        {ADMIN_ACTIVITY_LIST_TABLE_HEADERS.map(
                          (headers, index) => (
                            <th key={index} className="px-6 py-3">
                              {headers}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-[#F3F4F6]" : ""}
                        >
                          <td className="td-admin-table ">{index + 1}</td>

                          <td className="td-admin-table capitalize">
                            {item.activity_name}
                          </td>
                          <td className=" max-w-[320px] break-words whitespace-normal px-5 py-4 text-left text-xs font-medium text-[#333333]">
                            {item.description}
                          </td>

                          <td className="td-user-table flex gap-x-5    ">
                            <button
                              onClick={() =>
                                handleDeleteModal(
                                  item.activity_id,
                                  item.activity_name
                                )
                              }
                              className="text-red-600 cursor-pointer outline-none"
                            >
                              Delete
                            </button>

                            <button
                              onClick={() => handleEditModal(item.activity_id)}
                              className="text-green-600 cursor-pointer outline-none"
                            >
                              Edit
                            </button>
                          </td>
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

                {/* No data message BELOW pagination */}
                {currentItems.length === 0 && (
                  <p className="text-gray-500 font-medium ml-5 py-5">
                    No activity list available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// props-validation
ActivityListTable.propTypes = {
  data: PropTypes.array,
};
