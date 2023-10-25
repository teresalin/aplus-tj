import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.POSTGRES_CONNECTION
  ? `/cloudsql/${process.env.POSTGRES_CONNECTION}`
  : process.env.POSTGRES_HOST;

const config = {
  host,
  port: 5432,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
};

const pool = new Pool(config);

// Use this function to get a database client from the pool.
export async function getDBClient() {
  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

// Release the database client back to the pool when done with it.
export async function releaseDBClient(client) {
  try {
    client.release();
  } catch (err) {
    console.error("Error releasing database client:", err);
    throw err;
  }
}
