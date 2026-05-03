import { MoreHorizontal, TrendingUp, TrendingDown, Users, CalendarCheck, Coins, Banknote, Trophy } from "lucide-react";

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

export default function KpiCards({ cards }: { cards: KpiCard[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 14,
        marginBottom: 18,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            background: "white",
            borderRadius: 12,
            padding: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
            border: "1px solid #f3f4f6",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.iconColor,
              }}
            >
              {iconMap[card.icon]}
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#d1d5db",
                padding: 2,
              }}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>
            {card.title}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2, marginBottom: 6 }}>
            {card.value}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: card.changePositive ? "#16a34a" : "#dc2626",
              fontWeight: 500,
            }}
          >
            {card.icon === "trophy" ? (
              <TrendingUp size={12} color="#16a34a" />
            ) : card.changePositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            <span>{card.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
