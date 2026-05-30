import { useState } from "react";
import { Award, ChevronRight, Check, RotateCcw, ArrowRight, X, UserCheck, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Decision = "promote" | "repeat" | "graduate" | "transfer" | "pending";

interface PromotionStudent {
  id: number;
  name: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  avg: number;
  grade: string;
  attendance: number;
  decision: Decision;
}

interface PromotionClass {
  id: number;
  name: string;
  level: string;
  levelColor: string;
  levelBg: string;
  emoji: string;
  enrolled: number;
  promoteCount: number;
  repeatCount: number;
  graduateCount: number;
  pendingCount: number;
  nextClass: string;
  teacher: string;
  students: PromotionStudent[];
}

const mkSt = (id: number, name: string, ini: string, bg: string, col: string, avg: number, gr: string, att: number, dec: Decision): PromotionStudent =>
  ({ id, name, initials: ini, avatarBg: bg, avatarColor: col, avg, grade: gr, attendance: att, decision: dec });

const promotionClasses: PromotionClass[] = [
  {
    id: 1, name: "KG 1", level: "Kindergarten", levelColor: "#8b5cf6", levelBg: "#ede9fe", emoji: "🎈",
    enrolled: 28, promoteCount: 26, repeatCount: 2, graduateCount: 0, pendingCount: 0, nextClass: "KG 2",
    teacher: "Ms. G. Tetteh",
    students: [
      mkSt(1,"Akosua Pomaa Darko","AP","#fce7f3","#9d174d",82,"A",96,"promote"),
      mkSt(2,"Kofi Bonsu Amponsah","KB","#bfdbfe","#1e3a8a",79,"B+",91,"promote"),
      mkSt(3,"Adjoa Efua Koomson","AE","#fef9c3","#713f12",74,"B+",89,"promote"),
      mkSt(4,"Kwame Yeboah Sarpong","KY","#dcfce7","#14532d",68,"B",87,"promote"),
      mkSt(5,"Abena Owusuaa Nkrumah","AO","#ede9fe","#4c1d95",44,"F",72,"repeat"),
      mkSt(6,"Nana Kweku Asiedu","NK","#dbeafe","#1e3a8a",41,"F",68,"repeat"),
    ],
  },
  {
    id: 2, name: "P6 - Topaz", level: "Primary", levelColor: "#2563eb", levelBg: "#dbeafe", emoji: "📚",
    enrolled: 46, promoteCount: 43, repeatCount: 2, graduateCount: 0, pendingCount: 1, nextClass: "JHS 1",
    teacher: "Mr. K. Mensah",
    students: [
      mkSt(7,"Kofi Junior Asante","KJ","#bfdbfe","#1e3a8a",88,"A",98,"promote"),
      mkSt(8,"Efua Korkor Lamptey","EK","#fce7f3","#9d174d",91,"A",97,"promote"),
      mkSt(9,"Ama Serwaa Ofori","AS","#fce7f3","#9d174d",79,"B+",93,"promote"),
      mkSt(10,"Abena Yaa Darko","AD","#fce7f3","#9d174d",70,"B+",90,"promote"),
      mkSt(11,"Daniel Nii Lartey","DL","#dbeafe","#1e3a8a",66,"B",91,"promote"),
      mkSt(12,"Michael Kojo Addo","MK","#e0e7ff","#3730a3",48,"F",85,"repeat"),
    ],
  },
  {
    id: 3, name: "JHS 2", level: "JHS", levelColor: "#16a34a", levelBg: "#dcfce7", emoji: "🎓",
    enrolled: 52, promoteCount: 49, repeatCount: 3, graduateCount: 0, pendingCount: 0, nextClass: "JHS 3",
    teacher: "Mr. N. Lartey",
    students: [
      mkSt(13,"Kwame Junior Boateng","KB","#bfdbfe","#1e3a8a",84,"A",95,"promote"),
      mkSt(14,"Ama Darko","AD","#fce7f3","#9d174d",81,"A",96,"promote"),
      mkSt(15,"Nana Ama Asante","NA","#dcfce7","#14532d",73,"B+",90,"promote"),
      mkSt(16,"Yaw Adu Boakye","YA","#fef3c7","#78350f",68,"B",88,"promote"),
      mkSt(17,"Fiifi Arhin","FA","#dbeafe","#1e3a8a",43,"F",80,"repeat"),
      mkSt(18,"Cynthia Osei","CO","#ede9fe","#4c1d95",39,"F",77,"repeat"),
    ],
  },
  {
    id: 4, name: "JHS 3", level: "JHS", levelColor: "#16a34a", levelBg: "#dcfce7", emoji: "🏆",
    enrolled: 54, promoteCount: 0, repeatCount: 3, graduateCount: 49, pendingCount: 2, nextClass: "Graduated",
    teacher: "Mr. E. Mensah",
    students: [
      mkSt(19,"Adjoa Mensah","AM","#fce7f3","#9d174d",87.5,"A",98,"graduate"),
      mkSt(20,"Kofi Junior","KJ","#bfdbfe","#1e3a8a",84.5,"A",97,"graduate"),
      mkSt(21,"Ama Serwaa Ofori","AS","#fce7f3","#9d174d",82.8,"A",96,"graduate"),
      mkSt(22,"Daniel Lartey","DL","#dbeafe","#1e3a8a",76.3,"B+",94,"graduate"),
      mkSt(23,"Kwame Asante","KA","#bfdbfe","#1e3a8a",65.8,"B",92,"graduate"),
      mkSt(24,"Yaw Antwi Boakye","YA","#fef9c3","#713f12",41.8,"F",78,"repeat"),
    ],
  },
];

const DECISION_STYLE: Record<Decision, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  promote:   { label: "Promote",   color: "#15803d", bg: "#dcfce7", icon: <ArrowRight size={11} />    },
  graduate:  { label: "Graduate",  color: "#7c3aed", bg: "#ede9fe", icon: <GraduationCap size={11} /> },
  repeat:    { label: "Repeat",    color: "#d97706", bg: "#fef3c7", icon: <RotateCcw size={11} />     },
  transfer:  { label: "Transfer",  color: "#6b7280", bg: "#f3f4f6", icon: <ArrowRight size={11} />    },
  pending:   { label: "Pending",   color: "#9ca3af", bg: "#f9fafb", icon: <AlertCircle size={11} />   },
};

export default function StudentPromotion() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [classes, setClasses] = useState(promotionClasses);
  const [selectedClass, setSelectedClass] = useState<PromotionClass>(promotionClasses[3]);
  const [showPanel, setShowPanel] = useState(!isMobile);

  const totalStudents  = classes.reduce((s, c) => s + c.enrolled, 0);
  const totalGraduating = classes.reduce((s, c) => s + c.graduateCount, 0);
  const totalPromoting = classes.reduce((s, c) => s + c.promoteCount, 0);
  const totalPending   = classes.reduce((s, c) => s + c.pendingCount, 0);

  const updateDecision = (classId: number, studentId: number, decision: Decision) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id !== classId ? c : {
          ...c,
          students: c.students.map((s) => s.id !== studentId ? s : { ...s, decision }),
        }
      )
    );
    if (selectedClass.id === classId) {
      setSelectedClass((prev) => ({
        ...prev,
        students: prev.students.map((s) => s.id !== studentId ? s : { ...s, decision }),
      }));
    }
  };

  const applyAll = (classId: number, decision: Decision) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id !== classId ? c : { ...c, students: c.students.map((s) => ({ ...s, decision })) }
      )
    );
    if (selectedClass.id === classId) {
      setSelectedClass((prev) => ({ ...prev, students: prev.students.map((s) => ({ ...s, decision })) }));
    }
    showToast(`All students in ${selectedClass.name} marked as ${decision}`, "success");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 18 : 21, fontWeight: 800, color: "#111827", margin: "0 0 3px" }}>Student Promotion</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Review and apply promotion decisions — Term 2, 2025/2026 · Happy Kids Basic School</p>
        </div>
        <button onClick={() => showToast("Promotions applied — academic year transition initiated", "success")}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
          <Award size={14} /> Apply All Promotions
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total Students",  value: String(totalStudents),  icon: <UserCheck size={18} />, bg: "#ede9fe", color: "#7c3aed" },
          { label: "Graduating",       value: String(totalGraduating), icon: <GraduationCap size={18} />, bg: "#dcfce7", color: "#15803d" },
          { label: "Being Promoted",   value: String(totalPromoting),  icon: <TrendingUp size={18} />, bg: "#dbeafe", color: "#2563eb" },
          { label: "Decisions Pending",value: String(totalPending),    icon: <AlertCircle size={18} />, bg: "#fef3c7", color: "#d97706" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: k.bg, color: k.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <AlertCircle size={14} color="#d97706" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: "#78350f" }}>
          Promotions are <strong>irreversible</strong> once the academic year transition is applied. Review carefully before clicking "Apply All Promotions". No student records are deleted — archived students remain accessible.
        </span>
      </div>

      {/* Two-panel */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 14, alignItems: "start" }}>
        {/* Class list */}
        {(!isMobile || !showPanel) && (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", fontSize: 12.5, fontWeight: 700, color: "#374151" }}>
              {classes.length} Classes · Select to Review
            </div>
            {classes.map((c) => {
              const isSelected = selectedClass.id === c.id;
              const pct = Math.round(((c.promoteCount + c.graduateCount) / c.enrolled) * 100);
              return (
                <div key={c.id} onClick={() => { setSelectedClass(c); setShowPanel(true); }}
                  style={{ padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isSelected ? "#f5f3ff" : "white", transition: "background 0.12s" }}
                  onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                  onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "white"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#7c3aed" : "#111827" }}>
                        {c.emoji} {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{c.enrolled} students · {c.teacher}</div>
                    </div>
                    <div style={{ display: "flex", gap: 3, flexShrink: 0, marginLeft: 6 }}>
                      {c.pendingCount > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 10, background: "#fef3c7", color: "#d97706" }}>{c.pendingCount} pending</span>
                      )}
                      <ChevronRight size={13} color={isSelected ? "#7c3aed" : "#9ca3af"} />
                    </div>
                  </div>
                  <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c.id === 4 ? "#7c3aed" : "#16a34a", borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 3 }}>
                    {pct}% decisions made → {c.nextClass}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Student panel */}
        {(!isMobile || showPanel) && (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            {/* Panel header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                  {selectedClass.emoji} {selectedClass.name} → <span style={{ color: "#7c3aed" }}>{selectedClass.nextClass}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{selectedClass.enrolled} students · {selectedClass.teacher}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {isMobile && <button onClick={() => setShowPanel(false)} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", fontSize: 11.5, cursor: "pointer", color: "#374151" }}>← Back</button>}
                {selectedClass.id === 4 ? (
                  <button onClick={() => applyAll(selectedClass.id, "graduate")}
                    style={{ padding: "6px 12px", border: "none", borderRadius: 7, background: "#ede9fe", color: "#7c3aed", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                    <GraduationCap size={12} style={{ marginRight: 5 }} />Graduate All
                  </button>
                ) : (
                  <button onClick={() => applyAll(selectedClass.id, "promote")}
                    style={{ padding: "6px 12px", border: "none", borderRadius: 7, background: "#dcfce7", color: "#15803d", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                    ✓ Promote All
                  </button>
                )}
              </div>
            </div>

            {/* Student rows */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                    {["#","Student","Avg Score","Grade","Attendance","Decision","Action"].map((h) => (
                      <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.students.map((s, i) => {
                    const ds = DECISION_STYLE[s.decision];
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                        <td style={{ padding: "10px 12px", color: "#9ca3af", fontWeight: 500 }}>{i + 1}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.avatarBg, color: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{s.initials}</div>
                            <span style={{ fontWeight: 600, color: "#111827" }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: s.avg >= 80 ? "#16a34a" : s.avg >= 50 ? "#374151" : "#dc2626" }}>{s.avg}%</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: s.avg >= 80 ? "#dcfce7" : s.avg >= 70 ? "#dbeafe" : s.avg >= 50 ? "#fef3c7" : "#fee2e2", color: s.avg >= 80 ? "#16a34a" : s.avg >= 70 ? "#2563eb" : s.avg >= 50 ? "#d97706" : "#dc2626" }}>{s.grade}</span>
                        </td>
                        <td style={{ padding: "10px 12px", color: s.attendance >= 90 ? "#16a34a" : s.attendance >= 75 ? "#d97706" : "#dc2626", fontWeight: 600 }}>{s.attendance}%</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: ds.bg, color: ds.color }}>
                            {ds.icon}{ds.label}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <select
                            value={s.decision}
                            onChange={(e) => updateDecision(selectedClass.id, s.id, e.target.value as Decision)}
                            style={{ fontSize: 12, padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", color: "#374151" }}>
                            {selectedClass.id === 4 ? (
                              <>
                                <option value="graduate">Graduate</option>
                                <option value="repeat">Repeat JHS 3</option>
                                <option value="transfer">Transfer</option>
                              </>
                            ) : (
                              <>
                                <option value="promote">Promote → {selectedClass.nextClass}</option>
                                <option value="repeat">Repeat {selectedClass.name}</option>
                                <option value="transfer">Transfer Out</option>
                              </>
                            )}
                            <option value="pending">Pending Decision</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Panel footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["promote","graduate","repeat","transfer","pending"] as Decision[]).map((d) => {
                const count = selectedClass.students.filter((s) => s.decision === d).length;
                if (!count) return null;
                const ds = DECISION_STYLE[d];
                return (
                  <span key={d} style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: ds.bg, color: ds.color }}>
                    {count} {ds.label}
                  </span>
                );
              })}
              <span style={{ fontSize: 11.5, color: "#9ca3af", marginLeft: "auto" }}>
                Showing {selectedClass.students.length} of {selectedClass.enrolled} students (demo data)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
