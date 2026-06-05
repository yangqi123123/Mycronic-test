/**
 * 跟进频率 + 待跟进提醒 —— Mock 持久化（localStorage）
 */
(function () {
  const K_INTERVALS = "fr_follow_intervals_v1";
  const K_META = "fr_follow_reminder_meta_v1";
  const K_SEEDED = "fr_follow_reminder_seeded_v1";
  const K_MESSAGES = "fr_follow_messages_v1";

  const DEFAULT_INTERVALS = { A: 2, B: 5, C: 10, D: 30 };

  /** @type {{ id: string, name: string, grade: string, province: string, city: string, district: string, industry: string, lastFollowAt: string, createdAt: string }[]} */
  const DEFAULT_CUSTOMERS = [
    {
      id: "cust-a-001",
      name: "芯联微电子",
      grade: "A",
      province: "江苏省",
      city: "苏州市",
      district: "工业园区",
      industry: "半导体",
      lastFollowAt: "2026-04-08T10:00:00",
      createdAt: "2026-04-01 09:00:00",
    },
    {
      id: "cust-b-002",
      name: "华创SMT",
      grade: "B",
      province: "广东省",
      city: "深圳市",
      district: "宝安区",
      industry: "SMT",
      lastFollowAt: "2026-04-05T14:30:00",
      createdAt: "2026-03-22 11:15:00",
    },
    {
      id: "cust-c-003",
      name: "江南精密制造",
      grade: "C",
      province: "浙江省",
      city: "宁波市",
      district: "鄞州区",
      industry: "电子制造",
      lastFollowAt: "2026-03-30T09:00:00",
      createdAt: "2026-03-25 16:40:00",
    },
    {
      id: "cust-a-004",
      name: "苏州先进封装科技",
      grade: "A",
      province: "江苏省",
      city: "苏州市",
      district: "吴中区",
      industry: "半导体",
      lastFollowAt: "2026-04-09T15:20:00",
      createdAt: "2026-04-03 13:12:00",
    },
    {
      id: "cust-b-005",
      name: "京北智造设备",
      grade: "B",
      province: "北京市",
      city: "北京市",
      district: "海淀区",
      industry: "自动化设备",
      lastFollowAt: "2026-04-06T09:10:00",
      createdAt: "2026-03-28 10:06:00",
    },
    {
      id: "cust-d-006",
      name: "华南电子配套",
      grade: "D",
      province: "广东省",
      city: "东莞市",
      district: "南城区",
      industry: "电子制造",
      lastFollowAt: "2026-03-10T08:00:00",
      createdAt: "2026-03-19 09:30:00",
    },
  ];

  function gradeRank(g) {
    return { A: 4, B: 3, C: 2, D: 1 }[g] || 0;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDateTime(isoOrStr) {
    const s = String(isoOrStr).trim().replace(" ", "T");
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return String(isoOrStr);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }

  function loadIntervals() {
    try {
      const s = localStorage.getItem(K_INTERVALS);
      if (!s) return { ...DEFAULT_INTERVALS };
      const o = JSON.parse(s);
      if (!o || typeof o !== "object") return { ...DEFAULT_INTERVALS };
      return { ...DEFAULT_INTERVALS, ...o };
    } catch {
      return { ...DEFAULT_INTERVALS };
    }
  }

  function saveIntervals(iv) {
    localStorage.setItem(K_INTERVALS, JSON.stringify(iv));
  }

  function loadMeta() {
    try {
      const s = localStorage.getItem(K_META);
      if (!s) return { suppressUntil: 0, homeShownIds: [], readIds: [] };
      const o = JSON.parse(s);
      return {
        suppressUntil: Number(o.suppressUntil) || 0,
        homeShownIds: Array.isArray(o.homeShownIds) ? o.homeShownIds : [],
        readIds: Array.isArray(o.readIds) ? o.readIds : [],
      };
    } catch {
      return { suppressUntil: 0, homeShownIds: [], readIds: [] };
    }
  }

  function saveMeta(meta) {
    localStorage.setItem(K_META, JSON.stringify(meta));
  }

  function ensureSeedCustomers() {
    if (localStorage.getItem(K_SEEDED) === "1") return;
    localStorage.setItem(K_SEEDED, "1");
  }

  function buildDefaultMessages() {
    // 固定 6 条 mock 消息：与客户绑定，内容格式严格为「客户名称：xx、地区：xx、行业：xx」
    const now = new Date();
    const mkTime = (daysAgo, hh, mm) => {
      const d = new Date(now.getTime());
      d.setDate(d.getDate() - daysAgo);
      d.setHours(hh, mm, 0, 0);
      return formatDateTime(d.toISOString());
    };
    const map = {
      "cust-a-001": { daysAgo: 1, hh: 9, mm: 0 },
      "cust-b-002": { daysAgo: 2, hh: 11, mm: 15 },
      "cust-c-003": { daysAgo: 3, hh: 16, mm: 40 },
      "cust-a-004": { daysAgo: 4, hh: 13, mm: 12 },
      "cust-b-005": { daysAgo: 5, hh: 10, mm: 6 },
      "cust-d-006": { daysAgo: 6, hh: 9, mm: 30 },
    };
    return getCustomers().slice(0, 6).map((c) => {
      const region = `${c.province}${c.city}${c.district}`;
      const t = map[c.id] || { daysAgo: 1, hh: 9, mm: 0 };
      return {
        id: c.id,
        customerId: c.id,
        grade: c.grade,
        title: `您有一个${c.grade}级客户需要尽快跟进`,
        content: `客户名称：${c.name}、地区：${region}、行业：${c.industry}`,
        createdAt: mkTime(t.daysAgo, t.hh, t.mm),
      };
    });
  }

  function ensureSeedMessages() {
    // Always validate; if invalid, rebuild and persist.
    try {
      const s = localStorage.getItem(K_MESSAGES);
      if (!s) {
        const msgs = buildDefaultMessages();
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
        return;
      }
      const arr = JSON.parse(s);
      if (!Array.isArray(arr) || arr.length < 6) {
        const msgs = buildDefaultMessages();
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
        return;
      }
      // Basic schema validation
      const ok = arr.slice(0, 6).every((m) => {
        if (!m || typeof m !== "object") return false;
        const keys = ["id", "customerId", "grade", "title", "content", "createdAt"];
        if (!keys.every((k) => typeof m[k] === "string" && m[k].trim())) return false;
        // Enforce content format to avoid old data
        if (!String(m.content).includes("客户名称：") || !String(m.content).includes("地区：") || !String(m.content).includes("行业：")) return false;
        return true;
      });
      if (!ok) {
        const msgs = buildDefaultMessages();
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
      }
    } catch {
      try {
        const msgs = buildDefaultMessages();
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
      } catch {
        // ignore
      }
    }
  }

  function loadMessages() {
    ensureSeedMessages();
    try {
      const s = localStorage.getItem(K_MESSAGES);
      if (!s) {
        const msgs = buildDefaultMessages();
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
        return msgs;
      }
      const arr = JSON.parse(s);
      if (!Array.isArray(arr) || arr.length < 6) {
        const msgs = buildDefaultMessages();
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
        return msgs;
      }
      // normalize to first 6
      return arr.slice(0, 6);
    } catch {
      const msgs = buildDefaultMessages();
      try {
        localStorage.setItem(K_MESSAGES, JSON.stringify(msgs));
      } catch {
        // ignore
      }
      return msgs;
    }
  }

  function listMessages() {
    const meta = loadMeta();
    return loadMessages()
      .slice()
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map((m) => ({ ...m, read: meta.readIds.includes(m.id) }));
  }

  function daysBetween(fromMs, toMs) {
    return (toMs - fromMs) / 86400000;
  }

  function getCustomers() {
    ensureSeedCustomers();
    return DEFAULT_CUSTOMERS.slice();
  }

  /** 是否超过该等级配置的跟进间隔（待跟进） */
  function isDue(c, intervals) {
    const iv = intervals[c.grade];
    if (!iv || iv <= 0) return false;
    const last = new Date(c.lastFollowAt).getTime();
    if (Number.isNaN(last)) return false;
    return daysBetween(last, Date.now()) >= iv;
  }

  function listDueCustomers() {
    const intervals = loadIntervals();
    return getCustomers().filter((c) => isDue(c, intervals));
  }

  function workbenchHref(customerId) {
    const base = (window.__APP_BASE || "./").replace(/\\/g, "/");
    const rel = (base.endsWith("/") ? base : base + "/") + "pages/sales/workbench.html";
    const u = new URL(rel, window.location.href);
    if (customerId) u.searchParams.set("customerId", customerId);
    return u.href;
  }

  window.FollowReminderStore = {
    DEFAULT_INTERVALS,
    loadIntervals,
    saveIntervals,
    loadMeta,
    saveMeta,
    getCustomers,
    listDueCustomers,
    listMessages,
    isDue,
    gradeRank,
    formatDateTime,
    workbenchHref,
  };
})();
