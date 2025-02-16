import { Role } from "../roles";
import { Staff } from "./types";

export function mapRowToStaff(row: any): Staff {
  return {
    id: row.id,
    staffId: row.staff_id,
    name: row.name,
    preferredName: row.preferred_name,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    dateOfBirth: new Date(row.date_of_birth),
    role: { id: row.role_id, name: row.role_name } as Role,
    notes: row.notes,
    active: row.active,
    hireDate: new Date(row.hire_date),
    // In TypeScript, optional properties are typically represented by `undefined`
    // rather than `null`. This aligned with the way TypeScript defines optional
    // parameters in function signatures and object types.
    leaveDate: row.leave_date ? new Date(row.leave_date) : undefined,
  };
}
