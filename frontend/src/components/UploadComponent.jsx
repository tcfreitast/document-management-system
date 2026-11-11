import { useRef, useState } from 'react';
import { uploadDocument } from '../services/documentApi.js';

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadComponent({ onUploaded, onError }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file || isUploading) return;

    setIsUploading(true);
    onError('');

    try {
      const uploadedDocument = await uploadDocument(file);
      setFile(null);
      if (fileInput.current) fileInput.current.value = '';
      onUploaded(uploadedDocument);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="upload-panel" onSubmit={handleSubmit}>
      <div className="upload-copy">
        <span className="eyebrow">NOVO DOCUMENTO</span>
        <h2>Adicionar arquivo</h2>
        <p>PDF, imagem ou qualquer outro arquivo.</p>
      </div>
      <div className="upload-actions">
        <label className={`file-picker${file ? ' has-file' : ''}`}>
          <input
            ref={fileInput}
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            aria-label="Selecionar arquivo"
          />
          <span className="file-picker-mark" aria-hidden="true">+</span>
          <span className="file-picker-text">
            {file ? file.name : 'Selecionar arquivo'}
          </span>
        </label>
        {file && <span className="file-size">{formatFileSize(file.size)}</span>}
        <button className="primary-button" type="submit" disabled={!file || isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar arquivo'}
        </button>
      </div>
    </form>
  );
}