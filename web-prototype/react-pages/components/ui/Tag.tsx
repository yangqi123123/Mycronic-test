import React from "react";
import type { Grade, DeliveryStatus } from "../../types/customer360";

export function GradeTag({ grade }: { grade: Grade }) {
  const map: Record<Grade, { bg: string; text: string }> = {
    A: { bg: "#36CFC9", text: "white" },
    B: { bg: "#4080FF", text: "white" },
    C: { bg: "#FF7D00", text: "white" },
    D: { bg: "#86909C", text: "white" },
  };
  const c = map[grade];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {grade}
    </span>
  );
}

export function StatusTag({ status }: { status: DeliveryStatus }) {
  const map: Record<DeliveryStatus, { bg: string; text: string }> = {
    待交付: { bg: "rgba(255,125,0,.12)", text: "#FF7D00" },
    交付中: { bg: "rgba(64,128,255,.12)", text: "#4080FF" },
    已交付: { bg: "rgba(54,207,201,.12)", text: "#0E8F84" },
  };
  const c = map[status];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-semibold" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

