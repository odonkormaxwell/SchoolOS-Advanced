import { useRef, useEffect, useState } from "react";
import {
  ChevronDown, ChevronRight, ChevronLeft, Search, Filter, Download,
  Plus, CreditCard, Link2, MoreVertical, TrendingUp, AlertCircle,
} from "lucide-react";

const invoices = [
  { id: "INV-2024-00456", student: "Kofi Junior Asante", sid: "STU-2024-0012", class: "P6 - Topaz", feeType: "Tuition Fees", amount: 2500, paid: 2500, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: "INV-2024-00455", student: "Ama Serwaa Ofori", sid: "STU-2024-0013", class: "P6 - Topaz", feeType: "Tuition Fees", amount: 2500, paid: 1000, balance: 1500, due: "30 Apr 2024", status: "Partially Paid", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: "INV-2024-00454", student: "Daniel Nii Lartey", sid: "STU-2024-0014", class: "P6 - Topaz", feeType: "Tuition Fees", amount: 2500, paid: 0, balance: 2500, due: "30 Apr 2024", status: "Overdue", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { id: "INV-2024-00453", student: "Akosua Adwoa Mensah", sid: "STU-2024-0015", class: "P6 - Topaz", feeType: "Transport Fees", amount: 650, paid: 650, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: "INV-2024-00452", student: "Yaw Antwi Boakye", sid: "STU-2024-0016", class: "P6 - Topaz", feeType: "Feeding Fees", amount: 400, paid: 400, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { id: "INV-2024-00451", student: "Efua Korkor Lamptey", sid: "STU-2024-0017", class: "P6 - Topaz", feeType: "PTA Dues", amount: 150, paid: 150, balance: 0, due: "15 May 2024", status: "Overdue", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: "INV-2024-00450", student: "Michael Kojo Addo", sid: "STU-2024-0018", class: "P6 - Topaz", feeType: "Other Fees", amount: 300, paid: 300, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
];

const statusStyle = (s: string) => {
  if (s === "Paid") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Partially Paid") return { bg: "#fef3c7", color: "#d97706" };
  if (s === "Overdue") return { bg: "#fee2e2", color: "#dc2626" };
  return { bg: "#f3f4f6", color: "#6b7280" };
};

function RevenueTrendChart() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "area", height: 150, toolbar: { show: false }, animations: { enabled: false } },
        series: [{ name: "Revenue", data: [45000, 52000, 48000, 65000, 72000, 96430] }],
        xaxis: { categories: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"], labels: { style: { fontSize: "10px", colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" }, formatter: (v: number) => `GHS ${(v / 1000).toFixed(0)}k` }, tickAmount: 4 },
        colors: ["#7c3aed"],
        stroke: { width: 2, curve: "smooth" },
        fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] } },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
        dataLabels: { enabled: false },
        tooltip: { style: { fontSize: "11px" }, y: { formatter: (v: number) => `GHS ${v.toLocaleString()}` } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

function FeeBreakdownDonut() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "donut", height: 200, toolbar: { show: false } },
        series: [207900, 48790, 36790, 29950, 21650],
        labels: ["Tuition Fees", "Other Fees", "Transport Fees", "Feeding Fees", "PTA Dues"],
        colors: ["#7c3aed", "#2563eb", "#16a34a", "#d97706", "#dc2626"],
        legend: { show: false },
        plotOptions: { pie: { donut: { size: "60%", labels: { show: true, total: { show: true, label: "Total", fontSize: "11px", color: "#9ca3af", formatter: () => "GHS 345K" } } } } },
        dataLabels: { enabled: false },
        tooltip: { style: { fontSize: "11px" }, y: { formatter: (v: number) => `GHS ${v.toLocaleString()}` } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

export default function Billing() {
  const [activeTab, setActiveTab] = useState("All Invoices");
  const [currentPage, setCurrentPage] = useState(1);

  const pageTabs = ["Overview", "Invoices", "Fee Structures", "Revenue", "Expenses", "Payroll", "PTA / Contributions"];
  const invoiceTabs = ["All Invoices", "Outstanding", "Partially Paid", "Paid", "Overdue"];

  const feeSummary = [
    { label: "Tuition Fees", amount: "GHS 207,900.00", pct: "60.2%", color: "#7c3aed" },
    { label: "Other Fees", amount: "GHS 48,790.00", pct: "14.1%", color: "#2563eb" },
    { label: "Transport Fees", amount: "GHS 36,790.00", pct: "10.7%", color: "#16a34a" },
    { label: "Feeding Fees", amount: "GHS 29,950.00", pct: "8.6%", color: "#d97706" },
    { label: "PTA Dues", amount: "GHS 21,650.00", pct: "6.4%", color: "#dc2626" },
  ];

  const recentPayments = [
    { name: "Ama Serwaa Ofori", amount: "GHS 1,000.00", via: "Via MTN MoMo", time: "14 May, 10:34 AM", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
    { name: "Akosua Adwoa Mensah", amount: "GHS 650.00", via: "Via Hubtel", time: "14 May, 09:21 AM", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
    { name: "Yaw Antwi Boakye", amount: "GHS 400.00", via: "Via Vodafone Cash", time: "13 May, 04:15 PM", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  ];

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Finance / Billing</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <CreditCard size={13} color="#6b7280" /> Receive Payment
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Link2 size={13} color="#6b7280" /> Payment Links
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={14} /> Create Invoice
            </button>
          </div>
        </div>

        {/* Page Tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {pageTabs.map((t) => (
            <button key={t} style={{ padding: "7px 12px", fontSize: 12, fontWeight: t === "Overview" ? 600 : 400, color: t === "Overview" ? "white" : "#6b7280", background: t === "Overview" ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {[
            { label: "Total Revenue (This Term)", value: "GHS 96,430.00", sub: "↑ 18.6% vs last term", subColor: "#16a34a", icon: "💰", iconBg: "#ede9fe" },
            { label: "Outstanding Fees", value: "GHS 96,430.00", sub: "28.3% of billed amount", subColor: "#dc2626", icon: "⚠️", iconBg: "#fee2e2" },
            { label: "Total Invoiced", value: "GHS 345,080.00", sub: "This Term", subColor: "#6b7280", icon: "📄", iconBg: "#dbeafe" },
            { label: "Total Payments", value: "GHS 248,650.00", sub: "72.0% of invoiced", subColor: "#16a34a", icon: "✅", iconBg: "#dcfce7" },
            { label: "Total Students", value: "412", sub: "Active Students", subColor: "#6b7280", icon: "👥", iconBg: "#fef3c7" },
          ].map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</span>
                <span style={{ fontSize: 18 }}>{k.icon}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: k.subColor, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {/* Revenue Trend */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Revenue Trend</span>
              <div style={{ position: "relative" }}>
                <select style={{ appearance: "none", padding: "4px 20px 4px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                  <option>This Term</option>
                </select>
                <ChevronDown size={10} color="#9ca3af" style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
            <RevenueTrendChart />
          </div>

          {/* Fee Collection Breakdown */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Fee Collection Breakdown</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <FeeBreakdownDonut />
              <div style={{ flex: 1 }}>
                {[
                  { label: "Tuition Fees", pct: "60.2%", color: "#7c3aed", amount: "GHS 207,900" },
                  { label: "Other Fees", pct: "14.1%", color: "#2563eb", amount: "GHS 48,790" },
                  { label: "Transport Fees", pct: "10.7%", color: "#16a34a", amount: "GHS 36,790" },
                  { label: "Feeding Fees", pct: "8.6%", color: "#d97706", amount: "GHS 29,950" },
                  { label: "PTA Dues", pct: "6.4%", color: "#dc2626", amount: "GHS 21,650" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: "#374151", flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aging of Outstanding Fees */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Aging of Outstanding Fees</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Total: <strong style={{ color: "#dc2626" }}>GHS 96,430.00</strong></div>
            {[
              { label: "1 – 30 days", amount: "GHS 32,450.00", color: "#d97706" },
              { label: "31 – 60 days", amount: "GHS 24,780.00", color: "#ea580c" },
              { label: "61 – 90 days", amount: "GHS 18,600.00", color: "#dc2626" },
              { label: "90+ days", amount: "GHS 20,600.00", color: "#991b1b" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color }} />
                  <span style={{ fontSize: 11.5, color: "#374151" }}>{row.label}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>{row.amount}</span>
              </div>
            ))}
            <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", marginTop: 4 }}>View Arrears Report →</button>
          </div>
        </div>

        {/* Invoice Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          {/* Invoice tabs */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 2 }}>
            {invoiceTabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "#7c3aed" : "#6b7280", background: activeTab === t ? "#faf5ff" : "transparent", border: activeTab === t ? "1px solid #e9d5ff" : "1px solid transparent", borderRadius: 6, cursor: "pointer" }}>{t}</button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input placeholder="Search by student name, invoice no. or parent..." style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", outline: "none", background: "#fafafa" }} />
            </div>
            {[["All Classes"], ["All Fee Types"]].map(([opt]) => (
              <div key={opt} style={{ position: "relative" }}>
                <select style={{ appearance: "none", padding: "6px 22px 6px 9px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                  <option>{opt}</option>
                </select>
                <ChevronDown size={10} color="#9ca3af" style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer" }}>
              <span style={{ fontSize: 12, color: "#374151" }}>01 Apr – 15 May 2024</span>
              <span style={{ fontSize: 14 }}>📅</span>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", fontSize: 12, cursor: "pointer", color: "#374151" }}>
              <Filter size={12} color="#6b7280" /> Filter
            </button>
            <button style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Download size={13} color="#6b7280" />
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                <th style={{ padding: "10px 16px", width: 36 }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></th>
                {["INVOICE NO.", "STUDENT", "CLASS", "FEE TYPE", "AMOUNT", "PAID", "BALANCE", "DUE DATE", "STATUS", "ACTIONS"].map((c) => (
                  <th key={c} style={{ padding: "10px 10px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => {
                const st = statusStyle(inv.status);
                const isOverdue = inv.status === "Overdue";
                return (
                  <tr key={inv.id} style={{ borderBottom: idx < invoices.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <td style={{ padding: "10px 16px" }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></td>
                    <td style={{ padding: "10px 10px" }}><span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>{inv.id}</span></td>
                    <td style={{ padding: "10px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: inv.avatarBg, color: inv.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{inv.student}</div>
                          <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{inv.sid}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#374151" }}>{inv.class}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#374151" }}>{inv.feeType}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, fontWeight: 600, color: "#374151" }}>GHS {inv.amount.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#374151" }}>GHS {inv.paid.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, fontWeight: inv.balance > 0 ? 600 : 400, color: inv.balance > 0 ? "#dc2626" : "#374151" }}>GHS {inv.balance.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <div style={{ fontSize: 12, color: "#374151" }}>{inv.due}</div>
                      {isOverdue && <div style={{ fontSize: 10.5, color: "#dc2626", fontWeight: 500 }}>15 days</div>}
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 12, background: st.bg, color: st.color }}>{inv.status}</span>
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to 7 of <strong>412</strong> invoices</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
              ))}
              <span style={{ color: "#9ca3af" }}>…</span>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>42</button>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
              <div style={{ position: "relative", marginLeft: 6 }}>
                <select style={{ appearance: "none", padding: "5px 22px 5px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                  <option>10 / page</option>
                </select>
                <ChevronDown size={10} color="#9ca3af" style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { icon: "🔔", title: "Automated Reminders", desc: "SMS/WhatsApp reminders are ON for overdue invoices.", link: "Manage Reminders →" },
            { icon: "🔗", title: "Parent Payment Link", desc: "Share payment link with parents for easy payment.", link: "Generate Payment Link →" },
            { icon: "💬", title: "Need Help?", desc: "Get help from our finance support team.", link: "Contact Support →" },
          ].map((item) => (
            <div key={item.title} style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280", marginBottom: 6 }}>{item.desc}</div>
                <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>{item.link}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 256, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        {/* Fee Summary */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Fee Summary (This Term)</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {feeSummary.map((f) => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.color }} />
                <span style={{ fontSize: 11.5, color: "#374151" }}>{f.label}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>{f.amount}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{f.pct}</div>
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 8, borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>Total Invoiced</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>GHS 345,080.00</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { icon: "📄", label: "Create Invoice" }, { icon: "🏗️", label: "Add Fee Structure" },
              { icon: "💳", label: "Record Payment" }, { icon: "🔄", label: "Recurring Invoices" },
              { icon: "🎫", label: "Bu/Concessions" }, { icon: "🧾", label: "Print Receipts" },
            ].map((a) => (
              <button key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 4px", border: "1px solid #f3f4f6", borderRadius: 8, background: "#fafafa", cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ fontSize: 10, color: "#374151", textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Channels */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Payment Channels</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>Manage</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["MTN MoMo 📱", "Vodafone 📶", "Hubtel 🔵", "Paystack 💚", "Flutterwave 🌊"].map((ch) => (
              <span key={ch} style={{ padding: "4px 10px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11, color: "#374151", fontWeight: 500 }}>{ch}</span>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Recent Payments</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {recentPayments.map((p) => (
            <div key={p.name} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.avatarBg, color: p.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{p.via} · {p.time}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", whiteSpace: "nowrap" }}>{p.amount}</div>
            </div>
          ))}
          <button style={{ width: "100%", textAlign: "center", fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "6px 0", borderTop: "1px solid #f3f4f6" }}>Go to Payments →</button>
        </div>
      </div>
    </div>
  );
}
