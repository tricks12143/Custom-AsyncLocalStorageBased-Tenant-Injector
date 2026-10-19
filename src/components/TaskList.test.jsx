import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  const dummyTasks = [
    { id: 1, name: 'First Task', checked: false },
    { id: 2, name: 'Second Task', checked: true },
    { id: 3, name: 'Third Task', checked: false },
  ];

  it('renders all tasks in sorted order by descending id', () => {
    render(
      <TaskList
        tasks={[...dummyTasks]}
        deleteTask={vi.fn()}
        toggleTask={vi.fn()}
        enterEditMode={vi.fn()}
      />
    );

    const taskItems = screen.getAllByRole('listitem');
    expect(taskItems).toHaveLength(3);
    // Task with id 3 should appear before task with id 2 and 1
    expect(taskItems[0]).toHaveTextContent('Third Task');
    expect(taskItems[1]).toHaveTextContent('Second Task');
    expect(taskItems[2]).toHaveTextContent('First Task');
  });
});
