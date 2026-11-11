const express = require('express');
const multer = require('multer');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', documentRoutes);

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE';
    return res.status(tooLarge ? 413 : 400).json({
      error: {
        code: tooLarge ? 'FILE_TOO_LARGE' : 'VALIDATION_ERROR',
        message: tooLarge
          ? 'O arquivo excede o limite permitido.'
          : 'O envio do arquivo é inválido.',
      },
    });
  }

  if (error.code === 'ENOENT') {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Arquivo do documento não encontrado.' },
    });
  }

  console.error(error);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Não foi possível processar a solicitação.' },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
