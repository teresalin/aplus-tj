import { Role } from "../../../roles";
import { Person } from "../../types";

export interface Staff extends Person {
  staffId: string;
  role: Role;
  hireDate: Date;
  leaveDate?: Date;
}

export interface StaffSummary {
  id: string;
  name: string;
}
