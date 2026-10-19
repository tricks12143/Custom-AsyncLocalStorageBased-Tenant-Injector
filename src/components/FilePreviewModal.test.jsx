import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FilePreviewModal, { openDataUrlInNewTab } from './FilePreviewModal';

describe('FilePreviewModal Component', () => {
  const dummyImageFile = {
    id: 'f1',
    name: 'photo.png',
    size: 2048,
    type: 'image/png',
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  };

  const dummyPdfFile = {
    id: 'f2',
    name: 'document.pdf',
    size: 10240,
    type: 'application/pdf',
    dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK',
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <FilePreviewModal
        file={dummyImageFile}
        isOpen={false}
        onClose={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders image viewer when file is an image', () => {
    render(
      <FilePreviewModal
        file={dummyImageFile}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'photo.png' })).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', dummyImageFile.dataUrl);
  });

  it('renders PDF iframe viewer when file is a PDF', () => {
    render(
      <FilePreviewModal
        file={dummyPdfFile}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const iframe = screen.getByTitle('PDF Preview of document.pdf');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', dummyPdfFile.dataUrl);
  });

  it('closes preview on close button click and on Escape key', async () => {
    const user = userEvent.setup();
    const onCloseMock = vi.fn();

    render(
      <FilePreviewModal
        file={dummyImageFile}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /close preview/i });
    await user.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });

  it('opens file in new tab helper safely via blob URL', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/sample-blob');

    openDataUrlInNewTab(dummyImageFile.dataUrl, dummyImageFile.type);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'blob:http://localhost/sample-blob',
      '_blank',
      'noopener,noreferrer'
    );

    windowOpenSpy.mockRestore();
  });
});
