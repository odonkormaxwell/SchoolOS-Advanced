import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const payments = [
  { id: 1, name: "Nana Ama Owusu", class: "P4 - Ruby", amount: "GH₵ 2,400", status: "Paid", time: "Today, 08:35 AM", initials: "NA", avatarBg: "#fde68a", avatarColor: "#92400e" },
  { id: 2, name: "Kofi Asante", class: "P6 - Topaz", amount: "GH₵ 1,800", status: "Paid", time: "Today, 08:12 AM", initials: "KA", avatarBg: "#bbf7d0", avatarColor: "#14532d" },
  { id: 3, name: "Akosua Mensah", class: "P2 - Pearl", amount: "GH₵ 1,600", status: "Paid", time: "Today, 07:45 AM", initials: "AM", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: 4, name: "Yaw Addo", class: "P5 - Diamond", amount: "GH₵ 2,400", status: "Paid", time: "Yesterday, 06:30 PM", initials: "YA", avatarBg: "#e9d5ff", avatarColor: "#581c87" },
  { id: 5, name: "Abena Boateng", class: "P1 - Coral", amount: "GH₵ 1,600", status: "Pending", time: "Yesterday, 04:20 PM", initials: "AB", avatarBg: "#fecdd3", avatarColor: "#881337" },
];

export default function RecentPayments() {
  const { onNavigate, showToast } = useApp();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleRowClick = (name: string) => {
    showToast(`Viewing payment record for ${name.split(" ")[0]}`, "info");
    onNavigate("billing");
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Recent Payments</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>3 received today · GH₵ 5,800</div>
        </div>
        <button onClick={() => onNavigate("billing")} style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          View All →
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {payments.map((p) => (
          <div
            key={p.id}
            onClick={() => handleRowClick(p.name)}
            onMouseEnter={() => setHoveredRow(p.id)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 8px", borderRadius: 8, cursor: "pointer",
              background: hoveredRow === p.id ? "#faf5ff" : "transparent",
              border: hoveredRow === p.id ? "1px solid #e9d5ff" : "1px solid transparent",
              transition: "background 0.12s, border-color 0.12s",
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.avatarBg, color: p.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, flexShrink: 0 }}>
              {p.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{p.class}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>{p.amount}</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: p.status === "Paid" ? "#dcfce7" : "#fef3c7", color: p.status === "Paid" ? "#16a34a" : "#d97706", whiteSpace: "nowrap" }}>
              {p.status}
            </div>
            <div style={{ fontSize: 10.5, color: "#9ca3af", whiteSpace: "nowrap", minWidth: 110, textAlign: "right" }}>{p.time}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate("billing")}
        style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
      >
        View All Payments <ArrowRight size={13} />
      </button>
    </div>
  );
}
