import { useState } from "react";
import { Upload, FileText, Plus, Search, ChevronDown, ChevronLeft, ChevronRight, X, Eye, MoreVertical, Calendar, CheckCircle, Download, Printer } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import ImportModal from "../components/ImportModal";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";

const kpiCards = [
  { label: "Total Applications", value: "126", sub: "This Term", icon: "📋", iconBg: "#e0e7ff", color: "#4f46e5" },
  { label: "Approved", value: "32", sub: "25.4%", icon: "✅", iconBg: "#dcfce7", color: "#16a34a" },
  { label: "Under Review", value: "58", sub: "46.0%", icon: "⏳", iconBg: "#fef3c7", color: "#d97706" },
  { label: "Declined", value: "18", sub: "14.3%", icon: "❌", iconBg: "#fee2e2", color: "#dc2626" },
  { label: "Enrolled", value: "18", sub: "14.3%", icon: "👥", iconBg: "#dbeafe", color: "#2563eb" },
  { label: "On Waitlist", value: "12", sub: "9.5%", icon: "🕐", iconBg: "#f3e8ff", color: "#7c3aed" },
];

const initApplicants = [
  { id: 1, name: "Kofi Junior Asante",  gender: "Male",   age: 5, appNo: "HKB-ADM-2026-0126", class: "P1 - 2025/2026", date: "14 May 2026", time: "10:24 AM", status: "Under Review", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", eligibility: 92 },
  { id: 2, name: "Ama Serwaa Ofori",    gender: "Female", age: 4, appNo: "HKB-ADM-2026-0125", class: "KG - 2025/2026", date: "14 May 2026", time: "09:15 AM", status: "Approved",    initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", eligibility: 88 },
  { id: 3, name: "Daniel Nii Lartey",   gender: "Male",   age: 6, appNo: "HKB-ADM-2026-0124", class: "P2 - 2025/2026", date: "13 May 2026", time: "02:45 PM", status: "Under Review", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", eligibility: 75 },
  { id: 4, name: "Akosua Adwoa Mensah", gender: "Female", age: 5, appNo: "HKB-ADM-2026-0123", class: "P1 - 2025/2026", date: "13 May 2026", time: "11:30 AM", status: "Approved",    initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d", eligibility: 90 },
  { id: 5, name: "Yaw Antwi Boakye",    gender: "Male",   age: 7, appNo: "HKB-ADM-2026-0122", class: "P3 - 2025/2026", date: "12 May 2026", time: "04:10 PM", status: "Under Review", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", eligibility: 70 },
  { id: 6, name: "Efua Korkor Lamptey", gender: "Female", age: 4, appNo: "HKB-ADM-2026-0121", class: "KG - 2025/2026", date: "12 May 2026", time: "10:05 AM", status: "Declined",    initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d", eligibility: 45 },
  { id: 7, name: "Michael Kojo Addo",   gender: "Male",   age: 6, appNo: "HKB-ADM-2026-0120", class: "P1 - 2025/2026", date: "11 May 2026", time: "03:25 PM", status: "Declined",    initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", eligibility: 40 },
];

const statusStyle = (s: string) => {
  if (s === "Approved") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Declined") return { bg: "#fee2e2", color: "#dc2626" };
  return { bg: "#fef3c7", color: "#d97706" };
};

const eligibilityStyle = (score: number) => {
  if (score >= 80) return { color: "#16a34a", label: "Excellent" };
  if (score >= 70) return { color: "#2563eb", label: "Good" };
  return { color: "#d97706", label: "Average" };
};

const documents = [
  { name: "Birth Certificate", status: "Uploaded" },
  { name: "Passport Photograph", status: "Uploaded" },
  { name: "Previous School Report", status: "Uploaded" },
  { name: "Immunization Card", status: "Uploaded" },
  { name: "Proof of Residence", status: "Pending" },
];

export default function Admissions() {
  const { showToast } = useApp();
  const { isMobile, isTablet } = useWindowSize();

  const [applicants, setApplicants]     = useState(initApplicants);
  const [selected, setSelected]         = useState(initApplicants[0]);
  const [activeTab, setActiveTab]       = useState("Overview");
  const [currentPage, setCurrentPage]   = useState(1);
  const [searchQuery, setSearchQuery]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showPanel, setShowPanel]       = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const tabs = ["Overview", "Documents", "Family Info", "History"];

  const filteredApplicants = applicants.filter((a) => {
    const matchSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.appNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All Status" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: number, newStatus: string) => {
    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a));
    if (selected.id === id) setSelected((s) => ({ ...s, status: newStatus }));
  };

  const handleApprove = () => {
    updateStatus(selected.id, "Approved");
    showToast(`${selected.name}'s application approved!`, "success");
    if (isMobile) setShowPanel(false);
  };

  const handleDecline = () => {
    updateStatus(selected.id, "Declined");
    showToast(`${selected.name}'s application declined.`, "warning");
    if (isMobile) setShowPanel(false);
  };

  const handleScheduleInterview = () => {
    showToast(`Interview scheduled for ${selected.name}`, "info");
    if (isMobile) setShowPanel(false);
  };

  const handleExport = () => {
    const rows = filteredApplicants.map((a) => ({
      "Application No.": a.appNo,
      "Applicant Name":  a.name,
      "Gender":          a.gender,
      "Age":             a.age,
      "Class Applied":   a.class,
      "Date Applied":    a.date,
      "Status":          a.status,
      "AI Score":        a.eligibility + "%",
    }));
    exportToCSV("admissions_export", rows);
    showToast(`${rows.length} applications exported to CSV`, "success");
  };

  const handlePrint = () => {
    const rows = filteredApplicants.map((a) =>
      `<tr><td>${a.appNo}</td><td>${a.name}</td><td>${a.gender}</td><td>${a.age}</td><td>${a.class}</td><td>${a.date}</td><td>${a.status}</td></tr>`
    ).join("");
    printHTML(`
      <h2 style="margin:0 0 10px;font-size:16px;">Admissions Report — Happy Kids Basic School</h2>
      <p style="margin:0 0 14px;font-size:12px;color:#666;">Term 2, 2025/2026 · Generated ${new Date().toLocaleDateString("en-GB")}</p>
      <table border="1" cellpadding="7" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead style="background:#f5f3ff;"><tr>
          <th>App. No.</th><th>Applicant</th><th>Gender</th><th>Age</th><th>Class</th><th>Date</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:#999;">Total: ${filteredApplicants.length} applications printed</p>
    `);
  };

  const kpiCols = isMobile ? "repeat(3, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)";

  const PanelContent = () => (
    <>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Applicant Details</span>
          {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>App No. {selected.appNo}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Applied {selected.date}</div>
            <span style={{ display: "inline-block", marginTop: 4, fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: statusStyle(selected.status).bg, color: statusStyle(selected.status).color }}>{selected.status}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 14px" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "10px 7px", fontSize: 11, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "#7c3aed" : "#9ca3af", background: "none", border: "none", borderBottom: activeTab === t ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "14px", flex: 1, overflowY: "auto" }}>
        {/* AI Score */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
          <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
            <svg viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)", width: 60, height: 60 }}>
              <circle cx="30" cy="30" r="24" fill="none" stroke="#f3f4f6" strokeWidth="5" />
              <circle cx="30" cy="30" r="24" fill="none" stroke="#7c3aed" strokeWidth="5" strokeDasharray={`${(selected.eligibility / 100) * 150.8} 150.8`} />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{selected.eligibility}%</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>🤖 AI Eligibility Score</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: eligibilityStyle(selected.eligibility).color }}>{eligibilityStyle(selected.eligibility).label} Fit</div>
            <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>Strong academic and behavioural fit.</div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Application Summary</div>
          {[["Class Applied For", selected.class], ["Campus", "Main Campus"], ["Session", "2024/2025"], ["Status", selected.status]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
              <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Documents</div>
          {documents.map((d) => (
            <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={12} color="#7c3aed" />
                <span style={{ fontSize: 11.5, color: "#374151" }}>{d.name}</span>
              </div>
              {d.status === "Uploaded" ? <CheckCircle size={13} color="#16a34a" /> : <span style={{ fontSize: 10, color: "#d97706", fontWeight: 600, background: "#fef3c7", padding: "1px 6px", borderRadius: 10 }}>Pending</span>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {selected.status === "Under Review" && (
            <>
              <button onClick={handleApprove} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                ✓ Approve Application
              </button>
              <button onClick={handleScheduleInterview} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                📅 Schedule Interview
              </button>
              <button onClick={handleDecline} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff5f5", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                ✕ Decline Application
              </button>
            </>
          )}
          {selected.status === "Approved" && (
            <button onClick={() => { showToast(`Enrollment process started for ${selected.name}`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              🎓 Proceed to Enroll
            </button>
          )}
          {selected.status === "Declined" && (
            <button onClick={() => { updateStatus(selected.id, "Under Review"); showToast("Application moved back to review", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#f3f4f6", color: "#374151", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              ↩ Move to Review
            </button>
          )}
          <button onClick={() => { handlePrint(); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Printer size={13} /> Print Application Form
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 96px)" }}>
      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, overflowY: isMobile ? "visible" : "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Admissions</h1>
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                {["Dashboard", "Admissions", "All Applications"].map((c, i, a) => (
                  <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                    {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isMobile && (
              <>
                <button onClick={() => setShowImportModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                  <Upload size={13} color="#6b7280" /> Import
                </button>
                <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                  <Download size={13} color="#6b7280" /> Export
                </button>
                <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                  <Printer size={13} color="#6b7280" /> Print
                </button>
              </>
            )}
            <button onClick={() => showToast("New application form ready", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={14} />{!isMobile && " New Application"}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: isMobile ? 20 : 24, marginBottom: 4 }}>{k.icon}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#111827", lineHeight: 1.1 }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.color, fontWeight: 600, marginTop: 1 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Admission Funnel */}
        {!isMobile && (
          <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Admission Funnel</span>
              <button onClick={() => showToast("Opening funnel report...", "info")} style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>View Funnel Report</button>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {[{ label: "Application", value: 126, icon: "📋" }, { label: "Review", value: 58, icon: "🔍" }, { label: "Interview", value: 34, icon: "👥" }, { label: "Approved", value: 32, icon: "✅" }, { label: "Enrolled", value: 18, icon: "🎓" }].map((step, i, arr) => (
                <div key={step.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{step.icon}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{step.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{step.value}</div>
                  </div>
                  {i < arr.length - 1 && <ChevronRight size={18} color="#d1d5db" />}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "14.3%", height: "100%", background: "linear-gradient(90deg,#7c3aed,#4f46e5)", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 5 }}>Conversion Rate: <span style={{ color: "#16a34a", fontWeight: 600 }}>14.3%</span></div>
          </div>
        )}

        {/* Filter + Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
              <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, application no..."
                style={{ width: "100%", padding: "7px 10px 7px 28px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
            </div>
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Status</span>
                <div style={{ position: "relative" }}>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ appearance: "none", padding: "6px 22px 6px 9px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                    {["All Status", "Under Review", "Approved", "Declined"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            )}
          </div>

          {/* Mobile card list */}
          {isMobile ? (
            <div style={{ padding: "10px 12px" }}>
              {filteredApplicants.map((a) => {
                const st = statusStyle(a.status);
                const el = eligibilityStyle(a.eligibility);
                return (
                  <div key={a.id} onClick={() => { setSelected(a); setShowPanel(true); }}
                    style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: a.avatarBg, color: a.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{a.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{a.appNo} · {a.class}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.date}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color }}>{a.status}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: el.color }}>{a.eligibility}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Desktop table */
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  <th style={{ padding: "10px 14px", width: 36 }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></th>
                  {["APPLICANT", "APPLICATION NO.", "CLASS APPLIED FOR", "DATE APPLIED", "STATUS", "ELIGIBILITY", "ACTIONS"].map((c) => (
                    <th key={c} style={{ padding: "10px 10px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a, idx) => {
                  const st = statusStyle(a.status);
                  const el = eligibilityStyle(a.eligibility);
                  return (
                    <tr key={a.id} onClick={() => setSelected(a)}
                      style={{ borderBottom: idx < filteredApplicants.length - 1 ? "1px solid #f9fafb" : "none", background: selected.id === a.id ? "#faf5ff" : "white", cursor: "pointer" }}>
                      <td style={{ padding: "10px 14px" }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} onClick={(e) => e.stopPropagation()} /></td>
                      <td style={{ padding: "10px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: a.avatarBg, color: a.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{a.initials}</div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{a.name}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.gender} • {a.age} years</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 10px" }}><span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>{a.appNo}</span></td>
                      <td style={{ padding: "10px 10px" }}><span style={{ fontSize: 12, color: "#374151" }}>{a.class}</span></td>
                      <td style={{ padding: "10px 10px" }}>
                        <div style={{ fontSize: 12, color: "#374151" }}>{a.date}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.time}</div>
                      </td>
                      <td style={{ padding: "10px 10px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{a.status}</span>
                      </td>
                      <td style={{ padding: "10px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ position: "relative", width: 32, height: 32 }}>
                            <svg viewBox="0 0 32 32" style={{ transform: "rotate(-90deg)", width: 32, height: 32 }}>
                              <circle cx="16" cy="16" r="12" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                              <circle cx="16" cy="16" r="12" fill="none" stroke={el.color} strokeWidth="3" strokeDasharray={`${(a.eligibility / 100) * 75.4} 75.4`} />
                            </svg>
                            <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 7.5, fontWeight: 700, color: el.color }}>{a.eligibility}</span>
                          </div>
                          <span style={{ fontSize: 11, color: el.color, fontWeight: 600 }}>{el.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 10px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={(e) => { e.stopPropagation(); setSelected(a); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 5, display: "flex" }}><Eye size={13} /></button>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 5, display: "flex" }}><MoreVertical size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing {filteredApplicants.length} of <strong style={{ color: "#374151" }}>126</strong> applications</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12, fontWeight: currentPage === p ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
              ))}
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Desktop */}
      {!isMobile && (
        <div style={{ width: 280, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <PanelContent />
        </div>
      )}

      {showImportModal && (
        <ImportModal
          title="Import Applications"
          templateHeaders={["Applicant Name", "Gender", "Age", "Class Applied For", "Parent Name", "Parent Phone"]}
          templateFilename="admissions_template"
          onClose={() => setShowImportModal(false)}
          onImport={() => { setShowImportModal(false); showToast("Applications imported successfully!", "success"); }}
        />
      )}

      {/* Mobile bottom sheet panel */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", display: "flex", flexDirection: "column", animation: "slideUp 0.2s ease" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "12px auto 0" }} />
            <div style={{ flex: 1, overflowY: "auto" }}>
              <PanelContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
