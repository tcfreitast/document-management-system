const { after, test } = require('node:test');
const assert = require('node:assert');
const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');

const testStorageDirectory = fsSync.mkdtempSync(
  path.join(os.tmpdir(), 'dms-test-')
);
process.env.STORAGE_DIR = testStorageDirectory;
process.env.MAX_FILE_SIZE = '9';

const app = require('../src/app');

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('upload, listagem, download e erros dos documentos', async (context) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const missingFileResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: new FormData(),
  });
  assert.strictEqual(missingFileResponse.status, 400);

  const emptyForm = new FormData();
  emptyForm.append('file', new Blob([]), 'empty.txt');
  const emptyResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: emptyForm,
  });
  assert.strictEqual(emptyResponse.status, 400);

  const oversizedForm = new FormData();
  oversizedForm.append('file', new Blob(['1234567890']), 'large.txt');
  const oversizedResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: oversizedForm,
  });
  assert.strictEqual(oversizedResponse.status, 413);

  const form = new FormData();
  form.append('file', new Blob(['conteudo']), 'relatorio.txt');
  const uploadResponse = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form });
  assert.strictEqual(uploadResponse.status, 201);
  const document = await uploadResponse.json();
  assert.strictEqual(document.originalName, 'relatorio.txt');
  assert.strictEqual(document.size, 8);
  assert.strictEqual(document.owner, 'local-user');
  assert.ok(Number.isFinite(Date.parse(document.uploadedAt)));
  assert.ok(document.id);
  assert.ok(!Object.hasOwn(document, 'storedName'));

  const listResponse = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(listResponse.status, 200);
  assert.deepStrictEqual(await listResponse.json(), [document]);

  const downloadResponse = await fetch(`${baseUrl}/documents/${document.id}/download`);
  assert.strictEqual(downloadResponse.status, 200);
  assert.match(downloadResponse.headers.get('content-disposition'), /relatorio\.txt/);
  assert.strictEqual(await downloadResponse.text(), 'conteudo');

  const notFoundResponse = await fetch(`${baseUrl}/documents/unknown/download`);
  assert.strictEqual(notFoundResponse.status, 404);
});

after(async () => {
  if (testStorageDirectory) {
    await fs.rm(testStorageDirectory, { recursive: true, force: true });
  }
});
