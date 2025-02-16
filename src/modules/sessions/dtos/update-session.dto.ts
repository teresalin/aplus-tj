export interface UpdateSessionDTO {
  id: number;
  classId?: number;
  startTime?: string;
  endTime?: string;
  studentIds?: number[];
}
