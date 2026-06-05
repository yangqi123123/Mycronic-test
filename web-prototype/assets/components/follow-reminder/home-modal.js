/**
 * 首页（非 /pages/）进入后：待跟进提醒弹窗 + 24h 抑制 + 每客户仅首次弹窗
 */
(function () {
  const Store = window.FollowReminderStore;
  const Bell = window.FollowReminderBell;
  if (!Store || !Bell) return;

  function isDashboardHome() {
    const p = (location.pathname || "").replace(/\\/g, "/").toLowerCase();
    if (p.includes("/pages/")) return false;
    return /(^|\/)index\.html$/i.test(p) || /\/web-prototype\/?$/i.test(p);
  }

  function pickModalCustomer(dueList, meta) {
    const sorted = dueList.slice().sort((a, b) => Store.gradeRank(b.grade) - Store.gradeRank(a.grade));
    return sorted.find((c) => !meta.homeShownIds.includes(c.id)) || null;
  }

  function ensureModalDom() {
    let el = document.getElementById("fr-home-modal-root");
    if (el) return el;
    el = document.createElement("div");
    el.id = "fr-home-modal-root";
    el.innerHTML = `
      <div id="fr-home-overlay" class="fixed inset-0 z-[100] bg-black/35 hidden items-center justify-center p-4" style="display:none">
        <div id="fr-home-card" class="bg-surface rounded-xl shadow-card border border-[rgba(201,205,212,.7)] w-full max-w-[440px] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="fr-home-title">
          <div class="px-4 py-3 border-b border-[rgba(201,205,212,.6)] flex items-center justify-between">
            <div id="fr-home-title" class="text-[16px] font-semibold pr-2"></div>
            <button type="button" id="fr-home-x" class="w-8 h-8 rounded-lg border border-[rgba(201,205,212,.6)] hover:bg-[rgba(245,247,250,.9)] shrink-0" aria-label="关闭">
              <i class="fa-solid fa-xmark text-muted"></i>
            </button>
          </div>
          <div class="px-4 py-3">
            <div id="fr-home-body" class="text-[14px] text-text leading-relaxed"></div>
            <div id="fr-home-time" class="text-[12px] text-muted mt-3"></div>
          </div>
          <div class="px-4 py-3 border-t border-[rgba(201,205,212,.6)] flex justify-end bg-[rgba(245,247,250,.5)]">
            <button type="button" id="fr-home-ok" class="h-9 px-5 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    const overlay = el.querySelector("#fr-home-overlay");
    const card = el.querySelector("#fr-home-card");

    function closeAndRecord(customerId, navigate, markRead) {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      const meta = Store.loadMeta();
      if (customerId && !meta.homeShownIds.includes(customerId)) meta.homeShownIds.push(customerId);
      if (markRead && customerId && !meta.readIds.includes(customerId)) meta.readIds.push(customerId);
      meta.suppressUntil = Date.now() + 24 * 3600000;
      Store.saveMeta(meta);
      if (window.__frBellRefresh) window.__frBellRefresh();
      if (navigate) Bell.navigateWorkbench(customerId);
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        const id = overlay.dataset.customerId || "";
        closeAndRecord(id, false, false);
      }
    });
    card.addEventListener("click", (e) => e.stopPropagation());
    el.querySelector("#fr-home-x").addEventListener("click", () => {
      const id = overlay.dataset.customerId || "";
      closeAndRecord(id, false, false);
    });
    el.querySelector("#fr-home-ok").addEventListener("click", () => {
      const id = overlay.dataset.customerId || "";
      closeAndRecord(id, true, true);
    });

    return el;
  }

  function tryOpen() {
    if (!isDashboardHome()) return;
    const meta = Store.loadMeta();
    if (Date.now() < meta.suppressUntil) return;

    const due = Store.listDueCustomers();
    if (!due.length) return;

    const c = pickModalCustomer(due, meta);
    if (!c) return;

    const overlay = ensureModalDom().querySelector("#fr-home-overlay");
    overlay.dataset.customerId = c.id;
    overlay.querySelector("#fr-home-title").textContent = `您有一个${c.grade}级客户需要尽快跟进`;
    const region = `${c.province} ${c.city} ${c.district}`;
    overlay.querySelector("#fr-home-body").textContent = `${c.name} · ${region} · ${c.industry}`;
    overlay.querySelector("#fr-home-time").textContent = `创建时间：${Store.formatDateTime(c.createdAt)}`;
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
  }

  window.FollowReminderHomeModal = { tryOpen, isDashboardHome };
})();
