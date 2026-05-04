import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Send, Paperclip, X, Users, Check, MoreVertical, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const kpiCards = [
  { label: "Messages Sent", value: "8,542", sub: "↑ 18.6%", subColor: "#16a34a", icon: "📤", iconBg: "#ede9fe" },
  { label: "Delivered", value: "8,231", sub: "96.4% rate", subColor: "#16a34a", icon: "✅", iconBg: "#dcfce7" },
  { label: "Recipients", value: "5,872", sub: "Parents, Students, Staff", subColor: "#6b7280", icon: "👥", iconBg: "#dbeafe" },
  { label: "Opened", value: "4,156", sub: "48.8% open rate", subColor: "#d97706", icon: "👁️", iconBg: "#fef3c7" },
  { label: "Replies", value: "1,203", sub: "14.3% reply rate", subColor: "#2563eb", icon: "↩️", iconBg: "#dbeafe" },
  { label: "Pending", value: "12", sub: "Scheduled", subColor: "#7c3aed", icon: "🔔", iconBg: "#f3e8ff" },
];

const channels = [
  { name: "SMS", sub: "Instant SMS", icon: "💬" },
  { name: "WhatsApp", sub: "Broadcast", icon: "📱" },
  { name: "Email", sub: "Send Email", icon: "📧" },
  { name: "Notice Board", sub: "Post Notice", icon: "📋" },
  { name: "App Push", sub: "Mobile App", icon: "🔔" },
  { name: "Voice Call", sub: "Voice Broadcast", icon: "📞" },
];

const campaigns = [
  { name: "Term 3 Fees Reminder", type: "Fee Reminder", channel: "WhatsApp", audience: "Parents 1,245", sent: "15 May, 9:30 AM", delivered: "1,210", rate: "97.2%", status: "Delivered" },
  { name: "Mid Term Break Notice", type: "General Notice", channel: "SMS", audience: "All Parents 1,430", sent: "14 May, 3:15 PM", delivered: "1,402", rate: "98.0%", status: "Delivered" },
  { name: "BECE Preparation Tips", type: "Academic Alert", channel: "WhatsApp", audience: "JHS 3 Parents 188", sent: "12 May, 10:00 AM", delivered: "183", rate: "99.4%", status: "Delivered" },
  { name: "School Closure Notice", type: "Emergency Alert", channel: "SMS", audience: "All Parents 1,430", sent: "10 May, 6:45 AM", delivered: "1,411", rate: "99.7%", status: "Delivered" },
  { name: "P.T.A Meeting Invitation", type: "P.T.A Notice", channel: "Email", audience: "P.T.A Members 94", sent: "8 May, 4:20 PM", delivered: "92", rate: "97.9%", status: "Delivered" },
];

const conversations = [
  { name: "Ama Serwaa (Parent)", msg: "Thank you. Payment will be made today.", time: "10:24 AM", unread: true, initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Mr. K. Appiah (Teacher)", msg: "Please remind JHS 3 students about...", time: "09:15 AM", unread: false, initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { name: "Daniel Nii Lartey (Parent)", msg: "When is the next parents meeting?", time: "Yesterday", unread: false, initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { name: "P.T.A Group", msg: "New message from Nana Yaw", time: "Yesterday", unread: false, initials: "PG", avatarBg: "#ede9fe", avatarColor: "#6d28d9" },
  { name: "Abena Yaa (Parent)", msg: "Thank you very much.", time: "12 May", unread: false, initials: "AY", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
];

const initWorkflows = [
  { name: "Overdue Fee Reminder (3 days)", desc: "SMS to Parents", enabled: true },
  { name: "Weekly Attendance Alert", desc: "WhatsApp to Parents", enabled: true },
  { name: "Monthly Newsletter", desc: "Email to Parents", enabled: false },
  { name: "Birthday Wishes", desc: "SMS to Students", enabled: true },
  { name: "Exam Reminder", desc: "SMS to Students", enabled: true },
];

const scheduledMessages = [
  { date: 16, month: "MAY", time: "09:00 AM", title: "School Reopens After Break", sub: "WhatsApp to Parents (1,430)", tag: "Scheduled" },
  { date: 18, month: "MAY", time: "08:00 AM", title: "P.T.A Contributions Reminder", sub: "WhatsApp to Parents (1,245)", tag: "Scheduled" },
  { date: 20, month: "MAY", time: "02:00 PM", title: "Sports Day Invitation", sub: "Email to Parents (1,430)", tag: "Scheduled" },
];

export default function CommunicationHub() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [activeChannel, setActiveChannel] = useState("WhatsApp");
  const [message, setMessage] = useState("Hi {{parent_name}},\n\nThis is a friendly reminder that Term 3 fees are now overdue. Kindly make payment to avoid any disruption to your child's studies.\n\nThank you,\nHappy Kids Basic School");
  const [activeTab, setActiveTab] = useState("Overview");
  const [workflows, setWorkflows] = useState(initWorkflows);
  const [recipient, setRecipient] = useState("All Parents (1,430)");
  const [sending, setSending] = useState(false);
  const [activeConv, setActiveConv] = useState(conversations[0]);

  const pageTabs = isMobile
    ? ["Overview", "Compose", "Conversations"]
    : ["Overview", "Campaigns", "Templates", "Automations", "Conversations", "Contacts", "Manage Channels", "Reports"];

  const toggleWorkflow = (idx: number) => {
    setWorkflows((prev) => prev.map((w, i) => i === idx ? { ...w, enabled: !w.enabled } : w));
    const wf = workflows[idx];
    showToast(`${wf.name} ${wf.enabled ? "disabled" : "enabled"}`, "info");
  };

  const handleSend = () => {
    if (!message.trim()) { showToast("Please enter a message", "error"); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast(`Message sent to ${recipient} via ${activeChannel}!`, "success");
    }, 1500);
  };

  const kpiCols = isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)";
  const currentTab = activeTab;

  return (
    <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: isMobile ? "visible" : "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Communication Hub</h1>
            {!isMobile && <p style={{ fontSize: 12.5, color: "#6b7280", margin: "4px 0 0" }}>Connect with parents, students and staff.</p>}
          </div>
          <button onClick={() => showToast("Opening new campaign builder...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Plus size={13} />{!isMobile && " New Campaign"}
          </button>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 1, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 17, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.subColor, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Page tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {pageTabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "7px 6px", fontSize: isMobile ? 11 : 11.5, fontWeight: currentTab === t ? 600 : 400, color: currentTab === t ? "white" : "#6b7280", background: currentTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap", minWidth: "fit-content" }}>{t}</button>
          ))}
        </div>

        {/* Channel selector */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Select Channel</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: 8 }}>
            {channels.map((ch) => (
              <button key={ch.name} onClick={() => setActiveChannel(ch.name)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 8px", borderRadius: 10, border: `2px solid ${activeChannel === ch.name ? "#7c3aed" : "#e5e7eb"}`, background: activeChannel === ch.name ? "#f5f3ff" : "white", cursor: "pointer", transition: "all 0.12s" }}>
                <span style={{ fontSize: 22 }}>{ch.icon}</span>
                <span style={{ fontSize: 11.5, fontWeight: activeChannel === ch.name ? 700 : 400, color: activeChannel === ch.name ? "#7c3aed" : "#374151" }}>{ch.name}</span>
                <span style={{ fontSize: 9.5, color: "#9ca3af" }}>{ch.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Compose Area */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Compose Message</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, background: "#f5f3ff", color: "#7c3aed", padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>via {activeChannel}</span>
              <button onClick={() => showToast("Message saved as draft", "info")} style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>Save Draft</button>
            </div>
          </div>
          <div style={{ padding: "14px" }}>
            {/* To field */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>To</label>
              <div style={{ position: "relative" }}>
                <select value={recipient} onChange={(e) => setRecipient(e.target.value)}
                  style={{ appearance: "none", width: "100%", padding: "9px 28px 9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                  {["All Parents (1,430)", "All Students", "All Staff", "JHS 3 Parents (188)", "JHS 3 Students", "P6 Parents (39)", "P.T.A Members (94)"].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={12} color="#9ca3af" style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>

            {/* Templates */}
            {!isMobile && (
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {["Fee Reminder", "General Notice", "Event Invite", "Exam Alert"].map((t) => (
                  <button key={t} onClick={() => { setMessage(`Hi {{parent_name}},\n\nThis is an important notice regarding ${t.toLowerCase()}.\n\nPlease contact the school office for more information.\n\nThank you,\nHappy Kids Basic School`); showToast(`Template "${t}" applied`, "info"); }}
                    style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 20, background: "#f9fafb", fontSize: 11.5, cursor: "pointer", color: "#374151" }}>{t}</button>
                ))}
              </div>
            )}

            {/* Message textarea */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={isMobile ? 5 : 6}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{message.length} characters</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>~{Math.ceil(message.length / 160)} SMS credit(s)</span>
              </div>
            </div>

            {/* Send options */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={handleSend} disabled={sending}
                style={{ flex: 1, padding: "10px 16px", border: "none", borderRadius: 9, background: sending ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minWidth: 120 }}>
                <Send size={14} />{sending ? "Sending..." : "Send Now"}
              </button>
              <button onClick={() => showToast("Message scheduled for later", "info")} style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 9, background: "white", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                📅 Schedule
              </button>
              <button style={{ padding: "10px", border: "1px solid #e5e7eb", borderRadius: 9, background: "white", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Paperclip size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Recent Campaigns</span>
            <button onClick={() => showToast("Opening full campaigns list...", "info")} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View All</button>
          </div>
          {campaigns.map((c, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: idx < campaigns.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {c.channel === "WhatsApp" ? "📱" : c.channel === "SMS" ? "💬" : "📧"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{c.audience} · {c.sent}</div>
              </div>
              {!isMobile && (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{c.rate}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.delivered} delivered</div>
                </div>
              )}
              <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#dcfce7", color: "#16a34a", flexShrink: 0 }}>{c.status}</span>
            </div>
          ))}
        </div>

        {/* Automations */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Zap size={15} color="#7c3aed" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Automated Workflows</span>
            </div>
            <button onClick={() => showToast("Opening workflow builder...", "info")} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>+ Add</button>
          </div>
          {workflows.map((wf, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: idx < workflows.length - 1 ? "1px solid #f9fafb" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{wf.name}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{wf.desc}</div>
              </div>
              {/* Toggle switch */}
              <button onClick={() => toggleWorkflow(idx)}
                style={{ width: 40, height: 22, borderRadius: 11, background: wf.enabled ? "#7c3aed" : "#e5e7eb", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: wf.enabled ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
          ))}
        </div>

        {/* Scheduled messages */}
        {!isMobile && (
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Scheduled Messages</span>
              <button onClick={() => showToast("Opening scheduled messages...", "info")} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View All</button>
            </div>
            {scheduledMessages.map((s, idx) => (
              <div key={idx} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: idx < scheduledMessages.length - 1 ? "1px solid #f9fafb" : "none" }}>
                <div style={{ width: 40, flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#7c3aed" }}>{s.date}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{s.month}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{s.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{s.time} · {s.sub}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#fef3c7", color: "#d97706", alignSelf: "flex-start", flexShrink: 0 }}>{s.tag}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel — Conversations (Desktop only) */}
      {!isMobile && (
        <div style={{ width: 280, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Conversations</span>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {conversations.map((conv, idx) => (
              <div key={idx} onClick={() => setActiveConv(conv)}
                style={{ display: "flex", gap: 10, padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: activeConv.name === conv.name ? "#faf5ff" : conv.unread ? "#fefbff" : "white", transition: "background 0.1s" }}
                onMouseEnter={(e) => { if (activeConv.name !== conv.name) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = activeConv.name === conv.name ? "#faf5ff" : conv.unread ? "#fefbff" : "white"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: conv.avatarBg, color: conv.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, position: "relative" }}>
                  {conv.initials}
                  {conv.unread && <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: "#7c3aed", border: "1.5px solid white" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12.5, fontWeight: conv.unread ? 700 : 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{conv.name}</span>
                    <span style={{ fontSize: 10.5, color: "#9ca3af", flexShrink: 0 }}>{conv.time}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.msg}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Reply to {activeConv.name.split(" ")[0]}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input placeholder="Type a reply..." style={{ flex: 1, padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit" }} />
              <button onClick={() => showToast(`Reply sent to ${activeConv.name}`, "success")} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Send size={14} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
