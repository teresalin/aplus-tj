import { getDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { Schedule } from "./[class_id]/schedules";

export interface Class {
  id: number;
  name: string;
  teacherName: string;
  studentCount: number;
  capacity: string;
  schedules: Schedule[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT
          c.id,
          c.name,
          c.capacity,
          COUNT(cs.id) AS "studentCount",
          p.name AS "teacherName"
        FROM classes AS c
        JOIN staffs AS s ON c.teacher_id = s.id
        JOIN persons AS p ON s.person_id = p.id
        LEFT JOIN class_students AS cs ON c.id = cs.class_id AND cs.active = true
        GROUP BY c.id, c.name, c.capacity, p.name
        ORDER BY c.id;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows as Class[]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
