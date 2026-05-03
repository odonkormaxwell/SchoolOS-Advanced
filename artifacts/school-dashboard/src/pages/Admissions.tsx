import { useState } from "react";
import {
  Upload, FileText, Plus, Search, ChevronDown, Filter, RotateCcw,
  Eye, MoreVertical, ChevronLeft, ChevronRight, X, Check, Clock,
  XCircle, UserPlus, Calendar, CheckCircle, AlertCircle, FileCheck,
} from "lucide-react";

const kpiCards = [
  { label: "Total Applications", value: "126", sub: "This Term", icon: "📋", iconBg: "#e0e7ff", color: "#4f46e5" },
  { label: "Approved", value: "32", sub: "25.4%", icon: "✅", iconBg: "#dcfce7", color: "#16a34a" },
  { label: "Under Review", value: "58", sub: "46.0%", icon: "⏳", iconBg: "#fef3c7", color: "#d97706" },
  { label: "Declined", value: "18", sub: "14.3%", icon: "❌", iconBg: "#fee2e2", color: "#dc2626" },
  { label: "Enrolled", value: "18", sub: "14.3%", icon: "👥", iconBg: "#dbeafe", color: "#2563eb" },
  { label: "On Waitlist", value: "12", sub: "9.5%", icon: "🕐", iconBg: "#f3e8ff", color: "#7c3aed" },
];

const applicants = [
  { id: 1, name: "Kofi Junior Asante", gender: "Male", age: 5, appNo: "HKB-ADM-2024-0126", class: "P1 - 2024/2025", date: "14 May 2024", time: "10:24 AM", status: "Under Review", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", eligibility: 92 },
  { id: 2, name: "Ama Serwaa Ofori", gender: "Female", age: 4, appNo: "HKB-ADM-2024-0125", class: "KG - 2024/2025", date: "14 May 2024", time: "09:15 AM", status: "Approved", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", eligibility: 88 },
  { id: 3, name: "Daniel Nii Lartey", gender: "Male", age: 6, appNo: "HKB-ADM-2024-0124", class: "P2 - 2024/2025", date: "13 May 2024", time: "02:45 PM", status: "Under Review", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", eligibility: 75 },
  { id: 4, name: "Akosua Adwoa Mensah", gender: "Female", age: 5, appNo: "HKB-ADM-2024-0123", class: "P1 - 2024/2025", date: "13 May 2024", time: "11:30 AM", status: "Approved", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d", eligibility: 90 },
  { id: 5, name: "Yaw Antwi Boakye", gender: "Male", age: 7, appNo: "HKB-ADM-2024-0122", class: "P3 - 2024/2025", date: "12 May 2024", time: "04:10 PM", status: "Under Review", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", eligibility: 70 },
  { id: 6, name: "Efua Korkor Lamptey", gender: "Female", age: 4, appNo: "HKB-ADM-2024-0121", class: "KG - 2024/2025", date: "12 May 2024", time: "10:05 AM", status: "Declined", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d", eligibility: 45 },
  { id: 7, name: "Michael Kojo Addo", gender: "Male", age: 6, appNo: "HKB-ADM-2024-0120", class: "P1 - 2024/2025", date: "11 May 2024", time: "03:25 PM", status: "Declined", initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", eligibility: 40 },
];

const statusStyle = (s: string) => {
  if (s === "Approved") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Declined") return { bg: "#fee2e2", color: "#dc2626" };
  return { bg: "#fef3c7", color: "#d97706" };
};

const eligibilityStyle = (score: number) => {
  if (score >= 80) return { bg: "#dcfce7", color: "#16a34a", label: "Excellent" };
  if (score >= 70) return { bg: "#dbeafe", color: "#2563eb", label: "Good" };
  if (score >= 50) return { bg: "#fef3c7", color: "#d97706", label: "Average" };
  return { bg: "#fee2e2", color: "#dc2626", label: "Average" };
};

export default function Admissions() {
  const [selected, setSelected] = useState(applicants[0]);
  const [selectedRows, setSelectedRows] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ["Overview", "Documents", "Family Info", "History"];

  const documents = [
    { name: "Birth Certificate", status: "Uploaded" },
    { name: "Passport Photograph", status: "Uploaded" },
    { name: "Previous School Report", status: "Uploaded" },
    { name: "Immunization Card", status: "Uploaded" },
    { name: "Proof of Residence", status: "Pending" },
  ];

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Admissions</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Admissions", "All Applications"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Upload size={13} color="#6b7280" /> Import Applications
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <FileText size={13} color="#6b7280" /> Generate Report
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={14} /> New Application
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{k.icon}</div>
              <div style={{ fontSize: 10.5, color: "#6b7280", marginBottom: 4, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: k.color, fontWeight: 600, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Admission Funnel */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Admission Funnel</span>
              <AlertCircle size={13} color="#9ca3af" />
            </div>
            <button style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>View Funnel Report</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {[
              { label: "Application", value: 126, icon: "📋" },
              { label: "Review", value: 58, icon: "🔍" },
              { label: "Interview", value: 34, icon: "👥" },
              { label: "Approved", value: 32, icon: "✅" },
              { label: "Enrolled", value: 18, icon: "🎓" },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 1 }}>{step.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{step.value}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", color: "#d1d5db" }}>
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: "14.3%", height: "100%", background: "linear-gradient(90deg,#7c3aed,#4f46e5)", borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 5 }}>
            Conversion Rate: <span style={{ color: "#16a34a", fontWeight: 600 }}>14.3%</span> (18 of 126 applications enrolled)
          </div>
        </div>

        {/* Filter + Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          {/* Filter bar */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input placeholder="Search by name, application no., phone..." style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa" }} />
            </div>
            {[{ label: "Class Applied For", opts: ["All Classes", "KG", "P1", "P2", "P3"] }, { label: "Status", opts: ["All Status", "Under Review", "Approved", "Declined"] }].map(({ label, opts }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>{label}</span>
                <div style={{ position: "relative" }}>
                  <select style={{ appearance: "none", padding: "6px 24px 6px 9px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                    {opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Date Range</span>
              <button style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Calendar size={13} color="#6b7280" />
              </button>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Filter size={12} color="#6b7280" /> Filter
            </button>
            <button style={{ fontSize: 12.5, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>Reset</button>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                <th style={{ padding: "10px 16px", width: 36 }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></th>
                {["APPLICANT", "APPLICATION NO.", "CLASS APPLIED FOR", "DATE APPLIED", "STATUS", "ELIGIBILITY SCORE", "ACTIONS"].map((c) => (
                  <th key={c} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applicants.map((a, idx) => {
                const st = statusStyle(a.status);
                const el = eligibilityStyle(a.eligibility);
                const isActive = selected.id === a.id;
                return (
                  <tr key={a.id} onClick={() => setSelected(a)}
                    style={{ borderBottom: idx < applicants.length - 1 ? "1px solid #f9fafb" : "none", background: isActive ? "#faf5ff" : "white", cursor: "pointer" }}>
                    <td style={{ padding: "10px 16px" }}><input type="checkbox" checked={selectedRows.includes(a.id)} onChange={() => {}} style={{ accentColor: "#7c3aed" }} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: a.avatarBg, color: a.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{a.initials}</div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{a.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.gender} • {a.age} years</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>{a.appNo}</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 12, color: "#374151" }}>{a.class}</span></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: "#374151" }}>{a.date}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.time}</div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{a.status}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ position: "relative", width: 36, height: 36 }}>
                          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 36, height: 36 }}>
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke={el.color} strokeWidth="4" strokeDasharray={`${(a.eligibility / 100) * 88} 88`} />
                          </svg>
                          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 9, fontWeight: 700, color: el.color }}>{a.eligibility}%</span>
                        </div>
                        <span style={{ fontSize: 11, color: el.color, fontWeight: 600 }}>{el.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 5, display: "flex" }}><Eye size={14} /></button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 5, display: "flex" }}><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to 7 of <strong style={{ color: "#374151" }}>126</strong> applications</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12, fontWeight: currentPage === p ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
              ))}
              <span style={{ padding: "0 4px", color: "#9ca3af" }}>…</span>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>18</button>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Applicant Details */}
      <div style={{ width: 280, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Applicant Details</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={14} /></button>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>Application No. {selected.appNo}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Applied on {selected.date}, {selected.time}</div>
              <span style={{ display: "inline-block", marginTop: 4, fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: statusStyle(selected.status).bg, color: statusStyle(selected.status).color }}>{selected.status}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 14px" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "10px 8px", fontSize: 11.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "#7c3aed" : "#9ca3af", background: "none", border: "none", borderBottom: activeTab === t ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "14px", flex: 1, overflowY: "auto" }}>
          {/* Eligibility + Application Summary */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
            <div style={{ position: "relative", width: 64, height: 64 }}>
              <svg viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)", width: 64, height: 64 }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#7c3aed" strokeWidth="6" strokeDasharray={`${(selected.eligibility / 100) * 163} 163`} />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.eligibility}%</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10 }}>🤖</span> AI Score
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: eligibilityStyle(selected.eligibility).color }}>
                {eligibilityStyle(selected.eligibility).label} Fit
              </div>
              <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>Strong academic and behavioural fit for the selected class.</div>
            </div>
          </div>

          {/* Application Summary */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Application Summary</div>
            {[
              ["Class Applied For", selected.class],
              ["Preferred Start Date", "2nd September 2024"],
              ["Campus", "Main Campus"],
              ["Session", "2024/2025"],
              ["Status", selected.status],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Personal Information</div>
            {[
              ["Date of Birth", "15 Mar 2019 (5 years)"],
              ["Gender", selected.gender],
              ["Nationality", "Ghanaian"],
              ["Religion", "Christian"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Documents Checklist */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Documents Checklist</div>
            {documents.map((d) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={12} color="#7c3aed" />
                  <span style={{ fontSize: 11.5, color: "#374151" }}>{d.name}</span>
                </div>
                {d.status === "Uploaded" ? (
                  <CheckCircle size={14} color="#16a34a" />
                ) : (
                  <span style={{ fontSize: 10, color: "#d97706", fontWeight: 600, background: "#fef3c7", padding: "1px 6px", borderRadius: 10 }}>Pending</span>
                )}
              </div>
            ))}
          </div>

          {/* Parent / Guardian */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Parent / Guardian</div>
            {[
              ["Name", "Mr. Isaac Asante"],
              ["Relationship", "Father"],
              ["Phone", "024 123 4567"],
              ["Email", "isaacasante@gmail.com"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8 }}>
          <button style={{ flex: 1, padding: "9px 0", borderRadius: 8, background: "#7c3aed", border: "none", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Approve</button>
          <button style={{ flex: 1, padding: "9px 0", borderRadius: 8, background: "#fee2e2", border: "none", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Decline</button>
          <button style={{ padding: "9px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 12, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>More <ChevronDown size={11} /></button>
        </div>
      </div>
    </div>
  );
}
