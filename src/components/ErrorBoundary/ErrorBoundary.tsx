import React, { Component, ErrorInfo } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import styles from './ErrorBoundary.module.scss';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary для перехвата критических ошибок компонентов
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }

    // В продакшен коде можно отправить ошибку в систему мониторинга или администратору
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined
    });
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;

        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.handleReset}
          />
        );
      }

      return (
        <Box className={styles.errorContainer}>
          <Alert severity="error" className={styles.errorAlert}>
            <Typography variant="h6" component="h2" gutterBottom>
              Что-то пошло не так
            </Typography>

            {this.state.error && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {this.state.error.message}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              sx={{ mt: 1 }}
            >
              Попробовать снова
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
