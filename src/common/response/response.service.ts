import { Injectable } from '@nestjs/common';

// Define your response interfaces
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  statusCode: number;
  timestamp: string;
}

export interface PaginationMeta {
  page?: number;
  limit?: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
}

@Injectable()
export class ResponseService {
  success<T>(
    data: T,
    message: string = 'Success',
    meta?: Record<string, unknown>,
  ): SuccessResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }

  error(
    message: string,
    errors?: unknown,
    statusCode: number = 400,
  ): ErrorResponse {
    return {
      success: false,
      message,
      errors,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  paginate<T>(
    data: T[],
    meta: PaginationMeta,
    message: string = 'Success',
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }
}
