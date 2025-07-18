import type {
  SearchRepositoriesResponse,
  Repository,
  SortOption,
  SortDirection
} from '../types/repo';
import {
  GITHUB_API_URL,
  DEFAULT_PER_PAGE,
  DEFAULT_RETRY_INTERVAL
} from '@/configs/constants';
import { fetcher } from './fetcher';

export interface SearchParams {
  query: string; // Поисковый запрос
  sort?: SortOption; // Параметр сортировки
  order?: SortDirection; // Направление сортировки
  page?: number; // Номер страницы
  per_page?: number; // Количество элементов на странице
}

/**
 * Создает ключ для SWR кэша на основе параметров поиска
 */
export const createSearchKey = (params: SearchParams): string => {
  const {
    query,
    sort = 'stars',
    order = 'desc',
    page = 1,
    per_page = DEFAULT_PER_PAGE
  } = params;

  if (!query.trim()) {
    return '';
  }

  const searchParams = new URLSearchParams({
    q: query.trim(),
    sort,
    order,
    page: page.toString(),
    per_page: per_page.toString()
  });

  return `${GITHUB_API_URL}/search/repositories?${searchParams.toString()}`;
};

/**
 * Создает ключ для получения информации о конкретном репозитории
 */
export const createRepositoryKey = (owner: string, repo: string): string => {
  return `${GITHUB_API_URL}/repos/${owner}/${repo}`;
};

/**
 * Поиск репозиториев GitHub
 * @param params Параметры поиска
 * @throws {ApiError} При ошибке API
 * @returns Promise с результатами поиска
 */
export const searchRepositories = async (
  params: SearchParams
): Promise<SearchRepositoriesResponse> => {
  const url = createSearchKey(params);
  if (!url) {
    throw new Error('Требуется поисковый запрос');
  }

  return fetcher<SearchRepositoriesResponse>(url);
};

/**
 * Получение информации о конкретном репозитории
 */
export const getRepository = async (
  owner: string,
  repo: string
): Promise<Repository> => {
  const url = createRepositoryKey(owner, repo);

  return fetcher<Repository>(url);
};

/**
 * Дефолтная конфигурация SWR
 * Специфичные настройки (dedupingInterval) задаются в хуках
 */
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: DEFAULT_RETRY_INTERVAL // 2 секунды между попытками
};
