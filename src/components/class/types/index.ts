import { Assignment } from "../../assignment/types";
import { Grade } from "../../../../pages/api/grades";
import { Person } from "../../../../pages/api/persons";
import { Schedule } from "../../../../pages/api/classes/[class_id]/schedules";
import { Staff } from "../../../../pages/api/persons/staffs";

export interface Class {
  id: number;
  name: string;
  teacher: Staff;
  grade: Grade;
  schedules: Schedule[];
  capacity: number;
  studentCount?: number;
  activeStudents?: Person[];
  assignments?: Assignment[];
}
