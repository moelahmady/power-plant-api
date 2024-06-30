/**
 * Creates the `plants` table in the database if it does not already exist.
 * The table includes columns for plant ID, name, state, capacity, primary fuel and its category,
 * as well as annual net generation, heat input, and emissions (CO2, CH4, N2O).
 *
 * @returns {Promise<void>} A promise that resolves when the table is created or already exists.
 */

import xlsx from "xlsx";
import { Pool } from "pg";
import { config } from "../config/config";

const pool = new Pool(config.database);

/**
 * Parses data from an Excel file and saves it to the `plants` table in the database.
 * The Excel file path is read from the `EXCEL_FILE_PATH` environment variable.
 * The function reads the specified sheet ('PLNT22'), parses each row into a JSON object,
 * and inserts the data into the `plants` table. Existing data in the table is deleted before new data is inserted.
 *
 * @throws {Error} If the `EXCEL_FILE_PATH` environment variable is not set or if any error occurs during the database operations.
 * @returns {Promise<void>} A promise that resolves when the data has been successfully parsed and saved to the database.
 */

export async function parseAndSaveExcelData(): Promise<void> {
  const filePath = process.env.EXCEL_FILE_PATH;
  if (!filePath) {
    throw new Error("EXCEL_FILE_PATH environment variable is not set.");
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = "PLNT22";
  const worksheet = workbook.Sheets[sheetName];

  const data: any[] = xlsx.utils.sheet_to_json(worksheet, { range: 1 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM plants");

    const insertQuery = `
      INSERT INTO plants (
        "plantName", "plantState", "annualNetGeneration"
      )
      VALUES ($1, $2, $3)
    `;

    for (const row of data) {
      await client.query(insertQuery, [
        row["PNAME"],
        row["PSTATABB"],
        row["PLNGENAN"],
      ]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
