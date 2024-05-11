import { Role } from "../../../../pages/api/persons/staffs/roles";
import { Person } from "../../types";

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
