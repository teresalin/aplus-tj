import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../../lib/db-connector";

export interface Grade {
  id: number;
  name: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const personID = req.query.id;
  const client = await getDBClient();
  try {
    const query = {
      text: `
        SELECT
          class.id AS class_id,
          class.name AS class_name,
          array_agg(student.id) AS student_ids,
          array_agg(person.id) AS person_ids
        FROM class_student
        INNER JOIN student ON class_student.student_id = student.id
        INNER JOIN person ON student.person_id = person.id
        INNER JOIN class ON class_student.class_id = class.id
        INNER JOIN session ON class.id = session.class_id
        INNER JOIN attendance ON session.id = attendance.session_id
        WHERE person.id = $1
        GROUP BY class.id, class.name;
      `,
      values: [personID],
    };
    const result = await client.query(query);
    res.status(200).json(result.rows as Grade[]);
  } catch (error) {
    console.error("Error retrieving grades", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
