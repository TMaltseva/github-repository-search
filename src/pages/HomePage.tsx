import React from 'react';
import { Box, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import styles from './HomePage.module.scss';

/**
 * Главная страница приложения
 */
const HomePage: React.FC = () => {
  return (
    <Box className={styles.homePage}>
      {/* Хедер */}
      <Box className={styles.heroSection}>
        <Box className={styles.content}>
          {/* Инпут */}
          <SearchBar placeholder="Введите поисковый запрос" autoFocus={true} />
        </Box>
      </Box>

      {/* Основной контент */}
      <Box className={styles.container}>
        <Box className={styles.headerContent}>
          <Typography variant="h3" component="h1" className={styles.title}>
            Добро пожаловать
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
