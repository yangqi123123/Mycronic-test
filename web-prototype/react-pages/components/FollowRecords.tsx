import React from "react";
import type { FollowRecord } from "../types/customer360";
import { Table } from "./ui/Table";

function TipBadge({ text }: { text: string }) {
  if (!text) return <span className="text-[#86909C]">—</span>;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-semibold bg-[rgba(255,125,0,.12)] text-[#FF7D00]">
      {text}
    </span>
  );
}

export function FollowRecords({ rows }: { rows: FollowRecord[] }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="text-[16px] font-semibold text-[#1D2129]">跟进记录</div>
      <div className="mt-3">
        <Table<FollowRecord>
          rows={rows}
          emptyText="暂无跟进记录"
          columns={[
            {
              key: "id",
              title: "跟进编号/商机编号",
              render: (r) => (
                <div>
                  <div className="font-semibold">{r.id}</div>
                  <div className="text-[12px] text-[#86909C] mt-0.5">{r.oppNo || "—"}</div>
                </div>
              ),
            },
            { key: "way", title: "跟进方式", render: (r) => r.way },
            {
              key: "record",
              title: "跟进记录",
              render: (r) => <div className="whitespace-pre-wrap max-w-[420px]">{r.record}</div>,
            },
            { key: "loc", title: "位置", render: (r) => r.location || "—" },
            { key: "tip", title: "提示", render: (r) => <TipBadge text={r.tip} /> },
            { key: "follower", title: "跟进人", render: (r) => r.follower },
            { key: "time", title: "跟进时间", render: (r) => r.followedAt },
          ]}
        />
      </div>
    </div>
  );
}

