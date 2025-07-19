/**
 * Интерфейс для информации о владельце репозитория
 */
export interface RepositoryOwner {
  login: string;
  id: number;
  html_url?: string;
}

/**
 * Интерфейс для лицензии репозитория
 */
export interface RepositoryLicense {
  key: string;
  name: string;
}

/**
 * Интерфейс для репозитория GitHub
 */
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: RepositoryOwner;
  license: RepositoryLicense | null;
}

/**
 * Параметры сортировки для поиска
 * @remarks
 * GitHub API поддерживает только эти варианты сортировки
 */
export type SortOption = 'stars' | 'forks' | 'updated';

/**
 * Тип сортировки
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Ответ от GitHub API при поиске репозиториев
 */
export interface SearchRepositoriesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

/**
 * Интерфейс для ответа об ошибке от API
 */
export interface APIErrorResponse {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    message: string;
    field?: string;
    code?: string;
  }>;
  [key: string]: unknown;
}

/**
 * Интерфейс для ошибки с дополнительной информацией
 */
export interface ApiError extends Error {
  status?: number;
  info?: APIErrorResponse;
}
