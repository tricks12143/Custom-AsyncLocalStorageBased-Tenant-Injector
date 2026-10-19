import React, { useEffect, useState } from 'react';
import { 
  XMarkIcon, 
  ArrowDownTrayIcon, 
  ArrowTopRightOnSquareIcon,
  DocumentIcon 
} from '@heroicons/react/24/outline';
import { formatFileSize } from '../utils/formatters';

// Helper to safely open data URLs in a new browser tab without being blocked by Chrome/Edge
export const openDataUrlInNewTab = (dataUrl, mimeType = '') => {
  try {
    const arr = dataUrl.split(',');
    const mime = mimeType || arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
  } catch (e) {
    // Fallback if decoding fails
    window.open(dataUrl, '_blank');
  }
};

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  const [textContent, setTextContent] = useState('');
  const [isLoadingText, setIsLoadingText] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Decode text files for in-modal preview
  useEffect(() => {
    if (!file || !isOpen) {
      setTextContent('');
      return;
    }

    const isText = file.type?.startsWith('text/') || 
      file.name?.endsWith('.txt') || 
      file.name?.endsWith('.json') || 
      file.name?.endsWith('.md') ||
      file.name?.endsWith('.js') ||
      file.name?.endsWith('.csv');

    if (isText && file.dataUrl) {
      try {
        setIsLoadingText(true);
        const base64 = file.dataUrl.split(',')[1];
        if (base64) {
          const decoded = decodeURIComponent(escape(atob(base64)));
          setTextContent(decoded);
        }
      } catch (err) {
        setTextContent('Unable to decode text preview.');
      } finally {
        setIsLoadingText(false);
      }
    } else {
      setTextContent('');
    }
  }, [file, isOpen]);

  if (!isOpen || !file) return null;

  const isImage = file.type?.startsWith('image/');
  const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
  const isText = Boolean(textContent) || file.type?.startsWith('text/');

  return (
    <div 
      className="file-preview-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${file.name}`}
    >
      <div className="file-preview-container">
        {/* Modal Header */}
        <div className="file-preview-header">
          <div className="file-preview-meta">
            <h3 className="file-preview-filename" title={file.name}>{file.name}</h3>
            <span className="file-preview-filesize">{formatFileSize(file.size)}</span>
          </div>

          <div className="file-preview-actions">
            <button
              type="button"
              className="preview-action-btn"
              title="Open in new tab"
              onClick={() => openDataUrlInNewTab(file.dataUrl, file.type)}
            >
              <ArrowTopRightOnSquareIcon width={18} height={18} />
              <span>Open in tab</span>
            </button>

            <a
              href={file.dataUrl}
              download={file.name}
              className="preview-action-btn primary"
              title="Download file"
            >
              <ArrowDownTrayIcon width={18} height={18} />
              <span>Download</span>
            </a>

            <button
              type="button"
              className="preview-close-btn"
              title="Close preview (Esc)"
              onClick={onClose}
              aria-label="Close preview"
            >
              <XMarkIcon width={22} height={22} />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="file-preview-body">
          {isImage ? (
            <div className="image-viewer-wrapper">
              <img 
                src={file.dataUrl} 
                alt={file.name} 
                className="file-preview-image"
              />
            </div>
          ) : isPdf ? (
            <div className="pdf-viewer-wrapper">
              <iframe
                src={file.dataUrl}
                title={`PDF Preview of ${file.name}`}
                className="file-preview-iframe"
              />
            </div>
          ) : isText ? (
            <div className="text-viewer-wrapper">
              {isLoadingText ? (
                <p className="loading-text">Loading preview...</p>
              ) : (
                <pre className="file-preview-text">
                  <code>{textContent}</code>
                </pre>
              )}
            </div>
          ) : (
            <div className="generic-viewer-wrapper">
              <DocumentIcon width={64} height={64} className="generic-doc-icon" />
              <h4>{file.name}</h4>
              <p>Direct in-browser preview is not available for this file type ({file.type || 'unknown'}).</p>
              <div className="generic-actions">
                <a href={file.dataUrl} download={file.name} className="btn-primary">
                  <ArrowDownTrayIcon width={18} height={18} />
                  <span>Download file to view</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
