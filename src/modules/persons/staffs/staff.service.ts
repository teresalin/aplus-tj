import { CreateStaffDTO, UpdateStaffDTO } from "./dtos";
import { getDBClient } from "../../../../lib/db-connector";
import { mapRowToStaff } from "./staff.mapper";
import { Staff } from "./types";

const BASE_STAFF_SELECT = `
  SELECT
    p.id                AS id,
    p.name              AS name,
    p.preferred_name    AS preferred_name,
    p.gender            AS gender,
    p.phone             AS phone,
    p.email             AS email,
    (p.date_of_birth AT TIME ZONE 'UTC') AS date_of_birth,
    p.notes             AS notes,
    p.active            AS active,
    s.staff_id          AS staff_id,
    (s.hire_date AT TIME ZONE 'UTC')  AS hire_date,
    (s.leave_date AT TIME ZONE 'UTC') AS leave_date,
    r.id                AS role_id,
    r.name              AS role_name
  FROM staff s
  JOIN person      p ON s.id       = p.id
  JOIN staff_role  r ON s.role_id  = r.id
  WHERE p.active = TRUE
`;

export async function findAllStaffs(): Promise<Staff[]> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      BASE_STAFF_SELECT +
        `
      ORDER BY p.name;
    `,
    );
    return rows.map(mapRowToStaff);
  } catch (error) {
    console.error("Error retrieving staffs:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findStaffById(staffId: string): Promise<Staff | null> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      BASE_STAFF_SELECT +
        `
      AND s.id = $1;
    `,
      [staffId],
    );
    return rows.length ? mapRowToStaff(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving staff:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createStaff(dto: CreateStaffDTO): Promise<Staff> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 1) insert person
    const {
      rows: [{ id: personId }],
    } = await client.query<{ id: number }>(
      `
      INSERT INTO person
        (name, preferred_name, gender, phone, email, date_of_birth, notes, active)
      VALUES ($1, $2, $3, $4, $5,$6, $7, true)
      RETURNING id;
      `,
      [
        dto.name,
        dto.preferredName,
        dto.gender,
        dto.phone,
        dto.email,
        dto.dateOfBirth,
        dto.notes,
      ],
    );

    // 2) insert staff
    await client.query(
      `
      INSERT INTO staff
        (id, role_id, hire_date, leave_date)
      VALUES ($1, $2, $3, $4);
      `,
      [personId, dto.roleId, dto.hireDate, dto.leaveDate],
    );

    await client.query("COMMIT");

    // 3) fetch & return the new record
    const { rows } = await client.query(
      BASE_STAFF_SELECT +
        `
      AND s.id = $1;
    `,
      [personId],
    );
    return mapRowToStaff(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating staff:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateStaff(dto: UpdateStaffDTO) {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 1) update person
    await client.query<{ id: number }>(
      `
      UPDATE person
         SET name            = $2,
             preferred_name  = $3,
             gender          = $4,
             phone           = $5,
             email           = $6,
             date_of_birth   = $7,
             notes           = $8
       WHERE id = $1
      RETURNING id;
      `,
      [
        dto.id,
        dto.name,
        dto.preferredName,
        dto.gender,
        dto.phone,
        dto.email,
        dto.dateOfBirth,
        dto.notes,
      ],
    );

    // 2) update staff
    await client.query(
      `
      UPDATE staff
         SET role_id    = $2,
             hire_date  = $3,
             leave_date = $4
       WHERE id = $1
      RETURNING id;
      `,
      [dto.id, dto.roleId, dto.hireDate, dto.leaveDate],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating staff:", error);
    throw error;
  } finally {
    client.release();
  }
}
