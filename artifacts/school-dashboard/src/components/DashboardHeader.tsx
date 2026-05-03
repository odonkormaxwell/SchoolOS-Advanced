import { CalendarDays, ChevronDown } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>
          Good morning, Mr. Mensah 👋
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0", lineHeight: 1.5 }}>
          Here's what's happening in your school today.
        </p>
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          background: "white",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <CalendarDays size={14} color="#6b7280" />
        <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500 }}>
          Wednesday, 15 May 2024
        </span>
        <ChevronDown size={13} color="#9ca3af" />
      </button>
    </div>
  );
}
