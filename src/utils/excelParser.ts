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
  const plantSheetName = "PLNT22";
  const stateSheetName = "ST22";
  const plantWorksheet = workbook.Sheets[plantSheetName];
  const stateWorksheet = workbook.Sheets[stateSheetName];

  const plantData: any[] = xlsx.utils.sheet_to_json(plantWorksheet, { range: 1 });
  const stateData: any[] = xlsx.utils.sheet_to_json(stateWorksheet, { range: 1 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert plant data
    const insertPlantQuery = `
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

    for (const row of plantData) {
      await client.query(insertPlantQuery, [
        row["PNAME"],
        row["PSTATABB"],
        row["PLNGENAN"],
        row["LAT"],
        row["LON"],
      ]);
    }

    // Insert state total generation data
    const insertStateQuery = `
      INSERT INTO state_totals ("state", "totalGeneration")
      VALUES ($1, $2)
      ON CONFLICT ("state") DO UPDATE SET
        "totalGeneration" = EXCLUDED."totalGeneration"
    `;

    for (const row of stateData) {
      await client.query(insertStateQuery, [
        row["PSTATABB"],
        row["STNGENAN"]
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
