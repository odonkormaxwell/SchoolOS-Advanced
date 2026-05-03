import { Clock } from "lucide-react";

const schedule = [
  {
    id: 1,
    time: "08:00 AM – 10:00 AM",
    subject: "Mathematics",
    class: "P6 – Topaz",
    classColor: "#7c3aed",
    classBg: "#ede9fe",
    teacher: "Mr. K. Appiah",
  },
  {
    id: 2,
    time: "10:15 AM – 12:15 PM",
    subject: "English Language",
    class: "P5 – Diamond",
    classColor: "#2563eb",
    classBg: "#dbeafe",
    teacher: "Ms. A. Mensah",
  },
];

export default function TodaySchedule() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #f3f4f6",
        flex: 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={14} color="#6b7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Today's Schedule</span>
        </div>
        <button style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          View Timetable
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {schedule.map((s) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#fafafa",
              border: "1px solid #f3f4f6",
            }}
          >
            {/* Time */}
            <div style={{ minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>{s.time}</div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "#e5e7eb", flexShrink: 0 }} />

            {/* Subject */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{s.subject}</div>
            </div>

            {/* Class badge */}
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 20,
                background: s.classBg,
                color: s.classColor,
                whiteSpace: "nowrap",
              }}
            >
              {s.class}
            </div>

            {/* Teacher */}
            <div style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", minWidth: 90, textAlign: "right" }}>
              {s.teacher}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
