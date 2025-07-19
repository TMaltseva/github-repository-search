import type { SortOption, SortDirection } from '../types/repo';

/**
 * Проверяет, является ли строка валидным значением сортировки
 */
export const isValidSortOption = (
  value: string | null
): value is SortOption => {
  return value === 'stars' || value === 'forks' || value === 'updated';
};

/**
 * Проверяет, является ли строка валидным направлением сортировки (возрастание/убывание)
 */
export const isValidSortDirection = (
  value: string | null
): value is SortDirection => {
  return value === 'asc' || value === 'desc';
};

/**
 * Парсит строку в число с fallback-значением
 */
export const parseIntSafely = (
  value: string | null,
  fallback: number
): number => {
  if (!value) return fallback;
  const parsed = Number(value);

  return isNaN(parsed) ? fallback : Math.max(1, parsed);
};

/**
 * Форматирует дату в вид dd.mm.yyyy
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Форматирует число с разделителями тысяч
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ru-RU');
};
