import { Role } from "../../roles";
import { Person } from "../../types";

export interface Staff extends Person {
  staffId: number;
  role: Role;
  hireDate: Date;
  leaveDate?: Date;
}

export interface StaffSummary {
  id: number;
  name: string;
}
