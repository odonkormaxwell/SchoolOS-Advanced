import { useState } from "react";
import { Plus, Search, ChevronRight, X, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type ClassLevel = "Nursery" | "Kindergarten" | "Primary" | "JHS";

type SchoolClass = {
  id: number; name: string; level: ClassLevel; section: string;
  classTeacher: string; teacherInitials: string; teacherBg: string; teacherColor: string;
  enrolled: number; capacity: number; boys: number; girls: number;
  room: string; avgAttendance: number; avgScore: number;
  subjects: string[]; topStudent: string;
};

const classes: SchoolClass[] = [
  { id: 1,  name: "Nursery 1",    level: "Nursery",       section: "A", classTeacher: "Mrs. A. Asante",  teacherInitials: "AA", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 22, capacity: 25, boys: 12, girls: 10, room: "Room 1",  avgAttendance: 91, avgScore: 85, subjects: ["Numeracy","Literacy","Creative Arts","Play Activities"], topStudent: "Abena Asare" },
  { id: 2,  name: "Nursery 2",    level: "Nursery",       section: "A", classTeacher: "Mrs. A. Boateng", teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 25, capacity: 25, boys: 13, girls: 12, room: "Room 2",  avgAttendance: 89, avgScore: 82, subjects: ["Numeracy","Literacy","Creative Arts","Play Activities"], topStudent: "Kwame Adu" },
  { id: 3,  name: "KG 1",         level: "Kindergarten",  section: "A", classTeacher: "Ms. G. Tetteh",   teacherInitials: "GT", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 28, capacity: 30, boys: 14, girls: 14, room: "Room 3",  avgAttendance: 88, avgScore: 79, subjects: ["Mathematics","English","Creative Arts","Physical Education","RME"], topStudent: "Ama Owusu" },
  { id: 4,  name: "KG 2",         level: "Kindergarten",  section: "A", classTeacher: "Mrs. A. Aidoo",   teacherInitials: "AA", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 30, capacity: 30, boys: 16, girls: 14, room: "Room 4",  avgAttendance: 90, avgScore: 81, subjects: ["Mathematics","English","Creative Arts","Physical Education","RME"], topStudent: "Yaw Darko Jr" },
  { id: 5,  name: "P1",           level: "Primary",       section: "A", classTeacher: "Mr. N. Lartey",   teacherInitials: "NL", teacherBg: "#dbeafe", teacherColor: "#1e3a8a", enrolled: 35, capacity: 40, boys: 18, girls: 17, room: "Block A, Room 1", avgAttendance: 93, avgScore: 76, subjects: ["Mathematics","English","Ghanaian Language","Creative Arts","PE","RME"], topStudent: "Esi Mensah" },
  { id: 6,  name: "P2",           level: "Primary",       section: "A", classTeacher: "Mrs. A. Asante",  teacherInitials: "AA", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 38, capacity: 40, boys: 20, girls: 18, room: "Block A, Room 2", avgAttendance: 92, avgScore: 74, subjects: ["Mathematics","English","Ghanaian Language","Creative Arts","PE","RME"], topStudent: "Daniel Lartey" },
  { id: 7,  name: "P3",           level: "Primary",       section: "A", classTeacher: "Mr. K. Mensah",   teacherInitials: "KM", teacherBg: "#bfdbfe", teacherColor: "#1e3a8a", enrolled: 40, capacity: 40, boys: 21, girls: 19, room: "Block A, Room 3", avgAttendance: 94, avgScore: 78, subjects: ["Mathematics","English","Ghanaian Language","Creative Arts","PE","RME"], topStudent: "Adjoa Asante" },
  { id: 8,  name: "P4 - Emerald", level: "Primary",       section: "A", classTeacher: "Mr. K. Opoku",    teacherInitials: "KO", teacherBg: "#e0e7ff", teacherColor: "#3730a3", enrolled: 42, capacity: 45, boys: 22, girls: 20, room: "Block B, Room 1", avgAttendance: 91, avgScore: 72, subjects: ["Mathematics","English","Social Studies","Science","ICT","PE","RME","Ghanaian Language"], topStudent: "Yaw Antwi" },
  { id: 9,  name: "P5 - Ruby",    level: "Primary",       section: "A", classTeacher: "Mme. A. Boakye",  teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 44, capacity: 45, boys: 23, girls: 21, room: "Block B, Room 2", avgAttendance: 90, avgScore: 73, subjects: ["Mathematics","English","Social Studies","Science","ICT","PE","RME","Ghanaian Language"], topStudent: "Ama Serwaa Ofori" },
  { id: 10, name: "P6 - Topaz",   level: "Primary",       section: "A", classTeacher: "Mr. K. Mensah",   teacherInitials: "KM", teacherBg: "#bfdbfe", teacherColor: "#1e3a8a", enrolled: 46, capacity: 50, boys: 24, girls: 22, room: "Block B, Room 3", avgAttendance: 92, avgScore: 75, subjects: ["Mathematics","English","Social Studies","Science","ICT","PE","RME","Ghanaian Language"], topStudent: "Abena Yaa Darko" },
  { id: 11, name: "JHS 1",        level: "JHS",           section: "A", classTeacher: "Mrs. A. Boateng", teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", enrolled: 50, capacity: 55, boys: 26, girls: 24, room: "Block C, Room 1", avgAttendance: 88, avgScore: 71, subjects: ["Mathematics","English","Science","Social Studies","ICT","French","PE","RME","Ghanaian Language"], topStudent: "Emmanuel Kofi Adu" },
  { id: 12, name: "JHS 2",        level: "JHS",           section: "A", classTeacher: "Mr. N. Lartey",   teacherInitials: "NL", teacherBg: "#dbeafe", teacherColor: "#1e3a8a", enrolled: 52, capacity: 55, boys: 27, girls: 25, room: "Block C, Room 2", avgAttendance: 87, avgScore: 69, subjects: ["Mathematics","English","Science","Social Studies","ICT","French","PE","RME","Ghanaian Language"], topStudent: "Kwame Asante" },
  { id: 13, name: "JHS 3",        level: "JHS",           section: "A", classTeacher: "Mr. E. Mensah",   teacherInitials: "EM", teacherBg: "#ede9fe", teacherColor: "#6d28d9", enrolled: 54, capacity: 55, boys: 28, girls: 26, room: "Block C, Room 3", avgAttendance: 90, avgScore: 83, subjects: ["Mathematics","English","Science","Social Studies","ICT","French","PE","RME","Ghanaian Language"], topStudent: "Adjoa Mensah" },
];

const levelStyle: Record<ClassLevel, { color: string; bg: string; emoji: string }> = {
  Nursery:       { color: "#ec4899", bg: "#fce7f3", emoji: "🌸" },
  Kindergarten:  { color: "#8b5cf6", bg: "#ede9fe", emoji: "🎈" },
  Primary:       { color: "#2563eb", bg: "#dbeafe", emoji: "📚" },
  JHS:           { color: "#16a34a", bg: "#dcfce7", emoji: "🎓" },
};

const levels: ClassLevel[] = ["Nursery", "Kindergarten", "Primary", "JHS"];

export default function Classes() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<SchoolClass>(classes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [showPanel,   setShowPanel]   = useState(false);

  const filtered = classes.filter((c) => {
    const mSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.classTeacher.toLowerCase().includes(searchQuery.toLowerCase());
    const mLevel  = levelFilter === "All" || c.level === levelFilter;
    return mSearch && mLevel;
  });

  const totalEnrolled = classes.reduce((s, c) => s + c.enrolled, 0);
  const totalCapacity = classes.reduce((s, c) => s + c.capacity, 0);
  const avgAttendance = Math.round(classes.reduce((s, c) => s + c.avgAttendance, 0) / classes.length);

  const ClassPanel = () => {
    const ls   = levelStyle[selected.level];
    const util = Math.round((selected.enrolled / selected.capacity) * 100);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Class Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast("Opening class editor...", "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Banner */}
          <div style={{ background: `linear-gradient(135deg, ${ls.color}18, ${ls.color}30)`, borderRadius: 14, padding: "20px", textAlign: "center", border: `1px solid ${ls.color}25` }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>{ls.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#111827" }}>{selected.name}</div>
            <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 3 }}>Section {selected.section} · {selected.level} · {selected.room}</div>
            <span style={{ display: "inline-block", marginTop: 8, fontSize: 11.5, fontWeight: 700, padding: "4px 14px", borderRadius: 20, background: ls.bg, color: ls.color }}>{selected.level}</span>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Enrolled",    value: String(selected.enrolled),            bg: "#ede9fe", color: "#7c3aed" },
              { label: "Avg Score",   value: `${selected.avgScore}%`,              bg: "#dbeafe", color: "#2563eb" },
              { label: "Attendance",  value: `${selected.avgAttendance}%`,         bg: "#dcfce7", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Gender split */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Gender Split</span>
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{selected.boys} Boys · {selected.girls} Girls</span>
            </div>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${Math.round((selected.boys / selected.enrolled) * 100)}%`, height: "100%", background: "#2563eb", borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} /><span style={{ fontSize: 11, color: "#6b7280" }}>Boys {Math.round((selected.boys/selected.enrolled)*100)}%</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ec4899" }} /><span style={{ fontSize: 11, color: "#6b7280" }}>Girls {Math.round((selected.girls/selected.enrolled)*100)}%</span></div>
            </div>
          </div>

          {/* Capacity */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Classroom Capacity</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: util > 90 ? "#dc2626" : "#374151" }}>{selected.enrolled}/{selected.capacity} ({util}%)</span>
            </div>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${util}%`, height: "100%", background: util > 90 ? "#dc2626" : util > 75 ? "#d97706" : "#16a34a", borderRadius: 4 }} />
            </div>
          </div>

          {/* Teacher */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: selected.teacherBg, color: selected.teacherColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{selected.teacherInitials}</div>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>CLASS TEACHER</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.classTeacher}</div>
            </div>
          </div>

          {/* Top student */}
          <div style={{ background: "#fef9c3", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center", border: "1px solid #fde68a" }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <div>
              <div style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}>TOP STUDENT</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.topStudent}</div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>SUBJECTS OFFERED</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {selected.subjects.map((s) => (
                <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: ls.bg, color: ls.color, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast("Opening class register...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📋 View Class Register</button>
            <button onClick={() => { showToast("Opening attendance sheet...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>📊 Attendance Report</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Classes</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Academics","Classes"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Opening add class form...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Add Class"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Classes",   value: String(classes.length), icon: "🏫", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Total Enrolled",  value: String(totalEnrolled),  icon: "👨‍🎓", bg: "#dbeafe", color: "#2563eb" },
          { label: "Avg Attendance",  value: `${avgAttendance}%`,    icon: "📊", bg: "#dcfce7", color: "#16a34a" },
          { label: "Capacity Used",   value: `${Math.round((totalEnrolled/totalCapacity)*100)}%`, icon: "📐", bg: "#fef3c7", color: "#d97706" },
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
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search class or teacher..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        {["All", ...levels].map((l) => {
          const ls = l !== "All" ? levelStyle[l as ClassLevel] : { color: "#7c3aed", bg: "#ede9fe" };
          return (
            <button key={l} onClick={() => setLevelFilter(l)} style={{ padding: "6px 12px", border: `1px solid ${levelFilter===l?ls.color:"#e5e7eb"}`, borderRadius: 8, background: levelFilter===l?ls.bg:"white", color: levelFilter===l?ls.color:"#374151", fontSize: 12, fontWeight: levelFilter===l?700:400, cursor: "pointer" }}>
              {l !== "All" && levelStyle[l as ClassLevel].emoji + " "}{l}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 300px)" }}>
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 300, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} class{filtered.length!==1?"es":""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((cls) => {
                const ls = levelStyle[cls.level];
                const isActive = selected.id === cls.id;
                const util = Math.round((cls.enrolled / cls.capacity) * 100);
                return (
                  <div key={cls.id} onClick={() => { setSelected(cls); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 12, padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: ls.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{ls.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{cls.name}</div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{cls.classTeacher}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#6b7280" }}><Users size={11} /> {cls.enrolled}/{cls.capacity}</span>
                        <span style={{ fontSize: 11, color: cls.avgScore >= 75 ? "#16a34a" : "#d97706", fontWeight: 600 }}>{cls.avgScore}% avg</span>
                        <span style={{ fontSize: 10.5, color: ls.color, background: ls.bg, padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>{cls.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <ClassPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "82vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <ClassPanel />
          </div>
        </div>
      )}
    </div>
  );
}
