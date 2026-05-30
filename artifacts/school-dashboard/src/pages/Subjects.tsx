import { useState } from "react";
import { Plus, Search, ChevronRight, X, BookOpen, Users, Clock, BarChart2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Subject = {
  id: number; name: string; code: string; category: string;
  teacher: string; teacherInitials: string; teacherBg: string; teacherColor: string;
  classes: string[]; periodsPerWeek: number; color: string; bg: string; emoji: string;
  avgScore: number; passRate: number;
  topics: string[]; description: string;
};

const subjects: Subject[] = [
  { id: 1,  name: "Mathematics",         code: "MTH", category: "Core",     teacher: "Mr. K. Mensah",   teacherInitials: "KM", teacherBg: "#bfdbfe", teacherColor: "#1e3a8a", classes: ["P1","P2","P3","P4","P5","P6","JHS1","JHS2","JHS3"], periodsPerWeek: 6, color: "#7c3aed", bg: "#ede9fe", emoji: "➕", avgScore: 72.4, passRate: 85, topics: ["Number & Numeration","Algebra","Geometry","Measurement","Statistics","Probability"],            description: "Covers number theory, algebra, geometry and statistics aligned with the Ghana Mathematics Curriculum for Basic School." },
  { id: 2,  name: "English Language",    code: "ENG", category: "Core",     teacher: "Mrs. A. Asante",  teacherInitials: "AA", teacherBg: "#fce7f3", teacherColor: "#9d174d", classes: ["P1","P2","P3","P4","P5","P6","JHS1","JHS2","JHS3"], periodsPerWeek: 6, color: "#2563eb", bg: "#dbeafe", emoji: "📖", avgScore: 75.1, passRate: 88, topics: ["Reading & Comprehension","Writing & Composition","Grammar","Literature","Oral Communication","Dictation"],    description: "English Language covers the four skills: reading, writing, listening and speaking. Literature and grammar are core components." },
  { id: 3,  name: "Integrated Science",  code: "SCI", category: "Core",     teacher: "Mrs. A. Boateng", teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", classes: ["P4","P5","P6","JHS1","JHS2","JHS3"],               periodsPerWeek: 4, color: "#16a34a", bg: "#dcfce7", emoji: "🔬", avgScore: 68.1, passRate: 79, topics: ["Life Science","Physical Science","Earth Science","Environmental Studies","Laboratory Skills","Scientific Method"],  description: "Integrated Science introduces students to the natural world through practical experiments and theory aligned to WAEC standards." },
  { id: 4,  name: "Social Studies",      code: "SST", category: "Core",     teacher: "Mr. N. Lartey",   teacherInitials: "NL", teacherBg: "#dbeafe", teacherColor: "#1e3a8a", classes: ["P4","P5","P6","JHS1","JHS2","JHS3"],               periodsPerWeek: 4, color: "#d97706", bg: "#fef3c7", emoji: "🌍", avgScore: 74.5, passRate: 91, topics: ["Ghana History","Government & Civics","Geography","Economics","Social Issues","Cultural Studies"],               description: "Social Studies develops students' understanding of society, governance, history and the environment within a Ghanaian context." },
  { id: 5,  name: "ICT",                 code: "ICT", category: "Core",     teacher: "Mr. K. Opoku",    teacherInitials: "KO", teacherBg: "#e0e7ff", teacherColor: "#3730a3", classes: ["P4","P5","P6","JHS1","JHS2","JHS3"],               periodsPerWeek: 2, color: "#0891b2", bg: "#cffafe", emoji: "💻", avgScore: 81.2, passRate: 96, topics: ["Computer Basics","Microsoft Word","Spreadsheets","Internet Safety","Presentations","Basic Programming"],            description: "Information & Communication Technology equips students with digital skills for the modern world, including Microsoft Office tools." },
  { id: 6,  name: "Religious & Moral Ed",code: "RME", category: "Core",     teacher: "Mrs. A. Boateng", teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", classes: ["P1","P2","P3","P4","P5","P6","JHS1","JHS2","JHS3"], periodsPerWeek: 2, color: "#065f46", bg: "#d1fae5", emoji: "🙏", avgScore: 79.3, passRate: 94, topics: ["Christianity","Islam","African Traditional Religion","Moral Values","Prayer","Community Service"],               description: "RME promotes moral development and religious tolerance. Students learn from Christian, Islamic and African traditional perspectives." },
  { id: 7,  name: "French",              code: "FRN", category: "Elective", teacher: "Mme. A. Boakye",  teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", classes: ["JHS1","JHS2","JHS3"],                               periodsPerWeek: 3, color: "#0369a1", bg: "#dbeafe", emoji: "🇫🇷", avgScore: 65.8, passRate: 72, topics: ["Vocabulary","Grammar","Reading","Writing","Conversation","Culture & Civilization"],                             description: "French as a second language for JHS students. Covers all four skills with focus on communication and BECE preparation." },
  { id: 8,  name: "Physical Education",  code: "PE",  category: "Core",     teacher: "Coach A. Gyasi",  teacherInitials: "AG", teacherBg: "#dcfce7", teacherColor: "#15803d", classes: ["P1","P2","P3","P4","P5","P6","JHS1","JHS2","JHS3"], periodsPerWeek: 2, color: "#16a34a", bg: "#dcfce7", emoji: "⚽", avgScore: 88.0, passRate: 98, topics: ["Athletics","Team Sports","Gymnastics","Swimming","Health Fitness","Games & Play"],                                  description: "Physical Education promotes physical fitness, teamwork and healthy lifestyles through sport and exercise activities." },
  { id: 9,  name: "Creative Arts",       code: "CAR", category: "Core",     teacher: "Mr. N. Lartey",   teacherInitials: "NL", teacherBg: "#dbeafe", teacherColor: "#1e3a8a", classes: ["P1","P2","P3","P4","P5","P6"],                     periodsPerWeek: 2, color: "#b45309", bg: "#fef3c7", emoji: "🎨", avgScore: 82.5, passRate: 95, topics: ["Drawing & Painting","Craft Work","Music","Drama","Textile","Visual Arts"],                                         description: "Creative Arts develops artistic skills, cultural expression and creativity across visual, performing and applied arts." },
  { id: 10, name: "Ghanaian Language",   code: "GHL", category: "Core",     teacher: "Mme. A. Boakye",  teacherInitials: "AB", teacherBg: "#fce7f3", teacherColor: "#9d174d", classes: ["P1","P2","P3","P4","P5","P6","JHS1","JHS2","JHS3"], periodsPerWeek: 3, color: "#92400e", bg: "#fef3c7", emoji: "🗣️", avgScore: 71.0, passRate: 82, topics: ["Oral Language","Reading","Writing","Literature","Proverbs","Cultural Heritage"],                                   description: "Ghanaian Language covers Twi as the local language option. Promotes mother-tongue literacy and cultural heritage." },
];

const categories = ["All", "Core", "Elective"];

export default function Subjects() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<Subject>(subjects[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter,   setCatFilter]   = useState("All");
  const [showPanel,   setShowPanel]   = useState(false);

  const filtered = subjects.filter((s) => {
    const mSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat    = catFilter === "All" || s.category === catFilter;
    return mSearch && mCat;
  });

  const core     = subjects.filter(s => s.category === "Core").length;
  const elective = subjects.filter(s => s.category === "Elective").length;
  const avgScore = Math.round(subjects.reduce((a, s) => a + s.avgScore, 0) / subjects.length);

  const SubjectPanel = () => (
    <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Subject Details</span>
        <div style={{ display: "flex", gap: 7 }}>
          {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
          <button onClick={() => showToast("Opening subject editor...", "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Banner */}
        <div style={{ background: `linear-gradient(135deg, ${selected.color}15, ${selected.color}28)`, borderRadius: 12, padding: "20px", textAlign: "center", border: `1px solid ${selected.color}20` }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{selected.emoji}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{selected.name}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Code: {selected.code} · {selected.category} Subject</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: selected.bg, color: selected.color }}>{selected.category}</span>
          </div>
        </div>

        {/* Performance stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Avg Score",  value: `${selected.avgScore}%`,       bg: "#ede9fe", color: "#7c3aed" },
            { label: "Pass Rate",  value: `${selected.passRate}%`,       bg: "#dcfce7", color: "#16a34a" },
            { label: "Periods/Wk",value: `${selected.periodsPerWeek}`,   bg: "#dbeafe", color: "#2563eb" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Teacher */}
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: selected.teacherBg, color: selected.teacherColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{selected.teacherInitials}</div>
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>SUBJECT TEACHER</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.teacher}</div>
          </div>
        </div>

        {/* Classes */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>CLASSES OFFERING THIS SUBJECT</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selected.classes.map((cls) => (
              <span key={cls} style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: selected.bg, color: selected.color, border: `1px solid ${selected.color}30` }}>{cls}</span>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>CURRICULUM TOPICS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {selected.topics.map((topic, i) => (
              <div key={topic} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "#f9fafb", borderRadius: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: selected.bg, color: selected.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 12.5, color: "#374151" }}>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>ABOUT</div>
          <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", fontSize: 12.5, color: "#374151", lineHeight: 1.7 }}>{selected.description}</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => { showToast("Opening gradebook...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📊 View Gradebook</button>
          <button onClick={() => { showToast("Opening timetable...", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>📅 View Timetable Slots</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Subjects</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Academics","Subjects"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Opening add subject form...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Add Subject"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Subjects",  value: String(subjects.length), icon: "📚", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Core Subjects",   value: String(core),            icon: "⭐", bg: "#dbeafe", color: "#2563eb" },
          { label: "Elective",        value: String(elective),        icon: "📖", bg: "#dcfce7", color: "#16a34a" },
          { label: "School Avg Score",value: `${avgScore}%`,          icon: "📊", bg: "#fef3c7", color: "#d97706" },
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

      {/* Search + filter */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subject or teacher..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        {categories.map((c) => (
          <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "7px 14px", border: `1px solid ${catFilter === c ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: catFilter === c ? "#7c3aed" : "white", color: catFilter === c ? "white" : "#374151", fontSize: 12, fontWeight: catFilter === c ? 600 : 400, cursor: "pointer" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 300px)" }}>
        {/* List */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 300, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} subject{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((subj) => {
                const isActive = selected.id === subj.id;
                return (
                  <div key={subj.id} onClick={() => { setSelected(subj); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 12, padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: subj.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{subj.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{subj.name}</div>
                      <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{subj.teacher}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center" }}>
                        <span style={{ fontSize: 10.5, color: subj.color, background: subj.bg, padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>{subj.category}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{subj.periodsPerWeek} periods/wk</span>
                        <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600 }}>{subj.avgScore}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <SubjectPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <SubjectPanel />
          </div>
        </div>
      )}
    </div>
  );
}
