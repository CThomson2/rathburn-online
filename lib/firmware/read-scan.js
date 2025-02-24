const { SerialPort, ReadlineParser } = require("serialport");
const fs = require("fs");
const axios = require("axios");

// Configuration
const API_ENDPOINT = "http://localhost:3000/api/barcodes/scan"; // Replace with your actual Next.js API endpoint

console.log("Starting serial port setup...");

// Initialize the serial port with specified path and baud rate
const port = new SerialPort({
  path: "/dev/tty.usbmodem__Q21", // Replace with your actual port
  baudRate: 9600,
});

console.log("Serial port created");

// Create a parser to read data from the serial port, using a carriage return as the delimiter
const parser = port.pipe(new ReadlineParser({ delimiter: "\r" }));

console.log("Parser created");

// Variable to store the last scanned data
let lastScan = null;

/**
 * Sends scanned data to the specified API endpoint.
 * @param {string} data - The scanned barcode data to be sent.
 */
async function sendDataToAPI(data) {
  try {
    const response = await axios.post(API_ENDPOINT, {
      barcode: data,
      timestamp: new Date().toISOString(),
    });
    console.log("Successfully sent to API:", response.status);
  } catch (error) {
    console.error("Error sending to API:", API_ENDPOINT, error.message);
  }
}

// Event listener for incoming data from the serial port
parser.on("data", async (data) => {
  // Trim the received data and store it
  lastScan = data.trim();
  console.log(`Scanned Data (trimmed): ${lastScan}`); // Log the trimmed data

  // Send the scanned data to the API
  await sendDataToAPI(lastScan);

  // Append the scanned data to 'output.txt' with a newline
  fs.appendFile("output.txt", lastScan + "\n", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Successfully wrote to file");
    }
  });
});

// Error handling for the serial port
port.on("error", (err) => {
  console.error("Serial Port Error:", err);
});

// Log a message when the serial port opens successfully
port.on("open", () => {
  console.log("Serial port opened successfully");
});

// Error handling for the parser
parser.on("error", (err) => {
  console.error("Parser Error:", err);
});

// Global error handler for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
