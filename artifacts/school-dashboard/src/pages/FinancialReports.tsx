import { useState } from "react";
import { ChevronRight, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Tab = "summary" | "income" | "expenses" | "budget";

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const monthlyData = [
  { month: "Jan", income: 52400, expenses: 48200, balance: 4200 },
  { month: "Feb", income: 18200, expenses: 49100, balance: -30900 },
  { month: "Mar", income: 61800, expenses: 51200, balance: 10600 },
  { month: "Apr", income: 88500, expenses: 52400, balance: 36100 },
  { month: "May", income: 45200, expenses: 48500, balance: -3300 },
];

const incomeBreakdown = [
  { source: "School Fees",       amount: 188600, pct: 71, color: "#7c3aed", bg: "#ede9fe", emoji: "📋" },
  { source: "Development Levy", amount: 36400,  pct: 14, color: "#2563eb", bg: "#dbeafe", emoji: "🏗️" },
  { source: "Feeding Levy",      amount: 22800,  pct: 9,  color: "#16a34a", bg: "#dcfce7", emoji: "🍽️" },
  { source: "Transport Fees",    amount: 12600,  pct: 5,  color: "#0891b2", bg: "#cffafe", emoji: "🚌" },
  { source: "Other",             amount: 5700,   pct: 2,  color: "#9ca3af", bg: "#f3f4f6", emoji: "📦" },
];

const expenseBreakdown = [
  { category: "Salaries",    amount: 194000, pct: 80, color: "#7c3aed", bg: "#ede9fe", emoji: "👥" },
  { category: "Feeding",     amount: 23200,  pct: 10, color: "#d97706", bg: "#fef3c7", emoji: "🍽️" },
  { category: "Utilities",   amount: 10680,  pct: 4,  color: "#2563eb", bg: "#dbeafe", emoji: "💡" },
  { category: "Maintenance", amount: 4600,   pct: 2,  color: "#16a34a", bg: "#dcfce7", emoji: "🔧" },
  { category: "Supplies",    amount: 7880,   pct: 3,  color: "#0891b2", bg: "#cffafe", emoji: "📦" },
  { category: "Events",      amount: 1200,   pct: 1,  color: "#9333ea", bg: "#fdf4ff", emoji: "🎉" },
];

const budgetLines = [
  { item: "School Fees Collection",  budgeted: 280000, actual: 188600, variance: -91400 },
  { item: "Staff Salaries",          budgeted: 242000, actual: 194000, variance: 48000  },
  { item: "Feeding Programme",       budgeted: 29000,  actual: 23200,  variance: 5800   },
  { item: "Utilities",               budgeted: 13000,  actual: 10680,  variance: 2320   },
  { item: "Maintenance & Repairs",   budgeted: 8000,   actual: 4600,   variance: 3400   },
  { item: "Stationery & Supplies",   budgeted: 10000,  actual: 7880,   variance: 2120   },
  { item: "Events & Activities",     budgeted: 3000,   actual: 1200,   variance: 1800   },
  { item: "Transport (Fuel)",        budgeted: 12600,  actual: 12600,  variance: 0      },
];

export default function FinancialReports() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();
  const [tab, setTab] = useState<Tab>("summary");
  const [selectedPeriod, setSelectedPeriod] = useState("Jan–May 2024");

  const totalIncome   = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses, 0);
  const netBalance    = totalIncome - totalExpenses;
  const profitMargin  = Math.round((netBalance / totalIncome) * 100);
  const maxBar        = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)));

  const tabs: { key: Tab; label: string }[] = [
    { key: "summary",  label: "📊 Overview" },
    { key: "income",   label: "💰 Income" },
    { key: "expenses", label: "💸 Expenses" },
    { key: "budget",   label: "📋 Budget vs Actual" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Financial Reports</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Finance","Reports"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Financial report exported as PDF", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Download size={14} />{!isMobile && " Export PDF"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Income",   value: fmt(totalIncome),   icon: "💰", bg: "#dcfce7", color: "#16a34a", trend: "▲ 12% vs last period" },
          { label: "Total Expenses", value: fmt(totalExpenses), icon: "💸", bg: "#fee2e2", color: "#dc2626", trend: "▲ 8% vs last period"  },
          { label: "Net Balance",    value: fmt(Math.abs(netBalance)), icon: netBalance >= 0 ? "✅" : "⚠️", bg: netBalance >= 0 ? "#dcfce7" : "#fee2e2", color: netBalance >= 0 ? "#16a34a" : "#dc2626", trend: netBalance >= 0 ? "Surplus" : "Deficit" },
          { label: "Margin",         value: `${profitMargin}%`,icon: "📊", bg: "#ede9fe", color: "#7c3aed", trend: "Jan–May 2024" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{k.icon}</div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
            </div>
            <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            <div style={{ fontSize: 10.5, color: k.color, fontWeight: 600, marginTop: 2 }}>{k.trend}</div>
          </div>
        ))}
      </div>

      {/* Period selector + tabs */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "7px 12px", border: "none", borderRadius: 8, background: tab===t.key?"linear-gradient(135deg,#7c3aed,#6d28d9)":"#f3f4f6", color: tab===t.key?"white":"#374151", fontSize: 12, fontWeight: tab===t.key?600:400, cursor: "pointer", whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>
        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
          {["Jan–May 2024","Term 2 2024","Term 1 2024","Full Year 2023"].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Summary tab */}
      {tab === "summary" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Monthly bar chart */}
          <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Monthly Income vs Expenses</div>
            <div style={{ display: "flex", gap: isMobile ? 8 : 16, alignItems: "flex-end", height: 160 }}>
              {monthlyData.map((m) => {
                const incPct = Math.round((m.income / maxBar) * 130);
                const expPct = Math.round((m.expenses / maxBar) * 130);
                return (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 130 }}>
                      <div title={`Income: ${fmt(m.income)}`} style={{ width: isMobile ? 12 : 18, height: incPct, background: "linear-gradient(180deg,#7c3aed,#6d28d9)", borderRadius: "4px 4px 0 0", cursor: "pointer", transition: "opacity 0.15s" }} onMouseEnter={(e)=>(e.currentTarget as HTMLElement).style.opacity="0.8"} onMouseLeave={(e)=>(e.currentTarget as HTMLElement).style.opacity="1"} />
                      <div title={`Expenses: ${fmt(m.expenses)}`} style={{ width: isMobile ? 12 : 18, height: expPct, background: "linear-gradient(180deg,#dc2626,#b91c1c)", borderRadius: "4px 4px 0 0", cursor: "pointer", transition: "opacity 0.15s" }} onMouseEnter={(e)=>(e.currentTarget as HTMLElement).style.opacity="0.8"} onMouseLeave={(e)=>(e.currentTarget as HTMLElement).style.opacity="1"} />
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{m.month}</div>
                    <div style={{ fontSize: 10, color: m.balance >= 0 ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{m.balance >= 0 ? "+" : ""}{m.balance >= 0 ? fmt(m.balance).replace("GH₵ ","") : "-"+fmt(Math.abs(m.balance)).replace("GH₵ ","")}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#7c3aed" }} /><span style={{ fontSize: 11, color: "#6b7280" }}>Income</span></div>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#dc2626" }} /><span style={{ fontSize: 11, color: "#6b7280" }}>Expenses</span></div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            {/* Income summary */}
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Income Sources</div>
              {incomeBreakdown.slice(0, 4).map((src) => (
                <div key={src.source} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{src.emoji} {src.source}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{fmt(src.amount)}</span>
                  </div>
                  <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3 }}>
                    <div style={{ width: `${src.pct}%`, height: "100%", background: src.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Expense summary */}
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Top Expenses</div>
              {expenseBreakdown.slice(0, 4).map((exp) => (
                <div key={exp.category} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{exp.emoji} {exp.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#dc2626" }}>{fmt(exp.amount)}</span>
                  </div>
                  <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3 }}>
                    <div style={{ width: `${exp.pct}%`, height: "100%", background: exp.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Income tab */}
      {tab === "income" && (
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Income Breakdown — {selectedPeriod}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>{fmt(totalIncome)} total</span>
          </div>
          {incomeBreakdown.map((src, i) => (
            <div key={src.source} style={{ padding: "14px 16px", borderBottom: i < incomeBreakdown.length - 1 ? "1px solid #f9fafb" : "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: src.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{src.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{src.source}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{fmt(src.amount)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{src.pct}% of total income</span>
                    <TrendingUp size={12} color="#16a34a" />
                  </div>
                </div>
              </div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3 }}>
                <div style={{ width: `${src.pct}%`, height: "100%", background: src.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expenses tab */}
      {tab === "expenses" && (
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Expense Breakdown — {selectedPeriod}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#dc2626" }}>{fmt(totalExpenses)} total</span>
          </div>
          {expenseBreakdown.map((exp, i) => (
            <div key={exp.category} style={{ padding: "14px 16px", borderBottom: i < expenseBreakdown.length - 1 ? "1px solid #f9fafb" : "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: exp.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{exp.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{exp.category}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#dc2626" }}>{fmt(exp.amount)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{exp.pct}% of total expenses</span>
                    <TrendingDown size={12} color="#dc2626" />
                  </div>
                </div>
              </div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3 }}>
                <div style={{ width: `${exp.pct}%`, height: "100%", background: exp.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget vs Actual tab */}
      {tab === "budget" && (
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Budget vs Actual — {selectedPeriod}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 560 : "auto" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Line Item","Budgeted","Actual","Variance","Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: h==="Line Item"?"left":"right", fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", borderBottom: "1px solid #f3f4f6" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgetLines.map((line, i) => {
                  const isIncome   = line.item.includes("Collection") || line.item.includes("Fees");
                  const favorable  = isIncome ? line.variance >= 0 : line.variance >= 0;
                  const varColor   = favorable ? "#16a34a" : "#dc2626";
                  const varBg      = favorable ? "#dcfce7" : "#fee2e2";
                  const pct        = Math.round((line.actual / line.budgeted) * 100);
                  return (
                    <tr key={line.item} style={{ borderBottom: i < budgetLines.length - 1 ? "1px solid #f9fafb" : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{line.item}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#9ca3af", textAlign: "right" }}>{fmt(line.budgeted)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#111827", fontWeight: 700, textAlign: "right" }}>{fmt(line.actual)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: varColor, textAlign: "right" }}>{line.variance >= 0 ? "+" : ""}{fmt(line.variance)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: varBg, color: varColor }}>{pct}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => showToast("Budget report exported", "info")} style={{ padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📄 Export Budget Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
