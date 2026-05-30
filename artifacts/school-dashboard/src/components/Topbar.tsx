import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Bell, MessageCircle, Command, X, Check, Bus, CreditCard, Users, CalendarCheck, Receipt, User, Shield, LogOut, Settings as SettingsIcon, KeyRound } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";

const notifications = [
  { id: 1, icon: "absent",    title: "Kofi Asante marked absent",          desc: "P6 – Topaz • Auto-alert sent to parent",           time: "5 min ago",  read: false, color: "#dc2626", bg: "#fee2e2", page: "attendance" },
  { id: 2, icon: "payment",   title: "New payment received",               desc: "GH₵ 2,400 from Nana Ama Owusu (P4 – Ruby)",         time: "15 min ago", read: false, color: "#16a34a", bg: "#dcfce7", page: "billing" },
  { id: 3, icon: "bus",       title: "Bus 07 delayed",                     desc: "Route D is 12 minutes behind schedule",            time: "32 min ago", read: false, color: "#d97706", bg: "#fef3c7", page: "transport" },
  { id: 4, icon: "fee",       title: "Outstanding fees reminder",          desc: "18 students have overdue fees this term",           time: "2 hrs ago",  read: true,  color: "#7c3aed", bg: "#ede9fe", page: "billing" },
  { id: 5, icon: "admission", title: "New admission application",          desc: "HKB-ADM-2026-0127 submitted for review",            time: "3 hrs ago",  read: true,  color: "#2563eb", bg: "#dbeafe", page: "admissions" },
];

const notifIconMap: Record<string, React.ReactNode> = {
  absent: <CalendarCheck size={14} />, payment: <CreditCard size={14} />,
  bus:    <Bus size={14} />,           fee:     <Receipt size={14} />,    admission: <Users size={14} />,
};

const searchIndex = [
  { type: "page",    label: "Dashboard",         icon: "🏠", page: "dashboard" },
  { type: "page",    label: "All Students",       icon: "👥", page: "all-students" },
  { type: "page",    label: "Admissions",         icon: "📋", page: "admissions" },
  { type: "page",    label: "Attendance",         icon: "✅", page: "attendance" },
  { type: "page",    label: "Staff",              icon: "👨‍🏫", page: "staff" },
  { type: "page",    label: "Reports",            icon: "📊", page: "all-reports" },
  { type: "page",    label: "Settings",           icon: "⚙️",  page: "settings" },
  { type: "page",    label: "My Profile",         icon: "👤", page: "profile" },
  { type: "page",    label: "Security",           icon: "🔒", page: "security" },
  { type: "student", label: "Kofi Junior Asante", icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2026-0012" },
  { type: "student", label: "Ama Serwaa Ofori",   icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2026-0013" },
  { type: "student", label: "Daniel Nii Lartey",  icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2026-0014" },
  { type: "action",  label: "Mark Attendance",    icon: "✅", page: "attendance",   sub: "Take attendance for today" },
  { type: "action",  label: "Create Invoice",     icon: "📄", page: "billing",      sub: "Generate a new invoice" },
  { type: "action",  label: "New Admission",      icon: "📋", page: "admissions",   sub: "Add a new application" },
  { type: "action",  label: "Send Bulk SMS",      icon: "💬", page: "sms",          sub: "Message parents and students" },
];

export default function Topbar({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { onNavigate: ctxNavigate } = useApp();
  const { user, logout }            = useAuth();
  const { isMobile, isTablet, isDesktop } = useWindowSize();

  const navigate = onNavigate || ctxNavigate;

  const [notifOpen,   setNotifOpen]   = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifs,      setNotifs]      = useState(notifications);

  const notifRef  = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 220;
  const unreadCount  = notifs.filter((n) => !n.read).length;

  const filteredResults = searchQuery.trim()
    ? searchIndex.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || ("sub" in item && item.sub && item.sub.toLowerCase().includes(searchQuery.toLowerCase())))
    : searchIndex.filter((item) => item.type === "page");

  const resultsByType: Record<string, typeof searchIndex> = {};
  filteredResults.forEach((r) => { if (!resultsByType[r.type]) resultsByType[r.type] = []; resultsByType[r.type].push(r); });
  const typeLabel: Record<string, string> = { page: "Pages", student: "Students", action: "Actions" };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); setUserOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleNotifClick = (n: typeof notifications[0]) => {
    setNotifs((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item));
    navigate(n.page);
    setNotifOpen(false);
  };

  const handleLogout = () => {
    setUserOpen(false);
    logout();
  };

  const handleNav = (page: string) => { navigate(page); setUserOpen(false); };

  const displayName = user?.name || "User";
  const displayRole = user?.role || "Guest";
  const initials    = user?.initials || displayName.slice(0, 2).toUpperCase();
  const avatarBg    = user?.avatarBg || "#ede9fe";
  const avatarColor = user?.avatarColor || "#7c3aed";

  const dropItems = [
    { icon: <User size={13} />,      label: "My Profile",              page: "profile",  color: "#374151" },
    { icon: <Shield size={13} />,    label: "Security",                page: "security", color: "#374151" },
    { icon: <KeyRound size={13} />,  label: "Change Password",         page: "security", color: "#374151" },
    { icon: <SettingsIcon size={13} />, label: "Notification Settings", page: "settings", color: "#374151" },
  ];

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: sidebarWidth, right: 0, height: 56,
        background: "white", borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center",
        padding: isMobile ? "0 12px" : "0 20px",
        gap: isMobile ? 10 : 16, zIndex: 30, transition: "left 0.2s",
      }}>
        {/* Search trigger */}
        <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", padding: 4 }}>
          <Search size={20} />
        </button>

        {!isMobile && (
          <div onClick={() => setSearchOpen(true)} style={{ flex: 1, maxWidth: 380, position: "relative", display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Search size={14} style={{ position: "absolute", left: 10, color: "#9ca3af", pointerEvents: "none" }} />
            <div style={{ width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#9ca3af", background: "#f9fafb", userSelect: "none" }}>
              Search for students, parents, invoices...
            </div>
            <div style={{ position: "absolute", right: 10, display: "flex", alignItems: "center", gap: 2, color: "#9ca3af", fontSize: 11 }}>
              <Command size={11} /><span>K</span>
            </div>
          </div>
        )}

        {isMobile && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎓</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>SchoolOS</span>
          </div>
        )}

        <div style={{ flex: isMobile ? 0 : 1 }} />

        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", background: "white" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🏫</div>
            {isDesktop && <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>Happy Kids Basic School</span>}
            <ChevronDown size={13} color="#9ca3af" />
          </div>
        )}

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex", padding: 4 }}>
            <Bell size={19} color={notifOpen ? "#7c3aed" : "#6b7280"} />
            {unreadCount > 0 && (
              <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, background: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 700 }}>
                {unreadCount}
              </div>
            )}
          </button>

          {notifOpen && (
            <div style={{ position: "absolute", top: 40, right: isMobile ? -50 : 0, width: isMobile ? "calc(100vw - 24px)" : 360, background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #e5e7eb", zIndex: 100, animation: "fadeIn 0.15s ease", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Notifications</span>
                  {unreadCount > 0 && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, background: "#7c3aed", color: "white", padding: "1px 7px", borderRadius: 10 }}>{unreadCount} new</span>}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifs.map((n) => (
                  <div key={n.id} onClick={() => handleNotifClick(n)}
                    style={{ display: "flex", gap: 12, padding: "12px 16px", cursor: "pointer", background: n.read ? "white" : "#faf5ff", borderBottom: "1px solid #f9fafb", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = n.read ? "white" : "#faf5ff"; }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: n.bg, color: n.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{notifIconMap[n.icon]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: n.read ? 500 : 700, color: "#111827" }}>{n.title}</span>
                        {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: 4, marginLeft: 6 }} />}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
                <button onClick={() => { navigate("announcements"); setNotifOpen(false); }} style={{ fontSize: 12.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {!isMobile && (
          <button onClick={() => navigate("announcements")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 4 }}>
            <MessageCircle size={19} />
          </button>
        )}

        {/* User avatar + dropdown */}
        <div ref={userRef} style={{ position: "relative" }}>
          <button onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : 8, cursor: "pointer", background: "none", border: "none", padding: "4px 2px", borderRadius: 8 }}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #ede9fe" }} />
              : <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarBg, color: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, border: "2px solid #ede9fe" }}>{initials}</div>
            }
            {!isMobile && (
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", lineHeight: 1.3, whiteSpace: "nowrap", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.3, whiteSpace: "nowrap", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{displayRole}</div>
              </div>
            )}
            {!isMobile && <ChevronDown size={13} color="#9ca3af" />}
          </button>

          {userOpen && (
            <div style={{ position: "absolute", top: 44, right: 0, width: 220, background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #e5e7eb", zIndex: 100, animation: "fadeIn 0.15s ease", overflow: "hidden" }}>
              {/* User info */}
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
                {user?.avatar
                  ? <img src={user.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  : <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarBg, color: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{initials}</div>
                }
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || ""}</div>
                </div>
              </div>

              {/* Navigation items */}
              <div style={{ padding: "4px 0" }}>
                {dropItems.map((item) => (
                  <button key={item.label} onClick={() => handleNav(item.page)}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 14px", border: "none", background: "none", cursor: "pointer", color: item.color, fontSize: 13, fontWeight: 500, textAlign: "left", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}>
                    <span style={{ color: "#9ca3af", display: "flex" }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div style={{ borderTop: "1px solid #f3f4f6", padding: "4px 0" }}>
                <button onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 14px", border: "none", background: "none", cursor: "pointer", color: "#dc2626", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}>
                  <LogOut size={13} color="#dc2626" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: isMobile ? 20 : 80 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ width: isMobile ? "calc(100vw - 24px)" : 560, background: "white", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden", animation: "fadeIn 0.15s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
              <Search size={16} color="#9ca3af" />
              <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, students, actions..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#111827", background: "transparent", fontFamily: "inherit" }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}><X size={14} /></button>}
              <kbd style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", padding: "2px 7px", borderRadius: 5, border: "1px solid #e5e7eb" }}>ESC</kbd>
            </div>
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {Object.entries(resultsByType).length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No results for "{searchQuery}"</div>
              ) : (
                Object.entries(resultsByType).map(([type, items]) => (
                  <div key={type}>
                    <div style={{ padding: "10px 16px 4px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{typeLabel[type] || type}</div>
                    {items.map((item, i) => (
                      <div key={i} onClick={() => { setSearchOpen(false); setSearchQuery(""); navigate(item.page); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", transition: "background 0.1s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{item.label}</div>
                          {"sub" in item && item.sub && <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{item.sub}</div>}
                        </div>
                        <span style={{ fontSize: 10.5, color: "#9ca3af", background: "#f3f4f6", padding: "2px 8px", borderRadius: 6 }}>↵</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
            {!isMobile && (
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 16 }}>
                {[["↑↓", "Navigate"], ["↵", "Select"], ["Esc", "Close"]].map(([key, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9ca3af" }}>
                    <kbd style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 4, padding: "1px 6px", fontSize: 11, color: "#6b7280" }}>{key}</kbd>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
