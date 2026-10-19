import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import KanbanColumn from './KanbanColumn';

describe('KanbanColumn Component', () => {
  const dummyTasks = [
    { id: 1, name: 'Task 1', status: 'pending', category: 'Work' },
    { id: 2, name: 'Task 2', status: 'pending', category: 'Work' },
  ];

  it('renders column header with title and count pill', () => {
    render(
      <KanbanColumn
        statusKey="pending"
        tasks={dummyTasks}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onQuickAdd={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Pending', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows empty placeholder when there are no tasks', () => {
    render(
      <KanbanColumn
        statusKey="pending"
        tasks={[]}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onQuickAdd={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    expect(screen.getByText('Drop tasks here')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('calls onQuickAdd with statusKey when plus button is clicked', async () => {
    const user = userEvent.setup();
    const onQuickAddMock = vi.fn();

    render(
      <KanbanColumn
        statusKey="pending"
        tasks={[]}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onQuickAdd={onQuickAddMock}
        onReorderTask={vi.fn()}
      />
    );

    const plusBtn = screen.getByTitle(/add task directly to pending/i);
    await user.click(plusBtn);

    expect(onQuickAddMock).toHaveBeenCalledTimes(1);
    expect(onQuickAddMock).toHaveBeenCalledWith('pending');
  });

  it('calls onReorderTask with append position when a task is dropped on column', () => {
    const onReorderTaskMock = vi.fn();
    const { container } = render(
      <KanbanColumn
        statusKey="current"
        tasks={[]}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onQuickAdd={vi.fn()}
        onReorderTask={onReorderTaskMock}
      />
    );

    const column = container.querySelector('.kanban-column');
    const dataTransfer = {
      getData: vi.fn((key) => (key === 'text/plain' ? '42' : null)),
    };

    fireEvent.dragOver(column, {
      preventDefault: vi.fn(),
      dataTransfer: { dropEffect: '' },
    });
    fireEvent.drop(column, { dataTransfer });

    expect(onReorderTaskMock).toHaveBeenCalledWith(42, null, 'current', 'append');
  });
});
