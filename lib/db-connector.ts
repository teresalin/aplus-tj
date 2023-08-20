import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.POSTGRES_CONNECTION
  ? `/cloudsql/${process.env.POSTGRES_CONNECTION}` : process.env.POSTGRES_HOST;

const config = {
  host,
  port: 5432,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
};

let client: Client | null = null

export async function getDBClient() {
  try {
    if (client) {
      return client;
    }

    const newClient = new Client(config);
    await newClient.connect();
    client = newClient;
    return client;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}
