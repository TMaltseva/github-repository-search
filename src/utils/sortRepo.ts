import type { Repository, SortOption, SortDirection } from '../types/repo';

/**
 * Сортирует массив репозиториев по заданному полю и направлению
 *
 * @param items - Массив репозиториев
 * @param sortField - Поле для сортировки
 * @param sortDirection - Направление сортировки
 * @returns Отсортированный массив
 */
export const sortRepositories = (
  items: Repository[],
  sortField: SortOption,
  sortDirection: SortDirection
): Repository[] => {
  const sortedItems = [...items];

  if (sortField === 'updated') {
    return sortedItems.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();

      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  if (sortField === 'stars') {
    return sortedItems.sort((a, b) => {
      return sortDirection === 'asc'
        ? a.stargazers_count - b.stargazers_count
        : b.stargazers_count - a.stargazers_count;
    });
  }

  if (sortField === 'forks') {
    return sortedItems.sort((a, b) => {
      return sortDirection === 'asc'
        ? a.forks_count - b.forks_count
        : b.forks_count - a.forks_count;
    });
  }

  return sortedItems;
};
