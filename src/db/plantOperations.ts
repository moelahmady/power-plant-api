import { query } from "./db";

export async function insertPlant(plant: any): Promise<void> {
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
  await query(insertPlantQuery, [
    plant.plantName,
    plant.plantState,
    plant.annualNetGeneration,
    plant.latitude,
    plant.longitude,
  ]);
}

export async function insertStateTotal(state: any): Promise<void> {
  const insertStateQuery = `
    INSERT INTO state_totals ("state", "totalGeneration")
    VALUES ($1, $2)
    ON CONFLICT ("state") DO UPDATE SET
      "totalGeneration" = EXCLUDED."totalGeneration"
  `;
  await query(insertStateQuery, [
    state.state,
    state.totalGeneration,
  ]);
}

export async function insertPlantsAndStates(plantData: any[], stateData: any[]): Promise<void> {
  try {
    // Create promises for inserting plant data
    const plantInsertPromises = plantData.map(row => insertPlant({
      plantName: row["PNAME"],
      plantState: row["PSTATABB"],
      annualNetGeneration: row["PLNGENAN"],
      latitude: row["LAT"],
      longitude: row["LON"]
    }));

    // Create promises for inserting state data
    const stateInsertPromises = stateData.map(row => insertStateTotal({
      state: row["PSTATABB"],
      totalGeneration: row["STNGENAN"]
    }));

    // Wait for all insertions to complete
    await Promise.all([...plantInsertPromises, ...stateInsertPromises]);

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data into database:", error);
    throw error;
  }
}

export async function getTopPlants(count: number, state?: string): Promise<any[]> {
  const queryText = `
    SELECT p.*, 
           ROUND(CAST((p."annualNetGeneration" / COALESCE(s."totalGeneration", 0)) * 100 AS NUMERIC), 2) AS "statePercentage"
    FROM plants p
    LEFT JOIN state_totals s ON p."plantState" = s."state"
    ${state ? 'WHERE p."plantState" = $1' : ''}
    ORDER BY p."annualNetGeneration" DESC NULLS LAST
    LIMIT ${state ? '$2' : '$1'}
  `;
  const values = state ? [state, count] : [count];
  const result = await query(queryText, values);
  return result.rows;
}