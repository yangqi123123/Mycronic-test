/**
 * 全局铃铛（保持上一个版本提醒逻辑）：
 * - 点击铃铛展开/关闭
 * - 角标=未读数；列表项未读红点
 * - 点击列表项/【查看】：打开查看弹窗（与消息列表一致）
 * - 弹窗【确认】：标记已读并刷新角标
 * - 【全部已读】：全部标记已读（不跳转）
 * - 【查看更多】：跳转消息列表
 */
(function () {
  const Store = window.FollowReminderStore;
  if (!Store) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function messages() {
    return Store.listMessages();
  }

  function unreadCount() {
    return messages().filter((m) => !m.read).length;
  }

  function navigateWorkbench(customerId) {
    window.location.href = Store.workbenchHref(customerId || "");
  }

  function navigateMessagesList() {
    const base = (window.__APP_BASE || "./").replace(/\\/g, "/");
    const rel = (base.endsWith("/") ? base : base + "/") + "pages/messages/list.html";
    const u = new URL(rel, window.location.href);
    window.location.href = u.href;
  }

  function markRead(id) {
    const meta = Store.loadMeta();
    if (!meta.readIds.includes(id)) {
      meta.readIds.push(id);
      Store.saveMeta(meta);
    }
  }

  function ensureModalDom() {
    let el = document.getElementById("fr-bell-view-modal");
    if (el) return el;
    el = document.createElement("div");
    el.id = "fr-bell-view-modal";
    el.innerHTML = `
      <div id="fr-bell-view-overlay" class="fixed inset-0 z-[110] bg-black/35 hidden items-center justify-center p-4" style="display:none">
        <div class="bg-surface rounded-xl shadow-card border border-[rgba(201,205,212,.7)] w-full max-w-[520px] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="fr-bell-view-title">
          <div class="px-4 py-3 border-b border-[rgba(201,205,212,.6)] flex items-center justify-between">
            <div id="fr-bell-view-title" class="text-[16px] font-semibold pr-2"></div>
            <button type="button" id="fr-bell-view-x" class="w-8 h-8 rounded-lg border border-[rgba(201,205,212,.6)] hover:bg-[rgba(245,247,250,.9)] shrink-0" aria-label="关闭">
              <i class="fa-solid fa-xmark text-muted"></i>
            </button>
          </div>
          <div class="px-4 py-3">
            <div id="fr-bell-view-body" class="text-[14px] text-text leading-relaxed"></div>
            <div id="fr-bell-view-time" class="text-[12px] text-muted mt-3"></div>
          </div>
          <div class="px-4 py-3 border-t border-[rgba(201,205,212,.6)] flex justify-end bg-[rgba(245,247,250,.5)]">
            <button type="button" id="fr-bell-view-ok" class="h-9 px-5 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    return el;
  }

  function mount(root) {
    root.innerHTML = `
      <div class="relative" id="fr-bell-wrap">
        <button type="button" id="fr-bell-btn" class="relative w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)] border border-[rgba(201,205,212,.6)]" title="待跟进提醒" aria-expanded="false" aria-haspopup="true">
          <i class="fa-regular fa-bell text-muted"></i>
          <span id="fr-bell-badge" class="hidden absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border border-surface"></span>
        </button>
        <div id="fr-bell-panel" class="hidden absolute right-0 top-[calc(100%+6px)] w-[360px] max-w-[92vw] bg-surface border border-[rgba(201,205,212,.7)] rounded-xl shadow-card z-[90] overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 border-b border-[rgba(201,205,212,.6)] bg-[rgba(245,247,250,.9)]">
            <span class="text-[13px] font-semibold">待跟进提醒</span>
            <button type="button" id="fr-bell-readall" class="text-[12px] text-primary font-semibold">全部已读</button>
          </div>
          <div id="fr-bell-list" class="max-h-[320px] overflow-y-auto"></div>
          <div class="px-3 py-2 border-t border-[rgba(201,205,212,.6)] bg-[rgba(245,247,250,.6)]">
            <button type="button" id="fr-bell-more" class="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface text-[14px] font-semibold hover:bg-[rgba(245,247,250,.95)]">
              查看更多
            </button>
          </div>
        </div>
      </div>
    `;

    const btn = root.querySelector("#fr-bell-btn");
    const panel = root.querySelector("#fr-bell-panel");
    const badge = root.querySelector("#fr-bell-badge");
    const list = root.querySelector("#fr-bell-list");
    const readAll = root.querySelector("#fr-bell-readall");
    const more = root.querySelector("#fr-bell-more");

    let open = false;

    const modalRoot = ensureModalDom();
    const viewOverlay = modalRoot.querySelector("#fr-bell-view-overlay");
    const viewTitle = modalRoot.querySelector("#fr-bell-view-title");
    const viewBody = modalRoot.querySelector("#fr-bell-view-body");
    const viewTime = modalRoot.querySelector("#fr-bell-view-time");
    const viewOk = modalRoot.querySelector("#fr-bell-view-ok");
    const viewX = modalRoot.querySelector("#fr-bell-view-x");
    let currentId = "";

    function closeModal() {
      viewOverlay.style.display = "none";
      viewOverlay.classList.add("hidden");
      currentId = "";
    }

    function openModal(m) {
      currentId = m.id;
      viewTitle.textContent = m.title;
      viewBody.textContent = m.content;
      viewTime.textContent = "创建时间：" + Store.formatDateTime(m.createdAt);
      viewOverlay.classList.remove("hidden");
      viewOverlay.style.display = "flex";
    }

    viewOverlay.addEventListener("click", (e) => {
      if (e.target === viewOverlay) closeModal();
    });
    viewX.addEventListener("click", closeModal);
    viewOk.addEventListener("click", () => {
      if (currentId) markRead(currentId);
      if (window.__frBellRefresh) window.__frBellRefresh();
      closeModal();
      if (open) renderList();
    });

    function renderList() {
      const msgs = messages().slice(0, 10);
      const uc = unreadCount();
      badge.textContent = uc > 99 ? "99+" : String(uc);
      badge.classList.toggle("hidden", uc === 0);

      if (!msgs.length) {
        list.innerHTML = `<div class="px-3 py-6 text-center text-[13px] text-muted">暂无消息</div>`;
        return;
      }

      list.innerHTML = msgs
        .map((m) => {
          const time = Store.formatDateTime(m.createdAt);
          const dot = !m.read
            ? `<span class="w-2 h-2 rounded-full bg-red-600 inline-block mr-2"></span>`
            : `<span class="w-2 h-2 rounded-full bg-transparent inline-block mr-2"></span>`;
          return `
            <div class="px-3 py-3 border-b border-[rgba(201,205,212,.45)] hover:bg-[rgba(245,247,250,.95)] fr-msg-item" data-id="${escapeHtml(m.id)}">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="text-[14px] font-semibold flex items-center">${dot}${escapeHtml(m.title)}</div>
                  <div class="text-[13px] text-text mt-1">${escapeHtml(m.content)}</div>
                  <div class="text-[11px] text-muted mt-1">${escapeHtml(time)}</div>
                </div>
                <button type="button" class="h-8 px-3 rounded-lg bg-primary text-white text-[13px] font-semibold shrink-0 fr-msg-view" data-id="${escapeHtml(m.id)}">查看</button>
              </div>
            </div>`;
        })
        .join("");

      list.querySelectorAll(".fr-msg-view").forEach((btnView) => {
        btnView.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btnView.getAttribute("data-id");
          const m = messages().find((x) => x.id === id);
          setOpen(false);
          if (m) openModal(m);
        });
      });

      list.querySelectorAll(".fr-msg-item").forEach((el) => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-id");
          setOpen(false);
          const m = messages().find((x) => x.id === id);
          if (m) openModal(m);
        });
      });
    }

    function setOpen(v) {
      open = v;
      panel.classList.toggle("hidden", !v);
      btn.setAttribute("aria-expanded", v ? "true" : "false");
      if (v) renderList();
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!open);
    });

    readAll.addEventListener("click", (e) => {
      e.stopPropagation();
      const meta = Store.loadMeta();
      messages().forEach((m) => {
        if (!meta.readIds.includes(m.id)) meta.readIds.push(m.id);
      });
      Store.saveMeta(meta);
      if (window.__frBellRefresh) window.__frBellRefresh();
      setOpen(false);
    });

    more.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(false);
      navigateMessagesList();
    });

    panel.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) setOpen(false);
    });

    return {
      refresh() {
        if (open) renderList();
        const uc = unreadCount();
        badge.textContent = uc > 99 ? "99+" : String(uc);
        badge.classList.toggle("hidden", uc === 0);
      },
    };
  }

  window.FollowReminderBell = { mount, unreadCount, dueMessages: messages, navigateWorkbench };
})();
