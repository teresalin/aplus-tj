export interface UpdateStaffDTO {
  id: number;
  staffId: number;
  name?: string;
  gender?: string;
  dateOfBirth?: Date;
  notes?: string;
  phone?: string;
  email?: string;
  roleId?: number;
  joinDate?: Date;
  leaveDate?: Date;
  active?: boolean;
}
