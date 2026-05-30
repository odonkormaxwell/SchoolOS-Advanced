import { useState } from "react";
import {
  LayoutDashboard, Users, UserPlus, CalendarCheck,
  BookOpen, School, Clock, PenLine,
  Receipt, FileText, CreditCard, Wallet,
  Megaphone, MessageSquare, MessageCircle, Mail,
  UserCog, Shield, BarChart2, Settings, Terminal,
  ChevronRight, ChevronDown, GraduationCap,
} from "lucide-react";

const isDev = import.meta.env.DEV;

export type Permission =
  | "manage_students"
  | "manage_admissions"
  | "manage_attendance"
  | "manage_assessments"
  | "manage_fees"
  | "manage_staff"
  | "view_reports"
  | "manage_communication"
  | "manage_settings"
  | "manage_roles_permissions";

export type UserRole = "administrator" | "teacher" | "accountant" | "admissions_officer";

export const rolePermissions: Record<UserRole, Permission[]> = {
  administrator: [
    "manage_students", "manage_admissions", "manage_attendance",
    "manage_assessments", "manage_fees", "manage_staff",
    "view_reports", "manage_communication", "manage_settings",
    "manage_roles_permissions",
  ],
  teacher: [
    "manage_students", "manage_attendance",
    "manage_assessments", "manage_communication", "view_reports",
  ],
  accountant: [
    "manage_students", "manage_fees", "view_reports", "manage_communication",
  ],
  admissions_officer: [
    "manage_students", "manage_admissions", "manage_communication", "view_reports",
  ],
};

type NavChild = { label: string; icon: React.ReactNode; page: string; };
type NavGroup = {
  label: string;
  icon: React.ReactNode;
  permission: Permission;
  children: NavChild[];
};

const navGroups: NavGroup[] = [
  {
    label: "Students",
    icon: <Users size={15} />,
    permission: "manage_students",
    children: [
      { label: "All Students", icon: <Users size={13} />, page: "all-students" },
      { label: "Admissions",   icon: <UserPlus size={13} />, page: "admissions" },
      { label: "Attendance",   icon: <CalendarCheck size={13} />, page: "attendance" },
    ],
  },
  {
    label: "Academics",
    icon: <BookOpen size={15} />,
    permission: "manage_assessments",
    children: [
      { label: "Subjects",     icon: <BookOpen size={13} />, page: "subjects" },
      { label: "Classes",      icon: <School size={13} />, page: "classes" },
      { label: "Timetable",    icon: <Clock size={13} />, page: "timetable" },
      { label: "Assessments",  icon: <PenLine size={13} />, page: "assessments" },
    ],
  },
  {
    label: "Fees",
    icon: <Receipt size={15} />,
    permission: "manage_fees",
    children: [
      { label: "Fee Structure", icon: <FileText size={13} />, page: "fee-structure" },
      { label: "Invoices",      icon: <Receipt size={13} />, page: "invoices" },
      { label: "Payments",      icon: <CreditCard size={13} />, page: "payments" },
      { label: "Balances",      icon: <Wallet size={13} />, page: "balances" },
    ],
  },
  {
    label: "Communication",
    icon: <MessageSquare size={15} />,
    permission: "manage_communication",
    children: [
      { label: "Announcements", icon: <Megaphone size={13} />, page: "announcements" },
      { label: "SMS",           icon: <MessageSquare size={13} />, page: "sms" },
      { label: "WhatsApp",      icon: <MessageCircle size={13} />, page: "whatsapp" },
      { label: "Email",         icon: <Mail size={13} />, page: "email" },
    ],
  },
  {
    label: "Staff",
    icon: <UserCog size={15} />,
    permission: "manage_staff",
    children: [
      { label: "Staff Directory",      icon: <UserCog size={13} />, page: "staff" },
      { label: "Roles & Permissions",  icon: <Shield size={13} />, page: "roles-permissions" },
    ],
  },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  compact?: boolean;
  userRole?: UserRole;
  extraPermissions?: Permission[];
}

export default function Sidebar({
  activePage,
  onNavigate,
  compact = false,
  userRole = "administrator",
  extraPermissions = [],
}: SidebarProps) {
  const permissions = new Set<Permission>([
    ...rolePermissions[userRole],
    ...extraPermissions,
  ]);

  const visibleGroups = navGroups.filter((g) => permissions.has(g.permission));

  const activeGroup = visibleGroups.find((g) =>
    g.children.some((c) => c.page === activePage)
  );

  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    activeGroup ? [activeGroup.label] : [visibleGroups[0]?.label ?? ""]
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const width = compact ? 64 : 220;

  return (
    <aside
      style={{
        width,
        minWidth: width,
        background: "linear-gradient(180deg,#0f172a 0%,#1e1b4b 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: compact ? "18px 0" : "18px 16px 14px",
          flexShrink: 0,
          display: "flex",
          justifyContent: compact ? "center" : "flex-start",
          cursor: "pointer",
        }}
        onClick={() => onNavigate("dashboard")}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <GraduationCap size={18} color="white" />
        </div>
        {!compact && (
          <div style={{ marginLeft: 10 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
              Maxibern
            </div>
            <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
              SchoolOS
            </div>
          </div>
        )}
      </div>

      {/* Dashboard */}
      <div style={{ padding: compact ? "4px 12px" : "4px 10px 2px", flexShrink: 0 }}>
        <div
          onClick={() => onNavigate("dashboard")}
          title={compact ? "Dashboard" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: compact ? "center" : "flex-start",
            gap: 9,
            padding: compact ? "8px 0" : "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.12s",
            background:
              activePage === "dashboard"
                ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                : "transparent",
            width: compact ? 40 : "auto",
          }}
          onMouseEnter={(e) => {
            if (activePage !== "dashboard")
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            if (activePage !== "dashboard")
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LayoutDashboard size={15} color="white" />
          {!compact && (
            <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Dashboard</span>
          )}
        </div>
      </div>

      {/* Scrollable nav */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: compact ? "4px 12px" : "4px 10px",
          paddingBottom: 64,
        }}
      >
        {visibleGroups.map((group) => {
          const isOpen = expandedGroups.includes(group.label);
          const groupActive = group.children.some((c) => c.page === activePage);

          if (compact) {
            return (
              <div key={group.label} style={{ marginBottom: 4 }}>
                {group.children.map((child) => {
                  const isActive = activePage === child.page;
                  return (
                    <div
                      key={child.page}
                      title={child.label}
                      onClick={() => onNavigate(child.page)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 34,
                        borderRadius: 8,
                        marginBottom: 2,
                        cursor: "pointer",
                        background: isActive
                          ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                          : "transparent",
                        color: isActive ? "white" : "#94a3b8",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background =
                            "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {child.icon}
                      </span>
                    </div>
                  );
                })}
                <div style={{ height: 6 }} />
              </div>
            );
          }

          return (
            <div key={group.label} style={{ marginBottom: 2 }}>
              {/* Group header */}
              <div
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 12px",
                  borderRadius: 7,
                  cursor: "pointer",
                  color: groupActive ? "#c4b5fd" : "#94a3b8",
                  fontSize: 13,
                  fontWeight: groupActive ? 600 : 500,
                  background: groupActive && !isOpen
                    ? "rgba(124,58,237,0.15)"
                    : "transparent",
                  transition: "background 0.12s",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    groupActive && !isOpen ? "rgba(124,58,237,0.15)" : "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span
                    style={{
                      color: groupActive ? "#a78bfa" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {group.icon}
                  </span>
                  <span>{group.label}</span>
                </div>
                <span style={{ color: "#475569", display: "flex", alignItems: "center" }}>
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </span>
              </div>

              {/* Children */}
              {isOpen && (
                <div
                  style={{
                    marginLeft: 14,
                    paddingLeft: 10,
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    marginBottom: 4,
                    marginTop: 1,
                  }}
                >
                  {group.children.map((child) => {
                    const isActive = activePage === child.page;
                    return (
                      <div
                        key={child.page}
                        onClick={() => onNavigate(child.page)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12.5,
                          color: isActive ? "white" : "#94a3b8",
                          background: isActive
                            ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                            : "transparent",
                          transition: "background 0.12s",
                          marginBottom: 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(255,255,255,0.07)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <span
                          style={{
                            color: isActive ? "white" : "#64748b",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {child.icon}
                        </span>
                        <span>{child.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Reports — single item, visible if view_reports permission */}
        {permissions.has("view_reports") && !compact && (
          <div
            onClick={() => onNavigate("reports")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "7px 12px",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activePage === "reports" ? 600 : 500,
              color: activePage === "reports" ? "white" : "#94a3b8",
              background:
                activePage === "reports"
                  ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                  : "transparent",
              transition: "background 0.12s",
              marginBottom: 2,
              marginTop: 2,
            }}
            onMouseEnter={(e) => {
              if (activePage !== "reports")
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              if (activePage !== "reports")
                (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span
              style={{
                color: activePage === "reports" ? "white" : "#64748b",
                display: "flex",
                alignItems: "center",
              }}
            >
              <BarChart2 size={15} />
            </span>
            <span>Reports</span>
          </div>
        )}

        {compact && permissions.has("view_reports") && (
          <div
            title="Reports"
            onClick={() => onNavigate("reports")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 34,
              borderRadius: 8,
              marginBottom: 2,
              cursor: "pointer",
              background:
                activePage === "reports"
                  ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                  : "transparent",
              color: activePage === "reports" ? "white" : "#94a3b8",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => {
              if (activePage !== "reports")
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              if (activePage !== "reports")
                (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <BarChart2 size={15} />
          </div>
        )}
      </div>

      {/* Dev Credentials — only in development */}
      {isDev && !compact && (
        <div
          onClick={() => onNavigate("dev-credentials")}
          style={{
            position: "absolute", bottom: 46, left: 0, right: 0,
            padding: "6px 10px",
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
              borderRadius: 6, cursor: "pointer", fontSize: 11.5, fontWeight: 600,
              color: activePage === "dev-credentials" ? "#fbbf24" : "#64748b",
              background: activePage === "dev-credentials" ? "rgba(251,191,36,0.12)" : "transparent",
              border: "1px dashed rgba(251,191,36,0.3)",
              width: "100%", transition: "all 0.12s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(251,191,36,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = activePage === "dev-credentials" ? "rgba(251,191,36,0.12)" : "transparent"; }}
          >
            <Terminal size={13} color="#fbbf24" />
            <span style={{ color: "#fbbf24" }}>Dev Credentials</span>
          </div>
        </div>
      )}

      {/* Settings */}
      {permissions.has("manage_settings") && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: compact ? "10px 12px" : "10px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            justifyContent: compact ? "center" : "flex-start",
          }}
        >
          <div
            title={compact ? "Settings" : undefined}
            onClick={() => onNavigate("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: compact ? "7px 0" : "7px 12px",
              borderRadius: 6,
              cursor: "pointer",
              color: activePage === "settings" ? "white" : "#94a3b8",
              background:
                activePage === "settings"
                  ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                  : "transparent",
              width: compact ? 40 : "auto",
              justifyContent: compact ? "center" : "flex-start",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => {
              if (activePage !== "settings")
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
            }}
            onMouseLeave={(e) => {
              if (activePage !== "settings")
                (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <Settings size={14} />
            {!compact && <span style={{ fontSize: 12.5 }}>Settings</span>}
            {!compact && (
              <ChevronRight size={11} style={{ marginLeft: "auto", color: "#475569" }} />
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
