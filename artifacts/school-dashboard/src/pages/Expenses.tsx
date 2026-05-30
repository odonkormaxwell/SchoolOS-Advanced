import { useState } from "react";
import { Plus, Search, ChevronRight, ChevronDown, X, TrendingDown, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type ExpenseCategory = "Salaries" | "Utilities" | "Supplies" | "Maintenance" | "Transport" | "Feeding" | "Events" | "Other";
type ExpenseStatus = "Approved" | "Pending" | "Rejected";

type Expense = {
  id: number; description: string; category: ExpenseCategory; amount: number;
  date: string; month: string; approvedBy: string; receipt: boolean;
  status: ExpenseStatus; vendor: string; notes: string;
};

const expenses: Expense[] = [
  { id: 1,  description: "May Staff Salaries",          category: "Salaries",    amount: 48500, date: "30 May 2024", month: "May 2024", approvedBy: "Mr. E. Mensah", receipt: true,  status: "Approved", vendor: "Payroll",            notes: "Monthly salary disbursement for all 13 staff members." },
  { id: 2,  description: "Electricity Bill — May",      category: "Utilities",   amount: 1240,  date: "28 May 2024", month: "May 2024", approvedBy: "Mr. S. Darko",  receipt: true,  status: "Approved", vendor: "ECG Ghana",          notes: "Monthly electricity bill for all school blocks." },
  { id: 3,  description: "Classroom Chairs & Desks (20)", category: "Supplies",  amount: 3600,  date: "25 May 2024", month: "May 2024", approvedBy: "Mr. E. Mensah", receipt: true,  status: "Approved", vendor: "Accra Furniture Co", notes: "20 student desks and chairs for the new P3 classroom." },
  { id: 4,  description: "Borehole Pump Repair",        category: "Maintenance", amount: 850,   date: "22 May 2024", month: "May 2024", approvedBy: "Mr. E. Mensah", receipt: true,  status: "Approved", vendor: "AquaServe Ltd",      notes: "Replacement of broken pump motor and pipes." },
  { id: 5,  description: "Sports Day Trophies & Medals",category: "Events",      amount: 1200,  date: "20 May 2024", month: "May 2024", approvedBy: "Mr. E. Mensah", receipt: false, status: "Pending",  vendor: "Trophy World GH",    notes: "Awards for top 3 finishers in each event category." },
  { id: 6,  description: "School Bus Fuel — May",       category: "Transport",   amount: 2100,  date: "18 May 2024", month: "May 2024", approvedBy: "Mr. S. Darko",  receipt: true,  status: "Approved", vendor: "Shell Ghana",        notes: "Monthly fuel allocation for 2 school buses." },
  { id: 7,  description: "Feeding Programme Supplies",  category: "Feeding",     amount: 5800,  date: "15 May 2024", month: "May 2024", approvedBy: "Mr. E. Mensah", receipt: true,  status: "Approved", vendor: "Kofi's Foodstuff",   notes: "Monthly food supplies including rice, oil, and vegetables for 340 students." },
  { id: 8,  description: "Printer Ink & Paper",         category: "Supplies",    amount: 320,   date: "12 May 2024", month: "May 2024", approvedBy: "Mrs. A. Aidoo", receipt: true,  status: "Approved", vendor: "Office World GH",    notes: "Ink cartridges and A4 paper for admin office." },
  { id: 9,  description: "Water Bill — May",            category: "Utilities",   amount: 380,   date: "10 May 2024", month: "May 2024", approvedBy: "Mr. S. Darko",  receipt: true,  status: "Approved", vendor: "GWCL",               notes: "Monthly water bill." },
  { id: 10, description: "Classroom Paint & Supplies",  category: "Maintenance", amount: 1450,  date: "8 May 2024",  month: "May 2024", approvedBy: "Mr. E. Mensah", receipt: false, status: "Rejected", vendor: "Paint Masters GH",   notes: "Request rejected — deferred to Term 3 budget." },
  { id: 11, description: "Internet Subscription",       category: "Utilities",   amount: 550,   date: "1 May 2024",  month: "May 2024", approvedBy: "Mr. S. Darko",  receipt: true,  status: "Approved", vendor: "MTN Business",       notes: "Monthly broadband internet for ICT lab and admin." },
  { id: 12, description: "April Staff Salaries",        category: "Salaries",    amount: 48500, date: "30 Apr 2024", month: "Apr 2024", approvedBy: "Mr. E. Mensah", receipt: true,  status: "Approved", vendor: "Payroll",            notes: "Monthly salary disbursement." },
];

const catStyle: Record<ExpenseCategory, { color: string; bg: string; emoji: string }> = {
  Salaries:    { color: "#7c3aed", bg: "#ede9fe", emoji: "👥" },
  Utilities:   { color: "#2563eb", bg: "#dbeafe", emoji: "💡" },
  Supplies:    { color: "#16a34a", bg: "#dcfce7", emoji: "📦" },
  Maintenance: { color: "#d97706", bg: "#fef3c7", emoji: "🔧" },
  Transport:   { color: "#0891b2", bg: "#cffafe", emoji: "🚌" },
  Feeding:     { color: "#b45309", bg: "#fef3c7", emoji: "🍽️" },
  Events:      { color: "#9333ea", bg: "#fdf4ff", emoji: "🎉" },
  Other:       { color: "#6b7280", bg: "#f3f4f6", emoji: "📋" },
};

const statusStyle = (s: ExpenseStatus) => {
  if (s === "Approved") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Pending")  return { bg: "#fef3c7", color: "#d97706" };
  return                       { bg: "#fee2e2", color: "#dc2626" };
};

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const months = ["All Months", "May 2024", "Apr 2024", "Mar 2024"];
const categories: ExpenseCategory[] = ["Salaries","Utilities","Supplies","Maintenance","Transport","Feeding","Events","Other"];

const monthlyBudget = 70000;

export default function Expenses() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<Expense>(expenses[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("May 2024");
  const [catFilter,   setCatFilter]   = useState("All");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  const filtered = expenses.filter((e) => {
    const mSearch = !searchQuery || e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const mMonth  = monthFilter === "All Months" || e.month === monthFilter;
    const mCat    = catFilter === "All" || e.category === catFilter;
    return mSearch && mMonth && mCat;
  });

  const mayExpenses = expenses.filter(e => e.month === "May 2024");
  const totalSpent  = mayExpenses.filter(e => e.status === "Approved").reduce((s, e) => s + e.amount, 0);
  const pending     = mayExpenses.filter(e => e.status === "Pending").reduce((s, e) => s + e.amount, 0);
  const budgetLeft  = monthlyBudget - totalSpent;

  // Category breakdown for May
  const catBreakdown = categories.map((cat) => {
    const catTotal = mayExpenses.filter(e => e.category === cat && e.status === "Approved").reduce((s, e) => s + e.amount, 0);
    return { cat, total: catTotal, pct: Math.round((catTotal / totalSpent) * 100) };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const ExpensePanel = () => {
    const cs = catStyle[selected.category];
    const st = statusStyle(selected.status);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Expense Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            {selected.status === "Pending" && (
              <button onClick={() => { showToast(`Expense approved: ${selected.description}`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "#dcfce7", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#16a34a" }}>Approve</button>
            )}
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Banner */}
          <div style={{ background: cs.bg, borderRadius: 12, padding: "16px", display: "flex", gap: 14, alignItems: "center", border: `1px solid ${cs.color}20` }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{cs.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{selected.description}</div>
              <div style={{ fontSize: 12, color: cs.color, fontWeight: 600, marginTop: 3 }}>{selected.category}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color }}>{selected.status}</span>
          </div>

          {/* Amount highlight */}
          <div style={{ textAlign: "center", background: "#f9fafb", borderRadius: 12, padding: "16px" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>AMOUNT</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#111827" }}>{fmt(selected.amount)}</div>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>DETAILS</div>
            {[
              ["Date",        selected.date],
              ["Vendor",      selected.vendor],
              ["Approved By", selected.approvedBy],
              ["Receipt",     selected.receipt ? "✅ Attached" : "❌ Not attached"],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>NOTES</div>
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", fontSize: 12.5, color: "#374151", lineHeight: 1.7 }}>{selected.notes}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast("Expense report downloaded", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📄 Download Receipt</button>
            {selected.status === "Approved" && (
              <button onClick={() => { showToast("Expense marked for audit", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>🔍 Flag for Audit</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Expenses</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Finance","Expenses"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Add Expense"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "May Budget",    value: fmt(monthlyBudget), icon: "📊", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Spent (Approved)", value: fmt(totalSpent), icon: "💸", bg: "#fee2e2", color: "#dc2626" },
          { label: "Pending",       value: fmt(pending),       icon: "⏳", bg: "#fef3c7", color: "#d97706" },
          { label: "Budget Left",   value: fmt(budgetLeft),    icon: budgetLeft > 0 ? "✅" : "⚠️", bg: budgetLeft > 0 ? "#dcfce7" : "#fee2e2", color: budgetLeft > 0 ? "#16a34a" : "#dc2626" },
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

      {/* Budget progress */}
      <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>May 2024 Budget Utilisation</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: totalSpent / monthlyBudget > 0.9 ? "#dc2626" : "#7c3aed" }}>{Math.round((totalSpent / monthlyBudget) * 100)}%</span>
        </div>
        <div style={{ height: 10, background: "#f3f4f6", borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ width: `${Math.min(100, Math.round((totalSpent / monthlyBudget) * 100))}%`, height: "100%", background: totalSpent / monthlyBudget > 0.9 ? "#dc2626" : "linear-gradient(90deg,#7c3aed,#6d28d9)", borderRadius: 5 }} />
        </div>
        {/* Category breakdown */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {catBreakdown.slice(0, 5).map((c) => {
            const cs = catStyle[c.cat];
            return (
              <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11 }}>{cs.emoji}</span>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{c.cat}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: cs.color }}>{fmt(c.total)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search description or vendor..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ position: "relative" }}>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} style={{ appearance: "none", padding: "8px 24px 8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["All", ...categories.slice(0, isMobile ? 3 : 8)].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "5px 9px", border: `1px solid ${catFilter===c?"#7c3aed":"#e5e7eb"}`, borderRadius: 8, background: catFilter===c?"#7c3aed":"white", color: catFilter===c?"white":"#374151", fontSize: 11, fontWeight: catFilter===c?600:400, cursor: "pointer" }}>
              {c !== "All" && catStyle[c as ExpenseCategory].emoji + " "}{c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 370px)" }}>
        {/* List */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 340, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} expense{filtered.length!==1?"s":""}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#7c3aed" }}>{fmt(filtered.filter(e=>e.status==="Approved").reduce((s,e)=>s+e.amount,0))}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((exp) => {
                const cs = catStyle[exp.category];
                const st = statusStyle(exp.status);
                const isActive = selected.id === exp.id;
                return (
                  <div key={exp.id} onClick={() => { setSelected(exp); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 12, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: cs.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{cs.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{exp.description}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: cs.color, flexShrink: 0 }}>{fmt(exp.amount)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{exp.vendor} · {exp.date.split(" ").slice(0,3).join(" ")}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: st.bg, color: st.color }}>{exp.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <ExpensePanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <ExpensePanel />
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Add Expense</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Description","text","e.g. Monthly electricity bill"],["Vendor","text","e.g. ECG Ghana"]].map(([l,t,p]) => (
                <div key={l as string}><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l}</label><input type={t as string} placeholder={p as string} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Amount (GH₵)</label><input type="number" placeholder="0.00" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Date</label><input type="date" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
              </div>
              <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Category</label>
                <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => { showToast("Expense submitted for approval", "success"); setShowForm(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Submit Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
