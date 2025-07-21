import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
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
 * Компонент отображения деталей
 */
const RepositoryDetails: React.FC = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [showAllTopics, setShowAllTopics] = useState(false);

  const {
    data: repository,
    error,
    isLoading
  } = useRepo(owner || '', repo || '');

  const handleShowAllTopics = useCallback(() => {
    setShowAllTopics(true);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Box className={styles.loadingContainer}>
          <CircularProgress size={32} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Загрузка...
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Alert severity="error">Ошибка при загрузке репозитория</Alert>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className={styles.container}>
        <Alert severity="info">Репозиторий не найден</Alert>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          {repository.topics && (
            <>
              {(showAllTopics
                ? repository.topics
                : repository.topics.slice(0, 2)
              ).map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  size="small"
                  variant="outlined"
                  className={styles.tag}
                />
              ))}

              {repository.topics.length > 2 && !showAllTopics && (
                <Chip
                  label={`+${repository.topics.length - 2}`}
                  size="small"
                  variant="outlined"
                  className={styles.expandTag}
                  onClick={handleShowAllTopics}
                  clickable
                />
              )}
            </>
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
    </div>
  );
};

export default RepositoryDetails;
