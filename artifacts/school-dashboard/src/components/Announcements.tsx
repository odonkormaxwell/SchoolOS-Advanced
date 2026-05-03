import { Users, CalendarCheck, Bus, ArrowRight } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "PTA Meeting",
    description: "There will be a PTA meeting this Saturday, 18th May at 10:00am.",
    time: "2 hours ago",
    icon: "pta",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: 2,
    title: "Mid-Term Exams",
    description: "Mid-term examinations begin on 27th May, 2024.",
    time: "1 day ago",
    icon: "exam",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: 3,
    title: "Bus Routes Update",
    description: "Please check the new bus routes effective Monday, 20th May.",
    time: "2 days ago",
    icon: "bus",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  pta: <Users size={16} />,
  exam: <CalendarCheck size={16} />,
  bus: <Bus size={16} />,
};

export default function Announcements() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Announcements</div>
        <button style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          View All
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {announcements.map((a) => (
          <div key={a.id} style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: a.iconBg,
                color: a.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {iconMap[a.icon]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 2 }}>
                {a.title}
              </div>
              <div style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.5, marginBottom: 3 }}>
                {a.description}
              </div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          color: "#7c3aed",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
          padding: 0,
        }}
      >
        View All Announcements <ArrowRight size={13} />
      </button>
    </div>
  );
}
