export interface Person {
  id: number;
  name: string;
  preferredName: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes?: string;
  active: boolean;
}
