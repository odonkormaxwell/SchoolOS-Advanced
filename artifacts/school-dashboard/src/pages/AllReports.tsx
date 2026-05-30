import { useState } from "react";
import { Download, Search, RefreshCw, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const reportCategories = [
  {
    category: "Academic Reports",
    emoji: "📚",
    color: "#7c3aed",
    bg: "#ede9fe",
    reports: [
      { title: "Student Results Report",      description: "Term results, grades, and performance analysis by class",       icon: "📊", lastGenerated: "7 Jun 2026",  format: "PDF / Excel" },
      { title: "Attendance Summary",          description: "Daily, weekly, and monthly attendance rates by class",          icon: "📋", lastGenerated: "30 May 2026", format: "PDF / Excel" },
      { title: "Report Cards",               description: "Individual student report cards for printing",                  icon: "📄", lastGenerated: "7 Jun 2026",  format: "PDF"         },
      { title: "Exam Performance Report",    description: "Subject-by-subject exam performance and pass rates",            icon: "✍️", lastGenerated: "28 May 2026", format: "PDF"         },
      { title: "Class Progress Report",      description: "Class teacher progress notes and curriculum coverage",          icon: "📈", lastGenerated: "25 May 2026", format: "PDF"         },
    ],
  },
  {
    category: "Financial Reports",
    emoji: "💰",
    color: "#16a34a",
    bg: "#dcfce7",
    reports: [
      { title: "Fees Collection Report",     description: "Total fees collected, outstanding, and defaulter list",        icon: "💳", lastGenerated: "30 May 2026", format: "PDF / Excel" },
      { title: "Expense Report",             description: "Monthly and term expense breakdown by category",               icon: "💸", lastGenerated: "30 May 2026", format: "PDF / Excel" },
      { title: "Payroll Summary",            description: "Staff salary disbursement and deductions for the month",       icon: "👥", lastGenerated: "30 May 2026", format: "PDF"         },
      { title: "Income Statement",           description: "Profit and loss summary for the term or year",                 icon: "📈", lastGenerated: "7 Jun 2026",  format: "PDF"         },
      { title: "Budget vs Actual",           description: "Variance analysis between budgeted and actual spending",       icon: "📊", lastGenerated: "7 Jun 2026",  format: "Excel"       },
      { title: "Scholarship Register",       description: "Active scholarships, beneficiaries, and disbursement log",     icon: "🏆", lastGenerated: "15 May 2026", format: "PDF"         },
    ],
  },
  {
    category: "HR & Staff Reports",
    emoji: "👩‍🏫",
    color: "#2563eb",
    bg: "#dbeafe",
    reports: [
      { title: "Staff Attendance Report",    description: "Monthly staff attendance and punctuality summary",             icon: "📋", lastGenerated: "30 May 2026", format: "PDF"         },
      { title: "Staff Directory",            description: "Complete staff contact and profile list",                      icon: "📒", lastGenerated: "1 May 2026",  format: "PDF / Excel" },
      { title: "Payslip Export",             description: "Bulk payslip generation for all staff",                       icon: "🧾", lastGenerated: "30 May 2026", format: "PDF"         },
    ],
  },
  {
    category: "Student Reports",
    emoji: "👨‍🎓",
    color: "#d97706",
    bg: "#fef3c7",
    reports: [
      { title: "Student Enrollment Report",  description: "Class-by-class enrollment, gender split, and demographics",  icon: "🎓", lastGenerated: "1 May 2026",  format: "PDF / Excel" },
      { title: "Discipline Log Report",      description: "Incident log and disciplinary actions for the term",          icon: "⚠️", lastGenerated: "28 May 2026", format: "PDF"         },
      { title: "Health Records Summary",     description: "Screening results and health concerns by class",              icon: "🏥", lastGenerated: "20 May 2026", format: "PDF"         },
      { title: "Library Usage Report",       description: "Books issued, returned, and overdue summary",                 icon: "📚", lastGenerated: "30 May 2026", format: "PDF"         },
    ],
  },
  {
    category: "Operations Reports",
    emoji: "🔧",
    color: "#0891b2",
    bg: "#cffafe",
    reports: [
      { title: "Transport Report",           description: "Bus routes, ridership count, and maintenance log",            icon: "🚌", lastGenerated: "25 May 2026", format: "PDF"         },
      { title: "Feeding Programme Report",   description: "Meals served, daily counts, and kitchen stock summary",       icon: "🍽️", lastGenerated: "30 May 2026", format: "PDF"         },
      { title: "Inventory Report",           description: "Stock levels, low stock alerts, and restock history",         icon: "📦", lastGenerated: "28 May 2026", format: "Excel"       },
      { title: "Maintenance Log",            description: "Infrastructure maintenance requests and completed work",      icon: "🔨", lastGenerated: "20 May 2026", format: "PDF"         },
    ],
  },
  {
    category: "Communication Reports",
    emoji: "📢",
    color: "#9333ea",
    bg: "#fdf4ff",
    reports: [
      { title: "SMS Delivery Report",        description: "Message sent, delivered, and failed count by campaign",       icon: "📱", lastGenerated: "28 May 2026", format: "Excel"       },
      { title: "Notice Board Log",           description: "All notices posted, category breakdown, and reach stats",     icon: "📋", lastGenerated: "25 May 2026", format: "PDF"         },
      { title: "Event Summary Report",       description: "Events held, attendance, and outcomes for the term",          icon: "🎉", lastGenerated: "10 May 2026", format: "PDF"         },
    ],
  },
];

export default function AllReports() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("All");
  const [generating,   setGenerating]   = useState<string | null>(null);

  const totalReports = reportCategories.reduce((s, c) => s + c.reports.length, 0);

  const filteredCats = reportCategories
    .map(cat => ({
      ...cat,
      reports: cat.reports.filter(r => {
        const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "All" || cat.category === catFilter;
        return matchSearch && matchCat;
      }),
    }))
    .filter(cat => cat.reports.length > 0);

  const handleGenerate = (title: string) => {
    setGenerating(title);
    setTimeout(() => {
      setGenerating(null);
      showToast(`${title} is downloading…`, "success");
    }, 1400);
  };

  const hasResults = filteredCats.length > 0;
  const totalVisible = filteredCats.reduce((s, c) => s + c.reports.length, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Reports Hub</h1>
          {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Generate, download, and schedule reports — Happy Kids Basic School · Term 2, 2025/2026</p>}
        </div>
        <button onClick={() => showToast("Opening report scheduler…", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>
          <Download size={14} />{!isMobile && " Schedule Report"}
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total Reports",   value: String(totalReports),                   icon: "📊", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Categories",      value: String(reportCategories.length),         icon: "🗂️", bg: "#dbeafe", color: "#2563eb" },
          { label: "Generated Today", value: "3",                                     icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Last Updated",    value: "30 May 2026",                           icon: "📅", bg: "#fef3c7", color: "#d97706" },
        ].map(k => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", border: "1px solid #e5e7eb", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Generate banner */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>⚡ Quick Generate</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>Generate the most common end-of-term reports instantly</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Term Report Pack", "Fees Summary", "Payroll PDF"].map(btn => (
            <button key={btn} onClick={() => handleGenerate(btn)} style={{ padding: "7px 12px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
              {generating === btn ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span> Generating…</> : btn}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Category filter */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports by name or description…"
            style={{ width: "100%", padding: "8px 10px 8px 30px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Filter size={12} color="#9ca3af" />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["All", ...reportCategories.map(c => c.category)].map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)} style={{
                padding: "6px 10px", fontSize: isMobile ? 11 : 12, borderRadius: 7, cursor: "pointer",
                border: `1px solid ${catFilter === cat ? "#7c3aed" : "#e5e7eb"}`,
                background: catFilter === cat ? "#7c3aed" : "white",
                color: catFilter === cat ? "white" : "#374151",
                fontWeight: catFilter === cat ? 700 : 400,
                whiteSpace: "nowrap",
              }}>
                {cat === "All" ? "All" : isMobile ? cat.split(" ")[0] : cat}
              </button>
            ))}
          </div>
        </div>
        {(search || catFilter !== "All") && (
          <button onClick={() => { setSearch(""); setCatFilter("All"); }} style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", color: "#6b7280", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {(search || catFilter !== "All") && (
        <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 12 }}>
          Showing <strong style={{ color: "#111827" }}>{totalVisible}</strong> report{totalVisible !== 1 ? "s" : ""}
          {search && <> matching "<strong style={{ color: "#7c3aed" }}>{search}</strong>"</>}
          {catFilter !== "All" && <> in <strong style={{ color: "#7c3aed" }}>{catFilter}</strong></>}
        </div>
      )}

      {/* No results */}
      {!hasResults && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 4 }}>No reports found</div>
          <div style={{ fontSize: 13 }}>Try a different search term or category.</div>
        </div>
      )}

      {/* Report categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filteredCats.map(cat => (
          <div key={cat.category} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", background: cat.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.category}</div>
                  <div style={{ fontSize: 11, color: cat.color, opacity: 0.7 }}>{cat.reports.length} report{cat.reports.length !== 1 ? "s" : ""}</div>
                </div>
              </div>
              <button onClick={() => showToast(`All ${cat.category} exported`, "info")} style={{ padding: "5px 10px", border: `1px solid ${cat.color}40`, borderRadius: 8, background: "white", color: cat.color, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Export All</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 0 }}>
              {cat.reports.map((report, ri) => (
                <div key={report.title} style={{
                  display: "flex", gap: 12, padding: "12px 16px",
                  borderBottom: ri < cat.reports.length - 2 || (cat.reports.length % 2 !== 0 && ri === cat.reports.length - 2) ? "1px solid #f9fafb" : "none",
                  borderRight: !isMobile && ri % 2 === 0 && ri < cat.reports.length - 1 ? "1px solid #f9fafb" : "none",
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{report.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{report.title}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2, lineHeight: 1.4 }}>{report.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10.5, color: "#9ca3af" }}>Last: {report.lastGenerated}</span>
                        <span style={{ fontSize: 10.5, padding: "1px 6px", borderRadius: 10, background: cat.bg, color: cat.color, fontWeight: 600 }}>{report.format}</span>
                      </div>
                      <button
                        onClick={() => handleGenerate(report.title)}
                        disabled={generating === report.title}
                        style={{ padding: "4px 10px", border: "none", borderRadius: 8, background: generating === report.title ? "#f3f4f6" : cat.bg, color: generating === report.title ? "#9ca3af" : cat.color, fontSize: 11.5, fontWeight: 600, cursor: generating === report.title ? "default" : "pointer", display: "flex", gap: 4, alignItems: "center", transition: "all 0.15s" }}
                      >
                        {generating === report.title
                          ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block", fontSize: 13 }}>⟳</span> Generating…</>
                          : <><Download size={11} /> Generate</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
