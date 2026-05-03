import { Menu, Search, ChevronDown, Bell, MessageCircle, Command } from "lucide-react";

export default function Topbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 220,
        right: 0,
        height: 56,
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        zIndex: 30,
      }}
    >
      {/* Hamburger */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div
        style={{
          flex: 1,
          maxWidth: 380,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Search
          size={14}
          style={{ position: "absolute", left: 10, color: "#9ca3af", pointerEvents: "none" }}
        />
        <input
          type="text"
          placeholder="Search for students, parents, invoices..."
          style={{
            width: "100%",
            padding: "7px 10px 7px 32px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 12.5,
            color: "#374151",
            outline: "none",
            background: "#f9fafb",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 10,
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#9ca3af",
            fontSize: 11,
          }}
        >
          <Command size={11} />
          <span>K</span>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* School selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          cursor: "pointer",
          background: "white",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
          }}
        >
          🏫
        </div>
        <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>
          Happy Kids Basic School
        </span>
        <ChevronDown size={13} color="#9ca3af" />
      </div>

      {/* Notification bell */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <Bell size={19} color="#6b7280" />
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            background: "#ef4444",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "white",
            fontWeight: 700,
          }}
        >
          3
        </div>
      </div>

      {/* Chat */}
      <div style={{ cursor: "pointer" }}>
        <MessageCircle size={19} color="#6b7280" />
      </div>

      {/* User profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          EM
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
            Emmanuel Mensah
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.3 }}>Headteacher</div>
        </div>
        <ChevronDown size={13} color="#9ca3af" />
      </div>
    </header>
  );
}
