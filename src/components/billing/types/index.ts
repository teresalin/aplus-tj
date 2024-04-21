export interface Billing {
  id: number;
  studentId: number;
  studentName: string;
  billingDate: Date;
  description: string;
  amount: number;
  paymentMethod: string;
  invoiceNumber: string;
  paid: boolean;
  created: Date;
}
