import React from 'react';
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
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle2" component="span">
            Название
          </Typography>
        </TableCell>

        {/* Язык */}
        <TableCell>
          <Typography variant="subtitle2" component="span">
            Язык
          </Typography>
        </TableCell>

        {/* Число форков */}
        <TableCell align="center">
          <TableSortLabel
            active={searchParams.sort === 'forks'}
            direction={
              searchParams.sort === 'forks' ? searchParams.order : 'desc'
            }
            onClick={() => onSortChange('forks')}
          >
            Число форков
          </TableSortLabel>
        </TableCell>

        {/* Число звезд */}
        <TableCell align="center">
          <TableSortLabel
            active={searchParams.sort === 'stars'}
            direction={
              searchParams.sort === 'stars' ? searchParams.order : 'desc'
            }
            onClick={() => onSortChange('stars')}
          >
            Число звезд
          </TableSortLabel>
        </TableCell>

        {/* Дата обновления */}
        <TableCell align="center">
          <TableSortLabel
            active={searchParams.sort === 'updated'}
            direction={
              searchParams.sort === 'updated' ? searchParams.order : 'desc'
            }
            onClick={() => onSortChange('updated')}
          >
            Дата обновления
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default React.memo(TableHeader);
