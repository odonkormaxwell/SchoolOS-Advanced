import { useState, useRef, useEffect } from "react";
import { Menu, Search, ChevronDown, Bell, MessageCircle, Command, X, Check, AlertCircle, Bus, CreditCard, Users, CalendarCheck, BookOpen, Receipt } from "lucide-react";
import { useApp } from "../context/AppContext";

const notifications = [
  { id: 1, icon: "absent", title: "Kofi Asante marked absent", desc: "P6 – Topaz • Auto-alert sent to parent", time: "5 min ago", read: false, color: "#dc2626", bg: "#fee2e2", page: "attendance" },
  { id: 2, icon: "payment", title: "New payment received", desc: "GH₵ 2,400 from Nana Ama Owusu (P4 – Ruby)", time: "15 min ago", read: false, color: "#16a34a", bg: "#dcfce7", page: "billing" },
  { id: 3, icon: "bus", title: "Bus 07 delayed", desc: "Route D is 12 minutes behind schedule", time: "32 min ago", read: false, color: "#d97706", bg: "#fef3c7", page: "transport" },
  { id: 4, icon: "fee", title: "Outstanding fees reminder", desc: "18 students have overdue fees this term", time: "2 hrs ago", read: true, color: "#7c3aed", bg: "#ede9fe", page: "billing" },
  { id: 5, icon: "admission", title: "New admission application", desc: "HKB-ADM-2024-0127 submitted for review", time: "3 hrs ago", read: true, color: "#2563eb", bg: "#dbeafe", page: "admissions" },
];

const notifIconMap: Record<string, React.ReactNode> = {
  absent: <CalendarCheck size={14} />,
  payment: <CreditCard size={14} />,
  bus: <Bus size={14} />,
  fee: <Receipt size={14} />,
  admission: <Users size={14} />,
};

const searchIndex = [
  { type: "page", label: "Dashboard", icon: "🏠", page: "dashboard" },
  { type: "page", label: "All Students", icon: "👥", page: "all-students" },
  { type: "page", label: "Admissions", icon: "📋", page: "admissions" },
  { type: "page", label: "Attendance", icon: "✅", page: "attendance" },
  { type: "page", label: "Gradebook", icon: "📚", page: "gradebook" },
  { type: "page", label: "Billing", icon: "💰", page: "billing" },
  { type: "page", label: "Communication Hub", icon: "💬", page: "communication-hub" },
  { type: "page", label: "Transport", icon: "🚌", page: "transport" },
  { type: "student", label: "Kofi Junior Asante", icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2024-0012" },
  { type: "student", label: "Ama Serwaa Ofori", icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2024-0013" },
  { type: "student", label: "Daniel Nii Lartey", icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2024-0014" },
  { type: "student", label: "Akosua Adwoa Mensah", icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2024-0015" },
  { type: "student", label: "Yaw Antwi Boakye", icon: "👤", page: "all-students", sub: "P6 – Topaz · STU-2024-0016" },
  { type: "action", label: "Mark Attendance", icon: "✅", page: "attendance", sub: "Take attendance for today" },
  { type: "action", label: "Create Invoice", icon: "📄", page: "billing", sub: "Generate a new invoice" },
  { type: "action", label: "New Admission", icon: "📋", page: "admissions", sub: "Add a new application" },
  { type: "action", label: "Send Bulk SMS", icon: "💬", page: "communication-hub", sub: "Message parents and students" },
];

export default function Topbar() {
  const { onNavigate } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifs, setNotifs] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filteredResults = searchQuery.trim()
    ? searchIndex.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sub && item.sub.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : searchIndex.filter((item) => item.type === "page");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleNotifClick = (n: typeof notifications[0]) => {
    setNotifs((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item));
    onNavigate(n.page);
    setNotifOpen(false);
  };

  const handleSearchSelect = (item: typeof searchIndex[0]) => {
    setSearchOpen(false);
    setSearchQuery("");
    onNavigate(item.page);
  };

  const resultsByType: Record<string, typeof searchIndex> = {};
  filteredResults.forEach((r) => {
    if (!resultsByType[r.type]) resultsByType[r.type] = [];
    resultsByType[r.type].push(r);
  });

  const typeLabel: Record<string, string> = { page: "Pages", student: "Students", action: "Actions" };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 220, right: 0, height: 56,
        background: "white", borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center", padding: "0 20px", gap: 16, zIndex: 30,
      }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", padding: 4 }}>
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div
          onClick={() => setSearchOpen(true)}
          style={{ flex: 1, maxWidth: 380, position: "relative", display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Search size={14} style={{ position: "absolute", left: 10, color: "#9ca3af", pointerEvents: "none" }} />
          <div style={{
            width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #e5e7eb",
            borderRadius: 8, fontSize: 12.5, color: "#9ca3af", background: "#f9fafb", userSelect: "none",
          }}>
            Search for students, parents, invoices...
          </div>
          <div style={{ position: "absolute", right: 10, display: "flex", alignItems: "center", gap: 2, color: "#9ca3af", fontSize: 11 }}>
            <Command size={11} /><span>K</span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* School selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", background: "white" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🏫</div>
          <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>Happy Kids Basic School</span>
          <ChevronDown size={13} color="#9ca3af" />
        </div>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex", padding: 4 }}
          >
            <Bell size={19} color={notifOpen ? "#7c3aed" : "#6b7280"} />
            {unreadCount > 0 && (
              <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, background: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 700 }}>
                {unreadCount}
              </div>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: 40, right: 0, width: 360, background: "white",
              borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #e5e7eb",
              zIndex: 100, animation: "fadeIn 0.15s ease", overflow: "hidden",
            }}>
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
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    style={{
                      display: "flex", gap: 12, padding: "12px 16px", cursor: "pointer",
                      background: n.read ? "white" : "#faf5ff", borderBottom: "1px solid #f9fafb",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = n.read ? "white" : "#faf5ff"; }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: n.bg, color: n.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {notifIconMap[n.icon]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: n.read ? 500 : 700, color: "#111827" }}>{n.title}</span>
                        {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: 4, marginLeft: 6 }} />}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
                <button onClick={() => { onNavigate("communication-hub"); setNotifOpen(false); }} style={{ fontSize: 12.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
        <button
          onClick={() => onNavigate("communication-hub")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 4 }}
        >
          <MessageCircle size={19} />
        </button>

        {/* User profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>EM</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>Emmanuel Mensah</div>
            <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.3 }}>Headteacher</div>
          </div>
          <ChevronDown size={13} color="#9ca3af" />
        </div>
      </header>

      {/* Search Modal / Command Palette */}
      {searchOpen && (
        <div
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 560, background: "white", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden", animation: "fadeIn 0.15s ease" }}
          >
            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
              <Search size={16} color="#9ca3af" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, students, actions..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#111827", background: "transparent", fontFamily: "inherit" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                  <X size={14} />
                </button>
              )}
              <kbd style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", padding: "2px 7px", borderRadius: 5, border: "1px solid #e5e7eb" }}>ESC</kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {Object.entries(resultsByType).length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No results for "{searchQuery}"</div>
              ) : (
                Object.entries(resultsByType).map(([type, items]) => (
                  <div key={type}>
                    <div style={{ padding: "10px 16px 4px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {typeLabel[type] || type}
                    </div>
                    {items.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => handleSearchSelect(item)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", transition: "background 0.1s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                      >
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

            <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 16 }}>
              {[["↑↓", "Navigate"], ["↵", "Select"], ["Esc", "Close"]].map(([key, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#9ca3af" }}>
                  <kbd style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 4, padding: "1px 6px", fontSize: 11, color: "#6b7280" }}>{key}</kbd>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
