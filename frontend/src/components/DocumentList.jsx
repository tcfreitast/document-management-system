import DownloadButton from './DownloadButton.jsx';

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function DocumentList({ documents, onError }) {
  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">D</span>
        <p>Nenhum documento por aqui.</p>
      </div>
    );
  }

  return (
    <div className="document-table-wrap">
      <table className="document-table">
        <thead>
          <tr>
            <th scope="col">Documento</th>
            <th scope="col">Tamanho</th>
            <th scope="col">Adicionado</th>
            <th scope="col"><span className="visually-hidden">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>
                <div className="document-name">
                  <span className="document-mark" aria-hidden="true">DOC</span>
                  <span title={document.originalName}>{document.originalName}</span>
                </div>
              </td>
              <td className="metadata-cell">{formatFileSize(document.size)}</td>
              <td className="metadata-cell">{formatDate(document.uploadedAt)}</td>
              <td className="action-cell">
                <DownloadButton
                  documentId={document.id}
                  fileName={document.originalName}
                  onError={onError}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}