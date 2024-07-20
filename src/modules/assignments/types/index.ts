import { ClassSummary } from "../../classes";

export interface Assignment {
  id: number;
  name: string;
  description?: string;
  class: ClassSummary;
  dueDate: Date;
}
