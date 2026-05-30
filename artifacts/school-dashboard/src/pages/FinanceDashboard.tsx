import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  TrendingUp, CreditCard, AlertCircle, Wifi, WifiOff,
  Clock, XCircle, Download, Printer, RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";
import RecordPaymentModal from "../components/RecordPaymentModal";

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const kpis = [
  { label: "Total Expected",    value: "GH₵ 195,850", sub: "All invoices this term",  color: "#7c3aed", bg: "#f5f3ff", icon: <TrendingUp size={18} /> },
  { label: "Total Collected",   value: "GH₵ 148,000", sub: "+12.3% vs last month",   color: "#16a34a", bg: "#f0fdf4", icon: <CreditCard size={18} /> },
  { label: "Outstanding",       value: "GH₵ 47,850",  sub: "Across 68 students",     color: "#d97706", bg: "#fffbeb", icon: <AlertCircle size={18} /> },
  { label: "Online Payments",   value: "GH₵ 42,300",  sub: "28.6% of total",         color: "#2563eb", bg: "#eff6ff", icon: <Wifi size={18} /> },
  { label: "Offline Payments",  value: "GH₵ 105,700", sub: "71.4% of total",         color: "#0891b2", bg: "#ecfeff", icon: <WifiOff size={18} /> },
  { label: "Pending Approvals", value: "7",            sub: "Require action",         color: "#ea580c", bg: "#fff7ed", icon: <Clock size={18} /> },
  { label: "Failed / Reversed", value: "3",            sub: "Need review",            color: "#dc2626", bg: "#fef2f2", icon: <XCircle size={18} /> },
];

const collectionMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const collectionData   = [12000, 18500, 22000, 38000, 47500, 55000, 62000, 58000, 148000];
const targetData       = [30000, 35000, 40000, 55000, 60000, 65000, 70000, 65000, 160000];

const pendingApprovals = [
  { id: 1, student: "Kwabena Osei",       class: "Basic 4", method: "Bank Deposit",  amount: 1200, date: "30 May 2026", ref: "GCB-DEP-0041", initials: "KO", bg: "#bfdbfe", color: "#1e3a8a" },
  { id: 2, student: "Gifty Asare",        class: "JHS 1",   method: "Bank Transfer", amount: 1800, date: "30 May 2026", ref: "ECO-TXN-8821", initials: "GA", bg: "#fce7f3", color: "#9d174d" },
  { id: 3, student: "Nana Ama Quayson",   class: "JHS 1",   method: "Cheque",        amount: 1800, date: "29 May 2026", ref: "CHQ-004521",   initials: "NQ", bg: "#dcfce7", color: "#14532d" },
  { id: 4, student: "Emmanuel Darko",     class: "JHS 1",   method: "Bank Deposit",  amount: 1800, date: "29 May 2026", ref: "SG-DEP-0092",  initials: "ED", bg: "#ede9fe", color: "#4c1d95" },
  { id: 5, student: "Maame Boateng",      class: "Basic 6", method: "Bank Transfer", amount: 1200, date: "28 May 2026", ref: "ZEN-TXN-3301", initials: "MB", bg: "#fef9c3", color: "#713f12" },
  { id: 6, student: "Kwesi Asante-Appiah",class: "Basic 6", method: "Bank Deposit",  amount: 1200, date: "28 May 2026", ref: "GCB-DEP-0039", initials: "KA", bg: "#cffafe", color: "#164e63" },
  { id: 7, student: "Osei Mintah",        class: "JHS 2",   method: "Cheque",        amount: 1800, date: "27 May 2026", ref: "CHQ-004489",   initials: "OM", bg: "#ffedd5", color: "#7c2d12" },
];

const recentTransactions = [
  { id: 1, student: "Akua Acheampong", class: "JHS 2",   method: "Direct Mobile Money", amount: 1800, date: "30 May",      status: "Paid",    ref: "MTN-2026-0988", initials: "AA", bg: "#fde68a",  color: "#92400e" },
  { id: 2, student: "Amos Asante",     class: "Basic 6", method: "Cash",                amount: 1200, date: "30 May",      status: "Paid",    ref: "RCP-2026-0445", initials: "AK", bg: "#bbf7d0",  color: "#14532d" },
  { id: 3, student: "Yaw Adjei",       class: "JHS 2",   method: "Direct Mobile Money", amount: 1800, date: "29 May",      status: "Paid",    ref: "MTN-2026-0982", initials: "YA", bg: "#e9d5ff",  color: "#581c87" },
  { id: 4, student: "Abena Birago",    class: "JHS 3",   method: "Bank Transfer",       amount: 1800, date: "28 May",      status: "Pending", ref: "ECO-TXN-8819", initials: "AB", bg: "#fecdd3",  color: "#881337" },
  { id: 5, student: "Efua Lamptey",    class: "Basic 3", method: "Cash",                amount: 1200, date: "27 May",      status: "Paid",    ref: "RCP-2026-0440", initials: "EK", bg: "#d1fae5",  color: "#064e3b" },
];

function KpiCard({ kpi }: { kpi: typeof kpis[0] }) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", color: kpi.color, flexShrink: 0 }}>
        {kpi.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 2 }}>{kpi.label}</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{kpi.value}</div>
        <div style={{ fontSize: 11, color: kpi.color, marginTop: 2, fontWeight: 500 }}>{kpi.sub}</div>
      </div>
    </div>
  );
}

export default function FinanceDashboard() {
  const { showToast } = useApp();
  const { isMobile, isTablet } = useWindowSize();
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [approvalAction, setApprovalAction] = useState<Record<number, "approved" | "rejected">>({});

  const handleApprove = (id: number, name: string) => {
    setApprovalAction((p) => ({ ...p, [id]: "approved" }));
    showToast(`Payment approved for ${name}`, "success");
  };
  const handleReject = (id: number, name: string) => {
    setApprovalAction((p) => ({ ...p, [id]: "rejected" }));
    showToast(`Payment rejected for ${name}`, "error");
  };

  const cols = isMobile ? "1fr 1fr" : isTablet ? "repeat(3,1fr)" : "repeat(4,1fr)";
  const chartCols = isMobile ? "1fr" : "1fr 1fr";

  const collectionChart = {
    series: [
      { name: "Collected", data: collectionData },
      { name: "Target",    data: targetData },
    ],
    options: {
      chart: { type: "area" as const, toolbar: { show: false }, sparkline: { enabled: false } },
      colors: ["#7c3aed", "#e5e7eb"],
      fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
      stroke: { curve: "smooth" as const, width: 2 },
      xaxis: { categories: collectionMonths, labels: { style: { fontSize: "11px", colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { formatter: (v: number) => `GH₵${(v/1000).toFixed(0)}k`, style: { fontSize: "10px", colors: "#9ca3af" } } },
      grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
      tooltip: { y: { formatter: (v: number) => fmt(v) } },
      legend: { show: true, position: "top" as const, fontSize: "11px" },
      dataLabels: { enabled: false },
    },
  };

  const methodChart = {
    series: [42300, 68200, 28500, 7500, 1500],
    options: {
      chart: { type: "donut" as const },
      labels: ["Mobile Money", "Cash", "Bank Transfer", "Bank Deposit", "Cheque"],
      colors: ["#2563eb", "#16a34a", "#7c3aed", "#d97706", "#0891b2"],
      legend: { show: true, position: "bottom" as const, fontSize: "11px" },
      plotOptions: { pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Total", fontSize: "11px", color: "#9ca3af", formatter: () => "GH₵ 148K" } } } } },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (v: number) => fmt(v) } },
    },
  };

  const outstandingChart = {
    series: [{ name: "Outstanding (GH₵)", data: [5400, 6100, 5900, 8400, 7850, 6200, 5500, 4100, 3200, 2800, 2400] }],
    options: {
      chart: { type: "bar" as const, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "60%" } },
      colors: ["#7c3aed"],
      xaxis: { labels: { formatter: (v: string) => `GH₵${(Number(v)/1000).toFixed(1)}k`, style: { fontSize: "10px", colors: "#9ca3af" } } },
      yaxis: { categories: ["JHS 3","JHS 2","JHS 1","Basic 6","Basic 5","Basic 4","Basic 3","Basic 2","Basic 1","KG 2","KG 1"], labels: { style: { fontSize: "11px", colors: "#374151" } } },
      grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (v: number) => fmt(v) } },
    },
  };

  const onlineOfflineChart = {
    series: [42300, 105700],
    options: {
      chart: { type: "donut" as const },
      labels: ["Online (Paystack)", "Offline"],
      colors: ["#2563eb", "#7c3aed"],
      legend: { show: true, position: "bottom" as const, fontSize: "11px" },
      plotOptions: { pie: { donut: { size: "70%", labels: { show: true, total: { show: true, label: "Collected", fontSize: "10px", color: "#9ca3af", formatter: () => "GH₵ 148K" } } } } },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (v: number) => fmt(v) } },
    },
  };

  const pendingCount = pendingApprovals.filter(p => !approvalAction[p.id]).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Finance Dashboard</h1>
          {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Term 2 · Academic Year 2025/2026 · Happy Kids Basic School</p>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { exportToCSV("finance_summary", kpis.map(k => ({ Label: k.label, Value: k.value }))); showToast("Finance summary exported", "success"); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => { printHTML(`<div class="header"><div><h1>Finance Dashboard</h1><div class="school">Happy Kids Basic School · Term 2, 2025/2026</div></div><div class="school">Printed: ${new Date().toLocaleDateString("en-GB")}</div></div><h2>Summary</h2><table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>${kpis.map(k=>`<tr><td>${k.label}</td><td>${k.value}</td></tr>`).join("")}</tbody></table>`, "Finance Dashboard"); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}
          >
            <Printer size={13} /> Print
          </button>
          <button
            onClick={() => setShowRecordPayment(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}
          >
            <CreditCard size={13} /> Record Payment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => <KpiCard key={k.label} kpi={k} />)}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 340px", gap: 14, marginBottom: 14 }}>
        {/* Collections by month */}
        <div style={{ gridColumn: isMobile ? "1" : "1 / 3", background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Collections by Month</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>Collected vs target — 2025/2026</div>
          <ReactApexChart
            options={collectionChart.options}
            series={collectionChart.series}
            type="area"
            height={220}
          />
        </div>

        {/* Online vs Offline */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Online vs Offline</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Payment channel split</div>
          <ReactApexChart
            options={onlineOfflineChart.options}
            series={onlineOfflineChart.series}
            type="donut"
            height={220}
          />
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: chartCols, gap: 14, marginBottom: 20 }}>
        {/* Method breakdown */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Payment Method Breakdown</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Total collected by payment type</div>
          <ReactApexChart
            options={methodChart.options}
            series={methodChart.series}
            type="donut"
            height={240}
          />
        </div>

        {/* Outstanding by class */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Outstanding by Class</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Unpaid fees per class (GH₵)</div>
          <ReactApexChart
            options={outstandingChart.options}
            series={outstandingChart.series}
            type="bar"
            height={240}
          />
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingCount > 0 && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #fed7aa", marginBottom: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #fed7aa", background: "#fff7ed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={15} color="#ea580c" />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#ea580c" }}>Pending Approvals</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#ea580c", color: "white" }}>{pendingCount}</span>
            </div>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Offline payments awaiting confirmation</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  {["Student", "Class", "Method", "Amount", "Reference", "Date", "Action"].map(h => (
                    <th key={h} style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((p, i) => {
                  const action = approvalAction[p.id];
                  return (
                    <tr key={p.id} style={{ borderBottom: i < pendingApprovals.length - 1 ? "1px solid #f9fafb" : "none", opacity: action ? 0.5 : 1 }}>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: p.bg, color: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{p.student}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{p.class}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 20, background: "#fef3c7", color: "#b45309", fontWeight: 500 }}>{p.method}</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{fmt(p.amount)}</td>
                      <td style={{ padding: "10px 14px", fontSize: 11.5, color: "#6b7280", fontFamily: "monospace" }}>{p.ref}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#9ca3af" }}>{p.date}</td>
                      <td style={{ padding: "10px 14px" }}>
                        {action ? (
                          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: action === "approved" ? "#dcfce7" : "#fee2e2", color: action === "approved" ? "#16a34a" : "#dc2626" }}>
                            {action === "approved" ? "Approved" : "Rejected"}
                          </span>
                        ) : (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleApprove(p.id, p.student)} style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#dcfce7", color: "#16a34a", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Approve</button>
                            <button onClick={() => handleReject(p.id, p.student)} style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#fee2e2", color: "#dc2626", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>Recent Transactions</div>
          <button onClick={() => { showToast("Opening Payment History…", "info"); }} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            View All →
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {["Student", "Class", "Method", "Amount", "Reference", "Date", "Status"].map(h => (
                  <th key={h} style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < recentTransactions.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.bg, color: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{t.student}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{t.class}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#374151" }}>{t.method}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{fmt(t.amount)}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11.5, color: "#6b7280", fontFamily: "monospace" }}>{t.ref}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#9ca3af" }}>{t.date}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: t.status === "Paid" ? "#dcfce7" : "#fef3c7", color: t.status === "Paid" ? "#16a34a" : "#d97706" }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick refresh */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <button onClick={() => showToast("Finance data refreshed", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: 20, background: "white", cursor: "pointer", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
          <RefreshCw size={12} /> Refresh Data
        </button>
      </div>

      {showRecordPayment && <RecordPaymentModal onClose={() => setShowRecordPayment(false)} />}
    </div>
  );
}
