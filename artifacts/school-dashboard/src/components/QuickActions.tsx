import { UserPlus, CalendarCheck, FileText, Bell, CreditCard, BarChart2 } from "lucide-react";

const actions = [
  { id: 1, label: "Add Student", Icon: UserPlus, color: "#7c3aed", bg: "#ede9fe" },
  { id: 2, label: "Take Attendance", Icon: CalendarCheck, color: "#16a34a", bg: "#dcfce7" },
  { id: 3, label: "Create Invoice", Icon: FileText, color: "#2563eb", bg: "#dbeafe" },
  { id: 4, label: "Send Notice", Icon: Bell, color: "#7c3aed", bg: "#ede9fe" },
  { id: 5, label: "Record Payment", Icon: CreditCard, color: "#16a34a", bg: "#dcfce7" },
  { id: 6, label: "View Reports", Icon: BarChart2, color: "#d97706", bg: "#fef3c7" },
];

export default function QuickActions() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #f3f4f6",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 14 }}>
        Quick Actions
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {actions.map(({ id, label, Icon, color, bg }) => (
          <button
            key={id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "12px 8px",
              borderRadius: 10,
              border: "1px solid #f3f4f6",
              background: "white",
              cursor: "pointer",
              transition: "background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = bg;
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "white";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: color,
              }}
            >
              <Icon size={18} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: "#374151", textAlign: "center", lineHeight: 1.3 }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
