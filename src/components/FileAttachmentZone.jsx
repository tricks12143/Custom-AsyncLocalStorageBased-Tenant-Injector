import React, { useRef, useState } from 'react';
import { 
  PaperClipIcon, 
  TrashIcon, 
  ArrowDownTrayIcon, 
  DocumentIcon, 
  EyeIcon,
  ArrowUpTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { formatFileSize } from '../utils/formatters';
import FilePreviewModal from './FilePreviewModal';

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB warning threshold for LocalStorage

const FileAttachmentZone = ({ attachments = [], onChange }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  const processFiles = async (files) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    setErrorMessage('');

    const readFile = (file) => {
      return new Promise((resolve) => {
        if (file.size > MAX_FILE_SIZE) {
          setErrorMessage(`"${file.name}" is over 1.5MB. For browser storage performance, smaller files are recommended.`);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            dataUrl: e.target.result,
            uploadedAt: new Date().toISOString()
          });
        };
        reader.onerror = () => {
          setErrorMessage(`Failed to read "${file.name}".`);
          resolve(null);
        };
        reader.onabort = () => {
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const results = await Promise.all(fileList.map(readFile));
      const validAttachments = results.filter(Boolean);
      if (validAttachments.length > 0) {
        onChange([...attachments, ...validAttachments]);
      }
    } catch (err) {
      console.error('Error reading files:', err);
      setErrorMessage('An unexpected error occurred while uploading files.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (id) => {
    onChange(attachments.filter(att => att.id !== id));
  };

  return (
    <div 
      className="file-attachment-zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        id="file-upload-input"
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange} 
        onClick={(e) => e.stopPropagation()}
        multiple 
        style={{ display: 'none' }} 
      />

      {/* When no attachments exist, show the clean primary dropzone */}
      {attachments.length === 0 ? (
        <label 
          htmlFor="file-upload-input"
          className={`file-dropzone ${isDragging ? 'dropzone-active' : ''}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="dropzone-content">
            <div className="dropzone-icon-circle">
              <ArrowUpTrayIcon className="dropzone-icon" width={20} height={20} />
            </div>
            <p className="dropzone-text">
              <span className="dropzone-highlight">Click to upload</span> or drag and drop files here
            </p>
            <span className="dropzone-hint">PNG, JPG, PDF, TXT or DOC up to 1.5MB</span>
          </div>
        </label>
      ) : (
        /* When attachments exist, show the attached files list + a sleek "+ Add More" button */
        <div className="attachments-list">
          <div className="attachments-header-row">
            <span className="attachments-title">
              Attached Files ({attachments.length})
            </span>
            <label 
              htmlFor="file-upload-input" 
              className="attach-more-btn"
              title="Add more attachments"
            >
              <PlusIcon width={14} height={14} />
              <span>Add More</span>
            </label>
          </div>

          <div className="attachments-grid">
            {attachments.map((att) => {
              const isImage = att.type?.startsWith('image/');
              return (
                <div 
                  key={att.id} 
                  className="attachment-chip"
                  onClick={() => setPreviewFile(att)}
                  title={`Preview ${att.name}`}
                >
                  <div className="attachment-preview">
                    {isImage ? (
                      <img src={att.dataUrl} alt={att.name} className="attachment-img-thumb" />
                    ) : (
                      <DocumentIcon className="attachment-doc-icon" width={20} height={20} />
                    )}
                  </div>
                  <div className="attachment-info" title={att.name}>
                    <span className="attachment-name">{att.name}</span>
                    <span className="attachment-size">{formatFileSize(att.size)}</span>
                  </div>
                  <div className="attachment-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="attachment-btn view-btn"
                      title="View file"
                      aria-label="View file"
                      onClick={() => setPreviewFile(att)}
                    >
                      <EyeIcon width={15} height={15} />
                    </button>
                    <a 
                      href={att.dataUrl} 
                      download={att.name} 
                      className="attachment-btn" 
                      title="Download file"
                      aria-label="Download file"
                    >
                      <ArrowDownTrayIcon width={15} height={15} />
                    </a>
                    <button 
                      type="button" 
                      className="attachment-btn delete-btn" 
                      title="Remove"
                      aria-label="Remove"
                      onClick={() => removeAttachment(att.id)}
                    >
                      <TrashIcon width={15} height={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* If dragged over while having attachments, show a sleek drop overlay hint */}
          {isDragging && (
            <div className="attachments-drop-overlay">
              <ArrowUpTrayIcon width={22} height={22} />
              <span>Drop files here to add</span>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="file-error-banner">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Lightbox / Modal for File Viewing */}
      <FilePreviewModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default FileAttachmentZone;
