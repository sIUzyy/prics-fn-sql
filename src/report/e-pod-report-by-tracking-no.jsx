import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// image
import prics_logo from "../assets/nav_logo.png";

// props-validation
import PropTypes from "prop-types";

// document styling
const styles = StyleSheet.create({
  page: { padding: 10 },
  section: { marginBottom: 20 },
  logo: {
    width: 150,
    height: 85,
    objectFit: "cover",
    objectPosition: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  textDate: { fontSize: 10, fontWeight: "normal", textAlign: "center" },

  tableHeader: { backgroundColor: "#ddd", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 4,
  },
  column: { flex: 1, fontSize: 8, paddingHorizontal: 2, textAlign: "center" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    color: "#333",
    textTransform: "uppercase",
  },
});

// ---- report for e-pod by tracking no (report per row)
export default function EPODReportByTrackingNo({
  data,
  preDeliveryData,
  products,
}) {
  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Image src={prics_logo} style={styles.logo} />
          <Text style={styles.header}>
            ELECTRONIC PROOF OF DELIVERY (e-POD) REPORT
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            - {new Date().toLocaleTimeString("en-US")}
          </Text>
          <Text style={styles.textDate}>Date & Time Generated</Text>
        </View>

        {/* Shipment Details Table */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          TRACKING NUMBER DETAILS
        </Text>
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.column}>Tracking No</Text>
          <Text style={styles.column}>Shipped Date</Text>
          <Text style={styles.column}>Received Date</Text>
          <Text style={styles.column}>Waybill No</Text>
          <Text style={styles.column}>CV No</Text>
          <Text style={styles.column}>Plate No</Text>
          <Text style={styles.column}>Driver</Text>
          <Text style={styles.column}>Received By</Text>
          <Text style={styles.column}>Customer Name</Text>
          <Text style={styles.column}>Total CBM</Text>
          <Text style={styles.column}>Delivery Status</Text>
        </View>

        {data.map((item, index) => {
          const preDeliveryItem = preDeliveryData.find(
            (pre) => pre.pre_delivery_tracking_no === item.tracking_no
          );

          return (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.tracking_no || "-"}</Text>
              <Text style={styles.column}>
                {item.shipped_date
                  ? new Date(item.shipped_date).toLocaleDateString("en-US")
                  : "-"}
              </Text>
              <Text style={styles.column}>
                {preDeliveryItem?.pre_delivery_received_date
                  ? new Date(
                      preDeliveryItem.pre_delivery_received_date
                    ).toLocaleDateString("en-US")
                  : "-"}
              </Text>
              <Text style={styles.column}>{item.waybill_no || "-"}</Text>
              <Text style={styles.column}>{item.cv_no || "-"}</Text>
              <Text style={styles.column}>{item.plate_no || "-"}</Text>
              <Text style={styles.column}>{item.drivername || "-"}</Text>
              <Text style={styles.column}>
                {preDeliveryItem?.pre_delivery_received_by || "-"}
              </Text>
              <Text style={styles.column}>{item.customer_name || "-"}</Text>
              <Text style={styles.column}>{item.total_cbm || "-"} kg</Text>
              <Text style={styles.column}>{item.epod_status}</Text>
            </View>
          );
        })}

        {/* Product Details Table */}
        <Text style={[styles.sectionTitle, { marginTop: 50 }]}>
          PRODUCT CODES DETAILS
        </Text>
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.column}>Tracking No</Text>
          <Text style={styles.column}>Product Code</Text>
          <Text style={styles.column}>Shipped QTY</Text>
          <Text style={styles.column}>Actual Received QTY</Text>
          <Text style={styles.column}>Remarks</Text>
        </View>

        {data.map((item, index) => {
          // Find matching pre-delivery data for this tracking number
          const preDeliveryItem = preDeliveryData.find(
            (pre) => pre.pre_delivery_tracking_no === item.tracking_no
          );

          // Find products for this tracking number
          const matchingProducts = products.filter(
            (product) => product.tracking_no === item.tracking_no
          );

          return (
            <View key={index}>
              {matchingProducts.length > 0 ? (
                matchingProducts.map((product, productIndex) => {
                  // find pre-delivery product details using product_code
                  const preDeliveryProduct = preDeliveryItem?.products?.find(
                    (p) => p.product_code === product.product_code
                  );

                  return (
                    <View key={productIndex} style={styles.row}>
                      {/* show tracking_no only for the first product */}
                      {productIndex === 0 ? (
                        <Text style={[styles.column, styles.tracking_no]}>
                          {item.tracking_no || "-"}
                        </Text>
                      ) : (
                        <Text
                          style={[styles.column, styles.emptyColumn]}
                        ></Text>
                      )}

                      <Text style={styles.column}>
                        {product.product_code || "-"}
                      </Text>
                      <Text style={styles.column}>
                        {product.shipped_qty || "-"}
                      </Text>
                      <Text style={styles.column}>
                        {preDeliveryProduct?.received_qty || "-"}
                      </Text>
                      <Text style={styles.column}>
                        {preDeliveryProduct?.remarks || "-"}
                      </Text>
                    </View>
                  );
                })
              ) : (
                // If no matching products are found for this tracking number
                <View key={`no-products-${index}`} style={styles.row}>
                  <Text style={styles.column}>{item.tracking_no || "-"}</Text>
                  <Text style={styles.column} colSpan={4}>
                    No products found
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

// PropTypes validation
EPODReportByTrackingNo.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      trackingNo: PropTypes.string.isRequired,
      shippedDate: PropTypes.string.isRequired,
      waybillNo: PropTypes.string.isRequired,
      driverName: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      cvNo: PropTypes.string,
      plateNo: PropTypes.string,
      totalCbm: PropTypes.number, // Added this
      productCodes: PropTypes.arrayOf(
        PropTypes.shape({
          productCode: PropTypes.string.isRequired,
          shippedQty: PropTypes.number.isRequired,
          receivedQty: PropTypes.number,
          remarks: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  preDeliveryData: PropTypes.arrayOf(
    PropTypes.shape({
      pre_delivery_trackingNo: PropTypes.string.isRequired,
      pre_delivery_receivedDate: PropTypes.string,
      pre_delivery_receivedBy: PropTypes.string,
      pre_delivery_products: PropTypes.arrayOf(
        PropTypes.shape({
          productCode: PropTypes.string.isRequired,
          receivedQty: PropTypes.number,
          remarks: PropTypes.string,
        })
      ),
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
