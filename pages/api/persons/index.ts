import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Person {
  id: number;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes: string;
  active: boolean;
}

function parsePerson(row: any): Person {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    notes: row.notes,
    active: row.active,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
          SELECT * from persons;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parsePerson));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
