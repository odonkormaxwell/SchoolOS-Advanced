import { useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, Search, Download, Plus, CreditCard, MoreVertical, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const invoices = [
  { id: "INV-2024-00456", student: "Kofi Junior Asante", sid: "STU-2024-0012", class: "P6 - Topaz", feeType: "Tuition Fees", amount: 2500, paid: 2500, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: "INV-2024-00455", student: "Ama Serwaa Ofori", sid: "STU-2024-0013", class: "P6 - Topaz", feeType: "Tuition Fees", amount: 2500, paid: 1000, balance: 1500, due: "30 Apr 2024", status: "Partially Paid", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: "INV-2024-00454", student: "Daniel Nii Lartey", sid: "STU-2024-0014", class: "P6 - Topaz", feeType: "Tuition Fees", amount: 2500, paid: 0, balance: 2500, due: "30 Apr 2024", status: "Overdue", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { id: "INV-2024-00453", student: "Akosua Adwoa Mensah", sid: "STU-2024-0015", class: "P6 - Topaz", feeType: "Transport Fees", amount: 650, paid: 650, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: "INV-2024-00452", student: "Yaw Antwi Boakye", sid: "STU-2024-0016", class: "P6 - Topaz", feeType: "Feeding Fees", amount: 400, paid: 400, balance: 0, due: "30 Apr 2024", status: "Paid", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { id: "INV-2024-00451", student: "Efua Korkor Lamptey", sid: "STU-2024-0017", class: "P6 - Topaz", feeType: "PTA Dues", amount: 150, paid: 0, balance: 150, due: "15 May 2024", status: "Overdue", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
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
      if (!ref.current) return;
      chart = new ApexCharts(ref.current, {
        chart: { type: "area", height: 140, toolbar: { show: false }, animations: { enabled: false } },
        series: [{ name: "Revenue (GHS)", data: [45000, 52000, 48000, 65000, 72000, 96430] }],
        xaxis: { categories: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"], labels: { style: { fontSize: "10px", colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { fontSize: "10px", colors: "#9ca3af" }, formatter: (v: number) => `${(v / 1000).toFixed(0)}k` }, tickAmount: 4 },
        colors: ["#7c3aed"], stroke: { width: 2, curve: "smooth" },
        fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] } },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 3 }, dataLabels: { enabled: false },
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
      if (!ref.current) return;
      chart = new ApexCharts(ref.current, {
        chart: { type: "donut", height: 180, toolbar: { show: false } },
        series: [207900, 48790, 36790, 29950, 21650],
        labels: ["Tuition", "Other", "Transport", "Feeding", "PTA"],
        colors: ["#7c3aed", "#2563eb", "#16a34a", "#d97706", "#dc2626"], legend: { show: false },
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
  const { showToast } = useApp();
  const { isMobile, isTablet } = useWindowSize();

  const [invoiceTab, setInvoiceTab] = useState("All Invoices");
  const [pageTab, setPageTab] = useState("Overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(invoices[0]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Mobile Money");

  const invoiceTabs = ["All Invoices", "Outstanding", "Partially Paid", "Paid", "Overdue"];
  const pageTabs = isMobile
    ? ["Overview", "Invoices", "Revenue"]
    : ["Overview", "Invoices", "Fee Structures", "Revenue", "Expenses", "Payroll", "PTA / Contributions"];

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch = !searchQuery || inv.student.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = invoiceTab === "All Invoices" || inv.status === invoiceTab || (invoiceTab === "Outstanding" && (inv.status === "Overdue" || inv.status === "Partially Paid"));
    return matchSearch && matchTab;
  });

  const handleReceivePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayModal(false);
    setPayAmount("");
    showToast(`Payment of GHS ${payAmount} received via ${payMethod}!`, "success");
  };

  const kpiCards = [
    { label: "Total Expected", value: "GHS 345,080", sub: "This Term", icon: "💰", iconBg: "#ede9fe", color: "#7c3aed" },
    { label: "Total Collected", value: "GHS 287,445", sub: "83.3% collected", icon: "✅", iconBg: "#dcfce7", color: "#16a34a" },
    { label: "Outstanding", value: "GHS 57,635", sub: "16.7% remaining", icon: "⚠️", iconBg: "#fee2e2", color: "#dc2626" },
    { label: "This Month", value: "GHS 96,430", sub: "+12.4% vs last month", icon: "📈", iconBg: "#dbeafe", color: "#2563eb" },
    { label: "Overdue Invoices", value: "68", sub: "Students", icon: "🔔", iconBg: "#fef3c7", color: "#d97706" },
    { label: "Scholarships", value: "GHS 8,200", sub: "14 Students", icon: "🎓", iconBg: "#f3e8ff", color: "#7c3aed" },
  ];

  const kpiCols = isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)";

  return (
    <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: isMobile ? "visible" : "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Billing & Finance</h1>
            {!isMobile && <p style={{ fontSize: 12.5, color: "#6b7280", margin: "3px 0 0" }}>Manage invoices, collect fees and track school revenue.</p>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!isMobile && (
              <button onClick={() => showToast("Downloading financial report...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                <Download size={13} color="#6b7280" /> Export
              </button>
            )}
            <button onClick={() => showToast("Creating new invoice...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={13} />{!isMobile && " New Invoice"}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.color, fontWeight: 500, marginTop: 1 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Page tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {pageTabs.map((t) => (
            <button key={t} onClick={() => setPageTab(t)} style={{ flex: 1, padding: "7px 6px", fontSize: isMobile ? 11 : 11.5, fontWeight: pageTab === t ? 600 : 400, color: pageTab === t ? "white" : "#6b7280", background: pageTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap", minWidth: "fit-content" }}>{t}</button>
          ))}
        </div>

        {/* Revenue charts row */}
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 14 }}>
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Revenue Trend</span>
                <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600 }}>↑ GHS 96,430 this month</span>
              </div>
              <RevenueTrendChart />
            </div>
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Fee Breakdown</div>
              <FeeBreakdownDonut />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[{ label: "Tuition", pct: "60.2%", color: "#7c3aed" }, { label: "Other", pct: "14.1%", color: "#2563eb" }, { label: "Transport", pct: "10.7%", color: "#16a34a" }].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                    <span style={{ fontSize: 11, color: "#374151", flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoice Tabs + Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          {/* Invoice tabs + search */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "#f9fafb", borderRadius: 8, padding: "3px", gap: 2, flexWrap: "wrap" }}>
              {invoiceTabs.map((t) => (
                <button key={t} onClick={() => setInvoiceTab(t)} style={{ padding: "5px 10px", fontSize: 11.5, fontWeight: invoiceTab === t ? 600 : 400, color: invoiceTab === t ? "#111827" : "#6b7280", background: invoiceTab === t ? "white" : "transparent", border: "none", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", boxShadow: invoiceTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>{t}</button>
              ))}
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 140 }}>
              <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search invoices..."
                style={{ width: "100%", padding: "7px 10px 7px 27px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Mobile card list */}
          {isMobile ? (
            <div style={{ padding: "10px 12px" }}>
              {filteredInvoices.map((inv) => {
                const st = statusStyle(inv.status);
                return (
                  <div key={inv.id} onClick={() => setSelected(inv)}
                    style={{ background: selected.id === inv.id ? "#faf5ff" : "white", border: `1px solid ${selected.id === inv.id ? "#ede9fe" : "#f3f4f6"}`, borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: inv.avatarBg, color: inv.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.student}</div>
                        <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{inv.id} · {inv.feeType}</div>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>{inv.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>GHS {inv.amount.toLocaleString()}</span>
                        {inv.balance > 0 && <span style={{ fontSize: 11.5, color: "#dc2626", marginLeft: 8 }}>Balance: GHS {inv.balance.toLocaleString()}</span>}
                      </div>
                      {inv.balance > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); setSelected(inv); setPayAmount(String(inv.balance)); setShowPayModal(true); }}
                          style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredInvoices.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "#9ca3af" }}>No invoices found</div>}
            </div>
          ) : (
            /* Desktop table */
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                    <th style={{ padding: "10px 14px", width: 36 }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></th>
                    {["INVOICE ID", "STUDENT", "CLASS", "FEE TYPE", "AMOUNT", "PAID", "BALANCE", "DUE DATE", "STATUS", "ACTIONS"].map((c) => (
                      <th key={c} style={{ padding: "10px 10px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv, idx) => {
                    const st = statusStyle(inv.status);
                    return (
                      <tr key={inv.id} onClick={() => setSelected(inv)}
                        style={{ borderBottom: idx < filteredInvoices.length - 1 ? "1px solid #f9fafb" : "none", background: selected.id === inv.id ? "#faf5ff" : "white", cursor: "pointer" }}>
                        <td style={{ padding: "11px 14px" }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} onClick={(e) => e.stopPropagation()} /></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>{inv.id}</span></td>
                        <td style={{ padding: "11px 10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", background: inv.avatarBg, color: inv.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{inv.student}</div>
                              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{inv.sid}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12, color: "#374151" }}>{inv.class}</span></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12, color: "#374151" }}>{inv.feeType}</span></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>GHS {inv.amount.toLocaleString()}</span></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12, color: "#16a34a", fontWeight: 500 }}>GHS {inv.paid.toLocaleString()}</span></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12, color: inv.balance > 0 ? "#dc2626" : "#9ca3af", fontWeight: inv.balance > 0 ? 600 : 400 }}>GHS {inv.balance.toLocaleString()}</span></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 12, color: "#374151" }}>{inv.due}</span></td>
                        <td style={{ padding: "11px 10px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{inv.status}</span></td>
                        <td style={{ padding: "11px 10px" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            {inv.balance > 0 && (
                              <button onClick={(e) => { e.stopPropagation(); setSelected(inv); setPayAmount(String(inv.balance)); setShowPayModal(true); }}
                                style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                <CreditCard size={11} /> Pay
                              </button>
                            )}
                            <button onClick={(e) => e.stopPropagation()} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 5, display: "flex" }}><MoreVertical size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing {filteredInvoices.length} of <strong style={{ color: "#374151" }}>1,248</strong> invoices</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
              ))}
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Desktop */}
      {!isMobile && (
        <div style={{ width: 270, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Invoice Details</span>
          </div>
          <div style={{ padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{selected.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.student}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{selected.class}</div>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 12, background: statusStyle(selected.status).bg, color: statusStyle(selected.status).color }}>{selected.status}</span>
              </div>
            </div>

            {[["Invoice ID", selected.id], ["Fee Type", selected.feeType], ["Amount Due", `GHS ${selected.amount.toLocaleString()}`], ["Amount Paid", `GHS ${selected.paid.toLocaleString()}`], ["Balance", `GHS ${selected.balance.toLocaleString()}`], ["Due Date", selected.due]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: (k === "Balance" && selected.balance > 0) ? "#dc2626" : "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {selected.balance > 0 && (
                <button onClick={() => { setPayAmount(String(selected.balance)); setShowPayModal(true); }}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <CreditCard size={14} /> Receive Payment
                </button>
              )}
              <button onClick={() => showToast("Printing invoice...", "info")} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
                🖨️ Print Invoice
              </button>
              <button onClick={() => showToast("Reminder sent to parent", "success")} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
                📲 Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Payment Modal */}
      {showPayModal && (
        <div onClick={() => setShowPayModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: isMobile ? "20px 20px 0 0" : 16, padding: "24px", width: isMobile ? "100%" : 420, animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Receive Payment</span>
              <button onClick={() => setShowPayModal(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{selected.student}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{selected.id} · {selected.feeType}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", marginTop: 4 }}>Balance: GHS {selected.balance.toLocaleString()}</div>
            </div>
            <form onSubmit={handleReceivePayment}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>Amount Received (GHS)</label>
                <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required min="1" max={selected.balance}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 16, fontWeight: 600, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 5 }}>Payment Method</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Mobile Money", "Cash", "Bank Transfer", "Cheque"].map((method) => (
                    <button key={method} type="button" onClick={() => setPayMethod(method)}
                      style={{ padding: "9px 10px", borderRadius: 8, border: `2px solid ${payMethod === method ? "#7c3aed" : "#e5e7eb"}`, background: payMethod === method ? "#f5f3ff" : "white", color: payMethod === method ? "#7c3aed" : "#374151", fontSize: 12.5, fontWeight: payMethod === method ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      {payMethod === method && <Check size={12} />}{method}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setShowPayModal(false)} style={{ flex: 1, padding: "11px", border: "1px solid #e5e7eb", borderRadius: 9, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
