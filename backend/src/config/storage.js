const fs = require('node:fs');
const path = require('node:path');

const storageDirectory = path.resolve(
  process.env.STORAGE_DIR || path.join(__dirname, '../../storage')
);
const configuredMaxFileSize = Number(process.env.MAX_FILE_SIZE);
const maxFileSize = Number.isSafeInteger(configuredMaxFileSize)
  && configuredMaxFileSize > 0
  ? configuredMaxFileSize
  : 10 * 1024 * 1024;
const defaultOwner = process.env.DEFAULT_OWNER || 'local-user';

fs.mkdirSync(storageDirectory, { recursive: true });

module.exports = { storageDirectory, maxFileSize, defaultOwner };