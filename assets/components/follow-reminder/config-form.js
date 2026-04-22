/**
 * 跟进频率配置表单（仅配置页调用）
 */
(function () {
  const Store = window.FollowReminderStore;
  if (!Store) return;

  function parsePositiveInt(v) {
    const t = String(v).trim();
    if (!t) return NaN;
    if (!/^\d+$/.test(t)) return NaN;
    const n = parseInt(t, 10);
    return n > 0 ? n : NaN;
  }

  function validate(iv) {
    const A = parsePositiveInt(iv.A);
    const B = parsePositiveInt(iv.B);
    const C = parsePositiveInt(iv.C);
    const D = parsePositiveInt(iv.D);
    if (![A, B, C, D].every(Number.isFinite)) return { ok: false, msg: "请填写各级间隔（正整数）" };
    if (!(A < B && B < C && C < D)) {
      if (!(A < B)) return { ok: false, msg: "B级间隔需大于A级" };
      if (!(B < C)) return { ok: false, msg: "C级间隔需大于B级" };
      return { ok: false, msg: "D级间隔需大于C级" };
    }
    return { ok: true, value: { A, B, C, D } };
  }

  function bindPage() {
    const elA = document.getElementById("frCfgA");
    const elB = document.getElementById("frCfgB");
    const elC = document.getElementById("frCfgC");
    const elD = document.getElementById("frCfgD");
    const err = document.getElementById("frCfgErr");
    const btnSave = document.getElementById("frCfgSave");
    const btnReset = document.getElementById("frCfgReset");

    function showErr(msg) {
      if (!msg) {
        err.textContent = "";
        err.classList.add("hidden");
      } else {
        err.textContent = msg;
        err.classList.remove("hidden");
      }
    }

    function digitsOnly(el) {
      el.addEventListener("input", () => {
        el.value = el.value.replace(/\D/g, "");
        sync();
      });
    }
    [elA, elB, elC, elD].forEach(digitsOnly);

    function readIv() {
      return { A: elA.value, B: elB.value, C: elC.value, D: elD.value };
    }

    function sync() {
      const v = readIv();
      const r = validate(v);
      if (btnSave) btnSave.disabled = !r.ok;
      showErr(r.ok ? "" : r.msg);
      return r;
    }

    function fill(iv) {
      elA.value = String(iv.A);
      elB.value = String(iv.B);
      elC.value = String(iv.C);
      elD.value = String(iv.D);
      sync();
    }

    fill(Store.loadIntervals());

    btnReset.addEventListener("click", () => {
      fill(Store.DEFAULT_INTERVALS);
      showErr("");
    });

    btnSave.addEventListener("click", () => {
      const r = sync();
      if (!r.ok) return;
      Store.saveIntervals(r.value);
      showErr("");
      const t = document.createElement("div");
      t.className =
        "fixed right-4 bottom-4 z-[120] min-w-[240px] bg-surface border border-[rgba(201,205,212,.7)] rounded-xl shadow-card px-4 py-3 text-[14px]";
      t.textContent = "配置已保存";
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2200);
      if (window.__frBellRefresh) window.__frBellRefresh();
    });

    sync();
  }

  window.FollowReminderConfigForm = { bindPage, validate, parsePositiveInt };
})();
