export interface ApiResponse<T = any> {
  status: "Success" | "Error";
  message: string;
  result?: T;
  error?: {
    code: number;
    message: string;
    details?: string;
  };
}
