export interface CreateSessionDTO {
  classId: number;
  date: Date;
  startTime: string;
  endTime: string;
  studentIds?: number[];
}
