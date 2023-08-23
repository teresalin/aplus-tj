import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Assignment {
  id: number;
  name: string;
  description: string;
  email: string;
  dateOfBirth: Date;
  notes: string;
  active: boolean;
}

// function parsePerson(row: any): Assignment {
//   return {
//     id: row.id,
//     name: row.name,
//     description: row.description,
//     email: row.email,
//     dateOfBirth: row.date_of_birth,
//     notes: row.notes,
//     active: row.active,
//   };
// }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
          SELECT * from assignments;
        `,
    };
    const result = await client.query(getQuery);
    // res.status(200).json(result.rows.map(parsePerson));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
