// ---- component ----
import AppointmentCard from "./user-appointment-card";

// ---- props-validation ----
import PropTypes from "prop-types";

// ---- dayjs ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ---- dayjs ----
dayjs.extend(utc);
dayjs.extend(timezone);

// ---- dayjs ----
const PH_TZ = "Asia/Manila";

export default function UserAppointment({ data }) {
  // define ph timezone
  const todayPH = dayjs().tz(PH_TZ).format("YYYY-MM-DD");

  // filter the data to show only today's appointments
  const todayAppointments = data
    ?.filter(
      (appointment) =>
        dayjs(appointment.appointment_date).tz(PH_TZ).format("YYYY-MM-DD") ===
        todayPH
    ) // sort by time
    .sort((a, b) =>
      dayjs(a.appointment_time)
        .tz(PH_TZ)
        .diff(dayjs(b.appointment_time).tz(PH_TZ))
    );

  return (
    <div>
      {todayAppointments.length > 0 ? (
        todayAppointments.map((appt, index) => (
          <AppointmentCard key={index} appt={appt} />
        ))
      ) : (
        <p className="text-gray-500 font-medium">No appointments for today.</p>
      )}
    </div>
  );
}

UserAppointment.propTypes = {
  data: PropTypes.array,
};
