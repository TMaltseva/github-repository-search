import React, { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
  CircularProgress,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { sortRepositories } from '../../utils/sortRepo';
import { useSearchRepo } from '../../hooks/useGitHub';
import TableHeader from './TableHeader';
import RepositoryRow from './RepositoryRow';
import TablePagination from './TablePagination';
import type { Repository, SortOption, SortDirection } from '../../types/repo';
import type { SearchParams } from '../../services/githubApi';
import { MAX_API_RESULTS } from '../../configs/constants';

import styles from './RepositoryTable.module.scss';

interface RepositoryTableProps {
  searchParams: SearchParams;
}

/**
 * Компонент таблицы репозиториев с клиентской досортировкой
 */
const RepositoryTable: React.FC<RepositoryTableProps> = ({ searchParams }) => {
  const navigate = useNavigate();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  const { data: searchResult, error, isLoading } = useSearchRepo(searchParams);

  /**
   * Сортировка данных
   * GitHub Search API не корректно сортирует по дате обновления и дате пуша,
   * поэтому досортируем на клиенте для гарантированно порядка
   */
  const sortedItems = useMemo(() => {
    if (!searchResult?.items) return [];

    return sortRepositories(
      searchResult.items,
      searchParams.sort || 'stars',
      searchParams.order || 'desc'
    );
  }, [searchResult?.items, searchParams.sort, searchParams.order]);

  /**
   * Обработчик клика по строке
   */
  const handleRowClick = useCallback(
    (repository: Repository) => {
      const { owner, name } = repository;
      navigate(`/search/${owner.login}/${name}?${urlSearchParams.toString()}`);
    },
    [navigate, urlSearchParams]
  );

  /**
   * Обработчик изменения сортировки
   */
  const handleSortChange = useCallback(
    (sortField: SortOption) => {
      const currentSort = urlSearchParams.get('sort') || 'stars';
      const currentOrder = urlSearchParams.get('order') || 'desc';

      const isCurrentSort = currentSort === sortField;
      const newOrder: SortDirection =
        isCurrentSort && currentOrder === 'desc' ? 'asc' : 'desc';

      const newParams = new URLSearchParams(urlSearchParams);
      newParams.set('sort', sortField);
      newParams.set('order', newOrder);
      newParams.set('page', '1');
      setUrlSearchParams(newParams);
    },
    [urlSearchParams, setUrlSearchParams]
  );

  /**
   * Обработчик изменения страницы
   */
  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(urlSearchParams);
      newParams.set('page', page.toString());
      setUrlSearchParams(newParams);
    },
    [urlSearchParams, setUrlSearchParams]
  );

  /**
   * Обработчик изменения количества элементов на странице
   */
  const handlePerPageChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      const newParams = new URLSearchParams(urlSearchParams);
      newParams.set('per_page', event.target.value.toString());
      newParams.set('page', '1');
      setUrlSearchParams(newParams);
    },
    [urlSearchParams, setUrlSearchParams]
  );

  const totalPages = useMemo(() => {
    if (!searchResult) return 0;

    const maxResults = MAX_API_RESULTS; // Лимит API
    const actualTotal = Math.min(searchResult.total_count, maxResults);

    return Math.ceil(actualTotal / searchParams.per_page!);
  }, [searchResult, searchParams.per_page]);

  if (!searchParams.query) {
    return null;
  }

  if (error) {
    return (
      <Box className={styles.container}>
        <Alert severity="error">
          Произошла ошибка при загрузке данных. Попробуйте еще раз.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box className={styles.container}>
        <Box className={styles.loadingContainer}>
          <CircularProgress size={48} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Поиск репозиториев...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (searchResult && searchResult.items.length === 0) {
    return (
      <Box className={styles.container}>
        <Alert severity="info">
          По вашему запросу ничего не найдено. Попробуйте изменить поисковый
          запрос.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Результаты поиска
      </Typography>

      <Paper className={styles.tableContainer}>
        <div className={styles.scrollableTable}>
          <TableContainer>
            <Table stickyHeader>
              <TableHeader
                searchParams={searchParams}
                onSortChange={handleSortChange}
              />
              <TableBody>
                {sortedItems.map((repository: Repository) => (
                  <RepositoryRow
                    key={repository.id}
                    repository={repository}
                    onClick={handleRowClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <TablePagination
          searchParams={searchParams}
          totalCount={searchResult?.total_count || 0}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          isLoading={isLoading}
        />
      </Paper>
    </Box>
  );
};

export default React.memo(RepositoryTable);
