export interface ApiErrorResponse {
  success: false;
  message: string;
  data?: string;
  errorCode?: string;
  timestamp: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
  timestamp: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;