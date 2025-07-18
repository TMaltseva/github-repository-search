// Константы API
export const GITHUB_API_URL = 'https://api.github.com';
export const DEFAULT_PER_PAGE = 10;
export const MAX_API_RESULTS = 1000; // Ограничение API до 1000 результатов
export const MAX_PAGES_WITH_DEFAULT_PER_PAGE = Math.floor(
  MAX_API_RESULTS / DEFAULT_PER_PAGE
);

export const PER_PAGE_OPTIONS = [10, 25, 50] as const; // Варианты пагинации

export const ERROR_MESSAGES = {
  RATE_LIMIT: 'Превышен rate limit',
  REQUEST_FAILED: (status: number) => `Ошибка запроса: ${status}`,
  UNKNOWN: 'Неизвестная ошибка'
};
