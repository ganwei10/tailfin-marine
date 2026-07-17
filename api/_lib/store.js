'use strict';
/*
 * Shared product data store.
 * Used by both:
 *   - server.js            (local Node dev server)
 *   - api/products.js      (Vercel serverless function)
 *   - api/products/[id].js (Vercel serverless function)
 *
 * Persistence strategy:
 *   - On Vercel, if Vercel KV env vars are present (KV_REST_API_URL /
 *     KV_REST_API_TOKEN), all reads/writes go to KV (durable across
 *     invocations). On first read, KV is seeded from data/products.json.
 *   - Locally (no KV env), reads/writes use data/products.json on disk.
 *   - On Vercel WITHOUT KV connected, reads still work (from the bundled
 *     JSON), but writes return a 503 so the admin UI can prompt the owner
 *     to connect Vercel KV (one click in the dashboard).
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// ---- Vercel KV (optional, lazy-loaded) ----
let kvClient = null;
let kvReady = false;
async function getKv() {
  if (kvReady) return kvClient;
  kvReady = true;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const mod = await import('@vercel/kv');
      kvClient = mod.kv;
    } catch (e) {
      kvClient = null;
    }
  }
  return kvClient;
}

function defaultDoc() {
  return { updatedAt: new Date().toISOString(), currency: 'USD', products: [] };
}

function loadFile() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return defaultDoc();
  }
}

async function readProducts() {
  const kv = await getKv();
  if (kv) {
    let doc = await kv.get('products');
    if (!doc) {
      doc = loadFile();
      await kv.set('products', doc);
    }
    return doc;
  }
  return loadFile();
}

async function writeProducts(doc) {
  doc.updatedAt = new Date().toISOString();
  const kv = await getKv();
  if (kv) {
    await kv.set('products', doc);
    return { ok: true, persisted: 'kv' };
  }
  if (process.env.VERCEL) {
    // Vercel's filesystem is read-only at runtime without a KV store.
    return { ok: false, persisted: false, error: 'NO_KV' };
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(doc, null, 2), 'utf-8');
  return { ok: true, persisted: 'file' };
}

function normalizeProduct(body) {
  return {
    id: String(body.id),
    type: body.type || 'accessory',
    category: body.category || 'module',
    tier: body.tier || 'standard',
    name: (body.name && (body.name.zh || body.name.en)) ? body.name : { zh: '', en: '' },
    desc: (body.desc && (body.desc.zh || body.desc.en)) ? body.desc : { zh: '', en: '' },
    price: Number(body.price),
    compareAtPrice: body.compareAtPrice != null ? Number(body.compareAtPrice) : null,
    active: body.active !== false,
    image: body.image || '',
    bundle: !!body.bundle,
    promotion: Object.assign(
      { enabled: false, type: 'none', value: 0, label: { zh: '', en: '' } },
      body.promotion || {}
    )
  };
}

async function createProduct(body) {
  if (!body || !body.id || !body.name || body.price == null) {
    return { error: 'id, name, price required', code: 400 };
  }
  const doc = await readProducts();
  if (doc.products.find(p => p.id === String(body.id))) {
    return { error: 'id already exists', code: 409 };
  }
  const product = normalizeProduct(body);
  doc.products.push(product);
  const w = await writeProducts(doc);
  if (!w.ok) return { error: 'storage unavailable — connect Vercel KV to enable admin writes', code: 503 };
  return { product, code: 201 };
}

async function updateProduct(id, body) {
  const doc = await readProducts();
  const p = doc.products.find(x => x.id === id);
  if (!p) return { error: 'not found', code: 404 };
  ['type', 'category', 'tier', 'name', 'desc', 'image', 'bundle'].forEach(k => {
    if (body[k] !== undefined) p[k] = body[k];
  });
  if (body.price != null) p.price = Number(body.price);
  if (body.compareAtPrice !== undefined) {
    p.compareAtPrice = body.compareAtPrice != null ? Number(body.compareAtPrice) : null;
  }
  if (body.active !== undefined) p.active = !!body.active;
  if (body.promotion !== undefined) {
    p.promotion = Object.assign(
      { enabled: false, type: 'none', value: 0, label: { zh: '', en: '' } },
      body.promotion
    );
  }
  const w = await writeProducts(doc);
  if (!w.ok) return { error: 'storage unavailable — connect Vercel KV to enable admin writes', code: 503 };
  return { product: p, code: 200 };
}

async function deleteProduct(id) {
  const doc = await readProducts();
  const before = doc.products.length;
  doc.products = doc.products.filter(x => x.id !== id);
  if (doc.products.length === before) return { error: 'not found', code: 404 };
  const w = await writeProducts(doc);
  if (!w.ok) return { error: 'storage unavailable — connect Vercel KV to enable admin writes', code: 503 };
  return { ok: true, code: 200 };
}

module.exports = {
  readProducts,
  writeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  loadFile
};
