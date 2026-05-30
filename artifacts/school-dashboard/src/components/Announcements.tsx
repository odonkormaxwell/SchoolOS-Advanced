import { useState } from "react";
import { Users, CalendarCheck, Bus, ArrowRight, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const initialAnnouncements = [
  { id: 1, title: "PTA Meeting",           description: "There will be a PTA meeting this Saturday, 7th June at 10:00am in the main hall.", time: "2 hours ago",  icon: "pta",  iconBg: "#ede9fe", iconColor: "#7c3aed" },
  { id: 2, title: "End-of-Term Exams",     description: "Term 2 end-of-term examinations begin on 16th June, 2026.",                        time: "1 day ago",   icon: "exam", iconBg: "#dbeafe", iconColor: "#2563eb" },
  { id: 3, title: "School Fees Deadline",  description: "Kindly clear all outstanding Term 2 fees before 13th June 2026.",                   time: "2 days ago",  icon: "bus",  iconBg: "#fef3c7", iconColor: "#d97706" },
];

const iconMap: Record<string, React.ReactNode> = {
  pta:  <Users size={16} />,
  exam: <CalendarCheck size={16} />,
  bus:  <Bus size={16} />,
};

export default function Announcements() {
  const { onNavigate, showToast } = useApp();
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const dismiss = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast("Announcement dismissed", "info");
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Announcements</div>
        <button onClick={() => onNavigate("communication-hub")} style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          View All
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {announcements.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 12.5, padding: "16px 0" }}>
            All caught up! No announcements.
          </div>
        )}
        {announcements.map((a) => (
          <div
            key={a.id}
            onClick={() => onNavigate("communication-hub")}
            onMouseEnter={() => setHoveredId(a.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex", gap: 10, padding: "8px", borderRadius: 8, cursor: "pointer",
              background: hoveredId === a.id ? "#faf5ff" : "transparent",
              border: hoveredId === a.id ? "1px solid #e9d5ff" : "1px solid transparent",
              transition: "background 0.12s, border-color 0.12s",
              position: "relative",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: a.iconBg, color: a.iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {iconMap[a.icon]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{a.title}</div>
              <div style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.5, marginBottom: 3 }}>{a.description}</div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{a.time}</div>
            </div>
            {hoveredId === a.id && (
              <button
                onClick={(e) => dismiss(a.id, e)}
                style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate("communication-hub")}
        style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
      >
        View All Announcements <ArrowRight size={13} />
      </button>
    </div>
  );
}
