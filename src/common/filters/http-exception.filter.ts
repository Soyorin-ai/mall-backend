import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto';
import { ErrorCode, ERROR_MESSAGES } from '../constants/error-code.constants';

/**
 * 全局异常过滤器
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES[ErrorCode.INTERNAL_SERVER_ERROR];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const exceptionMessage = exception.message;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const errorObj = exceptionResponse as any;
        message = errorObj.message || exceptionMessage;
        code = errorObj.code || status;
      } else {
        message = exceptionMessage;
      }

      code = status;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
      );
    } else {
      message = ERROR_MESSAGES[ErrorCode.INTERNAL_SERVER_ERROR];
      this.logger.error(
        `${request.method} ${request.url}`,
        exception,
      );
    }

    const errorResponse = ResponseDto.error(code, message);

    this.logger.warn(
      `${request.method} ${request.url} - ${status} - ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}
