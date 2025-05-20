export interface CreateAssignmentDTO {
  name: string;
  classId: string;
  description?: string;
  dueDate: Date;
}
