import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { SearchParams } from '../../../services/githubApi';
import {
  MAX_API_RESULTS,
  MAX_PAGES_WITH_DEFAULT_PER_PAGE
} from '../../../configs/constants';

import styles from '../RepositoryTable.module.scss';

interface TablePaginationProps {
  searchParams: SearchParams; // Параметры поиска (включают page и per_page)
  totalCount: number; // Общее количество результатов от API
  totalPages: number; // Общее количество страниц
  onPageChange: (page: number) => void; // Обработчик изменения страницы
  onPerPageChange: (event: SelectChangeEvent<number>) => void; // Обработчик изменения количества элементов на странице
  isLoading: boolean; // Показывать ли состояние загрузки
}

/**
 * Компонент серверной пагинации для таблицы
 */
const TablePagination: React.FC<TablePaginationProps> = ({
  searchParams,
  totalCount,
  totalPages,
  onPageChange,
  onPerPageChange,
  isLoading
}) => {
  // Вычисляет диапазон отображаемых записей для текущей страницы
  const currentStart = (searchParams.page! - 1) * searchParams.per_page! + 1;
  const currentEnd = Math.min(
    searchParams.page! * searchParams.per_page!,
    totalCount
  );

  /**
   * Обработчик перехода на предыдущую страницу
   * Отправляет новый запрос к API с параметром page-1
   */
  const handlePrevPage = useCallback(() => {
    if (searchParams.page! > 1) {
      onPageChange(searchParams.page! - 1);
    }
  }, [searchParams.page, onPageChange]);

  /**
   * Обработчик перехода на следующую страницу
   * Учитывает ограничения API:
   * - Максимум 1000 результатов (MAX_API_RESULTS)
   * - Максимум 100 страниц при per_page=10 (MAX_PAGES_WITH_DEFAULT_PER_PAGE)
   */
  const handleNextPage = useCallback(() => {
    if (
      searchParams.page! < Math.min(totalPages, MAX_PAGES_WITH_DEFAULT_PER_PAGE)
    ) {
      onPageChange(searchParams.page! + 1);
    }
  }, [searchParams.page, totalPages, onPageChange]);

  const canGoPrev = searchParams.page! > 1;
  const canGoNext =
    searchParams.page! < Math.min(totalPages, MAX_PAGES_WITH_DEFAULT_PER_PAGE);

  return (
    <Box className={styles.paginationContainer}>
      <Box className={styles.paginationInfo}>
        <Typography variant="body2" className={styles.paginationText}>
          Rows per page:
        </Typography>

        <FormControl size="small" className={styles.perPageSelect}>
          <Select
            value={searchParams.per_page}
            onChange={onPerPageChange} // При изменении сбрасывается на page=1
            variant="outlined"
            disabled={isLoading}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" className={styles.paginationText}>
          {`${currentStart}-${currentEnd} of ${Math.min(
            totalCount,
            MAX_API_RESULTS // Максимум 1000
          )}`}
        </Typography>
      </Box>

      <Box className={styles.paginationControls}>
        <IconButton
          onClick={handlePrevPage}
          disabled={!canGoPrev || isLoading}
          size="small"
          className={styles.paginationButton}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={handleNextPage}
          disabled={!canGoNext || isLoading}
          size="small"
          className={styles.paginationButton}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default React.memo(TablePagination);
