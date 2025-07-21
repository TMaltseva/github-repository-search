import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  placeholder?: string; // Плейсхолдер для поля ввода
  autoFocus?: boolean; // Автофокус
}

/**
 * Компонент строки поиска
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Введите поисковый запрос',
  autoFocus = false
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  /**
   * Обработчик изменения текста в поле ввода
   */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    []
  );

  /**
   * Обработчик очистки поля ввода
   */
  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  /**
   * Выполнение поиска
   */
  const performSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim();

      if (!trimmedQuery) {
        return;
      }

      const newParams = new URLSearchParams();
      newParams.set('q', trimmedQuery);
      newParams.set('sort', 'stars');
      newParams.set('order', 'desc');
      newParams.set('page', '1');
      newParams.set('per_page', '10');

      navigate(`/search?${newParams.toString()}`);
    },
    [navigate]
  );

  /**
   * Обработчик поиска
   */
  const handleSearch = useCallback(() => {
    performSearch(query);
  }, [performSearch, query]);

  /**
   * Обработчик Enter
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        performSearch(query);
      }
    },
    [performSearch, query]
  );

  return (
    <Box className={styles.searchContainer}>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        variant="outlined"
        className={styles.searchInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={styles.searchIcon} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                aria-label="очистить поиск"
                onClick={handleClear}
                edge="end"
                size="small"
                className={styles.clearButton}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
          className: styles.inputRoot
        }}
      />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSearch}
        disabled={!query.trim()}
        className={styles.searchButton}
        startIcon={<SearchIcon />}
      >
        Искать
      </Button>
    </Box>
  );
};

export default React.memo(SearchBar);
