import React, { useMemo } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

// Material-UI компонент Box
import { Box } from '@mui/material';
import RepositoryTable from '../components/RepositoryTable';
import {
  isValidSortOption,
  isValidSortDirection,
  parseIntSafely
} from '../utils/helpers';
import type { SortOption, SortDirection } from '../types/repo';

import styles from './SearchResults.module.scss';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();

  const searchOptions = useMemo(() => {
    const query = searchParams.get('q') || '';
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    const pageParam = searchParams.get('page');
    const perPageParam = searchParams.get('per_page');

    const sort: SortOption = isValidSortOption(sortParam) ? sortParam : 'stars';
    const order: SortDirection = isValidSortDirection(orderParam)
      ? orderParam
      : 'desc';
    const page = parseIntSafely(pageParam, 1);
    const per_page = parseIntSafely(perPageParam, 10);

    return {
      query,
      sort,
      order,
      page,
      per_page
    };
  }, [searchParams]);

  return (
    <Box className={styles.pageWrapper}>
      {/* Хедер */}
      <Box className={styles.searchHeader}>
        <Box className={styles.searchContainer}>
          <SearchBar placeholder="Введите поисковый запрос" />
        </Box>
      </Box>

      {/* Основной контент */}
      <Box className={styles.content}>
        <Box className={styles.tableSection}>
          <RepositoryTable searchParams={searchOptions} />
        </Box>

        {/* Outlet для отображения деталей репозитория */}
        <Box className={styles.detailsSection}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResults;
