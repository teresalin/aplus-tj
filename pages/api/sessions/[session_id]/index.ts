import { getDBClient, releaseDBClient } from "../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseSession } from "../../../../utils/apiUtils";
import { PoolClient } from "pg";
import { Session } from "../../../../src/components/sessions/types";

async function getSession(
  client: PoolClient,
  sessionID: string | string[] | undefined | number
) {
  const query = {
    text: `
      SELECT id, class_id, date, start_time, end_time
      FROM session
      WHERE id = $1;
    `,
    values: [sessionID],
  };

  const result = await client.query(query);
  return result.rows.map(parseSession)[0];
}

async function getSessionDetail(
  client: PoolClient,
  sessionID: string | string[] | undefined
) {
  try {
    await client.query("BEGIN");

    const sessionGetQuery = {
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
            session.date,
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
          GROUP BY session.id, session.date, session.start_time, session.end_time, class.name
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
          acs.date AS "sessionDate",
          acs.start_time AS "startTime",
          acs.end_time AS "endTime",
          acs.class_name AS "className",
          absent_students.student_details AS "absent"
        FROM attended_students
        JOIN active_class_students acs ON attended_students.session_id = acs.session_id
        JOIN absent_students ON attended_students.session_id = absent_students.session_id
      `,
    };

    const sessionResult = await client.query(sessionGetQuery);

    await client.query("COMMIT");
    return sessionResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function createSession(client: PoolClient, data: Session) {
  const { id, classId, date, startTime, endTime } = data;

  try {
    await client.query("BEGIN");

    const query = {
      text: `
        INSERT INTO session(class_id, date, start_time, end_time, created, updated)
        VALUES($1, $2, $3, $4, NOW(), NOW());
      `,
      values: [classId, date, startTime, endTime],
    };
    await client.query(query);

    // Fetch updated data after update within the same transaction
    const updatedResult = await getSession(client, id);

    await client.query("COMMIT");
    return updatedResult;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function updateSession(client: PoolClient, data: Session) {
  const { id, classId, date, startTime, endTime } = data;

  try {
    await client.query("BEGIN");

    const query = {
      text: `
        UPDATE session 
        SET class_id = $2, date = $3, start_time = $4, end_time = $5, created = NOW(), updated = NOW()
        WHERE id = $1
        RETURNING id;
      `,
      values: [id, classId, date, startTime, endTime],
    };
    await client.query(query);

    // Fetch updated data after update within the same transaction
    const updatedResult = await getSession(client, id);

    await client.query("COMMIT");
    return updatedResult;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

// TODO replace hard-coded values
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionID = req.query.session_id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
      try {
        const getResult = await getSessionDetail(client, sessionID);
        res.status(200).json({
          status: "Success",
          result: getResult,
          message: "Session retrieved successfully.",
        });
      } catch (error) {
        console.error("Error retrieving session", error);
        res.status(500).json({
          status: "Error",
          message: "Internal server error",
        });
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
    case "POST":
      try {
        const data: Session = req.body;
        const createResult = await createSession(client, data);
        res.status(200).json({
          status: "Success",
          result: createResult,
          message: "Class created successfully.",
        });
      } catch (error) {
        console.error("Error creating session", error);
        res.status(500).json({
          status: "Error",
          message: "Internal server error",
        });
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
    case "PUT":
      try {
        const data: Session = req.body;
        const updateResult = await updateSession(client, data);
        res.status(200).json({
          status: "Success",
          result: updateResult,
          message: "Class updated successfully.",
        });
      } catch (error) {
        console.error("Error updating session", error);
        res.status(500).json({
          status: "Error",
          message: "Internal server error",
        });
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
    case "DELETE":
      try {
        // TODO implement delete API
      } catch (error) {
        console.error("Error deleting session", error);
        res.status(500).json({
          status: "Error",
          message: "Internal server error",
        });
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
  }
};
