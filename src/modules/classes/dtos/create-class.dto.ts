import { ScheduleDTO } from "../../schedules";

export interface CreateClassDTO {
  name: string;
  gradeId: number;
  teacherId: number;
  capacity: number;
  schedules: ScheduleDTO[];
}
