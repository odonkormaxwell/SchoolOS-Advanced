import { useState } from "react";

const students = [
  { id: "S001", name: "Ama Owusu",       class: "JHS 2",   balance: -320,  lastPayment: "2026-05-10", status: "overdue" },
  { id: "S002", name: "Kofi Mensah",     class: "Basic 5", balance: 0,     lastPayment: "2026-05-01", status: "paid" },
  { id: "S003", name: "Abena Asante",    class: "KG 2",    balance: -150,  lastPayment: "2026-04-20", status: "partial" },
  { id: "S004", name: "Kwame Boateng",   class: "JHS 3",   balance: -720,  lastPayment: "2026-03-15", status: "overdue" },
  { id: "S005", name: "Akosua Frimpong", class: "Basic 3", balance: 0,     lastPayment: "2026-05-02", status: "paid" },
  { id: "S006", name: "Yaw Darko",       class: "Basic 1", balance: -80,   lastPayment: "2026-04-28", status: "partial" },
  { id: "S007", name: "Efua Quaye",      class: "JHS 1",   balance: -500,  lastPayment: "2026-03-01", status: "overdue" },
  { id: "S008", name: "Kweku Adjei",     class: "Basic 6", balance: 0,     lastPayment: "2026-05-05", status: "paid" },
];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  paid:    { bg: "#dcfce7", color: "#15803d", label: "Paid" },
  partial: { bg: "#fef9c3", color: "#854d0e", label: "Partial" },
  overdue: { bg: "#fee2e2", color: "#b91c1c", label: "Overdue" },
};

export default function Balances() {
  const [filter, setFilter] = useState<"all" | "paid" | "partial" | "overdue">("all");
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) => {
    const matchFilter = filter === "all" || s.status === filter;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalOwed = students.filter((s) => s.balance < 0).reduce((sum, s) => sum + Math.abs(s.balance), 0);
  const totalPaid = students.filter((s) => s.status === "paid").length;
  const totalOverdue = students.filter((s) => s.status === "overdue").length;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>
          Fee Balances
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Outstanding balances and payment status for all students.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Outstanding", value: `GH₵ ${totalOwed.toLocaleString()}`, color: "#b91c1c", bg: "#fee2e2" },
          { label: "Fully Paid",        value: `${totalPaid} students`,             color: "#15803d", bg: "#dcfce7" },
          { label: "Overdue",           value: `${totalOverdue} students`,          color: "#92400e", bg: "#fef9c3" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: card.bg, borderRadius: 10, padding: "14px 16px",
              border: `1px solid ${card.color}22`,
            }}
          >
            <div style={{ fontSize: 11.5, color: card.color, fontWeight: 600, marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student..."
          style={{
            flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 8,
            border: "1px solid #e5e7eb", fontSize: 13, outline: "none",
          }}
        />
        {(["all", "paid", "partial", "overdue"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
              border: filter === f ? "1.5px solid #7c3aed" : "1px solid #e5e7eb",
              background: filter === f ? "#f5f3ff" : "white",
              color: filter === f ? "#7c3aed" : "#6b7280",
              cursor: "pointer", fontWeight: filter === f ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "0.5fr 1.5fr 0.8fr 1fr 1fr 0.8fr",
          background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
          padding: "10px 16px", gap: 12,
        }}>
          {["ID", "Student", "Class", "Balance (GH₵)", "Last Payment", "Status"].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {h}
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "40px 16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            No students found.
          </div>
        ) : (
          filtered.map((s, i) => {
            const st = statusStyle[s.status];
            return (
              <div
                key={s.id}
                style={{
                  display: "grid", gridTemplateColumns: "0.5fr 1.5fr 0.8fr 1fr 1fr 0.8fr",
                  padding: "11px 16px", gap: 12, alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                  background: i % 2 === 0 ? "white" : "#fafafa",
                }}
              >
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.id}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.name}</div>
                <div style={{ fontSize: 12.5, color: "#374151" }}>{s.class}</div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: s.balance < 0 ? "#b91c1c" : "#15803d",
                }}>
                  {s.balance < 0 ? `-GH₵ ${Math.abs(s.balance)}` : "GH₵ 0"}
                </div>
                <div style={{ fontSize: 12.5, color: "#6b7280" }}>{s.lastPayment}</div>
                <div>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 20,
                    fontSize: 11.5, fontWeight: 600, background: st.bg, color: st.color,
                  }}>
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
