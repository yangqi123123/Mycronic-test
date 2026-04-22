/**
 * Workbench Modals (Prototype)
 * Global reusable modals:
 * - Follow record (新增跟进记录)
 * - Opportunity (新增商机)
 * - Quote (新增报价)
 * - Contract (新增合同)
 * - Delivery (新增交付)
 *
 * NOTE: These are intentionally global so multiple pages can call them without duplicating modal DOM.
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

  function fmtNow() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${da} ${hh}:${mm}`;
  }

  function ensureRoot() {
    if (document.getElementById("wbm-root")) return;
    const root = document.createElement("div");
    root.id = "wbm-root";
    root.innerHTML = `
      <!-- Follow record -->
      <div class="overlay" data-overlay="wbm-follow" data-open="false"></div>
      <div class="modal" data-modal="wbm-follow" data-open="false" style="max-width: 1180px; width: min(1180px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">新增跟进记录</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="wbm-follow"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">客户 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmFollowCustomer" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-[rgba(245,247,250,.7)]" readonly />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">跟进方式 <span class="text-[#F53F3F]">*</span></div>
              <select id="wbmFollowWay" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]">
                <option value="">请选择跟进方式</option>
                <option>电话</option>
                <option>线下拜访</option>
                <option>企微</option>
                <option>邮件</option>
                <option>线上会议</option>
              </select>
              <div id="wbmFollowErrWay" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">商机编号</div>
              <input id="wbmFollowOppNo" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="如：NX-2026-0001（可选）" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">跟进时间</div>
              <input id="wbmFollowAt" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-surface" />
            </div>
            <div class="col-span-12">
              <div class="text-[12px] text-muted mb-1">跟进记录 <span class="text-[#F53F3F]">*</span></div>
              <textarea id="wbmFollowContent" rows="4" class="w-full rounded-lg border border-[rgba(201,205,212,.7)] px-3 py-2 text-[14px]" placeholder="请输入跟进内容"></textarea>
              <div id="wbmFollowErrContent" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">位置</div>
              <input id="wbmFollowLoc" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="可输入拜访地址/定位信息" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">提示</div>
              <input id="wbmFollowTip" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="注意事项或异常提示（如：地址不匹配）" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[rgba(201,205,212,.6)]">
            <button class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="wbm-follow">取消</button>
            <button id="wbmFollowConfirm" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>

      <!-- Opportunity -->
      <div class="overlay" data-overlay="wbm-opp" data-open="false"></div>
      <div class="modal" data-modal="wbm-opp" data-open="false" style="max-width: 980px; width: min(980px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">新增商机</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="wbm-opp"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">客户 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmOppCustomer" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-[rgba(245,247,250,.7)]" readonly />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="flex items-center justify-between">
                <div class="text-[12px] text-muted mb-1">商机编号 <span class="text-[#F53F3F]">*</span></div>
                <button id="wbmOppAutoNo" type="button" class="text-primary text-[12px] font-semibold">自动生成</button>
              </div>
              <input id="wbmOppNo" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="NX-2026-xxxx" />
              <div id="wbmOppErrNo" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12">
              <div class="text-[12px] text-muted mb-1">商机描述 <span class="text-[#F53F3F]">*</span></div>
              <textarea id="wbmOppDesc" rows="4" class="w-full rounded-lg border border-[rgba(201,205,212,.7)] px-3 py-2 text-[14px]" placeholder="请输入详细需求内容"></textarea>
              <div id="wbmOppErrDesc" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[rgba(201,205,212,.6)]">
            <button class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="wbm-opp">取消</button>
            <button id="wbmOppConfirm" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>

      <!-- Quote -->
      <div class="overlay" data-overlay="wbm-quote" data-open="false"></div>
      <div class="modal" data-modal="wbm-quote" data-open="false" style="max-width: 1080px; width: min(1080px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">新增报价</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="wbm-quote"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">客户 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmQuoteCustomer" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-[rgba(245,247,250,.7)]" readonly />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">商机编号 <span class="text-[#F53F3F]">*</span></div>
              <select id="wbmQuoteOppNo" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]">
                <option value="">请选择商机编号</option>
              </select>
              <div id="wbmQuoteErrOpp" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">报价金额 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmQuoteAmt" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="例如：120000.00" />
              <div id="wbmQuoteErrAmt" class="hidden text-[12px] text-[#F53F3F] mt-1">必填且为合法金额</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">报价附件（PDF/Excel/Word）</div>
              <input id="wbmQuoteFile" type="file" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px] pt-2" />
              <div class="text-[12px] text-muted mt-1">最大 10MB，支持 .pdf/.xls/.xlsx/.doc/.docx</div>
            </div>
            <div class="col-span-12">
              <div class="text-[12px] text-muted mb-1">备注</div>
              <textarea id="wbmQuoteNote" rows="3" class="w-full rounded-lg border border-[rgba(201,205,212,.7)] px-3 py-2 text-[14px]" placeholder="可选，填写报价说明"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[rgba(201,205,212,.6)]">
            <button class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="wbm-quote">取消</button>
            <button id="wbmQuoteConfirm" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>

      <!-- Contract -->
      <div class="overlay" data-overlay="wbm-contract" data-open="false"></div>
      <div class="modal" data-modal="wbm-contract" data-open="false" style="max-width: 1180px; width: min(1180px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">新增合同</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="wbm-contract"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">客户 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmCtCustomer" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-[rgba(245,247,250,.7)]" readonly />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">商机描述</div>
              <select id="wbmCtOppNo" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]">
                <option value="">请选择（随客户变化）</option>
              </select>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="flex items-center justify-between">
                <div class="text-[12px] text-muted mb-1">合同编号 <span class="text-[#F53F3F]">*</span></div>
                <button id="wbmCtAutoNo" type="button" class="text-primary text-[12px] font-semibold">自动生成</button>
              </div>
              <input id="wbmCtNo" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="HT-2026-7002" />
              <div id="wbmCtErrNo" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">合同名称 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmCtName" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="请输入合同名称" />
              <div id="wbmCtErrName" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">合同金额（元） <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmCtAmt" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="请输入合同金额" />
              <div id="wbmCtErrAmt" class="hidden text-[12px] text-[#F53F3F] mt-1">必填且为合法金额</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">签署时间</div>
              <input id="wbmCtSigned" type="date" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">到期时间</div>
              <input id="wbmCtExpire" type="date" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">合同附件（上传）</div>
              <input id="wbmCtFileA" type="file" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px] pt-2" />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">纸质合同附件（上传）</div>
              <input id="wbmCtFileB" type="file" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px] pt-2" />
            </div>
            <div class="col-span-12">
              <div class="text-[12px] text-muted mb-1">备注</div>
              <textarea id="wbmCtNote" rows="3" class="w-full rounded-lg border border-[rgba(201,205,212,.7)] px-3 py-2 text-[14px]" placeholder="可选"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[rgba(201,205,212,.6)]">
            <button class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="wbm-contract">取消</button>
            <button id="wbmCtConfirm" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>

      <!-- Delivery -->
      <div class="overlay" data-overlay="wbm-delivery" data-open="false"></div>
      <div class="modal" data-modal="wbm-delivery" data-open="false" style="max-width: 1180px; width: min(1180px, 96vw);">
        <div class="p-4 border-b border-[rgba(201,205,212,.7)] flex items-center justify-between">
          <div class="text-[16px] font-semibold">新增交付</div>
          <button class="w-9 h-9 rounded-lg hover:bg-[rgba(245,247,250,.9)]" data-close="wbm-delivery"><i class="fa-solid fa-xmark text-muted"></i></button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">客户 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmDelCustomer" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-[rgba(245,247,250,.7)]" readonly />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">合同 <span class="text-[#F53F3F]">*</span></div>
              <select id="wbmDelContract" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]">
                <option value="">请选择合同</option>
              </select>
              <div id="wbmDelErrCt" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">合同名称（只读）</div>
              <input id="wbmDelContractName" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-[rgba(245,247,250,.7)]" readonly />
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">交付时间 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmDelAt" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px] bg-surface" />
              <div id="wbmDelErrAt" class="hidden text-[12px] text-[#F53F3F] mt-1">必填</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">成交金额 <span class="text-[#F53F3F]">*</span></div>
              <input id="wbmDelAmt" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]" placeholder="例如：120000.00" />
              <div id="wbmDelErrAmt" class="hidden text-[12px] text-[#F53F3F] mt-1">必填且为合法金额</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-[12px] text-muted mb-1">交付状态</div>
              <select id="wbmDelStatus" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px]">
                <option>待交付</option>
                <option>交付中</option>
                <option>已交付</option>
              </select>
            </div>
            <div class="col-span-12">
              <div class="text-[12px] text-muted mb-1">附件</div>
              <input id="wbmDelFile" type="file" class="w-full h-10 rounded-lg border border-[rgba(201,205,212,.7)] bg-surface px-3 text-[14px] pt-2" />
              <div class="text-[12px] text-muted mt-1">最大 10MB，支持 .pdf/.xls/.xlsx/.doc/.docx/.png/.jpg</div>
            </div>
            <div class="col-span-12">
              <div class="text-[12px] text-muted mb-1">备注</div>
              <textarea id="wbmDelNote" rows="3" class="w-full rounded-lg border border-[rgba(201,205,212,.7)] px-3 py-2 text-[14px]" placeholder="可选"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[rgba(201,205,212,.6)]">
            <button class="h-9 px-4 rounded-lg border border-[rgba(201,205,212,.7)] text-[14px] font-semibold" data-close="wbm-delivery">取消</button>
            <button id="wbmDelConfirm" class="h-9 px-4 rounded-lg bg-primary text-white text-[14px] font-semibold">确认</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
  }

  function setOpen(id, open) {
    const ov = document.querySelector(`[data-overlay="${id}"]`);
    const m = document.querySelector(`[data-modal="${id}"]`);
    if (ov) ov.dataset.open = open ? "true" : "false";
    if (m) m.dataset.open = open ? "true" : "false";
  }

  // Current open context
  let currentCustomerId = null;
  let currentCustomerName = "";
  let onDone = null;

  function bindClose(id) {
    document.querySelectorAll(`[data-close="${id}"]`).forEach((b) => b.addEventListener("click", () => setOpen(id, false)));
    document.querySelectorAll(`[data-overlay="${id}"]`).forEach((ov) => ov.addEventListener("click", () => setOpen(id, false)));
  }

  function setErr(elId, show) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.toggle("hidden", !show);
  }

  function openFollow(opts) {
    ensureRoot();
    bindClose("wbm-follow");
    currentCustomerId = opts.customerId;
    currentCustomerName = opts.customerName || "";
    onDone = opts.onDone || null;

    document.getElementById("wbmFollowCustomer").value = currentCustomerName;
    document.getElementById("wbmFollowWay").value = "";
    document.getElementById("wbmFollowOppNo").value = "";
    document.getElementById("wbmFollowAt").value = fmtNow();
    document.getElementById("wbmFollowContent").value = "";
    document.getElementById("wbmFollowLoc").value = "";
    document.getElementById("wbmFollowTip").value = "";
    setErr("wbmFollowErrWay", false);
    setErr("wbmFollowErrContent", false);

    document.getElementById("wbmFollowConfirm").onclick = () => {
      const way = document.getElementById("wbmFollowWay").value;
      const content = (document.getElementById("wbmFollowContent").value || "").trim();
      setErr("wbmFollowErrWay", !way);
      setErr("wbmFollowErrContent", !content);
      if (!way || !content) return;
      setOpen("wbm-follow", false);
      if (typeof onDone === "function") onDone({ way, content });
    };

    setOpen("wbm-follow", true);
  }

  function openOpp(opts) {
    ensureRoot();
    bindClose("wbm-opp");
    currentCustomerId = opts.customerId;
    currentCustomerName = opts.customerName || "";
    onDone = opts.onDone || null;

    const noEl = document.getElementById("wbmOppNo");
    const descEl = document.getElementById("wbmOppDesc");
    document.getElementById("wbmOppCustomer").value = currentCustomerName;
    noEl.value = "";
    descEl.value = "";
    setErr("wbmOppErrNo", false);
    setErr("wbmOppErrDesc", false);

    document.getElementById("wbmOppAutoNo").onclick = () => {
      const y = new Date().getFullYear();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      noEl.value = `NX-${y}-${seq}`;
    };

    document.getElementById("wbmOppConfirm").onclick = () => {
      const no = (noEl.value || "").trim();
      const desc = (descEl.value || "").trim();
      setErr("wbmOppErrNo", !no);
      setErr("wbmOppErrDesc", !desc);
      if (!no || !desc) return;
      setOpen("wbm-opp", false);
      if (typeof onDone === "function") onDone({ no, desc });
    };

    setOpen("wbm-opp", true);
  }

  function fillOppOptions(sel) {
    sel.innerHTML = `<option value="">请选择商机编号</option>`;
    const y = new Date().getFullYear();
    // prototype: offer 3 mock opp numbers
    [`NX-${y}-7001`, `NX-${y}-7002`, `NX-${y}-7003`].forEach((v) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      sel.appendChild(o);
    });
  }

  function openQuote(opts) {
    ensureRoot();
    bindClose("wbm-quote");
    currentCustomerId = opts.customerId;
    currentCustomerName = opts.customerName || "";
    onDone = opts.onDone || null;

    document.getElementById("wbmQuoteCustomer").value = currentCustomerName;
    const sel = document.getElementById("wbmQuoteOppNo");
    fillOppOptions(sel);
    sel.value = "";
    document.getElementById("wbmQuoteAmt").value = "";
    document.getElementById("wbmQuoteFile").value = "";
    document.getElementById("wbmQuoteNote").value = "";
    setErr("wbmQuoteErrOpp", false);
    setErr("wbmQuoteErrAmt", false);

    document.getElementById("wbmQuoteConfirm").onclick = () => {
      const opp = sel.value;
      const amt = (document.getElementById("wbmQuoteAmt").value || "").trim();
      const okAmt = /^\d+(\.\d{1,2})?$/.test(amt) && Number(amt) > 0;
      setErr("wbmQuoteErrOpp", !opp);
      setErr("wbmQuoteErrAmt", !okAmt);
      if (!opp || !okAmt) return;
      setOpen("wbm-quote", false);
      if (typeof onDone === "function") onDone({ opp, amt: Number(amt) });
    };

    setOpen("wbm-quote", true);
  }

  function openContract(opts) {
    ensureRoot();
    bindClose("wbm-contract");
    currentCustomerId = opts.customerId;
    currentCustomerName = opts.customerName || "";
    onDone = opts.onDone || null;

    document.getElementById("wbmCtCustomer").value = currentCustomerName;
    const oppSel = document.getElementById("wbmCtOppNo");
    oppSel.innerHTML = `<option value="">请选择（随客户变化）</option>`;
    // prototype: use same mock list as quote
    const y = new Date().getFullYear();
    [`NX-${y}-7001`, `NX-${y}-7002`, `NX-${y}-7003`].forEach((v) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      oppSel.appendChild(o);
    });
    oppSel.value = "";

    const noEl = document.getElementById("wbmCtNo");
    noEl.value = "";
    const nameEl = document.getElementById("wbmCtName");
    nameEl.value = "";
    document.getElementById("wbmCtAmt").value = "";
    document.getElementById("wbmCtSigned").value = "";
    document.getElementById("wbmCtExpire").value = "";
    document.getElementById("wbmCtFileA").value = "";
    document.getElementById("wbmCtFileB").value = "";
    document.getElementById("wbmCtNote").value = "";
    setErr("wbmCtErrNo", false);
    setErr("wbmCtErrName", false);
    setErr("wbmCtErrAmt", false);

    document.getElementById("wbmCtAutoNo").onclick = () => {
      const y2 = new Date().getFullYear();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      noEl.value = `HT-${y2}-${seq}`;
    };

    document.getElementById("wbmCtConfirm").onclick = () => {
      const no = (noEl.value || "").trim();
      const name = (nameEl.value || "").trim();
      const amt = (document.getElementById("wbmCtAmt").value || "").trim();
      const okAmt = /^\d+(\.\d{1,2})?$/.test(amt) && Number(amt) > 0;
      setErr("wbmCtErrNo", !no);
      setErr("wbmCtErrName", !name);
      setErr("wbmCtErrAmt", !okAmt);
      if (!no || !name || !okAmt) return;
      setOpen("wbm-contract", false);
      if (typeof onDone === "function") onDone({ no, name, amt: Number(amt) });
    };

    setOpen("wbm-contract", true);
  }

  function openDelivery(opts) {
    ensureRoot();
    bindClose("wbm-delivery");
    currentCustomerId = opts.customerId;
    currentCustomerName = opts.customerName || "";
    onDone = opts.onDone || null;

    document.getElementById("wbmDelCustomer").value = currentCustomerName;
    const ctSel = document.getElementById("wbmDelContract");
    const ctName = document.getElementById("wbmDelContractName");
    ctSel.innerHTML = `<option value="">请选择合同</option>`;
    // prototype: provide 2 mock contracts
    const y = new Date().getFullYear();
    const list = [
      { no: `HT-${y}-7001`, name: "采购合同（示例）" },
      { no: `HT-${y}-7002`, name: "服务合同（示例）" },
    ];
    list.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.no;
      o.textContent = c.no;
      o.setAttribute("data-name", c.name);
      ctSel.appendChild(o);
    });
    ctSel.value = "";
    ctName.value = "";
    ctSel.onchange = () => {
      const opt = ctSel.selectedOptions[0];
      ctName.value = opt ? opt.getAttribute("data-name") || "" : "";
    };

    document.getElementById("wbmDelAt").value = fmtNow();
    document.getElementById("wbmDelAmt").value = "";
    document.getElementById("wbmDelStatus").value = "待交付";
    document.getElementById("wbmDelFile").value = "";
    document.getElementById("wbmDelNote").value = "";
    setErr("wbmDelErrCt", false);
    setErr("wbmDelErrAt", false);
    setErr("wbmDelErrAmt", false);

    document.getElementById("wbmDelConfirm").onclick = () => {
      const ct = ctSel.value;
      const at = (document.getElementById("wbmDelAt").value || "").trim();
      const amt = (document.getElementById("wbmDelAmt").value || "").trim();
      const okAmt = /^\d+(\.\d{1,2})?$/.test(amt) && Number(amt) > 0;
      setErr("wbmDelErrCt", !ct);
      setErr("wbmDelErrAt", !at);
      setErr("wbmDelErrAmt", !okAmt);
      if (!ct || !at || !okAmt) return;
      setOpen("wbm-delivery", false);
      if (typeof onDone === "function") onDone({ ct, at, amt: Number(amt) });
    };

    setOpen("wbm-delivery", true);
  }

  window.WorkbenchModals = {
    openFollow,
    openOpp,
    openQuote,
    openContract,
    openDelivery,
  };

  try {
    window.dispatchEvent(new CustomEvent("workbench-modals:ready"));
  } catch (_) {}
})();

