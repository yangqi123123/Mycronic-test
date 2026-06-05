## Web Prototype（高保真后台原型）

### 打开方式
- 直接双击打开 `index.html`（建议用 Chrome / Edge）。
- 或启动本地服务（推荐，避免某些浏览器对 `file://` 的限制）：
  - `npm run dev` 然后访问 `http://127.0.0.1:4173/index.html`
  - 可选代理（把 `/api/*` 转发到后端）：`npm run dev:proxy`（默认代理到 `http://127.0.0.1:8080`，可用 `PROXY_TARGET`/`PROXY_PREFIX` 环境变量覆盖）
- 分辨率按需求文档：PC 端（≥1366×768），页面采用固定后台壳（Sidebar 200px + Topbar）。

### 技术栈
- Tailwind CSS（CDN）
- FontAwesome（CDN）
- 少量原生 JS：`assets/app.js`（抽屉/弹窗/折叠菜单等）

### 页面入口
- `index.html`：仪表盘（Dashboard）
- `pages/collect/*`：多源数据采集、原始/清洗数据池
- `pages/crm/*`：客户列表、客户 360° 视图、批量导入导出/查重合并
- `pages/outreach/*`：触达策略、模板、发送记录、退订名单
- `pages/sales/*`：销售工作台、待办、项目管理、跟进记录
- `pages/events/*`：展会活动、详情、收藏与提醒
- `pages/analytics/*`：线索来源、等级分布、销售效率、转化复盘
- `pages/compliance/*`：合规校验、触达合规监控、操作日志审计、RBAC 权限

