import { useState } from "react";
import { Plus, Search, ChevronRight, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Severity = "Warning" | "Detention" | "Suspension" | "Expulsion";
type IncidentStatus = "Open" | "Resolved" | "Pending Review";

type Incident = {
  id: number; studentName: string; studentId: string; class: string;
  initials: string; avatarBg: string; avatarColor: string;
  type: string; severity: Severity; description: string;
  date: string; reportedBy: string; status: IncidentStatus;
  action?: string; parentNotified: boolean;
};

const incidents: Incident[] = [
  { id: 1,  studentName: "Kwame Asante",      studentId: "STU-2024-0042", class: "JHS 2", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", type: "Fighting",          severity: "Suspension",  description: "Student was involved in a physical altercation during break time behind Block C. Two other students witnessed the incident.",                                         date: "28 May 2024", reportedBy: "Mr. E. Asiedu",  status: "Open",           parentNotified: true  },
  { id: 2,  studentName: "Abena Pokuaa",      studentId: "STU-2024-0051", class: "P6 - Topaz", initials: "AP", avatarBg: "#fce7f3", avatarColor: "#9d174d", type: "Bullying",    severity: "Warning",     description: "Student repeatedly made unkind remarks to a classmate and excluded them from group activities. Classmates confirmed the behavior.",                              date: "27 May 2024", reportedBy: "Mrs. A. Asante", status: "Resolved",       action: "Counseled and apologized to victim",  parentNotified: true  },
  { id: 3,  studentName: "Emmanuel Kofi Adu", studentId: "STU-2024-0033", class: "JHS 1", initials: "EK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", type: "Truancy",           severity: "Detention",   description: "Student was absent without excuse for 3 consecutive days. Parents were not reachable. This is the second occurrence this term.",                                 date: "26 May 2024", reportedBy: "Mr. K. Appiah",  status: "Pending Review", parentNotified: false },
  { id: 4,  studentName: "Yaw Darko",         studentId: "STU-2024-0018", class: "P5 - Ruby",  initials: "YD", avatarBg: "#fef9c3", avatarColor: "#713f12", type: "Vandalism",    severity: "Warning",     description: "Student drew on classroom desk with permanent marker. Admitted to the act when questioned.",                                                                     date: "24 May 2024", reportedBy: "Mrs. K. Boateng",status: "Resolved",       action: "Paid for cleaning, parents informed",  parentNotified: true  },
  { id: 5,  studentName: "Adjoa Mensah",      studentId: "STU-2024-0067", class: "JHS 3", initials: "AM", avatarBg: "#fce7f3", avatarColor: "#9d174d", type: "Cheating in Exam", severity: "Suspension",  description: "Student was caught copying answers from a hidden note during the mid-term mathematics exam. Exam paper was seized.",                                           date: "22 May 2024", reportedBy: "Mr. K. Mensah",  status: "Open",           parentNotified: true  },
  { id: 6,  studentName: "Kofi Junior",       studentId: "STU-2024-0012", class: "P6 - Topaz", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", type: "Late Coming",  severity: "Warning",     description: "Student arrived 45 minutes late to school without a valid reason. Third occurrence this month.",                                                                  date: "20 May 2024", reportedBy: "Gate Keeper",    status: "Resolved",       action: "Warned and parents signed notification form", parentNotified: true  },
  { id: 7,  studentName: "Daniel Lartey",     studentId: "STU-2024-0014", class: "P6 - Topaz", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", type: "Disrespect",   severity: "Detention",   description: "Student spoke rudely to a teacher during class and refused to follow instructions. Disrupted the lesson for 20 minutes.",                                       date: "18 May 2024", reportedBy: "Mrs. N. Lartey", status: "Resolved",       action: "1-day detention, written apology submitted",  parentNotified: true  },
];

const severityStyle = (s: Severity) => {
  if (s === "Warning")    return { bg: "#fef3c7", color: "#d97706", border: "#fde68a" };
  if (s === "Detention")  return { bg: "#dbeafe", color: "#2563eb", border: "#bfdbfe" };
  if (s === "Suspension") return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
  return                         { bg: "#111827", color: "#f9fafb", border: "#374151" };
};

const statusStyle = (s: IncidentStatus) => {
  if (s === "Open")           return { bg: "#fee2e2", color: "#dc2626", icon: <AlertTriangle size={10} /> };
  if (s === "Resolved")       return { bg: "#dcfce7", color: "#16a34a", icon: <CheckCircle size={10} /> };
  return                             { bg: "#fef3c7", color: "#d97706", icon: <Clock size={10} /> };
};

const severities: Severity[] = ["Warning", "Detention", "Suspension", "Expulsion"];
const incidentTypes = ["Fighting", "Bullying", "Truancy", "Cheating in Exam", "Vandalism", "Disrespect", "Late Coming", "Other"];

export default function Discipline() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [selected,      setSelected]      = useState<Incident>(incidents[0]);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [severityFilter,setSeverityFilter] = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [showPanel,     setShowPanel]     = useState(false);
  const [showLogForm,   setShowLogForm]   = useState(false);
  const [newType,       setNewType]       = useState(incidentTypes[0]);
  const [newSeverity,   setNewSeverity]   = useState<Severity>("Warning");
  const [newDesc,       setNewDesc]       = useState("");

  const filtered = incidents.filter((inc) => {
    const mSearch   = !searchQuery || inc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || inc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const mSeverity = severityFilter === "All" || inc.severity === severityFilter;
    const mStatus   = statusFilter   === "All" || inc.status   === statusFilter;
    return mSearch && mSeverity && mStatus;
  });

  const open     = incidents.filter(i => i.status === "Open").length;
  const resolved = incidents.filter(i => i.status === "Resolved").length;
  const pending  = incidents.filter(i => i.status === "Pending Review").length;
  const suspended= incidents.filter(i => i.severity === "Suspension").length;

  const handleLogIncident = () => {
    if (!newDesc.trim()) { showToast("Please describe the incident", "error"); return; }
    showToast(`Incident logged: ${newType} — ${newSeverity}`, "success");
    setShowLogForm(false);
    setNewDesc("");
  };

  const IncidentPanel = () => {
    const sv = severityStyle(selected.severity);
    const st = statusStyle(selected.status);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Incident Report</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            {selected.status === "Open" && (
              <button onClick={() => { showToast(`Incident resolved for ${selected.studentName}`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#16a34a,#15803d)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "white" }}>
                Mark Resolved
              </button>
            )}
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Student */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.studentName}</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{selected.studentId} · {selected.class}</div>
            </div>
          </div>

          {/* Severity & status badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: sv.bg, color: sv.color, border: `1px solid ${sv.border}` }}>{selected.severity}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: st.bg, color: st.color }}>
              {st.icon}{selected.status}
            </div>
            <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#f3f4f6", color: "#374151", fontWeight: 500 }}>{selected.type}</span>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>INCIDENT DETAILS</div>
            {[
              ["Date",         selected.date],
              ["Reported By",  selected.reportedBy],
              ["Parent Notified", selected.parentNotified ? "✅ Yes" : "❌ No"],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>DESCRIPTION</div>
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", fontSize: 12.5, color: "#374151", lineHeight: 1.7 }}>{selected.description}</div>
          </div>

          {/* Action taken */}
          {selected.action && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>ACTION TAKEN</div>
              <div style={{ fontSize: 12.5, color: "#374151" }}>{selected.action}</div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Calling parents of ${selected.studentName}...`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📞 Contact Parents
            </button>
            <button onClick={() => { showToast("Generating incident report PDF...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📄 Generate Report
            </button>
            {selected.severity === "Suspension" && (
              <button onClick={() => { showToast(`Suspension notice sent to ${selected.studentName}'s parents`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                🚫 Send Suspension Notice
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Discipline</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Students", "Discipline"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowLogForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Log Incident"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Incidents", value: String(incidents.length), icon: "📋", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Open",            value: String(open),             icon: "🔴", bg: "#fee2e2", color: "#dc2626" },
          { label: "Pending Review",  value: String(pending),          icon: "⏳", bg: "#fef3c7", color: "#d97706" },
          { label: "Suspended",       value: String(suspended),        icon: "🚫", bg: "#fee2e2", color: "#dc2626" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student or incident type..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {["All", ...severities].map((f) => (
            <button key={f} onClick={() => setSeverityFilter(f)}
              style={{ padding: "6px 10px", border: `1px solid ${severityFilter === f ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: severityFilter === f ? "#7c3aed" : "white", color: severityFilter === f ? "white" : "#374151", fontSize: 11.5, fontWeight: severityFilter === f ? 600 : 400, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["All", "Open", "Resolved", "Pending Review"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ padding: "6px 10px", border: `1px solid ${statusFilter === f ? "#374151" : "#e5e7eb"}`, borderRadius: 8, background: statusFilter === f ? "#111827" : "white", color: statusFilter === f ? "white" : "#374151", fontSize: 11.5, fontWeight: statusFilter === f ? 600 : 400, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 310px)" }}>
        {/* Incident list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 340, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} incident{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((inc) => {
                const sv = severityStyle(inc.severity);
                const st = statusStyle(inc.status);
                const isActive = selected.id === inc.id;
                return (
                  <div key={inc.id}
                    onClick={() => { setSelected(inc); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : inc.status === "Open" ? "#fffbfb" : "white", transition: "background 0.1s", borderLeft: `3px solid ${inc.status === "Open" ? "#dc2626" : inc.status === "Pending Review" ? "#d97706" : "transparent"}` }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = inc.status === "Open" ? "#fffbfb" : "white"; }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: inc.avatarBg, color: inc.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{inc.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{inc.studentName}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: sv.bg, color: sv.color, flexShrink: 0 }}>{inc.severity}</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 500, marginTop: 1 }}>{inc.type}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>{inc.class} · {inc.date.split(" ").slice(0, 3).join(" ")}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: st.color }}>
                            {st.icon}{inc.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail panel */}
        {(!isMobile || showPanel) && <IncidentPanel />}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <IncidentPanel />
          </div>
        </div>
      )}

      {/* Log Incident Modal */}
      {showLogForm && (
        <div onClick={() => setShowLogForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 460, width: "100%", animation: "slideIn 0.2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Log Incident</h2>
              <button onClick={() => setShowLogForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Student Name", type: "text", placeholder: "Search or enter name..." },
                { label: "Class",        type: "text", placeholder: "e.g. P6 - Topaz" },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                  <input type={type} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Incident Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                  {incidentTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Severity</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {severities.map((s) => {
                    const sv = severityStyle(s);
                    return (
                      <button key={s} onClick={() => setNewSeverity(s)}
                        style={{ flex: 1, padding: "7px 4px", border: `2px solid ${newSeverity === s ? sv.color : "#e5e7eb"}`, borderRadius: 8, background: newSeverity === s ? sv.bg : "white", color: newSeverity === s ? sv.color : "#6b7280", fontSize: 11, fontWeight: newSeverity === s ? 700 : 400, cursor: "pointer" }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Description</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Describe what happened..." rows={4}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <button onClick={handleLogIncident} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Log Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
