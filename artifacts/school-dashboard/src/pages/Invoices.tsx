import { useState } from "react";
import { Plus, Search, ChevronDown, ChevronRight, X, Printer, Send } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Partial";

type Invoice = {
  id: number; invoiceNo: string; studentName: string; studentId: string;
  class: string; initials: string; avatarBg: string; avatarColor: string;
  amount: number; paid: number; issueDate: string; dueDate: string;
  status: InvoiceStatus; term: string;
  items: { description: string; amount: number }[];
};

const invoices: Invoice[] = [
  { id: 1,  invoiceNo: "INV-2024-0101", studentName: "Abena Yaa Darko",      studentId: "STU-2024-0019", class: "P6 - Topaz", initials: "AD", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 1850, paid: 1850, issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Paid",    term: "Term 2", items: [{ description: "School Fees",      amount: 1200 }, { description: "Development Levy", amount: 350 }, { description: "Uniform",          amount: 200 }, { description: "Books & Materials", amount: 100 }] },
  { id: 2,  invoiceNo: "INV-2024-0102", studentName: "Kwame Asante",         studentId: "STU-2024-0042", class: "JHS 2",      initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", amount: 2100, paid: 1000, issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Partial", term: "Term 2", items: [{ description: "School Fees",      amount: 1500 }, { description: "Development Levy", amount: 350 }, { description: "Feeding Levy",     amount: 150 }, { description: "Books & Materials", amount: 100 }] },
  { id: 3,  invoiceNo: "INV-2024-0103", studentName: "Emmanuel Kofi Adu",    studentId: "STU-2024-0033", class: "JHS 1",      initials: "EK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", amount: 2100, paid: 0,    issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Overdue", term: "Term 2", items: [{ description: "School Fees",      amount: 1500 }, { description: "Development Levy", amount: 350 }, { description: "Feeding Levy",     amount: 150 }, { description: "Books & Materials", amount: 100 }] },
  { id: 4,  invoiceNo: "INV-2024-0104", studentName: "Ama Serwaa Ofori",     studentId: "STU-2024-0013", class: "P5 - Ruby",  initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 1850, paid: 1850, issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Paid",    term: "Term 2", items: [{ description: "School Fees",      amount: 1200 }, { description: "Development Levy", amount: 350 }, { description: "Uniform",          amount: 200 }, { description: "Books & Materials", amount: 100 }] },
  { id: 5,  invoiceNo: "INV-2024-0105", studentName: "Daniel Lartey",        studentId: "STU-2024-0014", class: "P6 - Topaz", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", amount: 1850, paid: 1850, issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Paid",    term: "Term 2", items: [{ description: "School Fees",      amount: 1200 }, { description: "Development Levy", amount: 350 }, { description: "Uniform",          amount: 200 }, { description: "Books & Materials", amount: 100 }] },
  { id: 6,  invoiceNo: "INV-2024-0106", studentName: "Yaw Darko",            studentId: "STU-2024-0018", class: "P5 - Ruby",  initials: "YD", avatarBg: "#fef9c3", avatarColor: "#713f12", amount: 1850, paid: 900,  issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Partial", term: "Term 2", items: [{ description: "School Fees",      amount: 1200 }, { description: "Development Levy", amount: 350 }, { description: "Uniform",          amount: 200 }, { description: "Books & Materials", amount: 100 }] },
  { id: 7,  invoiceNo: "INV-2024-0107", studentName: "Adjoa Mensah",         studentId: "STU-2024-0067", class: "JHS 3",      initials: "AM", avatarBg: "#fce7f3", avatarColor: "#9d174d", amount: 2100, paid: 2100, issueDate: "1 Jan 2024",  dueDate: "15 Jan 2024", status: "Paid",    term: "Term 1", items: [{ description: "School Fees",      amount: 1500 }, { description: "Development Levy", amount: 350 }, { description: "Feeding Levy",     amount: 150 }, { description: "Books & Materials", amount: 100 }] },
  { id: 8,  invoiceNo: "INV-2024-0108", studentName: "Kofi Junior",          studentId: "STU-2024-0012", class: "P6 - Topaz", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", amount: 1850, paid: 0,    issueDate: "1 Apr 2024",  dueDate: "15 Apr 2024", status: "Pending", term: "Term 2", items: [{ description: "School Fees",      amount: 1200 }, { description: "Development Levy", amount: 350 }, { description: "Uniform",          amount: 200 }, { description: "Books & Materials", amount: 100 }] },
];

const statusStyle = (s: InvoiceStatus) => {
  if (s === "Paid")    return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
  if (s === "Pending") return { bg: "#fef3c7", color: "#d97706", border: "#fde68a" };
  if (s === "Overdue") return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
  return                      { bg: "#dbeafe", color: "#2563eb", border: "#bfdbfe" };
};

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

export default function Invoices() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,     setSelected]     = useState<Invoice>(invoices[0]);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [termFilter,   setTermFilter]   = useState("All Terms");
  const [showPanel,    setShowPanel]    = useState(false);

  const filtered = invoices.filter((inv) => {
    const mSearch = !searchQuery || inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const mStatus = statusFilter === "All" || inv.status === statusFilter;
    const mTerm   = termFilter === "All Terms" || inv.term === termFilter;
    return mSearch && mStatus && mTerm;
  });

  const totalRevenue  = invoices.reduce((s, i) => s + i.paid, 0);
  const outstanding   = invoices.reduce((s, i) => s + (i.amount - i.paid), 0);
  const paid          = invoices.filter(i => i.status === "Paid").length;
  const overdue       = invoices.filter(i => i.status === "Overdue").length;

  const InvoicePanel = () => {
    const st = statusStyle(selected.status);
    const balance = selected.amount - selected.paid;
    const pct = Math.round((selected.paid / selected.amount) * 100);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.invoiceNo}</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast("Invoice printed", "info"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, display: "flex", gap: 4, alignItems: "center", color: "#374151" }}><Printer size={12} />{!isMobile && " Print"}</button>
            <button onClick={() => { showToast(`Invoice sent to ${selected.studentName}'s parents`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "none", borderRadius: 8, background: "#7c3aed", color: "white", cursor: "pointer", fontSize: 12, display: "flex", gap: 4, alignItems: "center" }}><Send size={12} />{!isMobile && " Send"}</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Student */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.studentName}</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{selected.studentId} · {selected.class} · {selected.term}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{selected.status}</span>
          </div>

          {/* Amount summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Total",     value: fmt(selected.amount), bg: "#f3f4f6", color: "#374151" },
              { label: "Paid",      value: fmt(selected.paid),   bg: "#dcfce7", color: "#16a34a" },
              { label: "Balance",   value: fmt(balance),         bg: balance > 0 ? "#fee2e2" : "#dcfce7", color: balance > 0 ? "#dc2626" : "#16a34a" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: s.color, opacity: 0.8, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Payment progress */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Payment Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#16a34a" : "#7c3aed" }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#16a34a" : pct >= 50 ? "#7c3aed" : "#dc2626", borderRadius: 4, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Dates */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>INVOICE DATES</div>
            {[["Issue Date", selected.issueDate], ["Due Date", selected.dueDate]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Line items */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>INVOICE ITEMS</div>
            <div style={{ background: "#f9fafb", borderRadius: 10, overflow: "hidden" }}>
              {selected.items.map((item, i) => (
                <div key={item.description} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderBottom: i < selected.items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <span style={{ fontSize: 12.5, color: "#374151" }}>{item.description}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{fmt(item.amount)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#f3f4f6", borderTop: "2px solid #e5e7eb" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>TOTAL</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed" }}>{fmt(selected.amount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.status !== "Paid" && (
              <button onClick={() => { showToast(`Payment recorded for ${selected.studentName}`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                💳 Record Payment
              </button>
            )}
            {selected.status === "Overdue" && (
              <button onClick={() => { showToast(`Reminder sent for ${selected.invoiceNo}`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                🔔 Send Overdue Reminder
              </button>
            )}
            <button onClick={() => { showToast("Invoice downloaded as PDF", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
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
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Invoices</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Finance","Invoices"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Opening invoice generator...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " New Invoice"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Invoiced", value: fmt(invoices.reduce((s,i)=>s+i.amount,0)), icon: "🧾", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Collected",      value: fmt(totalRevenue),                          icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Outstanding",    value: fmt(outstanding),                           icon: "⏳", bg: "#fef3c7", color: "#d97706" },
          { label: "Overdue",        value: String(overdue) + " inv.",                  icon: "🔴", bg: "#fee2e2", color: "#dc2626" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student or invoice no..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["All","Paid","Pending","Overdue","Partial"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{ padding: "6px 10px", border: `1px solid ${statusFilter===f?"#7c3aed":"#e5e7eb"}`, borderRadius: 8, background: statusFilter===f?"#7c3aed":"white", color: statusFilter===f?"white":"#374151", fontSize: 11.5, fontWeight: statusFilter===f?600:400, cursor: "pointer" }}>{f}</button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} style={{ appearance: "none", padding: "8px 24px 8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            {["All Terms","Term 1","Term 2","Term 3"].map(t => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 310px)" }}>
        {/* Invoice list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 340, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((inv) => {
                const st = statusStyle(inv.status);
                const isActive = selected.id === inv.id;
                const pct = Math.round((inv.paid / inv.amount) * 100);
                return (
                  <div key={inv.id} onClick={() => { setSelected(inv); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : inv.status === "Overdue" ? "#fffbfb" : "white", borderLeft: `3px solid ${inv.status === "Overdue" ? "#dc2626" : "transparent"}`, transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = inv.status === "Overdue" ? "#fffbfb" : "white"; }}
                  >
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: inv.avatarBg, color: inv.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{inv.studentName}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>{inv.status}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{inv.invoiceNo} · {inv.class} · {inv.term}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{fmt(inv.amount)}</span>
                          <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>{fmt(inv.paid)} paid</span>
                        </div>
                        <div style={{ height: 3, background: "#f3f4f6", borderRadius: 2, overflow: "hidden", marginTop: 5 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#16a34a" : pct >= 50 ? "#7c3aed" : "#dc2626", borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <InvoicePanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <InvoicePanel />
          </div>
        </div>
      )}
    </div>
  );
}
