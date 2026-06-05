import React, { useMemo, useState } from "react";
import type { CustomerDetail, Grade } from "../types/customer360";
import { Button } from "./ui/Button";
import { GradeTag } from "./ui/Tag";

const SOURCE_ENUM = ["线索池入库", "展会活动", "招标采购", "行业名录", "手工新增"] as const;
const INDUSTRY_ENUM = ["半导体", "SMT/电子制造", "PCB", "科研院所", "招标采购", "智能制造"] as const;

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[12px] text-[#86909C]">
      {children} {required ? <span className="text-[#F53F3F]">*</span> : null}
    </div>
  );
}

function TextCell({ value }: { value: string }) {
  return <div className="text-[14px] text-[#1D2129]">{value || "—"}</div>;
}

export function CustomerInfo(props: {
  customer: CustomerDetail;
  onSave: (next: CustomerDetail) => Promise<void> | void;
}) {
  const { customer, onSave } = props;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CustomerDetail>(customer);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const region = useMemo(() => [customer.prov, customer.city, customer.dist].filter(Boolean).join("/"), [customer]);

  function startEdit() {
    setDraft(customer);
    setErrors({});
    setEditing(true);
  }
  function cancel() {
    setDraft(customer);
    setErrors({});
    setEditing(false);
  }
  async function save() {
    const nextErrors: typeof errors = {};
    if (!draft.name.trim()) nextErrors.name = "客户名称不能为空";
    if (!draft.contactPhone.trim()) nextErrors.phone = "联系方式不能为空";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await onSave({ ...draft, name: draft.name.trim(), contactPhone: draft.contactPhone.trim() });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const left = [
    { k: "name", l: "客户名称", r: true },
    { k: "grade", l: "客户等级" },
    { k: "source", l: "客户来源" },
    { k: "legalRep", l: "法定代表人" },
    { k: "region", l: "省市区" },
    { k: "paidInCapital", l: "实缴资本" },
    { k: "orgCode", l: "组织机构代码" },
    { k: "bizTerm", l: "营业期限" },
    { k: "insuredCount", l: "参保人数" },
    { k: "approvedAt", l: "核准日期" },
    { k: "bizScope", l: "经营范围" },
  ] as const;
  const right = [
    { k: "uscc", l: "统一社会信用代码" },
    { k: "contactPhone", l: "联系方式", r: true },
    { k: "industry", l: "行业" },
    { k: "establishedAt", l: "成立日期" },
    { k: "regCapital", l: "注册资本" },
    { k: "regNo", l: "工商注册号" },
    { k: "taxNo", l: "纳税人识别号" },
    { k: "regAuthority", l: "登记机关" },
    { k: "formerName", l: "曾用名" },
    { k: "regAddress", l: "注册地址" },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[16px] font-semibold text-[#1D2129]">客户信息</div>
        {!editing ? (
          <Button onClick={startEdit}>编辑</Button>
        ) : (
          <div className="flex gap-2">
            <Button disabled={saving} onClick={cancel}>
              取消
            </Button>
            <Button variant="primary" disabled={saving} onClick={save}>
              保存
            </Button>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-[rgba(201,205,212,.6)] overflow-hidden">
            {left.map((f) => (
              <div key={f.k} className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-[rgba(201,205,212,.45)] first:border-t-0">
                <div className="col-span-4">
                  <FieldLabel required={!!f.r}>{f.l}</FieldLabel>
                </div>
                <div className="col-span-8">
                  {!editing ? (
                    f.k === "grade" ? (
                      <div className="mt-0.5">
                        <GradeTag grade={customer.grade} />
                      </div>
                    ) : f.k === "region" ? (
                      <TextCell value={region} />
                    ) : (
                      <TextCell value={(customer as any)[f.k] || ""} />
                    )
                  ) : f.k === "grade" ? (
                    <select
                      className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                      value={draft.grade}
                      onChange={(e) => setDraft({ ...draft, grade: e.target.value as Grade })}
                    >
                      {(["A", "B", "C", "D"] as Grade[]).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  ) : f.k === "source" ? (
                    <select
                      className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                      value={draft.source}
                      onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                    >
                      {SOURCE_ENUM.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : f.k === "name" ? (
                    <div>
                      <input
                        className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      />
                      {errors.name ? <div className="text-[12px] text-[#F53F3F] mt-1">{errors.name}</div> : null}
                    </div>
                  ) : f.k === "region" ? (
                    <div className="text-[13px] text-[#86909C]">省/市/区：由线索回显（原型展示）</div>
                  ) : (
                    <input
                      className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                      value={(draft as any)[f.k] || ""}
                      onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value } as any)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-[rgba(201,205,212,.6)] overflow-hidden">
            <div className="px-3 py-2 bg-[rgba(245,247,250,.9)] text-[12px] text-[#86909C]">关键需求摘要（多行）</div>
            {!editing ? (
              <div className="px-3 py-3 text-[14px] text-[#1D2129] whitespace-pre-wrap min-h-[88px]">{customer.keySummary || "—"}</div>
            ) : (
              <textarea
                className="w-full min-h-[110px] px-3 py-2 text-[14px] outline-none"
                value={draft.keySummary}
                onChange={(e) => setDraft({ ...draft, keySummary: e.target.value })}
              />
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-xl border border-[rgba(201,205,212,.6)] overflow-hidden">
            {right.map((f) => (
              <div key={f.k} className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-[rgba(201,205,212,.45)] first:border-t-0">
                <div className="col-span-4">
                  <FieldLabel required={!!f.r}>{f.l}</FieldLabel>
                </div>
                <div className="col-span-8">
                  {!editing ? (
                    <TextCell value={(customer as any)[f.k] || ""} />
                  ) : f.k === "industry" ? (
                    <select
                      className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                      value={draft.industry}
                      onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
                    >
                      {INDUSTRY_ENUM.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : f.k === "contactPhone" ? (
                    <div>
                      <input
                        className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                        value={draft.contactPhone}
                        onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })}
                      />
                      {errors.phone ? <div className="text-[12px] text-[#F53F3F] mt-1">{errors.phone}</div> : null}
                    </div>
                  ) : (
                    <input
                      className="w-full h-9 rounded-lg border border-[rgba(201,205,212,.7)] px-3 text-[14px]"
                      value={(draft as any)[f.k] || ""}
                      onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value } as any)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

