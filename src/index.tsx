import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import './styles/main.scss';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
