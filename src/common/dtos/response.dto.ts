/**
 * 统一响应格式
 */
export class ResponseDto<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;

  static success<T>(data: T, message: string = 'success'): ResponseDto<T> {
    return {
      code: 200,
      message,
      data,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }

  static error(code: number, message: string, data: T = null): ResponseDto<T> {
    return {
      code,
      message,
      data,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
}
