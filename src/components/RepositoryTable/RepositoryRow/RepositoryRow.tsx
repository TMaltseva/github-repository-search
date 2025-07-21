import React, { useCallback } from 'react';
import { TableRow, TableCell, Typography, Chip, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { formatDate, formatNumber } from '../../../utils/helpers';
import type { Repository } from '../../../types/repo';

import styles from '../RepositoryTable.module.scss';

interface RepositoryRowProps {
  repository: Repository;
  onClick: (repository: Repository) => void; // Обработчик клика по строке
}

/**
 * Компонент строки таблицы с информацией о репозитории
 */
const RepositoryRow: React.FC<RepositoryRowProps> = ({
  repository,
  onClick
}) => {
  const handleClick = useCallback(() => {
    onClick(repository);
  }, [onClick, repository]);

  return (
    <TableRow
      hover
      className={styles.tableRow}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Название репозитория */}
      <TableCell>
        <Typography variant="body2" className={styles.repoName}>
          {repository.name}
        </Typography>
      </TableCell>

      {/* Язык программирования */}
      <TableCell>
        {repository.language && (
          <Chip
            label={repository.language}
            size="small"
            variant="outlined"
            className={styles.languageChip}
          />
        )}
      </TableCell>

      {/* Количество форков */}
      <TableCell align="center">
        <Typography variant="body2">
          {formatNumber(repository.forks_count)}
        </Typography>
      </TableCell>

      {/* Количество звезд */}
      <TableCell align="center">
        <Box className={styles.starsCell}>
          <StarIcon className={styles.starIcon} />
          <Typography variant="body2">
            {formatNumber(repository.stargazers_count)}
          </Typography>
        </Box>
      </TableCell>

      {/* Дата последнего обновления */}
      <TableCell align="center">
        <Typography variant="body2">
          {formatDate(repository.updated_at)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(RepositoryRow);
