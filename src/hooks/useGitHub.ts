import useSWR from 'swr';
import type { SearchRepositoriesResponse, Repository } from '../types/repo';
import {
  createSearchKey,
  createRepositoryKey,
  type SearchParams
} from '../services/githubApi';

/**
 * Хук для поиска репозиториев с SWR
 */
export const useSearchRepo = (params: SearchParams) => {
  const key = createSearchKey(params);

  const { data, error, isLoading, mutate } = useSWR<SearchRepositoriesResponse>(
    key || null, // null если нет ключа (пустой query)
    {
      dedupingInterval: 30000 // 30 секунд
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    isValidating: !!key && isLoading
  };
};

/**
 * Хук для получения информации о конкретном репозитории
 */
export const useRepo = (owner: string, repo: string) => {
  const key = owner && repo ? createRepositoryKey(owner, repo) : null;

  const { data, error, isLoading, mutate } = useSWR<Repository>(key, {
    dedupingInterval: 60000 // 1 минута
  });

  return {
    data,
    error,
    isLoading,
    mutate
  };
};
