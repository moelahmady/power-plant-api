import xlsx from 'xlsx';
import { Plant } from '../models/plant';
import dotenv from 'dotenv';

dotenv.config();

export function parseExcelData(): Plant[] {
  const filePath = process.env.EXCEL_FILE_PATH;
  if (!filePath) {
    throw new Error('EXCEL_FILE_PATH environment variable is not set.');
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = 'PLNT22';
  const worksheet = workbook.Sheets[sheetName];

  // Start reading data from the second row (index 1)
  const data: any[] = xlsx.utils.sheet_to_json(worksheet, { range: 1 });

  const plants: Plant[] = data.map(row => ({
    plantName: row['PNAME'],
    plantState: row['PSTATABB'],
    plantCapacity: row['NAMEPCAP'],
    primaryFuel: row['PLPRMFL'],
    primaryFuelCategory: row['PLFUELCT'],
    annualNetGeneration: row['PLNGENAN'],
    annualHeatInput: row['PLHTIAN'],
    annualCO2Emissions: row['PLCO2AN'],
    annualCH4Emissions: row['PLCH4AN'],
    annualN2OEmissions: row['PLN2OAN'],
  }));

  return plants;
}