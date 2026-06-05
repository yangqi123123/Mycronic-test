import React, { useMemo, useState } from "react";
import type { Contact } from "../types/customer360";
import { Table } from "./ui/Table";

function maskPhone(p: string) {
  const s = String(p || "");
  if (s.length < 7) return s || "—";
  return s.slice(0, 3) + "****" + s.slice(-4);
}

export function Contacts({ rows }: { rows: Contact[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const slice = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page]);

  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="text-[16px] font-semibold text-[#1D2129]">联系人</div>
      <div className="mt-3">
        <Table<Contact>
          rows={slice}
          emptyText="暂无联系人"
          columns={[
            { key: "name", title: "姓名", render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: "title", title: "职位", render: (r) => r.title || "—" },
            { key: "phone", title: "电话", render: (r) => <span className="text-[#4E5969]">{maskPhone(r.phone)}</span> },
            { key: "type", title: "联系人类型", render: (r) => r.type },
          ]}
        />
        <div className="mt-3 flex items-center justify-between text-[13px] text-[#86909C]">
          <div>共 {rows.length} 条（每页 10 条）</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 px-3 rounded-lg border border-[rgba(201,205,212,.7)] bg-white disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一页
            </button>
            <span>
              {page} / {pages}
            </span>
            <button
              type="button"
              className="h-8 px-3 rounded-lg border border-[rgba(201,205,212,.7)] bg-white disabled:opacity-50"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

