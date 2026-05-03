import { useState } from "react";
import {
  LayoutDashboard, Users, UserPlus, CalendarCheck, HeartPulse, Shield,
  BookOpen, School, Clock, FileText, PenLine, BarChart2, FileBadge,
  Receipt, CreditCard, TrendingDown, Banknote, Award,
  MessageSquare, MessageCircle, Mail, Bell, Calendar, Settings,
  ChevronRight, ChevronDown, GraduationCap, Bus, Utensils,
  Package, Library, ClipboardList, BookMarked, Star, BarChart,
  DollarSign, Send, Hash,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  page: string;
  hasChildren?: boolean;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    section: "STUDENTS",
    items: [
      { label: "All Students", icon: <Users size={14} />, page: "all-students" },
      { label: "Admissions", icon: <UserPlus size={14} />, page: "admissions" },
      { label: "Attendance", icon: <CalendarCheck size={14} />, page: "attendance" },
      { label: "Health Records", icon: <HeartPulse size={14} />, page: "health" },
      { label: "Discipline", icon: <Shield size={14} />, page: "discipline" },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      { label: "Subjects", icon: <BookOpen size={14} />, page: "subjects" },
      { label: "Classes", icon: <School size={14} />, page: "classes", hasChildren: true },
      { label: "Timetable", icon: <Clock size={14} />, page: "timetable" },
      { label: "Homework", icon: <FileText size={14} />, page: "homework" },
      { label: "Exams", icon: <PenLine size={14} />, page: "exams" },
      { label: "Results", icon: <BarChart2 size={14} />, page: "results" },
      { label: "Gradebook", icon: <BookMarked size={14} />, page: "gradebook" },
      { label: "Report Cards", icon: <FileBadge size={14} />, page: "report-cards" },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { label: "Billing", icon: <Receipt size={14} />, page: "billing", hasChildren: true },
      { label: "Invoices", icon: <ClipboardList size={14} />, page: "invoices" },
      { label: "Payments", icon: <CreditCard size={14} />, page: "payments" },
      { label: "Expenses", icon: <TrendingDown size={14} />, page: "expenses" },
      { label: "Payroll", icon: <Banknote size={14} />, page: "payroll" },
      { label: "Scholarships", icon: <Award size={14} />, page: "scholarships" },
      { label: "Financial Reports", icon: <BarChart size={14} />, page: "financial-reports" },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [
      { label: "Communication Hub", icon: <Hash size={14} />, page: "communication-hub" },
      { label: "Notices", icon: <Bell size={14} />, page: "notices" },
      { label: "SMS", icon: <MessageSquare size={14} />, page: "sms", hasChildren: true },
      { label: "WhatsApp", icon: <MessageCircle size={14} />, page: "whatsapp" },
      { label: "Email", icon: <Mail size={14} />, page: "email" },
      { label: "Events", icon: <Calendar size={14} />, page: "events" },
      { label: "Parent Chat", icon: <MessageSquare size={14} />, page: "parent-chat" },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { label: "Transport", icon: <Bus size={14} />, page: "transport" },
      { label: "Feeding", icon: <Utensils size={14} />, page: "feeding" },
      { label: "Inventory", icon: <Package size={14} />, page: "inventory" },
      { label: "Library", icon: <Library size={14} />, page: "library-ops" },
    ],
  },
  {
    section: "REPORTS",
    items: [
      { label: "All Reports", icon: <BarChart2 size={14} />, page: "all-reports" },
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

  const NavItemRow = ({ item }: { item: NavItem }) => {
    const isActive = activePage === item.page;
    const isExpanded = expandedItems.includes(item.label);

    return (
      <div
        onClick={() => {
          if (item.hasChildren) toggleItem(item.label);
          if (item.page) onNavigate(item.page);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "6px 12px",
          borderRadius: 6,
          cursor: "pointer",
          color: isActive ? "white" : "#cbd5e1",
          fontSize: 12.5,
          justifyContent: "space-between",
          background: isActive ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "transparent",
          transition: "background 0.12s",
          marginBottom: 1,
        }}
        onMouseEnter={(e) => {
          if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ color: isActive ? "white" : "#94a3b8", display: "flex", alignItems: "center" }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
        {item.hasChildren && (
          <span style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#64748b" }}>
            {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </span>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
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
      <div style={{ padding: "18px 16px 14px", flexShrink: 0 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, cursor: "pointer" }}
          onClick={() => onNavigate("dashboard")}
        >
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Maxibern</div>
            <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>SchoolOS</div>
          </div>
        </div>
        <div style={{ color: "#6b7280", fontSize: 10, paddingLeft: 2 }}>Run your school on Maxibern</div>
      </div>

      {/* Dashboard */}
      <div style={{ padding: "4px 10px 2px", flexShrink: 0 }}>
        <div
          onClick={() => onNavigate("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 12px",
            borderRadius: 8,
            background: activePage === "dashboard" ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "transparent",
            cursor: "pointer",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => {
            if (activePage !== "dashboard") (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            if (activePage !== "dashboard") (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LayoutDashboard size={15} color="white" />
          <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Dashboard</span>
        </div>
      </div>

      {/* Scrollable nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px", paddingBottom: 64 }}>
        {navSections.map((section) => (
          <div key={section.section} style={{ marginBottom: 6 }}>
            <div style={{ color: "#6b7280", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", padding: "8px 12px 4px", textTransform: "uppercase" }}>
              {section.section}
            </div>
            {section.items.map((item) => (
              <NavItemRow key={item.label} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.25)" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 12px", borderRadius: 6, cursor: "pointer", color: "#94a3b8", fontSize: 12.5, justifyContent: "space-between" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Settings size={14} />
            <span>Settings</span>
          </div>
          <ChevronRight size={11} />
        </div>
      </div>
    </aside>
  );
}
