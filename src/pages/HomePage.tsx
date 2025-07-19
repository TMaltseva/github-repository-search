import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import SearchBar from '../components/SearchBar';
import styles from './HomePage.module.scss';

/**
 * Главная страница приложения
 */
const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <Box className={styles.header}>
        <Box className={styles.headerContent}>
          <Typography variant="h3" component="h1" className={styles.title}>
            Добро пожаловать
          </Typography>
        </Box>
      </Box>

      {/* Основной контент */}
      <Container maxWidth="md" className={styles.container}>
        <Box className={styles.content}>
          <Paper className={styles.searchSection} elevation={1}>
            <SearchBar
              placeholder="Введите поисковый запрос"
              autoFocus={true}
            />
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
