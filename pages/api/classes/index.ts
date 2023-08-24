import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Class {
  id: number;
  name: string;
  capacity: string;
  studentCount: number;
  teacherName: string;
}

function parseClass(row: any): Class {
  return {
    id: row.class_id,
    name: row.class_name,
    capacity: row.capacity,
    studentCount: row.student_count,
    teacherName: row.teacher_name,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT
            c.id AS class_id,
            c.name AS class_name,
            c.capacity,
            COUNT(cs.id) AS student_count,
            p.name AS teacher_name
        FROM classes AS c
        JOIN staffs AS s ON c.teacher_id = s.id
        JOIN persons AS p ON s.person_id = p.id
        LEFT JOIN class_students AS cs ON c.id = cs.class_id AND cs.active = true
        GROUP BY c.id, c.name, c.capacity, p.name
        ORDER BY c.id;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseClass));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
