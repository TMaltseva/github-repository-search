import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { SWRConfig } from 'swr';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import RepositoryDetails from './pages/RepositoryDetails';
import { swrConfig } from './services/githubApi';

/**
 * Главный компонент приложения
 */
const App: React.FC = () => {
  return (
    <>
      <SWRConfig value={swrConfig}>
        <Router>
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={<HomePage />} />

            {/* Страница результатов поиска */}
            <Route path="/search" element={<SearchResults />}>
              {/* Вложенный роут для деталей репозитория */}
              <Route path=":owner/:repo" element={<RepositoryDetails />} />
            </Route>

            {/* Редирект для несуществующих страниц */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SWRConfig>
    </>
  );
};

export default App;
