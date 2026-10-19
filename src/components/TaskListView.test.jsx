import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskListView from './TaskListView';

describe('TaskListView Component', () => {
  it('renders empty state when tasks list is empty and calls onOpenCreateModal on button click', async () => {
    const user = userEvent.setup();
    const onOpenCreateModalMock = vi.fn();

    render(
      <TaskListView
        tasks={[]}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onOpenCreateModal={onOpenCreateModalMock}
        onReorderTask={vi.fn()}
      />
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    const createBtn = screen.getByRole('button', { name: /\+ create task/i });
    expect(createBtn).toBeInTheDocument();

    await user.click(createBtn);
    expect(onOpenCreateModalMock).toHaveBeenCalledTimes(1);
  });

  it('renders task cards when tasks are provided', () => {
    const dummyTasks = [
      { id: 1, name: 'Task A', status: 'pending', category: 'General' },
      { id: 2, name: 'Task B', status: 'completed', category: 'Work' },
    ];

    render(
      <TaskListView
        tasks={dummyTasks}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onOpenCreateModal={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });
});
