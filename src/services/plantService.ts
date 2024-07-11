import { getTopPlants } from "../db/plantOperations";

export async function getTopPlantsWithPercentages(count: number, state?: string): Promise<any[]> {
  return getTopPlants(count, state);
}