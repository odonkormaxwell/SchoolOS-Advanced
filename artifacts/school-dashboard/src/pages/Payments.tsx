import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Download, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type PaymentMethod = "Cash" | "Mobile Money" | "Bank Transfer" | "Cheque";
type PaymentType   = "School Fees" | "Development Levy" | "Feeding" | "Uniform" | "Books" | "Transport" | "Other";

type Payment = {
  id: number; receiptNo: string; studentName: string; studentId: string;
  class: string; initials: string; avatarBg: string; avatarColor: string;
  amount: number; method: PaymentMethod; type: PaymentType;
  date: string; time: string; term: string; collectedBy: string;
  note: string;
};

const payments: Payment[] = [
  { id: 1,  receiptNo: "RCP-2024-0881", studentName: "Adjoa Mensah",        studentId: "STU-2024-0067", class: "JHS 3",      initials: "AM", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 1500, method: "Mobile Money",  type: "School Fees",      date: "30 May 2024", time: "10:45 AM", term: "Term 2", collectedBy: "Mr. S. Darko", note: "Full fees payment via MTN MoMo. Ref: MTN20240530-0021." },
  { id: 2,  receiptNo: "RCP-2024-0880", studentName: "Kofi Junior",         studentId: "STU-2024-0012", class: "JHS 3",      initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", amount: 350,  method: "Cash",          type: "Development Levy", date: "29 May 2024", time: "2:15 PM",  term: "Term 2", collectedBy: "Mrs. A. Aidoo", note: "Cash payment for development levy." },
  { id: 3,  receiptNo: "RCP-2024-0879", studentName: "Ama Serwaa Ofori",    studentId: "STU-2024-0013", class: "JHS 3",      initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 1850, method: "Bank Transfer",  type: "School Fees",      date: "28 May 2024", time: "9:00 AM",  term: "Term 2", collectedBy: "Mr. S. Darko", note: "Full term fees transferred via Ecobank. Ref: ECO2024-8821." },
  { id: 4,  receiptNo: "RCP-2024-0878", studentName: "Daniel Lartey",       studentId: "STU-2024-0014", class: "P6 - Topaz", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", amount: 200,  method: "Cash",          type: "Uniform",          date: "27 May 2024", time: "11:30 AM", term: "Term 2", collectedBy: "Mrs. A. Aidoo", note: "Payment for school uniform top + shorts." },
  { id: 5,  receiptNo: "RCP-2024-0877", studentName: "Yaw Darko",           studentId: "STU-2024-0018", class: "P5 - Ruby",  initials: "YD", avatarBg: "#fef9c3", avatarColor: "#713f12", amount: 900,  method: "Mobile Money",  type: "School Fees",      date: "26 May 2024", time: "4:00 PM",  term: "Term 2", collectedBy: "Mr. S. Darko", note: "Partial payment. Balance: GH₵ 950 remaining. Payment plan agreed." },
  { id: 6,  receiptNo: "RCP-2024-0876", studentName: "Abena Yaa Darko",     studentId: "STU-2024-0019", class: "P6 - Topaz", initials: "AD", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 100,  method: "Cash",          type: "Books",            date: "25 May 2024", time: "8:20 AM",  term: "Term 2", collectedBy: "Mrs. A. Aidoo", note: "Payment for workbooks and exercise books." },
  { id: 7,  receiptNo: "RCP-2024-0875", studentName: "Emmanuel Kofi Adu",   studentId: "STU-2024-0033", class: "JHS 1",      initials: "EK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", amount: 150,  method: "Cash",          type: "Feeding",          date: "24 May 2024", time: "7:50 AM",  term: "Term 2", collectedBy: "Mr. S. Darko", note: "Monthly school feeding levy." },
  { id: 8,  receiptNo: "RCP-2024-0874", studentName: "Kwame Asante",        studentId: "STU-2024-0042", class: "JHS 2",      initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", amount: 1000, method: "Cheque",        type: "School Fees",      date: "23 May 2024", time: "3:30 PM",  term: "Term 2", collectedBy: "Mrs. A. Aidoo", note: "Cheque No. 004521. Bank: GCB. Deposited May 24." },
  { id: 9,  receiptNo: "RCP-2024-0873", studentName: "Yaw Antwi Boakye",   studentId: "STU-2024-0016", class: "JHS 3",      initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", amount: 280,  method: "Mobile Money",  type: "Transport",        date: "22 May 2024", time: "12:00 PM", term: "Term 2", collectedBy: "Mr. S. Darko", note: "Monthly transport fee for Route B (Spintex Road)." },
  { id: 10, receiptNo: "RCP-2024-0872", studentName: "Adjoa Mensah",        studentId: "STU-2024-0067", class: "JHS 3",      initials: "AM", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 1500, method: "Bank Transfer",  type: "School Fees",      date: "5 Jan 2024",  time: "9:00 AM",  term: "Term 1", collectedBy: "Mr. S. Darko", note: "Term 1 full fees payment. Ecobank transfer." },
];

const methodStyle: Record<PaymentMethod, { bg: string; color: string; emoji: string }> = {
  "Cash":          { bg: "#dcfce7", color: "#16a34a", emoji: "💵" },
  "Mobile Money":  { bg: "#dbeafe", color: "#2563eb", emoji: "📱" },
  "Bank Transfer": { bg: "#ede9fe", color: "#7c3aed", emoji: "🏦" },
  "Cheque":        { bg: "#fef3c7", color: "#d97706", emoji: "📝" },
};

const typeStyle: Record<PaymentType, { bg: string; color: string }> = {
  "School Fees":      { bg: "#ede9fe", color: "#7c3aed" },
  "Development Levy": { bg: "#dbeafe", color: "#2563eb" },
  "Feeding":          { bg: "#fef3c7", color: "#d97706" },
  "Uniform":          { bg: "#dcfce7", color: "#16a34a" },
  "Books":            { bg: "#fef9c3", color: "#b45309" },
  "Transport":        { bg: "#cffafe", color: "#0891b2" },
  "Other":            { bg: "#f3f4f6", color: "#6b7280" },
};

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const terms = ["All Terms", "Term 2", "Term 1"];
const methods: PaymentMethod[] = ["Cash", "Mobile Money", "Bank Transfer", "Cheque"];

export default function Payments() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,     setSelected]    = useState<Payment>(payments[0]);
  const [searchQuery,  setSearchQuery] = useState("");
  const [termFilter,   setTermFilter]  = useState("All Terms");
  const [methodFilter, setMethodFilter]= useState("All");
  const [showPanel,    setShowPanel]   = useState(false);

  const filtered = payments.filter((p) => {
    const mSearch = !searchQuery || p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
    const mTerm   = termFilter === "All Terms" || p.term === termFilter;
    const mMethod = methodFilter === "All" || p.method === methodFilter;
    return mSearch && mTerm && mMethod;
  });

  const total      = payments.reduce((s, p) => s + p.amount, 0);
  const todayTotal = payments.filter(p => p.date === "30 May 2024").reduce((s, p) => s + p.amount, 0);
  const byMoMo     = payments.filter(p => p.method === "Mobile Money").reduce((s, p) => s + p.amount, 0);
  const byCash     = payments.filter(p => p.method === "Cash").reduce((s, p) => s + p.amount, 0);

  const PaymentPanel = () => {
    const ms = methodStyle[selected.method];
    const ts = typeStyle[selected.type];
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.receiptNo}</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast("Receipt printed", "info"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>🖨️ Print</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Amount hero */}
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 14, padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.06em" }}>AMOUNT PAID</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "white", marginTop: 4 }}>{fmt(selected.amount)}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.2)", color: "white" }}>{ms.emoji} {selected.method}</span>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.2)", color: "white" }}>{selected.type}</span>
            </div>
          </div>

          {/* Student */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.studentName}</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{selected.studentId} · {selected.class} · {selected.term}</div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>TRANSACTION DETAILS</div>
            {[
              ["Date",         `${selected.date} at ${selected.time}`],
              ["Collected By", selected.collectedBy],
              ["Receipt No.",  selected.receiptNo],
              ["Term",         selected.term],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", borderLeft: "4px solid #7c3aed" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 5 }}>NOTE</div>
            <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{selected.note}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`SMS receipt sent to ${selected.studentName}'s parent`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📱 Send SMS Receipt
            </button>
            <button onClick={() => { showToast("Receipt downloaded as PDF", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Payments</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Finance","Payments"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Exporting payment report...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Download size={14} />{!isMobile && " Export"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "All Collections", value: fmt(total),      icon: "💰", bg: "#dcfce7", color: "#16a34a" },
          { label: "Today",           value: fmt(todayTotal), icon: "📅", bg: "#ede9fe", color: "#7c3aed" },
          { label: "MoMo Payments",   value: fmt(byMoMo),     icon: "📱", bg: "#dbeafe", color: "#2563eb" },
          { label: "Cash Payments",   value: fmt(byCash),     icon: "💵", bg: "#fef3c7", color: "#d97706" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Method breakdown */}
      <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Collection by Method</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(["Cash","Mobile Money","Bank Transfer","Cheque"] as PaymentMethod[]).map((method) => {
            const ms  = methodStyle[method];
            const amt = payments.filter(p => p.method === method).reduce((s, p) => s + p.amount, 0);
            return amt > 0 ? (
              <div key={method} style={{ flex: 1, minWidth: 100, background: ms.bg, borderRadius: 10, padding: "10px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{ms.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, color: ms.color, fontWeight: 600 }}>{method}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: ms.color }}>{fmt(amt)}</div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student or receipt no..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ position: "relative" }}>
          <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} style={{ appearance: "none", padding: "8px 24px 8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            {terms.map(t => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["All", ...methods].map((m) => (
            <button key={m} onClick={() => setMethodFilter(m)} style={{ padding: "5px 9px", border: `1px solid ${methodFilter===m?"#7c3aed":"#e5e7eb"}`, borderRadius: 8, background: methodFilter===m?"#7c3aed":"white", color: methodFilter===m?"white":"#374151", fontSize: 11, fontWeight: methodFilter===m?600:400, cursor: "pointer", whiteSpace: "nowrap" }}>
              {m !== "All" && methodStyle[m as PaymentMethod].emoji + " "}{m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 370px)" }}>
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 340, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} transaction{filtered.length!==1?"s":""}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#16a34a" }}>{fmt(filtered.reduce((s,p)=>s+p.amount,0))}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((pmt) => {
                const ms = methodStyle[pmt.method];
                const ts = typeStyle[pmt.type];
                const isActive = selected.id === pmt.id;
                return (
                  <div key={pmt.id} onClick={() => { setSelected(pmt); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: pmt.avatarBg, color: pmt.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{pmt.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "58%" }}>{pmt.studentName}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", flexShrink: 0 }}>{fmt(pmt.amount)}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, background: ms.bg, color: ms.color }}>{ms.emoji} {pmt.method}</span>
                        <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{pmt.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <PaymentPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <PaymentPanel />
          </div>
        </div>
      )}
    </div>
  );
}
