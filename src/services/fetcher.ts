import { createApiError } from './apiErrors';
import { ERROR_MESSAGES } from '@/configs/constants';

/**
 * Функция для выполнения HTTP запросов
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Repository-Search'
  };

  const token = process.env.REACT_APP_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (process.env.NODE_ENV === 'development') {
    console.warn(
      'GITHUB_TOKEN не задан. Rate limit будет ограничен до 60 запросов/час'
    );
  }

  return fetch(url, { headers }).then((response) => {
    if (
      response.status === 403 &&
      response.headers.get('X-RateLimit-Remaining') === '0'
    ) {
      throw createApiError(ERROR_MESSAGES.RATE_LIMIT, 403, {
        rateLimitHeaders: {
          limit: response.headers.get('X-RateLimit-Limit'),
          remaining: response.headers.get('X-RateLimit-Remaining'),
          reset: response.headers.get('X-RateLimit-Reset')
        }
      });
    }

    if (!response.ok) {
      return response
        .json()
        .then((errorData) => {
          throw createApiError(
            ERROR_MESSAGES.REQUEST_FAILED(response.status),
            response.status,
            errorData
          );
        })
        .catch((parseError) => {
          throw createApiError(
            ERROR_MESSAGES.REQUEST_FAILED(response.status),
            response.status,
            {
              message: response.statusText || ERROR_MESSAGES.UNKNOWN,
              parseError: parseError.message
            }
          );
        });
    }

    return response.json();
  });
};
