/* Shared sidebar component.
   - 一级菜单：客户管理/智能触达/展会活动/AI客户评级/数据分析/消息列表/系统管理（含展开/收起）
   - 二级菜单保持原顺序与结构
   - Highlights current item (aria-current="page")
*/

(function () {
  const base = (window.__APP_BASE || "./").replace(/\\/g, "/");

  /** @type {Record<string, {label: string, icon: string, href: string}>} */
  const items = {
    dashboard: { label: "仪表盘", icon: "fa-gauge-high", href: `${base}index.html` },

    "collect-sources": { label: "采集器", icon: "fa-spider", href: `${base}pages/collect/sources.html` },
    "collect-scripts": { label: "脚本管理", icon: "fa-file-code", href: `${base}pages/collect/scripts.html` },
    "collect-leads": { label: "线索池", icon: "fa-layer-group", href: `${base}pages/collect/leads-pool.html` },

    "crm-customers": { label: "客户档案", icon: "fa-address-card", href: `${base}pages/crm/customer-archive.html` },
    sales: { label: "销售工作台", icon: "fa-briefcase", href: `${base}pages/sales/workbench.html` },
    "crm-contacts": { label: "联系人管理", icon: "fa-id-badge", href: `${base}pages/crm/contacts.html` },
    "crm-followups": { label: "跟进记录", icon: "fa-comment-dots", href: `${base}pages/crm/followups.html` },
    "crm-needs": { label: "商机", icon: "fa-clipboard-check", href: `${base}pages/crm/needs.html` },
    "crm-quotes": { label: "报价", icon: "fa-file-invoice-dollar", href: `${base}pages/crm/quotes.html` },
    "crm-contracts": { label: "合同管理", icon: "fa-file-signature", href: `${base}pages/crm/contracts.html` },
    "crm-deliveries": { label: "交付", icon: "fa-truck-fast", href: `${base}pages/crm/deliveries.html` },

    "expo-events": { label: "展会活动", icon: "fa-calendar-days", href: `${base}pages/events/events.html` },
    "ai-rating": { label: "AI客户评级", icon: "fa-robot", href: `${base}pages/events/customer-scoring.html` },

    analytics: { label: "数据分析", icon: "fa-chart-column", href: `${base}pages/analytics/dashboard.html` },
    messages: { label: "消息列表", icon: "fa-bell", href: `${base}pages/messages/list.html` },
  };

  const dataCollectGroup = {
    id: "collect",
    label: "数据采集",
    icon: "fa-database",
    children: [
      { key: "collect-sources", label: items["collect-sources"].label, icon: items["collect-sources"].icon, href: items["collect-sources"].href },
      { key: "collect-scripts", label: items["collect-scripts"].label, icon: items["collect-scripts"].icon, href: items["collect-scripts"].href },
      { key: "collect-leads", label: items["collect-leads"].label, icon: items["collect-leads"].icon, href: items["collect-leads"].href },
    ],
  };

  const customerGroup = {
    id: "crm",
    label: "客户管理",
    icon: "fa-users",
    children: [
      { key: "crm-customers", label: items["crm-customers"].label, icon: items["crm-customers"].icon, href: items["crm-customers"].href },
      { key: "sales", label: items.sales.label, icon: items.sales.icon, href: items.sales.href },
      { key: "crm-contacts", label: items["crm-contacts"].label, icon: items["crm-contacts"].icon, href: items["crm-contacts"].href },
      { key: "crm-followups", label: items["crm-followups"].label, icon: items["crm-followups"].icon, href: items["crm-followups"].href },
      { key: "crm-needs", label: items["crm-needs"].label, icon: items["crm-needs"].icon, href: items["crm-needs"].href },
      { key: "crm-quotes", label: items["crm-quotes"].label, icon: items["crm-quotes"].icon, href: items["crm-quotes"].href },
      { key: "crm-contracts", label: items["crm-contracts"].label, icon: items["crm-contracts"].icon, href: items["crm-contracts"].href },
      { key: "crm-deliveries", label: items["crm-deliveries"].label, icon: items["crm-deliveries"].icon, href: items["crm-deliveries"].href },
    ],
  };

  const outreachGroup = {
    id: "outreach",
    label: "智能触达",
    icon: "fa-paper-plane",
    children: [
      { key: "outreach-campaigns", label: "触达活动", icon: "fa-bullhorn", href: `${base}pages/outreach/campaigns.html` },
      { key: "outreach-templates", label: "模板管理", icon: "fa-layer-group", href: `${base}pages/outreach/templates.html` },
      { key: "outreach-follow-frequency", label: "跟进频率", icon: "fa-clock", href: `${base}pages/outreach/follow-frequency.html` },
    ],
  };

  const systemGroup = {
    id: "system",
    label: "系统管理",
    icon: "fa-gears",
    children: [
      { key: "sys-roles", label: "角色管理", icon: "fa-user-shield", href: `${base}pages/system/roles.html` },
      { key: "sys-regions", label: "区域管理", icon: "fa-map-location-dot", href: `${base}pages/system/regions.html` },
      { key: "sys-employees", label: "员工管理", icon: "fa-users-gear", href: `${base}pages/system/employees.html` },
      { key: "sys-dict", label: "数据字典", icon: "fa-book", href: `${base}pages/system/dict.html` },
      { key: "sys-menus", label: "菜单管理", icon: "fa-bars-progress", href: `${base}pages/system/menus.html` },
      { key: "sys-oplog", label: "操作日志", icon: "fa-list-check", href: `${base}pages/system/op-log.html` },
      { key: "sys-loginlog", label: "登录日志", icon: "fa-right-to-bracket", href: `${base}pages/system/login-log.html` },
    ],
  };

  const order = [
    "dashboard",
    { type: "group", id: "collect" },
    { type: "group", id: "crm" },
    { type: "group", id: "outreach" },
    "expo-events",
    "ai-rating",
    "analytics",
    "messages",
    { type: "group", id: "system" },
  ];

  function getActiveKey() {
    if (window.__ACTIVE_MENU) return window.__ACTIVE_MENU;
    const p = (location.pathname || "").replace(/\\/g, "/").toLowerCase();

    if (p.endsWith("/pages/system/roles.html")) return "sys-roles";
    if (p.endsWith("/pages/system/regions.html")) return "sys-regions";
    if (p.endsWith("/pages/system/employees.html")) return "sys-employees";
    if (p.endsWith("/pages/system/dict.html")) return "sys-dict";
    if (p.endsWith("/pages/system/menus.html")) return "sys-menus";
    if (p.endsWith("/pages/system/op-log.html")) return "sys-oplog";
    if (p.endsWith("/pages/system/login-log.html")) return "sys-loginlog";

    if (p.endsWith("/pages/collect/sources.html")) return "collect-sources";
    if (p.endsWith("/pages/collect/scripts.html")) return "collect-scripts";
    if (p.endsWith("/pages/collect/leads-pool.html")) return "collect-leads";

    if (p.endsWith("/pages/crm/customer-archive.html")) return "crm-customers";
    if (p.endsWith("/pages/crm/customer-360.html")) return "crm-customers";
    if (p.endsWith("/pages/crm/contacts.html")) return "crm-contacts";
    if (p.endsWith("/pages/crm/followups.html")) return "crm-followups";
    if (p.endsWith("/pages/crm/needs.html")) return "crm-needs";
    if (p.endsWith("/pages/crm/quotes.html")) return "crm-quotes";
    if (p.endsWith("/pages/crm/quote-detail.html")) return "crm-quotes";
    if (p.endsWith("/pages/crm/contracts.html")) return "crm-contracts";
    if (p.endsWith("/pages/crm/contract-detail.html")) return "crm-contracts";
    if (p.endsWith("/pages/crm/deliveries.html")) return "crm-deliveries";
    if (p.endsWith("/pages/crm/delivery-detail.html")) return "crm-deliveries";
    if (p.includes("/pages/crm/") && !p.endsWith("/pages/crm/rating.html")) return "crm-customers";
    if (p.endsWith("/pages/crm/rating.html")) return "ai-rating";

    if (p.endsWith("/pages/outreach/campaigns.html")) return "outreach-campaigns";
    if (p.endsWith("/pages/outreach/overview.html")) return "outreach-campaigns";
    if (p.endsWith("/pages/outreach/records.html")) return "outreach-campaigns";
    if (p.endsWith("/pages/outreach/templates.html")) return "outreach-templates";
    if (p.endsWith("/pages/outreach/follow-frequency.html")) return "outreach-follow-frequency";
    if (p.includes("/pages/sales/")) return "sales";
    if (p.endsWith("/pages/events/customer-scoring.html")) return "ai-rating";
    if (p.endsWith("/pages/events/events.html")) return "expo-events";
    if (p.endsWith("/pages/events/event-detail.html")) return "expo-events";
    if (p.includes("/pages/events/")) return "expo-events";
    if (p.includes("/pages/analytics/")) return "analytics";
    if (p.includes("/pages/messages/")) return "messages";

    return "dashboard";
  }

  /** @typedef {{label: string, href?: string|null}} BreadcrumbItem */

  /** @returns {BreadcrumbItem[]} */
  function getBreadcrumb() {
    const key = getActiveKey();
    const b = base.endsWith("/") ? base : base + "/";
    const home = `${b}index.html`;
    const dataRoot = `${b}pages/collect/sources.html`;
    const crmRoot = `${b}pages/crm/customer-archive.html`;
    const outreachRoot = `${b}pages/outreach/campaigns.html`;
    const systemRoot = `${b}pages/system/roles.html`;

    /** @param {string} label @param {string|null|undefined} [href] */
    function crumb(label, href) {
      return { label, href: href == null || href === "" ? null : href };
    }

    if (key === "dashboard") return [crumb("仪表盘", home)];

    if (key === "collect-sources") return [crumb("数据采集", dataRoot), crumb("采集器", items["collect-sources"].href)];
    if (key === "collect-scripts") return [crumb("数据采集", dataRoot), crumb("脚本管理", items["collect-scripts"].href)];
    if (key === "collect-leads") return [crumb("数据采集", dataRoot), crumb("线索池", items["collect-leads"].href)];

    if (key === "crm-customers") return [crumb("客户管理", crmRoot), crumb("客户档案", items["crm-customers"].href)];
    if (key === "sales") return [crumb("客户管理", crmRoot), crumb("销售工作台", items.sales.href)];
    if (key === "crm-contacts") return [crumb("客户管理", crmRoot), crumb("联系人管理", items["crm-contacts"].href)];
    if (key === "crm-followups") return [crumb("客户管理", crmRoot), crumb("跟进记录", items["crm-followups"].href)];
    if (key === "crm-needs") return [crumb("客户管理", crmRoot), crumb("商机", items["crm-needs"].href)];
    if (key === "crm-quotes") return [crumb("客户管理", crmRoot), crumb("报价", items["crm-quotes"].href)];
    if (key === "crm-contracts") return [crumb("客户管理", crmRoot), crumb("合同管理", items["crm-contracts"].href)];
    if (key === "crm-deliveries") return [crumb("客户管理", crmRoot), crumb("交付", items["crm-deliveries"].href)];

    if (key === "outreach-campaigns") return [crumb("智能触达", outreachRoot), crumb("触达活动", outreachGroup.children[0].href)];
    if (key === "outreach-templates") return [crumb("智能触达", outreachRoot), crumb("模板管理", outreachGroup.children[1].href)];
    if (key === "outreach-follow-frequency") return [crumb("智能触达", outreachRoot), crumb("跟进频率", outreachGroup.children[2].href)];

    if (key === "expo-events") return [crumb("展会活动", items["expo-events"].href)];
    if (key === "ai-rating") return [crumb("AI客户评级", items["ai-rating"].href)];

    if (key === "analytics") return [crumb("数据分析", items.analytics.href)];
    if (key === "messages") return [crumb("消息列表", items.messages.href)];

    if (key.startsWith("sys-")) {
      const child = systemGroup.children.find((c) => c.key === key);
      if (child) return [crumb("系统管理", systemRoot), crumb(child.label, child.href)];
    }

    return [crumb("仪表盘", home)];
  }

  window.AppSidebar = { getActiveKey, getBreadcrumb };

  /** @param {string} key */
  function navLink(key) {
    const it = items[key];
    const isActive = key === getActiveKey();
    const current = isActive ? ' aria-current="page"' : "";
    return `
      <a class="nav-item flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(245,247,250,.9)]" href="${it.href}"${current}>
        <i class="fa-solid ${it.icon} w-5 text-muted"></i>
        <span data-nav-label>${it.label}</span>
      </a>
    `;
  }

  function groupChildLink(child, padClass) {
    const pad = padClass || "pl-9";
    const isActive = child.key === getActiveKey();
    const current = isActive ? ' aria-current="page"' : "";
    return `
      <a class="nav-subitem flex items-center gap-2 ${pad} pr-3 py-1.5 rounded-lg hover:bg-[rgba(245,247,250,.9)] text-[13px]" href="${child.href}"${current}>
        <i class="fa-solid ${child.icon} w-4 text-muted shrink-0"></i>
        <span data-nav-label>${child.label}</span>
      </a>
    `;
  }

  function systemChildLink(child) {
    const isActive = child.key === getActiveKey();
    const current = isActive ? ' aria-current="page"' : "";
    return `
      <a class="nav-subitem flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-lg hover:bg-[rgba(245,247,250,.9)] text-[13px]" href="${child.href}"${current}>
        <i class="fa-solid ${child.icon} w-4 text-muted shrink-0"></i>
        <span data-nav-label>${child.label}</span>
      </a>
    `;
  }

  function lsKeyForGroup(id) {
    return `sidebar_group_${id}_expanded_v1`;
  }
  function getGroupExpanded(id, fallback) {
    try {
      const v = localStorage.getItem(lsKeyForGroup(id));
      if (v === "true") return true;
      if (v === "false") return false;
    } catch (_) {}
    return fallback !== false;
  }
  function setGroupExpanded(id, ex) {
    try {
      localStorage.setItem(lsKeyForGroup(id), ex ? "true" : "false");
    } catch (_) {}
  }

  function renderNavGroup(group) {
    const active = getActiveKey();
    const anyChildActive = (group.children || []).some((c) => c.key === active);
    const expanded = getGroupExpanded(group.id, true) ? "true" : "false";
    const chevron = expanded === "true" ? "fa-chevron-down" : "fa-chevron-right";
    const headerActive = anyChildActive ? ' style="background: rgba(255,138,0,.10);"' : "";
    let html = `<div data-nav-group="${group.id}">`;
    html += `
      <div class="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[rgba(245,247,250,.9)]"${headerActive}>
        <i class="fa-solid ${group.icon} w-5 text-muted shrink-0"></i>
        <span class="flex-1 min-w-0 text-[14px] font-semibold text-text truncate" data-nav-label>${group.label}</span>
        <button type="button" class="w-8 h-8 shrink-0 rounded-lg hover:bg-[rgba(245,247,250,.9)] border border-[rgba(201,205,212,.5)] flex items-center justify-center" data-nav-group-toggle aria-expanded="${expanded}" title="展开/收起子菜单" aria-label="展开或收起${group.label}子菜单">
          <i class="fa-solid ${chevron} text-[11px] text-muted" data-nav-chevron></i>
        </button>
      </div>
    `;
    html += `<div class="space-y-0.5 pb-1 mt-0.5" data-nav-group-panel data-expanded="${expanded}" style="display:${expanded === "true" ? "block" : "none"}">`;
    for (const c of group.children || []) html += groupChildLink(c, "pl-9");
    html += `</div></div>`;
    return html;
  }

  function wireNavGroup(root, groupId) {
    const wrap = root.querySelector(`[data-nav-group="${groupId}"]`);
    if (!wrap) return;
    const btn = wrap.querySelector("[data-nav-group-toggle]");
    const panel = wrap.querySelector("[data-nav-group-panel]");
    const chevron = wrap.querySelector("[data-nav-chevron]");
    if (!btn || !panel) return;
    function sync() {
      const ex = panel.getAttribute("data-expanded") === "true";
      panel.style.display = ex ? "block" : "none";
      btn.setAttribute("aria-expanded", ex ? "true" : "false");
      if (chevron) {
        chevron.classList.toggle("fa-chevron-down", ex);
        chevron.classList.toggle("fa-chevron-right", !ex);
      }
      setGroupExpanded(groupId, ex);
    }
    btn.addEventListener("click", () => {
      const ex = panel.getAttribute("data-expanded") === "true";
      panel.setAttribute("data-expanded", ex ? "false" : "true");
      sync();
    });
    sync();
  }

  // outreach/system now use generic group renderer/wirer

  function render() {
    const root = document.querySelector("[data-sidebar-root]");
    if (!root) return;

    let html = `
      <aside class="bg-surface border-r border-[rgba(201,205,212,.7)] shrink-0" data-sidebar data-collapsed="false">
        <div class="sidebar-brand h-14 px-4 flex items-center gap-3 border-b border-[rgba(201,205,212,.7)]">
          <a class="w-9 h-9 rounded-lg bg-[rgba(255,138,0,.12)] flex items-center justify-center" href="${base}index.html">
            <i class="fa-solid fa-bolt text-primary"></i>
          </a>
          <div class="leading-tight">
            <div class="text-[14px] font-semibold text-text" data-nav-label>AI获客系统</div>
            <div class="text-[12px] text-muted" data-nav-label>Mycronic</div>
          </div>
        </div>
        <nav class="sidebar-nav p-2 text-[14px]">
    `;
    for (const entry of order) {
      if (typeof entry === "object" && entry.type === "group") {
        const id = entry.id;
        const group =
          id === "collect"
            ? dataCollectGroup
            : id === "crm"
              ? customerGroup
              : id === "outreach"
                ? outreachGroup
                : id === "system"
                  ? systemGroup
                  : null;
        if (group) html += renderNavGroup(group);
        continue;
      }
      html += navLink(/** @type {string} */ (entry));
    }

    html += `
        </nav>
      </aside>
    `;

    root.innerHTML = html;
    wireNavGroup(root, "collect");
    wireNavGroup(root, "crm");
    wireNavGroup(root, "outreach");
    wireNavGroup(root, "system");
  }

  render();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  }
})();
