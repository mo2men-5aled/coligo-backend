import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ValidationError {
  property: string;
  constraints: Record<string, string>;
}

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  errors?: ValidationError[];
}

interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  errors?: ValidationError[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: ErrorResponse = {
      success: false,
      message: this.getErrorMessage(exceptionResponse),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (this.isValidationErrorResponse(exceptionResponse)) {
      errorResponse.errors = exceptionResponse.errors;
    }

    response.status(status).json(errorResponse);
  }

  private isValidationErrorResponse(
    response: string | object,
  ): response is { errors: ValidationError[] } {
    return (
      typeof response === 'object' &&
      response !== null &&
      'errors' in response &&
      Array.isArray(response.errors)
    );
  }

  private getErrorMessage(response: string | ExceptionResponse): string {
    if (typeof response === 'string') {
      return response;
    }

    if (Array.isArray(response.message)) {
      return response.message[0];
    }

    if (typeof response.message === 'string') {
      return response.message;
    }

    if (typeof response === 'object' && response.error) {
      return response.error;
    }

    return 'An error occurred';
  }
}
