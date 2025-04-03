// ---- react ----
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// ---- warehouse-context ----
import { useWarehouse } from "@/context/WarehouseContextProvider";

// ---- utils ----
import { fetchCoordinates } from "@/utils/fetchCoordinates"; // utils convert addresses to lat and long

// ---- library ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

const PH_TZ = "Asia/Manila";
export default function UserDeliveryCard({ data, preDeliveryData }) {
  const { selectedWarehouse } = useWarehouse(); // context to get the selectedWarehouse in driver-input form

  const [warehouseCoords, setWarehouseCoords] = useState(null); // state for selectedWarehouse coordinate

  const [addressCoords, setAddressCoords] = useState({}); // state for data addresses coordinate

  const [sortedData, setSortedData] = useState([]); // state for sorting the data in order based on distance

  // fetch warehouse coordinates
  useEffect(() => {
    if (selectedWarehouse) {
      fetchCoordinates(selectedWarehouse).then(setWarehouseCoords);
    }
  }, [selectedWarehouse]);

  // fetch data addresses coordinates
  useEffect(() => {
    const fetchAllAddresses = async () => {
      const coordsMap = {};
      for (const item of data) {
        if (!coordsMap[item.address]) {
          coordsMap[item.address] = await fetchCoordinates(item.address);
        }
      }
      setAddressCoords(coordsMap);
    };

    if (data.length > 0) {
      fetchAllAddresses();
    }
  }, [data]);

  // haversine formula to calculate distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // sort data based on distance, also just show the today's delivery
  useEffect(() => {
    if (!warehouseCoords || Object.keys(addressCoords).length === 0) return;

    // Get today's date in PH time
    const todayPH = dayjs().tz(PH_TZ).startOf("day");

    const filteredData = data.filter((item) => {
      if (!item.shipped_date) return false; // Ensure there's a deliveryDate
      const deliveryDatePH = dayjs(item.shipped_date).tz(PH_TZ).startOf("day");
      return deliveryDatePH.isSame(todayPH);
    });

    const sorted = filteredData.map((item) => {
      const dropOffCoords = addressCoords[item.address];

      if (!dropOffCoords) {
        return { ...item, distance: "Distance not available", rank: "N/A" };
      }

      const distance = haversineDistance(
        warehouseCoords.lat,
        warehouseCoords.lng,
        dropOffCoords.lat,
        dropOffCoords.lng
      );

      return {
        ...item,
        distance: isNaN(distance)
          ? "Distance not available"
          : distance.toFixed(2),
        rank: null,
      };
    });

    const rankedData = sorted
      .filter((item) => item.distance !== "Distance not available")
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    const finalData = [
      ...rankedData,
      ...sorted.filter((item) => item.distance === "Distance not available"),
    ];

    setSortedData(finalData);
  }, [warehouseCoords, addressCoords, data]);

  // if no delivery for today, show this.
  if (sortedData.length === 0) {
    return (
      <p className="text-gray-500 font-medium px-0 py-5">
        No delivery for today.
      </p>
    );
  }

  return (
    <>
      {sortedData.map((item) => {
        const preDeliveryItem = preDeliveryData.find(
          (pre) => pre.pre_delivery_tracking_no === item.tracking_no
        );

        return (
          <div
            key={item.tracking_no}
            className="my-5 max-w-[325px] border-1 rounded-sm shadow-lg p-5"
          >
            <div className="flex justify-between">
              <div>
                <h1 className="tracking-widest uppercase text-xs text-gray-500">
                  tracking No
                </h1>
                <h1 className="font-robo tracking-widest">
                  {item.tracking_no}
                  <span className="ml-1 font-bold text-indigo-500">
                    [{item.product_count ? item.product_count : 0}]
                  </span>
                </h1>
              </div>
            </div>

            {item.priority && (
              <div className="my-5">
                <h1 className="tracking-widest uppercase text-xs text-gray-500 ">
                  Priority No.
                </h1>
                <h1 className="font-robo tracking-widest">{item.priority}</h1>
              </div>
            )}

            <div className="my-5">
              <h1 className="tracking-widest uppercase text-xs text-gray-500 ">
                Customer name
              </h1>
              <h1 className="font-robo tracking-widest">
                {item.customer_name}
              </h1>
            </div>

            <div className="my-5">
              <h1 className="tracking-widest uppercase text-xs text-gray-500">
                Address
              </h1>
              <h1 className="font-robo tracking-widest">{item.address}</h1>
            </div>

            <div className="border-t border-gray-300">
              <div className="flex justify-between mt-2">
                <div>
                  <h1 className="tracking-widest uppercase text-xs text-gray-500">
                    Received by
                  </h1>
                  <h1 className="font-robo tracking-widest">
                    {" "}
                    {preDeliveryItem
                      ? preDeliveryItem.pre_delivery_received_by
                      : "-"}
                  </h1>
                </div>

                <div>
                  <h1 className="tracking-widest uppercase text-xs text-gray-500">
                    Status
                  </h1>
                  <span
                    className={
                      item.epod_status === "In Transit"
                        ? "text-[#FFA500] capitalize font-robo tracking-widest"
                        : item.epod_status === "In Receiving"
                        ? "text-[#007BFF] capitalize font-robo tracking-widest"
                        : item.epod_status === "Delivered"
                        ? "text-[#28A745] capitalize font-robo tracking-widest"
                        : "text-gray-400 capitalize font-robo tracking-widest"
                    }
                  >
                    {item.epod_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

UserDeliveryCard.propTypes = {
  data: PropTypes.array.isRequired,
  preDeliveryData: PropTypes.array.isRequired,
};
