import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../../components/SearchBar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()]
}));

const renderSearchBar = (props = {}) => {
  return render(
    <BrowserRouter>
      <SearchBar {...props} />
    </BrowserRouter>
  );
};

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('отображает поле ввода с дефолтным плейсхолдером', () => {
    renderSearchBar();

    expect(
      screen.getByPlaceholderText('Введите поисковый запрос')
    ).toBeInTheDocument();
  });

  it('отображает поле ввода с кастомным плейсхолдером', () => {
    renderSearchBar({ placeholder: 'Поиск репозиториев' });

    expect(
      screen.getByPlaceholderText('Поиск репозиториев')
    ).toBeInTheDocument();
  });

  it('кнопка поиска отключена при пустом запросе', () => {
    renderSearchBar();

    const searchButton = screen.getByRole('button', { name: /искать/i });
    expect(searchButton).toBeDisabled();
  });

  it('кнопка поиска активна при непустом запросе', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /искать/i });

    await user.type(input, 'react');

    expect(searchButton).not.toBeDisabled();
  });

  it('выполняет поиск при клике на кнопку', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /искать/i });

    await user.type(input, 'react');
    await user.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/search?q=react&sort=stars&order=desc&page=1&per_page=10'
    );
  });

  it('выполняет поиск при нажатии Enter', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');

    await user.type(input, 'vue');
    await user.keyboard('{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith(
      '/search?q=vue&sort=stars&order=desc&page=1&per_page=10'
    );
  });

  it('отображает кнопку очистки при вводе текста', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');

    await user.type(input, 'angular');

    expect(screen.getByLabelText(/очистить поиск/i)).toBeInTheDocument();
  });

  it('очищает поле при клике на кнопку очистки', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox') as HTMLInputElement;

    await user.type(input, 'angular');

    const clearButton = screen.getByLabelText(/очистить поиск/i);
    await user.click(clearButton);

    expect(input.value).toBe('');
  });

  it('не выполняет поиск с пустым запросом', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');

    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('применяет autoFocus при передаче пропа', () => {
    renderSearchBar({ autoFocus: true });

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('скрывает кнопку очистки при пустом поле', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    await user.clear(input);

    expect(screen.queryByLabelText(/очистить поиск/i)).not.toBeInTheDocument();
  });

  it('триммит пробелы в поисковом запросе', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('textbox');
    await user.type(input, '  react  ');
    await user.keyboard('{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith(
      '/search?q=react&sort=stars&order=desc&page=1&per_page=10'
    );
  });
});
