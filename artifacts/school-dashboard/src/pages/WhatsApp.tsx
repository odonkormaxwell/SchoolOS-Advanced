import { useState } from "react";
import { Plus, Search, ChevronRight, X, Send, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type WAStatus = "Sent" | "Delivered" | "Read" | "Failed";

type WAGroup = {
  id: number; name: string; description: string;
  members: number; lastMessage: string; lastTime: string;
  unread: number; avatar: string; avatarBg: string;
};

type WAMessage = {
  id: number; groupId: number; content: string;
  sender: string; time: string; status: WAStatus; isOwn: boolean;
};

const groups: WAGroup[] = [
  { id: 1, name: "All Parents — Term 2",      description: "Broadcast to all parents",           members: 380, lastMessage: "Sports Day is tomorrow! Don't forget...", lastTime: "10:30 AM", unread: 0, avatar: "👨‍👩‍👧‍👦", avatarBg: "#ede9fe" },
  { id: 2, name: "JHS 3 Parents",             description: "JHS 3 class parent group",           members: 54,  lastMessage: "BECE registration is now open...",       lastTime: "Yesterday",unread: 3, avatar: "🎓", avatarBg: "#dcfce7" },
  { id: 3, name: "P6 Parents — Topaz",        description: "Primary 6 Topaz class parents",      members: 46,  lastMessage: "Thank you for the prompt fees payment", lastTime: "Mon",      unread: 0, avatar: "📚", avatarBg: "#dbeafe" },
  { id: 4, name: "Staff Group",               description: "School staff communication",         members: 13,  lastMessage: "Meeting tomorrow at 7:30 AM sharp",     lastTime: "Yesterday",unread: 2, avatar: "👩‍🏫", avatarBg: "#fce7f3" },
  { id: 5, name: "PTA Executives",            description: "PTA leadership committee",           members: 8,   lastMessage: "Minutes of last meeting shared",        lastTime: "Wed",      unread: 0, avatar: "🤝", avatarBg: "#fef3c7" },
  { id: 6, name: "JHS 1 & 2 Parents",        description: "Junior high parents",                members: 106, lastMessage: "End-of-term exam schedule released",     lastTime: "Tue",      unread: 1, avatar: "📖", avatarBg: "#cffafe" },
  { id: 7, name: "Finance & Payments",       description: "Fees and payment notifications",     members: 380, lastMessage: "Invoice for Term 2 now available",      lastTime: "Mon",      unread: 0, avatar: "💰", avatarBg: "#fef3c7" },
];

const chatMessages: Record<number, WAMessage[]> = {
  1: [
    { id: 1, groupId: 1, content: "Good morning parents! 🌅 A reminder that Sports Day is tomorrow, Friday 31st May. Please arrive at 7:30 AM for the march past. Students should wear their house colours.", sender: "Admin", time: "10:00 AM", status: "Read", isOwn: true },
    { id: 2, groupId: 1, content: "Thank you for the reminder! We'll be there 🙏", sender: "Mrs. Mensah", time: "10:15 AM", status: "Read", isOwn: false },
    { id: 3, groupId: 1, content: "Will there be any parking available at the school?", sender: "Mr. Owusu", time: "10:22 AM", status: "Read", isOwn: false },
    { id: 4, groupId: 1, content: "Yes, parking will be available on the field road. Kindly carpool where possible. See you all tomorrow! 🏆", sender: "Admin", time: "10:30 AM", status: "Delivered", isOwn: true },
  ],
  2: [
    { id: 1, groupId: 2, content: "Dear JHS 3 Parents, BECE registration is now open. Forms are available at the school office. Deadline: 15th June 2024. Fee: GH₵ 50.", sender: "Admin", time: "9:00 AM", status: "Read", isOwn: true },
    { id: 2, groupId: 2, content: "Please is it possible to pay via MoMo?", sender: "Mrs. Darko", time: "9:14 AM", status: "Read", isOwn: false },
    { id: 3, groupId: 2, content: "Yes! Send to 0244-XXXXXX with your ward's name as reference.", sender: "Admin", time: "9:20 AM", status: "Read", isOwn: true },
  ],
};

const statusIcon = (s: WAStatus) => {
  if (s === "Read")      return <span style={{ color: "#22c55e", fontSize: 12 }}>✓✓</span>;
  if (s === "Delivered") return <span style={{ color: "#9ca3af", fontSize: 12 }}>✓✓</span>;
  return                       <span style={{ color: "#9ca3af", fontSize: 12 }}>✓</span>;
};

const recipientGroups = ["All Parents", "All Staff", "JHS Parents", "JHS 3 Parents", "P6 Parents", "PTA Executives"];

export default function WhatsApp() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selectedGroup, setSelectedGroup] = useState<WAGroup>(groups[0]);
  const [showChat,      setShowChat]      = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [compose,       setCompose]       = useState("");
  const [showNew,       setShowNew]       = useState(false);

  const filtered = groups.filter((g) =>
    !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = chatMessages[selectedGroup.id] || [];
  const totalMembers    = groups.reduce((s, g) => s + g.members, 0);
  const totalUnread     = groups.reduce((s, g) => s + g.unread, 0);

  const ChatPanel = () => (
    <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Chat header */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center", background: "#f9fafb" }}>
        {isMobile && <button onClick={() => setShowChat(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0 }}>←</button>}
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: selectedGroup.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{selectedGroup.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selectedGroup.name}</div>
          <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{selectedGroup.members} members</div>
        </div>
        <button onClick={() => showToast("Group info opened", "info")} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>ℹ️ Info</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, background: "#f0f4f0" }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", background: "white", padding: "3px 10px", borderRadius: 20 }}>Today</span>
        </div>
        {currentMessages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.isOwn ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", background: msg.isOwn ? "#dcfce7" : "white", borderRadius: msg.isOwn ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 12px", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              {!msg.isOwn && <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, marginBottom: 3 }}>{msg.sender}</div>}
              <div style={{ fontSize: 12.5, color: "#111827", lineHeight: 1.6 }}>{msg.content}</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{msg.time}</span>
                {msg.isOwn && statusIcon(msg.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea value={compose} onChange={(e) => setCompose(e.target.value)} placeholder="Type a message..." rows={1} style={{ flex: 1, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 20, fontSize: 12.5, color: "#374151", outline: "none", resize: "none", fontFamily: "inherit", background: "#f9fafb" }} />
        <button onClick={() => { if (compose.trim()) { showToast(`Message sent to ${selectedGroup.name}`, "success"); setCompose(""); } }} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#25d366,#128c7e)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>WhatsApp Groups</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Communication","WhatsApp"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#25d366,#128c7e)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " New Group"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Groups",         value: String(groups.length), icon: "👥", bg: "#dcfce7", color: "#16a34a" },
          { label: "Total Members",  value: totalMembers.toLocaleString(), icon: "📱", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Unread",         value: String(totalUnread),   icon: "🔔", bg: "#fef3c7", color: "#d97706" },
          { label: "Active Today",   value: "3",                   icon: "✅", bg: "#dbeafe", color: "#2563eb" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ position: "relative" }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search groups..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 280px)" }}>
        {(!isMobile || !showChat) && (
          <div style={{ width: isMobile ? "100%" : 300, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} groups</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((grp) => {
                const isActive = selectedGroup.id === grp.id;
                return (
                  <div key={grp.id} onClick={() => { setSelectedGroup(grp); if (isMobile) setShowChat(true); }}
                    style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#f0fff4" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: grp.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{grp.avatar}</div>
                      {grp.unread > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#25d366", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{grp.unread}</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{grp.name}</span>
                        <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{grp.lastTime}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{grp.lastMessage}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{grp.members} members</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showChat) && <ChatPanel />}
      </div>

      {showNew && (
        <div onClick={() => setShowNew(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Create WhatsApp Group</h2>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Group Name</label><input placeholder="e.g. P4 Parents" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, outline: "none", boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Add Members</label><select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, outline: "none", fontFamily: "inherit", background: "white" }}>
                {recipientGroups.map(g => <option key={g}>{g}</option>)}
              </select></div>
              <button onClick={() => { showToast("WhatsApp group created!", "success"); setShowNew(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#25d366,#128c7e)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
