import { getDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { Schedule } from "./[class_id]/schedules";
import { Assignment } from "../assignments";
import { Person } from "../persons";

export interface Class {
  id: number;
  className: string;
  grade: string;
  teacherName: string;
  capacity: string;
  studentCount: number;
  activeStudents: Person[];
  schedules: Schedule[];
  upcomingAssignments: Assignment[];
  pastAssignments: Assignment[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT
          c.id,
          c.name AS "className",
          g.name AS "grade",
          c.capacity,
          COUNT(cs.id) AS "studentCount",
          p.name AS "teacherName"
        FROM class AS c
        JOIN staff AS s ON c.teacher_id = s.id
        JOIN person AS p ON s.person_id = p.id
        JOIN grade AS g ON c.grade_id = g.id
        LEFT JOIN class_student AS cs ON c.id = cs.class_id AND cs.active = true
        GROUP BY c.id, c.name, g.name, c.capacity, p.name
        ORDER BY c.id;
      `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows as Class[]);
  } catch (error) {
    console.error("Error retrieving classes", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
