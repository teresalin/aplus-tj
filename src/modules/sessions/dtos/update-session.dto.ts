export interface UpdateSessionDTO {
  id: number;
  classId?: number;
  date?: Date;
  startTime?: string;
  endTime?: string;
  studentIds?: number[];
}
