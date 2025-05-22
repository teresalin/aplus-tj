export interface CreateStaffDTO {
  name: string;
  preferredName?: string;
  gender: string;
  dateOfBirth: Date;
  notes?: string;
  phone: string;
  email: string;
  roleId: number;
  hireDate: Date;
  leaveDate?: Date;
}
