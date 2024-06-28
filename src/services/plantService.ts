import { Plant } from '../models/plant';

export function getTopPlants(plants: Plant[], count: number): Plant[] {
  const sortedPlants = plants.sort((a, b) => b.annualNetGeneration - a.annualNetGeneration);
  return sortedPlants.slice(0, count);
}

export function filterPlantsByState(plants: Plant[], state: string): Plant[] {
  return plants.filter(plant => plant.plantState === state);
}

export function calculatePlantPercentages(plants: Plant[]): Plant[] {
  const stateTotals: { [state: string]: number } = {};

  // Calculate total annual net generation for each state
  plants.forEach(plant => {
    const state = plant.plantState;
    stateTotals[state] = (stateTotals[state] || 0) + plant.annualNetGeneration;
  });

  // Calculate percentage of each plant's generation within its state
  const plantsWithPercentage = plants.map(plant => ({
    ...plant,
    statePercentage: (plant.annualNetGeneration / stateTotals[plant.plantState]) * 100,
  }));

  return plantsWithPercentage;
}

export function getTopPlantsWithPercentages(plants: Plant[], count: number, state?: string): Plant[] {
  let filteredPlants = plants;

  if (state) {
    filteredPlants = filterPlantsByState(plants, state);
  }

  const plantsWithPercentage = calculatePlantPercentages(filteredPlants);
  const topPlants = getTopPlants(plantsWithPercentage, count);

  return topPlants;
}