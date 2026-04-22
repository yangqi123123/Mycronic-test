import React from "react";

export type TabItem<T extends string> = { key: T; label: string };

export function Tabs<T extends string>(props: {
  items: TabItem<T>[];
  active: T;
  onChange: (t: T) => void;
}) {
  const { items, active, onChange } = props;
  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-3">
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const on = it.key === active;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={`h-9 px-4 rounded-lg border text-[14px] font-semibold ${
                on
                  ? "bg-[#ff8a00] text-white border-[rgba(255,138,0,.35)]"
                  : "bg-white text-[#1D2129] border-[rgba(201,205,212,.7)] hover:bg-[rgba(245,247,250,.9)]"
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

