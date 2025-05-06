import {
  getDBClient,
  releaseDBClient,
} from "../../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const studentID = req.query.student_id;
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
          class.name,
          class_student.start_date AS "startDate",
          class_student.end_date AS "endDate",
          class_student.active
        FROM class_student
        INNER JOIN student ON class_student.student_id = student.id
        INNER JOIN class ON class_student.class_id = class.id
        WHERE student.id = $1
        GROUP BY 
          class.id, 
          class.name,
          class_student.start_date,
          class_student.end_date,
          class_student.active;
      `,
      values: [studentID],
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows,
      message: "Classes retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving classes", error);
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
