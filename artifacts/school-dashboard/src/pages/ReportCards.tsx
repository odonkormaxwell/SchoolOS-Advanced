import { useState } from "react";
import { ChevronDown, ChevronRight, Download, Printer, Search, Star, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const students = [
  { id: 1, name: "Kofi Junior Asante",   sid: "STU-2024-0012", class: "P6 - Topaz", avg: 88.0, grade: "A",  rank: 1,  status: "Ready",  initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: 2, name: "Efua Korkor Lamptey",  sid: "STU-2024-0017", class: "P6 - Topaz", avg: 91.0, grade: "A",  rank: 2,  status: "Ready",  initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 3, name: "Ama Serwaa Ofori",     sid: "STU-2024-0013", class: "P6 - Topaz", avg: 79.0, grade: "B",  rank: 3,  status: "Ready",  initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 4, name: "Akosua Adwoa Mensah",  sid: "STU-2024-0015", class: "P6 - Topaz", avg: 79.0, grade: "B",  rank: 4,  status: "Draft",  initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 5, name: "Abena Yaa Darko",      sid: "STU-2024-0019", class: "P6 - Topaz", avg: 70.0, grade: "B-", rank: 5,  status: "Ready",  initials: "AD", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 6, name: "Daniel Nii Lartey",   sid: "STU-2024-0014", class: "P6 - Topaz", avg: 66.0, grade: "C",  rank: 6,  status: "Draft",  initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { id: 7, name: "Yaw Antwi Boakye",    sid: "STU-2024-0016", class: "P6 - Topaz", avg: 60.0, grade: "C",  rank: 7,  status: "Ready",  initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { id: 8, name: "Michael Kojo Addo",   sid: "STU-2024-0018", class: "P6 - Topaz", avg: 48.0, grade: "D",  rank: 8,  status: "Pending", initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
];

const subjectScores = [
  { name: "English Language",   score: 17, total: 20, grade: "A",  remark: "Excellent",      teacherMark: "KA" },
  { name: "Mathematics",        score: 18, total: 20, grade: "A",  remark: "Outstanding",    teacherMark: "KM" },
  { name: "Integrated Science", score: 16, total: 20, grade: "A",  remark: "Very Good",      teacherMark: "AB" },
  { name: "Social Studies",     score: 17, total: 20, grade: "A",  remark: "Excellent",      teacherMark: "NL" },
  { name: "ICT",                score: 17, total: 20, grade: "A",  remark: "Excellent",      teacherMark: "KO" },
  { name: "RME",                score: 15, total: 20, grade: "B",  remark: "Very Good",      teacherMark: "DY" },
  { name: "French",             score: 14, total: 20, grade: "B",  remark: "Good",           teacherMark: "AB" },
  { name: "Ghanaian Language",  score: 13, total: 20, grade: "B",  remark: "Good",           teacherMark: "SD" },
  { name: "BDT",                score: 15, total: 20, grade: "B",  remark: "Very Good",      teacherMark: "EB" },
  { name: "Physical Education", score: 18, total: 20, grade: "A",  remark: "Outstanding",    teacherMark: "AG" },
];

const gradeColor = (g: string) => {
  if (g === "A")                return { color: "#16a34a", bg: "#dcfce7" };
  if (g === "B" || g === "B-")  return { color: "#2563eb", bg: "#dbeafe" };
  if (g === "C")                return { color: "#d97706", bg: "#fef3c7" };
  return                               { color: "#dc2626", bg: "#fee2e2" };
};

const statusStyle = (s: string) => {
  if (s === "Ready")   return { bg: "#dcfce7", color: "#16a34a", icon: <CheckCircle size={11} /> };
  if (s === "Draft")   return { bg: "#fef3c7", color: "#d97706", icon: <Clock size={11} /> };
  return                      { bg: "#fee2e2", color: "#dc2626", icon: <Clock size={11} /> };
};

const terms   = ["First Term (2024/2025)", "Second Term", "Third Term"];
const classes = ["P6 - Topaz", "P6 - Diamond", "P5 - Ruby", "P4 - Emerald", "P3 - Pearl"];

export default function ReportCards() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [selectedTerm,    setSelectedTerm]    = useState(terms[0]);
  const [selectedClass,   setSelectedClass]   = useState(classes[0]);
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [searchQuery,     setSearchQuery]      = useState("");
  const [showCard,        setShowCard]         = useState(!isMobile);

  const filtered = students.filter((s) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gc = gradeColor(selectedStudent.grade);

  const handlePrint = () => showToast(`Printing report card for ${selectedStudent.name}...`, "info");
  const handlePublish = () => showToast(`Report card published for ${selectedStudent.name}`, "success");
  const handleBulkPrint = () => showToast(`Printing ${filtered.length} report cards...`, "info");

  const ReportCardView = () => (
    <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
      {/* Card header bar */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Report Card</span>
          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{selectedTerm}</span>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {isMobile && <button onClick={() => setShowCard(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>← Back</button>}
          <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>
            <Printer size={12} color="#6b7280" /> Print
          </button>
          <button onClick={handlePublish} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "white" }}>
            Publish
          </button>
        </div>
      </div>

      <div style={{ padding: "20px", overflowY: "auto", maxHeight: "calc(100vh - 240px)" }}>
        {/* School header */}
        <div style={{ textAlign: "center", marginBottom: 20, paddingBottom: 20, borderBottom: "2px solid #f3f4f6" }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 22 }}>🎓</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Happy Kids Basic School</div>
          <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>P.O. Box KN 1234, Accra · Tel: 0302-000001</div>
          <div style={{ marginTop: 10, display: "inline-block", background: "#7c3aed", color: "white", fontSize: 11.5, fontWeight: 700, padding: "4px 16px", borderRadius: 20, letterSpacing: "0.04em" }}>
            STUDENT REPORT CARD — {selectedTerm.toUpperCase()}
          </div>
        </div>

        {/* Student info */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 10, letterSpacing: "0.06em" }}>STUDENT INFORMATION</div>
            {[
              ["Name",           selectedStudent.name],
              ["Student ID",     selectedStudent.sid],
              ["Class",          selectedStudent.class],
              ["Academic Year",  "2024 / 2025"],
              ["Gender",         "Male"],
              ["Date of Birth",  "12 Jan 2014"],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#111827", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 10, letterSpacing: "0.06em" }}>PERFORMANCE SUMMARY</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, background: gc.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: gc.color }}>{selectedStudent.grade}</div>
                <div style={{ fontSize: 10.5, color: gc.color, fontWeight: 600 }}>GRADE</div>
              </div>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>{selectedStudent.avg.toFixed(0)}%</div>
                <div style={{ fontSize: 10.5, color: "#16a34a", fontWeight: 600 }}>AVERAGE</div>
              </div>
              <div style={{ flex: 1, background: "#ede9fe", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed" }}>#{selectedStudent.rank}</div>
                <div style={{ fontSize: 10.5, color: "#7c3aed", fontWeight: 600 }}>RANK</div>
              </div>
            </div>
            {[
              ["Class Position",  `${selectedStudent.rank} out of 39`],
              ["Days Present",    "62 / 65"],
              ["Attendance %",    "95.4%"],
              ["Class Teacher",   "Mr. K. Appiah"],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#111827", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject scores table */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10, letterSpacing: "0.04em" }}>ACADEMIC PERFORMANCE</div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["SUBJECT", "SCORE", "TOTAL", "%", "GRADE", "REMARK"].map((h) => (
                    <th key={h} style={{ padding: "9px 10px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textAlign: "left", borderBottom: "1px solid #f3f4f6", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjectScores.map((s, i) => {
                  const pct = ((s.score / s.total) * 100).toFixed(0);
                  const g = gradeColor(s.grade);
                  return (
                    <tr key={s.name} style={{ borderBottom: i < subjectScores.length - 1 ? "1px solid #f9fafb" : "none" }}>
                      <td style={{ padding: "9px 10px", fontSize: 12, color: "#374151", fontWeight: 500 }}>{s.name}</td>
                      <td style={{ padding: "9px 10px", fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{s.score}</td>
                      <td style={{ padding: "9px 10px", fontSize: 12, color: "#9ca3af" }}>{s.total}</td>
                      <td style={{ padding: "9px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ flex: 1, height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden", minWidth: 40 }}>
                            <div style={{ width: pct + "%", height: "100%", background: g.color, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#374151" }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "9px 10px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: g.bg, color: g.color }}>{s.grade}</span>
                      </td>
                      <td style={{ padding: "9px 10px", fontSize: 11.5, color: "#6b7280" }}>{s.remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 8, letterSpacing: "0.05em" }}>CLASS TEACHER'S COMMENT</div>
            <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              {selectedStudent.name.split(" ")[0]} has demonstrated outstanding dedication and performance this term. A brilliant student with strong analytical skills. Keep it up!
            </p>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Mr. K. Appiah</span>
              <div style={{ height: 1, flex: 1, background: "#d1d5db", margin: "0 10px" }} />
              <span style={{ fontSize: 10.5, color: "#9ca3af" }}>Signature</span>
            </div>
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 8, letterSpacing: "0.05em" }}>HEADTEACHER'S COMMENT</div>
            <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              Excellent performance! Continue to strive for excellence. We are proud of your achievements this term. Best wishes for the next term.
            </p>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Mr. E. Mensah</span>
              <div style={{ height: 1, flex: 1, background: "#d1d5db", margin: "0 10px" }} />
              <span style={{ fontSize: 10.5, color: "#9ca3af" }}>Signature</span>
            </div>
          </div>
        </div>

        {/* Grading key */}
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af" }}>GRADING SCALE:</span>
          {[["A", "80–100%", "#16a34a"], ["B", "70–79%", "#2563eb"], ["C", "60–69%", "#d97706"], ["D", "50–59%", "#ea580c"], ["F", "<50%", "#dc2626"]].map(([g, r, c]) => (
            <span key={g as string} style={{ fontSize: 11, color: c as string, fontWeight: 600 }}>{g} = {r}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Report Cards</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Academics", "Report Cards"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!isMobile && (
            <button onClick={handleBulkPrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Download size={13} color="#6b7280" /> Bulk Export
            </button>
          )}
          <button onClick={() => showToast("Publishing all ready report cards...", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            Publish All
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Ready to Publish", value: `${students.filter(s => s.status === "Ready").length}`,   icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Draft / In Progress", value: `${students.filter(s => s.status === "Draft").length}`, icon: "📝", bg: "#fef3c7", color: "#d97706" },
          { label: "Pending Review",   value: `${students.filter(s => s.status === "Pending").length}`,  icon: "⏳", bg: "#fee2e2", color: "#dc2626" },
          { label: "Class Average",    value: "76.4%",                                                    icon: "📊", bg: "#ede9fe", color: "#7c3aed" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Term",  value: selectedTerm,  set: setSelectedTerm,  opts: terms   },
          { label: "Class", value: selectedClass, set: setSelectedClass, opts: classes  },
        ].map(({ label, value, set, opts }) => (
          <div key={label} style={{ position: "relative", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{label}</span>
            <div style={{ position: "relative" }}>
              <select value={value} onChange={(e) => set(e.target.value)} style={{ appearance: "none", padding: "7px 22px 7px 9px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>
        ))}
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student..."
            style={{ width: "100%", padding: "7px 10px 7px 27px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 320px)" }}>
        {/* Student list */}
        {(!isMobile || !showCard) && (
          <div style={{ width: isMobile ? "100%" : 280, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>Students ({filtered.length})</span>
              <button onClick={handleBulkPrint} style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Print All</button>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((s) => {
                const gc2 = gradeColor(s.grade);
                const st = statusStyle(s.status);
                const isActive = selectedStudent.id === s.id;
                return (
                  <div key={s.id}
                    onClick={() => { setSelectedStudent(s); if (isMobile) setShowCard(true); }}
                    style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.avatarBg, color: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{s.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: gc2.color, background: gc2.bg, padding: "1px 6px", borderRadius: 8, flexShrink: 0 }}>{s.grade}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>Rank #{s.rank} · {s.avg.toFixed(0)}%</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 600, color: st.color }}>
                          {st.icon}{s.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Report card view */}
        {(!isMobile || showCard) && <ReportCardView />}
      </div>
    </div>
  );
}
