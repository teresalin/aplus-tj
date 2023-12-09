import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { Assignment } from "../assignments";
import { Grade } from "../persons/students/grades";
import { NextApiRequest, NextApiResponse } from "next";
import { parseClass } from "../../../utils/apiUtils";
import { Person } from "../persons";
import { Schedule } from "./[class_id]/schedules";
import { Staff } from "../persons/staffs";

export interface Class {
  id: number;
  name: string;
  teacher: Partial<Staff>;
  grade: Grade;
  schedules: Schedule[];
  capacity: number;
  studentCount?: number;
  activeStudents?: Person[];
  assignments?: Assignment[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let client; // Declare the client variable outside the try-catch block.

  try {
    client = await getDBClient();

    const query = {
      text: `
        SELECT
          c.id AS class_id,
          c.name AS class_name,
          c.capacity,
          c.teacher_id,
          g.id AS grade_id,
          g.name AS grade_name,
          COUNT(cs.id) AS student_count,
          p.*,
          sr.id AS staff_role_id,
          sr.name AS staff_role_name,
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', schedule.id,
                'dayOfWeek', schedule.day_of_week,
                'startTime', schedule.start_time,
                'endTime', schedule.end_time
              )
            )
            FROM schedule
            WHERE schedule.class_id = c.id
          ) AS "schedules"
        FROM class AS c
        JOIN staff AS s ON c.teacher_id = s.id
        JOIN person AS p ON s.person_id = p.id
        JOIN grade AS g ON c.grade_id = g.id
        LEFT JOIN class_student AS cs ON c.id = cs.class_id AND cs.active = true
        LEFT JOIN staff_role AS sr ON s.role_id = sr.id
        WHERE c.active = true
        GROUP BY c.id, c.name, g.id, g.name, c.capacity, p.id, sr.id, sr.name
        ORDER BY c.id;
      `,
    };
    const result = await client.query(query);
    console.log(result.rows);
    res.status(200).json(result.rows.map(parseClass));
  } catch (error) {
    console.error("Error retrieving classes", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Make sure to release the client in both success and error cases.
    if (client) {
      await releaseDBClient(client);
    }
  }
};
