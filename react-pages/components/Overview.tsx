import React from "react";
import type { CustomerDetail } from "../types/customer360";
import { GradeTag } from "./ui/Tag";

export function Overview({ customer }: { customer: CustomerDetail }) {
  const region = [customer.prov, customer.city, customer.dist].filter(Boolean).join("/");
  return (
    <div className="rounded-xl border border-[rgba(201,205,212,.6)] shadow bg-[rgba(245,247,250,.9)] p-4">
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-12 lg:col-span-3">
          <div className="text-[12px] text-[#86909C]">客户名称</div>
          <div className="mt-1 text-[16px] font-semibold text-[#1D2129]">{customer.name}</div>
        </div>
        <div className="col-span-6 sm:col-span-4 lg:col-span-1">
          <div className="text-[12px] text-[#86909C]">客户等级</div>
          <div className="mt-1">
            <GradeTag grade={customer.grade} />
          </div>
        </div>
        <div className="col-span-6 sm:col-span-4 lg:col-span-2">
          <div className="text-[12px] text-[#86909C]">联系方式</div>
          <div className="mt-1 text-[14px] font-semibold text-[#1D2129]">{customer.contactPhone || "—"}</div>
        </div>
        <div className="col-span-12 sm:col-span-4 lg:col-span-2">
          <div className="text-[12px] text-[#86909C]">省市区</div>
          <div className="mt-1 text-[14px] text-[#1D2129]">{region || "—"}</div>
        </div>
        <div className="col-span-6 lg:col-span-2">
          <div className="text-[12px] text-[#86909C]">客户来源</div>
          <div className="mt-1 text-[14px] text-[#1D2129]">{customer.source || "—"}</div>
        </div>
        <div className="col-span-6 lg:col-span-2">
          <div className="text-[12px] text-[#86909C]">行业</div>
          <div className="mt-1 text-[14px] text-[#1D2129]">{customer.industry || "—"}</div>
        </div>
      </div>
    </div>
  );
}

