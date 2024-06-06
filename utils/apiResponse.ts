export interface ApiResponse<T = any> {
  status: string;
  message: string;
  result?: T;
}
