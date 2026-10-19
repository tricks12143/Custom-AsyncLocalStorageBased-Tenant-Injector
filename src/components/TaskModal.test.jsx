import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskModal from './TaskModal';

describe('TaskModal Component', () => {
  const defaultCategories = ['Work', 'Personal', 'Development'];

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <TaskModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={defaultCategories}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders create mode with blank inputs when initialTask is null', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={defaultCategories}
      />
    );

    expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/task title/i);
    expect(titleInput).toHaveValue('');
  });

  it('renders edit mode with prefilled values when initialTask is provided', () => {
    const initialTask = {
      id: 55,
      name: 'Existing Task To Edit',
      description: 'Existing Description',
      status: 'current',
      category: 'Personal',
      deadline: '2026-10-30T10:00',
      attachments: [],
      comments: [],
    };

    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialTask={initialTask}
        categories={defaultCategories}
      />
    );

    expect(screen.getByRole('heading', { name: /edit task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toHaveValue('Existing Task To Edit');
  });

  it('calls onSave and onClose upon successful submission', async () => {
    const user = userEvent.setup();
    const onSaveMock = vi.fn();
    const onCloseMock = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        categories={defaultCategories}
      />
    );

    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Deploy to production');

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    expect(onSaveMock).toHaveBeenCalledTimes(1);
    expect(onSaveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Deploy to production',
        status: 'pending',
        category: 'Work',
      })
    );
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const onCloseMock = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={vi.fn()}
        categories={defaultCategories}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('closes modal on Escape key press', () => {
    const onCloseMock = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={onCloseMock}
        onSave={vi.fn()}
        categories={defaultCategories}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('supports creating a custom category', async () => {
    const user = userEvent.setup();
    const onAddCategoryMock = vi.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={defaultCategories}
        onAddCategory={onAddCategoryMock}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '__NEW__');

    const newCategoryInput = screen.getByPlaceholderText(/category name/i);
    await user.type(newCategoryInput, 'DevOps');

    const addBtn = screen.getByRole('button', { name: /^add$/i });
    await user.click(addBtn);

    expect(onAddCategoryMock).toHaveBeenCalledWith('DevOps');
  });

  it('updates deadline when preset button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={defaultCategories}
      />
    );

    const deadlineInput = screen.getByLabelText(/deadline \(date & time\)/i);
    expect(deadlineInput).toHaveValue('');

    const presetBtn = screen.getByRole('button', { name: /today 5 pm/i });
    await user.click(presetBtn);

    expect(deadlineInput.value).toMatch(/T17:00/);
  });
});
