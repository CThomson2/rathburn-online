require("dotenv").config();

// Get environment variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD.replace(/^"|"$/g, ""); // Remove surrounding quotes
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

// Properly encode the password
const encodedPassword = encodeURIComponent(dbPassword);

// Generate the DATABASE_URL
const databaseUrl = `postgresql://${dbUser}:${encodedPassword}@${dbHost}:${dbPort}/${dbName}`;

// Output to .env.generated file
const fs = require("fs");
fs.writeFileSync(".env.generated", `DATABASE_URL=${databaseUrl}\n`);

console.log("Generated DATABASE_URL successfully written to .env.generated");
console.log("You can copy this to your .env file");
console.log(`DATABASE_URL=${databaseUrl}`);
