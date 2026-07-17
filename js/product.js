/* ============================================================
   product.js — Amazon-style product detail page
   Reads ?id= from URL, fetches product (API or static fallback),
   renders image + brand + price/promo + bullet features +
   quantity + Add to Cart / Buy Now + About + specs + related.
   Editorial copy (features/specs/about) lives in DETAILS below;
   price/stock/promo come from the live catalog (admin-managed).
   ============================================================ */

const DETAILS = {
  scaler_blade: {
    zh: { features: ['多瓣快装卡扣，一插即用，通用全系列去鳞机', '316 海军级不锈钢，72 小时盐雾测试不锈', '激光开齿，去鳞利落不伤鱼肉', '备用装，关键时刻不断工'],
      about: '原厂替换刀头，与 Mini / Standard / Pro 全系去鳞机通用。316 不锈钢抗海水腐蚀，去鳞干净利落。',
      specs: [['材质', '316 不锈钢'], ['接口', '多瓣快装卡扣'], ['适用', 'Mini/Standard/Pro 全系'], ['包装', '单只装'], ['重量', '约 45 g']] },
    en: { features: ['Multi-petal quick-lock, tool-free swap on all scalers', '316 marine-grade stainless, 72h salt-spray tested', 'Laser-cut teeth descale fast without tearing flesh', 'Keep a spare so you never lose a fishing day'],
      about: 'OEM replacement head, compatible with every TailFin scaler. 316 stainless resists saltwater corrosion and scales cleanly.',
      specs: [['Material', '316 stainless steel'], ['Interface', 'Multi-petal quick-lock'], ['Fits', 'All Mini/Standard/Pro'], ['Pack', 'Single'], ['Weight', '~45 g']] }
  },
  vacuum_bags: {
    zh: { features: ['加厚 PA/PE 复合，防鱼刺穿刺不漏', '食品级材质，锁鲜防串味', '适配 ≥-75kPa 真空密封模块', '20 片装，常备复购'],
      about: '专为真空密封 cartridge 设计，加厚防穿刺，锁住鱼获新鲜、不漏血水。',
      specs: [['材质', 'PA/PE 食品级复合'], ['厚度', '≥110 μm'], ['数量', '20 片'], ['适配', '真空密封 cartridge'], ['尺寸', '28×35 cm']] },
    en: { features: ['Heavy PA/PE laminate resists fish-bone punctures', 'Food-grade, locks freshness, no odor transfer', 'Fits our ≥-75kPa vacuum sealer module', '20-pack, the natural reorder'],
      about: 'Made for the vacuum cartridge — puncture-proof and leak-free, keeping your catch fresh.',
      specs: [['Material', 'Food-grade PA/PE laminate'], ['Thickness', '≥110 μm'], ['Count', '20 bags'], ['Fits', 'Vacuum cartridge'], ['Size', '28×35 cm']] }
  },
  hose_replacement: {
    zh: { features: ['防踩踏 PU 软管，耐碾压不变形', '重力不锈钢滤网，阻隔杂物', '快插接口，3 米长够用', 'Standard/Pro 循环水系统通用'],
      about: '循环给水系统替换进水管，带重力滤网，直接从湖水海水取水。',
      specs: [['材质', 'PU + 304 不锈钢滤网'], ['长度', '3 m'], ['接口', '快插'], ['适配', 'Standard/Pro'], ['耐温', '-20~60 ℃']] },
    en: { features: ['Crush-proof PU hose, stands on it without kinking', 'Gravity stainless mesh filter blocks debris', 'Quick-connect, 3m reach', 'Fits Standard & Pro water systems'],
      about: 'Replacement intake hose for the circulating water system, with gravity filter to draw from lake or sea.',
      specs: [['Material', 'PU + 304 SS filter'], ['Length', '3 m'], ['Connector', 'Quick-connect'], ['Fits', 'Standard/Pro'], ['Temp', '-20~60 ℃']] }
  },
  electric_knife: {
    zh: { features: ['往复式锯齿刀片，切鱼如热刀切黄油', '防水航空插口供电，安全不漏电', '轻量 ergonomic 握把，长时间不累', 'Pro 中央仓 Pogo Pin 直供'],
      about: '12V 动力鱼刀，往复式刀齿轻松分切鱼片，防水航空插口供电。',
      specs: [['电压', '12V DC'], ['功率', '约 25W'], ['刀片', '不锈钢锯齿'], ['接口', '防水航空插'], ['适配', 'Pro 中央仓']] },
    en: { features: ['Reciprocating serrated blade slices like butter', 'Waterproof aviation plug, safe power', 'Light ergonomic grip, less fatigue', 'Pogo Pin direct from Pro center bay'],
      about: '12V reciprocating fillet knife with waterproof aviation plug for clean, fast filleting.',
      specs: [['Voltage', '12V DC'], ['Power', '~25W'], ['Blade', 'SS serrated'], ['Connector', 'Waterproof aviation'], ['Fits', 'Pro bay']] }
  },
  scissors: {
    zh: { features: ['开肚、剪鳍、剪骨三合一', '不锈钢刃口，锋利耐用', '弹簧助力，单手操作', '便于清洗，防鱼腥残留'],
      about: '一把搞定开肚、剪鳍、剪骨，钓鱼必备多功能剪刀。',
      specs: [['材质', '不锈钢'], ['功能', '开肚/剪鳍/剪骨'], ['助力', '弹簧回弹'], ['长度', '约 21 cm'], ['重量', '约 120 g']] },
    en: { features: ['Gut, fin, and bone-cut in one tool', 'Sharp stainless blades, built to last', 'Spring-assisted, one-hand operation', 'Easy to rinse, no fishy residue'],
      about: 'One scissor for gutting, finning, and bone-cutting — the angler’s everyday tool.',
      specs: [['Material', 'Stainless steel'], ['Use', 'Gut/fin/bone'], ['Action', 'Spring-assisted'], ['Length', '~21 cm'], ['Weight', '~120 g']] }
  },
  descaler_std: {
    zh: { features: ['100W 有刷电机，去鳞强劲', '316SS 滚齿刀头，耐用', 'PC 防飞溅罩，干净不脏手', '接点烟器 12V 供电'],
      about: 'Standard 同款单机去鳞机，100W 有刷电机，316 不锈钢滚齿刀头。',
      specs: [['电压', '12V DC'], ['功率', '100W'], ['刀头', '316SS 滚齿'], ['防护', 'IPX6 + PC 防溅罩'], ['供电', '点烟器']] },
    en: { features: ['100W brushed motor, strong scaling', '316 SS roller head, durable', 'PC splash guard keeps you clean', '12V cigarette-lighter power'],
      about: 'The same scaler from the Standard — 100W brushed motor with 316 SS roller head.',
      specs: [['Voltage', '12V DC'], ['Power', '100W'], ['Head', '316 SS roller'], ['Rating', 'IPX6 + PC guard'], ['Power', '12V socket']] }
  },
  descaler_pro: {
    zh: { features: ['200W 无刷电机，高扭矩低噪', 'PC 防飞溅罩', '适配 Pro 中央仓 Pogo Pin', '离网可用电池驱动'],
      about: 'Pro 同款单机去鳞机，200W 无刷电机，高扭矩应对大鱼硬鳞。',
      specs: [['电压', '24V DC'], ['功率', '200W 无刷'], ['刀头', '316SS 滚齿'], ['防护', 'IPX6 + PC 防溅罩'], ['供电', 'Pro 中央仓/电池']] },
    en: { features: ['200W brushless, high torque, low noise', 'PC splash guard', 'Pogo Pin into Pro bay', 'Runs off the battery off-grid'],
      about: 'The Pro scaler standalone — 200W brushless motor for tough, large-scale fish.',
      specs: [['Voltage', '24V DC'], ['Power', '200W brushless'], ['Head', '316 SS roller'], ['Rating', 'IPX6 + PC guard'], ['Power', 'Pro bay/battery']] }
  },
  battery_pack: {
    zh: { features: ['6S1P 约 50Wh，离网 ≥2 小时', 'BMS 双充：110V + 12V', 'Pogo Pin 盲插，热插拔', '过充过放短路全保护'],
      about: 'Pro 替换电池包，6S1P 约 50Wh，离网工作 ≥2 小时，双充保护。',
      specs: [['电压', '24V'], ['容量', '6S1P ~50Wh'], ['续航', '≥2 小时'], ['充电', '110V AC + 12V DC'], ['保护', 'BMS 全保护']] },
    en: { features: ['6S1P ~50Wh, 2h+ off-grid', 'BMS dual charge 110V + 12V', 'Pogo Pin hot-swap', 'Full over/under/short protection'],
      about: 'Pro replacement battery, 6S1P ~50Wh, 2h+ off-grid with dual charging protection.',
      specs: [['Voltage', '24V'], ['Capacity', '6S1P ~50Wh'], ['Runtime', '≥2 h'], ['Charge', '110V AC + 12V DC'], ['Protection', 'Full BMS']] }
  },
  vacuum_cartridge: {
    zh: { features: ['干湿两用 ≥-75kPa 强吸', '隐藏式液体收集盒，护泵', 'Pogo Pin 盲插接入中央仓', '与防穿刺真空袋配套'],
      about: 'Pro 中央仓真空密封模组，干湿两用，含液体收集盒，一键锁鲜。',
      specs: [['真空度', '≥-75kPa'], ['类型', '干湿两用'], ['接口', 'Pogo Pin 盲插'], ['附件', '液体收集盒'], ['适配', 'Pro 中央仓']] },
    en: { features: ['Wet/dry ≥-75kPa strong suction', 'Hidden liquid trap protects pump', 'Pogo Pin blind-mate into bay', 'Pairs with puncture-proof bags'],
      about: 'Pro center-bay vacuum module, wet/dry, with liquid trap for one-tap freshness.',
      specs: [['Vacuum', '≥-75kPa'], ['Type', 'Wet/Dry'], ['Mount', 'Pogo Pin blind-mate'], ['Extra', 'Liquid trap'], ['Fits', 'Pro bay']] }
  },
  hdpe_board: {
    zh: { features: ['食品级 HDPE，≥1.5cm 厚', '激光导流槽，排水不积血水', '双排 0–30 英寸量尺', '易清洗，不藏菌'],
      about: '替换测量砧板，食品级 HDPE，导流槽 + 双排量尺，处理鱼获更顺手。',
      specs: [['材质', '食品级 HDPE'], ['厚度', '≥1.5cm'], ['量尺', '0–30 英寸双排'], ['导流', '激光导流槽'], ['适配', 'Standard/Pro']] },
    en: { features: ['Food-grade HDPE, ≥1.5cm thick', 'Laser drainage grooves', 'Dual 0–30in ruler', 'Easy clean, no bacteria traps'],
      about: 'Replacement cutting board, food-grade HDPE with drainage grooves and dual ruler.',
      specs: [['Material', 'Food-grade HDPE'], ['Thickness', '≥1.5cm'], ['Ruler', '0–30in dual'], ['Drain', 'Laser grooves'], ['Fits', 'Standard/Pro']] }
  },
  oxford_pouch: {
    zh: { features: ['1680D 双股加厚，防泼水', '洗漱包大小，随手装', '内胆分隔，刀头配件不混', 'Mini 标配同款'],
      about: '1680D 牛津布收纳包，防泼水，收纳刀头、配件、真空袋，随车随钓。',
      specs: [['材质', '1680D 牛津布'], ['工艺', '双股加厚'], ['防水', '防泼水'], ['尺寸', '洗漱包大小'], ['适配', '全系']] },
    en: { features: ['1680D double-ply, water-resistant', 'Toiletry-bag size, grab & go', 'Inner dividers keep gear sorted', 'Same pouch as the Mini kit'],
      about: '1680D Oxford pouch, water-resistant, organizes blades, parts and bags for the trip.',
      specs: [['Material', '1680D Oxford'], ['Build', 'Double-ply'], ['Water', 'Splash-resistant'], ['Size', 'Toiletry-bag'], ['Fits', 'All']] }
  },
  water_bag: {
    zh: { features: ['10L 大容量，折叠便携', 'PVC 吹塑，轻量耐摔', '提手设计，取水轻松', 'Mini 标配同款'],
      about: '10L 折叠提水袋，轻量便携，野钓溪流随手取水或冲洗。',
      specs: [['容量', '10 L'], ['材质', 'PVC 吹塑'], ['重量', '约 180 g'], ['折叠', '可压扁收纳'], ['适配', '全系']] },
    en: { features: ['10L capacity, folds flat', 'Blow-molded PVC, light & tough', 'Carry handle, easy fill', 'Same bag as the Mini kit'],
      about: '10L collapsible water bag, lightweight, for hauling or rinsing at remote spots.',
      specs: [['Capacity', '10 L'], ['Material', 'Blow-molded PVC'], ['Weight', '~180 g'], ['Fold', 'Flat pack'], ['Fits', 'All']] }
  },
  pro_kit: {
    zh: { features: ['真空 cartridge + 24V 电池', '无刷去鳞机 + 电动鱼刀', 'Standard 一键升 Pro', '散买省 $57'],
      about: '4 模块升级套装，让你的 Standard 变身 Pro，原有箱体与备用去鳞机全部保留。',
      specs: [['包含', '真空/电池/去鳞机/鱼刀'], ['升级', 'Standard → Pro'], ['价格', '$499 (立减$50)'], ['适配', 'Standard'], ['省', '散买省 $57']] },
    en: { features: ['Vacuum cartridge + 24V battery', 'Brushless scaler + fillet knife', 'One kit: Standard → Pro', 'Save $57 vs separate'],
      about: '4-module kit turns your Standard into a Pro — your box and backup scaler stay.',
      specs: [['Includes', 'Vacuum/battery/scaler/knife'], ['Upgrade', 'Standard → Pro'], ['Price', '$499 ($50 OFF)'], ['Fits', 'Standard'], ['Save', '$57 vs separate']] }
  },
  mini: {
    zh: { features: ['与旗舰款相同的 316 不锈钢去鳞刀头与机身', '内置 12V 2200mAh 锂电池，Type-C 充电', '标配多功能鱼剪刀 + 10L 折叠水袋', '1680D 牛津布防泼水收纳包', '圣诞/父亲节礼品属性强'],
      about: '口袋大小的全功能去鳞机，内置电池离网工作，徒步皮划艇随手处理鱼获。',
      specs: [['类型', '手持去鳞机'], ['电池', '12V 2200mAh 内置'], ['充电', 'Type-C'], ['材质', '316 不锈钢'], ['适配', '随行']] },
    en: { features: ['Same 316 SS scaler head & body as the Pro', 'Built-in 12V 2200mAh battery, Type-C charge', 'Multi-function shears + 10L collapsible basin', '1680D Oxford waterproof pouch', 'Great gift for Christmas / Father’s Day'],
      about: 'Palm-sized full-feature scaler with built-in battery for off-grid use on the trail or kayak.',
      specs: [['Type', 'Handheld scaler'], ['Battery', '12V 2200mAh built-in'], ['Charge', 'Type-C'], ['Body', '316 stainless'], ['Use', 'On the go']] }
  },
  standard: {
    zh: { features: ['完整箱体 80×44×26cm，双层 ABS+PC', '12V 100W 有刷防水去鳞机', '循环给水 5L/min', 'HDPE 测量砧板 + 双排量尺', '中央仓工具抽屉收纳'],
      about: '皮卡车主的基础闭环：箱体 + 去鳞 + 给水 + 砧板，接点烟器即用，可升级到 Pro。',
      specs: [['箱体', '80×44×26cm ABS+PC'], ['去鳞机', '12V 100W'], ['水泵', '12V 5L/min'], ['砧板', 'HDPE 双排量尺'], ['供电', '12V 点烟器']] },
    en: { features: ['Full box 80×44×26cm, dual-layer ABS+PC', '12V 100W brushed waterproof scaler', 'Circulating water 5L/min', 'HDPE board w/ dual ruler', 'Center bay tool drawer'],
      about: 'The truck owner’s starter loop — box, scaler, water, board, plugs into the 12V socket, upgradable to Pro.',
      specs: [['Box', '80×44×26cm ABS+PC'], ['Scaler', '12V 100W'], ['Pump', '12V 5L/min'], ['Board', 'HDPE dual ruler'], ['Power', '12V socket']] }
  },
  pro: {
    zh: { features: ['24V 200W 无刷去鳞机', '12V 动力往复式电动鱼刀', '中央仓真空密封 ≥-75kPa', '24V 6S1P 电池离网 ≥2h', 'BMS 双充 110V+12V'],
      about: '移动加工厂：去鳞、切割、真空密封一体，离网工作 ≥2 小时，海钓冰钓通吃。',
      specs: [['去鳞机', '24V 200W 无刷'], ['鱼刀', '12V 往复式'], ['真空', '≥-75kPa'], ['电池', '24V 6S1P 50Wh'], ['充电', '110V+12V 双充']] },
    en: { features: ['24V 200W brushless scaler', '12V reciprocating fillet knife', 'Center bay vacuum sealer ≥-75kPa', '24V 6S1P battery, 2h+ off-grid', 'BMS dual charge 110V+12V'],
      about: 'A mobile fish factory — scale, fillet and vacuum seal in one, 2h+ off-grid for sea and ice fishing.',
      specs: [['Scaler', '24V 200W brushless'], ['Knife', '12V reciprocating'], ['Vacuum', '≥-75kPa'], ['Battery', '24V 6S1P 50Wh'], ['Charge', '110V+12V']] }
  }
};

function getDetailId() {
  return new URLSearchParams(window.location.search).get('id');
}

function normalizeProduct(p) {
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
  return Object.assign({}, p, { displayPrice: price, originalPrice: original, hasPromo });
}

async function fetchProduct(id) {
  try {
    const r = await fetch('/api/products/' + encodeURIComponent(id));
    if (r.ok) return normalizeProduct(await r.json());
  } catch (e) {}
  try {
    const r2 = await fetch('data/products.json');
    const d = await r2.json();
    const p = (d.products || []).find(x => x.id === id);
    if (p) return normalizeProduct(p);
  } catch (e) {}
  return null;
}

async function fetchCatalogList() {
  try {
    const r = await fetch('/api/products?active=true');
    if (r.ok) { const d = await r.json(); return (d.products || []).map(normalizeProduct); }
  } catch (e) {}
  try {
    const r2 = await fetch('data/products.json');
    const d = await r2.json();
    return (d.products || []).filter(p => p.active !== false).map(normalizeProduct);
  } catch (e) {}
  return [];
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let CURRENT_PRODUCT = null;

function renderDetail(p) {
  const L = window.currentLang || 'zh';
  const d = (DETAILS[p.id] && DETAILS[p.id][L]) || {};
  const features = d.features || [];
  const about = d.about || (p.desc[L] || p.desc.en || '');
  const specs = d.specs || [];
  const name = p.name[L] || p.name.en;

  document.title = name + ' | TailFin Marine';

  const catLabel = p.type === 'accessory'
    ? (L === 'zh' ? '配件与耗材' : 'Accessories')
    : (L === 'zh' ? '产品' : 'Products');

  let promoHTML = '';
  if (p.hasPromo && p.originalPrice) {
    const lbl = (p.promotion && (p.promotion.label[L] || p.promotion.label.en)) || 'SALE';
    promoHTML = `<span class="pd-old">$${p.originalPrice}</span>` + (lbl ? `<span class="pd-badge">${esc(lbl)}</span>` : '');
  }

  const avail = L === 'zh' ? '有货 · 预计 1–3 个工作日发货' : 'In Stock · Ships in 1–3 business days';
  const shipFrom = L === 'zh' ? '由 TailFin Marine 发货并销售' : 'Ships from and sold by TailFin Marine';
  const addLabel = L === 'zh' ? '加入购物车' : 'Add to Cart';
  const buyLabel = L === 'zh' ? '立即购买' : 'Buy Now';
  const aboutLabel = L === 'zh' ? '商品介绍' : 'About this item';
  const specLabel = L === 'zh' ? '产品规格' : 'Product details';
  const relLabel = L === 'zh' ? '看了又看' : 'Customers also bought';
  const qtyLabel = L === 'zh' ? '数量' : 'Qty';
  const notFound = L === 'zh' ? '未找到该商品' : 'Product not found';

  const root = document.getElementById('pd-root');
  if (!root) return;

  root.innerHTML = `
    <nav class="pd-breadcrumb">
      <a href="index.html">TailFin Marine</a> <span>/</span>
      <a href="index.html#${p.type === 'accessory' ? 'accessories' : 'products'}">${esc(catLabel)}</a> <span>/</span>
      <span class="pd-crumb-cur">${esc(name)}</span>
    </nav>

    <div class="pd-main">
      <div class="pd-gallery">
        <div class="pd-image"><img id="pd-img" src="${esc(p.image)}" alt="${esc(name)}"></div>
      </div>

      <div class="pd-buybox">
        <div class="pd-brand">TailFin Marine</div>
        <h1 class="pd-title">${esc(name)}</h1>
        <div class="pd-shipfrom">${esc(shipFrom)}</div>

        <div class="pd-price-block">
          <span class="pd-currency">$</span><span class="pd-price">${p.displayPrice}</span>
          ${promoHTML}
        </div>

        <div class="pd-availability"><span class="pd-dot"></span>${esc(avail)}</div>
        <hr class="pd-hr">

        <ul class="pd-bullets">
          ${features.map(f => `<li>${esc(f)}</li>`).join('')}
        </ul>

        <div class="pd-qty-row">
          <span class="pd-qty-label">${esc(qtyLabel)}</span>
          <div class="pd-qty">
            <button type="button" data-qty="dec" aria-label="decrease">−</button>
            <input id="pd-qty" type="text" value="1" inputmode="numeric" readonly>
            <button type="button" data-qty="inc" aria-label="increase">+</button>
          </div>
        </div>

        <div class="pd-actions">
          <button class="btn btn-add-cart pd-add" data-pd-add="${esc(p.id)}">${esc(addLabel)}</button>
          <button class="btn btn-buynow pd-buy" data-pd-buy="${esc(p.id)}">${esc(buyLabel)}</button>
        </div>
      </div>
    </div>

    <section class="pd-section">
      <h2 class="pd-section-title">${esc(aboutLabel)}</h2>
      <p class="pd-about">${esc(about)}</p>
      <ul class="pd-bullets pd-bullets-wide">
        ${features.map(f => `<li>${esc(f)}</li>`).join('')}
      </ul>
    </section>

    ${specs.length ? `
    <section class="pd-section">
      <h2 class="pd-section-title">${esc(specLabel)}</h2>
      <table class="pd-specs">
        ${specs.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}
      </table>
    </section>` : ''}

    <section class="pd-section">
      <h2 class="pd-section-title">${esc(relLabel)}</h2>
      <div class="pd-related" id="pd-related"><span class="pd-loading">…</span></div>
    </section>
  `;
}

function renderNotFound(id) {
  const L = window.currentLang || 'zh';
  const root = document.getElementById('pd-root');
  if (root) root.innerHTML = `<div class="pd-notfound"><h1>${L === 'zh' ? '未找到该商品' : 'Product not found'}</h1><p><a href="index.html">${L === 'zh' ? '返回首页' : 'Back to home'}</a></p></div>`;
  document.title = (L === 'zh' ? '未找到商品' : 'Not found') + ' | TailFin Marine';
}

async function loadRelated(p) {
  const list = await fetchCatalogList();
  const L = window.currentLang || 'zh';
  let others = list.filter(x => x.id !== p.id && x.type === 'accessory').slice(0, 4);
  if (others.length === 0) others = list.filter(x => x.id !== p.id).slice(0, 4);
  const el = document.getElementById('pd-related');
  if (!el) return;
  if (others.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = others.map(o => `
    <a class="pd-related-card" href="product.html?id=${encodeURIComponent(o.id)}">
      <div class="pd-related-img"><img src="${esc(o.image)}" alt="${esc(o.name[L] || o.name.en)}"></div>
      <div class="pd-related-name">${esc(o.name[L] || o.name.en)}</div>
      <div class="pd-related-price">$${o.displayPrice != null ? o.displayPrice : o.price}</div>
    </a>`).join('');
}

function bindDetailInteractions() {
  document.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    if (q) {
      const inp = document.getElementById('pd-qty');
      if (inp) {
        let v = parseInt(inp.value, 10) || 1;
        v = Math.max(1, v + (q.dataset.qty === 'inc' ? 1 : -1));
        inp.value = v;
      }
      return;
    }
    const add = e.target.closest('[data-pd-add]');
    if (add) {
      const qty = parseInt((document.getElementById('pd-qty') || {}).value, 10) || 1;
      if (typeof addToCart === 'function') addToCart(add.dataset.pdAdd, qty);
      return;
    }
    const buy = e.target.closest('[data-pd-buy]');
    if (buy) {
      const qty = parseInt((document.getElementById('pd-qty') || {}).value, 10) || 1;
      if (typeof addToCart === 'function') addToCart(buy.dataset.pdBuy, qty);
      window.location.href = 'checkout.html';
      return;
    }
  });
}

async function boot() {
  const id = getDetailId();
  if (!id) { renderNotFound(id); return; }
  const p = await fetchProduct(id);
  if (!p) { renderNotFound(id); return; }
  CURRENT_PRODUCT = p;
  renderDetail(p);
  loadRelated(p);
  bindDetailInteractions();

  // Re-render on language switch
  const obs = new MutationObserver(() => {
    if (CURRENT_PRODUCT) renderDetail(CURRENT_PRODUCT);
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
