/** 客户信息表单：客户来源 / 行业类型 / 省市区级联（线索池补全 & 360 客户信息共用） */
(function () {
  const CUSTOMER_SOURCES = [
    "公开工商数据",
    "行业名录",
    "政府科研数据",
    "招标采购",
    "垂直平台数据",
    "企业自媒体数据",
    "展会活动",
  ];

  const INDUSTRY_TYPES = ["半导体", "SMT/电子制造", "PCB", "科研院所"];

  /** @type {{name:string,cities:{name:string,districts:string[]}[]}[]} */
  const REGION_TREE = [
    {
      name: "上海市",
      cities: [{ name: "上海市", districts: ["黄浦区", "浦东新区"] }],
    },
    {
      name: "江苏省",
      cities: [
        { name: "苏州市", districts: ["吴中区", "工业园区", "虎丘区"] },
        { name: "南京市", districts: ["鼓楼区", "秦淮区"] },
      ],
    },
    {
      name: "北京市",
      cities: [{ name: "北京市", districts: ["海淀区", "朝阳区"] }],
    },
    {
      name: "河南省",
      cities: [{ name: "郑州市", districts: ["金水区", "中原区", "二七区"] }],
    },
    {
      name: "安徽省",
      cities: [{ name: "合肥市", districts: ["蜀山区", "包河区"] }],
    },
  ];

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function buildSelectOptions(items, selected, placeholder) {
    const ph = placeholder ? `<option value="">${esc(placeholder)}</option>` : "";
    const sel = String(selected || "").trim();
    let opts = items
      .map((x) => `<option value="${esc(x)}"${sel === x ? " selected" : ""}>${esc(x)}</option>`)
      .join("");
    if (sel && !items.includes(sel)) {
      opts += `<option value="${esc(sel)}" selected>${esc(sel)}</option>`;
    }
    return ph + opts;
  }

  function findProv(name) {
    return REGION_TREE.find((p) => p.name === name) || null;
  }

  function findCity(prov, cityName) {
    const p = findProv(prov);
    if (!p) return null;
    return p.cities.find((c) => c.name === cityName) || null;
  }

  function fillSelect(el, items, selected, placeholder) {
    if (!el) return;
    el.innerHTML = buildSelectOptions(items, selected, placeholder);
  }

  /**
   * @param {HTMLSelectElement|null} provEl
   * @param {HTMLSelectElement|null} cityEl
   * @param {HTMLSelectElement|null} distEl
   * @param {{prov?:string,city?:string,dist?:string}} values
   */
  function initRegionCascade(provEl, cityEl, distEl, values) {
    if (!provEl || !cityEl || !distEl) return;
    const v = values || {};
    const provNames = REGION_TREE.map((p) => p.name);

    fillSelect(provEl, provNames, v.prov, "请选择省");
    const syncCity = () => {
      const p = findProv(provEl.value);
      const cities = p ? p.cities.map((c) => c.name) : [];
      fillSelect(cityEl, cities, v.city, "请选择市");
      v.city = "";
      syncDist();
    };
    const syncDist = () => {
      const c = findCity(provEl.value, cityEl.value);
      const dists = c ? c.districts : [];
      fillSelect(distEl, dists, v.dist, "请选择区");
      v.dist = "";
    };

    provEl.onchange = () => {
      v.city = "";
      v.dist = "";
      syncCity();
    };
    cityEl.onchange = () => {
      v.dist = "";
      syncDist();
    };

    if (v.prov) {
      provEl.value = v.prov;
      if (!provEl.value && v.prov) {
        const o = document.createElement("option");
        o.value = v.prov;
        o.textContent = v.prov;
        o.selected = true;
        provEl.appendChild(o);
      }
    }
    const p = findProv(provEl.value);
    const cities = p ? p.cities.map((c) => c.name) : v.city ? [v.city] : [];
    fillSelect(cityEl, cities, v.city, "请选择市");
    if (v.city && !cityEl.value) {
      const o = document.createElement("option");
      o.value = v.city;
      o.textContent = v.city;
      o.selected = true;
      cityEl.appendChild(o);
    }
    const c = findCity(provEl.value, cityEl.value);
    const dists = c ? c.districts : v.dist ? [v.dist] : [];
    fillSelect(distEl, dists, v.dist, "请选择区");
    if (v.dist && !distEl.value) {
      const o = document.createElement("option");
      o.value = v.dist;
      o.textContent = v.dist;
      o.selected = true;
      distEl.appendChild(o);
    }
  }

  window.CustomerFormFields = {
    CUSTOMER_SOURCES,
    INDUSTRY_TYPES,
    REGION_TREE,
    buildSelectOptions,
    initRegionCascade,
  };
})();
