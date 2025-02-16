export interface CreateSessionDTO {
  classId: number;
  startTime: string;
  endTime: string;
  studentIds?: number[];
}
