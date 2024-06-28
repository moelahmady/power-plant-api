/**
 * Handles the request for getting the top plants with percentages. Queries can specify count and state.
 * @param {Request} req - The request object, including query parameters for count and state.
 * @param {Response} res - The response object used to return the top plants data or an error message.
 */

import { Request, Response } from 'express';
import { getTopPlantsWithPercentages } from '../services/plantService';

export async function getTopPlantsHandler(req: Request, res: Response) {
  const count = Number(req.query.count) || 10;
  const state = req.query.state as string;

  try {
    const topPlants = await getTopPlantsWithPercentages(count, state);
    res.json(topPlants);
  } catch (error) {
    console.error('Error retrieving top plants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}