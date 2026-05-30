import { useState } from "react";
import { Eye, EyeOff, Terminal, Shield, Copy, Check } from "lucide-react";

const isDev = import.meta.env.DEV;

const demoUsers = [
  {
    name: "Emmanuel Mensah",
    role: "Headteacher",
    roleKey: "headteacher",
    email: "headteacher@happykids.edu.gh",
    password: "password123",
    color: "#7c3aed",
    bg: "#f5f3ff",
    badge: "2FA Required",
    badgeColor: "#7c3aed",
    badgeBg: "#ede9fe",
    focus: "Academic & Operational Leadership",
    permissions: ["manage_students", "manage_admissions", "approve_admissions", "manage_attendance", "manage_assessments", "view_staff", "view_reports", "manage_communication", "manage_settings"],
  },
  {
    name: "Kofi Mensah",
    role: "School Owner",
    roleKey: "school_owner",
    email: "admin@happykids.edu.gh",
    password: "password123",
    color: "#0369a1",
    bg: "#e0f2fe",
    badge: "2FA Required",
    badgeColor: "#0369a1",
    badgeBg: "#dbeafe",
    focus: "Revenue · Branding · Compliance",
    permissions: ["manage_fees", "view_finance", "manage_staff", "manage_roles_permissions", "view_reports", "manage_communication", "manage_settings"],
  },
  {
    name: "Ama Owusu",
    role: "Teacher (Class)",
    roleKey: "teacher",
    email: "ama.owusu@happykids.edu.gh",
    password: "password123",
    color: "#9d174d",
    bg: "#fce7f3",
    badge: "Class Teacher",
    badgeColor: "#9d174d",
    badgeBg: "#fce7f3",
    focus: "Assigned Classes & Subjects",
    permissions: ["manage_attendance", "manage_assessments", "manage_communication", "view_reports"],
  },
  {
    name: "Kwame Asante",
    role: "Teacher (Subject)",
    roleKey: "teacher",
    email: "kwame.asante@happykids.edu.gh",
    password: "password123",
    color: "#16a34a",
    bg: "#dcfce7",
    badge: "Subject Teacher",
    badgeColor: "#16a34a",
    badgeBg: "#dcfce7",
    focus: "Assigned Subjects",
    permissions: ["manage_attendance", "manage_assessments", "manage_communication", "view_reports"],
  },
  {
    name: "Yaw Boateng",
    role: "Accountant",
    roleKey: "accountant",
    email: "accounts@happykids.edu.gh",
    password: "password123",
    color: "#15803d",
    bg: "#f0fdf4",
    badge: "2FA Required",
    badgeColor: "#15803d",
    badgeBg: "#dcfce7",
    focus: "Fee Collection · Reconciliation",
    permissions: ["view_finance", "view_reports", "manage_communication"],
  },
  {
    name: "Abena Nyarko",
    role: "Admissions Officer",
    roleKey: "admissions_officer",
    email: "admissions@happykids.edu.gh",
    password: "password123",
    color: "#d97706",
    bg: "#fffbeb",
    badge: "Admissions",
    badgeColor: "#d97706",
    badgeBg: "#fef3c7",
    focus: "Student Onboarding",
    permissions: ["manage_students", "manage_admissions", "manage_communication", "view_reports"],
  },
  {
    name: "Grace Ofori",
    role: "Parent",
    roleKey: "parent",
    email: "parent.demo@happykids.edu.gh",
    password: "password123",
    color: "#6b7280",
    bg: "#f9fafb",
    badge: "Parent Portal",
    badgeColor: "#6b7280",
    badgeBg: "#f3f4f6",
    focus: "Child Progress Monitoring",
    permissions: ["view_reports"],
  },
  {
    name: "Michael Ofori",
    role: "Student",
    roleKey: "student",
    email: "student.demo@happykids.edu.gh",
    password: "password123",
    color: "#9333ea",
    bg: "#fdf4ff",
    badge: "Student Portal",
    badgeColor: "#9333ea",
    badgeBg: "#f3e8ff",
    focus: "Own Records Only",
    permissions: ["view_reports"],
  },
];

const permissionLabels: Record<string, string> = {
  manage_students:          "Manage Students",
  manage_admissions:        "Manage Admissions",
  approve_admissions:       "Approve Admissions",
  manage_attendance:        "Mark Attendance",
  manage_assessments:       "Enter Assessments",
  manage_fees:              "Manage Fees",
  view_finance:             "View Finance",
  manage_staff:             "Manage Staff",
  view_staff:               "View Staff",
  view_reports:             "View Reports",
  manage_communication:     "Communication",
  manage_settings:          "Settings",
  manage_roles_permissions: "Roles & Permissions",
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  return (
    <button onClick={handleCopy} title={`Copy ${label || "value"}`}
      style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#16a34a" : "#9ca3af", display: "flex", alignItems: "center", gap: 3, padding: "2px 4px", borderRadius: 4, fontSize: 11 }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function DevCredentials() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [expandedUser, setExpandedUser]   = useState<string | null>(null);

  if (!isDev) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}>
        <Shield size={32} style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Production Build</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Dev credentials are only visible in development mode.</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Terminal size={18} color="#fbbf24" />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Dev Credentials</h1>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: 20, border: "1px solid #fde68a" }}>DEV ONLY</span>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            8 demo accounts — 5 internal, 2 external, 3 trigger 2FA. All use password: <code style={{ background: "#f3f4f6", padding: "1px 6px", borderRadius: 4, color: "#374151" }}>password123</code>
          </p>
        </div>
        <button onClick={() => setShowPasswords((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
          {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPasswords ? "Hide" : "Show"} Passwords
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12, marginBottom: 20 }}>
        {demoUsers.map((u) => {
          const isExpanded = expandedUser === u.email;
          const has2fa = u.badge === "2FA Required";
          return (
            <div key={u.email} style={{ background: "white", borderRadius: 12, border: `1.5px solid ${isExpanded ? u.color + "44" : "#e5e7eb"}`, overflow: "hidden", transition: "border-color 0.15s" }}>
              {/* Header */}
              <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: u.bg, color: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{u.name}</div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      {has2fa && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "#ede9fe", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
                          🔒 2FA
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: u.color, fontWeight: 600, marginTop: 2 }}>{u.role}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{u.focus}</div>
                </div>
              </div>

              {/* Credentials */}
              <div style={{ padding: "0 16px 12px", borderTop: "1px solid #f9fafb" }}>
                {[
                  { label: "Email",    value: u.email,    copyLabel: "email" },
                  { label: "Password", value: showPasswords ? u.password : "••••••••••••", copyLabel: "password", copyValue: u.password },
                ].map(({ label, value, copyLabel, copyValue }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                      <div style={{ fontSize: 12.5, color: "#374151", fontFamily: "monospace", marginTop: 1 }}>{value}</div>
                    </div>
                    <CopyButton text={copyValue ?? value} label={copyLabel} />
                  </div>
                ))}
              </div>

              {/* Expand for permissions */}
              <button onClick={() => setExpandedUser(isExpanded ? null : u.email)}
                style={{ width: "100%", padding: "8px 16px", background: isExpanded ? u.bg : "#fafafa", border: "none", borderTop: "1px solid #f3f4f6", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, fontWeight: 500, color: isExpanded ? u.color : "#9ca3af", transition: "all 0.15s" }}>
                <span>Permissions ({u.permissions.length})</span>
                {isExpanded ? <span style={{ fontSize: 14 }}>▲</span> : <span style={{ fontSize: 14 }}>▼</span>}
              </button>

              {isExpanded && (
                <div style={{ padding: "12px 16px", background: u.bg, borderTop: `1px solid ${u.color}22` }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {u.permissions.map((p) => (
                      <span key={p} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "white", color: u.color, border: `1px solid ${u.color}33` }}>
                        {permissionLabels[p] || p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Role hierarchy note */}
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>Edulex Role Hierarchy</div>
        <div style={{ display: "flex", gap: 0, alignItems: "center", flexWrap: "wrap", fontSize: 12 }}>
          {[
            { label: "Super Admin", color: "#7c3aed", note: "Platform" },
            { label: "School Owner", color: "#0369a1", note: "Business" },
            { label: "Headteacher", color: "#7c3aed", note: "Academic" },
            { label: "Teacher", color: "#0284c7", note: "Classroom" },
            { label: "Accountant", color: "#15803d", note: "Finance" },
            { label: "Admissions", color: "#d97706", note: "Intake" },
            { label: "Parent", color: "#6b7280", note: "External" },
            { label: "Student", color: "#9333ea", note: "External" },
          ].map((r, i) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", padding: "4px 8px", background: "white", borderRadius: 6, border: `1px solid ${r.color}33` }}>
                <div style={{ fontWeight: 700, color: r.color, fontSize: 12 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{r.note}</div>
              </div>
              {i < 7 && <span style={{ color: "#d1d5db", margin: "0 2px", fontSize: 16 }}>›</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11.5, color: "#78350f" }}>
          ℹ️ School Owner controls business/finance. Headteacher controls academics. These responsibilities are intentionally separated and should not overlap.
        </div>
      </div>
    </div>
  );
}
