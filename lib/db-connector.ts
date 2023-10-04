import { Client } from "pg";
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

export async function getDBClient() {
  try {
    // TODO
    const client = new Client(config);
    await client.connect();
    return client;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}
