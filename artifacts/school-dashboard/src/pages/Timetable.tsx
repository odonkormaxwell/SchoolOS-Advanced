import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Printer, Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const periods = [
  { label: "Period 1", time: "07:30 – 08:10" },
  { label: "Period 2", time: "08:10 – 08:50" },
  { label: "Period 3", time: "08:50 – 09:30" },
  { label: "Break",   time: "09:30 – 09:50", isBreak: true },
  { label: "Period 4", time: "09:50 – 10:30" },
  { label: "Period 5", time: "10:30 – 11:10" },
  { label: "Period 6", time: "11:10 – 11:50" },
  { label: "Lunch",   time: "11:50 – 12:20", isBreak: true },
  { label: "Period 7", time: "12:20 – 13:00" },
  { label: "Period 8", time: "13:00 – 13:40" },
];

type Subject = { name: string; teacher: string; color: string; bg: string; room: string };

const subjects: Record<string, Subject> = {
  english:   { name: "English Language", teacher: "Mrs. Akua Asante",   color: "#1d4ed8", bg: "#dbeafe", room: "Room 6A" },
  maths:     { name: "Mathematics",      teacher: "Mr. Kwame Mensah",   color: "#15803d", bg: "#dcfce7", room: "Room 6A" },
  science:   { name: "Integrated Science", teacher: "Mrs. Ama Boateng", color: "#b45309", bg: "#fef3c7", room: "Lab 1"   },
  social:    { name: "Social Studies",   teacher: "Mr. Nii Lartey",     color: "#6d28d9", bg: "#ede9fe", room: "Room 6A" },
  ict:       { name: "ICT",             teacher: "Mr. Kweku Opoku",    color: "#0369a1", bg: "#e0f2fe", room: "ICT Lab"  },
  rme:       { name: "RME",             teacher: "Pastor Daniel Yaw",  color: "#b91c1c", bg: "#fee2e2", room: "Room 6A" },
  french:    { name: "French",          teacher: "Mme. Adwoa Boakye",  color: "#0891b2", bg: "#cffafe", room: "Room 6B" },
  ghanaian:  { name: "Ghanaian Lang.", teacher: "Mr. Samuel Darko",   color: "#92400e", bg: "#fef9c3", room: "Room 6A" },
  bdt:       { name: "BDT",            teacher: "Mr. Emmanuel Brew",  color: "#065f46", bg: "#d1fae5", room: "Workshop" },
  pe:        { name: "P.E.",           teacher: "Coach Albert Gyasi", color: "#7c3aed", bg: "#f3e8ff", room: "Field"    },
};

const timetable: (keyof typeof subjects | null)[][][] = [
  // Each row = period, each column = day
  // period 0 (Period 1)
  [["english"], ["maths"], ["science"], ["social"], ["ict"]],
  // period 1 (Period 2)
  [["maths"], ["english"], ["social"], ["ict"], ["science"]],
  // period 2 (Period 3)
  [["science"], ["rme"], ["maths"], ["english"], ["ghanaian"]],
  // break
  [[null], [null], [null], [null], [null]],
  // period 4
  [["social"], ["french"], ["ict"], ["maths"], ["english"]],
  // period 5
  [["ict"], ["ghanaian"], ["french"], ["science"], ["maths"]],
  // period 6
  [["rme"], ["bdt"], ["english"], ["french"], ["social"]],
  // lunch
  [[null], [null], [null], [null], [null]],
  // period 7
  [["pe"], ["ict"], ["bdt"], ["rme"], ["french"]],
  // period 8
  [["ghanaian"], ["science"], ["rme"], ["bdt"], ["pe"]],
];

const classes = ["P6 - Topaz", "P6 - Diamond", "P5 - Ruby", "P5 - Sapphire", "P4 - Emerald", "P3 - Pearl", "P2 - Coral", "P1 - Jasper"];
const terms = ["First Term (2024/2025)", "Second Term", "Third Term"];

const CURRENT_PERIOD_IDX = 4;
const CURRENT_DAY_IDX = 2;

export default function Timetable() {
  const { showToast } = useApp();
  const { isMobile, isTablet } = useWindowSize();

  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [activeDay, setActiveDay] = useState(CURRENT_DAY_IDX);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const handlePrint = () => showToast("Printing timetable for " + selectedClass + "...", "info");
  const handleAdd = () => showToast("Opening timetable editor...", "info");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Timetable</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Academics", "Timetable"].map((c, i, a) => (
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
            <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Printer size={13} color="#6b7280" /> Print
            </button>
          )}
          <button onClick={handleAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Plus size={14} />{!isMobile && " Edit Schedule"}
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <label style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 4 }}>CLASS</label>
          <div style={{ position: "relative" }}>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ appearance: "none", padding: "8px 28px 8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", fontWeight: 600, background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
              {classes.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} color="#9ca3af" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 4 }}>TERM</label>
          <div style={{ position: "relative" }}>
            <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} style={{ appearance: "none", padding: "8px 28px 8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
              {terms.map((t) => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={12} color="#9ca3af" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Currently: Period 4 · Mathematics</span>
        </div>
      </div>

      {/* Mobile: Day Tabs */}
      {isMobile && (
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 3, marginBottom: 12 }}>
          {shortDays.map((d, i) => (
            <button key={d} onClick={() => setActiveDay(i)} style={{ flex: 1, padding: "8px 4px", fontSize: 12, fontWeight: activeDay === i ? 700 : 400, color: activeDay === i ? "white" : i === CURRENT_DAY_IDX ? "#7c3aed" : "#6b7280", background: activeDay === i ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", position: "relative" }}>
              {d}
              {i === CURRENT_DAY_IDX && activeDay !== i && <div style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#7c3aed" }} />}
            </button>
          ))}
        </div>
      )}

      {/* Mobile: Day schedule as list */}
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {periods.map((period, pIdx) => {
            const subjKey = timetable[pIdx][activeDay][0];
            const subj = subjKey ? subjects[subjKey] : null;

            if (period.isBreak) {
              return (
                <div key={pIdx} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 16 }}>{period.label === "Break" ? "☕" : "🍽️"}</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#6b7280" }}>{period.label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{period.time}</div>
                  </div>
                </div>
              );
            }

            const isCurrent = pIdx === CURRENT_PERIOD_IDX && activeDay === CURRENT_DAY_IDX;

            return (
              <div key={pIdx} style={{ background: isCurrent ? (subj?.bg || "white") : "white", border: `1px solid ${isCurrent ? (subj?.color || "#7c3aed") + "40" : "#f3f4f6"}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", boxShadow: isCurrent ? `0 0 0 2px ${subj?.color || "#7c3aed"}20` : "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: isCurrent ? (subj?.color || "#7c3aed") : "#9ca3af" }}>{period.label}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{period.time.split("–")[0].trim()}</div>
                </div>
                {subj ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: subj.color }}>{subj.name}</div>
                    <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1 }}>{subj.teacher}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{subj.room}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12.5, color: "#9ca3af" }}>Free Period</div>
                )}
                {isCurrent && <div style={{ fontSize: 10, fontWeight: 700, color: subj?.color || "#7c3aed", background: (subj?.bg || "#ede9fe"), padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}>NOW</div>}
              </div>
            );
          })}
        </div>
      ) : (
        /* Desktop grid */
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: "12px 14px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", width: 120, borderBottom: "1px solid #f3f4f6" }}>PERIOD</th>
                  {days.map((day, i) => (
                    <th key={day} style={{ padding: "12px 10px", fontSize: 12, fontWeight: 700, textAlign: "center", borderBottom: "1px solid #f3f4f6", color: i === CURRENT_DAY_IDX ? "#7c3aed" : "#374151", background: i === CURRENT_DAY_IDX ? "#f5f3ff" : "transparent" }}>
                      <div>{day}</div>
                      {i === CURRENT_DAY_IDX && <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 500, marginTop: 2 }}>Today</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period, pIdx) => {
                  if (period.isBreak) {
                    return (
                      <tr key={pIdx} style={{ background: "#fafafa" }}>
                        <td colSpan={6} style={{ padding: "8px 14px", borderBottom: "1px solid #f3f4f6" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14 }}>{period.label === "Break" ? "☕" : "🍽️"}</span>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>{period.label}</span>
                            <span style={{ fontSize: 11, color: "#d1d5db" }}>·</span>
                            <span style={{ fontSize: 11, color: "#9ca3af" }}>{period.time}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={pIdx} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>{period.label}</div>
                        <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{period.time}</div>
                      </td>
                      {days.map((day, dIdx) => {
                        const subjKey = timetable[pIdx][dIdx][0];
                        const subj = subjKey ? subjects[subjKey] : null;
                        const isCurrent = pIdx === CURRENT_PERIOD_IDX && dIdx === CURRENT_DAY_IDX;
                        const cellKey = `${pIdx}-${dIdx}`;
                        const isHovered = hoveredCell === cellKey;

                        return (
                          <td key={day} style={{ padding: "6px 8px", background: dIdx === CURRENT_DAY_IDX ? "#faf9ff" : "transparent" }}
                            onMouseEnter={() => setHoveredCell(cellKey)}
                            onMouseLeave={() => setHoveredCell(null)}>
                            {subj ? (
                              <div style={{ padding: "8px 10px", borderRadius: 8, background: isCurrent ? subj.bg : isHovered ? subj.bg + "80" : "#fafafa", border: `1px solid ${isCurrent ? subj.color + "40" : isHovered ? subj.color + "30" : "#f3f4f6"}`, cursor: "pointer", transition: "all 0.12s", boxShadow: isCurrent ? `0 0 0 2px ${subj.color}20` : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: subj.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>{subj.name.length > 16 ? subj.name.slice(0, 15) + "…" : subj.name}</span>
                                  {isCurrent && <span style={{ fontSize: 9, fontWeight: 700, background: subj.color, color: "white", padding: "1px 5px", borderRadius: 8, flexShrink: 0 }}>NOW</span>}
                                </div>
                                <div style={{ fontSize: 10.5, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subj.teacher.split(" ").slice(0, 2).join(" ")}</div>
                                <div style={{ fontSize: 10, color: "#9ca3af" }}>{subj.room}</div>
                              </div>
                            ) : (
                              <div style={{ padding: "8px 10px", borderRadius: 8, background: "#fafafa", border: "1px dashed #e5e7eb", color: "#d1d5db", fontSize: 11, textAlign: "center" }}>—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subject Legend */}
      <div style={{ marginTop: 16, background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Subject Legend</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(subjects).map(([key, subj]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 20, background: subj.bg, border: `1px solid ${subj.color}20` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: subj.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: subj.color, fontWeight: 600 }}>{subj.name.length > 18 ? subj.name.slice(0, 16) + "…" : subj.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Periods / Week", value: "40", icon: "📅", color: "#7c3aed", bg: "#ede9fe" },
          { label: "Subjects",       value: `${Object.keys(subjects).length}`, icon: "📚", color: "#2563eb", bg: "#dbeafe" },
          { label: "Class Teacher",  value: "Mr. K. Appiah", icon: "👨‍🏫", color: "#16a34a", bg: "#dcfce7" },
          { label: "Next Period",    value: "Period 5 · ICT", icon: "⏱️", color: "#d97706", bg: "#fef3c7" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
