import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FileAttachmentZone from './FileAttachmentZone';

describe('FileAttachmentZone Component', () => {
  const dummyAttachments = [
    {
      id: 'f1',
      name: 'design-spec.pdf',
      size: 1024 * 50,
      type: 'application/pdf',
      dataUrl: 'data:application/pdf;base64,sample',
    },
    {
      id: 'f2',
      name: 'screenshot.png',
      size: 1024 * 120,
      type: 'image/png',
      dataUrl: 'data:image/png;base64,sample',
    },
  ];

  it('renders upload instructions and dropzone', () => {
    render(<FileAttachmentZone attachments={[]} onChange={vi.fn()} />);

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop files here/i)).toBeInTheDocument();
  });

  it('renders list of attached files with names and sizes', () => {
    render(<FileAttachmentZone attachments={dummyAttachments} onChange={vi.fn()} />);

    expect(screen.getByText('design-spec.pdf')).toBeInTheDocument();
    expect(screen.getByText('50 KB')).toBeInTheDocument();
    expect(screen.getByText('screenshot.png')).toBeInTheDocument();
    expect(screen.getByText('120 KB')).toBeInTheDocument();
  });

  it('calls onChange removing the selected attachment when trash button is clicked', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(
      <FileAttachmentZone
        attachments={dummyAttachments}
        onChange={onChangeMock}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(deleteButtons[0]);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith([dummyAttachments[1]]);
  });

  it('opens file preview modal when view button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FileAttachmentZone
        attachments={dummyAttachments}
        onChange={vi.fn()}
      />
    );

    const viewButtons = screen.getAllByRole('button', { name: /view file/i });
    await user.click(viewButtons[1]); // Click view on screenshot.png

    expect(screen.getByRole('dialog', { name: /preview of screenshot\.png/i })).toBeInTheDocument();
  });

  it('processes file selection from file input', async () => {
    const onChangeMock = vi.fn();
    const { container } = render(
      <FileAttachmentZone attachments={[]} onChange={onChangeMock} />
    );

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'document.txt', { type: 'text/plain' });

    // Mock FileReader
    const originalFileReader = global.FileReader;
    class MockFileReader {
      readAsDataURL() {
        this.result = 'data:text/plain;base64,ZHVtbXk=';
        if (this.onload) {
          this.onload({ target: { result: this.result } });
        }
      }
    }
    global.FileReader = MockFileReader;

    try {
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'document.txt',
              type: 'text/plain',
              dataUrl: 'data:text/plain;base64,ZHVtbXk=',
            }),
          ])
        );
      });
    } finally {
      global.FileReader = originalFileReader;
    }
  });
});
