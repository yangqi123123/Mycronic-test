import React from "react";
import type { Delivery } from "../types/customer360";
import { Table } from "./ui/Table";
import { StatusTag } from "./ui/Tag";

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

export function Deliveries({ rows }: { rows: Delivery[] }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="text-[16px] font-semibold text-[#1D2129]">交付</div>
      <div className="mt-3">
        <Table<Delivery>
          rows={rows}
          emptyText="暂无交付"
          columns={[
            { key: "contractNo", title: "合同编号", render: (r) => <span className="text-[#4E5969]">{r.contractNo}</span> },
            { key: "contractName", title: "合同名称", render: (r) => r.contractName || "—" },
            { key: "deliveredAt", title: "交付时间", render: (r) => r.deliveredAt },
            { key: "dealAmount", title: "成交金额", render: (r) => <span className="font-semibold">{formatMoney(r.dealAmount)}</span> },
            { key: "status", title: "交付状态", render: (r) => <StatusTag status={r.status} /> },
            {
              key: "file",
              title: "附件（下载）",
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

