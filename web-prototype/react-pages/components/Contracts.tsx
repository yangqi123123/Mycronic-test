import React from "react";
import type { Contract } from "../types/customer360";
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

export function Contracts({ rows }: { rows: Contract[] }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="text-[16px] font-semibold text-[#1D2129]">合同</div>
      <div className="mt-3">
        <Table<Contract>
          rows={rows}
          emptyText="暂无合同"
          columns={[
            { key: "oppNo", title: "商机编号", render: (r) => <span className="font-semibold">{r.oppNo}</span> },
            { key: "contractNo", title: "合同编号", render: (r) => <span className="text-[#4E5969]">{r.contractNo}</span> },
            { key: "contractName", title: "合同名称", render: (r) => r.contractName || "—" },
            { key: "amount", title: "合同金额", render: (r) => <span className="font-semibold">{formatMoney(r.amount)}</span> },
            { key: "signedAt", title: "签署时间", render: (r) => r.signedAt || "—" },
            { key: "expireAt", title: "到期时间", render: (r) => r.expireAt || "—" },
            {
              key: "file",
              title: "合同附件（下载）",
              render: (r) =>
                r.fileName ? (
                  <button type="button" className="text-[#4080FF] font-semibold" onClick={() => download(r.fileName, r.fileUrl)}>
                    {r.fileName}
                  </button>
                ) : (
                  <span className="text-[#86909C]">暂无附件</span>
                ),
            },
            {
              key: "paper",
              title: "纸质合同附件（下载）",
              render: (r) =>
                r.paperFileName ? (
                  <button type="button" className="text-[#4080FF] font-semibold" onClick={() => download(r.paperFileName, r.paperFileUrl)}>
                    {r.paperFileName}
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

