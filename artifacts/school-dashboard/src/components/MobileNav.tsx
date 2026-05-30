import { useState } from "react";
import {
  LayoutDashboard, Users, Receipt, MessageSquare, Grid3x3, X,
  UserPlus, CalendarCheck, BookOpen, PenLine, BarChart2, Settings, UserCog,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface MobileNavProps {
  activePage: string;
}

const mainNav = [
  { icon: LayoutDashboard, label: "Home",     page: "dashboard" },
  { icon: Users,           label: "Students", page: "all-students" },
  { icon: Receipt,         label: "Fees",     page: "fee-structure" },
  { icon: MessageSquare,   label: "Messages", page: "announcements" },
  { icon: Grid3x3,         label: "More",     page: "more" },
];

const moreMenu = [
  { icon: "📋", label: "Admissions",   page: "admissions" },
  { icon: "✅", label: "Attendance",   page: "attendance" },
  { icon: "📚", label: "Classes",      page: "classes" },
  { icon: "⏰", label: "Timetable",    page: "timetable" },
  { icon: "✏️", label: "Assessments",  page: "assessments" },
  { icon: "👤", label: "Staff",        page: "staff" },
  { icon: "📊", label: "Reports",      page: "reports" },
  { icon: "⚙️", label: "Settings",     page: "settings" },
];

export default function MobileNav({ activePage }: MobileNavProps) {
  const { onNavigate } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleNav = (page: string) => {
    if (page === "more") {
      setMoreOpen((v) => !v);
    } else {
      setMoreOpen(false);
      onNavigate(page);
    }
  };

  return (
    <>
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.5)",
            zIndex: 997, backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute", bottom: 60, left: 0, right: 0,
              background: "white", borderRadius: "20px 20px 0 0",
              padding: "0 0 8px",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
              animation: "slideUp 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px 12px" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>More Features</span>
              <button
                onClick={() => setMoreOpen(false)}
                style={{
                  background: "#f3f4f6", border: "none", borderRadius: "50%",
                  width: 28, height: 28, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={14} color="#6b7280" />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "0 12px 12px" }}>
              {moreMenu.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); setMoreOpen(false); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "12px 6px", borderRadius: 12, border: "1px solid #f3f4f6",
                    background: activePage === item.page ? "#f5f3ff" : "white",
                    cursor: "pointer", transition: "all 0.12s",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 500,
                    color: activePage === item.page ? "#7c3aed" : "#374151",
                    textAlign: "center", lineHeight: 1.2,
                  }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: 60, background: "white",
        borderTop: "1px solid #e5e7eb",
        display: "flex", alignItems: "center",
        zIndex: 998,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {mainNav.map(({ icon: Icon, label, page }) => {
          const isMore = page === "more";
          const isActive = isMore ? moreOpen : activePage === page;
          return (
            <button
              key={page}
              onClick={() => handleNav(page)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 3, background: "none", border: "none",
                cursor: "pointer", padding: "6px 4px",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div style={{
                width: 38, height: 28, borderRadius: 14,
                background: isActive ? "#7c3aed" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}>
                <Icon size={20} color={isActive ? "white" : "#6b7280"} strokeWidth={isActive ? 2.5 : 1.75} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 400,
                color: isActive ? "#7c3aed" : "#6b7280", lineHeight: 1,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
