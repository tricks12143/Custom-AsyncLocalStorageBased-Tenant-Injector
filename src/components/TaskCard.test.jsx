import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from './TaskCard';

describe('TaskCard Component', () => {
  const dummyTask = {
    id: 10,
    name: 'Implement OAuth Authentication',
    description: 'Add Google and GitHub OAuth providers with JWT support.',
    category: 'Development',
    status: 'pending',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    attachments: [{ id: 'a1', name: 'diagram.png' }],
    comments: [{ id: 'c1', text: 'Working on this' }],
    checked: false,
  };

  it('renders task details correctly', () => {
    render(
      <TaskCard
        task={dummyTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    expect(screen.getByText('Implement OAuth Authentication')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText(/Add Google and GitHub OAuth providers/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('pending');
    expect(screen.getByTitle(/1 attachment/i)).toBeInTheDocument();
    expect(screen.getByTitle(/1 comment/i)).toBeInTheDocument();
  });

  it('triggers onToggleComplete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleCompleteMock = vi.fn();

    render(
      <TaskCard
        task={dummyTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={onToggleCompleteMock}
        onReorderTask={vi.fn()}
      />
    );

    const checkboxBtn = screen.getByRole('button', { name: /mark completed/i });
    await user.click(checkboxBtn);

    expect(onToggleCompleteMock).toHaveBeenCalledTimes(1);
    expect(onToggleCompleteMock).toHaveBeenCalledWith(10);
  });

  it('triggers onStatusChange when status dropdown changes', async () => {
    const user = userEvent.setup();
    const onStatusChangeMock = vi.fn();

    render(
      <TaskCard
        task={dummyTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={onStatusChangeMock}
        onToggleComplete={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'current');

    expect(onStatusChangeMock).toHaveBeenCalledTimes(1);
    expect(onStatusChangeMock).toHaveBeenCalledWith(10, 'current');
  });

  it('triggers onEdit when card or edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEditMock = vi.fn();

    render(
      <TaskCard
        task={dummyTask}
        onEdit={onEditMock}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    const editBtn = screen.getByRole('button', { name: /edit task/i });
    await user.click(editBtn);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(dummyTask);
  });

  it('triggers onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteMock = vi.fn();

    render(
      <TaskCard
        task={dummyTask}
        onEdit={vi.fn()}
        onDelete={onDeleteMock}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    await user.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(10);
  });

  it('handles drag and drop reordering', () => {
    const onReorderTaskMock = vi.fn();
    const { container } = render(
      <TaskCard
        task={dummyTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onReorderTask={onReorderTaskMock}
      />
    );

    const card = container.querySelector('.task-card');

    // Simulate drag start
    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
      dropEffect: '',
      getData: vi.fn((key) => (key === 'text/plain' ? '20' : null)),
    };

    fireEvent.dragStart(card, { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', '10');

    // Define getBoundingClientRect on card element
    Object.defineProperty(card, 'getBoundingClientRect', {
      value: () => ({
        top: 0,
        height: 100,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        x: 0,
        y: 0,
      }),
      configurable: true,
    });

    // Simulate drag over (clientY: 10 is in top half -> 'before')
    fireEvent.dragOver(card, {
      dataTransfer,
      clientY: 10,
    });

    fireEvent.drop(card, { dataTransfer });
    expect(onReorderTaskMock).toHaveBeenCalledWith(20, 10, 'pending', 'before');
  });
});
