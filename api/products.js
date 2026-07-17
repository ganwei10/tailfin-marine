'use strict';
/*
 * Vercel serverless function — /api/products
 *   GET  /api/products[?active=true]  -> list products
 *   POST /api/products                -> create (requires x-admin-token)
 */
const { readProducts, createProduct } = require('./_lib/store');

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
  if (req.method === 'OPTIONS') return send(res, 204, {}, { 'Access-Control-Max-Age': '86400' });

  try {
    if (req.method === 'GET') {
      const doc = await readProducts();
      let list = doc.products;
      if (url.searchParams.get('active') === 'true') list = list.filter(p => p.active);
      return send(res, 200, { products: list, currency: doc.currency });
    }
    if (req.method === 'POST') {
      if (req.headers['x-admin-token'] !== ADMIN_TOKEN) return send(res, 401, { error: 'unauthorized' });
      const body = await readBody(req);
      const r = await createProduct(body);
      return send(res, r.code, r.error ? { error: r.error } : r.product);
    }
    return send(res, 405, { error: 'method not allowed' });
  } catch (e) {
    return send(res, 500, { error: e.message });
  }
};
