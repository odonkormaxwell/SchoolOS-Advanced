const feeData = [
  { class: "KG 1", termly: 450, annual: 1350, items: ["Tuition", "Activity Fee", "PTA Levy"] },
  { class: "KG 2", termly: 450, annual: 1350, items: ["Tuition", "Activity Fee", "PTA Levy"] },
  { class: "Basic 1", termly: 520, annual: 1560, items: ["Tuition", "Activity Fee", "Computer Lab", "PTA Levy"] },
  { class: "Basic 2", termly: 520, annual: 1560, items: ["Tuition", "Activity Fee", "Computer Lab", "PTA Levy"] },
  { class: "Basic 3", termly: 540, annual: 1620, items: ["Tuition", "Activity Fee", "Computer Lab", "PTA Levy"] },
  { class: "Basic 4", termly: 560, annual: 1680, items: ["Tuition", "Activity Fee", "Computer Lab", "Library", "PTA Levy"] },
  { class: "Basic 5", termly: 580, annual: 1740, items: ["Tuition", "Activity Fee", "Computer Lab", "Library", "PTA Levy"] },
  { class: "Basic 6", termly: 600, annual: 1800, items: ["Tuition", "Activity Fee", "Computer Lab", "Library", "PTA Levy"] },
  { class: "JHS 1",   termly: 680, annual: 2040, items: ["Tuition", "Science Lab", "Computer Lab", "Library", "PTA Levy"] },
  { class: "JHS 2",   termly: 700, annual: 2100, items: ["Tuition", "Science Lab", "Computer Lab", "Library", "PTA Levy"] },
  { class: "JHS 3",   termly: 720, annual: 2160, items: ["Tuition", "Science Lab", "Computer Lab", "Library", "BECE Prep", "PTA Levy"] },
];

export default function FeeStructure() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>
          Fee Structure
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Academic Year 2025/2026 — All amounts in Ghana Cedis (GH₵)
        </p>
      </div>

      <div style={{
        background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
        overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 2fr",
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          padding: "10px 20px",
          gap: 12,
        }}>
          {["Class / Level", "Per Term (GH₵)", "Annual (GH₵)", "Includes"].map((h) => (
            <div key={h} style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {h}
            </div>
          ))}
        </div>

        {feeData.map((row, i) => (
          <div
            key={row.class}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 2fr",
              padding: "12px 20px",
              gap: 12,
              borderBottom: i < feeData.length - 1 ? "1px solid #f3f4f6" : "none",
              alignItems: "center",
              background: i % 2 === 0 ? "white" : "#fafafa",
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{row.class}</div>
            <div style={{ fontSize: 13.5, color: "#7c3aed", fontWeight: 600 }}>GH₵ {row.termly.toLocaleString()}</div>
            <div style={{ fontSize: 13.5, color: "#374151" }}>GH₵ {row.annual.toLocaleString()}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {row.items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 20,
                    background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16, padding: "12px 16px",
        background: "#fffbeb", border: "1px solid #fde68a",
        borderRadius: 10, fontSize: 12.5, color: "#92400e",
      }}>
        <strong>Note:</strong> Fees are due at the beginning of each term. Discounts may apply for early payment or siblings. Contact the Accounts Office for payment plans.
      </div>
    </div>
  );
}
