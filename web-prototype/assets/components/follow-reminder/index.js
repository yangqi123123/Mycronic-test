/**
 * 跟进提醒：挂载铃铛 + 首页弹窗（依赖 store → bell → home-modal 加载顺序）
 */
(function () {
  function appBase() {
    return (window.__APP_BASE || "./").replace(/\\/g, "/");
  }

  function injectBell() {
    if (document.getElementById("fr-global-bell-mounted")) return;

    const header = document.querySelector("main.flex-1 > header, main > header");
    if (!header) return;

    // Ensure a right-side actions wrap (flex row) exists.
    let actions = header.querySelector("[data-topbar-actions]");
    if (!actions) {
      const kids = Array.from(header.children);
      const left = kids[0];
      const right = kids[1];
      actions = document.createElement("div");
      actions.setAttribute("data-topbar-actions", "true");
      actions.className = "flex items-center gap-2";
      if (right) {
        // Move existing right node(s) into the wrap to prevent overlap.
        actions.appendChild(right);
        header.appendChild(actions);
      } else {
        // If header had only one child, just append actions.
        header.appendChild(actions);
      }
    }

    const oldBell = actions.querySelector('button[title="消息"]');
    if (oldBell) oldBell.remove();

    const host = document.createElement("div");
    host.id = "fr-global-bell-mounted";
    host.className = "flex items-center shrink-0";
    // Place bell at the left of actions so it stays at top-right.
    actions.insertBefore(host, actions.firstChild);

    if (window.FollowReminderBell) {
      const api = window.FollowReminderBell.mount(host);
      window.__frBellRefresh = () => api.refresh();
      api.refresh();
    }
  }

  function boot() {
    if (document.getElementById("frCfgA") && window.FollowReminderConfigForm) {
      window.FollowReminderConfigForm.bindPage();
    }
    injectBell();
    if (window.FollowReminderHomeModal) {
      requestAnimationFrame(() => window.FollowReminderHomeModal.tryOpen());
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
