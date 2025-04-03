/**
 * checks if there is an existing appointment for a given plate number on a specific date.
 *
 * This function iterates through the `data` array and checks whether an appointment
 * exists with the same `plateNo` and appointment date as the provided `date`. The comparison
 * is done using `toDateString()` to ignore time differences and match only the date.
 *
 * @param {Array} data - An array of appointment objects.
 * @param {string} plateNo - The plate number to check for an existing appointment.
 * @param {string|Date} date - The date to check for an existing appointment (can be a string or Date object).
 * @returns {boolean} `true` if an appointment exists for the given plate number and date, otherwise `false`.
 *
 */

export const hasExistingAppointment = (data, plateNo, date, appointmentId) => {
  return data.some((appointment) => {
    const appointmentDate = new Date(
      appointment.appointment_date
    ).toDateString();
    const selectedDateStr = new Date(date).toDateString();

    // Ignore the current appointment when checking for duplicates
    return (
      appointment.plate_no === plateNo &&
      appointmentDate === selectedDateStr &&
      appointment.status !== "Completed" &&
      appointment.appointment_id !== appointmentId // Make sure it's a different appointment
    );
  });
};

// export const hasExistingAppointment = (data, plateNo, date) => {
//   return data.some((appointment) => {
//     const appointmentDate = new Date(
//       appointment.appointment_date
//     ).toDateString();
//     const selectedDateStr = new Date(date).toDateString();
//     return (
//       appointment.plate_no === plateNo && appointmentDate === selectedDateStr
//     );
//   });
// };
