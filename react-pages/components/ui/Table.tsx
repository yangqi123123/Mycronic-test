import React from "react";

export type Column<T> = {
  key: string;
  title: string;
  widthClass?: string;
  render: (row: T) => React.ReactNode;
};

export function Table<T>(props: {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
}) {
  const { columns, rows, emptyText = "暂无数据" } = props;
  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(201,205,212,.6)] bg-white">
      <table className="w-full text-[14px]">
        <thead className="bg-[rgba(245,247,250,.9)]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`text-left px-3 py-2 whitespace-nowrap ${c.widthClass || ""}`}>
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-8 text-center text-[13px] text-[#86909C]" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx} className="border-t border-[rgba(201,205,212,.45)]">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-3 whitespace-nowrap align-top">
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

