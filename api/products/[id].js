'use strict';
/*
 * Vercel serverless function — /api/products/:id
 *   GET    /api/products/:id  -> get one
 *   PUT    /api/products/:id  -> update (requires x-admin-token)
 *   PATCH  /api/products/:id  -> update (requires x-admin-token)
 *   DELETE /api/products/:id  -> delete (requires x-admin-token)
 */
const { readProducts, updateProduct, deleteProduct } = require('../_lib/store');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'tailfin-admin';

function send(res, code, obj, extra) {
  res.writeHead(code, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token'
  }, extra || {}));
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

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const id = url.pathname.split('/').filter(Boolean)[2] || req.query.id;
  if (req.method === 'OPTIONS') return send(res, 204, {}, { 'Access-Control-Max-Age': '86400' });

  try {
    if (req.method === 'GET') {
      const doc = await readProducts();
      const p = doc.products.find(x => x.id === id);
      return send(res, p ? 200 : 404, p ? p : { error: 'not found' });
    }
    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (req.headers['x-admin-token'] !== ADMIN_TOKEN) return send(res, 401, { error: 'unauthorized' });
      const body = await readBody(req);
      const r = await updateProduct(id, body);
      return send(res, r.code, r.error ? { error: r.error } : r.product);
    }
    if (req.method === 'DELETE') {
      if (req.headers['x-admin-token'] !== ADMIN_TOKEN) return send(res, 401, { error: 'unauthorized' });
      const r = await deleteProduct(id);
      return send(res, r.code, r.error ? { error: r.error } : { ok: true });
    }
    return send(res, 405, { error: 'method not allowed' });
  } catch (e) {
    return send(res, 500, { error: e.message });
  }
};
