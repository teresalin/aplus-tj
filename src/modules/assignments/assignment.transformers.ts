import { Assignment } from "./types";
import { CreateAssignmentDTO, UpdateAssignmentDTO } from "./dtos";

export function assignmentToUpdateAssignmentDTO(
  entity: Assignment
): UpdateAssignmentDTO {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    classId: entity.class.id,
    dueDate: entity.dueDate,
  };
}

export function assignmentToCreateAssignmentDTO(
  entity: Assignment
): CreateAssignmentDTO {
  return {
    name: entity.name,
    classId: entity.class?.id,
    description: entity.description,
    dueDate: entity.dueDate,
  };
}
