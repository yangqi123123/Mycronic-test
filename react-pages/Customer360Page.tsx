import React, { useEffect, useMemo, useState } from "react";
import type {
  Contact,
  Contract,
  CustomerDetail,
  Delivery,
  FollowRecord,
  Opportunity,
  Quote,
} from "./types/customer360";
import { Overview } from "./components/Overview";
import { Tabs } from "./components/ui/Tabs";
import { SkeletonBlock } from "./components/ui/Skeleton";
import { CustomerInfo } from "./components/CustomerInfo";
import { Contacts } from "./components/Contacts";
import { FollowRecords } from "./components/FollowRecords";
import { Opportunities } from "./components/Opportunities";
import { Quotes } from "./components/Quotes";
import { Contracts } from "./components/Contracts";
import { Deliveries } from "./components/Deliveries";

type TabKey = "info" | "contacts" | "follows" | "opps" | "quotes" | "contracts" | "deliveries";

function qp(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadFromCustomerStore(customerId: string): Partial<CustomerDetail> | null {
  try {
    const raw = localStorage.getItem("ai_customer_store_v1");
    if (!raw) return null;
    const data = JSON.parse(raw);
    const c = (data?.customers || []).find((x: any) => x && x.id === customerId);
    if (!c) return null;
    return {
      id: c.id,
      name: c.name || "",
      grade: c.grade || "B",
      contactPhone: c.contactPhone || "",
      prov: c.prov || "",
      city: c.city || "",
      dist: c.dist || "",
      source: c.source || "",
      industry: c.industry || "",
      uscc: c.uscc || "",
    } as any;
  } catch {
    return null;
  }
}

function writeBackToCustomerStore(customerId: string, patch: Partial<CustomerDetail>) {
  try {
    const raw = localStorage.getItem("ai_customer_store_v1");
    if (!raw) return;
    const data = JSON.parse(raw);
    const idx = (data?.customers || []).findIndex((x: any) => x && x.id === customerId);
    if (idx < 0) return;
    data.customers[idx] = { ...data.customers[idx], ...patch };
    localStorage.setItem("ai_customer_store_v1", JSON.stringify(data));
    // notify same tab listeners
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

async function fetchCustomer360(customerId: string) {
  await sleep(450);
  // random failure 3% to validate error UI (prototype)
  if (Math.random() < 0.03) throw new Error("network");

  const fromStore = loadFromCustomerStore(customerId);
  const base: CustomerDetail = {
    id: customerId,
    name: fromStore?.name || "杭州智能制造科技",
    grade: (fromStore?.grade as any) || "A",
    contactPhone: fromStore?.contactPhone || "13700008888",
    prov: fromStore?.prov || "浙江",
    city: fromStore?.city || "杭州",
    dist: fromStore?.dist || "余杭",
    source: fromStore?.source || "行业名录",
    industry: fromStore?.industry || "智能制造",
    uscc: fromStore?.uscc || "91330110MA4XXXXXXX",
    legalRep: "",
    establishedAt: "",
    regCapital: "",
    paidInCapital: "",
    regNo: "",
    orgCode: "",
    taxNo: "",
    bizTerm: "",
    regAuthority: "",
    insuredCount: "",
    formerName: "",
    approvedAt: "",
    regAddress: "",
    bizScope: "",
    keySummary: "（原型）可填写关键需求摘要，多行展示。",
  };

  const contacts: Contact[] = customerId
    ? [
        { id: "CT-1", name: "王明", title: "采购经理", phone: base.contactPhone || "13700008888", type: "主联系人" },
      ]
    : [];

  const follows: FollowRecord[] = [
    {
      id: "FU-2026-0001",
      oppNo: "NX-2026-7002",
      way: "电话",
      record: "已沟通需求范围，确认交付周期与预算区间。",
      location: "—",
      tip: "地址不匹配",
      follower: "李雷",
      followedAt: "2026-04-16 16:39",
    },
  ];

  const opps: Opportunity[] = [
    { id: "OP-1", oppNo: "NX-2026-7002", desc: "产线升级，贴片机/回流焊设备采购与维保。", createdBy: "李雷", createdAt: "2026-04-16 16:40" },
  ];

  const quotes: Quote[] = [
    { id: "Q-1", oppNo: "NX-2026-7002", amount: 120000, attachmentName: "报价单.pdf", attachmentUrl: "data:text/plain,quote", createdBy: "李雷", createdAt: "2026-04-16 16:41" },
  ];

  const contracts: Contract[] = [
    {
      id: "HT-1",
      oppNo: "NX-2026-7002",
      contractNo: "HT-2026-8082",
      contractName: "杭州智能制造采购合同",
      amount: 980000,
      signedAt: "2026-04-10",
      expireAt: "2027-04-10",
      fileName: "合同正文.pdf",
      fileUrl: "data:text/plain,contract",
      paperFileName: "纸质扫描件.jpg",
      paperFileUrl: "data:text/plain,paper",
      createdBy: "李雷",
      createdAt: "2026-04-16 16:42",
    },
  ];

  const deliveries: Delivery[] = [
    {
      id: "D-1",
      contractNo: "HT-2026-8082",
      contractName: "杭州智能制造采购合同",
      deliveredAt: "2026-04-16 16:42",
      dealAmount: 980000,
      status: "待交付",
      attachmentName: "交付清单.pdf",
      attachmentUrl: "data:text/plain,delivery",
      createdBy: "李雷",
      createdAt: "2026-04-16 16:42",
    },
  ];

  return { customer: base, contacts, follows, opps, quotes, contracts, deliveries };
}

export default function Customer360Page() {
  const customerId = qp("id") || qp("customerId") || "C-0004";
  const [tab, setTab] = useState<TabKey>("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [follows, setFollows] = useState<FollowRecord[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const tabItems = useMemo(
    () => [
      { key: "info" as const, label: "客户信息" },
      { key: "contacts" as const, label: "联系人" },
      { key: "follows" as const, label: "跟进记录" },
      { key: "opps" as const, label: "商机" },
      { key: "quotes" as const, label: "报价" },
      { key: "contracts" as const, label: "合同" },
      { key: "deliveries" as const, label: "交付" },
    ],
    []
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetchCustomer360(customerId);
      setCustomer(res.customer);
      setContacts(res.contacts);
      setFollows(res.follows);
      setOpps(res.opps);
      setQuotes(res.quotes);
      setContracts(res.contracts);
      setDeliveries(res.deliveries);
    } catch {
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // sync from other pages
    const onStorage = () => {
      const from = loadFromCustomerStore(customerId);
      if (from && customer) setCustomer({ ...customer, ...from } as any);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="rounded-xl border border-[rgba(201,205,212,.6)] bg-[rgba(245,247,250,.9)] p-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4">
              <SkeletonBlock h={14} w="60%" />
              <div className="mt-2">
                <SkeletonBlock h={18} w="80%" />
              </div>
            </div>
            <div className="col-span-8">
              <SkeletonBlock h={14} w="90%" />
              <div className="mt-2">
                <SkeletonBlock h={14} w="70%" />
              </div>
            </div>
          </div>
        </div>
        <SkeletonBlock h={52} />
        <SkeletonBlock h={420} />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow border border-[rgba(201,205,212,.6)] p-6">
          <div className="text-[16px] font-semibold text-[#1D2129]">加载失败</div>
          <div className="text-[13px] text-[#86909C] mt-2">请稍后重试或检查网络。</div>
          <button
            type="button"
            className="mt-4 h-9 px-4 rounded-lg bg-[#ff8a00] text-white font-semibold"
            onClick={() => load()}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* 顶部客户概览区 */}
      <Overview customer={customer} />

      {/* 中间 Tabs */}
      <Tabs items={tabItems} active={tab} onChange={setTab} />

      {/* 底部内容区 */}
      {tab === "info" ? (
        <CustomerInfo
          customer={customer}
          onSave={async (next) => {
            setCustomer(next);
            writeBackToCustomerStore(customerId, {
              name: next.name,
              grade: next.grade,
              contactPhone: next.contactPhone,
              source: next.source,
              industry: next.industry,
              uscc: next.uscc,
            });
          }}
        />
      ) : null}
      {tab === "contacts" ? <Contacts rows={contacts} /> : null}
      {tab === "follows" ? <FollowRecords rows={follows} /> : null}
      {tab === "opps" ? <Opportunities rows={opps} /> : null}
      {tab === "quotes" ? <Quotes rows={quotes} /> : null}
      {tab === "contracts" ? <Contracts rows={contracts} /> : null}
      {tab === "deliveries" ? <Deliveries rows={deliveries} /> : null}
    </div>
  );
}

