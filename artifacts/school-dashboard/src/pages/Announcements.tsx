import { useState } from "react";

const announcements = [
  {
    id: 1,
    title: "End of Term Examinations",
    body: "End of Term 2 examinations will commence on June 9, 2026. All students must be present and on time. Students who miss exams without a medical certificate will not be rescheduled.",
    audience: "All",
    date: "2026-05-28",
    author: "Headteacher",
    pinned: true,
  },
  {
    id: 2,
    title: "PTA Meeting — Saturday 7th June",
    body: "Parents and guardians are invited to the PTA meeting on Saturday, 7th June 2026 at 9:00 AM in the school hall. Attendance is mandatory for parents of JHS students.",
    audience: "Parents",
    date: "2026-05-27",
    author: "Administrator",
    pinned: true,
  },
  {
    id: 3,
    title: "School Fees Deadline",
    body: "All outstanding school fees for Term 2 must be settled by May 31, 2026. Students with unpaid fees will not be allowed to sit end-of-term exams. Please contact the Accounts Office.",
    audience: "Parents",
    date: "2026-05-20",
    author: "Accountant",
    pinned: false,
  },
  {
    id: 4,
    title: "Teacher Training Day — No School",
    body: "There will be no school on Friday, June 6, 2026 due to teacher professional development training. All staff are required to attend.",
    audience: "All",
    date: "2026-05-18",
    author: "Administrator",
    pinned: false,
  },
];

const audienceColors: Record<string, { bg: string; color: string }> = {
  All:     { bg: "#dbeafe", color: "#1d4ed8" },
  Parents: { bg: "#fce7f3", color: "#9d174d" },
  Staff:   { bg: "#dcfce7", color: "#15803d" },
  Students:{ bg: "#f3e8ff", color: "#6d28d9" },
};

export default function Announcements() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", audience: "All" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>
            Announcements
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            School-wide notices and important updates.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white",
            border: "none", cursor: "pointer",
          }}
        >
          + New Announcement
        </button>
      </div>

      {showForm && (
        <div style={{
          background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
          padding: 20, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#111827" }}>
            New Announcement
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none" }}
            />
            <textarea
              placeholder="Write your announcement here..."
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={4}
              style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, outline: "none", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Audience:</label>
              <select
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
                style={{ padding: "7px 10px", borderRadius: 7, border: "1px solid #e5e7eb", fontSize: 13, outline: "none" }}
              >
                {["All", "Parents", "Staff", "Students"].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 13, cursor: "pointer", color: "#6b7280" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ padding: "8px 16px", borderRadius: 8, background: "#7c3aed", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {announcements.map((ann) => {
          const ac = audienceColors[ann.audience] ?? audienceColors["All"];
          return (
            <div
              key={ann.id}
              style={{
                background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
                padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                borderLeft: ann.pinned ? "4px solid #7c3aed" : "4px solid transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {ann.pinned && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", background: "#f3e8ff", padding: "2px 8px", borderRadius: 20 }}>
                      📌 Pinned
                    </span>
                  )}
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                    background: ac.bg, color: ac.color,
                  }}>
                    {ann.audience}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{ann.date}</span>
              </div>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                {ann.title}
              </h3>
              <p style={{ fontSize: 13, color: "#374151", margin: "0 0 8px", lineHeight: 1.6 }}>
                {ann.body}
              </p>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>By {ann.author}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
