import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Star as StarIcon, Gavel as LicenseIcon } from '@mui/icons-material';
import { useRepo } from '../hooks/useGitHub';
import { formatNumber } from '../utils/helpers';
import styles from './RepositoryDetails.module.scss';

/**
 * Компонент отображения деталей репозитория
 */
const RepositoryDetails: React.FC = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const {
    data: repository,
    error,
    isLoading
  } = useRepo(owner || '', repo || '');

  if (isLoading) {
    return (
      <Paper className={styles.container}>
        <Box className={styles.loadingContainer}>
          <CircularProgress size={32} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Загрузка...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper className={styles.container}>
        <Alert severity="error">Ошибка при загрузке репозитория</Alert>
      </Paper>
    );
  }

  if (!repository) {
    return (
      <Paper className={styles.container}>
        <Alert severity="info">Репозиторий не найден</Alert>
      </Paper>
    );
  }

  return (
    <Paper className={styles.container}>
      <Box className={styles.content}>
        {/* Заголовок */}
        <Box className={styles.header}>
          <Typography variant="h6" component="h2" className={styles.title}>
            {repository.name}
          </Typography>
          <Box className={styles.starsContainer}>
            <StarIcon className={styles.starIcon} />
            <Typography variant="h6" className={styles.starsCount}>
              {formatNumber(repository.stargazers_count)}
            </Typography>
          </Box>
        </Box>

        {/* Теги */}
        <Box className={styles.tagsContainer}>
          {/* Язык */}
          {repository.language && (
            <Chip
              label={repository.language}
              size="small"
              className={styles.languageChip}
            />
          )}

          {/* Топики из API */}
          {repository.topics?.slice(0, 3).map((topic) => (
            <Chip
              key={topic}
              label={topic}
              size="small"
              variant="outlined"
              className={styles.tag}
            />
          ))}

          {/* Если топиков больше 3, показываем еще */}
          {repository.topics && repository.topics.length > 3 && (
            <Chip
              label={`+${repository.topics.length - 3}`}
              size="small"
              variant="outlined"
              className={styles.tag}
            />
          )}
        </Box>

        <Divider className={styles.divider} />

        {/* Лицензия */}
        {repository.license && (
          <Box className={styles.licenseContainer}>
            <LicenseIcon className={styles.licenseIcon} />
            <Typography variant="body2">{repository.license.name}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RepositoryDetails;
