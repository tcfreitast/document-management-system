const { randomUUID } = require('node:crypto');
const path = require('node:path');
const documentRepository = require('../repositories/documentRepository');
const { defaultOwner } = require('../config/storage');

function toPublicDocument(document) {
  const { storedName, ...publicDocument } = document;
  return publicDocument;
}

function createDocument(file) {
  const originalName = path.basename(file.originalname.replace(/\\/g, '/')) || 'document';
  const document = documentRepository.create({
    id: randomUUID(),
    originalName,
    storedName: file.filename,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: defaultOwner,
  });

  return toPublicDocument(document);
}

function listDocuments() {
  return documentRepository.findAll().map(toPublicDocument);
}

function findDocument(id) {
  return documentRepository.findById(id);
}

module.exports = { createDocument, listDocuments, findDocument };