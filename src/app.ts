/***
 * This is the main entry point of the application.
 * It connects to the database, creates the plants table if it doesn't exist, and parses the Excel file to save the data in the database before starting the server.
 * It also starts the server and listens on a specified port.
 * @module src/app
 */
import express from 'express';
import { createPlantsTableIfNotExists, parseAndSaveExcelData } from './utils/excelParser';
import plantRoutes from './routes/plantRoutes';
import { Pool } from 'pg';
import { config } from './config/config';

const app = express();
const pool = new Pool(config.database);

app.use('/api/plants', plantRoutes);

async function startServer() {
  try {
    await pool.connect();
    console.log('Connected to the database');

    await createPlantsTableIfNotExists();
    await parseAndSaveExcelData();

    const port = process.env.APP_PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database or starting the server:', error);
    process.exit(1);
  }
}

startServer();