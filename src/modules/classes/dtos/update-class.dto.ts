import { ScheduleDTO } from "../../schedules";

export interface UpdateClassDTO {
  id: string;
  name?: string;
  gradeId?: string;
  teacherId?: string;
  capacity?: number;
  schedules?: ScheduleDTO[];
}
