// lib/db-connector.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function getDBClient() {
  try {
    return await pool.connect();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

export async function releaseDBClient(client) {
  try {
    client.release();
  } catch (err) {
    console.error('Error releasing database client:', err);
    throw err;
  }
}
