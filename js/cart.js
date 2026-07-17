/* ============================================
   cart.js — Shopping Cart Logic
   ============================================ */

const PRODUCTS = {
  mini: {
    id: 'mini',
    name: { zh: 'The Pocket Scaler (Mini)', en: 'The Pocket Scaler (Mini)' },
    desc: { zh: '极简款 · 徒步/皮划艇', en: 'Lite · Hiking & Kayak' },
    price: 149,
    tier: 'mini'
  },
  standard: {
    id: 'standard',
    name: { zh: 'Tailgate Workstation (Standard)', en: 'Tailgate Workstation (Standard)' },
    desc: { zh: '基础款 · 皮卡车主', en: 'Standard · Truck Owners' },
    price: 499,
    tier: 'standard'
  },
  pro: {
    id: 'pro',
    name: { zh: 'Mobile Fish Factory (Pro)', en: 'Mobile Fish Factory (Pro)' },
    desc: { zh: '旗舰款 · 移动加工厂', en: 'Pro · Mobile Factory' },
    price: 999,
    tier: 'pro'
  }
};

const ACCESSORIES = {
  scaler_blade: {
    id: 'scaler_blade',
    name: { zh: '316不锈钢去鳞刀头 (替换装)', en: '316 SS Scaler Blade (Replacement)' },
    desc: { zh: '多瓣快装卡扣接口，通用替换', en: 'Multi-petal quick-lock interface, universal fit' },
    price: 29,
    tier: 'mini',
    img: 'assets/img/acc-blade.png'
  },
  vacuum_bags: {
    id: 'vacuum_bags',
    name: { zh: '防穿刺真空密封袋 (20片)', en: 'Puncture-Proof Vacuum Bags (20pk)' },
    desc: { zh: '防鱼刺穿刺，锁住新鲜不漏血水', en: 'Puncture-proof, locks in freshness, no leaks' },
    price: 19,
    tier: 'pro',
    img: 'assets/img/acc-bags.png'
  },
  hose_replacement: {
    id: 'hose_replacement',
    name: { zh: 'PU进水管替换 (3米)', en: 'PU Intake Hose Replacement (3m)' },
    desc: { zh: '防踩踏软管 + 重力不锈钢滤网', en: 'Crush-proof PU hose + gravity SS mesh filter' },
    price: 25,
    tier: 'standard',
    img: 'assets/img/acc-hose.png'
  },
  electric_knife: {
    id: 'electric_knife',
    name: { zh: '12V 动力往复式电动鱼刀', en: '12V Electric Fillet Knife' },
    desc: { zh: '往复式锯齿刀片，防水航空插口', en: 'Reciprocating blade, waterproof aviation plug' },
    price: 79,
    tier: 'pro',
    img: 'assets/img/acc-knife.png'
  },
  scissors: {
    id: 'scissors',
    name: { zh: '多功能不锈钢鱼剪刀', en: 'SS Multi-Function Fish Shears' },
    desc: { zh: '开肚、剪鳍、剪骨三合一', en: 'Gutting, finning, bone-cutting 3-in-1' },
    price: 15,
    tier: 'mini',
    img: 'assets/img/acc-scissors.png'
  },
  descaler_std: {
    id: 'descaler_std',
    name: { zh: '12V 有刷防水去鳞机 (单机)', en: '12V Brushed Waterproof Scaler' },
    desc: { zh: '100W功率，316SS滚齿刀头', en: '100W, 316 SS roller blade head' },
    price: 89,
    tier: 'standard',
    img: 'assets/img/acc-scaler.png'
  },
  descaler_pro: {
    id: 'descaler_pro',
    name: { zh: '24V 无刷高扭矩去鳞机 (单机)', en: '24V Brushless High-Torque Scaler' },
    desc: { zh: '200W无刷电机，PC防飞溅罩', en: '200W brushless motor, PC splash guard' },
    price: 129,
    tier: 'pro',
    img: 'assets/img/acc-scaler.png'
  },
  battery_pack: {
    id: 'battery_pack',
    name: { zh: '24V 锂电池包 (替换)', en: '24V Li-ion Battery Pack (Repl.)' },
    desc: { zh: '6S1P 约50Wh，BMS双充保护', en: '6S1P ~50Wh, BMS dual-charge protection' },
    price: 149,
    tier: 'pro',
    img: 'assets/img/acc-battery.png'
  },
  vacuum_cartridge: {
    id: 'vacuum_cartridge',
    name: { zh: '真空密封 cartridge 模组', en: 'Vacuum Sealer Cartridge' },
    desc: { zh: '干湿两用 ≥-75kPa，含液体收集盒，Pogo Pin 接入中央仓', en: 'Wet/dry ≥-75kPa, liquid trap, Pogo Pin bay mount' },
    price: 199,
    tier: 'pro',
    img: 'assets/img/acc-vacuum.png'
  },
  hdpe_board: {
    id: 'hdpe_board',
    name: { zh: 'HDPE 食品级测量砧板 (替换)', en: 'HDPE Cutting Board w/Ruler (Repl.)' },
    desc: { zh: '≥1.5cm厚，激光导流槽+双排量尺', en: '≥1.5cm thick, laser drainage + dual ruler' },
    price: 35,
    tier: 'standard',
    img: 'assets/img/acc-board.png'
  },
  oxford_pouch: {
    id: 'oxford_pouch',
    name: { zh: '1680D 牛津布收纳包', en: '1680D Oxford Waterproof Pouch' },
    desc: { zh: '双股加厚，防泼水洗漱包大小', en: 'Double-ply, waterproof, toiletry-bag size' },
    price: 25,
    tier: 'mini',
    img: 'assets/img/acc-pouch.png'
  },
  water_bag: {
    id: 'water_bag',
    name: { zh: '10L 折叠 PVC 提水袋', en: '10L Collapsible PVC Water Bag' },
    desc: { zh: '吹塑成型，轻量便携', en: 'Blow-molded, lightweight portable' },
    price: 18,
    tier: 'mini',
    img: 'assets/img/acc-waterbag.png'
  },
  pro_kit: {
    id: 'pro_kit',
    name: { zh: 'Pro 升级套装', en: 'Pro Upgrade Kit' },
    desc: { zh: '真空 cartridge + 24V 电池 + 无刷去鳞机 + 电动鱼刀', en: 'Vacuum cartridge + 24V battery + brushless scaler + fillet knife' },
    price: 499,
    tier: 'pro',
    img: 'assets/img/acc-kit.png',
    bundle: true
  }
};

function getAllProducts() {
  return window.CATALOG || {};
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
  showToast(currentLang === 'zh' ? '已加入购物车！' : 'Added to cart!');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  const allProducts = getAllProducts();
  return getCart().reduce((sum, item) => {
    const product = allProducts[item.id];
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function renderCart() {
  const container = document.getElementById('cart-container');
  if (!container) return;

  const cart = getCart();
  const allProducts = getAllProducts();
  const lang = currentLang;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-items">
        <div class="cart-empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <h3>${lang === 'zh' ? '购物车是空的' : 'Your cart is empty'}</h3>
          <p>${lang === 'zh' ? '去看看我们的产品吧！' : 'Check out our products!'}</p>
          <a href="index.html#products" class="btn btn-outline" style="margin-top: 1rem;">
            ${lang === 'zh' ? '继续购物' : 'Continue Shopping'}
          </a>
        </div>
      </div>
      <div class="cart-summary" style="display:none"></div>
    `;
    return;
  }

  let itemsHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const product = allProducts[item.id];
    if (!product) return;
    const itemTotal = product.price * item.qty;
    subtotal += itemTotal;

    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-img ${product.tier}">
          ${getProductImage(product)}
        </div>
        <div class="cart-item-info">
          <h4>${product.name[lang]}</h4>
          <p>${product.desc[lang]}</p>
        </div>
        <div class="cart-item-price">$${itemTotal.toLocaleString()}</div>
        <div class="cart-qty">
          <button onclick="updateQty('${item.id}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.id}', 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">&times;</button>
      </div>
    `;
  });

  const shipping = subtotal >= 300 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  container.innerHTML = `
    <div class="cart-items">
      ${itemsHTML}
    </div>
    <div class="cart-summary">
      <h3>${lang === 'zh' ? '订单摘要' : 'Order Summary'}</h3>
      <div class="summary-row">
        <span>${lang === 'zh' ? '小计' : 'Subtotal'}</span>
        <span>$${subtotal.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>${lang === 'zh' ? '运费' : 'Shipping'}</span>
        <span class="${shipping === 0 ? 'free' : ''}">${shipping === 0 ? (lang === 'zh' ? '免运费' : 'FREE') : '$' + shipping}</span>
      </div>
      <div class="summary-row">
        <span>${lang === 'zh' ? '税费' : 'Tax'}</span>
        <span>$${tax.toLocaleString()}</span>
      </div>
      <div class="summary-row total">
        <span>${lang === 'zh' ? '总计' : 'Total'}</span>
        <span>$${total.toLocaleString()}</span>
      </div>
      ${shipping > 0 ? `<p style="font-size:0.8125rem;color:var(--gray-500);margin-top:8px;">${lang === 'zh' ? `再加 $${300 - subtotal} 即可免运费` : `Add $${300 - subtotal} more for free shipping`}</p>` : ''}
      <a href="checkout.html" class="checkout-btn">
        ${lang === 'zh' ? '去结算' : 'Proceed to Checkout'}
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
      <a href="index.html#products" class="continue-shopping">${lang === 'zh' ? '继续购物' : 'Continue Shopping'}</a>
    </div>
  `;
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-summary');
  if (!container) return;

  const cart = getCart();
  const allProducts = getAllProducts();
  const lang = currentLang;

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:var(--gray-500);text-align:center;">${lang === 'zh' ? '购物车为空' : 'Cart is empty'}</p>`;
    return;
  }

  let itemsHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const product = allProducts[item.id];
    if (!product) return;
    const itemTotal = product.price * item.qty;
    subtotal += itemTotal;

    itemsHTML += `
      <div class="summary-row">
        <span>${product.name[lang]} × ${item.qty}</span>
        <span>$${itemTotal.toLocaleString()}</span>
      </div>
    `;
  });

  const shipping = subtotal >= 300 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  container.innerHTML = `
    <h3>${lang === 'zh' ? '订单摘要' : 'Order Summary'}</h3>
    ${itemsHTML}
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--gray-200);">
      <div class="summary-row">
        <span>${lang === 'zh' ? '小计' : 'Subtotal'}</span>
        <span>$${subtotal.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>${lang === 'zh' ? '运费' : 'Shipping'}</span>
        <span class="${shipping === 0 ? 'free' : ''}">${shipping === 0 ? (lang === 'zh' ? '免运费' : 'FREE') : '$' + shipping}</span>
      </div>
      <div class="summary-row">
        <span>${lang === 'zh' ? '税费' : 'Tax'}</span>
        <span>$${tax.toLocaleString()}</span>
      </div>
      <div class="summary-row total">
        <span>${lang === 'zh' ? '总计' : 'Total'}</span>
        <span>$${total.toLocaleString()}</span>
      </div>
    </div>
  `;
}

function getProductIcon(tier) {
  const icons = {
    mini: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="14" y="10" width="20" height="28" rx="4" fill="#EF9F27" opacity="0.3"/><rect x="18" y="14" width="12" height="6" rx="2" fill="#EF9F27"/><circle cx="24" cy="28" r="6" fill="none" stroke="#EF9F27" stroke-width="2"/></svg>`,
    standard: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="20" rx="3" fill="#185FA5" opacity="0.2" stroke="#185FA5" stroke-width="1.5"/><rect x="12" y="10" width="24" height="4" rx="1" fill="#185FA5"/><circle cx="16" cy="36" r="2" fill="#185FA5"/><circle cx="32" cy="36" r="2" fill="#185FA5"/></svg>`,
    pro: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="12" width="36" height="24" rx="4" fill="#0F6E56" opacity="0.2" stroke="#0F6E56" stroke-width="1.5"/><rect x="10" y="8" width="28" height="4" rx="1" fill="#0F6E56"/><circle cx="16" cy="30" r="3" fill="#0F6E56"/><rect x="24" y="26" width="12" height="8" rx="1" fill="#0F6E56" opacity="0.5"/></svg>`
  };
  return icons[tier] || icons.standard;
}

function getProductImage(product) {
  const L = window.currentLang || 'zh';
  if (product.img) {
    return `<img src="${product.img}" alt="${product.name[L] || product.name.en}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
  }
  return getProductIcon(product.tier);
}

function renderAccessories() {
  // Accessory rendering is owned by js/store.js (catalog-driven).
  // Kept for backward-compat; store.js handles the live DOM.
  if (window.__storeRendersAccessories) return;
  const container = document.getElementById('accessories-grid');
  if (!container) return;
  const lang = currentLang;
  const catalog = window.CATALOG || {};
  let html = '';
  Object.values(catalog).forEach(acc => {
    if (acc.type !== 'accessory') return;
    html += `
      <div class="accessory-card">
        <div class="accessory-card-img">
          ${getProductImage(acc)}
        </div>
        <div class="accessory-card-body">
          <h4 class="accessory-card-name">${acc.name[lang]}</h4>
          <p class="accessory-card-desc">${acc.desc[lang]}</p>
          <div class="accessory-card-price">$${acc.displayPrice != null ? acc.displayPrice : acc.price}</div>
          <button class="btn btn-add-cart" data-add-cart="${acc.id}">${i18n['btn_add_cart'] ? i18n['btn_add_cart'][lang] : 'Add to Cart'}</button>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

function placeOrder(event) {
  event.preventDefault();
  localStorage.removeItem('cart');
  updateCartCount();
  const lang = currentLang;
  const container = document.querySelector('.cart-page .container');
  if (container) {
    container.innerHTML = `
      <div style="text-align:center; padding: 4rem 2rem;">
        <div style="width:80px;height:80px;margin:0 auto 1.5rem;background:var(--teal-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;">
          <svg width="40" height="40" fill="none" stroke="#0F6E56" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 style="font-size:2rem;font-weight:700;color:var(--navy);margin-bottom:0.5rem;">${lang === 'zh' ? '订单提交成功！' : 'Order Placed Successfully!'}</h1>
        <p style="color:var(--gray-600);margin-bottom:2rem;">${lang === 'zh' ? '确认邮件已发送至您的邮箱。我们将尽快为您发货。' : 'A confirmation email has been sent. We will ship your order soon.'}</p>
        <a href="index.html" class="btn btn-primary btn-lg">${lang === 'zh' ? '返回首页' : 'Back to Home'}</a>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Add to cart buttons (static ones; dynamic ones handled by store.js delegation)
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-add-cart');
      addToCart(productId);
      btn.classList.add('added');
      const originalText = btn.textContent;
      btn.textContent = currentLang === 'zh' ? '已加入 ✓' : 'Added ✓';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = originalText;
      }, 1500);
    });
  });

  // Render cart page
  if (document.getElementById('cart-container')) {
    renderCart();
  }

  // Render checkout summary
  if (document.getElementById('checkout-summary')) {
    renderCheckoutSummary();
  }

  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      method.classList.add('active');
    });
  });

  // Re-render cart on language change
  const observer = new MutationObserver(() => {
    if (document.getElementById('cart-container')) renderCart();
    if (document.getElementById('checkout-summary')) renderCheckoutSummary();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
