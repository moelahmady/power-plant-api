export interface Plant {
  plantName: string;
  plantState: string;
  plantCapacity: number;
  primaryFuel: string;
  primaryFuelCategory: string;
  annualNetGeneration: number;
  annualHeatInput: number;
  annualCO2Emissions: number;
  annualCH4Emissions: number;
  annualN2OEmissions: number;
}