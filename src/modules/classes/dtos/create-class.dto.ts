import { ScheduleDTO } from "../../schedules";

export interface CreateClassDTO {
  name: string;
  gradeId: string;
  teacherId: string;
  capacity: number;
  schedules: ScheduleDTO[];
}
