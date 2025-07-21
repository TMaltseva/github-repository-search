import React from 'react';
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
  return (
    <TableRow
      hover
      className={styles.tableRow}
      onClick={() => onClick(repository)}
    >
      <TableCell>
        <Typography variant="body2" className={styles.repoName}>
          {repository.name}
        </Typography>
      </TableCell>

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

      <TableCell align="center">
        <Typography variant="body2">
          {formatNumber(repository.forks_count)}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Box className={styles.starsCell}>
          <StarIcon className={styles.starIcon} />
          <Typography variant="body2">
            {formatNumber(repository.stargazers_count)}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">
          {formatDate(repository.updated_at)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(RepositoryRow);
