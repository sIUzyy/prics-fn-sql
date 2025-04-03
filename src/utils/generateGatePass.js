/**
 * Generates a gate pass image with a barcode based on the given appointment ID.
 *
 * This function creates a barcode using JsBarcode, renders it on a canvas,
 * adds a "GATEPASS" label, and automatically triggers a download of the generated image.
 *
 * @param {string} apptId - The appointment ID to encode in the barcode.
 *
 * @example
 * generateGatePass("APPT12345");
 * // Triggers download: "appointment_id_APPT12345.png"
 */

// ---- library ----
import JsBarcode from "jsbarcode"; // generate a barcode

// function to generate a gatepass based on appointment id
export const generateGatePass = (apptId) => {
  const canvas = document.createElement("canvas");

  // Generate the barcode with white background
  JsBarcode(canvas, apptId, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
    background: "#ffffff", // Explicit white background
  });

  // Create a new canvas to ensure white background
  const newCanvas = document.createElement("canvas");
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  const ctx = newCanvas.getContext("2d");

  // Fill with white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  // Draw the barcode
  ctx.drawImage(canvas, 0, 0);

  // Convert to image and trigger download
  const link = document.createElement("a");
  link.href = newCanvas.toDataURL("image/png");
  link.download = `appointment_id_${apptId}.png`;
  link.click();
};
