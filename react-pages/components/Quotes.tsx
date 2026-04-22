import React from "react";
import type { Quote } from "../types/customer360";
import { Table } from "./ui/Table";

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

function download(name: string, url: string) {
  if (!name || !url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function Quotes({ rows }: { rows: Quote[] }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="text-[16px] font-semibold text-[#1D2129]">报价</div>
      <div className="mt-3">
        <Table<Quote>
          rows={rows}
          emptyText="暂无报价"
          columns={[
            { key: "oppNo", title: "商机编号", render: (r) => <span className="font-semibold">{r.oppNo}</span> },
            { key: "amount", title: "报价金额", render: (r) => <span className="font-semibold">{formatMoney(r.amount)}</span> },
            {
              key: "file",
              title: "报价附件（下载）",
              render: (r) =>
                r.attachmentName ? (
                  <button type="button" className="text-[#4080FF] font-semibold" onClick={() => download(r.attachmentName, r.attachmentUrl)}>
                    {r.attachmentName}
                  </button>
                ) : (
                  <span className="text-[#86909C]">暂无附件</span>
                ),
            },
            { key: "createdBy", title: "创建人", render: (r) => r.createdBy },
            { key: "createdAt", title: "创建时间", render: (r) => r.createdAt },
          ]}
        />
      </div>
    </div>
  );
}

