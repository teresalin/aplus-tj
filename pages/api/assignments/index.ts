import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Assignment {
  id: number;
  assignmentName: string;
  description: string;
  className: number;
  dueDate: Date;
  created: Date;
}

function parseAssignment(row: any): Assignment {
  return {
    id: row.id,
    assignmentName: row.assignment_name,
    description: row.description,
    className: row.class_name,
    dueDate: row.due_date,
    created: row.time_created,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT
          a.id,
          a.name AS assignment_name,
          a.description,
          c.id AS class_name,
          a.due_date,
          a.time_created
        FROM
          assignment a
          INNER JOIN class_assignment ca ON a.id = ca.assignment_id
          INNER JOIN class c ON ca.class_id = c.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseAssignment));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
