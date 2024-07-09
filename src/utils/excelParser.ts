/**
 * Parses an Excel file and saves the data into a PostgreSQL database.
 * @returns A Promise that resolves to void.
 */
import xlsx from "xlsx";
import { Pool } from "pg";
import { config } from "../config/config";

const pool = new Pool(config.database);

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

    const insertQuery = `
      INSERT INTO plants (
        "plantName", "plantState", "annualNetGeneration", "latitude", "longitude", "lastUpdated"
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT ("plantName", "plantState") DO UPDATE SET
        "annualNetGeneration" = EXCLUDED."annualNetGeneration",
        "latitude" = EXCLUDED."latitude",
        "longitude" = EXCLUDED."longitude",
        "lastUpdated" = EXCLUDED."lastUpdated"
    `;

    for (const row of data) {
      await client.query(insertQuery, [
        row["PNAME"],
        row["PSTATABB"],
        row["PLNGENAN"],
        row["LAT"],
        row["LON"],
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
