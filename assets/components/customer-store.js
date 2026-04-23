/**
 * CustomerStore (Prototype)
 * - Single source of truth for customers + employees
 * - localStorage persistence + lightweight pub/sub + storage sync
 */
(function () {
  const K = "ai_customer_store_v1";

  /** @typedef {{id:string,name:string,phone:string,avatar:string,role:string,region:string,hasSalesWorkbench:boolean,managerName?:string}} Employee */
  /** @typedef {{id:string,name:string,grade:"A"|"B"|"C"|"D",priority:"非常紧急"|"紧急"|"中",statusFlow:"待跟进"|"跟进中"|"商机"|"报价"|"合同"|"交付"|"放弃",nextFollowAt:string,prov:string,city:string,dist:string,source:string,industry:string,createdAt:string,regionOwner:string,finalOwnerId:string|null,contactName?:string,contactPhone?:string,uscc?:string,tags?:string[],legalRep?:string,establishedAt?:string,regCapital?:string,paidCapital?:string,regNo?:string,orgCode?:string,taxId?:string,bizTerm?:string,regAuthority?:string,insuredCount?:number,formerName?:string,approveAt?:string,regAddr?:string,bizScope?:string,needSummary?:string}} Customer */

  const listeners = new Set();
  function emit() {
    try {
      listeners.forEach((fn) => fn());
    } catch (_) {}
  }

  function nowIsoDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function seed() {
    /** @type {Employee[]} */
    const employees = [
      {
        id: "E-001",
        name: "李雷",
        phone: "13800002222",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=72&h=72&q=80",
        role: "区域负责人",
        region: "华东/江苏/苏州",
        hasSalesWorkbench: true,
      },
      {
        id: "E-002",
        name: "张敏",
        phone: "13800001111",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=72&h=72&q=80",
        role: "销售",
        region: "华东/上海/浦东",
        hasSalesWorkbench: true,
        managerName: "李雷",
      },
      {
        id: "E-003",
        name: "王芳",
        phone: "13800003333",
        avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=72&h=72&q=80",
        role: "销售",
        region: "华北/北京/海淀",
        hasSalesWorkbench: false,
        managerName: "李雷",
      },
      {
        id: "E-004",
        name: "赵强",
        phone: "13800004444",
        avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=72&h=72&q=80",
        role: "销售",
        region: "华东/江苏/南京",
        hasSalesWorkbench: true,
        managerName: "李雷",
      },
    ];

    const today = nowIsoDate();

    /** @type {Customer[]} */
    const customers = [
      {
        id: "C-0001",
        name: "苏州XX半导体设备有限公司",
        grade: "A",
        priority: "非常紧急",
        statusFlow: "待跟进",
        nextFollowAt: "2026-04-15 09:00",
        prov: "江苏",
        city: "苏州",
        dist: "吴中",
        source: "招标采购",
        industry: "半导体",
        createdAt: "2026-04-10",
        regionOwner: "李雷",
        finalOwnerId: "E-001",
        contactName: "周伟",
        contactPhone: "13800002222",
        uscc: "91320506MA1XXXXXXX",
        tags: ["重点跟进", "招投标"],
      },
      {
        id: "C-0002",
        name: "上海某某PCB有限公司",
        grade: "B",
        priority: "紧急",
        statusFlow: "跟进中",
        nextFollowAt: "2026-04-15 14:00",
        prov: "上海",
        city: "上海",
        dist: "浦东",
        source: "线索池入库",
        industry: "PCB",
        createdAt: "2026-04-12",
        regionOwner: "李雷",
        finalOwnerId: "E-002",
        contactName: "刘敏",
        contactPhone: "13800001111",
        uscc: "91310115MA2XXXXXXX",
        tags: ["展会线索"],
      },
      {
        id: "C-0003",
        name: "北京某某研究院",
        grade: "C",
        priority: "中",
        statusFlow: "商机",
        nextFollowAt: "2026-04-15 18:00",
        prov: "北京",
        city: "北京",
        dist: "海淀",
        source: "展会活动",
        industry: "科研院所",
        createdAt: "2026-04-13",
        regionOwner: "李雷",
        finalOwnerId: "E-003",
        contactName: "王强",
        contactPhone: "13800003333",
        uscc: "91110108MA3XXXXXXX",
        tags: [],
      },
      {
        id: "C-0004",
        name: "杭州智能制造科技",
        grade: "A",
        priority: "紧急",
        statusFlow: "报价",
        nextFollowAt: "2026-04-14 10:00",
        prov: "浙江",
        city: "杭州",
        dist: "余杭",
        source: "行业名录",
        industry: "SMT/电子制造",
        createdAt: "2026-04-09",
        regionOwner: "李雷",
        finalOwnerId: "E-001",
        contactName: "赵磊",
        contactPhone: "13700008888",
        uscc: "91330110MA4XXXXXXX",
      },
      {
        id: "C-0005",
        name: "深圳电子元器件贸易",
        grade: "B",
        priority: "中",
        statusFlow: "合同",
        nextFollowAt: "2026-04-13 16:00",
        prov: "广东",
        city: "深圳",
        dist: "南山",
        source: "招标采购",
        industry: "SMT/电子制造",
        createdAt: "2026-04-11",
        regionOwner: "李雷",
        finalOwnerId: "E-001",
        contactName: "陈晨",
        contactPhone: "13600006666",
        uscc: "91440300MA5XXXXXXX",
      },
      {
        id: "C-0006",
        name: "成都自动化设备厂",
        grade: "C",
        priority: "非常紧急",
        statusFlow: "交付",
        nextFollowAt: "2026-04-15 11:00",
        prov: "四川",
        city: "成都",
        dist: "高新",
        source: "手工新增",
        industry: "半导体",
        createdAt: "2026-04-08",
        regionOwner: "李雷",
        finalOwnerId: "E-002",
        contactName: "孙浩",
        contactPhone: "13500005555",
        uscc: "91510100MA6XXXXXXX",
      },
      // 待我分配：区域负责人=李雷，finalOwnerId 为空
      {
        id: "C-0007",
        name: "武汉光电产业园",
        grade: "D",
        priority: "中",
        statusFlow: "待跟进",
        nextFollowAt: `${today} 10:00`,
        prov: "湖北",
        city: "武汉",
        dist: "东湖",
        source: "线索池入库",
        industry: "半导体",
        createdAt: today,
        regionOwner: "李雷",
        finalOwnerId: null,
        contactPhone: "",
        uscc: "",
      },
      {
        id: "C-0008",
        name: "合肥先进封装材料有限公司",
        grade: "C",
        priority: "紧急",
        statusFlow: "待跟进",
        nextFollowAt: `${today} 11:30`,
        prov: "安徽",
        city: "合肥",
        dist: "蜀山",
        source: "公开工商数据",
        industry: "半导体",
        createdAt: today,
        regionOwner: "李雷",
        finalOwnerId: null,
        contactPhone: "13900001234",
        uscc: "91340104MA9XXXXXXX",
      },
      {
        id: "C-0009",
        name: "宁波智能装备产业基地",
        grade: "D",
        priority: "中",
        statusFlow: "待跟进",
        nextFollowAt: `${today} 14:20`,
        prov: "浙江",
        city: "宁波",
        dist: "鄞州",
        source: "行业名录",
        industry: "SMT/电子制造",
        createdAt: today,
        regionOwner: "李雷",
        finalOwnerId: null,
        contactPhone: "",
        uscc: "",
      },
      {
        id: "C-0010",
        name: "天津XX电子制造有限公司",
        grade: "B",
        priority: "非常紧急",
        statusFlow: "待跟进",
        nextFollowAt: `${today} 15:10`,
        prov: "天津",
        city: "天津",
        dist: "滨海新区",
        source: "招标采购",
        industry: "SMT/电子制造",
        createdAt: today,
        regionOwner: "李雷",
        finalOwnerId: null,
        contactPhone: "13700009999",
        uscc: "91120116MA8XXXXXXX",
      },
      {
        id: "C-0011",
        name: "西安某某科研中心",
        grade: "C",
        priority: "中",
        statusFlow: "待跟进",
        nextFollowAt: `${today} 16:40`,
        prov: "陕西",
        city: "西安",
        dist: "雁塔",
        source: "政府科研数据",
        industry: "科研院所",
        createdAt: today,
        regionOwner: "李雷",
        finalOwnerId: null,
        contactPhone: "",
        uscc: "",
      },
      {
        id: "C-0012",
        name: "长沙XX自动化设备有限公司",
        grade: "B",
        priority: "紧急",
        statusFlow: "待跟进",
        nextFollowAt: `${today} 18:10`,
        prov: "湖南",
        city: "长沙",
        dist: "岳麓",
        source: "线索池入库",
        industry: "半导体",
        createdAt: today,
        regionOwner: "李雷",
        finalOwnerId: null,
        contactPhone: "13600001212",
        uscc: "91430104MA7XXXXXXX",
      },
    ];

    return { employees, customers };
  }

  function load() {
    try {
      const raw = localStorage.getItem(K);
      if (!raw) throw new Error("empty");
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.customers) || !Array.isArray(data.employees)) throw new Error("bad");
      return data;
    } catch (_) {
      const s = seed();
      try {
        localStorage.setItem(K, JSON.stringify(s));
      } catch (_) {}
      return s;
    }
  }

  // 若历史版本存量数据不符合当前原型（例如客户数量不一致），自动重建种子，保证页面固定展示
  function ensureSeedConsistency() {
    try {
      const raw = localStorage.getItem(K);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.customers) || !Array.isArray(data.employees)) return;
      // 避免因业务操作（如删除/新增）导致数据被强制重置为 seed
      // 仅在数据明显异常（空/结构损坏）时重建
      if (!data.employees.length || !data.customers.length) {
        localStorage.setItem(K, JSON.stringify(seed()));
        emit();
        return;
      }

      // 兼容旧版本：将「待分配」mock 数据补齐到 6 条，避免用户手动清理缓存
      // 仅针对早期默认 7 条客户的存量数据做补齐，不影响后续手工新增/删除后的自定义数据规模
      const pending = data.customers.filter((c) => c && !c.finalOwnerId);
      if (data.customers.length <= 7 && pending.length < 6) {
        const seedData = seed();
        const seedPending = seedData.customers.filter((c) => c && !c.finalOwnerId);
        const exists = new Set(data.customers.map((c) => c && c.id).filter(Boolean));
        for (const c of seedPending) {
          if (pending.length >= 6) break;
          if (exists.has(c.id)) continue;
          data.customers.push(c);
          pending.push(c);
          exists.add(c.id);
        }
        localStorage.setItem(K, JSON.stringify(data));
        emit();
      }
    } catch (_) {}
  }

  function save(data) {
    try {
      localStorage.setItem(K, JSON.stringify(data));
    } catch (_) {}
    emit();
  }

  function getEmployeeById(id) {
    const { employees } = load();
    return employees.find((e) => e.id === id) || null;
  }

  function getEmployeeName(id) {
    const e = getEmployeeById(id);
    return e ? e.name : "";
  }

  function listEmployees() {
    return load().employees.slice();
  }

  function listCustomers() {
    return load().customers.slice();
  }

  function updateCustomer(id, patch) {
    const data = load();
    const idx = data.customers.findIndex((c) => c.id === id);
    if (idx < 0) return false;
    data.customers[idx] = { ...data.customers[idx], ...patch };
    save(data);
    return true;
  }

  function addCustomer(cust) {
    const data = load();
    data.customers.unshift(cust);
    save(data);
    return true;
  }

  function removeCustomer(id) {
    const data = load();
    const before = data.customers.length;
    data.customers = data.customers.filter((c) => c && c.id !== id);
    const changed = data.customers.length !== before;
    if (changed) save(data);
    return changed;
  }

  function removeCustomers(ids) {
    const data = load();
    const set = new Set(ids || []);
    const before = data.customers.length;
    data.customers = data.customers.filter((c) => c && !set.has(c.id));
    const changed = data.customers.length !== before;
    if (changed) save(data);
    return changed;
  }

  function updateCustomers(ids, patch) {
    const data = load();
    const set = new Set(ids || []);
    let changed = false;
    data.customers = data.customers.map((c) => {
      if (!set.has(c.id)) return c;
      changed = true;
      return { ...c, ...patch };
    });
    if (changed) save(data);
    return changed;
  }

  function assignFinalOwner(customerId, employeeId) {
    const emp = getEmployeeById(employeeId);
    if (!emp) return { ok: false, code: "no_emp", message: "未选择员工" };
    if (!emp.hasSalesWorkbench) return { ok: false, code: "no_perm", message: "该员工无销售工作台权限，无法分配" };
    const ok = updateCustomer(customerId, { finalOwnerId: emp.id });
    if (!ok) return { ok: false, code: "no_cust", message: "客户不存在" };
    return { ok: true };
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  window.addEventListener("storage", (e) => {
    if (!e || e.key !== K) return;
    emit();
  });

  window.CustomerStore = {
    KEY: K,
    load,
    listEmployees,
    listCustomers,
    getEmployeeById,
    getEmployeeName,
    updateCustomer,
    updateCustomers,
    addCustomer,
    removeCustomer,
    removeCustomers,
    assignFinalOwner,
    onChange,
  };

  ensureSeedConsistency();
  try {
    window.dispatchEvent(new CustomEvent("customer-store:ready"));
  } catch (_) {}
})();

