/* ============================================================
   TailFin Marine — Local dev server (Node.js, zero deps)
   Serves the static site + REST API for local development.
   On Vercel the same API is provided by api/products.js and
   api/products/[id].js (serverless functions); this file is
   only used for `node server.js` local development.

   API:
     GET    /api/products[?active=true]   list products
     GET    /api/products/:id              get one
     POST   /api/products                  create  (admin token)
     PUT    /api/products/:id              update  (admin token)
     DELETE /api/products/:id              delete  (admin token)
   Admin token: header x-admin-token (default 'tailfin-admin')
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const store = require('./api/_lib/store');

const ROOT = __dirname;
const PORT = process.env.PORT || 8090;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tailfin-admin';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// ---------- Helpers ----------
function sendJSON(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
function isAdmin(req) {
  return req.headers['x-admin-token'] === ADMIN_TOKEN;
}
function serveStatic(req, res, pathname) {
  let filePath = path.join(ROOT, pathname);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  if (pathname === '/' || pathname === '') filePath = path.join(ROOT, 'index.html');
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); return res.end('Not found: ' + pathname);
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

// ---------- API ----------
async function handleApi(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean); // ['api','products', ':id?']
  const isList = parts.length === 2;
  const id = parts[2];

  // GET list
  if (req.method === 'GET' && isList) {
    const doc = await store.readProducts();
    let list = doc.products;
    if (url.searchParams.get('active') === 'true') list = list.filter(p => p.active);
    return sendJSON(res, 200, { products: list, currency: doc.currency });
  }

  // GET one
  if (req.method === 'GET' && id) {
    const doc = await store.readProducts();
    const p = doc.products.find(x => x.id === id);
    return p ? sendJSON(res, 200, p) : sendJSON(res, 404, { error: 'not found' });
  }

  // Write operations require admin token
  if (!isAdmin(req)) return sendJSON(res, 401, { error: 'unauthorized' });

  // CREATE
  if (req.method === 'POST' && isList) {
    const body = await readBody(req);
    const r = await store.createProduct(body);
    return sendJSON(res, r.code, r.error ? { error: r.error } : r.product);
  }

  // UPDATE
  if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
    const body = await readBody(req);
    const r = await store.updateProduct(id, body);
    return sendJSON(res, r.code, r.error ? { error: r.error } : r.product);
  }

  // DELETE
  if (req.method === 'DELETE' && id) {
    const r = await store.deleteProduct(id);
    return sendJSON(res, r.code, r.error ? { error: r.error } : { ok: true });
  }

  return sendJSON(res, 405, { error: 'method not allowed' });
}

// ---------- Server ----------
const server = http.createServer(async (req, res) => {
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch (e) { url = new URL('http://localhost/'); }
  const pathname = decodeURIComponent(url.pathname);

  try {
    if (pathname.startsWith('/api/')) {
      return await handleApi(req, res, url);
    }
    return serveStatic(req, res, pathname);
  } catch (e) {
    sendJSON(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`TailFin e-commerce server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`Admin token: ${ADMIN_TOKEN}`);
});
