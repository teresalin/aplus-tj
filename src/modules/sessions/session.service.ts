import { CreateSessionDTO, UpdateSessionDTO } from "./dtos";
import { getDBClient } from "../../lib/db-connector";
import { mapRowToSession } from "./session.mapper";
import { Session } from "./types";
import dayjs from "dayjs";

const BASE_SESSION_SELECT = `
  SELECT
    s.id               AS id,
    s.class_id         AS class_id,
    c.name             AS class_name,
    (s.start_time AT TIME ZONE 'UTC') AS start_time,
    (s.end_time   AT TIME ZONE 'UTC') AS end_time
  FROM session s
  JOIN class c ON s.class_id = c.id
  WHERE c.active = TRUE
`;

export async function findAllSessions(): Promise<Session[]> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      BASE_SESSION_SELECT +
        `
      ORDER BY s.start_time DESC;
    `,
    );
    return rows.map(mapRowToSession);
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findSessionById(
  sessionId: string,
): Promise<Session | null> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      `${BASE_SESSION_SELECT}
       AND s.id = $1;`,
      [sessionId],
    );
    return rows.length ? mapRowToSession(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving session:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createSession(dto: CreateSessionDTO): Promise<Session> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    const insertSQL = `
      INSERT INTO session (class_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const { rows: ins } = await client.query<{ id: string }>(insertSQL, [
      dto.classId,
      dayjs(dto.startTime).utc().toDate(),
      dayjs(dto.endTime).utc().toDate(),
      "Scheduled",
    ]);
    const sessionId = ins[0].id;

    await client.query("COMMIT");

    const { rows } = await client.query(
      `${BASE_SESSION_SELECT}
       AND s.id = $1;`,
      [sessionId],
    );
    return mapRowToSession(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating session:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateSession(dto: UpdateSessionDTO): Promise<Session> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    const updateSQL = `
      UPDATE session
        SET class_id   = $2,
            start_time = $3,
            end_time   = $4
      WHERE id = $1
      RETURNING id;
    `;
    const { rowCount } = await client.query(updateSQL, [
      dto.id,
      dto.classId,
      dayjs(dto.startTime).utc().toDate(),
      dayjs(dto.endTime).utc().toDate(),
    ]);

    await client.query("COMMIT");

    const { rows } = await client.query(
      `${BASE_SESSION_SELECT}
       AND s.id = $1;`,
      [dto.id],
    );
    return mapRowToSession(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating session:", error);
    throw error;
  } finally {
    client.release();
  }
}
