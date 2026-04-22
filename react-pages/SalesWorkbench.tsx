import React, { useMemo, useState } from "react";

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

type TodoRow = {
  id: string;
  customerName: string;
  owner: string;
  grade: Grade;
  priority: Priority;
  status: CustomerStatus;
  nextFollowAt: string;
};

const initialTodos: TodoRow[] = [
  {
    id: "1",
    customerName: "苏州XX半导体设备有限公司",
    owner: "李雷",
    grade: "A",
    priority: "非常紧急",
    status: "待跟进",
    nextFollowAt: "2026-04-15 09:00",
  },
  {
    id: "2",
    customerName: "上海某某PCB有限公司",
    owner: "张敏",
    grade: "B",
    priority: "紧急",
    status: "跟进中",
    nextFollowAt: "2026-04-12 10:00",
  },
  {
    id: "3",
    customerName: "北京某某研究院",
    owner: "王芳",
    grade: "C",
    priority: "中",
    status: "商机",
    nextFollowAt: "2026-04-16 14:00",
  },
  {
    id: "4",
    customerName: "杭州智能制造科技",
    owner: "李雷",
    grade: "A",
    priority: "紧急",
    status: "报价",
    nextFollowAt: "2026-04-10 11:30",
  },
  {
    id: "5",
    customerName: "深圳电子元器件贸易",
    owner: "李雷",
    grade: "B",
    priority: "中",
    status: "合同",
    nextFollowAt: "2026-04-18 16:00",
  },
  {
    id: "6",
    customerName: "成都自动化设备厂",
    owner: "张敏",
    grade: "C",
    priority: "非常紧急",
    status: "交付",
    nextFollowAt: "2026-04-14 09:00",
  },
  {
    id: "7",
    customerName: "武汉光电产业园",
    owner: "王芳",
    grade: "D",
    priority: "中",
    status: "待跟进",
    nextFollowAt: "2026-04-13 08:00",
  },
  {
    id: "8",
    customerName: "南京精密机械",
    owner: "李雷",
    grade: "B",
    priority: "紧急",
    status: "跟进中",
    nextFollowAt: "2026-04-15 15:00",
  },
  {
    id: "9",
    customerName: "广州新材料实验室",
    owner: "张敏",
    grade: "A",
    priority: "中",
    status: "商机",
    nextFollowAt: "2026-04-20 10:00",
  },
  {
    id: "10",
    customerName: "天津港务设备",
    owner: "王芳",
    grade: "C",
    priority: "非常紧急",
    status: "报价",
    nextFollowAt: "2026-04-11 12:00",
  },
  {
    id: "11",
    customerName: "西安航天配套",
    owner: "李雷",
    grade: "A",
    priority: "紧急",
    status: "合同",
    nextFollowAt: "2026-04-19 09:30",
  },
  {
    id: "12",
    customerName: "青岛海洋工程",
    owner: "张敏",
    grade: "B",
    priority: "中",
    status: "交付",
    nextFollowAt: "2026-04-15 17:00",
  },
];

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,.06)",
};
const sectionStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  background: "#fff",
};
const btn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
  marginRight: 6,
  marginBottom: 6,
};
const btnPrimary: React.CSSProperties = { ...btn, background: "#2563eb", color: "#fff", borderColor: "#2563eb" };
const btnDanger: React.CSSProperties = { ...btn, borderColor: "#fecaca", color: "#b91c1c", background: "#fef2f2" };

function parseDate(s: string): Date {
  return new Date(s.replace(" ", "T"));
}

function overdueInfo(nextFollowAt: string): { label: string; level: "none" | "overdue" | "severe" } {
  const now = new Date();
  const next = parseDate(nextFollowAt);
  if (now <= next) return { label: "未逾期", level: "none" };
  const diffMs = now.getTime() - next.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 2) return { label: "严重逾期", level: "severe" };
  return { label: "已逾期", level: "overdue" };
}

export default function SalesWorkbench() {
  const [todos, setTodos] = useState<TodoRow[]>(initialTodos);
  const [qName, setQName] = useState("");
  const [qOwner, setQOwner] = useState("");
  const [qGrade, setQGrade] = useState<"" | Grade>("");
  const [qStatus, setQStatus] = useState<"" | CustomerStatus>("");
  const [qPriority, setQPriority] = useState<"" | Priority>("");
  const [qStart, setQStart] = useState("");
  const [qEnd, setQEnd] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const stats = useMemo(() => {
    const gradeA = todos.filter((t) => t.grade === "A").length;
    const gradeB = todos.filter((t) => t.grade === "B").length;
    const gradeC = todos.filter((t) => t.grade === "C").length;
    const p1 = todos.filter((t) => t.priority === "非常紧急").length;
    const p2 = todos.filter((t) => t.priority === "紧急").length;
    const p3 = todos.filter((t) => t.priority === "中").length;
    const overdueCount = todos.filter((t) => overdueInfo(t.nextFollowAt).level !== "none").length;
    const avgDeals = 41;
    return { gradeA, gradeB, gradeC, p1, p2, p3, overdueCount, avgDeals };
  }, [todos]);

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      if (qName && !t.customerName.includes(qName)) return false;
      if (qOwner && !t.owner.includes(qOwner)) return false;
      if (qGrade && t.grade !== qGrade) return false;
      if (qStatus && t.status !== qStatus) return false;
      if (qPriority && t.priority !== qPriority) return false;
      if (qStart) {
        const d = parseDate(t.nextFollowAt);
        if (d < new Date(qStart + "T00:00:00")) return false;
      }
      if (qEnd) {
        const d = parseDate(t.nextFollowAt);
        if (d > new Date(qEnd + "T23:59:59")) return false;
      }
      return true;
    });
  }, [todos, qName, qOwner, qGrade, qStatus, qPriority, qStart, qEnd]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  const setStatus = (id: string, status: CustomerStatus) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const open360 = (name: string) => alert(`打开 360 档案：${name}`);
  const openFollow = (name: string) => alert(`打开跟进：${name}`);

  const renderActions = (row: TodoRow) => {
    const { level } = overdueInfo(row.nextFollowAt);
    const common = (
      <>
        <button type="button" style={btn} onClick={() => open360(row.customerName)}>
          360档案
        </button>
        <button type="button" style={btn} onClick={() => openFollow(row.customerName)}>
          跟进
        </button>
      </>
    );

    switch (row.status) {
      case "待跟进":
        return (
          <>
            {common}
            <button type="button" style={btnPrimary} onClick={() => setStatus(row.id, "跟进中")}>
              立即跟进
            </button>
            <button type="button" style={btnDanger} onClick={() => setStatus(row.id, "放弃")}>
              放弃
            </button>
          </>
        );
      case "跟进中":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => setStatus(row.id, "商机")}>
              转商机
            </button>
            <button type="button" style={btn} onClick={() => setStatus(row.id, "报价")}>
              报价
            </button>
            <button type="button" style={btn} onClick={() => setStatus(row.id, "合同")}>
              合同
            </button>
            <button type="button" style={btnDanger} onClick={() => setStatus(row.id, "放弃")}>
              放弃
            </button>
          </>
        );
      case "商机":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => setStatus(row.id, "报价")}>
              报价
            </button>
            <button type="button" style={btn} onClick={() => setStatus(row.id, "合同")}>
              合同
            </button>
            <button type="button" style={btnDanger} onClick={() => setStatus(row.id, "放弃")}>
              放弃
            </button>
          </>
        );
      case "报价":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => setStatus(row.id, "合同")}>
              合同
            </button>
            <button type="button" style={btnDanger} onClick={() => setStatus(row.id, "放弃")}>
              放弃
            </button>
          </>
        );
      case "合同":
        return (
          <>
            {common}
            <button type="button" style={btnPrimary} onClick={() => setStatus(row.id, "交付")}>
              推进交付
            </button>
            <button type="button" style={btnDanger} onClick={() => setStatus(row.id, "放弃")}>
              放弃
            </button>
          </>
        );
      case "交付":
        return (
          <>
            {common}
            <button type="button" style={btn} onClick={() => alert(`更新进度：${row.customerName}`)}>
              更新进度
            </button>
            <button type="button" style={btnPrimary} onClick={() => alert(`完成交付：${row.customerName}`)}>
              完成交付
            </button>
          </>
        );
      case "放弃":
        return <span style={{ color: "#6b7280", fontSize: 13 }}>已放弃</span>;
      default:
        return common;
    }
  };

  const resetSearch = () => {
    setQName("");
    setQOwner("");
    setQGrade("");
    setQStatus("");
    setQPriority("");
    setQStart("");
    setQEnd("");
    setPage(1);
  };

  return (
    <div style={{ padding: 20, background: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>销售工作台</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>客户等级统计</div>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
            <div>A级客户数量：{stats.gradeA}</div>
            <div>B级客户数量：{stats.gradeB}</div>
            <div>C级客户数量：{stats.gradeC}</div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>优先级统计</div>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
            <div>非常紧急：{stats.p1}</div>
            <div>紧急：{stats.p2}</div>
            <div>中：{stats.p3}</div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>逾期未跟进</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#b91c1c" }}>{stats.overdueCount}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>每12小时提醒，逾期2天升级</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>成单量（均值）</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>{stats.avgDeals}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>线索 → 合同</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>搜索筛选</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>客户名称</div>
            <input value={qName} onChange={(e) => setQName(e.target.value)} style={{ padding: 8, width: 160, borderRadius: 8, border: "1px solid #d1d5db" }} />
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>负责人</div>
            <input value={qOwner} onChange={(e) => setQOwner(e.target.value)} style={{ padding: 8, width: 120, borderRadius: 8, border: "1px solid #d1d5db" }} />
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>客户等级</div>
            <select value={qGrade} onChange={(e) => setQGrade(e.target.value as "" | Grade)} style={{ padding: 8, width: 100, borderRadius: 8, border: "1px solid #d1d5db" }}>
              <option value="">全部</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>状态</div>
            <select value={qStatus} onChange={(e) => setQStatus(e.target.value as "" | CustomerStatus)} style={{ padding: 8, width: 120, borderRadius: 8, border: "1px solid #d1d5db" }}>
              <option value="">全部</option>
              {(["待跟进", "跟进中", "商机", "报价", "合同", "交付", "放弃"] as const).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>优先级</div>
            <select value={qPriority} onChange={(e) => setQPriority(e.target.value as "" | Priority)} style={{ padding: 8, width: 120, borderRadius: 8, border: "1px solid #d1d5db" }}>
              <option value="">全部</option>
              <option value="非常紧急">非常紧急</option>
              <option value="紧急">紧急</option>
              <option value="中">中</option>
            </select>
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>日期范围（起）</div>
            <input type="date" value={qStart} onChange={(e) => setQStart(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }} />
          </label>
          <label>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>日期范围（止）</div>
            <input type="date" value={qEnd} onChange={(e) => setQEnd(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }} />
          </label>
          <button type="button" style={btnPrimary} onClick={() => setPage(1)}>
            查询
          </button>
          <button type="button" style={btn} onClick={resetSearch}>
            重置
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>今日待办</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>客户名称</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>负责人</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>客户等级</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>优先级</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>当前状态</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>下次跟进时间</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}>是否逾期</th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", minWidth: 320 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((row) => {
                const od = overdueInfo(row.nextFollowAt);
                const rowBg =
                  od.level === "severe"
                    ? "#fef2f2"
                    : od.level === "overdue"
                      ? "#fff7ed"
                      : "#fff";
                return (
                  <tr key={row.id} style={{ background: rowBg }}>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{row.customerName}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{row.owner}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{row.grade}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{row.priority}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{row.status}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>{row.nextFollowAt}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                      {od.level === "none" ? (
                        <span style={{ color: "#6b7280" }}>—</span>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#fff",
                            background: od.level === "severe" ? "#b91c1c" : "#ea580c",
                          }}
                        >
                          {od.label}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", verticalAlign: "top" }}>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>{renderActions(row)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            共 {filtered.length} 条，每页 {pageSize} 条
          </span>
          <div>
            <button type="button" style={btn} disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                style={p === pageSafe ? { ...btnPrimary, minWidth: 36 } : { ...btn, minWidth: 36 }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button type="button" style={btn} disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
