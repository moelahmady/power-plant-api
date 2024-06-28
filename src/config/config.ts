/**
 * Configuration settings for the application, including database connection details.
 * @type {{database: {host: string, port: number, user: string, password: string, database: string}}}
 */
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    database: {
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER || 'your_username',
      password: process.env.PG_PASSWORD || 'your_password',
      database: process.env.PG_DB || 'your_database',
    },
  };