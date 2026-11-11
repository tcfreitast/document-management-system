import { useState } from 'react';
import { downloadDocument } from '../services/documentApi.js';

export default function DownloadButton({ documentId, fileName, onError }) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    onError('');

    try {
      const blob = await downloadDocument(documentId);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (error) {
      onError(error.message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button
      className="download-button"
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label={`Baixar ${fileName}`}
    >
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}