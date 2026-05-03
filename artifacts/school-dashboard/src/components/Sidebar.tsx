import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  HeartPulse,
  Shield,
  BookOpen,
  School,
  Clock,
  FileText,
  PenLine,
  BarChart2,
  FileBadge,
  Receipt,
  CreditCard,
  TrendingDown,
  Banknote,
  Award,
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  Calendar,
  Settings,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Bus,
  Utensils,
  Package,
  Library,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  users: <Users size={14} />,
  "user-plus": <UserPlus size={14} />,
  "calendar-check": <CalendarCheck size={14} />,
  "heart-pulse": <HeartPulse size={14} />,
  shield: <Shield size={14} />,
  book: <BookOpen size={14} />,
  school: <School size={14} />,
  clock: <Clock size={14} />,
  "file-text": <FileText size={14} />,
  "pen-line": <PenLine size={14} />,
  "chart-bar": <BarChart2 size={14} />,
  "file-badge": <FileBadge size={14} />,
  receipt: <Receipt size={14} />,
  "credit-card": <CreditCard size={14} />,
  "trending-down": <TrendingDown size={14} />,
  banknote: <Banknote size={14} />,
  award: <Award size={14} />,
  "message-square": <MessageSquare size={14} />,
  "message-circle": <MessageCircle size={14} />,
  mail: <Mail size={14} />,
  bell: <Bell size={14} />,
  calendar: <Calendar size={14} />,
  bus: <Bus size={14} />,
  utensils: <Utensils size={14} />,
  package: <Package size={14} />,
  library: <Library size={14} />,
};

const navSections = [
  {
    section: "STUDENTS",
    items: [
      { label: "All Students", icon: "users", page: "all-students", hasChildren: false },
      { label: "Admissions", icon: "user-plus", page: "admissions" },
      { label: "Attendance", icon: "calendar-check", page: "attendance" },
      { label: "Health Records", icon: "heart-pulse", page: "health" },
      { label: "Discipline", icon: "shield", page: "discipline" },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      { label: "Subjects", icon: "book", page: "subjects" },
      { label: "Classes", icon: "school", page: "classes", hasChildren: true },
      { label: "Timetable", icon: "clock", page: "timetable" },
      { label: "Homework", icon: "file-text", page: "homework" },
      { label: "Exams", icon: "pen-line", page: "exams" },
      { label: "Results", icon: "chart-bar", page: "results" },
      { label: "Report Cards", icon: "file-badge", page: "reports" },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { label: "Billing", icon: "receipt", page: "billing", hasChildren: true },
      { label: "Payments", icon: "credit-card", page: "payments" },
      { label: "Expenses", icon: "trending-down", page: "expenses" },
      { label: "Payroll", icon: "banknote", page: "payroll" },
      { label: "Scholarships", icon: "award", page: "scholarships" },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [
      { label: "SMS", icon: "message-square", page: "sms", hasChildren: true },
      { label: "WhatsApp", icon: "message-circle", page: "whatsapp" },
      { label: "Email", icon: "mail", page: "email" },
      { label: "Notices", icon: "bell", page: "notices" },
      { label: "Events", icon: "calendar", page: "events" },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { label: "Transport", icon: "bus", page: "transport" },
      { label: "Feeding", icon: "utensils", page: "feeding" },
      { label: "Inventory", icon: "package", page: "inventory" },
      { label: "Library", icon: "library", page: "library-ops" },
    ],
  },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
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
      <div style={{ padding: "20px 16px 16px 16px" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, cursor: "pointer" }}
          onClick={() => onNavigate("dashboard")}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Maxibern</div>
            <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>SchoolOS</div>
          </div>
        </div>
        <div style={{ color: "#6b7280", fontSize: 10, marginTop: 4, paddingLeft: 2 }}>
          Run your school on Maxibern
        </div>
      </div>

      {/* Dashboard item */}
      <div style={{ padding: "4px 10px" }}>
        <div
          onClick={() => onNavigate("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 8,
            background: activePage === "dashboard"
              ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
              : "transparent",
            cursor: "pointer",
            transition: "background 0.15s",
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
          <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Dashboard</span>
        </div>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px", paddingBottom: 60 }}>
        {navSections.map((section) => (
          <div key={section.section} style={{ marginBottom: 8 }}>
            <div
              style={{
                color: "#6b7280",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "8px 12px 4px",
                textTransform: "uppercase",
              }}
            >
              {section.section}
            </div>
            {section.items.map((item) => {
              const isActive = activePage === item.page;
              const isExpanded = expandedItems.includes(item.label);
              return (
                <div key={item.label}>
                  <div
                    onClick={() => {
                      if (item.hasChildren) toggleItem(item.label);
                      if (item.page) onNavigate(item.page);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      color: isActive ? "white" : "#cbd5e1",
                      fontSize: 12.5,
                      justifyContent: "space-between",
                      background: isActive
                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                        : "transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: isActive ? "white" : "#94a3b8" }}>{iconMap[item.icon]}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.hasChildren && (
                      <span style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#64748b" }}>
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 10px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 12px",
            borderRadius: 6,
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 12.5,
            justifyContent: "space-between",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Settings size={14} />
            <span>Settings</span>
          </div>
          <ChevronRight size={12} />
        </div>
      </div>
    </aside>
  );
}
