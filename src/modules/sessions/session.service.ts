import { CreateSessionDTO, UpdateSessionDTO } from "./dtos";
import { getDBClient } from "../../../lib/db-connector";
import { mapRowToSession } from "./session.mapper";
import { Session } from "./types";
import { UniqueConstraintError } from "../../../utils/CustomError";
import dayjs from "dayjs";

export async function findAllSessions(
  range: string | string[] | undefined
): Promise<Session[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT
        session.id,
        c.id AS class_id,
        c.name AS class_name,
        session.start_time AT TIME ZONE 'UTC' AS start_time,
        session.end_time AT TIME ZONE 'UTC' AS end_time
      FROM
        session
        INNER JOIN class c ON session.class_id = c.id
      WHERE
        c.active = TRUE
        AND (
          ($1 = 'last7Days' 
              AND session.start_time >= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' - INTERVAL '7 days') 
              AND session.start_time < CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
          OR ($1 = 'thisMonth' 
              AND session.start_time >= DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') 
              AND session.start_time < (DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '1 month'))
          OR ($1 = 'yearToDate' 
              AND session.start_time >= DATE_TRUNC('year', CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
          )
        )
      ORDER BY 
        session.start_time DESC;
      `,
      [range]
    );
    return rows.map(mapRowToSession);
  } catch (error) {
    console.error("Error fetching sessions from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findSessionById(
  sessionId: number
): Promise<Session | null> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT id, class_id, start_time, end_time
      FROM session
      WHERE id = $1;
      `,
      [sessionId]
    );
    return rows.length ? mapRowToSession(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving session from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createSession(dto: CreateSessionDTO) {
  const client = await getDBClient();

  console.log(dto);
  ``;
  try {
    await client.query("BEGIN");

    const insertSessionQuery = {
      text: `
        INSERT INTO session(class_id, start_time, end_time, status, created, updated)
        VALUES($1, $2, $3, $4, NOW(), NOW());
      `,
      values: [
        dto.classId,
        dayjs(dto.startTime).utc(),
        dayjs(dto.endTime).utc(),
        "Scheduled",
      ],
    };
    await client.query(insertSessionQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A session with the same class and date times already exists."
      );
    } else {
      console.error("Error creating session in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function updateSession(dto: UpdateSessionDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const updateSessionQuery = {
      text: `
        UPDATE session 
        SET class_id = $2, start_time = $3, end_time = $4, created = NOW(), updated = NOW()
        WHERE id = $1
        RETURNING id;
      `,
      values: [dto.id, dto.classId, dto.startTime, dto.endTime],
    };
    await client.query(updateSessionQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A session with the same class and date times already exists."
      );
    } else {
      console.error("Error updating session in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}
