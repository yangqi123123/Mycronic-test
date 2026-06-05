/**
 * AssignPersonModal (Prototype)
 * Global reusable modal:
 * - columns: 选择/员工/手机号/头像/角色/负责区域/销售工作台权限
 * - search: 员工姓名/手机号 fuzzy
 * - only allow selecting hasSalesWorkbench=true; otherwise disable confirm + show tip
 */
(function () {
  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function ensureDom() {
    if (document.getElementById("apm-root")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div id="apm-root">
        <div class="overlay" data-overlay="apm-assign" data-open="false"></div>
        <div class="modal" data-modal="apm-assign" data-open="false" style="max-width: 980px; width: min(980px, 96vw);">
          <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
            <div class="text-[16px] font-semibold">分配客户</div>
            <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="apm-assign"><i class="fa-solid fa-xmark text-muted"></i></button>
          </div>
          <div class="p-4 space-y-3">
            <div id="apm-tabs" class="flex items-center justify-center gap-2">
              <button type="button" class="apm-tab h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold text-muted" data-apm-tab="region">
                分配给区域
              </button>
              <button type="button" class="apm-tab h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold text-muted" data-apm-tab="person" aria-current="page">
                分配给人员
              </button>
            </div>

            <div id="apm-tip" class="hidden text-[13px] text-[#F53F3F] bg-[rgba(245,63,63,.06)] border border-[rgba(245,63,63,.25)] rounded-lg px-3 py-2"></div>

            <!-- tab: person -->
            <div id="apm-pane-person" class="space-y-3">
            <div class="grid grid-cols-12 gap-3 items-end">
              <div class="col-span-12 sm:col-span-6">
                <div class="text-[12px] text-muted mb-1">员工姓名/手机号</div>
                <input id="apm-q" class="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-surface" placeholder="支持模糊匹配" />
              </div>
              <div class="col-span-12 sm:col-span-6 flex gap-2 justify-end">
                <button id="apm-reset" type="button" class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface text-[14px] font-semibold">重置</button>
                <button id="apm-search" type="button" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">查询</button>
              </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-[rgba(201,205,212,.6)]">
              <table class="w-full table min-w-[920px] text-[14px]">
                <thead class="bg-[rgba(245,247,250,.9)]">
                  <tr>
                    <th class="text-left px-3 py-2 w-12">选择</th>
                    <th class="text-left px-3 py-2">员工</th>
                    <th class="text-left px-3 py-2">手机号</th>
                    <th class="text-left px-3 py-2">头像</th>
                    <th class="text-left px-3 py-2">角色</th>
                    <th class="text-left px-3 py-2">负责区域</th>
                    <th class="text-left px-3 py-2">销售工作台权限</th>
                  </tr>
                </thead>
                <tbody id="apm-tbody" class="bg-surface"></tbody>
              </table>
            </div>
            </div>

            <!-- tab: region -->
            <div id="apm-pane-region" class="space-y-3 hidden">
              <div class="overflow-x-auto rounded-xl border border-[rgba(201,205,212,.6)]">
                <table class="w-full table min-w-[720px] text-[14px]">
                  <thead class="bg-[rgba(245,247,250,.9)]">
                    <tr>
                      <th class="text-left px-3 py-2 w-12">选择区域</th>
                      <th class="text-left px-3 py-2">区域名称</th>
                      <th class="text-left px-3 py-2">区域负责人</th>
                    </tr>
                  </thead>
                  <tbody id="apm-region-tbody" class="bg-surface"></tbody>
                </table>
              </div>
            </div>

            <div class="pt-1 flex justify-end gap-2">
              <button type="button" class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="apm-assign">取消</button>
              <button id="apm-confirm" type="button" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">确认分配</button>
            </div>
          </div>
        </div>
      </div>
    `.trim();
    document.body.appendChild(wrap.firstElementChild);
  }

  function setOpen(open) {
    const ov = document.querySelector('[data-overlay="apm-assign"]');
    const m = document.querySelector('[data-modal="apm-assign"]');
    if (ov) ov.dataset.open = open ? "true" : "false";
    if (m) m.dataset.open = open ? "true" : "false";
  }

  let currentCustomerId = null;
  let selectedEmpId = null;
  let selectedRegionId = null;
  let activeTab = "person"; // person | region
  let onDone = null;
  let forcePersonOnly = false;

  function showTip(msg) {
    const tip = document.getElementById("apm-tip");
    if (!tip) return;
    if (!msg) {
      tip.classList.add("hidden");
      tip.textContent = "";
      return;
    }
    tip.textContent = msg;
    tip.classList.remove("hidden");
  }

  function syncConfirmState() {
    const btn = document.getElementById("apm-confirm");
    if (!btn) return;
    if (activeTab === "region") {
      if (!selectedRegionId) {
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed");
        showTip("");
        return;
      }
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      showTip("");
      return;
    }

    if (!selectedEmpId) {
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
      showTip("");
      return;
    }
    const Store = window.CustomerStore;
    const emp = Store ? Store.getEmployeeById(selectedEmpId) : null;
    if (emp && !emp.hasSalesWorkbench) {
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
      showTip("该员工无销售工作台权限，无法分配");
      return;
    }
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
    showTip("");
  }

  function renderList() {
    const Store = window.CustomerStore;
    const employees = Store ? Store.listEmployees() : [];
    const q = (document.getElementById("apm-q")?.value || "").trim();
    const term = q.toLowerCase();
    const filtered = employees.filter((e) => {
      if (!term) return true;
      return String(e.name).toLowerCase().includes(term) || String(e.phone).toLowerCase().includes(term);
    });

    const tbody = document.getElementById("apm-tbody");
    if (!tbody) return;
    tbody.innerHTML = filtered
      .map((e) => {
        const checked = selectedEmpId === e.id ? "checked" : "";
        const perm = e.hasSalesWorkbench ? `<span class="chip chip--success">有</span>` : `<span class="chip chip--danger">无</span>`;
        const empName = escapeHtml(e.name);
        const phone = escapeHtml(e.phone);
        const avatar = e.avatar
          ? `<img src="${escapeHtml(e.avatar)}" alt="${empName}" class="w-8 h-8 rounded-full object-cover border border-[rgba(201,205,212,.6)]" />`
          : `<div class="w-8 h-8 rounded-full bg-[rgba(245,247,250,.9)] border border-[rgba(201,205,212,.6)]"></div>`;
        const role = escapeHtml(e.role || "—");
        const region = escapeHtml(e.region || "—");
        const disabledHint = e.hasSalesWorkbench ? "" : `disabled title="无销售工作台权限，无法分配"`;
        return `
          <tr class="border-t border-[rgba(201,205,212,.45)]">
            <td class="px-3 py-3">
              <input type="radio" name="apm-emp" class="accent-primary" data-apm-emp="${escapeHtml(e.id)}" ${checked} ${disabledHint} />
            </td>
            <td class="px-3 py-3 whitespace-nowrap font-semibold">${empName}</td>
            <td class="px-3 py-3 whitespace-nowrap text-muted">${phone}</td>
            <td class="px-3 py-3">${avatar}</td>
            <td class="px-3 py-3 whitespace-nowrap">${role}</td>
            <td class="px-3 py-3 whitespace-nowrap text-muted">${region}</td>
            <td class="px-3 py-3 whitespace-nowrap">${perm}</td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll("[data-apm-emp]").forEach((el) => {
      el.addEventListener("change", () => {
        selectedEmpId = el.getAttribute("data-apm-emp");
        syncConfirmState();
      });
    });
    syncConfirmState();
  }

  const REGIONS = [
    { id: "豫东", name: "豫东", owner: "胡销售" },
    { id: "豫西", name: "豫西", owner: "李静波" },
  ];

  function renderRegions() {
    const tbody = document.getElementById("apm-region-tbody");
    if (!tbody) return;
    tbody.innerHTML = REGIONS
      .map((r) => {
        const checked = selectedRegionId === r.id ? "checked" : "";
        return `
          <tr class="border-t border-[rgba(201,205,212,.45)]">
            <td class="px-3 py-3">
              <input type="radio" name="apm-region" class="accent-primary" data-apm-region="${escapeHtml(r.id)}" ${checked} />
            </td>
            <td class="px-3 py-3 whitespace-nowrap font-semibold">${escapeHtml(r.name)}</td>
            <td class="px-3 py-3 whitespace-nowrap">${escapeHtml(r.owner)}</td>
          </tr>
        `;
      })
      .join("");
    tbody.querySelectorAll("[data-apm-region]").forEach((el) => {
      el.addEventListener("change", () => {
        selectedRegionId = el.getAttribute("data-apm-region");
        syncConfirmState();
      });
    });
    syncConfirmState();
  }

  function setTab(next) {
    if (forcePersonOnly) next = "person";
    activeTab = next === "region" ? "region" : "person";
    const tabBtns = Array.from(document.querySelectorAll(".apm-tab"));
    tabBtns.forEach((b) => b.removeAttribute("aria-current"));
    tabBtns.forEach((b) => {
      const isActive = b.getAttribute("data-apm-tab") === activeTab;
      if (isActive) b.setAttribute("aria-current", "page");
      b.classList.toggle("bg-[rgba(255,138,0,.10)]", isActive);
      b.classList.toggle("border-[rgba(255,138,0,.55)]", isActive);
      b.classList.toggle("text-[#8a3b00]", isActive);
      b.classList.toggle("text-muted", !isActive);
    });
    const panePerson = document.getElementById("apm-pane-person");
    const paneRegion = document.getElementById("apm-pane-region");
    if (panePerson) panePerson.classList.toggle("hidden", activeTab !== "person");
    if (paneRegion) paneRegion.classList.toggle("hidden", activeTab !== "region");
    showTip("");
    syncConfirmState();
  }

  function wireOnce() {
    if (window.__apmWired) return;
    window.__apmWired = true;

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const closeId = t.getAttribute("data-close") || t.closest("[data-close]")?.getAttribute("data-close");
      if (closeId === "apm-assign") {
        setOpen(false);
        return;
      }
      if (t.matches('[data-overlay="apm-assign"]')) {
        setOpen(false);
      }
    });

    document.getElementById("apm-search")?.addEventListener("click", () => renderList());
    document.getElementById("apm-reset")?.addEventListener("click", () => {
      const q = document.getElementById("apm-q");
      if (q) q.value = "";
      selectedEmpId = null;
      renderList();
    });

    document.querySelectorAll(".apm-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-apm-tab") || "person";
        setTab(key);
        // reset selection per tab
        if (key === "person") {
          selectedRegionId = null;
          renderList();
        } else {
          selectedEmpId = null;
          renderRegions();
        }
      });
    });

    document.getElementById("apm-confirm")?.addEventListener("click", () => {
      const Store = window.CustomerStore;
      if (!Store || !currentCustomerId) return;
      if (activeTab === "region") {
        const region = REGIONS.find((r) => r.id === selectedRegionId);
        if (!region) {
          showTip("未选择区域");
          syncConfirmState();
          return;
        }
        // 原型：分配给区域时，更新区域负责人并清空最终负责人
        const ok = Store.updateCustomer(currentCustomerId, { regionOwner: region.owner, finalOwnerId: null });
        if (!ok) {
          showTip("客户不存在");
          syncConfirmState();
          return;
        }
      } else {
        const res = Store.assignFinalOwner(currentCustomerId, selectedEmpId);
        if (!res.ok) {
          showTip(res.message || "分配失败");
          syncConfirmState();
          return;
        }
      }
      setOpen(false);
      const done = onDone;
      onDone = null;
      currentCustomerId = null;
      selectedEmpId = null;
      selectedRegionId = null;
      showTip("");
      if (typeof done === "function") done();
    });
  }

  function open(customerId, opts) {
    ensureDom();
    wireOnce();
    currentCustomerId = customerId;
    selectedEmpId = null;
    selectedRegionId = null;
    forcePersonOnly = !!(opts && opts.personOnly);
    const tabs = document.getElementById("apm-tabs");
    if (tabs) tabs.classList.toggle("hidden", forcePersonOnly);
    setTab("person");
    onDone = opts && typeof opts.onDone === "function" ? opts.onDone : null;
    const q = document.getElementById("apm-q");
    if (q) q.value = "";
    renderList();
    if (!forcePersonOnly) renderRegions();
    setOpen(true);
  }

  window.AssignPersonModal = { open };
  try {
    window.dispatchEvent(new CustomEvent("assign-person:ready"));
  } catch (_) {}
})();

