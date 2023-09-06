import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Student } from "../../students";

// TODO reformat?
export interface SessionDetail {
  id: number;
  teacher: string;
  className: string;
  sessionDate: Date;
  startTime: Date;
  endTime: Date;
  attended: Attendee[];
  absent: Attendee[];
}

export interface Attendee {
  id: number;
  name: string;
  gender: string;
  englishName: string;
  currentSchool: string;
}

// TODO replace hard-coded values
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionID = req.query.session_id;
  const client = await getDBClient();
  try {
    const query = {
      text: `
        WITH attended_students AS (
          SELECT
            s.id AS session_id,
            p_teacher.name AS teacher,
            array_agg(
              jsonb_build_object(
                'id', student.id,
                'name', person.name,
                'englishName', student.english_name,
                'currentSchool', student.current_school,
                'gender', person.gender
              )
            ) AS student_details
          FROM session s
          JOIN class c ON s.class_id = c.id
          JOIN staff st ON c.teacher_id = st.id
          JOIN person p_teacher ON st.person_id = p_teacher.id
          LEFT JOIN attendance a ON s.id = a.session_id
          LEFT JOIN student ON a.student_id = student.id
          LEFT JOIN person ON student.person_id = person.id
          WHERE s.id = 3
          GROUP BY s.id, p_teacher.name
        ),

        active_class_students AS (
          SELECT
            session.id AS session_id,
            session.session_date,
            session.start_time,
            session.end_time,
            class.name AS "class_name",
            array_agg(
              jsonb_build_object(
                'id', student.id,
                'name', person.name,
                'englishName', student.english_name,
                'currentSchool', student.current_school,
                'gender', person.gender
              )
            ) AS student_details
          FROM session
          JOIN class ON session.class_id = class.id
          LEFT JOIN class_student ON class.id = class_student.class_id
          LEFT JOIN student ON class_student.student_id = student.id
          LEFT JOIN person ON student.person_id = person.id
          WHERE class_student.active = TRUE AND session.id = 3
          GROUP BY session.id, session.session_date, session.start_time, session.end_time, class.name
        ),

        absent_students AS (
          SELECT
            acs.session_id,
            array_agg(non_matching.student_details) AS student_details
          FROM (
            SELECT unnest(active_class_students.student_details) AS student_details
            FROM active_class_students
            
            EXCEPT
            
            SELECT unnest(attended_students.student_details) AS student_details
            FROM attended_students
          ) AS non_matching
          LEFT JOIN active_class_students acs ON non_matching.student_details = ANY(acs.student_details)
          GROUP BY acs.session_id
        )
        
        SELECT 
          attended_students.teacher,
          attended_students.student_details AS "attended",
          acs.session_id AS "sessionId",
          acs.session_date AS "sessionDate",
          acs.start_time AS "startTime",
          acs.end_time AS "endTime",
          acs.class_name AS "className",
          absent_students.student_details AS "absent"
        FROM attended_students
        JOIN active_class_students acs ON attended_students.session_id = acs.session_id
        JOIN absent_students ON attended_students.session_id = absent_students.session_id
      `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
