import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../../lib/db-connector";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const personID = req.query.id;
  const client = await getDBClient();
  try {
    const query = {
      text: `
        SELECT
          class.name,
          class_student.start_date AS "startDate",
          class_student.end_date AS "endDate",
          class_student.active,
          (
            SELECT array_agg(session_date ORDER BY session_date DESC)
            FROM (
              SELECT session_date
              FROM class_student
              INNER JOIN student ON class_student.student_id = student.id
              INNER JOIN person ON student.person_id = person.id
              INNER JOIN class ON class_student.class_id = class.id
              INNER JOIN session ON class.id = session.class_id
              INNER JOIN attendance ON session.id = attendance.session_id
              WHERE person.id = $1 AND class.id = class_student.class_id
              ORDER BY session_date DESC
              LIMIT 3 -- Limit to the most recent 3 sessions
            ) AS subquery
          ) AS "sessionDates"
        FROM class_student
        INNER JOIN student ON class_student.student_id = student.id
        INNER JOIN person ON student.person_id = person.id
        INNER JOIN class ON class_student.class_id = class.id
        WHERE person.id = $1
        GROUP BY 
          class.id, 
          class.name,
          class_student.start_date,
          class_student.end_date,
          class_student.active;
      `,
      values: [personID],
    };
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving grades", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
