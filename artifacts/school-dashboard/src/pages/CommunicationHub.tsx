import { useState } from "react";
import {
  Plus, ChevronDown, ChevronRight, MessageSquare, Bell, Zap,
  Send, Paperclip, X, Users, Check, Clock, MoreVertical,
} from "lucide-react";

const kpiCards = [
  { label: "Messages Sent", value: "8,542", sub: "↑ 18.6%", subColor: "#16a34a", icon: "📤", iconBg: "#ede9fe" },
  { label: "Delivered", value: "8,231", sub: "96.4% Delivery Rate", subColor: "#16a34a", icon: "✅", iconBg: "#dcfce7" },
  { label: "Reach (Recipients)", value: "5,872", sub: "Parents, Students, Staff", subColor: "#6b7280", icon: "👥", iconBg: "#dbeafe" },
  { label: "Opened", value: "4,156", sub: "48.8% Open Rate", subColor: "#d97706", icon: "👁️", iconBg: "#fef3c7" },
  { label: "Replies", value: "1,203", sub: "14.3% Reply Rate", subColor: "#2563eb", icon: "↩️", iconBg: "#dbeafe" },
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
  { name: "School Closure (Union Meeting)", type: "Emergency Alert", channel: "SMS", audience: "All Parents 1,430", sent: "10 May, 6:45 AM", delivered: "1,411", rate: "99.7%", status: "Delivered" },
  { name: "P.T.A Meeting Invitation", type: "P.T.A Notice", channel: "Email", audience: "P.T.A Members 94", sent: "8 May, 4:20 PM", delivered: "92", rate: "97.9%", status: "Delivered" },
];

const templates = [
  { name: "Fee Reminder", uses: "Used 32 times", channel: "SMS" },
  { name: "General Notice", uses: "Used 28 times", channel: "SMS" },
  { name: "School Event Invitation", uses: "Used 21 times", channel: "WhatsApp" },
  { name: "Academic Alert", uses: "Used 18 times", channel: "SMS" },
  { name: "Emergency Alert", uses: "Used 15 times", channel: "SMS" },
];

const workflows = [
  { name: "Overdue Fee Reminder (3 days)", desc: "SMS to Parents", enabled: true },
  { name: "Weekly Attendance Alert", desc: "WhatsApp to Parents", enabled: true },
  { name: "Monthly Newsletter", desc: "Email to Parents", enabled: false },
  { name: "Birthday Wishes", desc: "SMS to Students", enabled: true },
  { name: "Exam Reminder", desc: "SMS to Students", enabled: true },
];

const conversations = [
  { name: "Ama Serwaa (Parent)", msg: "Thank you. Payment will be made today.", time: "10:24 AM", unread: true, initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Mr. K. Appiah (Teacher)", msg: "Please remind JHS 3 students about...", time: "09:15 AM", unread: false, initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { name: "Daniel Nii Lartey (Parent)", msg: "When is the next parents meeting?", time: "Yesterday", unread: false, initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { name: "P.T.A Group", msg: "New message from Nana Yaw", time: "Yesterday", unread: false, initials: "PG", avatarBg: "#ede9fe", avatarColor: "#6d28d9" },
  { name: "Abena Yaa (Parent)", msg: "Thank you very much.", time: "12 May", unread: false, initials: "AY", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
];

const scheduledMessages = [
  { date: 16, month: "MAY", time: "09:00 AM", title: "School Reopens After Break", sub: "WhatsApp to Parents (1,430)", tag: "Scheduled" },
  { date: 18, month: "MAY", time: "08:00 AM", title: "P.T.A Contributions Reminder", sub: "WhatsApp to Parents (1,245)", tag: "Scheduled" },
  { date: 20, month: "MAY", time: "02:00 PM", title: "Sports Day Invitation", sub: "Email to Parents (1,430)", tag: "Scheduled" },
];

export default function CommunicationHub() {
  const [activeChannel, setActiveChannel] = useState("WhatsApp");
  const [message, setMessage] = useState("Hi {{parent_name}},\n\nThis is a friendly reminder that Term 3 fees are now overdue. Kindly make payment to avoid any disruption to your child's studies.\n\nThank you,\nHappy Kids Basic School");
  const [activeTab, setActiveTab] = useState("Overview");
  const pageTabs = ["Overview", "Campaigns", "Templates", "Automations", "Conversations", "Contacts", "Manage Channels", "Delivery Reports"];

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Communication Hub</h1>
            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "4px 0 0" }}>Connect with parents, students and staff across all channels.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={14} /> New Message <ChevronDown size={12} />
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Zap size={13} color="#6b7280" /> Automation Workflows
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {pageTabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: "7px 10px", fontSize: 11.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "white" : "#6b7280", background: activeTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{k.icon}</div>
              <div style={{ fontSize: 10.5, color: "#6b7280", marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.subColor, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Channel chooser */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Choose Channel</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
            {channels.map((ch) => (
              <button key={ch.name} onClick={() => setActiveChannel(ch.name)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 6px", border: `2px solid ${activeChannel === ch.name ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: activeChannel === ch.name ? "#faf5ff" : "white", cursor: "pointer" }}>
                <span style={{ fontSize: 22 }}>{ch.icon}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>{ch.name}</span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{ch.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns + Delivery Analytics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Recent Campaigns */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Recent Campaigns</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["CAMPAIGN", "CHANNEL", "AUDIENCE", "SENT", "DELIVERED", "STATUS"].map((c) => (
                    <th key={c} style={{ padding: "6px 6px", fontSize: 9.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #f9fafb" }}>
                    <td style={{ padding: "8px 6px" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#111827" }}>{c.name}</div>
                      <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{c.type}</div>
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      <span style={{ fontSize: 11 }}>{c.channel === "WhatsApp" ? "📱" : c.channel === "SMS" ? "💬" : "📧"}</span>
                    </td>
                    <td style={{ padding: "8px 6px", fontSize: 10.5, color: "#374151" }}>{c.audience}</td>
                    <td style={{ padding: "8px 6px", fontSize: 10.5, color: "#6b7280" }}>{c.sent}</td>
                    <td style={{ padding: "8px 6px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{c.delivered}</div>
                      <div style={{ fontSize: 10, color: "#16a34a" }}>{c.rate}</div>
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#dcfce7", color: "#16a34a" }}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", marginTop: 8 }}>View All Campaigns →</button>
          </div>

          {/* Delivery Analytics + Channel Performance */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Delivery Analytics</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>This Term</span>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  <svg viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)", width: 80, height: 80 }}>
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray={`${(8231 / 8542) * 201} 201`} />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>8,542</div>
                    <div style={{ fontSize: 9, color: "#9ca3af" }}>Total Sent</div>
                  </div>
                </div>
                <div>
                  {[
                    { label: "Delivered", count: "8,231", pct: "96.4%", color: "#7c3aed" },
                    { label: "Failed", count: "183", pct: "2.1%", color: "#dc2626" },
                    { label: "Pending", count: "128", pct: "1.5%", color: "#d97706" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 11.5, color: "#374151" }}>{s.label}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>{s.count}</span>
                      <span style={{ fontSize: 10.5, color: "#9ca3af" }}>({s.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Channel Performance</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["CHANNEL", "SENT", "DELIVERED", "RATE"].map((c) => (
                      <th key={c} style={{ padding: "5px 8px", fontSize: 9.5, fontWeight: 700, color: "#9ca3af", textAlign: "left" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ch: "WhatsApp", sent: "4,210", del: "4,052", rate: "96.2%" },
                    { ch: "SMS", sent: "3,156", del: "3,045", rate: "96.5%" },
                    { ch: "Email", sent: "856", del: "812", rate: "94.9%" },
                    { ch: "App Push", sent: "320", del: "322", rate: "100%" },
                  ].map((r) => (
                    <tr key={r.ch} style={{ borderTop: "1px solid #f9fafb" }}>
                      <td style={{ padding: "6px 8px", fontSize: 11.5, color: "#374151" }}>{r.ch}</td>
                      <td style={{ padding: "6px 8px", fontSize: 11.5, color: "#374151" }}>{r.sent}</td>
                      <td style={{ padding: "6px 8px", fontSize: 11.5, color: "#374151" }}>{r.del}</td>
                      <td style={{ padding: "6px 8px", fontSize: 11.5, fontWeight: 600, color: "#16a34a" }}>{r.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", marginTop: 6 }}>View Delivery Reports →</button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {/* Upcoming Scheduled */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Upcoming Scheduled Messages</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View Calendar</button>
            </div>
            {scheduledMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ textAlign: "center", background: "#f9fafb", borderRadius: 8, padding: "6px 10px", minWidth: 44, flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700 }}>{m.month}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{m.date}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{m.time}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{m.title}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{m.sub}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#ede9fe", color: "#7c3aed", marginTop: 3, display: "inline-block" }}>{m.tag}</span>
                </div>
              </div>
            ))}
            <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All Scheduled →</button>
          </div>

          {/* Popular Templates */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Popular Templates</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
            </div>
            {templates.map((t) => (
              <div key={t.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{t.channel === "WhatsApp" ? "📱" : "💬"}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{t.name}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{t.uses}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10.5, color: "#7c3aed", fontWeight: 600, background: "#f3e8ff", padding: "2px 8px", borderRadius: 8 }}>{t.channel}</span>
              </div>
            ))}
          </div>

          {/* Automation Workflows */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Automation Workflows</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
            </div>
            {workflows.map((w) => (
              <div key={w.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{w.name}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{w.desc}</div>
                </div>
                <div
                  style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: w.enabled ? "#7c3aed" : "#e5e7eb",
                    position: "relative", cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%", background: "white",
                    transition: "left 0.2s",
                    left: w.enabled ? 18 : 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Send New Message */}
      <div style={{ width: 268, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Send New Message</span>
          <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>Reset</button>
        </div>

        <div style={{ padding: "14px", flex: 1 }}>
          {/* Channel */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, color: "#374151", fontWeight: 600, marginBottom: 8 }}>Channel</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
              {[{ icon: "💬", label: "SMS" }, { icon: "📱", label: "WhatsApp" }, { icon: "📧", label: "Email" }, { icon: "🔔", label: "App Push" }].map((c) => (
                <button key={c.label} onClick={() => setActiveChannel(c.label)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px", border: `2px solid ${activeChannel === c.label ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: activeChannel === c.label ? "#faf5ff" : "white", cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, color: "#374151", fontWeight: 500 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, color: "#374151", fontWeight: 600, marginBottom: 6 }}>Audience</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fafafa" }}>
              <span style={{ fontSize: 12.5, color: "#374151" }}>All Parents</span>
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>1,430 recipients</span>
              <ChevronDown size={12} color="#9ca3af" />
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, color: "#374151", fontWeight: 600, marginBottom: 6 }}>Message</div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              style={{ width: "100%", padding: "10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", outline: "none", background: "#fafafa", fontFamily: "inherit", resize: "none", lineHeight: 1.5 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{message.length} / 1000</span>
            </div>
          </div>

          {/* Variable + Attach + Button */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <button style={{ flex: 1, padding: "7px 8px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", fontSize: 11, cursor: "pointer", color: "#374151" }}>+ Add Variable</button>
            <button style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151" }}>
              <Paperclip size={12} /> Attach File
            </button>
            <button style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", fontSize: 11, color: "#374151" }}>+ Add Button</button>
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: 14, padding: "10px", background: "#f9fafb", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <input type="checkbox" style={{ accentColor: "#7c3aed" }} />
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Schedule Message</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="date" defaultValue="2024-05-16" style={{ flex: 1, padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11.5, color: "#374151", outline: "none", fontFamily: "inherit" }} />
              <input type="time" defaultValue="09:00" style={{ width: 80, padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11.5, color: "#374151", outline: "none", fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Delivery Confirmation */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <input type="checkbox" defaultChecked style={{ accentColor: "#7c3aed" }} />
            <span style={{ fontSize: 12, color: "#374151" }}>Require Delivery Confirmation</span>
          </div>

          {/* Actions */}
          <button style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            <Send size={14} /> Send Message
          </button>
          <button style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, cursor: "pointer" }}>Save as Draft</button>
        </div>

        {/* Recent Conversations */}
        <div style={{ padding: "14px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Recent Conversations</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {conversations.map((c) => (
            <div key={c.name} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.avatarBg, color: c.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{c.initials}</div>
                {c.unread && <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", border: "2px solid white" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: c.unread ? 700 : 600, color: "#111827" }}>{c.name}</span>
                  <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.msg}</div>
              </div>
            </div>
          ))}
          <button style={{ width: "100%", textAlign: "center", fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: "6px 0", borderTop: "1px solid #f3f4f6" }}>Go to Parent Chat →</button>
        </div>
      </div>
    </div>
  );
}
