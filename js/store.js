/* ============================================================
   store.js — Product catalog (API-driven) + dynamic rendering
   Reads from /api/products (Node backend) or falls back to
   data/products.json (static hosting). Respects active flag,
   price and promotion set in the admin panel.
   ============================================================ */

// Marketing feature copy per main product (not admin-managed)
const PRODUCT_FEATURES = {
  mini: {
    zh: ['与旗舰款相同的 316 不锈钢去鳞刀头与机身', '内置 12V 2200mAh 锂电池，Type-C 充电', '标配多功能鱼剪刀 + 10L 折叠水袋', '1680D 牛津布防泼水收纳包', '圣诞 / 父亲节礼品属性强'],
    en: ['Same 316 SS scaler head & body as the Pro', 'Built-in 12V 2200mAh battery, Type-C charge', 'Multi-function shears + 10L collapsible basin', '1680D Oxford waterproof pouch', 'Great gift for Christmas / Father’s Day']
  },
  standard: {
    zh: ['完整箱体 80×44×26cm，双层 ABS+PC 滚塑', '12V 100W 有刷防水手持去鳞机', '循环给水系统：12V 隔膜泵 5L/min', 'HDPE 测量砧板 + 0–30 英寸双排量尺', '中央仓：工具抽屉收纳', '有线供电：5m 硅胶线接点烟器'],
    en: ['Full 80×44×26cm box, dual-layer ABS+PC', '12V 100W brushed waterproof scaler', 'Circulating water: 12V diaphragm pump 5L/min', 'HDPE board w/ 0–30in dual ruler', 'Center bay: tool storage drawer', 'Wired: 5m silicone cord to 12V socket']
  },
  pro: {
    zh: ['24V 200W 无刷高扭矩去鳞机', '12V 动力往复式电动鱼刀', '中央仓：真空密封模块 ≥-75kPa', '24V 6S1P 锂电池，离网工作 ≥2 小时', 'BMS 双充：110V 交流 + 12V 车载', '隐藏式液体收集盒，防气泵烧毁'],
    en: ['24V 200W brushless high-torque scaler', '12V reciprocating electric fillet knife', 'Center bay: vacuum sealer ≥-75kPa', '24V 6S1P battery, off-grid ≥2h', 'BMS dual charge: 110V AC + 12V DC', 'Hidden liquid trap protects the pump']
  }
};

const TIER_LABEL = {
  mini: { zh: '极简款 LITE', en: 'LITE' },
  standard: { zh: '基础款 STANDARD', en: 'STANDARD' },
  pro: { zh: '旗舰款 PRO', en: 'PRO' }
};

function lang() { return window.currentLang || (document.documentElement.lang === 'en' ? 'en' : 'zh'); }

function computeDisplay(p) {
  const pr = p.promotion || {};
  let price = Number(p.price);
  let original = p.compareAtPrice != null ? Number(p.compareAtPrice) : null;
  let hasPromo = false;
  if (pr.enabled && Number(pr.value) > 0) {
    hasPromo = true;
    if (!original) original = price;
    if (pr.type === 'percent') price = Math.round(price * (1 - Number(pr.value) / 100));
    else if (pr.type === 'fixed') price = Math.max(0, price - Number(pr.value));
  }
  return { displayPrice: price, originalPrice: original, hasPromo };
}

function buildCatalog(list) {
  const cat = {};
  (list || []).forEach(p => {
    if (p.active === false) return; // 上下架：下架不进目录
    const d = computeDisplay(p);
    cat[p.id] = Object.assign({}, p, d);
  });
  return cat;
}

let CATALOG = {};
window.CATALOG = CATALOG;
window.getCatalog = () => CATALOG;
window.getProduct = id => CATALOG[id];

function promoBadgeHTML(p) {
  if (!p.hasPromo) return '';
  const label = (p.promotion && (p.promotion.label[lang()] || p.promotion.label.en)) || 'SALE';
  return `<span class="price-old">$${p.originalPrice}</span><span class="price-badge">${label}</span>`;
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const L = lang();
  const mains = ['mini', 'standard', 'pro']
    .map(id => CATALOG[id]).filter(Boolean);
  if (mains.length === 0) { grid.innerHTML = '<p style="color:#888">No products available.</p>'; return; }
  grid.innerHTML = mains.map(p => {
    const tier = p.tier;
    const features = (PRODUCT_FEATURES[p.id] && PRODUCT_FEATURES[p.id][L]) || [];
    const featured = p.id === 'pro' ? ' featured' : '';
    const badge = p.id === 'pro' ? ' data-badge="BEST SELLER"' : '';
    return `<div class="product-card${featured}"${badge} data-open-product="${p.id}">
      <div class="product-visual ${tier}">
        <img src="${p.image}" alt="${p.name[L] || p.name.en}">
      </div>
      <div class="product-info">
        <div class="product-tier ${tier}">${TIER_LABEL[tier] ? TIER_LABEL[tier][L] : tier.toUpperCase()}</div>
        <h3 class="product-name">${p.name[L] || p.name.en}</h3>
        <p class="product-tagline">${p.desc[L] || p.desc.en || ''}</p>
        <div class="product-price"><span class="currency">$</span><span>${p.displayPrice}</span>${promoBadgeHTML(p)}</div>
        <ul class="product-features">
          ${features.map(f => `<li class="${tier}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>${f}</span></li>`).join('')}
        </ul>
        <div class="product-actions">
          <button class="btn btn-add-cart" data-add-cart="${p.id}">${i18n && i18n['btn_add_cart'] ? i18n['btn_add_cart'][L] : 'Add to Cart'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function starsHTML(rating) {
  const r = Number(rating) || 0;
  const full = Math.floor(r);
  const half = (r - full) >= 0.5;
  let s = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= full) s += '<span class="star full">&#9733;</span>';
    else if (i === full + 1 && half) s += '<span class="star half">&#9733;</span>';
    else s += '<span class="star">&#9733;</span>';
  }
  return `<span class="stars" aria-label="${r} out of 5">${s}</span>`;
}

function renderAccessories() {
  const grid = document.getElementById('accessories-grid');
  if (!grid) return;
  const L = lang();
  const addLabel = (i18n && i18n['btn_add_cart'] && i18n['btn_add_cart'][L]) ? i18n['btn_add_cart'][L] : 'Add to Cart';
  const list = Object.values(CATALOG).filter(p => p.type === 'accessory');
  if (list.length === 0) { grid.innerHTML = ''; return; }
  grid.innerHTML = list.map(p => `
    <div class="accessory-card" data-open-product="${p.id}">
      <div class="accessory-card-img"><img src="${p.image}" alt="${p.name[L] || p.name.en}" loading="lazy"></div>
      <div class="accessory-card-body">
        <h4 class="accessory-card-name">${p.name[L] || p.name.en}</h4>
        <div class="accessory-card-rating">
          ${starsHTML(p.rating)}
          <span class="rating-count">${p.reviews != null ? p.reviews : ''}</span>
        </div>
        <div class="accessory-card-price">$${p.displayPrice}${promoBadgeHTML(p)}</div>
        <p class="accessory-card-desc">${p.desc[L] || p.desc.en || ''}</p>
        <button class="btn btn-add-cart" data-add-cart="${p.id}">${addLabel}</button>
      </div>
    </div>`).join('');
}

function syncUpgradeKitPrice() {
  const kit = CATALOG['pro_kit'];
  const el = document.querySelector('#upgrade .upgrade-kit-price');
  if (kit && el) {
    let txt = '$' + kit.displayPrice;
    if (kit.hasPromo && kit.originalPrice) txt += ` <span style="text-decoration:line-through;color:#999;font-size:1rem;font-weight:400;">$${kit.originalPrice}</span>`;
    el.innerHTML = txt;
  }
  // also note line
  const note = document.querySelector('#upgrade .upgrade-note');
  if (kit && note) {
    const L = lang();
    note.textContent = L === 'zh'
      ? `散买 4 模块 $${(199+149+129+79)}，套装立省更多。直接买 Pro 整机亦同价 $999。`
      : `Buy 4 modules separately $${(199+149+129+79)}, kit saves more. Full Pro also $999.`;
  }
}

function bindAddToCart() {
  document.removeEventListener('click', onAddClick);
  document.addEventListener('click', onAddClick);
}

function bindOpenProduct() {
  document.removeEventListener('click', onCardOpen);
  document.addEventListener('click', onCardOpen);
}
function onCardOpen(e) {
  if (e.target.closest('[data-add-cart]')) return; // let add-to-cart handle the click
  const card = e.target.closest('[data-open-product]');
  if (!card) return;
  const id = card.getAttribute('data-open-product');
  window.location.href = 'product.html?id=' + encodeURIComponent(id);
}
function onAddClick(e) {
  const btn = e.target.closest('[data-add-cart]');
  if (!btn) return;
  e.preventDefault();
  const id = btn.getAttribute('data-add-cart');
  if (typeof addToCart === 'function') addToCart(id);
  btn.classList.add('added');
  const original = btn.textContent;
  btn.textContent = (window.currentLang === 'zh') ? '已加入 ✓' : 'Added ✓';
  setTimeout(() => { btn.classList.remove('added'); btn.textContent = original; }, 1500);
}

async function initCatalog() {
  let list = null;
  try {
    const r = await fetch('/api/products?active=true');
    if (r.ok) { const d = await r.json(); list = d.products; }
  } catch (e) { /* API unavailable, fall back */ }
  if (!list) {
    try {
      const r2 = await fetch('data/products.json');
      const d2 = await r2.json();
      list = (d2.products || []).filter(p => p.active !== false);
    } catch (e2) { list = []; }
  }
  CATALOG = buildCatalog(list);
  window.CATALOG = CATALOG;

  renderProducts();
  renderAccessories();
  syncUpgradeKitPrice();

  if (typeof renderCart === 'function' && document.getElementById('cart-container')) renderCart();
  if (typeof renderCheckoutSummary === 'function' && document.getElementById('checkout-summary')) renderCheckoutSummary();

  bindAddToCart();
  bindOpenProduct();

  // Re-render on language switch
  const obs = new MutationObserver(() => {
    renderProducts();
    renderAccessories();
    syncUpgradeKitPrice();
    if (typeof renderCart === 'function' && document.getElementById('cart-container')) renderCart();
    if (typeof renderCheckoutSummary === 'function' && document.getElementById('checkout-summary')) renderCheckoutSummary();
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.dispatchEvent(new Event('catalog:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalog);
} else {
  initCatalog();
}
