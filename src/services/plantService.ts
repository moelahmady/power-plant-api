
/**
 * Retrieves the top plants with their state percentages.
 * @param count - The number of plants to retrieve.
 * @param state - Optional. The state of the plants to filter by.
 * @returns A promise that resolves to an array of plants with their state percentages.
 */

import { Pool } from 'pg';
import { config } from '../config/config';
import { Plant } from '../models/plant';

const pool = new Pool(config.database);

export async function getTopPlantsWithPercentages(count: number, state?: string): Promise< Plant []> {
  const query = `
  SELECT p.*, 
         ROUND(CAST((p."annualNetGeneration" / COALESCE(t.total_generation, 0)) * 100 AS NUMERIC), 2) AS "statePercentage"
  FROM plants p
  LEFT JOIN (
    SELECT "plantState", SUM("annualNetGeneration") AS total_generation
    FROM plants
    GROUP BY "plantState"
  ) t ON p."plantState" = t."plantState"
  ${state ? 'WHERE p."plantState" = $1' : ''}
  ORDER BY p."annualNetGeneration" DESC NULLS LAST
  LIMIT ${state ? '$2' : '$1'} 
  `;


  // If state is provided, the values array will contain state and count, otherwise just count
  const values = state ? [state, count] : [count];

  const result = await pool.query(query, values);
  return result.rows;
}