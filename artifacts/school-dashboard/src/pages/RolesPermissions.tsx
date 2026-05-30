import { useState } from "react";
import { Check, X, Crown, GraduationCap, BookOpen, Calculator, ClipboardList, Users, User, Star, ChevronDown, ChevronRight, Info } from "lucide-react";
import { useWindowSize } from "../hooks/useWindowSize";

type RoleDef = {
  key: string;
  name: string;
  type: "platform" | "internal" | "external";
  focus: string;
  description: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
  badge?: string;
  canAccess: string[];
  canDo: string[];
  cannotDo: string[];
  workflows?: string[];
};

const roles: RoleDef[] = [
  {
    key: "super_admin",
    name: "Super Admin",
    type: "platform",
    focus: "SaaS Platform Management",
    description: "Manages the Maxibern SchoolOS platform. Can access all schools, manage subscriptions, approve sender IDs, and impersonate users for support.",
    color: "#6d28d9",
    bg: "#f5f3ff",
    icon: <Star size={16} />,
    badge: "Edulex Only",
    canAccess: ["All Schools", "Subscriptions & Billing", "SMS Providers", "Sender ID Approvals", "Platform Analytics", "Platform Revenue", "User Impersonation"],
    canDo: ["Manage all schools", "Manage subscriptions", "Approve/reject Sender IDs", "Suspend or archive schools", "View platform revenue", "Impersonate users for support", "Manage plans and billing"],
    cannotDo: ["Edit school academic data directly (must impersonate)"],
    workflows: ["Sender ID: School Owner → Super Admin Approval", "Subscription Changes: School Owner Only"],
  },
  {
    key: "school_owner",
    name: "School Owner",
    type: "internal",
    focus: "Revenue · Branding · Compliance",
    description: "The business owner (proprietor) of the school. Manages finances, school branding, subscriptions, user accounts, and compliance. Separate from academic management.",
    color: "#0369a1",
    bg: "#e0f2fe",
    icon: <Crown size={16} />,
    badge: "Proprietor",
    canAccess: ["Dashboard", "Finance Dashboard", "Fee Structure", "Invoices", "Payments", "Reports", "Communication", "Staff Directory", "User Management", "School Branding", "Backup & Recovery", "Subscription & Billing", "Audit Logs", "Settings"],
    canDo: ["Create, disable, reset user accounts", "Purchase SMS credits", "Request Sender IDs", "Upgrade subscription", "View all reports", "Generate & restore backups", "Archive students and staff", "Approve fee structure changes", "Approve offline payments"],
    cannotDo: ["Enter student results", "Mark attendance", "Enter assessment scores", "Approve admissions"],
    workflows: ["Fee Structure: Accountant Proposes → School Owner Approves", "Offline Payment: Accountant Records → School Owner Approves", "Sender ID: School Owner → Super Admin"],
  },
  {
    key: "headteacher",
    name: "Headteacher",
    type: "internal",
    focus: "Academics · Students · Teachers",
    description: "Academic and operational leader. Manages students, teachers, attendance, results, and academic quality. Approves admissions and published results.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: <GraduationCap size={16} />,
    badge: "Academic Leader",
    canAccess: ["Dashboard", "Students", "Admissions", "Attendance", "Subjects", "Classes", "Timetable", "Assessments", "Communication", "Staff Directory", "Academic Reports", "Settings"],
    canDo: ["Approve admissions", "Approve, publish, reopen, lock results", "Assign teachers to classes/subjects", "Assign class teachers", "Promote students", "Manage academic year transitions", "Archive students", "Generate report cards"],
    cannotDo: ["Manage subscriptions", "Configure Paystack/payments", "Purchase SMS credits", "Access Edulex billing", "Restore backups", "Delete financial records", "Create/edit fee structures"],
    workflows: ["Admissions: Officer Submits → Headteacher Approves", "Results: Teacher Submits → Headteacher Approves → Publish"],
  },
  {
    key: "teacher",
    name: "Teacher",
    type: "internal",
    focus: "Assigned Classes & Subjects",
    description: "Manages day-to-day classroom activities. Can only access assigned classes and subjects. Submits assessment scores for headteacher approval.",
    color: "#0284c7",
    bg: "#e0f2fe",
    icon: <BookOpen size={16} />,
    badge: "Class / Subject",
    canAccess: ["Dashboard", "Assigned Classes", "Assigned Subjects", "Attendance (assigned)", "Assessments (assigned)", "Timetable", "Class Communication", "Profile"],
    canDo: ["Mark attendance (assigned classes only)", "Enter assessment scores", "Submit results for approval", "View assigned students", "Send class announcements"],
    cannotDo: ["Publish or approve results", "Access fees or payments", "Manage staff", "Access settings", "View reports outside assigned classes", "Access other teachers' classes"],
    workflows: ["Results: Teacher Submits → Headteacher Approves → Publish"],
  },
  {
    key: "accountant",
    name: "Accountant",
    type: "internal",
    focus: "Fee Collection · Reconciliation",
    description: "Manages all financial transactions: recording payments, generating receipts, invoices, and reconciliation. Cannot create or modify fee structures.",
    color: "#15803d",
    bg: "#dcfce7",
    icon: <Calculator size={16} />,
    badge: "Finance Only",
    canAccess: ["Dashboard", "Finance Dashboard", "Invoices", "Record Payments", "Payment History", "Balances", "Reconciliation", "Finance Reports", "Communication"],
    canDo: ["Record payments (online & offline)", "Generate receipts", "Export finance reports", "Send fee reminders", "Optionally: approve offline payments", "Optionally: reverse payments"],
    cannotDo: ["Create or edit fee structures", "Delete payments or invoices", "Publish results", "Manage users", "Manage subscriptions", "Access academic modules"],
    workflows: ["Offline Payment: Accountant Records → School Owner Approves", "Fee Structure: Accountant Proposes → School Owner Approves"],
  },
  {
    key: "admissions_officer",
    name: "Admissions Officer",
    type: "internal",
    focus: "Student Onboarding",
    description: "Handles new student intake — creates and manages admission applications, uploads documents, and generates admission letters. Cannot approve admissions.",
    color: "#d97706",
    bg: "#fef3c7",
    icon: <ClipboardList size={16} />,
    badge: "Admissions",
    canAccess: ["Dashboard", "Admissions", "Student Registration", "Student Documents", "Admissions Reports"],
    canDo: ["Create admission applications", "Edit admission applications", "Upload student documents", "Generate admission letters", "Send admission communications"],
    cannotDo: ["Approve admissions (Headteacher only)", "Approve fees", "Publish results", "Manage users", "Manage settings", "Access finance modules"],
    workflows: ["Admissions: Officer Creates → Headteacher Approves"],
  },
  {
    key: "parent",
    name: "Parent",
    type: "external",
    focus: "Child Progress Monitoring",
    description: "Parent or guardian with access to their own child's records only. Can pay fees, view results, download receipts, and receive school announcements.",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: <Users size={16} />,
    badge: "Parent Portal",
    canAccess: ["Parent Dashboard", "Child Attendance", "Child Results", "Report Cards", "Invoices", "Receipts", "Payment History", "Announcements", "Profile"],
    canDo: ["Pay school fees", "Download receipts and report cards", "View child's academic progress", "Receive announcements"],
    cannotDo: ["Edit academic records", "View other students", "Access admin features", "Access staff information"],
  },
  {
    key: "student",
    name: "Student",
    type: "external",
    focus: "Own Records Only",
    description: "Student with access to their own academic records only. Can view timetable, attendance, results, and assignments. Read-only access.",
    color: "#9333ea",
    bg: "#fdf4ff",
    icon: <User size={16} />,
    badge: "Student Portal",
    canAccess: ["Student Dashboard", "Timetable", "Attendance (own)", "Assignments", "Results", "Report Cards", "Announcements", "Profile"],
    canDo: ["View own academic records", "View own timetable", "View own attendance", "Receive announcements"],
    cannotDo: ["Edit any academic records", "Access other students' data", "Access administration features", "Access financial records"],
  },
];

const permissionMatrix = [
  { label: "Dashboard Access",           keys: ["super_admin","school_owner","headteacher","teacher","accountant","admissions_officer","parent","student"] },
  { label: "Manage Students",            keys: ["super_admin","headteacher","admissions_officer"] },
  { label: "Manage Admissions",          keys: ["super_admin","headteacher","admissions_officer"] },
  { label: "Approve Admissions",         keys: ["super_admin","headteacher"] },
  { label: "Mark Attendance",            keys: ["headteacher","teacher"] },
  { label: "Enter Assessments / Scores", keys: ["teacher"] },
  { label: "Approve & Publish Results",  keys: ["super_admin","headteacher"] },
  { label: "Create Fee Structures",      keys: ["super_admin","school_owner"] },
  { label: "Record Payments",            keys: ["accountant"] },
  { label: "View Finance Reports",       keys: ["super_admin","school_owner","accountant"] },
  { label: "Manage Staff",               keys: ["super_admin","school_owner"] },
  { label: "View Staff Directory",       keys: ["super_admin","school_owner","headteacher"] },
  { label: "Roles & Permissions",        keys: ["super_admin","school_owner"] },
  { label: "Send Communication",         keys: ["super_admin","school_owner","headteacher","teacher","accountant","admissions_officer"] },
  { label: "Manage Settings",            keys: ["super_admin","school_owner","headteacher"] },
  { label: "Manage Subscriptions",       keys: ["super_admin","school_owner"] },
  { label: "Backup & Recovery",          keys: ["super_admin","school_owner"] },
  { label: "View Own Records",           keys: ["parent","student"] },
];

const typeColors: Record<string, { bg: string; color: string; label: string }> = {
  platform: { bg: "#f5f3ff", color: "#7c3aed", label: "Platform" },
  internal: { bg: "#dbeafe", color: "#1d4ed8", label: "Internal" },
  external: { bg: "#f3f4f6", color: "#6b7280", label: "External" },
};

export default function RolesPermissions() {
  const { isMobile } = useWindowSize();
  const [selected, setSelected] = useState("headteacher");
  const [matrixOpen, setMatrixOpen] = useState(false);
  const current = roles.find((r) => r.key === selected)!;
  const tc = typeColors[current.type];

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Roles & Permissions</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Review what each role can access and do within Maxibern SchoolOS. 8 roles — 2 external, 5 internal, 1 platform.</p>
      </div>

      {/* Role selector tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto", paddingBottom: 4, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {roles.map((r) => (
          <button key={r.key} onClick={() => setSelected(r.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 12px", borderRadius: 8,
              background: selected === r.key ? r.color : "white",
              color: selected === r.key ? "white" : "#374151",
              fontSize: 12.5, fontWeight: selected === r.key ? 700 : 400,
              cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: selected === r.key ? `0 2px 8px ${r.color}55` : "0 1px 3px rgba(0,0,0,0.08)",
              border: `1.5px solid ${selected === r.key ? r.color : "#e5e7eb"}`,
              transition: "all 0.15s",
            }}>
            <span style={{ color: selected === r.key ? "white" : r.color, display: "flex" }}>{r.icon}</span>
            {r.name}
          </button>
        ))}
      </div>

      {/* Role detail card */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gap: 14, marginBottom: 16 }}>
        {/* Left: Role overview */}
        <div style={{ background: "white", borderRadius: 14, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: current.bg, display: "flex", alignItems: "center", justifyContent: "center", color: current.color, flexShrink: 0 }}>
              {current.icon}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{current.name}</div>
              <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: tc.bg, color: tc.color }}>{tc.label}</span>
                {current.badge && <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: current.bg, color: current.color }}>{current.badge}</span>}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Focus Area</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: current.color, marginBottom: 12 }}>{current.focus}</div>

          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Description</div>
          <p style={{ fontSize: 12.5, color: "#374151", margin: 0, lineHeight: 1.6 }}>{current.description}</p>

          {current.type === "platform" && (
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#fef3c7", borderRadius: 8, border: "1px solid #fde68a" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <Info size={13} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11.5, color: "#92400e" }}>This role is managed by the Edulex team only and is not assignable within the school.</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Access + Can/Cannot */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Can Access */}
          <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Can Access</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {current.canAccess.map((item) => (
                <span key={item} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 20, background: current.bg, color: current.color, fontWeight: 500 }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Can Do / Cannot Do grid */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#15803d", marginBottom: 10 }}>✅ Can Do</div>
              {current.canDo.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                  <Check size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#dc2626", marginBottom: 10 }}>🚫 Cannot Do</div>
              {current.cannotDo.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                  <X size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
              {current.cannotDo.length === 0 && <span style={{ fontSize: 12, color: "#9ca3af" }}>No listed restrictions</span>}
            </div>
          </div>

          {/* Approval workflows */}
          {current.workflows && current.workflows.length > 0 && (
            <div style={{ background: "#fffbeb", borderRadius: 14, padding: "16px 20px", border: "1px solid #fef08a" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>⚡ Approval Workflows</div>
              {current.workflows.map((wf) => (
                <div key={wf} style={{ fontSize: 12, color: "#78350f", marginBottom: 6, lineHeight: 1.5 }}>→ {wf}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Permission Matrix */}
      <div style={{ background: "white", borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
        <button onClick={() => setMatrixOpen((v) => !v)}
          style={{ width: "100%", padding: "14px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>Full Permission Matrix</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11.5, color: "#9ca3af" }}>All 8 roles × {permissionMatrix.length} permissions</span>
            {matrixOpen ? <ChevronDown size={15} color="#9ca3af" /> : <ChevronRight size={15} color="#9ca3af" />}
          </div>
        </button>

        {matrixOpen && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead>
                <tr style={{ borderTop: "1px solid #f3f4f6" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#374151", background: "#f9fafb", whiteSpace: "nowrap", width: 200, position: "sticky", left: 0, zIndex: 2, borderRight: "1px solid #e5e7eb" }}>
                    Permission
                  </th>
                  {roles.map((r) => (
                    <th key={r.key} style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: r.color, background: "#f9fafb", whiteSpace: "nowrap", minWidth: 100 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <span style={{ color: r.color, display: "flex" }}>{r.icon}</span>
                        <span>{r.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((perm, i) => (
                  <tr key={perm.label} style={{ borderTop: "1px solid #f9fafb", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                    <td style={{ padding: "9px 16px", fontWeight: 500, color: "#374151", background: i % 2 === 0 ? "white" : "#fafafa", position: "sticky", left: 0, zIndex: 1, borderRight: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>
                      {perm.label}
                    </td>
                    {roles.map((r) => {
                      const has = perm.keys.includes(r.key);
                      return (
                        <td key={r.key} style={{ padding: "9px 12px", textAlign: "center" }}>
                          {has
                            ? <div style={{ display: "inline-flex", width: 22, height: 22, borderRadius: "50%", background: "#dcfce7", alignItems: "center", justifyContent: "center" }}><Check size={12} color="#16a34a" /></div>
                            : <div style={{ display: "inline-flex", width: 22, height: 22, borderRadius: "50%", background: "#f9fafb", alignItems: "center", justifyContent: "center" }}><X size={11} color="#d1d5db" /></div>
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical restrictions notice */}
      <div style={{ marginTop: 14, padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#991b1b", marginBottom: 8 }}>⚠️ Critical Restrictions (All Roles)</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "6px 16px" }}>
          {[
            "Only Super Admin can delete a school or reset the system",
            "No role may permanently delete: Payments, Receipts, Audit Logs, or Published Results",
            "Use Archive, Reverse, or Void instead of Delete",
            "Teacher access is scoped to assigned classes only",
            "Parent access is scoped to their own child only",
            "Student access is read-only, self-scoped",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <X size={11} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 11.5, color: "#7f1d1d", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
