import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CommentsSection from './CommentsSection';

describe('CommentsSection Component', () => {
  it('renders empty comments message when no comments are present', () => {
    render(<CommentsSection comments={[]} onAddComment={vi.fn()} />);

    expect(
      screen.getByText(/no comments yet\. start a discussion or add notes\./i)
    ).toBeInTheDocument();
  });

  it('renders existing comments list', () => {
    const dummyComments = [
      { id: 'c1', text: 'First discussion note', author: 'Alice', createdAt: Date.now() },
      { id: 'c2', text: 'Second discussion note', author: 'Bob', createdAt: Date.now() },
    ];

    render(
      <CommentsSection
        comments={dummyComments}
        onAddComment={vi.fn()}
        onDeleteComment={vi.fn()}
      />
    );

    expect(screen.getByText('First discussion note')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Second discussion note')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('submits a new comment on button click and clears textarea', async () => {
    const user = userEvent.setup();
    const onAddCommentMock = vi.fn();

    render(<CommentsSection comments={[]} onAddComment={onAddCommentMock} />);

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    const submitBtn = screen.getByRole('button', { name: /post comment/i });

    expect(submitBtn).toBeDisabled();

    await user.type(textarea, 'Great progress on this!');
    expect(submitBtn).not.toBeDisabled();

    await user.click(submitBtn);

    expect(onAddCommentMock).toHaveBeenCalledTimes(1);
    expect(onAddCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Great progress on this!',
        author: 'You',
      })
    );
    expect(textarea).toHaveValue('');
  });

  it('submits comment on Ctrl+Enter in textarea', async () => {
    const user = userEvent.setup();
    const onAddCommentMock = vi.fn();

    render(<CommentsSection comments={[]} onAddComment={onAddCommentMock} />);

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.type(textarea, 'Keyboard shortcut comment');

    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

    expect(onAddCommentMock).toHaveBeenCalledTimes(1);
    expect(onAddCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Keyboard shortcut comment',
      })
    );
  });

  it('calls onDeleteComment when delete button is clicked on a comment', async () => {
    const user = userEvent.setup();
    const onDeleteCommentMock = vi.fn();
    const dummyComments = [
      { id: 'comm-123', text: 'To be removed', author: 'You', createdAt: Date.now() },
    ];

    render(
      <CommentsSection
        comments={dummyComments}
        onAddComment={vi.fn()}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /delete comment/i });
    await user.click(deleteBtn);

    expect(onDeleteCommentMock).toHaveBeenCalledTimes(1);
    expect(onDeleteCommentMock).toHaveBeenCalledWith('comm-123');
  });
});
