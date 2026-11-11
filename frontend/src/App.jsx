import { useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { listDocuments } from './services/documentApi.js';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadDocuments() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await listDocuments();
        if (isCurrent) setDocuments(result);
      } catch (error) {
        if (isCurrent) setErrorMessage(error.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadDocuments();
    return () => { isCurrent = false; };
  }, [reloadKey]);

  function handleUploaded(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
    setErrorMessage('');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DMS, início">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span className="brand-name">DMS<span>/</span>ARQUIVO</span>
        </a>
        <span className="workspace-label">ESPAÇO LOCAL</span>
      </header>

      <main className="page-content">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <span className="eyebrow">BIBLIOTECA</span>
            <h1 id="page-title">Documentos<span>.</span></h1>
          </div>
          <div className="document-count" aria-live="polite">
            <strong>{documents.length.toString().padStart(2, '0')}</strong>
            <span>{documents.length === 1 ? 'ARQUIVO' : 'ARQUIVOS'}</span>
          </div>
        </section>

        <UploadComponent onUploaded={handleUploaded} onError={setErrorMessage} />

        {errorMessage && (
          <div className="error-banner" role="alert">{errorMessage}</div>
        )}

        <section className="library-section" aria-labelledby="library-title">
          <div className="section-heading">
            <h2 id="library-title">Todos os arquivos</h2>
            <button
              className="refresh-button"
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={isLoading}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
          {isLoading ? (
            <div className="loading-state" role="status">Carregando documentos...</div>
          ) : (
            <DocumentList documents={documents} onError={setErrorMessage} />
          )}
        </section>
      </main>
      <footer className="page-footer">
        <span>ARMAZENAMENTO LOCAL</span>
        <span>DOCUMENT MANAGEMENT SYSTEM</span>
      </footer>
    </div>
  );
}
