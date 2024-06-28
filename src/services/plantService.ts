
/**
 * Retrieves the top plants with their state percentages.
 * @param count - The number of plants to retrieve.
 * @param state - Optional. The state of the plants to filter by.
 * @returns A promise that resolves to an array of plants with their state percentages.
 */
import { Pool } from 'pg';
import { config } from '../config/config';

const pool = new Pool(config.database);

export async function getTopPlantsWithPercentages(count: number, state?: string): Promise<any[]> {
  const query = `
    SELECT p.*, (p."annualNetGeneration" / t.total_generation) * 100 AS "statePercentage"
    FROM plants p
    JOIN (
      SELECT "plantState", SUM("annualNetGeneration") AS total_generation
      FROM plants
      GROUP BY "plantState"
    ) t ON p."plantState" = t."plantState"
    ${state ? 'WHERE p."plantState" = $1' : ''}
    ORDER BY p."annualNetGeneration" DESC
    LIMIT $${state ? '2' : '1'}
  `;

  const values = state ? [state, count] : [count];

  const result = await pool.query(query, values);
  return result.rows;
}