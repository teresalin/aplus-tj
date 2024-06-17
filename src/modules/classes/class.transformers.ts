import { Class } from "./types";
import { UpdateClassDTO } from "./dtos";

export function classToUpdateClassDTO(entity: Class): UpdateClassDTO {
  return {
    id: entity.id,
    name: entity.name,
    gradeId: entity.grade.id,
    teacherId: entity.teacher.staffId,
    capacity: entity.capacity,
    schedules: entity.schedules.map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })),
  };
}
