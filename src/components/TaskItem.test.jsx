import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
  const dummyTask = {
    id: 101,
    name: 'Sample Task',
    checked: false,
  };

  it('renders task name and unchecked checkbox', () => {
    render(
      <TaskItem
        task={dummyTask}
        deleteTask={vi.fn()}
        toggleTask={vi.fn()}
        enterEditMode={vi.fn()}
      />
    );

    expect(screen.getByText('Sample Task')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls toggleTask when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const toggleTaskMock = vi.fn();

    render(
      <TaskItem
        task={dummyTask}
        deleteTask={vi.fn()}
        toggleTask={toggleTaskMock}
        enterEditMode={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(toggleTaskMock).toHaveBeenCalledTimes(1);
    expect(toggleTaskMock).toHaveBeenCalledWith(101);
  });

  it('calls enterEditMode when edit button is clicked', async () => {
    const user = userEvent.setup();
    const enterEditModeMock = vi.fn();

    render(
      <TaskItem
        task={dummyTask}
        deleteTask={vi.fn()}
        toggleTask={vi.fn()}
        enterEditMode={enterEditModeMock}
      />
    );

    const editBtn = screen.getByRole('button', { name: /update sample task task/i });
    await user.click(editBtn);

    expect(enterEditModeMock).toHaveBeenCalledTimes(1);
    expect(enterEditModeMock).toHaveBeenCalledWith(dummyTask);
  });

  it('calls deleteTask when delete button is clicked', async () => {
    const user = userEvent.setup();
    const deleteTaskMock = vi.fn();

    render(
      <TaskItem
        task={dummyTask}
        deleteTask={deleteTaskMock}
        toggleTask={vi.fn()}
        enterEditMode={vi.fn()}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete sample task task/i });
    await user.click(deleteBtn);

    expect(deleteTaskMock).toHaveBeenCalledTimes(1);
    expect(deleteTaskMock).toHaveBeenCalledWith(101);
  });
});
