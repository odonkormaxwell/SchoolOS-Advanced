import { MoreHorizontal, TrendingUp, TrendingDown, Users, CalendarCheck, Coins, Banknote, Trophy } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

interface KpiCard {
  id: number;
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const iconMap: Record<string, React.ReactNode> = {
  students: <Users size={22} />,
  attendance: <CalendarCheck size={22} />,
  fees: <Coins size={22} />,
  revenue: <Banknote size={22} />,
  trophy: <Trophy size={22} />,
};

const pageMap: Record<string, string> = {
  students: "all-students",
  attendance: "attendance",
  fees: "billing",
  revenue: "billing",
  trophy: "gradebook",
};

export default function KpiCards({ cards }: { cards: KpiCard[] }) {
  const { onNavigate } = useApp();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 18 }}>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onNavigate(pageMap[card.icon] || "dashboard")}
          onMouseEnter={() => setHovered(card.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: "white",
            borderRadius: 12,
            padding: "16px",
            boxShadow: hovered === card.id
              ? "0 4px 16px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.08)"
              : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
            border: hovered === card.id ? "1px solid #e9d5ff" : "1px solid #f3f4f6",
            position: "relative",
            cursor: "pointer",
            transition: "box-shadow 0.18s, border-color 0.18s, transform 0.18s",
            transform: hovered === card.id ? "translateY(-2px)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: hovered === card.id ? card.iconColor : card.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: hovered === card.id ? "white" : card.iconColor,
              transition: "background 0.18s, color 0.18s",
            }}>
              {iconMap[card.icon]}
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: 2 }}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>{card.title}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2, marginBottom: 6 }}>{card.value}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: card.changePositive ? "#16a34a" : "#dc2626", fontWeight: 500 }}>
            {card.icon === "trophy" ? <TrendingUp size={12} color="#16a34a" /> : card.changePositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{card.change}</span>
          </div>
          {hovered === card.id && (
            <div style={{ position: "absolute", bottom: 8, right: 12, fontSize: 10.5, color: "#7c3aed", fontWeight: 500 }}>
              View details →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
