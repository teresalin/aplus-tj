import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Parent {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes: string;
  active: boolean;
}

function parseParent(row: any): Parent {
  return {
    id: row.id,
    name: row.name,
    gender: row.gender,
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
            person ON parent.person_id = person.id;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseParent));
  } catch (error) {
    console.error("Error retrieving parents", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
