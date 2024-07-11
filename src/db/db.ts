import { Pool } from "pg";
import { config } from "../config/config";

const pool = new Pool(config.database);

export async function query(text: string, params?: any[]): Promise<any> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function transaction(queries: { text: string, params: any[] }[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const { text, params } of queries) {
      await client.query(text, params);
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}