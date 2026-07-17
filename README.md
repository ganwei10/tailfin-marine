# TailFin Marine — 卡车尾门移动鱼类加工工作站

面向北美皮卡 / SUV 车主的移动鱼类加工工作站电商官网（中英文）。支持产品浏览、加购、结算，以及后台的**上架/下架、价格管理、促销政策**。

站点零依赖：前端为静态 HTML/CSS/JS，后端为 Vercel Serverless Functions（本地用 `node server.js` 等价运行）。

## GitHub 仓库 & 自动推送

- 仓库地址：https://github.com/ganwei10/tailfin-marine （公开，可直接克隆 / Vercel 导入）
- 分支：`main`。每次站点更新都会自动提交并推送到该仓库（连接器鉴权，无需手动输入 token）。
- 手动同步：`scripts/push.sh "你的提交说明"` —— 仅在确有改动时提交，随后 `git push`。

## 目录结构

```
.
├── index.html            # 官网首页（产品 / 配件 / 升级 / 场景）
├── product.html          # 商品详情页（仿亚马逊：大图 / 价格 / 卖点 / 规格 / 相关推荐）
├── cart.html             # 购物车
├── checkout.html         # 结算
├── admin.html            # 电商管理后台（上架/下架/改价/促销）
├── css/                  # 样式（style.css 站点 / product.css 详情页）
├── js/                   # 前端逻辑（i18n / store / cart / product）
├── assets/img/           # 产品与场景渲染图（配件为白底真实产品图）
├── data/products.json    # 商品数据源（单一事实来源）
├── server.js             # 本地开发服务器（与线上 API 同源）
├── api/                  # Vercel Serverless Functions
│   ├── products.js       # GET 列表 / POST 新增
│   └── products/[id].js  # GET/PUT/DELETE 单品
├── package.json
└── vercel.json
```

## 本地开发

```bash
node server.js          # 默认 http://localhost:8090
```

- 官网：      http://localhost:8090/
- 管理后台：  http://localhost:8090/admin.html

管理后台写操作需要请求头 `x-admin-token`，默认值为 `tailfin-admin`（可用环境变量 `ADMIN_TOKEN` 覆盖）。

## 部署到 Vercel

**方式一：连接 GitHub（推荐，自动部署 + 预览）**
1. 在 Vercel 控制台「Add New → Project」，导入仓库 `ganwei10/tailfin-marine`。
2. Framework Preset 选 **Other**（已由 `vercel.json` 指定），无需构建命令。
3. 点击 Deploy。每次 `git push` 自动重新部署，PR 自动生成预览环境。

**方式二：Vercel CLI**
```bash
npx vercel            # 预览
npx vercel --prod     # 生产
```

### 让后台「改价 / 上架」在 Vercel 上持久化（关键）
Vercel 运行时机器的文件系统是只读的，因此后台的写操作需要一个可持久化存储。本项目集成 **Vercel KV**：

1. 在 Vercel 项目里 **Storage → Create / Connect KV**。
2. 将 KV 绑定到项目（会自动注入 `KV_REST_API_URL` 与 `KV_REST_API_TOKEN` 两个环境变量）。
3. 重新 Deploy。首次访问时，KV 会从 `data/products.json` 自动初始化；之后后台的所有修改都落在 KV，跨实例持久。

> 若不连接 KV：官网浏览 / 加购 / 结算完全正常（读 `data/products.json`），仅后台的写入会返回 503 提示「请连接 Vercel KV」。本地 `node server.js` 始终写入 `data/products.json`，无需 KV。

## API 参考

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET  | `/api/products?active=true` | 商品列表（可按上架过滤） | 公开 |
| GET  | `/api/products/:id` | 单个商品 | 公开 |
| POST | `/api/products` | 新增商品 | `x-admin-token` |
| PUT  | `/api/products/:id` | 改价 / 上下架 / 促销 | `x-admin-token` |
| DELETE | `/api/products/:id` | 删除商品 | `x-admin-token` |

字段：`id, type, category, tier, name{zh,en}, desc{zh,en}, price, compareAtPrice, active, image, bundle, promotion{enabled,type,value,label{zh,en}}`。

## 说明
- 价格为千台级估算，正式量产请以 RFQ 复核为准。
- 内部文档（产品设计方案 / 珠三角供应商 / GTM）见仓库根目录的 `.md` 与 `.csv` 文件。
