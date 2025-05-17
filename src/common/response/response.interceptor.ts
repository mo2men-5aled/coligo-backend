import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse, ControllerResponse } from './response.interfaces';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data): SuccessResponse<T> => {
        // More robust type guard
        const isStructuredResponse = (
          data: unknown,
        ): data is ControllerResponse<T> => {
          if (typeof data !== 'object' || data === null) return false;

          const controllerResponse = data as Partial<ControllerResponse<T>>;
          return (
            'result' in controllerResponse ||
            'message' in controllerResponse ||
            'meta' in controllerResponse
          );
        };

        const structured = isStructuredResponse(data) ? data : null;

        return {
          success: true,
          message: structured?.message ?? 'Success',
          data: structured?.result ?? data,
          meta: structured?.meta ?? {},
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
