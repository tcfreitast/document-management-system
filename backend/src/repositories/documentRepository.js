const fs = require('node:fs/promises');
const path = require('node:path');
const { storageDirectory } = require('../config/storage');

const documents = new Map();

function create(document) {
  documents.set(document.id, document);
  return document;
}

function findAll() {
  return [...documents.values()].sort(
    (first, second) => second.uploadedAt.localeCompare(first.uploadedAt)
  );
}

function findById(id) {
  return documents.get(id) || null;
}

function getFilePath(storedName) {
  return path.join(storageDirectory, storedName);
}

async function removeFile(storedName) {
  try {
    await fs.unlink(getFilePath(storedName));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

module.exports = { create, findAll, findById, getFilePath, removeFile };