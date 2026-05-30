import { useState } from "react";

const roles = [
  {
    role: "Administrator",
    description: "Full access to all modules and settings.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    permissions: [
      "manage_students", "manage_admissions", "manage_attendance",
      "manage_assessments", "manage_fees", "manage_staff",
      "view_reports", "manage_communication", "manage_settings",
      "manage_roles_permissions",
    ],
  },
  {
    role: "Teacher",
    description: "Access to students (assigned classes), attendance, academics, assessments, and limited communication.",
    color: "#0284c7",
    bg: "#e0f2fe",
    permissions: [
      "manage_students", "manage_attendance",
      "manage_assessments", "manage_communication", "view_reports",
    ],
  },
  {
    role: "Accountant",
    description: "Access to fees, student records (view only), reports, and optional communication.",
    color: "#15803d",
    bg: "#dcfce7",
    permissions: [
      "manage_students", "manage_fees", "view_reports", "manage_communication",
    ],
  },
  {
    role: "Admissions Officer",
    description: "Access to students, admissions, communication, and admissions reports.",
    color: "#b45309",
    bg: "#fef3c7",
    permissions: [
      "manage_students", "manage_admissions", "manage_communication", "view_reports",
    ],
  },
];

const allPermissions: { key: string; label: string }[] = [
  { key: "manage_students",          label: "Manage Students" },
  { key: "manage_admissions",        label: "Manage Admissions" },
  { key: "manage_attendance",        label: "Manage Attendance" },
  { key: "manage_assessments",       label: "Manage Assessments" },
  { key: "manage_fees",              label: "Manage Fees" },
  { key: "manage_staff",             label: "Manage Staff" },
  { key: "view_reports",             label: "View Reports" },
  { key: "manage_communication",     label: "Manage Communication" },
  { key: "manage_settings",          label: "Manage Settings" },
  { key: "manage_roles_permissions", label: "Roles & Permissions" },
];

export default function RolesPermissions() {
  const [selected, setSelected] = useState("Administrator");
  const current = roles.find((r) => r.role === selected)!;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>
          Roles & Permissions
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Review what each role can access. Administrators can grant extra permissions per user.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
        {/* Role list */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {roles.map((r) => (
            <div
              key={r.role}
              onClick={() => setSelected(r.role)}
              style={{
                padding: "13px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
                background: selected === r.role ? r.bg : "white",
                borderLeft: selected === r.role ? `3px solid ${r.color}` : "3px solid transparent",
                transition: "background 0.12s",
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 600, color: selected === r.role ? r.color : "#111827" }}>
                {r.role}
              </div>
              <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>
                {r.permissions.length} permissions
              </div>
            </div>
          ))}
        </div>

        {/* Permission detail */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700,
              padding: "3px 12px", borderRadius: 20,
              background: current.bg, color: current.color, marginBottom: 8,
            }}>
              {current.role}
            </div>
            <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{current.description}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {allPermissions.map(({ key, label }) => {
              const has = current.permissions.includes(key);
              return (
                <div
                  key={key}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 8,
                    background: has ? "#f9fafb" : "#fafafa",
                    border: `1px solid ${has ? "#e5e7eb" : "#f3f4f6"}`,
                    opacity: has ? 1 : 0.5,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: has ? "#dcfce7" : "#f3f4f6",
                    fontSize: 12,
                  }}>
                    {has ? "✓" : "✕"}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: has ? "#111827" : "#9ca3af" }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 16, padding: "10px 14px", borderRadius: 8,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            fontSize: 12.5, color: "#15803d",
          }}>
            <strong>Tip:</strong> Administrators can grant individual users extra permissions beyond their role. For example, an Accountant can be given access to view Admissions reports.
          </div>
        </div>
      </div>
    </div>
  );
}
