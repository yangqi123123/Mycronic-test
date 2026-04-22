import React from "react";

export function SkeletonBlock({ h = 16, w = "100%" }: { h?: number; w?: string }) {
  return (
    <div
      className="rounded-md animate-pulse bg-[rgba(134,144,156,.18)]"
      style={{ height: h, width: w }}
    />
  );
}

