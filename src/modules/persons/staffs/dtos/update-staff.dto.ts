export interface UpdateStaffDTO {
  id: string;
  staffId?: string;
  name?: string;
  preferredName?: string;
  gender?: string;
  dateOfBirth?: Date;
  notes?: string;
  phone?: string;
  email?: string;
  roleId?: string;
  hireDate?: Date;
  leaveDate?: Date;
  active?: boolean;
}
