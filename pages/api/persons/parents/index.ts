import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Person } from "..";

export interface Parent extends Person {
  parentId: number;
}

function parseParent(row: any): Parent {
  return {
    id: row.id,
    parentId: row.parent_id,
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
            person.active,
            parent.id AS parent_id
        FROM
            parent
        JOIN
            person ON parent.person_id = person.id;
        `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows.map(parseParent));
  } catch (error) {
    console.error("Error retrieving parents", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
