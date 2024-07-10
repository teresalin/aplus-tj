export interface CreateStaffDTO {
  name: string;
  gender: string;
  dateOfBirth: Date;
  notes?: string;
  phone: string;
  email: string;
  roleId: number;
  joinDate: Date;
  leaveDate?: Date;
}
