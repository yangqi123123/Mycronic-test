/* Shared lead/enterprise detail modal.
   - Call LeadDetailModal.open(row, { onEdit?: (row) => void })
   - row should contain the same fields used in leads-pool detail view.
*/
(function () {
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function displayValue(v) {
    const s = String(v ?? "").trim();
    return s && s !== "（未抓取）" && s !== "—" ? s : "—";
  }

  function statusChip(status) {
    const s = String(status || "").trim();
    if (!s || s === "—") return "—";
    let cls = "chip chip--primary";
    if (s === "存续") cls = "chip chip--success";
    else if (s === "注销") cls = "chip chip--danger";
    else if (s === "迁入" || s === "迁出") cls = "chip chip--primary";
    else if (s === "停业" || s === "清算") cls = "chip chip--warning";
    return `<span class="${cls}">${escapeHtml(s)}</span>`;
  }

  function setModalOpen(id, open) {
    const ov = document.querySelector(`[data-overlay="${id}"]`);
    const m = document.querySelector(`[data-modal="${id}"]`);
    if (ov) ov.dataset.open = open ? "true" : "false";
    if (m) m.dataset.open = open ? "true" : "false";
  }
  function openModal(id) {
    setModalOpen(id, true);
  }
  function closeModal(id) {
    setModalOpen(id, false);
  }

  function ensureModals() {
    if (document.getElementById("leadDetailModalRoot")) return;

    const root = document.createElement("div");
    root.id = "leadDetailModalRoot";
    root.innerHTML = `
      <div class="overlay" data-overlay="lead-detail" data-open="false"></div>
      <div class="modal" data-modal="lead-detail" data-open="false" style="max-width: 1100px; width: min(1100px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">线索详情</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="lead-detail" title="关闭"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 max-h-[min(82vh,780px)] overflow-y-auto">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-8 space-y-4">
              <section class="bg-[rgba(245,247,250,.5)] rounded-xl border border-[rgba(201,205,212,.6)] p-4">
                <div class="text-[15px] font-semibold mb-3">线索基本信息</div>
                <div id="leadDetailInfo" class="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px]"></div>
              </section>
            </div>
            <div class="col-span-12 lg:col-span-4 space-y-4">
              <section class="bg-[rgba(245,247,250,.5)] rounded-xl border border-[rgba(201,205,212,.6)] p-4">
                <div id="leadDetailContactsTitle" class="text-[15px] font-semibold mb-3">关联联系人</div>
                <div id="leadDetailContacts" class="space-y-3"></div>
              </section>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-4 mt-2 border-t border-[rgba(201,205,212,.6)]">
            <button class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="lead-detail">关闭</button>
            <button id="ldmBtnEdit" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">编辑</button>
          </div>
        </div>
      </div>

      <div class="overlay" data-overlay="lead-source-preview" data-open="false"></div>
      <div class="modal" data-modal="lead-source-preview" data-open="false" style="max-width: 900px; width: min(900px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">数据来源网页</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="lead-source-preview" title="关闭"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div class="text-[14px] text-muted truncate" id="sourcePreviewUrl">https://example.com</div>
            <a id="sourcePreviewLink" href="#" target="_blank" rel="noreferrer" class="h-8 px-3 rounded-lg bg-primary text-white text-[13px] font-semibold flex items-center">在新标签页打开</a>
          </div>
          <div class="rounded-xl border border-[rgba(201,205,212,.6)] bg-[rgba(245,247,250,.5)] h-[320px] flex items-center justify-center">
            <div class="text-center">
              <i class="fa-solid fa-globe text-muted text-[32px]"></i>
              <div class="mt-2 text-[14px] text-muted">网页预览占位</div>
              <div class="mt-1 text-[12px] text-muted">原型阶段仅展示数据源入口</div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    root.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.getAttribute("data-close")));
    });
    root.querySelectorAll("[data-overlay]").forEach((ov) => {
      ov.addEventListener("click", () => closeModal(ov.getAttribute("data-overlay")));
    });
  }

  const CARD_LINK_URL = "https://hbggzy.cn/jyxx/003002/003002004/20260611/8ff88f25-d3e3-4fef-b9f1-f807b9f78b7f.html";

  function open(row, options) {
    options = options || {};
    ensureModals();

    const region = [row.prov, row.city, row.county].filter(Boolean).join("/") || "—";
    const infoFields = [
      ["客户名称", row.name],
      ["客户等级", row.grade],
      ["优先级", row.priority],
      ["项目名称", row.projectName],
      ["项目编号", row.projectNo],
      ["行业类型", row.industry],
      ["省市区", region],
      ["采集时间", row.collectedAt],
      ["统一社会信用代码", row.uscc],
      ["法定代表人", row.legalPerson],
      ["实缴资本", row.paidInCapital],
      ["成立日期", row.establishedAt],
      ["组织机构代码", row.orgCode],
      ["注册资本", row.registeredCapital],
      ["营业期限", row.businessTerm],
      ["企业状态", row.enterpriseStatus],
      ["年营业额", row.annualRevenue],
      ["企业规模", row.enterpriseScale],
      ["企业类型", row.enterpriseType],
      ["工商注册号", row.regNo],
      ["参保人数", row.insuredCount],
      ["纳税人识别号", row.taxNo],
      ["核准日期", row.approvedAt],
      ["登记机关", row.regAuthority],
      ["曾用名", row.formerName],
      ["注册地址", row.registeredAddress, true],
      ["经营范围", row.scope, true],
      ["关键需求摘要", row.needSummary, true],
    ];

    const infoWrap = document.getElementById("leadDetailInfo");
    infoWrap.innerHTML = infoFields
      .map(([label, value, full]) => {
        const cls = full ? "col-span-2" : "";
        const content = label === "企业状态" ? statusChip(value) : escapeHtml(displayValue(value));
        return `<div class="min-w-0 ${cls}"><div class="text-[12px] text-muted mb-0.5">${escapeHtml(label)}</div><div class="font-medium ${full ? "whitespace-pre-wrap" : "truncate"}">${content}</div></div>`;
      })
      .join("");

    const contactsWrap = document.getElementById("leadDetailContacts");
    const contactsTitle = document.getElementById("leadDetailContactsTitle");
    const contacts = row.contacts || [];
    if (contactsTitle) {
      contactsTitle.textContent = contacts.length ? `关联联系人（${contacts.length} 个联系方式）` : "关联联系人";
    }
    if (!contacts.length) {
      contactsWrap.innerHTML = `<div class="text-[13px] text-muted">暂无联系人</div>`;
    } else {
      contactsWrap.innerHTML = contacts
        .map(
          (c) => `
          <div class="contact-card rounded-xl border border-[rgba(201,205,212,.6)] bg-surface p-3 cursor-pointer hover:shadow-md transition" title="点击打开来源网页" data-contact-url="${escapeHtml(CARD_LINK_URL)}">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="text-[14px] font-semibold truncate">${escapeHtml(c.name || "—")}</div>
              </div>
              ${
                c.key
                  ? `<span class="px-2 py-0.5 rounded bg-[rgba(255,138,0,.12)] text-[11px] text-primary font-semibold shrink-0">${escapeHtml(c.title || "关键人")}</span>`
                  : `<span class="px-2 py-0.5 rounded bg-[rgba(245,247,250,.9)] border border-[rgba(201,205,212,.6)] text-[11px] text-muted font-semibold shrink-0">${escapeHtml(c.title || "—")}</span>`
              }
            </div>
            <div class="mt-2 space-y-1 text-[13px]">
              <div class="flex items-center gap-2"><i class="fa-solid fa-phone text-muted w-4 text-center"></i><span class="truncate">${escapeHtml(c.phone || "—")}</span></div>
              <div class="flex items-center gap-2"><i class="fa-solid fa-envelope text-muted w-4 text-center"></i><span class="truncate">${escapeHtml(c.email || "—")}</span></div>
              <div class="flex items-center gap-2"><i class="fa-solid fa-location-dot text-muted w-4 text-center"></i><span class="truncate">${escapeHtml(c.address || "—")}</span></div>
            </div>
            <div class="mt-2 pt-2 border-t border-[rgba(201,205,212,.4)] flex items-center justify-between">
              <span class="text-[12px] text-muted">数据来源</span>
              <span class="text-[12px] font-medium truncate max-w-[60%]">${escapeHtml(c.source || "—")}</span>
            </div>
            <div class="mt-1.5 flex items-center justify-between">
              <span class="text-[12px] text-muted">来源网页</span>
              <a href="${escapeHtml(CARD_LINK_URL)}" target="_blank" rel="noopener noreferrer" class="source-url-link text-[12px] text-primary font-semibold truncate max-w-[60%] hover:underline" onclick="event.stopPropagation();">${escapeHtml(CARD_LINK_URL)}</a>
            </div>
            <div class="mt-1.5 flex items-center justify-between">
              <span class="text-[12px] text-muted">采集器</span>
              <span class="text-[12px] font-medium truncate max-w-[60%]">${escapeHtml(row.collector || "—")}</span>
            </div>
          </div>
        `
        )
        .join("");
      contactsWrap.querySelectorAll(".contact-card").forEach((card) => {
        card.addEventListener("click", () => window.open(card.getAttribute("data-contact-url") || CARD_LINK_URL, "_blank", "noopener,noreferrer"));
      });
      contactsWrap.querySelectorAll(".source-url-link").forEach((a) => {
        a.addEventListener("click", (e) => e.stopPropagation());
      });
    }

    const editBtn = document.getElementById("ldmBtnEdit");
    if (editBtn) {
      if (typeof options.onEdit === "function") {
        editBtn.style.display = "";
        editBtn.onclick = () => {
          closeModal("lead-detail");
          options.onEdit(row);
        };
      } else {
        editBtn.style.display = "none";
        editBtn.onclick = null;
      }
    }

    openModal("lead-detail");
  }

  window.LeadDetailModal = { open, close: closeModal };
})();
