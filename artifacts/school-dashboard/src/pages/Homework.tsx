import { useState } from "react";
import { Plus, Search, ChevronRight, ChevronDown, X, Calendar, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type AssignmentStatus = "Pending" | "Submitted" | "Graded" | "Overdue";
type Priority = "High" | "Medium" | "Low";

type Assignment = {
  id: number; title: string; subject: string; class: string; teacher: string;
  dueDate: string; setDate: string; status: AssignmentStatus; priority: Priority;
  submitted: number; total: number; description: string;
  subjectColor: string; subjectBg: string;
};

const assignments: Assignment[] = [
  { id: 1,  title: "Chapter 5 Exercises — Quadratic Equations", subject: "Mathematics",        class: "JHS 3",      teacher: "Mr. K. Mensah",  setDate: "27 May 2024", dueDate: "31 May 2024", status: "Pending",   priority: "High",   submitted: 22, total: 54, description: "Complete exercises 5.1 to 5.4 on quadratic equations. Show all working clearly. Use graph paper where required.",    subjectColor: "#7c3aed", subjectBg: "#ede9fe" },
  { id: 2,  title: "Essay: Advantages of Technology in Education", subject: "English Language",  class: "JHS 3",      teacher: "Mrs. A. Asante", setDate: "26 May 2024", dueDate: "30 May 2024", status: "Overdue",   priority: "High",   submitted: 31, total: 54, description: "Write a 500-word argumentative essay on the advantages of technology in modern education. Include introduction, body, and conclusion.", subjectColor: "#2563eb", subjectBg: "#dbeafe" },
  { id: 3,  title: "Lab Report — Photosynthesis Experiment",       subject: "Integrated Science", class: "JHS 3",      teacher: "Mrs. A. Boateng",setDate: "25 May 2024", dueDate: "29 May 2024", status: "Graded",    priority: "Medium", submitted: 54, total: 54, description: "Write a complete lab report for the photosynthesis experiment conducted in class. Include hypothesis, method, results, and conclusion.", subjectColor: "#16a34a", subjectBg: "#dcfce7" },
  { id: 4,  title: "Map Reading Assignment — Ghana Regions",       subject: "Social Studies",    class: "P6 - Topaz", teacher: "Mr. N. Lartey",  setDate: "24 May 2024", dueDate: "28 May 2024", status: "Graded",    priority: "Medium", submitted: 38, total: 39, description: "Draw and label a map of Ghana showing all 16 regions. Color-code by geographical zones and include a key.",                subjectColor: "#d97706", subjectBg: "#fef3c7" },
  { id: 5,  title: "Create a Spreadsheet — School Budget",         subject: "ICT",               class: "P6 - Topaz", teacher: "Mr. K. Opoku",   setDate: "22 May 2024", dueDate: "27 May 2024", status: "Submitted", priority: "Low",    submitted: 39, total: 39, description: "Using Microsoft Excel, create a school budget spreadsheet. Include formulas for totals, use borders, and apply appropriate formatting.", subjectColor: "#0891b2", subjectBg: "#cffafe" },
  { id: 6,  title: "Reading Assignment — Chapter 3",               subject: "English Language",  class: "P5 - Ruby",  teacher: "Mrs. A. Asante", setDate: "28 May 2024", dueDate: "3 Jun 2024",  status: "Pending",   priority: "Low",    submitted: 8,  total: 42, description: "Read Chapter 3 of 'Our Heritage' and answer the comprehension questions on pages 45-47. Write answers in complete sentences.", subjectColor: "#2563eb", subjectBg: "#dbeafe" },
  { id: 7,  title: "Practice Problems — Fractions & Decimals",     subject: "Mathematics",        class: "P5 - Ruby",  teacher: "Mr. K. Mensah",  setDate: "27 May 2024", dueDate: "1 Jun 2024",  status: "Pending",   priority: "Medium", submitted: 15, total: 42, description: "Complete the fraction and decimal conversion exercises from the workbook pages 67-72. Check your work using the answer key provided.", subjectColor: "#7c3aed", subjectBg: "#ede9fe" },
];

const statusStyle = (s: AssignmentStatus) => {
  if (s === "Pending")   return { bg: "#fef3c7", color: "#d97706", label: "Pending" };
  if (s === "Submitted") return { bg: "#dbeafe", color: "#2563eb", label: "Submitted" };
  if (s === "Graded")    return { bg: "#dcfce7", color: "#16a34a", label: "Graded"   };
  return                        { bg: "#fee2e2", color: "#dc2626", label: "Overdue"  };
};

const priorityStyle = (p: Priority) => {
  if (p === "High")   return { color: "#dc2626", dot: "#dc2626" };
  if (p === "Medium") return { color: "#d97706", dot: "#d97706" };
  return                     { color: "#16a34a", dot: "#16a34a" };
};

const classes = ["All Classes", "JHS 3", "P6 - Topaz", "P5 - Ruby"];

export default function Homework() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<Assignment>(assignments[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter,setStatusFilter]= useState("All");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  const filtered = assignments.filter((a) => {
    const mSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const mClass  = classFilter === "All Classes" || a.class === classFilter;
    const mStatus = statusFilter === "All" || a.status === statusFilter;
    return mSearch && mClass && mStatus;
  });

  const pending  = assignments.filter(a => a.status === "Pending").length;
  const overdue  = assignments.filter(a => a.status === "Overdue").length;
  const graded   = assignments.filter(a => a.status === "Graded").length;

  const AssignmentPanel = () => {
    const st = statusStyle(selected.status);
    const pr = priorityStyle(selected.priority);
    const pct = Math.round((selected.submitted / selected.total) * 100);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Assignment Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast("Editing assignment...", "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Subject banner */}
          <div style={{ background: selected.subjectBg, borderRadius: 10, padding: "14px", borderLeft: `4px solid ${selected.subjectColor}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: selected.subjectColor, letterSpacing: "0.05em" }}>{selected.subject.toUpperCase()}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginTop: 3, lineHeight: 1.3 }}>{selected.title}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 4 }}>{selected.class} · {selected.teacher}</div>
              </div>
              <div style={{ display: "flex", gap: 5, flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{st.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: pr.dot }} />
                  <span style={{ fontSize: 10.5, color: pr.color, fontWeight: 600 }}>{selected.priority} Priority</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Set Date", selected.setDate, "📅"], ["Due Date", selected.dueDate, selected.status === "Overdue" ? "🔴" : "📅"]].map(([l, v, ic]) => (
              <div key={l as string} style={{ background: "#f9fafb", borderRadius: 9, padding: "10px" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{l as string}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: selected.status === "Overdue" && l === "Due Date" ? "#dc2626" : "#111827", marginTop: 3 }}>{ic} {v}</div>
              </div>
            ))}
          </div>

          {/* Submission progress */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Submission Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>{selected.submitted} / {selected.total}</span>
            </div>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#16a34a" : pct >= 70 ? "#7c3aed" : "#d97706", borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{pct}% submitted · {selected.total - selected.submitted} not yet submitted</div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>INSTRUCTIONS</div>
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", fontSize: 12.5, color: "#374151", lineHeight: 1.7 }}>{selected.description}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast("Opening submissions list...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📋 View Submissions
            </button>
            <button onClick={() => { showToast(`Reminder sent to ${selected.total - selected.submitted} students`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              🔔 Send Reminder to {selected.total - selected.submitted} Students
            </button>
            {selected.status === "Submitted" && (
              <button onClick={() => { showToast("Opening grading interface...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#dcfce7", color: "#16a34a", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                ✏️ Grade Assignments
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
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Homework</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Academics", "Homework"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Assign Homework"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Assignments", value: String(assignments.length), icon: "📝", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Pending",           value: String(pending),            icon: "⏳", bg: "#fef3c7", color: "#d97706" },
          { label: "Overdue",           value: String(overdue),            icon: "🔴", bg: "#fee2e2", color: "#dc2626" },
          { label: "Graded",            value: String(graded),             icon: "✅", bg: "#dcfce7", color: "#16a34a" },
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
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search assignments..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ position: "relative" }}>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ appearance: "none", padding: "8px 24px 8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            {classes.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["All", "Pending", "Overdue", "Submitted", "Graded"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ padding: "6px 10px", border: `1px solid ${statusFilter === f ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: statusFilter === f ? "#7c3aed" : "white", color: statusFilter === f ? "white" : "#374151", fontSize: 11.5, fontWeight: statusFilter === f ? 600 : 400, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 310px)" }}>
        {/* Assignment list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 360, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} assignment{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((assign) => {
                const st  = statusStyle(assign.status);
                const pr  = priorityStyle(assign.priority);
                const pct = Math.round((assign.submitted / assign.total) * 100);
                const isActive = selected.id === assign.id;
                return (
                  <div key={assign.id}
                    onClick={() => { setSelected(assign); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", borderLeft: `3px solid ${assign.status === "Overdue" ? "#dc2626" : "transparent"}`, transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                      <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{assign.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                          <span style={{ fontSize: 11, color: assign.subjectColor, fontWeight: 600, background: assign.subjectBg, padding: "1px 6px", borderRadius: 8 }}>{assign.subject}</span>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>{assign.class}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>{st.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Calendar size={10} color="#9ca3af" />
                          <span style={{ fontSize: 11, color: assign.status === "Overdue" ? "#dc2626" : "#6b7280" }}>Due: {assign.dueDate.split(" ").slice(0, 3).join(" ")}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: pr.dot }} />
                          <span style={{ fontSize: 11, color: pr.color }}>{assign.priority}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{assign.submitted}/{assign.total}</span>
                    </div>
                    <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#16a34a" : pct >= 70 ? "#7c3aed" : "#d97706", borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(!isMobile || showPanel) && <AssignmentPanel />}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <AssignmentPanel />
          </div>
        </div>
      )}

      {/* Assign Homework Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Assign Homework</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Assignment Title", placeholder: "e.g. Chapter 5 Review Questions" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                  <input placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Subject", ["Mathematics","English Language","Integrated Science","Social Studies","ICT","French"]], ["Class", ["JHS 3","P6 - Topaz","P5 - Ruby","P4 - Emerald"]]].map(([label, opts]) => (
                  <div key={label as string}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                    <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                      {(opts as string[]).map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Due Date", "date"], ["Priority", "select"]].map(([label, type]) => (
                  <div key={label as string}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                    {type === "select" ? (
                      <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                        {["High","Medium","Low"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="date" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Instructions</label>
                <textarea rows={3} placeholder="Describe the assignment instructions..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => { showToast("Homework assigned successfully!", "success"); setShowForm(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Assign Homework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
