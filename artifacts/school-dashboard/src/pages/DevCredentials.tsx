import { useState } from "react";
import { Eye, EyeOff, Terminal, Shield } from "lucide-react";

const isDev = import.meta.env.DEV;

const demoUsers = [
  {
    name: "Kofi Mensah",
    role: "Administrator",
    email: "admin@happykids.edu.gh",
    password: "password123",
    color: "#7c3aed",
    bg: "#f5f3ff",
    permissions: ["manage_students", "manage_admissions", "manage_attendance", "manage_assessments", "manage_fees", "manage_staff", "view_reports", "manage_communication", "manage_settings", "manage_roles_permissions"],
  },
  {
    name: "Akosua Owusu",
    role: "Administrator (Headteacher)",
    email: "headteacher@happykids.edu.gh",
    password: "password123",
    color: "#7c3aed",
    bg: "#f5f3ff",
    permissions: ["manage_students", "manage_admissions", "manage_attendance", "manage_assessments", "manage_fees", "manage_staff", "view_reports", "manage_communication", "manage_settings", "manage_roles_permissions"],
  },
  {
    name: "Ama Owusu",
    role: "Teacher",
    email: "ama.owusu@happykids.edu.gh",
    password: "password123",
    color: "#2563eb",
    bg: "#eff6ff",
    permissions: ["manage_students", "manage_attendance", "manage_assessments", "manage_communication", "view_reports"],
  },
  {
    name: "Kwame Asante",
    role: "Teacher",
    email: "kwame.asante@happykids.edu.gh",
    password: "password123",
    color: "#2563eb",
    bg: "#eff6ff",
    permissions: ["manage_students", "manage_attendance", "manage_assessments", "manage_communication", "view_reports"],
  },
  {
    name: "Yaw Boateng",
    role: "Accountant",
    email: "accounts@happykids.edu.gh",
    password: "password123",
    color: "#16a34a",
    bg: "#f0fdf4",
    permissions: ["manage_students", "manage_fees", "view_reports", "manage_communication"],
  },
  {
    name: "Abena Nyarko",
    role: "Admissions Officer",
    email: "admissions@happykids.edu.gh",
    password: "password123",
    color: "#d97706",
    bg: "#fffbeb",
    permissions: ["manage_students", "manage_admissions", "manage_communication", "view_reports"],
  },
  {
    name: "Grace Ofori",
    role: "Parent",
    email: "parent.demo@happykids.edu.gh",
    password: "password123",
    color: "#6b7280",
    bg: "#f9fafb",
    permissions: [],
  },
  {
    name: "Michael Ofori",
    role: "Student",
    email: "student.demo@happykids.edu.gh",
    password: "password123",
    color: "#6b7280",
    bg: "#f9fafb",
    permissions: [],
  },
];

function UserCard({ user }: { user: typeof demoUsers[0] }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{
      background: "white", borderRadius: 12, border: `1px solid ${user.color}30`,
      overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ padding: "12px 16px", background: user.bg, borderBottom: `1px solid ${user.color}20`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: user.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{user.name}</div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: user.color + "20", color: user.color }}>{user.role}</span>
        </div>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Email</div>
          <div style={{ fontSize: 12.5, color: "#374151", fontFamily: "monospace" }}>{user.email}</div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Password</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12.5, color: "#374151", fontFamily: "monospace" }}>
              {showPassword ? user.password : "•".repeat(user.password.length)}
            </span>
            <button onClick={() => setShowPassword((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0 }}>
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>
        {user.permissions.length > 0 && (
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Permissions</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {user.permissions.map((p) => (
                <span key={p} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280", fontFamily: "monospace" }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DevCredentials() {
  if (!isDev) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "55vh", gap: 12, color: "#9ca3af" }}>
        <Shield size={44} color="#e5e7eb" />
        <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>Access Restricted</div>
        <div style={{ fontSize: 13 }}>This page is only available in development mode.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ padding: "4px 10px", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#854d0e" }}>
            🛠 DEVELOPMENT ONLY
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <Terminal size={20} color="#7c3aed" /> Demo Credentials
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Use these accounts to test different roles and permissions. This page is hidden in production.
        </p>
      </div>

      <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12.5, color: "#92400e" }}>
        <strong>⚠ Warning:</strong> Never expose demo credentials in a live/production environment. This page is automatically disabled when <code style={{ fontFamily: "monospace", background: "rgba(0,0,0,0.1)", padding: "1px 4px", borderRadius: 3 }}>import.meta.env.DEV</code> is false.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {demoUsers.map((user) => (
          <UserCard key={user.email} user={user} />
        ))}
      </div>

      <div style={{ marginTop: 20, padding: "14px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 12.5, color: "#166534" }}>
        <strong>School Info:</strong> Happy Kids Basic School · Accra, Ghana · Academic Year 2025/2026 · Term 2 · Currency: GH₵
      </div>
    </div>
  );
}
