import { Person } from "../../types";
import { Role } from "../../../../pages/api/persons/staffs/roles";

export interface Staff extends Person {
  staffId: number;
  role: Role;
  joinDate: Date;
  leaveDate: Date;
}

export interface StaffSummary {
  staffId: number;
  name: string;
}
