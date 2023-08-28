import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Assignment {
  id: number;
  classId: number;
  name: string;
  description: string;
  dueDate: Date;
  active: boolean;
  timeCreated: Date;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
          SELECT * from assignment;
        `,
    };
    const result = await client.query(getQuery);
    // res.status(200).json(result.rows.map(parsePerson));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
