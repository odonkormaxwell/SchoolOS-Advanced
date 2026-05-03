import { Clock, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const schedule = [
  { id: 1, start: "08:00", end: "10:00", time: "08:00 – 10:00 AM", subject: "Mathematics", class: "P6 – Topaz", classColor: "#7c3aed", classBg: "#ede9fe", teacher: "Mr. K. Appiah", status: "done" },
  { id: 2, start: "10:15", end: "12:15", time: "10:15 – 12:15 PM", subject: "English Language", class: "P5 – Diamond", classColor: "#2563eb", classBg: "#dbeafe", teacher: "Ms. A. Mensah", status: "current" },
  { id: 3, start: "13:00", end: "15:00", time: "01:00 – 03:00 PM", subject: "Science", class: "P4 – Ruby", classColor: "#16a34a", classBg: "#dcfce7", teacher: "Mr. E. Osei", status: "upcoming" },
  { id: 4, start: "15:15", end: "16:15", time: "03:15 – 04:15 PM", subject: "Creative Arts", class: "P3 – Emerald", classColor: "#d97706", classBg: "#fef3c7", teacher: "Ms. B. Agyei", status: "upcoming" },
];

export default function TodaySchedule() {
  const { onNavigate, showToast } = useApp();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleClick = (s: typeof schedule[0]) => {
    showToast(`${s.subject} – ${s.class} · ${s.teacher}`, "info");
    onNavigate("timetable");
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} color="#6b7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Today's Schedule</span>
        </div>
        <button onClick={() => onNavigate("timetable")} style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          View Timetable →
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {schedule.map((s) => {
          const isHov = hoveredId === s.id;
          const isCurrent = s.status === "current";
          const isDone = s.status === "done";
          return (
            <div
              key={s.id}
              onClick={() => handleClick(s)}
              onMouseEnter={() => setHoveredId(s.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                background: isCurrent ? "#f5f3ff" : isHov ? "#f9fafb" : "#fafafa",
                border: isCurrent ? "1px solid #c4b5fd" : isHov ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                cursor: "pointer", transition: "all 0.12s",
                opacity: isDone ? 0.65 : 1,
              }}
            >
              {/* Status dot */}
              <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: isCurrent ? "#7c3aed" : isDone ? "#d1d5db" : "#e5e7eb", boxShadow: isCurrent ? "0 0 0 3px #ede9fe" : "none" }} />

              {/* Time */}
              <div style={{ minWidth: 110, fontSize: 10.5, color: isDone ? "#9ca3af" : "#6b7280", whiteSpace: "nowrap" }}>{s.time}</div>

              {/* Divider */}
              <div style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

              {/* Subject */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: isCurrent ? 700 : 600, color: isCurrent ? "#7c3aed" : isDone ? "#9ca3af" : "#111827" }}>{s.subject}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{s.teacher}</div>
              </div>

              {/* Class badge */}
              <div style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: s.classBg, color: s.classColor, whiteSpace: "nowrap" }}>
                {s.class}
              </div>

              {isCurrent && <div style={{ fontSize: 9.5, fontWeight: 700, color: "#7c3aed", background: "#ede9fe", padding: "2px 7px", borderRadius: 10, whiteSpace: "nowrap" }}>NOW</div>}
              {isHov && !isCurrent && <ChevronRight size={13} color="#9ca3af" />}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 500 }}>4 sessions today · 2 upcoming</span>
        <button onClick={() => onNavigate("timetable")} style={{ fontSize: 11, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Full timetable →</button>
      </div>
    </div>
  );
}
