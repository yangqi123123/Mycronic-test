import React from "react";

export function Button(props: {
  children: React.ReactNode;
  variant?: "primary" | "default";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { children, variant = "default", disabled, onClick } = props;
  const base =
    "h-9 px-4 rounded-lg text-[14px] font-semibold inline-flex items-center justify-center border transition";
  const cls =
    variant === "primary"
      ? `${base} bg-[#ff8a00] text-white border-[rgba(255,138,0,.35)] ${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-95"}`
      : `${base} bg-white text-[#1D2129] border-[rgba(201,205,212,.7)] ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[rgba(245,247,250,.9)]"}`;
  return (
    <button type="button" className={cls} disabled={!!disabled} onClick={disabled ? undefined : onClick}>
      {children}
    </button>
  );
}

