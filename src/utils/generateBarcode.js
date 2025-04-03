/**
 * Generates a barcode image based on the given tracking number and triggers a download.
 *
 * This function creates a barcode using JsBarcode, renders it on a canvas,
 * converts it to an image, and automatically downloads it as a PNG file.
 *
 * @param {string} trackingNo - The tracking number to encode in the barcode.
 *
 * @example
 * generateBarcode("TRACK12345");
 * // Triggers download: "epod_barcode_TRACK12345.png"
 */

// ---- library ----
import JsBarcode from "jsbarcode"; // generate a barcode

// function to generate a barcode based on tracking no
export const generateBarcode = (trackingNo) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, trackingNo, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  });

  // convert to image and trigger download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `epod_barcode_${trackingNo}.png`;
  link.click();
};
