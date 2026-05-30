import { useState } from "react";
import {
  Search, Download, Printer, Eye, RotateCcw, ChevronDown, CreditCard,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";
import RecordPaymentModal from "../components/RecordPaymentModal";

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

type Status = "Paid" | "Partially Paid" | "Pending Approval" | "Reversed" | "Failed";
type Method = "Cash" | "Direct Mobile Money" | "Bank Deposit" | "Bank Transfer" | "Cheque" | "Paystack Online";

interface Payment {
  id: number; receiptNo: string; studentName: string; studentId: string;
  class: string; invoice: string; category: string; amount: number;
  method: Method; reference: string; date: string; status: Status;
  recordedBy: string; notes: string;
  initials: string; avatarBg: string; avatarColor: string;
}

const payments: Payment[] = [
  { id: 1,  receiptNo: "RCP-2026-0445", studentName: "Amos Kofi Asante",        studentId: "HKBS-2024-0001", class: "Basic 6", invoice: "INV-2026-0301", category: "School Fees",      amount: 1200, method: "Cash",                 reference: "—",              date: "30 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "Full term fees — cash payment at front desk.",          initials: "AK", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: 2,  receiptNo: "RCP-2026-0444", studentName: "Akua Pomaa Acheampong",   studentId: "HKBS-2020-0061", class: "JHS 2",   invoice: "INV-2026-0302", category: "School Fees",      amount: 1800, method: "Direct Mobile Money",   reference: "MTN-2026-0988",  date: "30 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "MTN MoMo. Sender: Mrs. Victoria Acheampong.",          initials: "AA", avatarBg: "#fde68a",  avatarColor: "#92400e" },
  { id: 3,  receiptNo: "RCP-2026-0443", studentName: "Yaw Adjei Mensah",        studentId: "HKBS-2020-0062", class: "JHS 2",   invoice: "INV-2026-0303", category: "School Fees",      amount: 1800, method: "Direct Mobile Money",   reference: "MTN-2026-0982",  date: "29 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "MTN MoMo. Sender: Mr. Kofi Mensah.",                   initials: "YA", avatarBg: "#e9d5ff",  avatarColor: "#581c87" },
  { id: 4,  receiptNo: "RCP-2026-0442", studentName: "Abena Birago Asante",     studentId: "HKBS-2019-0040", class: "JHS 3",   invoice: "INV-2026-0304", category: "School Fees",      amount: 1800, method: "Bank Transfer",         reference: "ECO-TXN-8819",   date: "28 May 2026", status: "Pending Approval",recordedBy: "Kofi Mensah",  notes: "Ecobank transfer. Pending accountant confirmation.",    initials: "AB", avatarBg: "#fecdd3",  avatarColor: "#881337" },
  { id: 5,  receiptNo: "RCP-2026-0441", studentName: "Efua Korkor Lamptey",     studentId: "HKBS-2023-0180", class: "Basic 3", invoice: "INV-2026-0305", category: "School Fees",      amount: 1200, method: "Cash",                 reference: "—",              date: "27 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "Cash received. Change given: GH₵ 0.",                  initials: "EK", avatarBg: "#d1fae5",  avatarColor: "#064e3b" },
  { id: 6,  receiptNo: "RCP-2026-0440", studentName: "Kwabena Frimpong Osei",   studentId: "HKBS-2023-0155", class: "Basic 4", invoice: "INV-2026-0306", category: "Activity Fee",     amount: 150,  method: "Cash",                 reference: "—",              date: "27 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "Activity fee T2.",                                     initials: "KF", avatarBg: "#c7d2fe",  avatarColor: "#3730a3" },
  { id: 7,  receiptNo: "RCP-2026-0439", studentName: "Gifty Abena Asare",       studentId: "HKBS-2021-0075", class: "JHS 1",   invoice: "INV-2026-0307", category: "School Fees",      amount: 1800, method: "Bank Transfer",         reference: "ECO-TXN-8821",   date: "30 May 2026", status: "Pending Approval",recordedBy: "Kofi Mensah",  notes: "Ecobank transfer. Awaiting admin approval.",           initials: "GA", avatarBg: "#fce7f3",  avatarColor: "#9d174d" },
  { id: 8,  receiptNo: "RCP-2026-0438", studentName: "Nana Ama Quayson",        studentId: "HKBS-2021-0076", class: "JHS 1",   invoice: "INV-2026-0308", category: "School Fees",      amount: 1800, method: "Cheque",               reference: "CHQ-004521",     date: "29 May 2026", status: "Pending Approval",recordedBy: "Yaw Boateng",  notes: "GCB cheque. Pending clearance.",                       initials: "NQ", avatarBg: "#dcfce7",  avatarColor: "#14532d" },
  { id: 9,  receiptNo: "RCP-2026-0437", studentName: "Osei Bonsu Mintah",       studentId: "HKBS-2020-0060", class: "JHS 2",   invoice: "INV-2026-0309", category: "School Fees",      amount: 900,  method: "Direct Mobile Money",   reference: "AIT-2026-0501",  date: "26 May 2026", status: "Partially Paid",  recordedBy: "Yaw Boateng",  notes: "AirtelTigo Money. Partial — balance GH₵ 900 remaining.",initials: "OB", avatarBg: "#fef9c3",  avatarColor: "#713f12" },
  { id: 10, receiptNo: "RCP-2026-0436", studentName: "Maame Serwaa Boateng",    studentId: "HKBS-2022-0098", class: "Basic 6", invoice: "INV-2026-0310", category: "School Fees",      amount: 1200, method: "Bank Transfer",         reference: "ZEN-TXN-3301",   date: "28 May 2026", status: "Pending Approval",recordedBy: "Kofi Mensah",  notes: "Zenith Bank transfer. Pending.",                       initials: "MS", avatarBg: "#fce7f3",  avatarColor: "#9d174d" },
  { id: 11, receiptNo: "RCP-2026-0435", studentName: "Daniel Ni Lartey",        studentId: "HKBS-2023-0181", class: "Basic 3", invoice: "INV-2026-0311", category: "Library Fee",      amount: 50,   method: "Cash",                 reference: "—",              date: "25 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "Library levy T2.",                                     initials: "DL", avatarBg: "#dbeafe",  avatarColor: "#1e3a8a" },
  { id: 12, receiptNo: "RCP-2026-0434", studentName: "Francisca Nyarko Quaye",  studentId: "HKBS-2019-0042", class: "JHS 3",   invoice: "INV-2026-0312", category: "BECE Prep Fee",    amount: 200,  method: "Paystack Online",       reference: "PSK-2026-8812",  date: "24 May 2026", status: "Paid",            recordedBy: "System",       notes: "Paystack online payment. Verified.",                   initials: "FN", avatarBg: "#ede9fe",  avatarColor: "#4c1d95" },
  { id: 13, receiptNo: "RCP-2026-0433", studentName: "Kwabena Owusu Adjei",     studentId: "HKBS-2019-0043", class: "JHS 3",   invoice: "INV-2026-0313", category: "BECE Prep Fee",    amount: 200,  method: "Cash",                 reference: "—",              date: "24 May 2026", status: "Paid",            recordedBy: "Yaw Boateng",  notes: "",                                                     initials: "KO", avatarBg: "#ccfbf1",  avatarColor: "#134e4a" },
  { id: 14, receiptNo: "RCP-2026-0432", studentName: "Emmanuel Aidoo Darko",    studentId: "HKBS-2021-0077", class: "JHS 1",   invoice: "INV-2026-0314", category: "School Fees",      amount: 1800, method: "Bank Deposit",          reference: "GCB-DEP-0041",   date: "30 May 2026", status: "Pending Approval",recordedBy: "Kofi Mensah",  notes: "GCB bank deposit slip. Awaiting confirmation.",        initials: "EA", avatarBg: "#cffafe",  avatarColor: "#164e63" },
  { id: 15, receiptNo: "RCP-2026-0431", studentName: "Serwaah Afriyie Boadu",   studentId: "HKBS-2023-0182", class: "Basic 3", invoice: "INV-2026-0315", category: "School Fees",      amount: 300,  method: "Direct Mobile Money",   reference: "MTN-2026-0970",  date: "20 May 2026", status: "Reversed",        recordedBy: "Admin",        notes: "Reversed — duplicate entry. Original: RCP-2026-0428.", initials: "SA", avatarBg: "#fef9c3",  avatarColor: "#713f12" },
];

const methodColors: Record<Method, { bg: string; color: string; emoji: string }> = {
  "Cash":                { bg: "#dcfce7", color: "#16a34a", emoji: "💵" },
  "Direct Mobile Money": { bg: "#dbeafe", color: "#2563eb", emoji: "📱" },
  "Bank Deposit":        { bg: "#fef3c7", color: "#d97706", emoji: "🏦" },
  "Bank Transfer":       { bg: "#ede9fe", color: "#7c3aed", emoji: "💸" },
  "Cheque":              { bg: "#ecfeff", color: "#0891b2", emoji: "📝" },
  "Paystack Online":     { bg: "#e0f2fe", color: "#006AFF", emoji: "💳" },
};

const statusColors: Record<Status, { bg: string; color: string }> = {
  "Paid":             { bg: "#dcfce7", color: "#16a34a" },
  "Partially Paid":   { bg: "#dbeafe", color: "#2563eb" },
  "Pending Approval": { bg: "#fef3c7", color: "#d97706" },
  "Reversed":         { bg: "#fee2e2", color: "#dc2626" },
  "Failed":           { bg: "#fef2f2", color: "#b91c1c" },
};

const classes = ["All Classes", "KG 1", "KG 2", "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", "JHS 1", "JHS 2", "JHS 3"];
const statuses: Status[] = ["Paid", "Partially Paid", "Pending Approval", "Reversed", "Failed"];
const methods: Method[]  = ["Cash", "Direct Mobile Money", "Bank Deposit", "Bank Transfer", "Cheque", "Paystack Online"];

export default function PaymentHistory() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();
  const [search,         setSearch]         = useState("");
  const [classFilter,    setClassFilter]    = useState("All Classes");
  const [methodFilter,   setMethodFilter]   = useState("All");
  const [statusFilter,   setStatusFilter]   = useState("All");
  const [showRecord,     setShowRecord]     = useState(false);
  const [selectedRev,    setSelectedRev]    = useState<number | null>(null);
  const [revReason,      setRevReason]      = useState("");

  const filtered = payments.filter(p => {
    const ms = !search || p.studentName.toLowerCase().includes(search.toLowerCase()) || p.receiptNo.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase());
    const mc = classFilter === "All Classes" || p.class === classFilter;
    const mm = methodFilter === "All" || p.method === methodFilter;
    const mst = statusFilter === "All" || p.status === statusFilter;
    return ms && mc && mm && mst;
  });

  const totalFiltered = filtered.reduce((s, p) => s + (p.status !== "Reversed" ? p.amount : 0), 0);

  const handleExport = () => {
    exportToCSV("payment_history", filtered.map(p => ({
      "Receipt No": p.receiptNo, "Date": p.date, "Student": p.studentName,
      "Class": p.class, "Invoice": p.invoice, "Category": p.category,
      "Amount (GH₵)": p.amount, "Method": p.method, "Reference": p.reference,
      "Status": p.status, "Recorded By": p.recordedBy,
    })));
    showToast(`${filtered.length} records exported to CSV`, "success");
  };

  const handlePrint = () => {
    const rows = filtered.map(p =>
      `<tr><td>${p.receiptNo}</td><td>${p.date}</td><td>${p.studentName}</td><td>${p.class}</td><td>${p.category}</td><td>${fmt(p.amount)}</td><td>${p.method}</td><td>${p.status}</td><td>${p.recordedBy}</td></tr>`
    ).join("");
    printHTML(`
      <div class="header"><div><h1>Payment History</h1><div class="school">Happy Kids Basic School · Term 2, 2025/2026</div></div><div class="school">Printed: ${new Date().toLocaleDateString("en-GB")}</div></div>
      <table><thead><tr><th>Receipt No</th><th>Date</th><th>Student</th><th>Class</th><th>Category</th><th>Amount</th><th>Method</th><th>Status</th><th>Recorded By</th></tr></thead><tbody>${rows}</tbody></table>
    `, "Payment History");
  };

  const handleReverse = (id: number) => {
    if (!revReason.trim()) { showToast("Please enter a reversal reason", "error"); return; }
    setSelectedRev(null);
    setRevReason("");
    showToast("Payment reversed. Audit log updated.", "success");
  };

  const selS: React.CSSProperties = { padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", background: "white", outline: "none", fontFamily: "inherit", cursor: "pointer" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Payment History</h1>
          {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>All recorded payments — Term 2, 2025/2026</p>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
            <Download size={13} /> Export
          </button>
          <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
            <Printer size={13} /> Print
          </button>
          <button onClick={() => setShowRecord(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <CreditCard size={13} /> Record Payment
          </button>
        </div>
      </div>

      {/* Summary KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Filtered Total",    value: fmt(totalFiltered),                                          color: "#7c3aed", bg: "#f5f3ff" },
          { label: "Paid",              value: String(filtered.filter(p=>p.status==="Paid").length),        color: "#16a34a", bg: "#f0fdf4" },
          { label: "Pending Approval",  value: String(filtered.filter(p=>p.status==="Pending Approval").length), color: "#d97706", bg: "#fffbeb" },
          { label: "Partially Paid",    value: String(filtered.filter(p=>p.status==="Partially Paid").length), color: "#2563eb", bg: "#eff6ff" },
          { label: "Reversed",          value: String(filtered.filter(p=>p.status==="Reversed").length),   color: "#dc2626", bg: "#fef2f2" },
        ].map(k => (
          <div key={k.label} style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 10, padding: "10px 14px", border: "1px solid #e5e7eb", marginBottom: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student, receipt, reference…"
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
        <select style={selS} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          {classes.map(c => <option key={c}>{c}</option>)}
        </select>
        <select style={selS} value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
          <option value="All">All Methods</option>
          {methods.map(m => <option key={m}>{m}</option>)}
        </select>
        <select style={selS} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || classFilter !== "All Classes" || methodFilter !== "All" || statusFilter !== "All") && (
          <button onClick={() => { setSearch(""); setClassFilter("All Classes"); setMethodFilter("All"); setStatusFilter("All"); }}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#f9fafb", cursor: "pointer", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
            <RotateCcw size={10} /> Clear
          </button>
        )}
      </div>

      {/* Method quick filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {["All", ...methods].map(m => {
          const active = methodFilter === m;
          const meta = m !== "All" ? methodColors[m as Method] : null;
          return (
            <button key={m} onClick={() => setMethodFilter(m)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
              border: `1px solid ${active ? (meta?.color ?? "#7c3aed") : "#e5e7eb"}`,
              borderRadius: 20, background: active ? (meta?.bg ?? "#f5f3ff") : "white",
              color: active ? (meta?.color ?? "#7c3aed") : "#374151",
              fontSize: 11.5, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              {meta && <span>{meta.emoji}</span>}{m}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#16a34a" }}>{fmt(totalFiltered)} collected</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {["Receipt No", "Date", "Student", "Class", "Category", "Amount", "Method", "Reference", "Status", "Recorded By", "Action"].map(h => (
                  <th key={h} style={{ padding: "9px 12px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const mc = methodColors[p.method];
                const sc = statusColors[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none", background: p.status === "Reversed" ? "#fef2f2" : "white" }}>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: "#6b7280", fontFamily: "monospace", whiteSpace: "nowrap" }}>{p.receiptNo}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>{p.date}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.avatarBg, color: p.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>{p.studentName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{p.class}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151", whiteSpace: "nowrap" }}>{p.category}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>{fmt(p.amount)}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: mc.bg, color: mc.color }}>{mc.emoji} {p.method}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: "#6b7280", fontFamily: "monospace", whiteSpace: "nowrap" }}>{p.reference}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: sc.bg, color: sc.color }}>{p.status}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151", whiteSpace: "nowrap" }}>{p.recordedBy}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => showToast(`Viewing receipt ${p.receiptNo}`, "info")} style={{ padding: "4px 8px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 11, color: "#374151" }}>
                          <Eye size={11} />
                        </button>
                        <button onClick={() => showToast(`Receipt ${p.receiptNo} downloaded`, "success")} style={{ padding: "4px 8px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 11, color: "#374151" }}>
                          <Download size={11} />
                        </button>
                        {p.status !== "Reversed" && (
                          <button onClick={() => setSelectedRev(p.id)} style={{ padding: "4px 8px", border: "1px solid #fecaca", borderRadius: 6, background: "#fef2f2", cursor: "pointer", fontSize: 11, color: "#dc2626" }}>
                            <RotateCcw size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                    No payments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reversal modal */}
      {selectedRev !== null && (
        <div onClick={() => setSelectedRev(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 14, padding: 24, maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RotateCcw size={16} color="#dc2626" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Reverse Payment</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>This action is logged and irreversible.</div>
              </div>
            </div>
            <div style={{ background: "#fef2f2", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 12.5, color: "#b91c1c" }}>
              ⚠ Reversing a payment will restore the invoice balance and mark this receipt as reversed. The original record is kept for audit purposes.
            </div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Reason for Reversal <span style={{ color: "#dc2626" }}>*</span></label>
            <textarea
              value={revReason}
              onChange={e => setRevReason(e.target.value)}
              placeholder="e.g. Duplicate entry, wrong student, parent request…"
              style={{ width: "100%", padding: "9px 11px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "vertical", minHeight: 70, boxSizing: "border-box", marginBottom: 14 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setSelectedRev(null); setRevReason(""); }} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Cancel</button>
              <button onClick={() => handleReverse(selectedRev)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "#dc2626", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "white" }}>Confirm Reversal</button>
            </div>
          </div>
        </div>
      )}

      {showRecord && <RecordPaymentModal onClose={() => setShowRecord(false)} />}
    </div>
  );
}
