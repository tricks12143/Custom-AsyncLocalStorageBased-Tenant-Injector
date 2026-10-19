import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EditForm from './EditForm';

describe('EditForm Component', () => {
  const dummyTask = {
    id: 1,
    name: 'Initial Task Name',
  };

  it('renders input with initial task name', () => {
    render(
      <EditForm
        editedTask={dummyTask}
        updateTask={vi.fn()}
        closeEditMode={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox', { name: /update task/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Initial Task Name');
  });

  it('calls updateTask with modified name upon submitting form', async () => {
    const user = userEvent.setup();
    const updateTaskMock = vi.fn();
    const closeEditModeMock = vi.fn();

    render(
      <EditForm
        editedTask={dummyTask}
        updateTask={updateTaskMock}
        closeEditMode={closeEditModeMock}
      />
    );

    const input = screen.getByRole('textbox', { name: /update task/i });
    await user.clear(input);
    await user.type(input, 'Updated Task Name');

    const submitBtn = screen.getByRole('button', { name: /confirm edited task/i });
    await user.click(submitBtn);

    expect(updateTaskMock).toHaveBeenCalledTimes(1);
    expect(updateTaskMock).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Task Name',
    });
  });

  it('calls closeEditMode when Escape key is pressed', () => {
    const closeEditModeMock = vi.fn();

    render(
      <EditForm
        editedTask={dummyTask}
        updateTask={vi.fn()}
        closeEditMode={closeEditModeMock}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(closeEditModeMock).toHaveBeenCalledTimes(1);
  });

  it('calls closeEditMode when clicking on dialog backdrop', () => {
    const closeEditModeMock = vi.fn();

    render(
      <EditForm
        editedTask={dummyTask}
        updateTask={vi.fn()}
        closeEditMode={closeEditModeMock}
      />
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(closeEditModeMock).toHaveBeenCalledTimes(1);
  });
});
