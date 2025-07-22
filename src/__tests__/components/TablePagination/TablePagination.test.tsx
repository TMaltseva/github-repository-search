import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TablePagination from '../../../components/RepositoryTable/TablePagination';
import type { SearchParams } from '../../../services/githubApi';

const mockOnPageChange = jest.fn();
const mockOnPerPageChange = jest.fn();

const defaultSearchParams: SearchParams = {
  query: 'react',
  sort: 'stars',
  order: 'desc',
  page: 1,
  per_page: 10
};

const renderTablePagination = (
  searchParams = defaultSearchParams,
  totalCount = 100,
  totalPages = 10,
  isLoading = false
) => {
  return render(
    <TablePagination
      searchParams={searchParams}
      totalCount={totalCount}
      totalPages={totalPages}
      onPageChange={mockOnPageChange}
      onPerPageChange={mockOnPerPageChange}
      isLoading={isLoading}
    />
  );
};

describe('TablePagination', () => {
  beforeEach(() => {
    mockOnPageChange.mockClear();
    mockOnPerPageChange.mockClear();
  });

  it('отображает информацию о текущих результатах', () => {
    renderTablePagination();
    expect(screen.getByText('1-10 of 100')).toBeInTheDocument();
    expect(screen.getByText('Rows per page:')).toBeInTheDocument();
  });

  it('отображает правильный диапазон для второй страницы', () => {
    renderTablePagination({ ...defaultSearchParams, page: 2 });
    expect(screen.getByText('11-20 of 100')).toBeInTheDocument();
  });

  it('отображает правильный диапазон для последней страницы', () => {
    renderTablePagination({ ...defaultSearchParams, page: 10 }, 95, 10);
    expect(screen.getByText('91-95 of 95')).toBeInTheDocument();
  });

  it('кнопка "назад" отключена на первой странице', () => {
    renderTablePagination();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('кнопка "вперед" отключена на последней странице', () => {
    renderTablePagination({ ...defaultSearchParams, page: 10 });
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('вызывает onPageChange при клике на "назад"', async () => {
    const user = userEvent.setup();
    renderTablePagination({ ...defaultSearchParams, page: 2 });

    await user.click(screen.getByLabelText('Previous page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('вызывает onPageChange при клике на "вперед"', async () => {
    const user = userEvent.setup();
    renderTablePagination();

    await user.click(screen.getByLabelText('Next page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('отображает селект с правильным значением per_page', () => {
    renderTablePagination();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('вызывает onPerPageChange с правильным значением при изменении', async () => {
    const user = userEvent.setup();
    renderTablePagination();

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '25' }));

    expect(mockOnPerPageChange).toHaveBeenCalledTimes(1);

    const [event] = mockOnPerPageChange.mock.calls[0];
    expect(event.target.value).toBe(25);
  });

  it('отключает все элементы управления при загрузке', () => {
    renderTablePagination(defaultSearchParams, 100, 10, true);

    expect(screen.getByDisplayValue('10')).toBeDisabled();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('не вызывает onPageChange при изменении per_page напрямую', async () => {
    const user = userEvent.setup();
    renderTablePagination({ ...defaultSearchParams, page: 2 });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '25' }));

    expect(mockOnPerPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('корректно обрабатывает лимит в 1000 результатов', () => {
    renderTablePagination(defaultSearchParams, 5000, 100);

    expect(screen.getByText('1-10 of 1000')).toBeInTheDocument();
  });

  it('корректно обрабатывает пустой результат', () => {
    renderTablePagination(defaultSearchParams, 0, 0);
    expect(screen.getByText('0-0 of 0')).toBeInTheDocument();
  });

  it('отображает все доступные опции per_page', async () => {
    const user = userEvent.setup();
    renderTablePagination();

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
  });
});
