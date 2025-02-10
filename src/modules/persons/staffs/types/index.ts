import { Role } from "../../roles";
import { Person } from "../../types";

export interface Staff extends Person {
  id: number;
  role: Role;
  joinDate: Date;
  leaveDate?: Date;
}

export interface StaffSummary {
  id: number;
  name: string;
}
