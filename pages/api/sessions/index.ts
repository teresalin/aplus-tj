import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Session {
  id: number;
  classId: string;
  className: string;
  sessionDate: string;
  startTime: string;
  endTime: Date;
  attendance: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const query = {
      text: `
        SELECT
            person.id,
            person.name,
            person.gender,
            person.phone,
            person.email,
            person.date_of_birth,
            person.notes,
            person.active
        FROM
            parent
        JOIN
            person ON parents.person_id = person.id;
        `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows as Session[]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
