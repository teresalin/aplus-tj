import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";
import { Class } from "../classes";

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
  const { filter } = req.query; // Destructure the filter parameter from query
  const client = await getDBClient();

  let additionalConditions = "";
  const now = new Date().toISOString();

  if (filter === "upcoming") {
    additionalConditions = `WHERE a.due_date > '${now}'`;
  } else if (filter === "past") {
    additionalConditions = `WHERE a.due_date <= '${now}'`;
  }

  try {
    const query = {
      text: `
        SELECT
          a.id,
          a.name AS assignment_name,
          a.description,
          c.id AS class_id,
          c.name AS class_name,
          a.due_date,
          a.time_created
        FROM
          assignment a
          INNER JOIN class_assignment ca ON a.id = ca.assignment_id
          INNER JOIN class c ON ca.class_id = c.id
        ${additionalConditions}
        ORDER BY
          due_date;
      `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows.map(parseAssignment));
  } catch (error) {
    console.error("Error retrieving assignments", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
