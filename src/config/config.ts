/**
 * Configuration settings for the application, including database connection details.
 * @type {{database: {host: string, port: number, user: string, password: string, database: string}}}
 */
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USERNAME || 'your_username',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_NAME || 'your_database',
    },
  };