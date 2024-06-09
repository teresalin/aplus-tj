export interface Assignment {
  id: number;
  name: string;
  description?: string;
  className?: string;
  dueDate: Date;
  created: Date;
}
