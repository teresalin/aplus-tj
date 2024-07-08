import { ScheduleDTO } from "../../schedules";

export interface UpdateClassDTO {
  id: number;
  name?: string;
  gradeId?: number;
  teacherId?: number;
  capacity?: number;
  schedules?: ScheduleDTO[];
}
