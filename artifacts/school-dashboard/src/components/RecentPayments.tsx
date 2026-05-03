import { ArrowRight } from "lucide-react";

const payments = [
  {
    id: 1,
    name: "Nana Ama Owusu",
    class: "P4 - Ruby",
    amount: "GH₵ 2,400",
    status: "Paid",
    time: "Today, 08:35 AM",
    initials: "NA",
    avatarBg: "#fde68a",
    avatarColor: "#92400e",
  },
  {
    id: 2,
    name: "Kofi Asante",
    class: "P6 - Topaz",
    amount: "GH₵ 1,800",
    status: "Paid",
    time: "Today, 08:12 AM",
    initials: "KA",
    avatarBg: "#bbf7d0",
    avatarColor: "#14532d",
  },
  {
    id: 3,
    name: "Akosua Mensah",
    class: "P2 - Pearl",
    amount: "GH₵ 1,600",
    status: "Paid",
    time: "Today, 07:45 AM",
    initials: "AM",
    avatarBg: "#bfdbfe",
    avatarColor: "#1e3a8a",
  },
  {
    id: 4,
    name: "Yaw Addo",
    class: "P5 - Diamond",
    amount: "GH₵ 2,400",
    status: "Paid",
    time: "Yesterday, 06:30 PM",
    initials: "YA",
    avatarBg: "#e9d5ff",
    avatarColor: "#581c87",
  },
  {
    id: 5,
    name: "Abena Boateng",
    class: "P1 - Coral",
    amount: "GH₵ 1,600",
    status: "Pending",
    time: "Yesterday, 04:20 PM",
    initials: "AB",
    avatarBg: "#fecdd3",
    avatarColor: "#881337",
  },
];

export default function RecentPayments() {
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
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Recent Payments</div>
        <button style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          View All
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {payments.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
              borderBottom: "1px solid #f9fafb",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: p.avatarBg,
                color: p.avatarColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10.5,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {p.initials}
            </div>

            {/* Name & class */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{p.class}</div>
            </div>

            {/* Amount */}
            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
              {p.amount}
            </div>

            {/* Status */}
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 20,
                background: p.status === "Paid" ? "#dcfce7" : "#fef3c7",
                color: p.status === "Paid" ? "#16a34a" : "#d97706",
                whiteSpace: "nowrap",
              }}
            >
              {p.status}
            </div>

            {/* Time */}
            <div style={{ fontSize: 10.5, color: "#9ca3af", whiteSpace: "nowrap", minWidth: 110, textAlign: "right" }}>
              {p.time}
            </div>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 12,
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
        View All Payments <ArrowRight size={13} />
      </button>
    </div>
  );
}
