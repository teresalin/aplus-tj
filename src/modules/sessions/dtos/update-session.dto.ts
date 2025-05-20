export interface UpdateSessionDTO {
  id: string;
  classId?: string;
  startTime?: string;
  endTime?: string;
  studentIds?: number[];
}
