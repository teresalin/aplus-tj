import { CreateStaffDTO, UpdateStaffDTO } from "./dtos";
import { getDBClient } from "../../../../lib/db-connector";
import { mapRowToStaff } from "./staff.mapper";
import { Staff } from "./types";
import { UniqueConstraintError } from "../../../../utils/CustomError";

export async function findAllStaffs(): Promise<Staff[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT
        person.id,
        person.name,
        person.preferred_name,
        person.gender,
        person.phone,
        person.email,
        person.date_of_birth::timestamp at time zone 'UTC' as date_of_birth,
        person.notes,
        person.active,
        staff.staff_id,
        staff.hire_date::timestamp at time zone 'UTC' as hire_date,
        staff.leave_date::timestamp at time zone 'UTC' as leave_date
      FROM
        staff
      JOIN
        person ON staff.id = person.id;
      `
    );
    return rows.map(mapRowToStaff);
  } catch (error) {
    console.error("Error fetching staffs from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findStaffById(staffId: number): Promise<Staff | null> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT 
        person.id,
        person.name,
        person.gender,
        person.phone,
        person.email,
        person.date_of_birth::timestamp at time zone 'UTC' as date_of_birth,
        person.notes,
        person.active,
        staff.staff_id,
        staff.hire_date::timestamp at time zone 'UTC' as join_date, 
        staff.leave_date::timestamp at time zone 'UTC' as leave_date, 
        staff_role.id AS role_id,
        staff_role.name AS role_name
      FROM staff
      INNER JOIN person ON staff.id = person.id
      INNER JOIN staff_role ON staff.role_id = staff_role.id
      WHERE staff.id = $1;
      `,
      [staffId]
    );
    return rows.length ? mapRowToStaff(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving staff from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createStaff(dto: CreateStaffDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const insertPersonQuery = {
      text: `
        INSERT INTO person(name, gender, phone, email, date_of_birth, notes, active, created, updated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id;
      `,
      values: [
        dto.name,
        dto.gender,
        dto.phone,
        dto.email,
        dto.dateOfBirth,
        dto.notes,
        "t",
      ],
    };
    const result = await client.query(insertPersonQuery);
    const personId = result.rows[0].id;

    const insertStaffQuery = {
      text: `
        INSERT INTO staff(id, role_id, join_date, leave_date, created, updated) 
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id;
      `,
      values: [personId, dto.roleId, dto.joinDate, dto.leaveDate],
    };
    await client.query(insertStaffQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A staff with the same name, phone, and date of birth already exists."
      );
    } else {
      console.error("Error creating staff in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function updateStaff(dto: UpdateStaffDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const updatePersonQuery = {
      text: `
        UPDATE person
        SET name = $1, gender = $2, phone = $3, email = $4, date_of_birth = $5, notes = $6, updated = NOW()
        WHERE id = $7
        RETURNING id;
      `,
      values: [
        dto.name,
        dto.gender,
        dto.phone,
        dto.email,
        dto.dateOfBirth,
        dto.notes,
        dto.id,
      ],
    };

    const result = await client.query(updatePersonQuery);
    const personId = result.rows[0].id;

    const updateStaffQuery = {
      text: `
        UPDATE staff
        SET role_id = $1, join_date = $2, leave_date = $3, updated = NOW()
        WHERE id = $4
        RETURNING id;
      `,
      values: [dto.roleId, dto.joinDate, dto.leaveDate, personId],
    };
    await client.query(updateStaffQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A staff with the same name, phone, and date of birth already exists."
      );
    } else {
      console.error("Error updating staff in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}
