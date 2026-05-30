import { useState } from "react";
import { Search, ChevronDown, ChevronRight, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Grade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

type StudentResult = {
  id: number; name: string; studentId: string; class: string;
  initials: string; avatarBg: string; avatarColor: string;
  position: number; totalStudents: number;
  scores: { subject: string; score: number; grade: Grade; }[];
  total: number; average: number; overallGrade: Grade;
  remarks: string; promoted: boolean;
};

const getGrade = (score: number): Grade => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 75) return "B+";
  if (score >= 65) return "B";
  if (score >= 55) return "C+";
  if (score >= 45) return "C";
  if (score >= 35) return "D";
  return "F";
};

const gradeColor = (g: Grade) => {
  if (g === "A+" || g === "A") return { color: "#16a34a", bg: "#dcfce7" };
  if (g === "B+" || g === "B") return { color: "#2563eb", bg: "#dbeafe" };
  if (g === "C+" || g === "C") return { color: "#d97706", bg: "#fef3c7" };
  if (g === "D")               return { color: "#ea580c", bg: "#ffedd5" };
  return                              { color: "#dc2626", bg: "#fee2e2" };
};

const results: StudentResult[] = [
  { id: 1,  name: "Adjoa Mensah",        studentId: "STU-2024-0067", class: "JHS 3", initials: "AM", avatarBg: "#fce7f3", avatarColor: "#9d174d", position: 1,  totalStudents: 54, scores: [{subject:"Mathematics",score:92,grade:"A+"},{subject:"English",score:88,grade:"A"},{subject:"Science",score:85,grade:"B+"},{subject:"Social Studies",score:91,grade:"A+"},{subject:"ICT",score:95,grade:"A+"},{subject:"French",score:78,grade:"B+"}], total: 529, average: 88.2, overallGrade: "A+", remarks: "Excellent performance. Keep it up!", promoted: true },
  { id: 2,  name: "Kofi Junior",         studentId: "STU-2024-0012", class: "JHS 3", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", position: 2,  totalStudents: 54, scores: [{subject:"Mathematics",score:89,grade:"A"},{subject:"English",score:85,grade:"B+"},{subject:"Science",score:84,grade:"B+"},{subject:"Social Studies",score:88,grade:"A"},{subject:"ICT",score:92,grade:"A+"},{subject:"French",score:75,grade:"B+"}], total: 513, average: 85.5, overallGrade: "A",  remarks: "Very good work. Maintain consistency.", promoted: true },
  { id: 3,  name: "Ama Serwaa Ofori",    studentId: "STU-2024-0013", class: "JHS 3", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", position: 3,  totalStudents: 54, scores: [{subject:"Mathematics",score:86,grade:"A"},{subject:"English",score:90,grade:"A+"},{subject:"Science",score:80,grade:"A"},{subject:"Social Studies",score:85,grade:"B+"},{subject:"ICT",score:88,grade:"A"},{subject:"French",score:72,grade:"B"}],  total: 501, average: 83.5, overallGrade: "A",  remarks: "Outstanding in English. Well done!", promoted: true },
  { id: 4,  name: "Daniel Lartey",       studentId: "STU-2024-0014", class: "JHS 3", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", position: 7,  totalStudents: 54, scores: [{subject:"Mathematics",score:75,grade:"B+"},{subject:"English",score:78,grade:"B+"},{subject:"Science",score:72,grade:"B"},{subject:"Social Studies",score:80,grade:"A"},{subject:"ICT",score:85,grade:"B+"},{subject:"French",score:68,grade:"B"}],  total: 458, average: 76.3, overallGrade: "B+", remarks: "Good performance. Work harder in Science.", promoted: true },
  { id: 5,  name: "Kwame Asante",        studentId: "STU-2024-0042", class: "JHS 3", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", position: 18, totalStudents: 54, scores: [{subject:"Mathematics",score:62,grade:"C+"},{subject:"English",score:70,grade:"B"},{subject:"Science",score:58,grade:"C+"},{subject:"Social Studies",score:72,grade:"B"},{subject:"ICT",score:78,grade:"B+"},{subject:"French",score:55,grade:"C+"}], total: 395, average: 65.8, overallGrade: "B",  remarks: "Room for improvement. Try harder.", promoted: true },
  { id: 6,  name: "Emmanuel Kofi Adu",   studentId: "STU-2024-0033", class: "JHS 3", initials: "EK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", position: 38, totalStudents: 54, scores: [{subject:"Mathematics",score:45,grade:"C"},{subject:"English",score:52,grade:"C+"},{subject:"Science",score:48,grade:"C"},{subject:"Social Studies",score:55,grade:"C+"},{subject:"ICT",score:60,grade:"C+"},{subject:"French",score:42,grade:"C"}], total: 302, average: 50.3, overallGrade: "C+", remarks: "Must improve. Extra tuition recommended.", promoted: true },
  { id: 7,  name: "Yaw Antwi Boakye",    studentId: "STU-2024-0016", class: "JHS 3", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", position: 48, totalStudents: 54, scores: [{subject:"Mathematics",score:32,grade:"D"},{subject:"English",score:41,grade:"C"},{subject:"Science",score:38,grade:"D"},{subject:"Social Studies",score:45,grade:"C"},{subject:"ICT",score:52,grade:"C+"},{subject:"French",score:35,grade:"D"}], total: 243, average: 40.5, overallGrade: "D",  remarks: "Very poor. Must repeat if no improvement.", promoted: false },
];

const classes = ["All Classes", "JHS 3", "P6 - Topaz", "P5 - Ruby", "P4 - Emerald"];
const terms   = ["Term 2 2024", "Term 1 2024", "Term 3 2023"];

export default function Results() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<StudentResult>(results[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("JHS 3");
  const [termFilter,  setTermFilter]  = useState("Term 2 2024");
  const [showPanel,   setShowPanel]   = useState(false);

  const filtered = results.filter((r) => {
    const mSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const mClass  = classFilter === "All Classes" || r.class === classFilter;
    return mSearch && mClass;
  });

  const classAvg = Math.round(filtered.reduce((s, r) => s + r.average, 0) / (filtered.length || 1) * 10) / 10;
  const passing  = filtered.filter(r => r.promoted).length;
  const topScore = filtered.length ? Math.max(...filtered.map(r => r.average)) : 0;

  const ResultPanel = () => {
    const og = gradeColor(selected.overallGrade);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Student Results</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast("Report card downloaded", "info"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, display: "flex", gap: 4, alignItems: "center", color: "#374151" }}><Download size={12} />{!isMobile && " Download"}</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Student header */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#f9fafb", borderRadius: 12, padding: "14px" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{selected.studentId} · {selected.class}</div>
              <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{termFilter}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: og.color }}>{selected.overallGrade}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>GRADE</div>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Average",  value: `${selected.average}%`, bg: og.bg, color: og.color },
              { label: "Position", value: `${selected.position}/${selected.totalStudents}`, bg: "#dbeafe", color: "#2563eb" },
              { label: "Status",   value: selected.promoted ? "Promoted" : "Repeat", bg: selected.promoted ? "#dcfce7" : "#fee2e2", color: selected.promoted ? "#16a34a" : "#dc2626" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Subject scores */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 10 }}>SUBJECT SCORES</div>
            {selected.scores.map((sc) => {
              const gc = gradeColor(sc.grade);
              return (
                <div key={sc.subject} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{sc.subject}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{sc.score}%</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: gc.bg, color: gc.color }}>{sc.grade}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${sc.score}%`, height: "100%", background: sc.score >= 75 ? "#16a34a" : sc.score >= 50 ? "#d97706" : "#dc2626", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remarks */}
          <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", borderLeft: `4px solid ${og.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 6 }}>CLASS TEACHER'S REMARKS</div>
            <div style={{ fontSize: 12.5, color: "#374151", fontStyle: "italic" }}>"{selected.remarks}"</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast("Report card printed", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>🖨️ Print Report Card</button>
            <button onClick={() => { showToast(`Results SMS sent to ${selected.name}'s parents`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>📱 Send Results to Parents</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Results</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Academics","Results"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Generating class results sheet...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Download size={14} />{!isMobile && " Export Results"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Students",    value: String(filtered.length), icon: "👨‍🎓", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Class Avg",   value: `${classAvg}%`,          icon: "📊", bg: "#dbeafe", color: "#2563eb" },
          { label: "Passing",     value: `${passing}/${filtered.length}`, icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Top Score",   value: `${topScore}%`,           icon: "🏆", bg: "#fef3c7", color: "#d97706" },
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

      {/* Grade distribution bar */}
      <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Grade Distribution</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["A+","A","B+","B","C+","C","D","F"] as Grade[]).map((g) => {
            const count = filtered.filter(r => r.overallGrade === g).length;
            const gc = gradeColor(g);
            return count > 0 ? (
              <div key={g} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: gc.bg, border: `1px solid ${gc.color}30` }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: gc.color }}>{g}</span>
                <span style={{ fontSize: 11, color: gc.color, fontWeight: 600 }}>{count} student{count!==1?"s":""}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student name or ID..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        {[{ val: classFilter, set: setClassFilter, opts: classes, label: "Class" }, { val: termFilter, set: setTermFilter, opts: terms, label: "Term" }].map(({ val, set, opts }) => (
          <div key={val} style={{ position: "relative" }}>
            <select value={val} onChange={(e) => set(e.target.value)} style={{ appearance: "none", padding: "8px 24px 8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 350px)" }}>
        {/* Ranked list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 320, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>Class Position</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{classFilter} · {termFilter.split(" ").slice(0,2).join(" ")}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {[...filtered].sort((a, b) => a.position - b.position).map((r) => {
                const gc = gradeColor(r.overallGrade);
                const isActive = selected.id === r.id;
                const medal = r.position === 1 ? "🥇" : r.position === 2 ? "🥈" : r.position === 3 ? "🥉" : null;
                return (
                  <div key={r.id} onClick={() => { setSelected(r); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 28, height: 38, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {medal ? <span style={{ fontSize: 18 }}>{medal}</span> : <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af" }}>#{r.position}</span>}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.avatarBg, color: r.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{r.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>Avg: {r.average}%</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: gc.bg, color: gc.color }}>{r.overallGrade}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <ResultPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <ResultPanel />
          </div>
        </div>
      )}
    </div>
  );
}
