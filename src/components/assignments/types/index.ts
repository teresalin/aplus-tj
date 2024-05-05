import { Class } from "../../classes/types";

export interface Assignment {
  id: number;
  classInfo: Partial<Class>;
  name: string;
  description?: string;
  dueDate: Date;
  created: Date;
}
