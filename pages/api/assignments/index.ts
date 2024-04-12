import { Class } from "../classes";
import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseAssignment } from "../../../utils/apiUtils";

export interface Assignment {
  id: number;
  classInfo: Partial<Class>;
  name: string;
  description?: string;
  dueDate: Date;
  created: Date;
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
    res.status(200).json({
      status: "Success",
      result: result.rows.map(parseAssignment),
      message: "Assignments retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving assignments", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  } finally {
    if (client) {
      await releaseDBClient(client);
    }
  }
};
