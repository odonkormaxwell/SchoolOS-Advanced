import { Calendar } from "lucide-react";

const events = [
  {
    id: 1,
    day: 18,
    month: "MAY",
    title: "PTA Meeting",
    time: "10:00 AM - 12:00 PM",
    color: "#7c3aed",
  },
  {
    id: 2,
    day: 27,
    month: "MAY",
    title: "Mid-Term Exams Begin",
    time: "All Day Event",
    color: "#e11d48",
  },
];

export default function EventsCalendar() {
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
          <Calendar size={14} color="#6b7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Events Calendar</span>
        </div>
        <button style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          View Calendar
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {events.map((e) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Date block */}
            <div
              style={{
                width: 48,
                height: 52,
                borderRadius: 10,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                {e.day}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em" }}>
                {e.month}
              </div>
            </div>

            {/* Event info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: e.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{e.title}</div>
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
