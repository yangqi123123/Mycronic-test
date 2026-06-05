export type Grade = "A" | "B" | "C" | "D";

export type CustomerDetail = {
  id: string;
  name: string;
  grade: Grade;
  contactPhone: string;
  prov: string;
  city: string;
  dist: string;
  source: string;
  industry: string;

  uscc: string;
  legalRep: string;
  establishedAt: string; // YYYY-MM-DD
  regCapital: string;
  paidInCapital: string;
  regNo: string;
  orgCode: string;
  taxNo: string;
  bizTerm: string;
  regAuthority: string;
  insuredCount: string;
  formerName: string;
  approvedAt: string;
  regAddress: string;
  bizScope: string;
  keySummary: string;
};

export type ContactType = "主联系人" | "采购" | "技术" | "财务" | "其他";

export type Contact = {
  id: string;
  name: string;
  title: string;
  phone: string;
  type: ContactType;
};

export type FollowWay = "电话" | "线下拜访" | "企微" | "邮件" | "线上会议";

export type FollowRecord = {
  id: string;
  oppNo: string;
  way: FollowWay;
  record: string;
  location: string;
  tip: string;
  follower: string;
  followedAt: string; // YYYY-MM-DD HH:mm
};

export type Opportunity = {
  id: string;
  oppNo: string;
  desc: string;
  createdBy: string;
  createdAt: string; // YYYY-MM-DD HH:mm
};

export type Quote = {
  id: string;
  oppNo: string;
  amount: number; // 2 decimals display
  attachmentName: string;
  attachmentUrl: string;
  createdBy: string;
  createdAt: string;
};

export type Contract = {
  id: string;
  oppNo: string;
  contractNo: string;
  contractName: string;
  amount: number;
  signedAt: string; // YYYY-MM-DD
  expireAt: string; // YYYY-MM-DD
  fileName: string;
  fileUrl: string;
  paperFileName: string;
  paperFileUrl: string;
  createdBy: string;
  createdAt: string; // YYYY-MM-DD HH:mm
};

export type DeliveryStatus = "待交付" | "交付中" | "已交付";

export type Delivery = {
  id: string;
  contractNo: string;
  contractName: string;
  deliveredAt: string; // YYYY-MM-DD HH:mm
  dealAmount: number;
  status: DeliveryStatus;
  attachmentName: string;
  attachmentUrl: string;
  createdBy: string;
  createdAt: string;
};

