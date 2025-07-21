import React, { useCallback } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Typography
} from '@mui/material';
import type { SortOption } from '../../../types/repo';
import type { SearchParams } from '../../../services/githubApi';

interface TableHeaderProps {
  searchParams: SearchParams; // Параметры поиска
  onSortChange: (sortField: SortOption) => void; // Обработчик изменения сортировки
}

/**
 * Компонент заголовка таблицы
 */
const TableHeader: React.FC<TableHeaderProps> = ({
  searchParams,
  onSortChange
}) => {
  /**
   * Обработчики сортировки для каждого поля
   */
  const handleForksSort = useCallback(
    () => onSortChange('forks'),
    [onSortChange]
  );

  const handleStarsSort = useCallback(
    () => onSortChange('stars'),
    [onSortChange]
  );

  const handleUpdatedSort = useCallback(
    () => onSortChange('updated'),
    [onSortChange]
  );

  return (
    <TableHead>
      <TableRow>
        {/* Название - без сортировки */}
        <TableCell>
          <Typography variant="subtitle2" component="span">
            Название
          </Typography>
        </TableCell>

        {/* Язык - без сортировки */}
        <TableCell>
          <Typography variant="subtitle2" component="span">
            Язык
          </Typography>
        </TableCell>

        {/* Число форков - с сортировкой */}
        <TableCell align="center">
          <TableSortLabel
            active={searchParams.sort === 'forks'}
            direction={
              searchParams.sort === 'forks' ? searchParams.order : 'desc'
            }
            onClick={handleForksSort}
          >
            Число форков
          </TableSortLabel>
        </TableCell>

        {/* Число звезд - с сортировкой */}
        <TableCell align="center">
          <TableSortLabel
            active={searchParams.sort === 'stars'}
            direction={
              searchParams.sort === 'stars' ? searchParams.order : 'desc'
            }
            onClick={handleStarsSort}
          >
            Число звезд
          </TableSortLabel>
        </TableCell>

        {/* Дата обновления - с сортировкой */}
        <TableCell align="center">
          <TableSortLabel
            active={searchParams.sort === 'updated'}
            direction={
              searchParams.sort === 'updated' ? searchParams.order : 'desc'
            }
            onClick={handleUpdatedSort}
          >
            Дата обновления
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default React.memo(TableHeader);
