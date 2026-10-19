import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from './KanbanBoard';

describe('KanbanBoard Component', () => {
  const dummyTasks = [
    { id: 1, name: 'Backlog Item', status: 'backlog', category: 'General' },
    { id: 2, name: 'Pending Item', status: 'pending', category: 'General' },
    { id: 3, name: 'Current Item', status: 'current', category: 'General' },
    { id: 4, name: 'Completed Item', status: 'completed', category: 'General' },
    { id: 5, name: 'Cancelled Item', status: 'cancel', category: 'General' },
  ];

  it('renders all Kanban columns according to STATUS_LIST', () => {
    render(
      <KanbanBoard
        tasks={dummyTasks}
        onEditTask={vi.fn()}
        onDeleteTask={vi.fn()}
        onStatusChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onQuickAdd={vi.fn()}
        onReorderTask={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Backlog', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pending', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Current', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Completed', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cancel', level: 3 })).toBeInTheDocument();

    expect(screen.getByText('Backlog Item')).toBeInTheDocument();
    expect(screen.getByText('Pending Item')).toBeInTheDocument();
    expect(screen.getByText('Current Item')).toBeInTheDocument();
    expect(screen.getByText('Completed Item')).toBeInTheDocument();
    expect(screen.getByText('Cancelled Item')).toBeInTheDocument();
  });
});
