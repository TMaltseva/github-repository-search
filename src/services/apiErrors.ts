import { ApiError, APIErrorResponse } from '@/types/repo';

/**
 * Создает объект ошибки API
 * @param message - Основное сообщение об ошибке
 * @param status - HTTP статус код
 * @param info - Дополнительная информация об ошибке
 */
export const createApiError = (
  message: string,
  status: number,
  info: Partial<APIErrorResponse> = {}
): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.info = {
    message,
    ...info
  };

  return error;
};
