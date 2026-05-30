import { useState } from "react";
import {
  Send, MessageSquare, FileText, Settings, Plus,
  Search, X, CheckCircle, AlertCircle, Clock,
  Download, Printer, Users, Zap, ChevronDown,
  Copy, RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";

// ─── Types ────────────────────────────────────────────────────────────────────
type SMSStatus  = "Delivered" | "Failed" | "Pending" | "Scheduled";
type SenderStatus = "Approved" | "Pending" | "Rejected" | "Suspended";

interface SMSMessage {
  id: number; title: string; message: string;
  recipients: string; recipientCount: number;
  sentBy: string; date: string; time: string;
  status: SMSStatus; credits: number; senderId: string;
}

interface SMSTemplate {
  id: number; name: string; category: string; body: string; variables: string[];
}

// ─── Static Data ───────────────────────────────────────────────────────────────
const history: SMSMessage[] = [
  { id: 1,  title: "Mid-Term Exam Reminder",         senderId: "HappyKids", message: "Dear Parent, this is to inform you that mid-term examinations begin on Monday, 27th May 2026. Please ensure your ward studies adequately. Contact us on 0244-123456 for any queries. Happy Kids Basic School.", recipients: "All Parents",         recipientCount: 312, sentBy: "Mr. E. Mensah",      date: "25 May 2026", time: "9:00 AM",  status: "Delivered", credits: 312 },
  { id: 2,  title: "Sports Day Invitation",           senderId: "HappyKids", message: "Dear Parent, you are warmly invited to our Annual Sports Day on Friday, 31st May 2026 at 7:30 AM on the school field. Your presence will greatly encourage our students. Dress code: House colours. Happy Kids Basic School.", recipients: "All Parents",         recipientCount: 312, sentBy: "Coach A. Gyasi",     date: "22 May 2026", time: "11:00 AM", status: "Delivered", credits: 312 },
  { id: 3,  title: "Fees Payment Reminder",           senderId: "HappyKids", message: "Dear Parent, kindly note that Term 2 school fees for your ward are outstanding. Please pay at the school accounts office or via MoMo (0244-654321) before 31st May to avoid sanctions. Thank you. Happy Kids Accounts.", recipients: "Debtors Only",        recipientCount: 68,  sentBy: "Mr. S. Darko",       date: "20 May 2026", time: "2:00 PM",  status: "Delivered", credits: 68 },
  { id: 4,  title: "PTA Meeting Alert",               senderId: "HappyKids", message: "Dear Parent, the PTA meeting is scheduled for Saturday, 18th May 2026 at 10:00 AM in the school hall. Agenda: Academic performance, fees review, infrastructure. Your attendance is very important. Happy Kids PTA.", recipients: "All Parents",         recipientCount: 312, sentBy: "Mrs. A. Aidoo",      date: "15 May 2026", time: "3:00 PM",  status: "Delivered", credits: 312 },
  { id: 5,  title: "Payment Confirmation — RCP-0445", senderId: "HappyKids", message: "Dear Parent, payment of GH₵ 1,200.00 received for Amos Kofi Asante. Receipt No: RCP-2026-0445. Balance: GH₵ 0.00. Thank you. Happy Kids Accounts.",                                                                  recipients: "Individual Parent",  recipientCount: 1,   sentBy: "System",             date: "30 May 2026", time: "10:45 AM", status: "Delivered", credits: 1 },
  { id: 6,  title: "Payment Confirmation — RCP-0444", senderId: "HappyKids", message: "Dear Parent, payment of GH₵ 1,800.00 received for Akua Acheampong. Receipt No: RCP-2026-0444. Balance: GH₵ 0.00. Thank you. Happy Kids Accounts.",                                                                    recipients: "Individual Parent",  recipientCount: 1,   sentBy: "System",             date: "30 May 2026", time: "10:47 AM", status: "Delivered", credits: 1 },
  { id: 7,  title: "Attendance Alert — 29 May",       senderId: "HappyKids", message: "Dear Parent of Nana Ama Quayson (JHS 1), your ward was absent from school on 29 May 2026. Please contact the school on 0244-123456 if this was unexpected. Happy Kids Basic School.",                                   recipients: "Individual Parent",  recipientCount: 1,   sentBy: "System",             date: "29 May 2026", time: "9:15 AM",  status: "Delivered", credits: 1 },
  { id: 8,  title: "JHS 3 BECE Registration",         senderId: "HappyKids", message: "Dear JHS 3 Parent, BECE registration forms are now available. Registration fee: GH₵ 50. Deadline: 15th June 2026. Please complete forms at the school office with photos. Happy Kids JHS.",                              recipients: "JHS 3 Parents",      recipientCount: 10,  sentBy: "Mr. E. Mensah",      date: "1 May 2026",  time: "8:00 AM",  status: "Delivered", credits: 10 },
  { id: 9,  title: "Upcoming School Activities",      senderId: "HappyKids", message: "Dear Parent, upcoming school events: 31 May — Sports Day. 7 June — End of Term. 17 June — Report Card Collection. Term 3 begins: 15 September 2026. Happy Kids Basic School.",                                          recipients: "All Parents",        recipientCount: 312, sentBy: "Mrs. A. Aidoo",      date: "28 May 2026", time: "9:00 AM",  status: "Scheduled", credits: 312 },
  { id: 10, title: "Fee Reminder — JHS 1",            senderId: "HappyKids", message: "Dear Parent, kindly settle outstanding fees for your JHS 1 ward. Current balance: GH₵ 1,800. Due: 31 May 2026. Pay via MoMo 0244-654321. Happy Kids Accounts.",                                                         recipients: "JHS 1 Parents",      recipientCount: 8,   sentBy: "Mr. S. Darko",       date: "26 May 2026", time: "1:00 PM",  status: "Failed",    credits: 0 },
];

const templates: SMSTemplate[] = [
  { id: 1,  name: "Attendance Alert",        category: "Attendance", body: "Dear {ParentName}, your ward {StudentName} ({Class}) was absent from school on {Date}. Please contact us on 0244-123456 if this was unexpected. {SchoolName}.", variables: ["ParentName","StudentName","Class","Date","SchoolName"] },
  { id: 2,  name: "Fee Reminder",            category: "Finance",    body: "Dear {ParentName}, this is a reminder that {StudentName}'s outstanding balance is GH₵ {Balance}. Due date: {DueDate}. Pay via MoMo 0244-654321. {SchoolName}.", variables: ["ParentName","StudentName","Balance","DueDate","SchoolName"] },
  { id: 3,  name: "Payment Confirmation",    category: "Finance",    body: "Dear Parent, payment of GH₵ {Amount} received for {StudentName}. Receipt No: {ReceiptNo}. Balance: GH₵ {Balance}. Thank you. {SchoolName}.", variables: ["Amount","StudentName","ReceiptNo","Balance","SchoolName"] },
  { id: 4,  name: "Admission Confirmation",  category: "Admissions", body: "Dear {ParentName}, we are pleased to confirm that {StudentName} has been admitted to {Class} at {SchoolName}. Please visit the school office with required documents. {SchoolName}.", variables: ["ParentName","StudentName","Class","SchoolName"] },
  { id: 5,  name: "Exam Reminder",           category: "Academics",  body: "Dear Parent, {StudentName}'s {ExamType} examinations begin on {Date}. Timetable available at the school office. Ensure your ward arrives by {StartTime}. {SchoolName}.", variables: ["StudentName","ExamType","Date","StartTime","SchoolName"] },
  { id: 6,  name: "Result Published",        category: "Academics",  body: "Dear {ParentName}, {StudentName}'s {ExamType} results are ready. Please visit the school to collect the report card on {Date} from 8AM–3PM. {SchoolName}.", variables: ["ParentName","StudentName","ExamType","Date","SchoolName"] },
  { id: 7,  name: "General Announcement",    category: "General",    body: "Dear Parent, {AnnouncementText}. For enquiries, call 0244-123456. {SchoolName}.", variables: ["AnnouncementText","SchoolName"] },
  { id: 8,  name: "Birthday Greeting",       category: "General",    body: "Happy Birthday, {StudentName}! 🎂 Wishing you a wonderful day filled with joy. From all of us at {SchoolName}.", variables: ["StudentName","SchoolName"] },
  { id: 9,  name: "School Closure Notice",   category: "General",    body: "Dear Parent, school will be closed on {Date} due to {Reason}. Regular classes resume on {ResumeDate}. {SchoolName}.", variables: ["Date","Reason","ResumeDate","SchoolName"] },
  { id: 10, name: "PTA Meeting Reminder",    category: "General",    body: "Dear Parent, the PTA meeting is on {Date} at {Time} in the school hall. Agenda: {Agenda}. Your attendance is important. {SchoolName}.", variables: ["Date","Time","Agenda","SchoolName"] },
];

const recipientGroups = [
  { label: "All Parents",           count: 312 },
  { label: "All Students",          count: 312 },
  { label: "All Staff",             count: 13 },
  { label: "KG Parents",            count: 18 },
  { label: "Primary Parents",       count: 145 },
  { label: "JHS Parents",           count: 28 },
  { label: "JHS 3 Parents",         count: 10 },
  { label: "JHS 2 Parents",         count: 9 },
  { label: "JHS 1 Parents",         count: 9 },
  { label: "Basic 6 Parents",       count: 12 },
  { label: "Debtors Only",          count: 68 },
  { label: "All Parents & Staff",   count: 325 },
];

const autoTriggers = [
  { key: "attendance",   label: "Attendance Alert",       desc: "Notify parents when a student is marked absent",         icon: "📅" },
  { key: "fee_reminder", label: "Fee Reminder",           desc: "Send reminders for outstanding fees (weekly)",          icon: "💰" },
  { key: "payment",      label: "Payment Confirmation",   desc: "Auto-send receipt SMS after every recorded payment",    icon: "✅" },
  { key: "admission",    label: "Admission Approval",     desc: "Notify parents when admission is approved",             icon: "🎓" },
  { key: "exam",         label: "Exam Reminder",          desc: "Send exam schedule 3 days before exams",                icon: "📝" },
  { key: "result",       label: "Result Published",       desc: "Notify parents when report cards are ready",            icon: "📊" },
  { key: "birthday",     label: "Birthday Greeting",      desc: "Send birthday greetings to students on their birthday", icon: "🎂" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const statusStyle = (s: SMSStatus) => {
  if (s === "Delivered") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Pending")   return { bg: "#fef3c7", color: "#d97706" };
  if (s === "Scheduled") return { bg: "#dbeafe", color: "#2563eb" };
  return { bg: "#fee2e2", color: "#dc2626" };
};

const catColor: Record<string, { bg: string; color: string }> = {
  Finance:    { bg: "#ede9fe", color: "#7c3aed" },
  Attendance: { bg: "#dcfce7", color: "#16a34a" },
  Academics:  { bg: "#dbeafe", color: "#2563eb" },
  Admissions: { bg: "#fef3c7", color: "#d97706" },
  General:    { bg: "#f3f4f6", color: "#6b7280" },
};

const inputS: React.CSSProperties = {
  width: "100%", padding: "9px 11px", border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit",
  background: "white", boxSizing: "border-box",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width: 42, height: 24, borderRadius: 12, cursor: "pointer", flexShrink: 0, background: checked ? "#7c3aed" : "#d1d5db", position: "relative", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 3, left: checked ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
    </div>
  );
}

// ─── Tab: Compose ─────────────────────────────────────────────────────────────
function ComposeTab() {
  const { showToast } = useApp();
  const [recipient, setRecipient] = useState("");
  const [message,   setMessage]   = useState("");
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);

  const selectedGroup = recipientGroups.find(g => g.label === recipient);
  const estimatedCredits = selectedGroup ? selectedGroup.count * Math.ceil(message.length / 160 || 1) : 0;
  const charCount = message.length;
  const smsUnits  = Math.max(1, Math.ceil(charCount / 160));

  const handleSend = () => {
    if (!recipient || !message.trim()) { showToast("Please select recipients and enter a message", "error"); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      showToast(`SMS sent to ${selectedGroup?.count ?? 0} recipients · ${estimatedCredits} credits used`, "success");
      setTimeout(() => { setSent(false); setMessage(""); setRecipient(""); }, 2500);
    }, 1800);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "flex-start" }}>
      {/* Left — composer */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Recipient */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 10 }}>SEND TO</div>
          <div style={{ position: "relative" }}>
            <select style={{ ...inputS, cursor: "pointer", appearance: "none", paddingRight: 28 }} value={recipient} onChange={e => setRecipient(e.target.value)}>
              <option value="">— Select recipient group —</option>
              {recipientGroups.map(g => <option key={g.label} value={g.label}>{g.label} ({g.count})</option>)}
            </select>
            <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
          {selectedGroup && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "7px 10px", background: "#f5f3ff", borderRadius: 7 }}>
              <Users size={12} color="#7c3aed" />
              <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{selectedGroup.count} recipients selected</span>
            </div>
          )}
        </div>

        {/* Templates shortcut */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: useTemplate ? 10 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em" }}>USE TEMPLATE</div>
            <Toggle checked={useTemplate} onChange={setUseTemplate} />
          </div>
          {useTemplate && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
              {templates.slice(0, 6).map(t => (
                <button key={t.id} onClick={() => { setMessage(t.body); showToast(`Template loaded: ${t.name}`, "info"); setUseTemplate(false); }}
                  style={{ textAlign: "left", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 7, background: "#fafafa", cursor: "pointer", fontSize: 12 }}>
                  <span style={{ fontWeight: 600, color: "#374151", display: "block" }}>{t.name}</span>
                  <span style={{ color: "#9ca3af", fontSize: 11 }}>{t.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message body */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em" }}>MESSAGE</div>
            <span style={{ fontSize: 11.5, color: charCount > 160 ? "#d97706" : "#9ca3af" }}>
              {charCount} / {smsUnits * 160} · {smsUnits} SMS unit{smsUnits > 1 ? "s" : ""}
            </span>
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={6}
            placeholder="Type your message here… Use {StudentName}, {ParentName}, {Balance} as variables."
            style={{ ...inputS, resize: "vertical", lineHeight: 1.6 }}
          />
          {charCount > 0 && charCount > 160 && (
            <div style={{ fontSize: 11.5, color: "#d97706", marginTop: 4 }}>
              ⚠ Message exceeds 160 characters — will be sent as {smsUnits} SMS units per recipient.
            </div>
          )}
          <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 6 }}>
            Sender ID: <strong style={{ color: "#374151" }}>HappyKids</strong>
          </div>
        </div>
      </div>

      {/* Right — preview + cost */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* SMS Preview */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 10 }}>SMS PREVIEW</div>
          <div style={{ background: "#f9fafb", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#374151", padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>From</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "white" }}>HappyKids</span>
            </div>
            <div style={{ padding: "12px", fontSize: 12.5, color: "#374151", lineHeight: 1.7, minHeight: 80 }}>
              {message || <span style={{ color: "#d1d5db" }}>Your message preview will appear here…</span>}
            </div>
          </div>
        </div>

        {/* Cost summary */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 12 }}>COST ESTIMATE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["Recipients",        selectedGroup ? `${selectedGroup.count}` : "—"],
              ["SMS Units/Message", String(smsUnits)],
              ["Credits Required",  estimatedCredits ? `${estimatedCredits}` : "—"],
              ["Credits Available", "1,250"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 12.5, color: "#6b7280" }}>{k}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{v}</span>
              </div>
            ))}
          </div>
          {estimatedCredits > 1250 && (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "#fee2e2", borderRadius: 7, fontSize: 12, color: "#dc2626" }}>
              ⚠ Insufficient credits. Top up required.
            </div>
          )}
        </div>

        {/* Credits balance */}
        <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 12, padding: 16, color: "white" }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, marginBottom: 6 }}>SMS CREDIT BALANCE</div>
          <div style={{ fontSize: 26, fontWeight: 900 }}>1,250</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>credits remaining</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11.5 }}>
            <span style={{ opacity: 0.8 }}>Used this month: <strong>1,250</strong></span>
            <span style={{ opacity: 0.8 }}>Total: <strong>2,500</strong></span>
          </div>
        </div>

        {/* Send button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={handleSend} disabled={sending || sent || !recipient || !message.trim()} style={{
            padding: "12px", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: !recipient || !message.trim() ? "not-allowed" : "pointer",
            background: sent ? "#16a34a" : sending ? "#6d28d9" : (!recipient || !message.trim()) ? "#e5e7eb" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
            color: (!recipient || !message.trim()) ? "#9ca3af" : "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}>
            {sent ? <><CheckCircle size={16} /> Sent!</> : sending ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Sending…</> : <><Send size={15} /> Send Now</>}
          </button>
          <button onClick={() => showToast("Message scheduled", "info")} style={{ padding: "10px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "white", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Clock size={13} /> Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: History ─────────────────────────────────────────────────────────────
function HistoryTab() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("All");
  const [selected, setSelected] = useState<SMSMessage | null>(null);

  const filtered = history.filter(m => {
    const ms = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.recipients.toLowerCase().includes(search.toLowerCase());
    const mst = status === "All" || m.status === status;
    return ms && mst;
  });

  const totalDelivered  = history.filter(m => m.status === "Delivered").reduce((s, m) => s + m.recipientCount, 0);
  const totalFailed     = history.filter(m => m.status === "Failed").reduce((s, m) => s + m.recipientCount, 0);
  const totalScheduled  = history.filter(m => m.status === "Scheduled").reduce((s, m) => s + m.recipientCount, 0);
  const totalCreditsUsed= history.filter(m => m.status === "Delivered").reduce((s, m) => s + m.credits, 0);

  const handleExport = () => {
    exportToCSV("sms_history", filtered.map(m => ({
      Date: m.date, Title: m.title, Recipients: m.recipients,
      Count: m.recipientCount, "Sender ID": m.senderId,
      "Credits Used": m.credits, Status: m.status, "Sent By": m.sentBy,
    })));
    showToast(`${filtered.length} records exported`, "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Delivery report summary */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10 }}>
        {[
          { label: "Total Delivered",  value: totalDelivered.toLocaleString(),   color: "#16a34a", bg: "#f0fdf4", icon: <CheckCircle size={16} /> },
          { label: "Failed",           value: String(totalFailed),               color: "#dc2626", bg: "#fef2f2", icon: <AlertCircle size={16} /> },
          { label: "Scheduled",        value: String(totalScheduled),            color: "#2563eb", bg: "#eff6ff", icon: <Clock size={16} /> },
          { label: "Credits Used",     value: totalCreditsUsed.toLocaleString(), color: "#7c3aed", bg: "#f5f3ff", icon: <Zap size={16} /> },
        ].map(k => (
          <div key={k.label} style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: k.bg, color: k.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…"
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["All", "Delivered", "Pending", "Scheduled", "Failed"].map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: "7px 11px", border: `1px solid ${status === s ? "#7c3aed" : "#e5e7eb"}`,
              borderRadius: 8, background: status === s ? "#7c3aed" : "white",
              color: status === s ? "white" : "#374151", fontSize: 12, fontWeight: status === s ? 700 : 400, cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>
        <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, color: "#374151" }}>
          <Download size={12} /> Export
        </button>
        <button onClick={() => printHTML(`<div class="header"><div><h1>SMS History</h1><div class="school">Happy Kids Basic School · Term 2, 2025/2026</div></div></div><table><thead><tr><th>Date</th><th>Title</th><th>Recipients</th><th>Count</th><th>Credits</th><th>Status</th><th>Sent By</th></tr></thead><tbody>${filtered.map(m=>`<tr><td>${m.date}</td><td>${m.title}</td><td>${m.recipients}</td><td>${m.recipientCount}</td><td>${m.credits}</td><td>${m.status}</td><td>${m.sentBy}</td></tr>`).join("")}</tbody></table>`, "SMS History")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, color: "#374151" }}>
          <Printer size={12} /> Print
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} message{filtered.length !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{filtered.reduce((s, m) => s + m.credits, 0)} credits total</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                {["Date", "Title", "Recipients", "Count", "Sender ID", "Credits", "Status", "Sent By", "Action"].map(h => (
                  <th key={h} style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const st = statusStyle(m.status);
                return (
                  <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer" }}
                    onClick={() => setSelected(m)}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#fafafa"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "white"}
                  >
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>{m.date}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 600, color: "#111827", maxWidth: 200 }}>{m.title}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{m.recipients}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{m.recipientCount}</td>
                    <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#ede9fe", color: "#7c3aed" }}>{m.senderId}</span></td>
                    <td style={{ padding: "10px 14px", fontSize: 12.5, color: "#374151" }}>{m.credits}</td>
                    <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{m.status}</span></td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{m.sentBy}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <button onClick={e => { e.stopPropagation(); showToast(`Message resent to ${m.recipients}`, "success"); }} style={{ padding: "4px 10px", border: "none", borderRadius: 6, background: "#f5f3ff", color: "#7c3aed", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
                        Resend
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 520, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{selected.title}</span>
              <button onClick={() => setSelected(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} color="#6b7280" /></button>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Recipients", String(selected.recipientCount)], ["Credits Used", String(selected.credits)], ["Status", selected.status]].map(([k, v]) => (
                  <div key={k} style={{ background: "#f9fafb", borderRadius: 8, padding: "9px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{v}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600 }}>{k}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 6 }}>MESSAGE</div>
                <div style={{ background: "#f9fafb", borderRadius: 9, padding: 12, fontSize: 12.5, color: "#374151", lineHeight: 1.7, borderLeft: "4px solid #7c3aed" }}>{selected.message}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "right", marginTop: 4 }}>{selected.message.length} chars · {Math.ceil(selected.message.length / 160)} SMS unit{Math.ceil(selected.message.length / 160) > 1 ? "s" : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["📤 Resend", () => showToast(`Resent to ${selected.recipients}`, "success")], ["💾 Save Template", () => showToast("Saved as template", "info")]].map(([label, fn]) => (
                  <button key={label as string} onClick={fn as () => void} style={{ flex: 1, padding: "9px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{label as string}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Templates ───────────────────────────────────────────────────────────
function TemplatesTab() {
  const { showToast } = useApp();
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("All");
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewTpl,   setPreviewTpl]   = useState<SMSTemplate | null>(null);
  const [newName,      setNewName]      = useState("");
  const [newCat,       setNewCat]       = useState("General");
  const [newBody,      setNewBody]      = useState("");

  const cats = ["All", "Finance", "Attendance", "Academics", "Admissions", "General"];
  const filtered = templates.filter(t => {
    const ms = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "All" || t.category === catFilter;
    return ms && mc;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filters + new */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: "7px 11px", border: `1px solid ${catFilter === c ? "#7c3aed" : "#e5e7eb"}`,
              borderRadius: 8, background: catFilter === c ? "#7c3aed" : "white",
              color: catFilter === c ? "white" : "#374151", fontSize: 12, fontWeight: catFilter === c ? 700 : 400, cursor: "pointer",
            }}>{c}</button>
          ))}
        </div>
        <button onClick={() => setShowNewModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>
          <Plus size={13} /> New Template
        </button>
      </div>

      {/* Template grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map(t => {
          const cc = catColor[t.category] ?? catColor.General;
          return (
            <div key={t.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{t.name}</div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: cc.bg, color: cc.color }}>{t.category}</span>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.6, borderLeft: "3px solid #e5e7eb", paddingLeft: 10, flex: 1 }}>{t.body}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {t.variables.map(v => (
                  <span key={v} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#f3f4f6", color: "#6b7280" }}>{`{${v}}`}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPreviewTpl(t)} style={{ flex: 1, padding: "7px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", fontSize: 12, color: "#374151" }}>Preview</button>
                <button onClick={() => showToast(`Template "${t.name}" loaded in Compose`, "success")} style={{ flex: 1, padding: "7px", border: "none", borderRadius: 7, background: "#f5f3ff", color: "#7c3aed", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Use</button>
                <button onClick={() => showToast("Template copied", "info")} style={{ padding: "7px 9px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", color: "#9ca3af" }}>
                  <Copy size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      {previewTpl && (
        <div onClick={() => setPreviewTpl(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 480, width: "100%", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div><span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{previewTpl.name}</span></div>
              <button onClick={() => setPreviewTpl(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} color="#6b7280" /></button>
            </div>
            <div style={{ background: "#374151", borderRadius: "10px 10px 0 0", padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>From</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "white" }}>HappyKids</span>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: "0 0 10px 10px", padding: 14, fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 14 }}>{previewTpl.body}</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Variables used:</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {previewTpl.variables.map(v => <span key={v} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "#ede9fe", color: "#7c3aed" }}>{`{${v}}`}</span>)}
              </div>
            </div>
            <button onClick={() => { showToast(`Template "${previewTpl.name}" loaded in Compose`, "success"); setPreviewTpl(null); }}
              style={{ width: "100%", padding: "10px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Use This Template
            </button>
          </div>
        </div>
      )}

      {/* New template modal */}
      {showNewModal && (
        <div onClick={() => setShowNewModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 480, width: "100%", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>New SMS Template</span>
              <button onClick={() => setShowNewModal(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} color="#6b7280" /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Template Name</label>
                <input style={inputS} value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Exam Reminder" />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Category</label>
                <select style={{ ...inputS, cursor: "pointer" }} value={newCat} onChange={e => setNewCat(e.target.value)}>
                  {["Finance", "Attendance", "Academics", "Admissions", "General"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
                  Message Body <span style={{ fontWeight: 400, color: "#9ca3af" }}>({newBody.length} chars)</span>
                </label>
                <textarea style={{ ...inputS, resize: "vertical", minHeight: 90 }} value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Use {StudentName}, {ParentName}, {Balance}, {SchoolName} etc." />
                <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 3 }}>Use curly braces for variables: {"{StudentName}"}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowNewModal(false)} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, color: "#374151" }}>Cancel</button>
                <button onClick={() => { showToast(`Template "${newName}" saved`, "success"); setShowNewModal(false); setNewName(""); setNewBody(""); }}
                  disabled={!newName || !newBody}
                  style={{ flex: 2, padding: "10px", border: "none", borderRadius: 8, background: newName && newBody ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb", color: newName && newBody ? "white" : "#9ca3af", fontSize: 13, fontWeight: 700, cursor: newName && newBody ? "pointer" : "not-allowed" }}>
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────
function SMSSettingsTab() {
  const { showToast } = useApp();
  const [senderId,      setSenderId]      = useState("HappyKids");
  const [senderStatus,  setSenderStatus]  = useState<SenderStatus>("Approved");
  const [newSenderId,   setNewSenderId]   = useState("");
  const [requesting,    setRequesting]    = useState(false);
  const [triggers,      setTriggers]      = useState<Record<string, boolean>>({
    attendance: true, fee_reminder: true, payment: true,
    admission: false, exam: false, result: false, birthday: false,
  });
  const [showBuyModal,  setShowBuyModal]  = useState(false);
  const [buyBundle,     setBuyBundle]     = useState("");

  const senderIdValid = newSenderId.length >= 3 && newSenderId.length <= 11 && /^[A-Za-z0-9]+$/.test(newSenderId);
  const senderSuggestions = ["HappyKids", "HKBasic", "HKSchool"].filter(s => s !== senderId);

  const handleRequest = () => {
    if (!senderIdValid) return;
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      showToast(`Sender ID "${newSenderId}" request submitted for review`, "success");
      setNewSenderId("");
    }, 1500);
  };

  const bundles = [
    { name: "Starter",      credits: 500,   price: "GH₵ 25" },
    { name: "Growth",       credits: 1500,  price: "GH₵ 65" },
    { name: "Professional", credits: 5000,  price: "GH₵ 200" },
    { name: "Enterprise",   credits: 10000, price: "GH₵ 380" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* SMS Status + Balance */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 12 }}>SMS STATUS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>SMS Enabled</span>
          </div>
          <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 6 }}>Provider: <strong style={{ color: "#374151" }}>Arkesel</strong></div>
          <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>Sender ID: <strong style={{ color: "#7c3aed" }}>{senderId}</strong></div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 12, padding: 16, color: "white" }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, marginBottom: 8 }}>SMS CREDIT BALANCE</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>1,250</div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12 }}>
            <span style={{ opacity: 0.85 }}>Used: <strong>1,250</strong></span>
            <span style={{ opacity: 0.85 }}>Total: <strong>2,500</strong></span>
          </div>
          <button onClick={() => setShowBuyModal(true)} style={{ marginTop: 10, padding: "7px 12px", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 7, background: "transparent", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            + Buy Credits
          </button>
        </div>
      </div>

      {/* Sender ID */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Sender ID Management</div>

        {/* Current */}
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 2 }}>CURRENT SENDER ID</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{senderId}</div>
          </div>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#dcfce7", color: "#16a34a" }}>{senderStatus}</span>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Suggested alternatives for Happy Kids Basic School:</div>
          <div style={{ display: "flex", gap: 6 }}>
            {senderSuggestions.map(s => (
              <button key={s} onClick={() => setNewSenderId(s)} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 20, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Request new */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Request New Sender ID</div>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...inputS, paddingRight: 80 }}
              value={newSenderId}
              onChange={e => {
                const v = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                if (v.length <= 11) setNewSenderId(v);
              }}
              placeholder="e.g. HappyKids"
              maxLength={11}
            />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: newSenderId.length > 9 ? "#d97706" : "#9ca3af", fontWeight: 600 }}>
              {newSenderId.length} / 11
            </span>
          </div>
          {newSenderId && !senderIdValid && (
            <div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 4 }}>
              {newSenderId.length < 3 ? "Minimum 3 characters" : newSenderId.length > 11 ? "Maximum 11 characters" : "No special characters allowed"}
            </div>
          )}
          {newSenderId && senderIdValid && (
            <div style={{ fontSize: 11.5, color: "#16a34a", marginTop: 4 }}>✓ Valid Sender ID</div>
          )}
          <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 4 }}>
            Rules: 3–11 characters · Letters and numbers only · No spaces or special characters
          </div>
          <button
            onClick={handleRequest}
            disabled={!senderIdValid || requesting}
            style={{ marginTop: 10, padding: "9px 16px", border: "none", borderRadius: 8, background: senderIdValid ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb", color: senderIdValid ? "white" : "#9ca3af", fontSize: 13, fontWeight: 600, cursor: senderIdValid ? "pointer" : "not-allowed" }}
          >
            {requesting ? "Submitting…" : "Request Sender ID"}
          </button>
        </div>
      </div>

      {/* Auto-triggers */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Automatic SMS Triggers</div>
        <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 14 }}>Enable automatic SMS notifications based on school events.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {autoTriggers.map(t => (
            <div key={t.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: `1px solid ${triggers[t.key] ? "#c4b5fd" : "#e5e7eb"}`, borderRadius: 10, background: triggers[t.key] ? "#faf5ff" : "#fafafa", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.desc}</div>
                </div>
              </div>
              <Toggle checked={triggers[t.key]} onChange={v => { setTriggers(p => ({ ...p, [t.key]: v })); showToast(`${t.label} ${v ? "enabled" : "disabled"}`, v ? "success" : "info"); }} />
            </div>
          ))}
        </div>
        <button onClick={() => showToast("Trigger settings saved", "success")} style={{ marginTop: 14, padding: "9px 20px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
          <CheckCircle size={14} /> Save Trigger Settings
        </button>
      </div>

      {/* Coming Soon */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Future-Ready Features</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {["WhatsApp Messaging", "Voice Calls", "USSD Notifications", "Email Campaigns", "SMS Scheduling", "Hubtel", "mNotify", "Nalo Solutions"].map(f => (
            <div key={f} style={{ padding: "10px 12px", background: "#fafafa", borderRadius: 8, border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "#f3f4f6", color: "#9ca3af", flexShrink: 0 }}>SOON</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buy credits modal */}
      {showBuyModal && (
        <div onClick={() => setShowBuyModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, maxWidth: 440, width: "100%", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Buy SMS Credits</span>
              <button onClick={() => setShowBuyModal(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={13} color="#6b7280" /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {bundles.map(b => (
                <div key={b.name} onClick={() => setBuyBundle(b.name)} style={{ padding: "14px", border: `2px solid ${buyBundle === b.name ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 10, cursor: "pointer", background: buyBundle === b.name ? "#f5f3ff" : "white", transition: "all 0.12s" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{b.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#7c3aed", marginTop: 2 }}>{b.credits.toLocaleString()}</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>SMS credits</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 6 }}>{b.price}</div>
                </div>
              ))}
            </div>
            <button onClick={() => { showToast(`${buyBundle} bundle — redirecting to payment…`, "info"); setShowBuyModal(false); setBuyBundle(""); }}
              disabled={!buyBundle}
              style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: buyBundle ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb", color: buyBundle ? "white" : "#9ca3af", fontSize: 13.5, fontWeight: 700, cursor: buyBundle ? "pointer" : "not-allowed" }}>
              {buyBundle ? `Purchase ${buyBundle} Bundle` : "Select a bundle"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
const pageTabs = [
  { id: "compose",   label: "Compose",   icon: <Send size={14} /> },
  { id: "history",   label: "History",   icon: <MessageSquare size={14} /> },
  { id: "templates", label: "Templates", icon: <FileText size={14} /> },
  { id: "settings",  label: "Settings",  icon: <Settings size={14} /> },
];

export default function SMS() {
  const { isMobile } = useWindowSize();
  const [activeTab, setActiveTab] = useState("compose");

  const totalSent     = history.filter(m => m.status === "Delivered").reduce((s, m) => s + m.recipientCount, 0);
  const totalMessages = history.filter(m => m.status === "Delivered").length;
  const scheduled     = history.filter(m => m.status === "Scheduled").length;
  const creditsUsed   = history.filter(m => m.status === "Delivered").reduce((s, m) => s + m.credits, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>SMS Communication</h1>
          {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Sender ID: <strong>HappyKids</strong> · Provider: Arkesel · 1,250 credits remaining</p>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "#f0fdf4", borderRadius: 20, border: "1px solid #bbf7d0" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>SMS Active</span>
          </div>
          <button onClick={() => setActiveTab("compose")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Plus size={13} /> New SMS
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Messages Sent",  value: String(totalMessages),              color: "#7c3aed", bg: "#f5f3ff", icon: "📤" },
          { label: "Recipients",     value: totalSent.toLocaleString(),          color: "#2563eb", bg: "#eff6ff", icon: "👥" },
          { label: "Scheduled",      value: String(scheduled),                  color: "#d97706", bg: "#fffbeb", icon: "⏰" },
          { label: "Credits Used",   value: creditsUsed.toLocaleString(),       color: "#16a34a", bg: "#f0fdf4", icon: "⚡" },
        ].map(k => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", border: "1px solid #e5e7eb", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 17, fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "2px solid #f3f4f6", marginBottom: 20, overflowX: "auto" }}>
        {pageTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", border: "none",
              background: "transparent", borderBottom: activeTab === tab.id ? "2px solid #7c3aed" : "2px solid transparent",
              marginBottom: -2, color: activeTab === tab.id ? "#7c3aed" : "#6b7280",
              fontSize: 13.5, fontWeight: activeTab === tab.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: activeTab === tab.id ? "#7c3aed" : "#9ca3af" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "compose"   && <ComposeTab />}
      {activeTab === "history"   && <HistoryTab />}
      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "settings"  && <SMSSettingsTab />}
    </div>
  );
}
