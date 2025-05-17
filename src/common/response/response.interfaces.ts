export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface ControllerResponse<T> {
  message?: string;
  result?: T;
  meta?: Record<string, unknown>;
}
