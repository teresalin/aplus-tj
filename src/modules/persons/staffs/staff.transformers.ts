import { Staff } from "./types";
import { UpdateStaffDTO } from "./dtos";

export function staffToUpdateStaffDTO(staff: Staff): UpdateStaffDTO {
  return {
    id: staff.id,
    personId: staff.personId,
    name: staff.name,
    gender: staff.gender,
    dateOfBirth: staff.dateOfBirth,
    notes: staff.notes,
    phone: staff.phone,
    email: staff.email,
    roleId: staff.role.id,
    joinDate: staff.joinDate,
    leaveDate: staff.leaveDate,
    active: staff.active,
  };
}
