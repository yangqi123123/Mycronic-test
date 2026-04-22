import React, { useState } from "react";

type CustomerStatus =
  | "待跟进"
  | "跟进中"
  | "商机"
  | "报价"
  | "合同"
  | "交付"
  | "放弃";

type Priority = "非常紧急" | "紧急" | "中";
type Grade = "A" | "B" | "C" | "D";

type Customer = {
  id: string;
  name: string;
  owner: string;
  grade: Grade;
  region: string;
  source: string;
  industry: string;
  status: CustomerStatus;
  priority: Priority;
  nextFollowAt: string;
};

const initialCustomers: Customer[] = [
  {
    id: "c1",
    name: "苏州XX半导体设备有限公司",
    owner: "李雷",
    grade: "A",
    region: "江苏省/苏州市/工业园区",
    source: "展会",
    industry: "半导体",
    status: "待跟进",
    priority: "非常紧急",
    nextFollowAt: "2026-04-15 09:00",
  },
  {
    id: "c2",
    name: "上海某某PCB有限公司",
    owner: "张敏",
    grade: "B",
    region: "上海市/上海市/浦东新区",
    source: "转介绍",
    industry: "电子制造",
    status: "跟进中",
    priority: "紧急",
    nextFollowAt: "2026-04-12 10:00",
  },
  {
    id: "c3",
    name: "北京某某研究院",
    owner: "王芳",
    grade: "C",
    region: "北京市/北京市/海淀区",
    source: "官网",
    industry: "科研",
    status: "商机",
    priority: "中",
    nextFollowAt: "2026-04-16 14:00",
  },
  {
    id: "c4",
    name: "杭州智能制造科技",
    owner: "李雷",
    grade: "A",
    region: "浙江省/杭州市/滨江区",
    source: "线索池",
    industry: "智能制造",
    status: "报价",
    priority: "紧急",
    nextFollowAt: "2026-04-10 11:30",
  },
  {
    id: "c5",
    name: "深圳电子元器件贸易",
    owner: "李雷",
    grade: "B",
    region: "广东省/深圳市/南山区",
    source: "电话营销",
    industry: "贸易",
    status: "合同",
    priority: "中",
    nextFollowAt: "2026-04-18 16:00",
  },
  {
    id: "c6",
    name: "成都自动化设备厂",
    owner: "张敏",
    grade: "C",
    region: "四川省/成都市/高新区",
    source: "展会",
    industry: "自动化",
    status: "交付",
    priority: "非常紧急",
    nextFollowAt: "2026-04-14 09:00",
  },
  {
    id: "c7",
    name: "武汉光电产业园",
    owner: "王芳",
    grade: "D",
    region: "湖北省/武汉市/东湖高新区",
    source: "合作伙伴",
    industry: "光电",
    status: "待跟进",
    priority: "中",
    nextFollowAt: "2026-04-13 08:00",
  },
  {
    id: "c8",
    name: "南京精密机械",
    owner: "李雷",
    grade: "B",
    region: "江苏省/南京市/江宁区",
    source: "线索池",
    industry: "机械制造",
    status: "跟进中",
    priority: "紧急",
    nextFollowAt: "2026-04-15 15:00",
  },
];

const btn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  marginRight: 4,
  marginBottom: 4,
};
const btnPrimary: React.CSSProperties = { ...btn, background: "#2563eb", color: "#fff", borderColor: "#2563eb" };
const btnDanger: React.CSSProperties = { ...btn, color: "#b91c1c", borderColor: "#fecaca", background: "#fef2f2" };

function parseDate(s: string): Date {
  return new Date(s.replace(" ", "T"));
}

function overdueInfo(nextFollowAt: string): { label: string; level: "none" | "overdue" | "severe" } {
  const now = new Date();
  const next = parseDate(nextFollowAt);
  if (now <= next) return { label: "", level: "none" };
  const diffDays = (now.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 2) return { label: "严重逾期", level: "severe" };
  return { label: "已逾期", level: "overdue" };
}

type ModalKind =
  | null
  | "follow"
  | "quote"
  | "contract"
  | "delivery"
  | "abandon"
  | "batchGrade"
  | "export";

export default function CustomerList() {
  const [rows, setRows] = useState<Customer[]>(initialCustomers);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [followWay, setFollowWay] = useState("");
  const [followContent, setFollowContent] = useState("");
  const [followFeedback, setFollowFeedback] = useState("");
  const [followNext, setFollowNext] = useState("");

  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDate, setQuoteDate] = useState("");

  const [contractAmount, setContractAmount] = useState("");
  const [contractDate, setContractDate] = useState("");

  const [deliveryContent, setDeliveryContent] = useState("");
  const [deliveryOwner, setDeliveryOwner] = useState("");

  const [abandonReason, setAbandonReason] = useState("");
  const [batchGrade, setBatchGrade] = useState<Grade>("A");

  const [fieldErr, setFieldErr] = useState<Record<string, boolean>>({});

  const allIds = rows.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const setStatus = (id: string, status: CustomerStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const openModal = (kind: ModalKind, id: string | null) => {
    setActiveId(id);
    setFieldErr({});
    setFollowWay("");
    setFollowContent("");
    setFollowFeedback("");
    setFollowNext("");
    setQuoteAmount("");
    setQuoteDate("");
    setContractAmount("");
    setContractDate("");
    setDeliveryContent("");
    setDeliveryOwner("");
    setAbandonReason("");
    setModal(kind);
  };

  const closeModal = () => {
    setModal(null);
    setActiveId(null);
  };

  const validate = (checks: Record<string, boolean>) => {
    setFieldErr(checks);
    return !Object.values(checks).some(Boolean);
  };

  const saveFollow = () => {
    const ok = validate({
      followWay: !followWay.trim(),
      followContent: !followContent.trim(),
      followFeedback: !followFeedback.trim(),
      followNext: !followNext.trim(),
    });
    if (!ok || !activeId) return;
    setRows((prev) =>
      prev.map((r) => (r.id === activeId ? { ...r, nextFollowAt: followNext.replace("T", " ") } : r)),
    );
    alert("跟进已保存（mock）");
    closeModal();
  };

  const saveQuote = () => {
    const ok = validate({ quoteAmount: !/^\d+(\.\d{1,2})?$/.test(quoteAmount.trim()) });
    if (!ok || !activeId) return;
    setStatus(activeId, "报价");
    alert("报价已保存，状态已更新为「报价」（mock）");
    closeModal();
  };

  const saveContract = () => {
    const ok = validate({ contractAmount: !/^\d+(\.\d{1,2})?$/.test(contractAmount.trim()) });
    if (!ok || !activeId) return;
    setStatus(activeId, "合同");
    alert("合同已保存，状态已更新为「合同」（mock）");
    closeModal();
  };

  const saveDelivery = () => {
    const ok = validate({
      deliveryContent: !deliveryContent.trim(),
      deliveryOwner: !deliveryOwner.trim(),
    });
    if (!ok || !activeId) return;
    setStatus(activeId, "交付");
    alert("交付已保存，状态已更新为「交付」（mock）");
    closeModal();
  };

  const saveAbandon = () => {
    const ok = validate({ abandonReason: !abandonReason.trim() });
    if (!ok || !activeId) return;
    setStatus(activeId, "放弃");
    closeModal();
  };

  const applyBatchGrade = () => {
    const ids = Array.from(selected);
    if (!ids.length) {
      alert("请先勾选客户");
      return;
    }
    setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, grade: batchGrade } : r)));
    alert(`已将 ${ids.length} 条客户等级修改为 ${batchGrade}`);
    closeModal();
  };

  const sendOutreach = () => {
    const ids = Array.from(selected);
    if (!ids.length) {
      alert("请先勾选客户");
      return;
    }
    alert(`发送触达（mock）：${ids.length} 条`);
  };

  const exportCsv = (subset: Customer[]) => {
    const header = ["客户名称", "负责人", "客户等级", "省市区", "客户来源", "行业类型", "状态"];
    const lines = [header.join(",")];
    subset.forEach((r) => {
      lines.push(
        [r.name, r.owner, r.grade, r.region, r.source, r.industry, r.status]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(","),
      );
    });
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "客户列表.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderRowActions = (row: Customer) => {
    const id = row.id;
    const common = (
      <>
        <button type="button" style={btn} onClick={() => alert(`360：${row.name}`)}>
          360档案
        </button>
        <button type="button" style={btn} onClick={() => openModal("follow", id)}>
          跟进
        </button>
      </>
    );
    switch (row.status) {
      case "待跟进":
        return (
          <>
            {common}
            <button type="button" style={btnPrimary} onClick={() => setStatus(id, "跟进中")}>
              立即跟进
            </button>
            <button type="button" style={btnDanger} onClick={() => openModal("abandon", id)}>
              放弃
            </button>
          </>
        );
      case "跟进中":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => setStatus(id, "商机")}>
              转商机
            </button>
            <button type="button" style={btn} onClick={() => openModal("quote", id)}>
              报价
            </button>
            <button type="button" style={btn} onClick={() => openModal("contract", id)}>
              合同
            </button>
            <button type="button" style={btnDanger} onClick={() => openModal("abandon", id)}>
              放弃
            </button>
          </>
        );
      case "商机":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => openModal("quote", id)}>
              报价
            </button>
            <button type="button" style={btn} onClick={() => openModal("contract", id)}>
              合同
            </button>
            <button type="button" style={btnDanger} onClick={() => openModal("abandon", id)}>
              放弃
            </button>
          </>
        );
      case "报价":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => openModal("contract", id)}>
              合同
            </button>
            <button type="button" style={btnDanger} onClick={() => openModal("abandon", id)}>
              放弃
            </button>
          </>
        );
      case "合同":
        return (
          <>
            {common}
            <button type="button" style={btnPrimary} onClick={() => openModal("delivery", id)}>
              推进交付
            </button>
            <button type="button" style={btnDanger} onClick={() => openModal("abandon", id)}>
              放弃
            </button>
          </>
        );
      case "交付":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => alert(`更新进度：${row.name}`)}>
              更新进度
            </button>
            <button type="button" style={btnPrimary} onClick={() => alert(`完成交付：${row.name}`)}>
              完成交付
            </button>
          </>
        );
      case "放弃":
        return <span style={{ color: "#9ca3af", fontSize: 12 }}>已放弃</span>;
      default:
        return common;
    }
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  };
  const dialog: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: 420,
    maxWidth: "90vw",
    boxShadow: "0 10px 40px rgba(0,0,0,.15)",
  };
  const inputErr = (key: string): React.CSSProperties => ({
    width: "100%",
    padding: 8,
    borderRadius: 8,
    border: fieldErr[key] ? "1px solid #dc2626" : "1px solid #d1d5db",
    boxSizing: "border-box",
  });

  return (
    <div style={{ padding: 20, background: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>客户列表</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <button type="button" style={btnPrimary} onClick={sendOutreach}>
          发送触达
        </button>
        <button type="button" style={btn} onClick={() => openModal("batchGrade", null)}>
          修改客户等级
        </button>
        <button
          type="button"
          style={btn}
          onClick={() => {
            const sel = rows.filter((r) => selected.has(r.id));
            if (!sel.length) {
              alert("请先勾选");
              return;
            }
            exportCsv(sel);
          }}
        >
          导出选中
        </button>
        <button type="button" style={btn} onClick={() => exportCsv(rows)}>
          导出全部
        </button>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
              <th style={{ padding: 10, width: 40 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th style={{ padding: 10 }}>客户名称</th>
              <th style={{ padding: 10 }}>负责人</th>
              <th style={{ padding: 10 }}>客户等级</th>
              <th style={{ padding: 10 }}>省市区</th>
              <th style={{ padding: 10 }}>客户来源</th>
              <th style={{ padding: 10 }}>行业类型</th>
              <th style={{ padding: 10 }}>状态</th>
              <th style={{ padding: 10, minWidth: 280 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const od = overdueInfo(row.nextFollowAt);
              const bg = od.level === "severe" ? "#fef2f2" : od.level === "overdue" ? "#fff7ed" : "#fff";
              return (
                <tr key={row.id} style={{ background: bg }}>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleOne(row.id)} />
                  </td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>
                    {row.name}
                    {od.level !== "none" && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          padding: "2px 6px",
                          borderRadius: 4,
                          color: "#fff",
                          background: od.level === "severe" ? "#b91c1c" : "#ea580c",
                        }}
                      >
                        {od.label}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>{row.owner}</td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>{row.grade}</td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>{row.region}</td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>{row.source}</td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>{row.industry}</td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6" }}>{row.status}</td>
                  <td style={{ padding: 10, borderTop: "1px solid #f3f4f6", verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>{renderRowActions(row)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal === "follow" && (
        <div style={overlay} onMouseDown={closeModal}>
          <div style={dialog} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>跟进</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>跟进方式（必填）</div>
              <select value={followWay} onChange={(e) => setFollowWay(e.target.value)} style={inputErr("followWay")}>
                <option value="">请选择</option>
                <option value="电话">电话</option>
                <option value="拜访">拜访</option>
                <option value="线上会议">线上会议</option>
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>跟进内容（必填）</div>
              <textarea value={followContent} onChange={(e) => setFollowContent(e.target.value)} rows={3} style={inputErr("followContent")} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>客户反馈（必填）</div>
              <textarea value={followFeedback} onChange={(e) => setFollowFeedback(e.target.value)} rows={2} style={inputErr("followFeedback")} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>下次跟进时间（必填）</div>
              <input type="datetime-local" value={followNext} onChange={(e) => setFollowNext(e.target.value)} style={inputErr("followNext")} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" style={btn} onClick={closeModal}>
                取消
              </button>
              <button type="button" style={btnPrimary} onClick={saveFollow}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "quote" && (
        <div style={overlay} onMouseDown={closeModal}>
          <div style={dialog} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>报价</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>报价金额（必填）</div>
              <input value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="如 120000.00" style={inputErr("quoteAmount")} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>报价日期</div>
              <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} style={inputErr("quoteDate")} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" style={btn} onClick={closeModal}>
                取消
              </button>
              <button type="button" style={btnPrimary} onClick={saveQuote}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "contract" && (
        <div style={overlay} onMouseDown={closeModal}>
          <div style={dialog} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>合同</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>合同金额（必填）</div>
              <input
                value={contractAmount}
                onChange={(e) => setContractAmount(e.target.value)}
                placeholder="如 120000.00"
                style={inputErr("contractAmount")}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>签约日期</div>
              <input type="date" value={contractDate} onChange={(e) => setContractDate(e.target.value)} style={inputErr("contractDate")} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" style={btn} onClick={closeModal}>
                取消
              </button>
              <button type="button" style={btnPrimary} onClick={saveContract}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delivery" && (
        <div style={overlay} onMouseDown={closeModal}>
          <div style={dialog} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>交付</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>交付内容（必填）</div>
              <textarea value={deliveryContent} onChange={(e) => setDeliveryContent(e.target.value)} rows={3} style={inputErr("deliveryContent")} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>负责人（必填）</div>
              <input value={deliveryOwner} onChange={(e) => setDeliveryOwner(e.target.value)} style={inputErr("deliveryOwner")} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" style={btn} onClick={closeModal}>
                取消
              </button>
              <button type="button" style={btnPrimary} onClick={saveDelivery}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "abandon" && (
        <div style={overlay} onMouseDown={closeModal}>
          <div style={dialog} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>放弃</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>放弃原因（必填）</div>
              <textarea value={abandonReason} onChange={(e) => setAbandonReason(e.target.value)} rows={3} style={inputErr("abandonReason")} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" style={btn} onClick={closeModal}>
                取消
              </button>
              <button type="button" style={btnPrimary} onClick={saveAbandon}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "batchGrade" && (
        <div style={overlay} onMouseDown={closeModal}>
          <div style={dialog} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>批量修改客户等级</div>
            <select value={batchGrade} onChange={(e) => setBatchGrade(e.target.value as Grade)} style={{ ...inputErr("batchGrade"), marginBottom: 16 }}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" style={btn} onClick={closeModal}>
                取消
              </button>
              <button type="button" style={btnPrimary} onClick={applyBatchGrade}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
