import { Assignment } from "../assignments";
import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { Grade } from "../grades";
import { NextApiRequest, NextApiResponse } from "next";
import { parseClass } from "../../../utils/apiUtils";
import { Person } from "../persons";
import { Schedule } from "./[class_id]/schedules";
import { Staff } from "../persons/staffs";

export interface Class {
  id: number;
  name: string;
  teacher: Staff;
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
          class.id AS class_id,
          class.name AS class_name,
          class.capacity,
          class.teacher_id,
          grade.id AS grade_id,
          grade.name AS grade_name,
          COUNT(class_student.id) AS student_count,
          person.*,
          staff_role.id AS staff_role_id,
          staff_role.name AS staff_role_name,
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
            WHERE schedule.class_id = class.id
          ) AS "schedules"
        FROM class
        JOIN staff ON class.teacher_id = staff.id
        JOIN person ON staff.person_id = person.id
        JOIN grade ON class.grade_id = grade.id
        LEFT JOIN class_student ON class.id = class_student.class_id AND class_student.active = true
        LEFT JOIN staff_role ON staff.role_id = staff_role.id
        WHERE class.active = true
        GROUP BY class.id, class.name, grade.id, grade.name, class.capacity, person.id, staff_role.id, staff_role.name
        ORDER BY class.id;
      `,
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows.map(parseClass),
      message: "Classes retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving classes", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  } finally {
    // Make sure to release the client in both success and error cases.
    if (client) {
      await releaseDBClient(client);
    }
  }
};
