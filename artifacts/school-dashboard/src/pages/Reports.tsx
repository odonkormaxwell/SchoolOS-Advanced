import { useState } from "react";
import {
  Download, Printer, Eye, ChevronRight, BarChart2, Users, BookOpen,
  Receipt, UserCog, FileText, TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { printHTML } from "../utils/printUtils";
import { exportToCSV } from "../utils/csvExport";

const summaryCards = [
  { label: "Total Students",        value: "312",        icon: <Users size={18} />,    color: "#7c3aed", bg: "#f5f3ff" },
  { label: "Total Staff",           value: "28",         icon: <UserCog size={18} />,  color: "#2563eb", bg: "#eff6ff" },
  { label: "Attendance Rate",       value: "91.4%",      icon: <BarChart2 size={18} />,color: "#16a34a", bg: "#f0fdf4" },
  { label: "Fees Collected",        value: "GH₵ 148,000",icon: <Receipt size={18} />,  color: "#d97706", bg: "#fffbeb" },
  { label: "Outstanding Balances",  value: "GH₵ 47,850", icon: <TrendingUp size={18} />,color: "#dc2626",bg: "#fff1f2" },
  { label: "Published Results",     value: "6 classes",  icon: <BookOpen size={18} />, color: "#0891b2", bg: "#ecfeff" },
];

const reportGroups = [
  {
    id: "students",
    title: "Student Reports",
    icon: <Users size={16} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    reports: [
      { title: "Student List",       desc: "Full list of all enrolled students by class",        exportData: () => [{ Name: "Kofi Mensah", Class: "JHS 2", Status: "Active" }] },
      { title: "Admissions Report",  desc: "Application status, enrolled and pending students",  exportData: () => [{ Applicant: "Ama Owusu", Status: "Approved", Class: "P1" }] },
      { title: "Attendance Report",  desc: "Daily attendance rates per class and student",       exportData: () => [{ Student: "Kwame Asante", Rate: "94%", Absences: "3" }] },
      { title: "Class List",         desc: "Students enrolled per class with contact info",      exportData: () => [{ Class: "JHS 1", Enrolled: "32", Male: "16", Female: "16" }] },
    ],
  },
  {
    id: "academic",
    title: "Academic Reports",
    icon: <BookOpen size={16} />,
    color: "#2563eb",
    bg: "#eff6ff",
    reports: [
      { title: "Assessment Report",   desc: "Test scores, homework, and class test results",    exportData: () => [{ Student: "Abena Darko", Subject: "Maths", Score: "78" }] },
      { title: "Exam Results",        desc: "Mid-term and end-of-term exam performance",        exportData: () => [{ Student: "Yaw Boateng", Exam: "Mid-Term", Total: "82%" }] },
      { title: "Report Cards",        desc: "Individual student report cards ready for print",  exportData: () => [{ Student: "Efua Quaye", Term: "Term 2", Average: "74.5%" }] },
      { title: "Subject Performance", desc: "Average scores per subject across all classes",    exportData: () => [{ Subject: "English", Average: "68%", HighestClass: "JHS 3" }] },
    ],
  },
  {
    id: "finance",
    title: "Finance Reports",
    icon: <Receipt size={16} />,
    color: "#16a34a",
    bg: "#f0fdf4",
    reports: [
      { title: "Fee Collection Report",  desc: "Total fees collected vs target per class",    exportData: () => [{ Class: "JHS 2", Collected: "GH₵ 12,000", Outstanding: "GH₵ 2,400" }] },
      { title: "Outstanding Balances",   desc: "Students with unpaid fees and overdue amounts",exportData: () => [{ Student: "Kofi Asante", Balance: "GH₵ 320", Status: "Overdue" }] },
      { title: "Payment History",        desc: "All fee payments recorded during the term",    exportData: () => [{ Date: "2026-05-01", Student: "Ama Mensah", Amount: "GH₵ 680" }] },
      { title: "Invoice Report",         desc: "Generated invoices with status and amounts",   exportData: () => [{ Invoice: "INV-001", Student: "Kwame Darko", Amount: "GH₵ 720" }] },
    ],
  },
  {
    id: "staff",
    title: "Staff Reports",
    icon: <UserCog size={16} />,
    color: "#d97706",
    bg: "#fffbeb",
    reports: [
      { title: "Staff Directory",             desc: "Full list of all staff with roles and contacts",  exportData: () => [{ Name: "Mr. Appiah", Role: "Teacher", Subject: "Maths" }] },
      { title: "Teacher Assignment Report",   desc: "Classes and subjects assigned per teacher",       exportData: () => [{ Teacher: "Ms. Mensah", Classes: "P5, P6", Subjects: "English" }] },
    ],
  },
];

const recentReports = [
  { name: "Term 2 Student List",           category: "Students",  generatedBy: "Admin",     date: "30 May 2026", status: "Ready" },
  { name: "Fee Collection Summary",        category: "Finance",   generatedBy: "Accountant",date: "28 May 2026", status: "Ready" },
  { name: "Attendance Report — May",       category: "Students",  generatedBy: "Admin",     date: "27 May 2026", status: "Ready" },
  { name: "Mid-Term Exam Results",         category: "Academic",  generatedBy: "Admin",     date: "25 May 2026", status: "Ready" },
  { name: "Outstanding Balances",          category: "Finance",   generatedBy: "Accountant",date: "24 May 2026", status: "Ready" },
  { name: "Staff Directory",               category: "Staff",     generatedBy: "Admin",     date: "20 May 2026", status: "Ready" },
];

function ReportCard({
  title, desc, color, bg, onView, onExport, onPrint,
}: {
  title: string; desc: string; color: string; bg: string;
  onView: () => void; onExport: () => void; onPrint: () => void;
}) {
  return (
    <div style={{
      background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
      padding: 16, display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.15s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.09)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={15} color={color} />
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{title}</div>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onView} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", color: "#374151", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          <Eye size={11} /> View
        </button>
        <button onClick={onExport} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", border: `1px solid ${color}40`, borderRadius: 7, background: bg, color, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          <Download size={11} /> Export
        </button>
        <button onClick={onPrint} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", color: "#374151", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          <Printer size={11} /> Print
        </button>
      </div>
    </div>
  );
}

export default function Reports() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();
  const [yearFilter, setYearFilter] = useState("2025/2026");
  const [termFilter, setTermFilter] = useState("Term 2");
  const [classFilter, setClassFilter] = useState("All Classes");

  const filterSel: React.CSSProperties = {
    padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 8,
    fontSize: 12.5, color: "#374151", background: "white", outline: "none",
    fontFamily: "inherit", cursor: "pointer",
  };

  const handlePrintReport = (title: string) => {
    printHTML(`
      <div class="header">
        <div>
          <h1>${title}</h1>
          <div class="school">Happy Kids Basic School · Academic Year ${yearFilter} · ${termFilter}</div>
        </div>
        <div class="school">Generated: ${new Date().toLocaleDateString("en-GB")}</div>
      </div>
      <p style="color:#6b7280;font-size:13px;">Report data will appear here once fully connected to the database.</p>
    `, title);
  };

  const handleExportReport = (title: string, data: Record<string, unknown>[]) => {
    exportToCSV(title.replace(/\s+/g, "_"), data);
    showToast(`${title} exported to CSV`, "success");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Reports</h1>
          {!isMobile && (
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
              View, generate, print, and export school reports.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { exportToCSV("all_reports_summary", recentReports); showToast("Reports summary exported", "success"); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#374151" }}
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => handlePrintReport("Reports Summary")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}
          >
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", background: "white", padding: "12px 14px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
        {[
          { label: "Academic Year", value: yearFilter, onChange: setYearFilter, options: ["2023/2024", "2024/2025", "2025/2026"] },
          { label: "Term",          value: termFilter, onChange: setTermFilter, options: ["Term 1", "Term 2", "Term 3"] },
          { label: "Class",         value: classFilter, onChange: setClassFilter, options: ["All Classes", "KG 1", "KG 2", "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", "JHS 1", "JHS 2", "JHS 3"] },
        ].map((f) => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>{f.label}</span>
            <select style={filterSel} value={f.value} onChange={(e) => f.onChange(e.target.value)}>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 17, fontWeight: 800, color: "#111827" }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Report groups */}
      {reportGroups.map((group) => (
        <div key={group.id} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: group.bg, display: "flex", alignItems: "center", justifyContent: "center", color: group.color }}>
              {group.icon}
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{group.title}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
            {group.reports.map((report) => (
              <ReportCard
                key={report.title}
                title={report.title}
                desc={report.desc}
                color={group.color}
                bg={group.bg}
                onView={() => showToast(`Opening ${report.title}…`, "info")}
                onExport={() => handleExportReport(report.title, report.exportData())}
                onPrint={() => handlePrintReport(report.title)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Recent Reports Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Recent Reports</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {["Report Name", "Category", "Generated By", "Date", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r, i) => (
                <tr key={r.name} style={{ borderBottom: i < recentReports.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FileText size={14} color="#9ca3af" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 20, background: "#f3f4f6", color: "#374151", fontWeight: 500 }}>{r.category}</span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "#374151" }}>{r.generatedBy}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "#6b7280" }}>{r.date}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: "#dcfce7", color: "#16a34a" }}>{r.status}</span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => showToast(`Opening ${r.name}…`, "info")} style={{ padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#374151", fontWeight: 500 }}>View</button>
                      <button onClick={() => { exportToCSV(r.name.replace(/\s+/g, "_"), [{ Report: r.name, Date: r.date }]); showToast("Exported to CSV", "success"); }} style={{ padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
                        <Download size={11} />
                      </button>
                      <button onClick={() => handlePrintReport(r.name)} style={{ padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
                        <Printer size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
