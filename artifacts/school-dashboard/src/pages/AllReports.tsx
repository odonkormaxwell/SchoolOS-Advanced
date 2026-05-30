import { ChevronRight, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type ReportCard = {
  title: string; description: string; icon: string;
  category: string; bg: string; color: string;
  lastGenerated: string; format: string;
  action: string;
};

const reportCategories = [
  {
    category: "Academic Reports",
    emoji: "📚",
    color: "#7c3aed",
    bg: "#ede9fe",
    reports: [
      { title: "Student Results Report",      description: "Term results, grades, and performance analysis by class",       icon: "📊", lastGenerated: "7 Jun 2024",  format: "PDF / Excel" },
      { title: "Attendance Summary",          description: "Daily, weekly, and monthly attendance rates by class",          icon: "📋", lastGenerated: "30 May 2024", format: "PDF / Excel" },
      { title: "Report Cards",               description: "Individual student report cards for printing",                  icon: "📄", lastGenerated: "7 Jun 2024",  format: "PDF"         },
      { title: "Exam Performance Report",    description: "Subject-by-subject exam performance and pass rates",            icon: "✍️", lastGenerated: "28 May 2024", format: "PDF"         },
      { title: "Class Progress Report",      description: "Class teacher progress notes and curriculum coverage",          icon: "📈", lastGenerated: "25 May 2024", format: "PDF"         },
    ],
  },
  {
    category: "Financial Reports",
    emoji: "💰",
    color: "#16a34a",
    bg: "#dcfce7",
    reports: [
      { title: "Fees Collection Report",     description: "Total fees collected, outstanding, and defaulter list",        icon: "💳", lastGenerated: "30 May 2024", format: "PDF / Excel" },
      { title: "Expense Report",             description: "Monthly and term expense breakdown by category",               icon: "💸", lastGenerated: "30 May 2024", format: "PDF / Excel" },
      { title: "Payroll Summary",            description: "Staff salary disbursement and deductions for the month",       icon: "👥", lastGenerated: "30 May 2024", format: "PDF"         },
      { title: "Income Statement",           description: "Profit and loss summary for the term or year",                 icon: "📈", lastGenerated: "7 Jun 2024",  format: "PDF"         },
      { title: "Budget vs Actual",           description: "Variance analysis between budgeted and actual spending",       icon: "📊", lastGenerated: "7 Jun 2024",  format: "Excel"       },
      { title: "Scholarship Register",       description: "Active scholarships, beneficiaries, and disbursement log",     icon: "🏆", lastGenerated: "15 May 2024", format: "PDF"         },
    ],
  },
  {
    category: "HR & Staff Reports",
    emoji: "👩‍🏫",
    color: "#2563eb",
    bg: "#dbeafe",
    reports: [
      { title: "Staff Attendance Report",    description: "Monthly staff attendance and punctuality summary",             icon: "📋", lastGenerated: "30 May 2024", format: "PDF"         },
      { title: "Staff Directory",            description: "Complete staff contact and profile list",                      icon: "📒", lastGenerated: "1 May 2024",  format: "PDF / Excel" },
      { title: "Payslip Export",             description: "Bulk payslip generation for all staff",                       icon: "🧾", lastGenerated: "30 May 2024", format: "PDF"         },
    ],
  },
  {
    category: "Student Reports",
    emoji: "👨‍🎓",
    color: "#d97706",
    bg: "#fef3c7",
    reports: [
      { title: "Student Enrollment Report",  description: "Class-by-class enrollment, gender split, and demographics",  icon: "🎓", lastGenerated: "1 May 2024",  format: "PDF / Excel" },
      { title: "Discipline Log Report",      description: "Incident log and disciplinary actions for the term",          icon: "⚠️", lastGenerated: "28 May 2024", format: "PDF"         },
      { title: "Health Records Summary",     description: "Screening results and health concerns by class",              icon: "🏥", lastGenerated: "20 May 2024", format: "PDF"         },
      { title: "Library Usage Report",       description: "Books issued, returned, and overdue summary",                 icon: "📚", lastGenerated: "30 May 2024", format: "PDF"         },
    ],
  },
  {
    category: "Operations Reports",
    emoji: "🔧",
    color: "#0891b2",
    bg: "#cffafe",
    reports: [
      { title: "Transport Report",           description: "Bus routes, ridership count, and maintenance log",            icon: "🚌", lastGenerated: "25 May 2024", format: "PDF"         },
      { title: "Feeding Programme Report",   description: "Meals served, daily counts, and kitchen stock summary",       icon: "🍽️", lastGenerated: "30 May 2024", format: "PDF"         },
      { title: "Inventory Report",           description: "Stock levels, low stock alerts, and restock history",         icon: "📦", lastGenerated: "28 May 2024", format: "Excel"       },
      { title: "Maintenance Log",            description: "Infrastructure maintenance requests and completed work",      icon: "🔨", lastGenerated: "20 May 2024", format: "PDF"         },
    ],
  },
  {
    category: "Communication Reports",
    emoji: "📢",
    color: "#9333ea",
    bg: "#fdf4ff",
    reports: [
      { title: "SMS Delivery Report",        description: "Message sent, delivered, and failed count by campaign",       icon: "📱", lastGenerated: "28 May 2024", format: "Excel"       },
      { title: "Notice Board Log",           description: "All notices posted, category breakdown, and reach stats",     icon: "📋", lastGenerated: "25 May 2024", format: "PDF"         },
      { title: "Event Summary Report",       description: "Events held, attendance, and outcomes for the term",          icon: "🎉", lastGenerated: "10 May 2024", format: "PDF"         },
    ],
  },
];

export default function AllReports() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const totalReports = reportCategories.reduce((s, c) => s + c.reports.length, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>All Reports</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Reports Hub"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Opening report scheduler...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Download size={14} />{!isMobile && " Schedule Report"}
        </button>
      </div>

      {/* Summary KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Reports",    value: String(totalReports),                           icon: "📊", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Categories",       value: String(reportCategories.length),                icon: "🗂️", bg: "#dbeafe", color: "#2563eb" },
          { label: "Generated Today",  value: "3",                                            icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Last Updated",     value: "30 May 2024",                                  icon: "📅", bg: "#fef3c7", color: "#d97706" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Generate bar */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>⚡ Quick Generate</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>Generate the most common end-of-term reports instantly</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Term Report Pack","Fees Summary","Payroll PDF"].map((btn) => (
            <button key={btn} onClick={() => showToast(`${btn} generated!`, "success")} style={{ padding: "7px 12px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{btn}</button>
          ))}
        </div>
      </div>

      {/* Report categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reportCategories.map((cat) => (
          <div key={cat.category} style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", background: cat.bg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.category}</div>
                  <div style={{ fontSize: 11, color: cat.color, opacity: 0.7 }}>{cat.reports.length} reports</div>
                </div>
              </div>
              <button onClick={() => showToast(`All ${cat.category} exported`, "info")} style={{ padding: "5px 10px", border: `1px solid ${cat.color}40`, borderRadius: 8, background: "white", color: cat.color, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Export All</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 0 }}>
              {cat.reports.map((report, ri) => (
                <div key={report.title} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: ri < cat.reports.length - 1 || (ri === cat.reports.length - 1 && cat.reports.length % 2 === 0) ? "1px solid #f9fafb" : "none", borderRight: !isMobile && ri % 2 === 0 && ri < cat.reports.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{report.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{report.title}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2, lineHeight: 1.4 }}>{report.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10.5, color: "#9ca3af" }}>Last: {report.lastGenerated}</span>
                        <span style={{ fontSize: 10.5, padding: "1px 6px", borderRadius: 10, background: cat.bg, color: cat.color, fontWeight: 600 }}>{report.format}</span>
                      </div>
                      <button onClick={() => showToast(`${report.title} is downloading...`, "info")} style={{ padding: "4px 10px", border: "none", borderRadius: 8, background: cat.bg, color: cat.color, fontSize: 11.5, fontWeight: 600, cursor: "pointer", display: "flex", gap: 4, alignItems: "center" }}>
                        <Download size={11} /> Generate
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
