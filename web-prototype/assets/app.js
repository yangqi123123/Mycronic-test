/* Prototype interactions: sidebar, modal, drawer, toast-ish */
(function () {
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

  // ===== auth (prototype) =====
  // Keep a lightweight route guard:
  // - dev-server default opens login.html
  // - if user visits any app page without auth, redirect to login.html
  const AUTH_KEY = "ai_auth_v1";
  function isAuthed() {
    try {
      return localStorage.getItem(AUTH_KEY) === "1";
    } catch (_) {
      return false;
    }
  }
  function buildHref(file) {
    const base = (window.__APP_BASE || "./").replace(/\\/g, "/");
    try {
      return new URL(file, new URL(base, window.location.href)).href;
    } catch (_) {
      return base.replace(/\/?$/, "/") + file;
    }
  }
  function ensureAuthedOrRedirect() {
    const path = String(window.location.pathname || "").replace(/\\/g, "/");
    if (path.endsWith("/login.html") || path.endsWith("login.html")) return;
    if (isAuthed()) return;
    window.location.replace(buildHref("login.html"));
  }
  ensureAuthedOrRedirect();

  function setOpen(el, open) {
    if (!el) return;
    el.dataset.open = open ? "true" : "false";
  }

  function closeAllOverlays() {
    qsa("[data-overlay]").forEach((o) => setOpen(o, false));
    qsa("[data-drawer]").forEach((d) => setOpen(d, false));
    qsa("[data-modal]").forEach((m) => setOpen(m, false));
  }

  function openDrawer(id) {
    const overlay = qs(`[data-overlay="${id}"]`);
    const drawer = qs(`[data-drawer="${id}"]`);
    setOpen(overlay, true);
    setOpen(drawer, true);
  }

  function openModal(id) {
    const overlay = qs(`[data-overlay="${id}"]`);
    const modal = qs(`[data-modal="${id}"]`);
    setOpen(overlay, true);
    setOpen(modal, true);
  }

  function closeById(id) {
    setOpen(qs(`[data-overlay="${id}"]`), false);
    setOpen(qs(`[data-drawer="${id}"]`), false);
    setOpen(qs(`[data-modal="${id}"]`), false);
  }

  function bindOverlayClicks() {
    qsa("[data-overlay]").forEach((overlay) => {
      overlay.addEventListener("click", () => {
        const id = overlay.getAttribute("data-overlay");
        closeById(id);
      });
    });
  }

  function bindActionButtons() {
    qsa("[data-open-drawer]").forEach((btn) => {
      btn.addEventListener("click", () => openDrawer(btn.getAttribute("data-open-drawer")));
    });
    qsa("[data-open-modal]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.getAttribute("data-open-modal")));
    });
    qsa("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeById(btn.getAttribute("data-close")));
    });
  }

  function bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllOverlays();
    });
  }

  function bindSidebarCollapse() {
    const toggle = qs("[data-sidebar-toggle]");
    const sidebar = qs("[data-sidebar]");
    if (!toggle || !sidebar) return;
    toggle.addEventListener("click", () => {
      const collapsed = sidebar.dataset.collapsed === "true";
      const next = collapsed ? "false" : "true";
      sidebar.dataset.collapsed = next;
      // 宽度由 app.css 的 [data-sidebar] / [data-sidebar][data-collapsed] 控制
      sidebar.style.width = "";
    });
  }

  function headerHasPageToolbarActions(header, toggleEl) {
    const cand = qsa("button,a", header).filter((el) => {
      if (!toggleEl) return true;
      if (el === toggleEl) return false;
      if (toggleEl.contains(el)) return false;
      if (el.matches("[data-sidebar-toggle]")) return false;
      if (el.matches("[data-nav-group-toggle]")) return false;
      if (el.closest("[data-sidebar-root]")) return false;
      if (el.matches("[data-open-modal],[data-open-drawer]")) return true;
      if (el.matches("button.bg-primary")) return true;
      if (el.tagName === "A" && el.getAttribute("href")) {
        const href = String(el.getAttribute("href") || "");
        if (href && !href.startsWith("javascript:")) return true;
      }
      return false;
    });
    return cand.length > 0;
  }

  function initAppTopChrome() {
    const main = qs("main.flex-1") || qs("main");
    if (!main) return;
    const header = qs(":scope > header", main) || main.querySelector(":scope > header");
    if (!header || header.dataset.appTopChrome === "1") return;

    const toggle = header.querySelector("[data-sidebar-toggle]");
    const keepToolbar = headerHasPageToolbarActions(header, toggle);

    header.dataset.appTopChrome = "1";
    header.className = "bg-surface border-b border-[rgba(201,205,212,.7)] shrink-0";

    if (toggle) toggle.remove();

    const preserved = document.createDocumentFragment();
    while (header.firstChild) preserved.appendChild(header.firstChild);

    const row = document.createElement("div");
    row.className = "h-14 px-4 flex items-center justify-between gap-3";

    const left = document.createElement("div");
    left.className = "flex items-center gap-3 min-w-0 flex-1";
    if (toggle) left.appendChild(toggle);

    const nav = document.createElement("nav");
    nav.className = "app-breadcrumb";
    nav.setAttribute("aria-label", "面包屑");

    const trail =
      window.AppSidebar && typeof window.AppSidebar.getBreadcrumb === "function"
        ? window.AppSidebar.getBreadcrumb()
        : [{ label: "仪表盘", href: `${(window.__APP_BASE || "./").replace(/\\/g, "/")}index.html` }];

    trail.forEach((c, idx) => {
      if (idx > 0) {
        const sep = document.createElement("span");
        sep.className = "app-breadcrumb-sep";
        sep.textContent = "/";
        nav.appendChild(sep);
      }
      const isLast = idx === trail.length - 1;
      if (isLast) {
        const sp = document.createElement("span");
        sp.className = "app-breadcrumb-current";
        sp.textContent = c.label;
        nav.appendChild(sp);
      } else if (c.href) {
        const a = document.createElement("a");
        a.href = c.href;
        a.textContent = c.label;
        nav.appendChild(a);
      } else {
        const sp = document.createElement("span");
        sp.textContent = c.label;
        nav.appendChild(sp);
      }
    });

    left.appendChild(nav);

    const actions = document.createElement("div");
    actions.setAttribute("data-topbar-actions", "true");
    actions.className = "flex items-center gap-2 shrink-0";

    const userWrap = document.createElement("div");
    userWrap.className = "relative group";
    userWrap.innerHTML = `
      <button type="button" class="flex items-center gap-2 rounded-lg border border-[rgba(201,205,212,.6)] px-2 py-1 hover:bg-[rgba(245,247,250,.9)]" aria-haspopup="true">
        <img class="w-8 h-8 rounded-full object-cover border border-[rgba(201,205,212,.7)]" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80" alt="avatar" />
        <span class="text-[14px] font-semibold max-w-[120px] truncate">李雷</span>
        <i class="fa-solid fa-angle-down text-muted text-[11px]"></i>
      </button>
      <div class="absolute right-0 top-full pt-1 hidden group-hover:block z-[60]">
        <div class="min-w-[168px] rounded-xl border border-[rgba(201,205,212,.7)] bg-surface shadow-card py-1">
          <button type="button" data-app-logout class="w-full text-left px-3 py-2 text-[14px] hover:bg-[rgba(245,247,250,.95)]">退出登录</button>
        </div>
      </div>
    `;
    const logoutBtn = userWrap.querySelector("[data-app-logout]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        try {
          localStorage.removeItem(AUTH_KEY);
        } catch (_) {}
        window.location.assign(buildHref("login.html"));
      });
    }

    actions.appendChild(userWrap);

    row.appendChild(left);
    row.appendChild(actions);
    header.appendChild(row);

    if (keepToolbar && preserved.childNodes.length) {
      const extra = document.createElement("div");
      extra.className =
        "app-topbar-extras px-4 py-2 flex flex-wrap items-center justify-end gap-2 border-b border-[rgba(201,205,212,.6)] bg-[rgba(245,247,250,.45)]";
      extra.appendChild(preserved);
      header.appendChild(extra);
    }

    try {
      window.dispatchEvent(new CustomEvent("app-top-chrome:ready"));
    } catch (_) {}
  }

  function bindFakeLoading() {
    qsa("[data-simulate-loading]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const old = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>处理中...';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = old;
        }, 900);
      });
    });
  }

  function bindTabs() {
    const groups = new Map();
    qsa("[data-tab-target][data-tab-group]").forEach((btn) => {
      const group = btn.getAttribute("data-tab-group");
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(btn);
    });

    function activate(group, target) {
      const buttons = groups.get(group) || [];
      buttons.forEach((b) => {
        const isActive = b.getAttribute("data-tab-target") === target;
        b.setAttribute("aria-selected", isActive ? "true" : "false");
        b.classList.toggle("bg-primary", isActive);
        b.classList.toggle("text-white", isActive);
        b.classList.toggle("border-[rgba(255,138,0,.35)]", isActive);
        b.classList.toggle("bg-surface", !isActive);
      });
      qsa(`[data-tab-panel][data-tab-group="${group}"]`).forEach((panel) => {
        const id = panel.getAttribute("data-tab-panel");
        panel.classList.toggle("hidden", id !== target);
      });
    }

    groups.forEach((buttons, group) => {
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => activate(group, btn.getAttribute("data-tab-target")));
      });
      const defaultBtn = buttons.find((b) => b.getAttribute("aria-selected") === "true") || buttons[0];
      if (defaultBtn) activate(group, defaultBtn.getAttribute("data-tab-target"));
    });
  }

  // init
  bindOverlayClicks();
  bindKeyboard();
  initAppTopChrome();
  bindActionButtons();
  bindSidebarCollapse();
  bindFakeLoading();
  bindTabs();
})();

/** 智能触达 · 跟进频率提醒（铃铛 + 首页弹窗），组件见 assets/components/follow-reminder/ */
(function loadFollowReminderChain() {
  const base = (window.__APP_BASE || "./").replace(/\\/g, "/");
  const prefix = base + "assets/components/follow-reminder/";
  const chain = ["store.js", "bell.js", "home-modal.js", "config-form.js", "index.js"];
  function load(i) {
    if (i >= chain.length) {
      try {
        window.dispatchEvent(new CustomEvent("follow-reminder:ready"));
      } catch {
        // ignore
      }
      return;
    }
    const s = document.createElement("script");
    s.src = prefix + chain[i];
    s.async = false;
    s.onload = () => load(i + 1);
    s.onerror = function () {
      if (window.console && console.warn) console.warn("[follow-reminder] load failed:", chain[i]);
    };
    (document.head || document.documentElement).appendChild(s);
  }
  load(0);
})();

/** 客户主数据 + 分配弹窗（全局复用组件） */
(function loadCustomerAssignComponents() {
  const base = (window.__APP_BASE || "./").replace(/\\/g, "/");
  const prefix = base + "assets/components/";
  const chain = ["customer-store.js", "assign-person.js"];
  function load(i) {
    if (i >= chain.length) return;
    const s = document.createElement("script");
    s.src = prefix + chain[i];
    s.async = false;
    s.onload = () => load(i + 1);
    s.onerror = function () {
      if (window.console && console.warn) console.warn("[customer-assign] load failed:", chain[i]);
    };
    (document.head || document.documentElement).appendChild(s);
  }
  load(0);
})();

/** 销售工作台业务弹窗（全局复用组件） */
(function loadWorkbenchModals() {
  const base = (window.__APP_BASE || "./").replace(/\\/g, "/");
  const src = base + "assets/components/workbench-modals.js";
  const s = document.createElement("script");
  s.src = src;
  s.async = false;
  s.onerror = function () {
    if (window.console && console.warn) console.warn("[workbench-modals] load failed");
  };
  (document.head || document.documentElement).appendChild(s);
})();

