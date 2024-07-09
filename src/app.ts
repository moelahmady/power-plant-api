/**
 * This is the main entry point of the application.
 * It connects to the database, creates the plants table if it doesn't exist, and parses the Excel file to save the data in the database before starting the server.
 * It also starts the server and listens on a specified port.
 * @module src/app
 */
import express from "express";
import { parseAndSaveExcelData } from "./utils/excelParser";
import plantRoutes from "./routes/plantRoutes";
import {
  connectToDatabase,
  createPlantsTableIfNotExists,
} from "./db/operations";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json()); // Ensure JSON payloads are parsed

const buildPath = path.join(__dirname, "../frontend/build");

// Log the build directory contents
fs.readdir(buildPath, (err, files) => {
  if (err) {
    console.error("Error reading build directory:", err);
  } else {
    console.log("Build directory contents:", files);
  }
});

app.use(express.static(buildPath));

app.use("/api/plants", plantRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

async function startServer() {
  try {
    await connectToDatabase();
    await createPlantsTableIfNotExists();
    await parseAndSaveExcelData();

    const port = process.env.APP_PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(
      "Error connecting to the database or starting the server:",
      error
    );
    process.exit(1);
  }
}

startServer();
