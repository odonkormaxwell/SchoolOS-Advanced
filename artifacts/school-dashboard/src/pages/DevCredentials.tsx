import { useState } from "react";
import { Eye, EyeOff, Terminal, Shield, Copy, Check } from "lucide-react";

const isDev = import.meta.env.DEV;

const demoUsers = [
  {
    name: "Emmanuel Mensah",
    role: "Administrator (Headteacher)",
    email: "headteacher@happykids.edu.gh",
    password: "password123",
    color: "#7c3aed",
    bg: "#f5f3ff",
    badge: "Full Access",
    permissions: ["manage_students", "manage_admissions", "manage_attendance", "manage_assessments", "manage_fees", "manage_staff", "view_reports", "manage_communication", "manage_settings", "manage_roles_permissions"],
  },
  {
    name: "Kofi Mensah",
    role: "Administrator",
    email: "admin@happykids.edu.gh",
    password: "password123",
    color: "#7c3aed",
    bg: "#f5f3ff",
    badge: "Full Access",
    permissions: ["manage_students", "manage_admissions", "manage_attendance", "manage_assessments", "manage_fees", "manage_staff", "view_reports", "manage_communication", "manage_settings", "manage_roles_permissions"],
  },
  {
    name: "Ama Owusu",
    role: "Teacher",
    email: "ama.owusu@happykids.edu.gh",
    password: "password123",
    color: "#2563eb",
    bg: "#eff6ff",
    badge: "Class Teacher",
    permissions: ["manage_students", "manage_attendance", "manage_assessments", "manage_communication", "view_reports"],
  },
  {
    name: "Kwame Asante",
    role: "Teacher",
    email: "kwame.asante@happykids.edu.gh",
    password: "password123",
    color: "#2563eb",
    bg: "#eff6ff",
    badge: "Subject Teacher",
    permissions: ["manage_students", "manage_attendance", "manage_assessments", "manage_communication", "view_reports"],
  },
  {
    name: "Yaw Boateng",
    role: "Accountant",
    email: "accounts@happykids.edu.gh",
    password: "password123",
    color: "#16a34a",
    bg: "#f0fdf4",
    badge: "Finance Access",
    permissions: ["manage_students", "manage_fees", "view_reports", "manage_communication"],
  },
  {
    name: "Abena Nyarko",
    role: "Admissions Officer",
    email: "admissions@happykids.edu.gh",
    password: "password123",
    color: "#d97706",
    bg: "#fffbeb",
    badge: "Admissions",
    permissions: ["manage_students", "manage_admissions", "manage_communication", "view_reports"],
  },
  {
    name: "Grace Ofori",
    role: "Parent",
    email: "parent.demo@happykids.edu.gh",
    password: "password123",
    color: "#6b7280",
    bg: "#f9fafb",
    badge: "Parent Portal",
    permissions: [],
  },
  {
    name: "Michael Ofori",
    role: "Student",
    email: "student.demo@happykids.edu.gh",
    password: "password123",
    color: "#6b7280",
    bg: "#f9fafb",
    badge: "Student Portal",
    permissions: [],
  },
];

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label ?? text}`}
      style={{
        display: "flex", alignItems: "center", gap: 3,
        padding: "2px 6px", border: "none", borderRadius: 4,
        background: copied ? "#dcfce7" : "#f3f4f6",
        color: copied ? "#16a34a" : "#9ca3af",
        cursor: "pointer", fontSize: 10.5, fontWeight: 600,
        transition: "all 0.15s", flexShrink: 0,
      }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function UserCard({ user }: { user: typeof demoUsers[0] }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = () => {
    const text = `Role: ${user.role}\nEmail: ${user.email}\nPassword: ${user.password}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    });
  };

  return (
    <div style={{
      background: "white", borderRadius: 12, border: `1px solid ${user.color}28`,
      overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* Card header */}
      <div style={{ padding: "12px 16px", background: user.bg, borderBottom: `1px solid ${user.color}18`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: user.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{user.name}</div>
            <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: user.color + "20", color: user.color }}>{user.role}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#f3f4f6", color: "#6b7280" }}>{user.badge}</span>
            </div>
          </div>
        </div>
        <button onClick={copyAll} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 9px", border: `1px solid ${user.color}30`, borderRadius: 7, background: "white", color: copiedAll ? "#16a34a" : user.color, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
          {copiedAll ? <Check size={11} /> : <Copy size={11} />}
          {copiedAll ? "Copied!" : "Copy All"}
        </button>
      </div>

      {/* Credentials */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Email</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <span style={{ fontSize: 12.5, color: "#374151", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
            <CopyButton text={user.email} label="email" />
          </div>
        </div>

        <div style={{ marginBottom: user.permissions.length > 0 ? 12 : 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Password</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              <span style={{ fontSize: 12.5, color: "#374151", fontFamily: "monospace" }}>
                {showPassword ? user.password : "•".repeat(user.password.length)}
              </span>
              <button onClick={() => setShowPassword(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0, flexShrink: 0 }}>
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <CopyButton text={user.password} label="password" />
          </div>
        </div>

        {user.permissions.length > 0 && (
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Permissions ({user.permissions.length})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {user.permissions.map(p => (
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ padding: "4px 10px", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#854d0e" }}>
            🛠 DEVELOPMENT ONLY
          </div>
          <div style={{ padding: "4px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#166534" }}>
            {demoUsers.length} accounts
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <Terminal size={20} color="#7c3aed" /> Demo Credentials
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Use these accounts to test different roles and permissions. Click <strong>Copy All</strong> on any card to copy credentials. This page is hidden in production.
        </p>
      </div>

      <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12.5, color: "#92400e" }}>
        <strong>⚠ Warning:</strong> Never expose demo credentials in a live/production environment. This page is automatically disabled when{" "}
        <code style={{ fontFamily: "monospace", background: "rgba(0,0,0,0.08)", padding: "1px 4px", borderRadius: 3 }}>import.meta.env.DEV</code> is false.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {demoUsers.map(user => (
          <UserCard key={user.email} user={user} />
        ))}
      </div>

      <div style={{ marginTop: 20, padding: "14px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 12.5, color: "#166534" }}>
        <strong>School Info:</strong> Happy Kids Basic School · Accra, Ghana · Academic Year 2025/2026 · Term 2 · Currency: GH₵ · Sender ID: HappyKids
      </div>
    </div>
  );
}
