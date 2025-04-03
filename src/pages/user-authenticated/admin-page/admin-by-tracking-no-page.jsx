// ---- react ----
import { useState, useEffect, useMemo } from "react";

// ---- component ----
import AdminOrderItemsTable from "@/components/admin-components/admin-order-items-table";
import LoadingTable from "@/components/loading/loading-table";
import LoadingCard from "@/components/loading/loading-card";
import Heading from "@/components/header/page-heading";

// ---- shadcn component ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- library ----
import { useParams } from "react-router"; // ---- react router dom
import { Hash, Truck } from "lucide-react"; // ---- icon
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // axios

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT_SQL;

// this page is specifically for order summary by tracking no.
export default function AdminOrderSummaryById() {
  const [productData, setProductData] = useState([]);
  const [preDeliveryData, setPreDeliveryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreDelivery, setLoadingPreDelivery] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductCodes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/product/${id}`);
        const data = Array.isArray(response?.data) ? response.data : [];
        // Filter immediately to only include items matching the current tracking number
        setProductData(data.filter((item) => item?.tracking_no === id));
      } catch (error) {
        console.error("Error fetching product codes:", error);
        toast.error(
          "We could not load your customer order data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
        setProductData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductCodes();
    }
  }, [id]);

  useEffect(() => {
    if (!Array.isArray(productData) || productData.length === 0) {
      setPreDeliveryData([]);
      return;
    }

    const getPreDeliveryByTrackingNo = async () => {
      setLoadingPreDelivery(true);
      try {
        const requests = productData
          .filter((product) => product?.tracking_no === id) // Ensure we only fetch for current tracking number
          .map((product) =>
            axios.get(`${API_ENDPOINT}/api/pre-delivery/${product.tracking_no}`)
          );

        const responses = await Promise.all(requests);
        const preDeliveryResults = responses.map((res) => res.data || []);
        setPreDeliveryData(preDeliveryResults);
      } catch (error) {
        console.error("Failed to fetch pre-delivery data:", error);
        toast.error(
          "We could not load your pre-delivery data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
        setPreDeliveryData([]);
      } finally {
        setLoadingPreDelivery(false);
      }
    };

    getPreDeliveryByTrackingNo();
  }, [productData, id]); // Add id as dependency

  const validProductData = useMemo(() => {
    return productData.filter((item) => {
      return (
        item && item.product_code && item.tracking_no && item.tracking_no === id
      );
    });
  }, [productData, id]);

  return (
    <div className="my-5 mx-4">
      <Heading
        title={`dashboard > ${id || "N/A"}`}
        description={`Below is an overview of customer orders per tracking number.`}
      />
      {isLoading || loadingPreDelivery ? (
        <div>
          <LoadingCard />
          <LoadingTable />
        </div>
      ) : (
        <>
          <div className="flex gap-x-3">
            <Card className={"min-w-[400px] min-h-[150]"}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Tracking Number
                  </CardTitle>
                  <Hash size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {id || "N/A"}
                </h1>
              </CardContent>
            </Card>

            <Card className={"min-w-[400px] min-h-[150]"}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Total Customer Orders
                  </CardTitle>
                  <Truck size={25} />
                </div>
              </CardHeader>
              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {validProductData.length || "0"}
                </h1>
              </CardContent>
            </Card>
          </div>

          {validProductData.length > 0 ? (
            <AdminOrderItemsTable
              data={validProductData}
              preDeliveryData={preDeliveryData}
            />
          ) : (
            <div className="mt-5 p-4 border rounded-lg bg-gray-50 text-center">
              <p className="text-gray-600">
                No product(s) data available for this tracking number
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
