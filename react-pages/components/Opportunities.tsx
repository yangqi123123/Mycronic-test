import React from "react";
import type { Opportunity } from "../types/customer360";
import { Table } from "./ui/Table";

export function Opportunities({ rows }: { rows: Opportunity[] }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="text-[16px] font-semibold text-[#1D2129]">商机</div>
      <div className="mt-3">
        <Table<Opportunity>
          rows={rows}
          emptyText="暂无商机"
          columns={[
            { key: "oppNo", title: "商机编号", render: (r) => <span className="font-semibold">{r.oppNo}</span> },
            { key: "desc", title: "商机描述", render: (r) => <div className="whitespace-pre-wrap max-w-[520px]">{r.desc}</div> },
            { key: "createdBy", title: "创建人", render: (r) => r.createdBy },
            { key: "createdAt", title: "创建时间", render: (r) => r.createdAt },
          ]}
        />
      </div>
    </div>
  );
}

