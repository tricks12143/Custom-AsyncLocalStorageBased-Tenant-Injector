import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RichTextEditor from './RichTextEditor';

describe('RichTextEditor Component', () => {
  it('renders textarea in write tab and triggers onChange on user input', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(
      <RichTextEditor
        value=""
        onChange={onChangeMock}
        attachments={[]}
        onAttachmentsChange={vi.fn()}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'New note');

    expect(onChangeMock).toHaveBeenCalled();
  });

  it('switches between Write and Preview tabs', async () => {
    const user = userEvent.setup();

    render(
      <RichTextEditor
        value="**Bold Text**"
        onChange={vi.fn()}
        attachments={[]}
        onAttachmentsChange={vi.fn()}
      />
    );

    const previewTab = screen.getByRole('button', { name: /preview/i });
    await user.click(previewTab);

    // Should render bold strong tag
    expect(screen.getByText('Bold Text')).toBeInTheDocument();

    const writeTab = screen.getByRole('button', { name: /write/i });
    await user.click(writeTab);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies formatting when toolbar button is clicked', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(
      <RichTextEditor
        value="Hello"
        onChange={onChangeMock}
        attachments={[]}
        onAttachmentsChange={vi.fn()}
      />
    );

    const textarea = screen.getByRole('textbox');
    textarea.focus();
    textarea.setSelectionRange(0, 5);

    const boldBtn = screen.getByTitle(/bold/i);
    await user.click(boldBtn);

    expect(onChangeMock).toHaveBeenCalledWith('**Hello**');
  });
});
