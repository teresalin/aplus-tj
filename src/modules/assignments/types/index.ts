import { ClassSummary } from "../../classes";

export interface Assignment {
  id: string;
  name: string;
  description?: string;
  class: ClassSummary;
  dueDate: Date;
}
