import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    selectedCategory: 'ALL',
    onCategoryChange: vi.fn(),
    selectedStatus: 'ALL',
    onStatusChange: vi.fn(),
    sortBy: 'manual',
    onSortChange: vi.fn(),
    viewMode: 'board',
    onViewModeChange: vi.fn(),
    isDarkMode: true,
    onToggleDarkMode: vi.fn(),
    onOpenCreateModal: vi.fn(),
    categories: ['Work', 'Personal'],
    taskStats: { total: 10, pending: 3, current: 2, completed: 5 },
  };

  it('renders branding and stats bar correctly', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('triggers onSearchChange when typing in search input', async () => {
    const user = userEvent.setup();
    const onSearchChangeMock = vi.fn();

    render(<Header {...defaultProps} onSearchChange={onSearchChangeMock} />);

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, 'audit');

    expect(onSearchChangeMock).toHaveBeenCalled();
  });

  it('shows clear button and calls onSearchChange with empty string when cleared', async () => {
    const user = userEvent.setup();
    const onSearchChangeMock = vi.fn();

    render(
      <Header
        {...defaultProps}
        searchQuery="existing query"
        onSearchChange={onSearchChangeMock}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(onSearchChangeMock).toHaveBeenCalledWith('');
  });

  it('calls onCategoryChange when category is changed', async () => {
    const user = userEvent.setup();
    const onCategoryChangeMock = vi.fn();

    render(<Header {...defaultProps} onCategoryChange={onCategoryChangeMock} />);

    const categorySelect = screen.getByLabelText(/category:/i);
    await user.selectOptions(categorySelect, 'Work');

    expect(onCategoryChangeMock).toHaveBeenCalledWith('Work');
  });

  it('calls onStatusChange when status is changed', async () => {
    const user = userEvent.setup();
    const onStatusChangeMock = vi.fn();

    render(<Header {...defaultProps} onStatusChange={onStatusChangeMock} />);

    const statusSelect = screen.getByLabelText(/status:/i);
    await user.selectOptions(statusSelect, 'completed');

    expect(onStatusChangeMock).toHaveBeenCalledWith('completed');
  });

  it('calls onSortChange when sort option is changed', async () => {
    const user = userEvent.setup();
    const onSortChangeMock = vi.fn();

    render(<Header {...defaultProps} onSortChange={onSortChangeMock} />);

    const sortSelect = screen.getByLabelText(/sort:/i);
    await user.selectOptions(sortSelect, 'name_asc');

    expect(onSortChangeMock).toHaveBeenCalledWith('name_asc');
  });

  it('switches view mode between board and list', async () => {
    const user = userEvent.setup();
    const onViewModeChangeMock = vi.fn();

    render(<Header {...defaultProps} onViewModeChange={onViewModeChangeMock} />);

    const listBtn = screen.getByTitle('List View');
    await user.click(listBtn);

    expect(onViewModeChangeMock).toHaveBeenCalledWith('list');
  });

  it('calls onToggleDarkMode when theme button is clicked', async () => {
    const user = userEvent.setup();
    const onToggleDarkModeMock = vi.fn();

    render(<Header {...defaultProps} onToggleDarkMode={onToggleDarkModeMock} />);

    const themeBtn = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(themeBtn);

    expect(onToggleDarkModeMock).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenCreateModal when New Task button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenCreateModalMock = vi.fn();

    render(<Header {...defaultProps} onOpenCreateModal={onOpenCreateModalMock} />);

    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    await user.click(newTaskBtn);

    expect(onOpenCreateModalMock).toHaveBeenCalledTimes(1);
  });
});
