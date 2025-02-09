export interface Person {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes?: string;
  active: boolean;
}
