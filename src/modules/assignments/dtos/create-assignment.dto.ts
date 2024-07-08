export interface CreateAssignmentDTO {
  name: string;
  classId: number;
  description?: string;
  dueDate: Date;
}
