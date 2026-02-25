/**
 * 统一响应格式
 */
export class ResponseDto<T = any> {
  code: number;
  message: string;
  data: T | null;
  timestamp: number;

  static success<T>(data: T, message: string = 'success'): ResponseDto<T> {
    const dto = new ResponseDto<T>();
    dto.code = 200;
    dto.message = message;
    dto.data = data;
    dto.timestamp = Math.floor(Date.now() / 1000);
    return dto;
  }

  static error<T = any>(code: number, message: string, data: T | null = null): ResponseDto<T> {
    const dto = new ResponseDto<T>();
    dto.code = code;
    dto.message = message;
    dto.data = data;
    dto.timestamp = Math.floor(Date.now() / 1000);
    return dto;
  }
}
