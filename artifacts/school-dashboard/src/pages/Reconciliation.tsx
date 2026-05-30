import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, XCircle, Download, Printer, Search, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const tabs = [
  { id: "paystack",  label: "Paystack",          icon: <CheckCircle size={14} /> },
  { id: "offline",   label: "Offline Payments",   icon: <Clock size={14} /> },
  { id: "pending",   label: "Pending Approvals",  icon: <AlertCircle size={14} /> },
  { id: "failed",    label: "Failed & Reversed",  icon: <XCircle size={14} /> },
  { id: "outstanding", label: "Outstanding",      icon: <AlertCircle size={14} /> },
];

const paystackTxns = [
  { ref: "PSK-2026-8812", student: "Francisca Nyarko Quaye", class: "JHS 3", amount: 200,  status: "Verified",    date: "24 May 2026", channel: "Card" },
  { ref: "PSK-2026-8801", student: "Kwabena Owusu Adjei",    class: "JHS 3", amount: 200,  status: "Verified",    date: "24 May 2026", channel: "Mobile Money" },
  { ref: "PSK-2026-8790", student: "Abena Birago Asante",    class: "JHS 3", amount: 1800, status: "Verified",    date: "22 May 2026", channel: "Bank Transfer" },
  { ref: "PSK-2026-8765", student: "Emmanuel Darko",         class: "JHS 1", amount: 1800, status: "Failed",      date: "20 May 2026", channel: "Card" },
  { ref: "PSK-2026-8744", student: "Nana Ama Quayson",       class: "JHS 1", amount: 1800, status: "Abandoned",   date: "18 May 2026", channel: "USSD" },
];

const offlinePayments = [
  { ref: "MTN-2026-0988", student: "Akua Acheampong",     class: "JHS 2",   method: "Direct Mobile Money", amount: 1800, date: "30 May 2026", matched: true  },
  { ref: "MTN-2026-0982", student: "Yaw Adjei Mensah",    class: "JHS 2",   method: "Direct Mobile Money", amount: 1800, date: "29 May 2026", matched: true  },
  { ref: "GCB-DEP-0041",  student: "Emmanuel Darko",      class: "JHS 1",   method: "Bank Deposit",        amount: 1800, date: "30 May 2026", matched: false },
  { ref: "ECO-TXN-8821",  student: "Gifty Asare",         class: "JHS 1",   method: "Bank Transfer",       amount: 1800, date: "30 May 2026", matched: false },
  { ref: "CHQ-004521",    student: "Nana Ama Quayson",    class: "JHS 1",   method: "Cheque",              amount: 1800, date: "29 May 2026", matched: false },
  { ref: "ZEN-TXN-3301",  student: "Maame Boateng",       class: "Basic 6", method: "Bank Transfer",       amount: 1200, date: "28 May 2026", matched: false },
];

const pendingApprovals = [
  { ref: "GCB-DEP-0041", student: "Emmanuel Darko",        class: "JHS 1",   method: "Bank Deposit",  amount: 1800, submitted: "30 May 2026", submittedBy: "Kofi Mensah" },
  { ref: "ECO-TXN-8821", student: "Gifty Asare",           class: "JHS 1",   method: "Bank Transfer", amount: 1800, submitted: "30 May 2026", submittedBy: "Kofi Mensah" },
  { ref: "CHQ-004521",   student: "Nana Ama Quayson",      class: "JHS 1",   method: "Cheque",        amount: 1800, submitted: "29 May 2026", submittedBy: "Yaw Boateng" },
  { ref: "ECO-TXN-8819", student: "Abena Birago Asante",   class: "JHS 3",   method: "Bank Transfer", amount: 1800, submitted: "28 May 2026", submittedBy: "Kofi Mensah" },
  { ref: "ZEN-TXN-3301", student: "Maame Boateng",         class: "Basic 6", method: "Bank Transfer", amount: 1200, submitted: "28 May 2026", submittedBy: "Kofi Mensah" },
  { ref: "GCB-DEP-0039", student: "Kwesi Asante-Appiah",   class: "Basic 6", method: "Bank Deposit",  amount: 1200, submitted: "28 May 2026", submittedBy: "Yaw Boateng" },
  { ref: "CHQ-004489",   student: "Osei Mintah",           class: "JHS 2",   method: "Cheque",        amount: 1800, submitted: "27 May 2026", submittedBy: "Yaw Boateng" },
];

const failedReversed = [
  { ref: "PSK-2026-8765", student: "Emmanuel Darko",      class: "JHS 1",   type: "Failed",   amount: 1800, date: "20 May 2026", reason: "Insufficient funds — card declined" },
  { ref: "PSK-2026-8744", student: "Nana Ama Quayson",    class: "JHS 1",   type: "Abandoned",amount: 1800, date: "18 May 2026", reason: "Session timeout — user did not complete" },
  { ref: "RCP-2026-0431", student: "Serwaah Boadu",       class: "Basic 3", type: "Reversed", amount: 300,  date: "20 May 2026", reason: "Duplicate entry. Original: RCP-2026-0428" },
];

const outstanding = [
  { student: "Emmanuel Aidoo Darko",   class: "JHS 1",   invoice: "INV-2026-0314", amount: 1800, due: "15 May 2026", overdueDays: 15 },
  { student: "Osei Bonsu Mintah",      class: "JHS 2",   invoice: "INV-2026-0309", amount: 900,  due: "15 May 2026", overdueDays: 15 },
  { student: "Abena Owusuaa Nkrumah",  class: "Basic 1", invoice: "INV-2026-0315", amount: 1200, due: "15 May 2026", overdueDays: 15 },
  { student: "Nana Kweku Asiedu",      class: "Basic 1", invoice: "INV-2026-0316", amount: 1200, due: "15 May 2026", overdueDays: 15 },
  { student: "Adjoa Efua Koomson",     class: "KG 2",    invoice: "INV-2026-0317", amount: 800,  due: "15 May 2026", overdueDays: 15 },
  { student: "Kwame Yeboah Sarpong",   class: "KG 2",    invoice: "INV-2026-0318", amount: 800,  due: "15 May 2026", overdueDays: 15 },
];

export default function Reconciliation() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();
  const [activeTab, setActiveTab] = useState("paystack");
  const [search, setSearch] = useState("");
  const [approvals, setApprovals] = useState<Record<string, "approved" | "rejected">>({});

  const handleApprove = (ref: string, name: string) => {
    setApprovals(p => ({ ...p, [ref]: "approved" }));
    showToast(`Payment approved for ${name}`, "success");
  };
  const handleReject = (ref: string, name: string) => {
    setApprovals(p => ({ ...p, [ref]: "rejected" }));
    showToast(`Payment rejected for ${name}`, "error");
  };

  const handleExport = () => {
    exportToCSV(`reconciliation_${activeTab}`, [{ Note: "Export data for " + activeTab }]);
    showToast("Reconciliation data exported", "success");
  };

  const handlePrint = () => {
    printHTML(`<div class="header"><div><h1>Reconciliation — ${tabs.find(t=>t.id===activeTab)?.label}</h1><div class="school">Happy Kids Basic School · Term 2, 2025/2026</div></div><div class="school">Printed: ${new Date().toLocaleDateString("en-GB")}</div></div><p style="color:#9ca3af;font-size:13px">Reconciliation data for ${activeTab} transactions.</p>`, "Reconciliation");
  };

  const thS: React.CSSProperties = { padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.04em" };
  const tdS: React.CSSProperties = { padding: "10px 14px", fontSize: 12, color: "#374151" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Reconciliation</h1>
          {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Compare expected vs actual collections and approve offline payments</p>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => showToast("Reconciliation data refreshed", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Printer size={13} /> Print Report
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Expected (Term 2)",  value: "GH₵ 195,850", color: "#7c3aed", bg: "#f5f3ff" },
          { label: "Collected",          value: "GH₵ 148,000", color: "#16a34a", bg: "#f0fdf4" },
          { label: "Outstanding",        value: "GH₵ 47,850",  color: "#d97706", bg: "#fffbeb" },
          { label: "Pending Approvals",  value: `${pendingApprovals.filter(p=>!approvals[p.ref]).length}`,  color: "#ea580c", bg: "#fff7ed" },
          { label: "Paystack Verified",  value: `${paystackTxns.filter(t=>t.status==="Verified").length} txns`, color: "#2563eb", bg: "#eff6ff" },
        ].map(k => (
          <div key={k.label} style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", overflowX: "auto" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", border: "none",
                background: activeTab === tab.id ? "#f5f3ff" : "transparent",
                borderBottom: activeTab === tab.id ? "2px solid #7c3aed" : "2px solid transparent",
                color: activeTab === tab.id ? "#7c3aed" : "#6b7280", cursor: "pointer",
                fontSize: 12.5, fontWeight: activeTab === tab.id ? 700 : 500, whiteSpace: "nowrap",
              }}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
          <div style={{ flex: 1, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ position: "relative" }}>
              <Search size={11} style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                style={{ padding: "7px 8px 7px 24px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, outline: "none", width: 160, fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        {/* Paystack Transactions */}
        {activeTab === "paystack" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Reference", "Student", "Class", "Amount", "Channel", "Date", "Status", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>
                {paystackTxns.filter(t => !search || t.student.toLowerCase().includes(search.toLowerCase())).map((t, i, a) => (
                  <tr key={t.ref} style={{ borderBottom: i < a.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <td style={{ ...tdS, fontFamily: "monospace", fontSize: 11.5 }}>{t.ref}</td>
                    <td style={{ ...tdS, fontWeight: 600, color: "#111827" }}>{t.student}</td>
                    <td style={tdS}>{t.class}</td>
                    <td style={{ ...tdS, fontWeight: 700 }}>{fmt(t.amount)}</td>
                    <td style={tdS}>{t.channel}</td>
                    <td style={{ ...tdS, color: "#9ca3af" }}>{t.date}</td>
                    <td style={tdS}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: t.status === "Verified" ? "#dcfce7" : t.status === "Failed" ? "#fee2e2" : "#fef3c7", color: t.status === "Verified" ? "#16a34a" : t.status === "Failed" ? "#dc2626" : "#d97706" }}>{t.status}</span>
                    </td>
                    <td style={tdS}>
                      <button onClick={() => showToast(`Verifying Paystack ref ${t.ref}…`, "info")} style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 11.5, color: "#374151" }}>Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Offline Payments */}
        {activeTab === "offline" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Reference", "Student", "Class", "Method", "Amount", "Date", "Matched", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>
                {offlinePayments.filter(p => !search || p.student.toLowerCase().includes(search.toLowerCase())).map((p, i, a) => (
                  <tr key={p.ref} style={{ borderBottom: i < a.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <td style={{ ...tdS, fontFamily: "monospace", fontSize: 11.5 }}>{p.ref}</td>
                    <td style={{ ...tdS, fontWeight: 600, color: "#111827" }}>{p.student}</td>
                    <td style={tdS}>{p.class}</td>
                    <td style={tdS}>{p.method}</td>
                    <td style={{ ...tdS, fontWeight: 700 }}>{fmt(p.amount)}</td>
                    <td style={{ ...tdS, color: "#9ca3af" }}>{p.date}</td>
                    <td style={tdS}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: p.matched ? "#dcfce7" : "#fef3c7", color: p.matched ? "#16a34a" : "#d97706" }}>{p.matched ? "Matched" : "Unmatched"}</span>
                    </td>
                    <td style={tdS}>
                      <button onClick={() => showToast(`Matching payment ${p.ref}…`, "info")} style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 11.5, color: "#374151" }}>Match</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Approvals */}
        {activeTab === "pending" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Reference", "Student", "Class", "Method", "Amount", "Submitted", "By", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>
                {pendingApprovals.filter(p => !search || p.student.toLowerCase().includes(search.toLowerCase())).map((p, i, a) => {
                  const action = approvals[p.ref];
                  return (
                    <tr key={p.ref} style={{ borderBottom: i < a.length - 1 ? "1px solid #f9fafb" : "none", opacity: action ? 0.6 : 1 }}>
                      <td style={{ ...tdS, fontFamily: "monospace", fontSize: 11.5 }}>{p.ref}</td>
                      <td style={{ ...tdS, fontWeight: 600, color: "#111827" }}>{p.student}</td>
                      <td style={tdS}>{p.class}</td>
                      <td style={tdS}>{p.method}</td>
                      <td style={{ ...tdS, fontWeight: 700 }}>{fmt(p.amount)}</td>
                      <td style={{ ...tdS, color: "#9ca3af" }}>{p.submitted}</td>
                      <td style={tdS}>{p.submittedBy}</td>
                      <td style={tdS}>
                        {action ? (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: action === "approved" ? "#dcfce7" : "#fee2e2", color: action === "approved" ? "#16a34a" : "#dc2626" }}>
                            {action === "approved" ? "Approved" : "Rejected"}
                          </span>
                        ) : (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleApprove(p.ref, p.student)} style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#dcfce7", color: "#16a34a", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Approve</button>
                            <button onClick={() => handleReject(p.ref, p.student)} style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#fee2e2", color: "#dc2626", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Failed & Reversed */}
        {activeTab === "failed" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Reference", "Student", "Class", "Type", "Amount", "Date", "Reason", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>
                {failedReversed.filter(p => !search || p.student.toLowerCase().includes(search.toLowerCase())).map((p, i, a) => (
                  <tr key={p.ref} style={{ borderBottom: i < a.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <td style={{ ...tdS, fontFamily: "monospace", fontSize: 11.5 }}>{p.ref}</td>
                    <td style={{ ...tdS, fontWeight: 600, color: "#111827" }}>{p.student}</td>
                    <td style={tdS}>{p.class}</td>
                    <td style={tdS}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: p.type === "Reversed" ? "#fef3c7" : "#fee2e2", color: p.type === "Reversed" ? "#d97706" : "#dc2626" }}>{p.type}</span>
                    </td>
                    <td style={{ ...tdS, fontWeight: 700 }}>{fmt(p.amount)}</td>
                    <td style={{ ...tdS, color: "#9ca3af" }}>{p.date}</td>
                    <td style={{ ...tdS, fontSize: 11.5, color: "#6b7280", maxWidth: 240 }}>{p.reason}</td>
                    <td style={tdS}>
                      <button onClick={() => showToast(`Viewing audit log for ${p.ref}`, "info")} style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 11.5, color: "#374151" }}>Audit Log</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Outstanding Balances */}
        {activeTab === "outstanding" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Student", "Class", "Invoice", "Outstanding (GH₵)", "Due Date", "Days Overdue", "Action"].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>
                {outstanding.filter(p => !search || p.student.toLowerCase().includes(search.toLowerCase())).map((p, i, a) => (
                  <tr key={p.invoice} style={{ borderBottom: i < a.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <td style={{ ...tdS, fontWeight: 600, color: "#111827" }}>{p.student}</td>
                    <td style={tdS}>{p.class}</td>
                    <td style={{ ...tdS, fontFamily: "monospace", fontSize: 11.5 }}>{p.invoice}</td>
                    <td style={{ ...tdS, fontWeight: 700, color: "#dc2626" }}>{fmt(p.amount)}</td>
                    <td style={{ ...tdS, color: "#9ca3af" }}>{p.due}</td>
                    <td style={tdS}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "#fee2e2", color: "#dc2626" }}>{p.overdueDays} days</span>
                    </td>
                    <td style={tdS}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => showToast(`Reminder sent to ${p.student}'s parent`, "success")} style={{ padding: "5px 10px", border: "none", borderRadius: 6, background: "#fef3c7", color: "#d97706", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Remind</button>
                        <button onClick={() => showToast(`Opening invoice ${p.invoice}`, "info")} style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", cursor: "pointer", fontSize: 11.5, color: "#374151" }}>View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
