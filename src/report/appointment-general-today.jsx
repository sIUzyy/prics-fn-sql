import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import prics_logo from "../assets/nav_logo.png"; // ---- image

import PropTypes from "prop-types"; // ---- props-validation

// ---- dayjs ----
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

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
    textTransform: "uppercase",
  },
  date: {
    fontSize: 12,
    fontWeight: "normal",
    textAlign: "left",
  },
  textDate: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
    color: "#333",
    marginTop: 10,
  },

  tableHeader: { backgroundColor: "#ddd", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 4,
  },
  column: { flex: 1, fontSize: 8, paddingHorizontal: 2, textAlign: "center" },
});

// ---- report for today's-appointment (download today's report)
export default function AppointmentGeneralToday({ data }) {
  return (
    <Document>
      <Page size="LEGAL" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Image src={prics_logo} style={styles.logo} />
          <Text style={styles.header}>
            Scheduled Appointment Report for Today (e-POD)
          </Text>
          <Text style={styles.textDate}>TIMESTAMP</Text>
          <Text style={styles.date}>
            {dayjs().tz("Asia/Manila").format("MMMM DD, YYYY - hh:mm A")}
          </Text>
        </View>

        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.column}>Appt. ID</Text>
          <Text style={styles.column}>Carrier Name</Text>
          <Text style={styles.column}>Plate No.</Text>
          <Text style={styles.column}>Appt. Date</Text>
          <Text style={styles.column}>Appt. Time</Text>
          <Text style={styles.column}>Warehouse Name</Text>
          <Text style={styles.column}>Warehouse Address</Text>
          <Text style={styles.column}>Activity</Text>
          <Text style={styles.column}>Driver Name</Text>
          <Text style={styles.column}>Helper Name</Text>
          <Text style={styles.column}>Parking Slot</Text>
          <Text style={styles.column}>Dock</Text>
          <Text style={styles.column}>Time In</Text>
          <Text style={styles.column}>Time Out</Text>
          <Text style={styles.column}>Status</Text>
        </View>

        {data.map((item, index) => {
          return (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.appointment_id || "-"}</Text>
              <Text style={styles.column}>{item.carrier_name || "-"}</Text>
              <Text style={styles.column}>{item.plate_no || "-"}</Text>
              <Text style={styles.column}>
                {dayjs(item.appointment_date)
                  .tz("Asia/Manila")
                  .format("MMMM DD, YYYY")}
              </Text>
              <Text style={styles.column}>
                {dayjs(item.appointment_time)
                  .tz("Asia/Manila")
                  .format("hh:mm A")}
              </Text>
              <Text style={styles.column}>{item.warehouse_name || "-"}</Text>
              <Text style={styles.column}>{item.warehouse_address || "-"}</Text>
              <Text style={styles.column}>{item.activity || "-"}</Text>
              <Text style={styles.column}>{item.driver_name || "-"}</Text>
              <Text style={styles.column}>{item.helper_name || "-"}</Text>

              <Text style={styles.column}>{item.parking_slot || "-"}</Text>
              <Text style={styles.column}>{item.dock || "-"}</Text>
              <Text style={styles.column}>
                {item.time_in
                  ? dayjs(item.time_in).format("MMMM D, YYYY hh:mm A") // Example: March 13, 2025 01:45 PM
                  : "-"}
              </Text>
              <Text style={styles.column}>
                {item.time_out
                  ? dayjs(item.time_out).format("MMMM D, YYYY hh:mm A")
                  : "-"}
              </Text>
              <Text style={styles.column}>{item.status || "-"}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

// PropTypes validation
AppointmentGeneralToday.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      appointment_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      carrier_name: PropTypes.string,
      plate_no: PropTypes.string,
      appointment_date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      appointment_time: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      driver_name: PropTypes.string,
      helper_name: PropTypes.string,
      parking_slot: PropTypes.string,
      dock: PropTypes.string,
      time_in: PropTypes.string,
      time_out: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
};
