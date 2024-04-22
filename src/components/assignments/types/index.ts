import { Class } from "../../class/types";

export interface Assignment {
  id: number;
  classInfo: Partial<Class>;
  name: string;
  description?: string;
  dueDate: Date;
  created: Date;
}
