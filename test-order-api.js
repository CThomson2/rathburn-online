const http = require("http");

// Mock order data
const orderData = {
  supplier: "Kimia",
  po_number: "TEST-API-123",
  date_ordered: new Date().toISOString(),
  orderDetails: [
    {
      material: "Hexane",
      drum_quantity: 2,
    },
  ],
};

// Convert the data to JSON
const postData = JSON.stringify(orderData);

// Configure the HTTP request
const options = {
  hostname: "localhost",
  port: 3000, // Adjust if your Next.js server runs on a different port
  path: "/api/orders",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

// Send the request
console.log("Sending POST request to create a new order...");
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    try {
      const parsedData = JSON.parse(responseData);
      console.log("Response data:", JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.error("Error parsing response:", e);
      console.log("Raw response:", responseData);
    }
  });
});

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write the data to the request body
req.write(postData);
req.end();
