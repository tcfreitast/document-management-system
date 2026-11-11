const documentRepository = require('../repositories/documentRepository');
const documentService = require('../services/documentService');

async function upload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Selecione um arquivo para enviar.' },
    });
  }

  if (req.file.size === 0) {
    try {
      await documentRepository.removeFile(req.file.filename);
    } catch (error) {
      return next(error);
    }

    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'O arquivo não pode estar vazio.' },
    });
  }

  return res.status(201).json(documentService.createDocument(req.file));
}

function list(_req, res) {
  return res.status(200).json(documentService.listDocuments());
}

function download(req, res, next) {
  const document = documentService.findDocument(req.params.id);

  if (!document) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Documento não encontrado.' },
    });
  }

  return res.download(
    documentRepository.getFilePath(document.storedName),
    document.originalName,
    (error) => {
      if (error) {
        next(error);
      }
    }
  );
}

module.exports = { upload, list, download };