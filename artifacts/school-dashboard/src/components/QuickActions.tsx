import { useState } from "react";
import { UserPlus, CalendarCheck, FileText, Bell, CreditCard, BarChart2 } from "lucide-react";
import { useApp } from "../context/AppContext";

const actions = [
  { id: 1, label: "Add Student", Icon: UserPlus, color: "#7c3aed", bg: "#ede9fe", page: "all-students", toast: "Navigating to student enrollment..." },
  { id: 2, label: "Take Attendance", Icon: CalendarCheck, color: "#16a34a", bg: "#dcfce7", page: "attendance", toast: "Opening attendance sheet..." },
  { id: 3, label: "Create Invoice", Icon: FileText, color: "#2563eb", bg: "#dbeafe", page: "billing", toast: "Opening billing module..." },
  { id: 4, label: "Send Notice", Icon: Bell, color: "#7c3aed", bg: "#ede9fe", page: "communication-hub", toast: "Opening communication hub..." },
  { id: 5, label: "Record Payment", Icon: CreditCard, color: "#16a34a", bg: "#dcfce7", page: "billing", toast: "Payment recorded successfully!" },
  { id: 6, label: "View Reports", Icon: BarChart2, color: "#d97706", bg: "#fef3c7", page: "all-reports", toast: "Loading reports dashboard..." },
];

export default function QuickActions() {
  const { onNavigate, showToast } = useApp();
  const [hovered, setHovered] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);

  const handleAction = (action: typeof actions[0]) => {
    showToast(action.toast, action.id === 5 ? "success" : "info");
    setTimeout(() => onNavigate(action.page), action.id === 5 ? 500 : 0);
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 14 }}>Quick Actions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {actions.map((action) => {
          const { id, label, Icon, color, bg } = action;
          const isHov = hovered === id;
          const isPressed = pressed === id;
          return (
            <button
              key={id}
              onClick={() => handleAction(action)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => { setHovered(null); setPressed(null); }}
              onMouseDown={() => setPressed(id)}
              onMouseUp={() => setPressed(null)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "12px 8px", borderRadius: 10,
                border: isHov ? `1px solid ${color}22` : "1px solid #f3f4f6",
                background: isHov ? bg : "white",
                cursor: "pointer",
                transition: "all 0.15s",
                transform: isPressed ? "scale(0.96)" : isHov ? "translateY(-1px)" : "none",
                boxShadow: isHov ? `0 4px 12px ${color}22` : "none",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: isHov ? color : bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: isHov ? "white" : color,
                transition: "all 0.15s",
              }}>
                <Icon size={18} />
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 500, color: isHov ? color : "#374151", textAlign: "center", lineHeight: 1.3, transition: "color 0.15s" }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
