import xlsx from "@e965/xlsx";
import { insertPlantsAndStates } from "../db/plantOperations";

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

  try {
    await insertPlantsAndStates(plantData, stateData);
    console.log("Data parsed and saved successfully.");
  } catch (error) {
    console.error("Error saving data to database:", error);
    throw error;
  }
}