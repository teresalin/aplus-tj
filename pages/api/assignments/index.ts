import { Class } from "../classes";
import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export interface Assignment {
  id: number;
  classInfo: Partial<Class>;
  name: string;
  description?: string;
  dueDate: Date;
  created: Date;
}

function parseAssignment(row: any): Assignment {
  return {
    id: row.id,
    classInfo: {
      id: row.class_id,
      name: row.class_name,
    },
    name: row.assignment_name,
    description: row.description,
    dueDate: row.due_date,
    created: row.time_created,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { filter } = req.query;
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
          assignment.id,
          assignment.name AS assignment_name,
          assignment.description,
          class.id AS class_id,
          class.name AS class_name,
          assignment.due_date,
          assignment.time_created
        FROM
          assignment
          INNER JOIN class_assignment ON assignment.id = class_assignment.assignment_id
          INNER JOIN class ON class_assignment.class_id = class.id
        WHERE
          CASE
            WHEN $1 = 'upcoming' THEN assignment.due_date > NOW()
            WHEN $1 = 'past due' THEN assignment.due_date <= NOW()
            ELSE TRUE -- For 'all' or any other value, no filter is applied
          END
        ORDER BY
          due_date;
      `,
      values: [filter],
    };
    const result = await client.query(query);
    res.status(200).json(result.rows.map(parseAssignment));
  } catch (error) {
    console.error("Error retrieving assignments", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await releaseDBClient(client);
  }
};
