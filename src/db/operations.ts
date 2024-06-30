import { Pool } from "pg";
import { config } from "../config/config";

const pool = new Pool(config.database);

export async function connectToDatabase(): Promise<void> {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
export async function dropPlantsTable(): Promise<void> {
  const dropTableQuery = `
    DROP TABLE IF EXISTS plants CASCADE;
  `;
  try {
    await pool.query(dropTableQuery);
    console.log("Table dropped successfully");
  } catch (error) {
    console.error("Error dropping table:", error);
  }
}

export async function createPlantsTableIfNotExists(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS plants (
      id SERIAL PRIMARY KEY,
      "plantName" VARCHAR(255),
      "plantState" VARCHAR(255),
      "annualNetGeneration" FLOAT
    )
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}
