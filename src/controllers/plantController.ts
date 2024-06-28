import { Request, Response } from 'express';
import { parseExcelData } from '../utils/excelParser';
import { getTopPlantsWithPercentages } from '../services/plantService';

export function getTopPlantsHandler(req: Request, res: Response) {
  const count = Number(req.query.count) || 10; // Default to top 10 if count is not provided
  const state = req.query.state as string;

  try {
    const plants = parseExcelData();
    const topPlants = getTopPlantsWithPercentages(plants, count, state);
    res.json(topPlants);
  } catch (error) {
    console.error('Error retrieving top plants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}