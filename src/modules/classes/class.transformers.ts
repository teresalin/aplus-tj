import { Class } from "./types";
import { CreateClassDTO, UpdateClassDTO } from "./dtos";
import { ScheduleDTO } from "../schedules";

export function classToUpdateClassDTO(entity: Class): UpdateClassDTO {
  return {
    id: entity.id,
    name: entity.name,
    gradeId: entity.grade.id,
    teacherId: entity.teacher.id,
    capacity: entity.capacity,
    schedules: entity.schedules.map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })) as ScheduleDTO[],
  };
}

export function classToCreateClassDTO(entity: Class): CreateClassDTO {
  return {
    name: entity.name,
    gradeId: entity.grade.id,
    teacherId: entity.teacher.id,
    capacity: entity.capacity,
    schedules: entity.schedules.map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })) as ScheduleDTO[],
  };
}
