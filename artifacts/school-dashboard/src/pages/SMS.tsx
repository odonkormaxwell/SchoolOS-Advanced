import { useState } from "react";
import { Plus, Search, ChevronRight, X, Send, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type SMSStatus = "Delivered" | "Failed" | "Pending" | "Scheduled";

type SMSMessage = {
  id: number; title: string; message: string;
  recipients: string; recipientCount: number;
  sentBy: string; date: string; time: string;
  status: SMSStatus; cost: number;
};

const messages: SMSMessage[] = [
  { id: 1,  title: "Mid-Term Exam Reminder",         message: "Dear Parent, this is to inform you that mid-term examinations begin on Monday, 27th May 2024. Please ensure your ward studies adequately. Contact us on 0244-123456 for any queries. Maxibern Education Centre.",                                                                       recipients: "All Parents",           recipientCount: 380, sentBy: "Mr. E. Mensah",  date: "25 May 2024", time: "9:00 AM",  status: "Delivered", cost: 7.60 },
  { id: 2,  title: "Sports Day Invitation",           message: "Dear Parent, you are warmly invited to our Annual Sports Day on Friday, 31st May 2024 at 7:30 AM on the school field. Your presence will greatly encourage our students. Dress code: House colours. Maxibern Education Centre.",                                                   recipients: "All Parents",           recipientCount: 380, sentBy: "Coach A. Gyasi", date: "22 May 2024", time: "11:00 AM", status: "Delivered", cost: 7.60 },
  { id: 3,  title: "Fees Payment Reminder",           message: "Dear Parent, kindly note that Term 2 school fees for your ward are outstanding. Please pay at the school accounts office or via MoMo (0244-654321) before 31st May to avoid sanctions. Thank you. Maxibern Accounts.",                                                           recipients: "Debtors Only",          recipientCount: 42,  sentBy: "Mr. S. Darko",  date: "20 May 2024", time: "2:00 PM",  status: "Delivered", cost: 0.84 },
  { id: 4,  title: "Result Collection Notice",        message: "Dear Parent, end-of-term report cards for Term 2 will be ready for collection on Friday, 7th June 2024 at the school office from 8:00 AM to 3:00 PM. Please bring your ward's ID card. Maxibern Education Centre.",                                                            recipients: "All Parents",           recipientCount: 380, sentBy: "Mrs. A. Aidoo",  date: "18 May 2024", time: "10:00 AM", status: "Delivered", cost: 7.60 },
  { id: 5,  title: "PTA Meeting Alert",               message: "Dear Parent, the PTA meeting is scheduled for Saturday, 18th May 2024 at 10:00 AM in the school hall. Agenda: Academic performance, fees review, infrastructure. Your attendance is very important. Maxibern PTA.",                                                              recipients: "All Parents",           recipientCount: 380, sentBy: "Mrs. A. Aidoo",  date: "15 May 2024", time: "3:00 PM",  status: "Delivered", cost: 7.60 },
  { id: 6,  title: "Health Screening Results — P6",   message: "Dear Parent of a P6 student, your ward has been screened by the Ghana Health Service nurse. Please visit the school nurse's office to collect the results and recommendation form. Thank you. Maxibern Health Unit.",                                                             recipients: "P6 Parents",            recipientCount: 46,  sentBy: "Mrs. E. Acheampong", date: "12 May 2024", time: "1:00 PM", status: "Delivered", cost: 0.92 },
  { id: 7,  title: "School Closure — Public Holiday", message: "Dear Parent, please be informed that school will be closed on Monday, 6th May 2024 due to the national public holiday. Regular school activities resume on Tuesday, 7th May. Thank you. Maxibern Administration.",                                                               recipients: "All Parents & Staff",   recipientCount: 393, sentBy: "Mr. E. Mensah",  date: "4 May 2024",  time: "5:00 PM",  status: "Delivered", cost: 7.86 },
  { id: 8,  title: "JHS 3 BECE Registration",         message: "Dear JHS 3 Parent, BECE registration forms are now available at the school office. Registration fee: GH₵ 50. Deadline: 15th June 2024. Please complete and return forms with photos by the deadline. Maxibern JHS.",                                                            recipients: "JHS 3 Parents",         recipientCount: 54,  sentBy: "Mr. E. Mensah",  date: "1 May 2024",  time: "8:00 AM",  status: "Delivered", cost: 1.08 },
  { id: 9,  title: "Upcoming School Activities",      message: "Dear Parent, reminder of upcoming school events: 31 May — Sports Day. 7 June — End of Term. 17 June — Report Card Collection. Term 3 begins: 16 September 2024. We look forward to your support. Maxibern Education Centre.",                                                   recipients: "All Parents",           recipientCount: 380, sentBy: "Mrs. A. Aidoo",  date: "28 May 2024", time: "9:00 AM",  status: "Scheduled", cost: 7.60 },
];

const statusStyle = (s: SMSStatus) => {
  if (s === "Delivered")  return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Pending")    return { bg: "#fef3c7", color: "#d97706" };
  if (s === "Scheduled")  return { bg: "#dbeafe", color: "#2563eb" };
  return                         { bg: "#fee2e2", color: "#dc2626" };
};

const recipientGroups = ["All Parents", "All Students", "All Staff", "JHS Parents", "JHS 3 Parents", "P6 Parents", "Upper Primary Parents", "Debtors Only", "All Parents & Staff"];

export default function SMS() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<SMSMessage>(messages[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [charCount,   setCharCount]   = useState(0);

  const filtered = messages.filter((m) =>
    !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.recipients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSent      = messages.filter(m => m.status === "Delivered").reduce((s, m) => s + m.recipientCount, 0);
  const totalMessages  = messages.filter(m => m.status === "Delivered").length;
  const totalCost      = messages.reduce((s, m) => s + m.cost, 0);
  const scheduled      = messages.filter(m => m.status === "Scheduled").length;

  const MessagePanel = () => {
    const st = statusStyle(selected.status);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Message Detail</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast(`Message resent to ${selected.recipients}`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "white", display: "flex", gap: 4, alignItems: "center" }}><Send size={12} /> Resend</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title + status */}
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{selected.title}</div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0, whiteSpace: "nowrap" }}>{selected.status}</span>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>📅 {selected.date} at {selected.time}</span>
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>👤 {selected.sentBy}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Recipients",  value: String(selected.recipientCount), bg: "#ede9fe", color: "#7c3aed" },
              { label: "Cost",        value: `GH₵ ${selected.cost.toFixed(2)}`, bg: "#dbeafe", color: "#2563eb" },
              { label: "Audience",    value: selected.recipients.split(" ").slice(0, 2).join(" "), bg: "#dcfce7", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Message body */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>MESSAGE CONTENT</div>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px", fontSize: 12.5, color: "#374151", lineHeight: 1.8, borderLeft: "4px solid #7c3aed" }}>{selected.message}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6, textAlign: "right" }}>{selected.message.length} characters · {Math.ceil(selected.message.length / 160)} SMS unit{Math.ceil(selected.message.length / 160) > 1 ? "s" : ""}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Message forwarded to ${selected.recipients}`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📤 Send to Same Group Again</button>
            <button onClick={() => { showToast("Message template saved", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>💾 Save as Template</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>SMS Messaging</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Communication","SMS"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowCompose(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " New SMS"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Messages Sent",  value: String(totalMessages), icon: "📤", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Recipients",     value: totalSent.toLocaleString(), icon: "👥", bg: "#dbeafe", color: "#2563eb" },
          { label: "Scheduled",      value: String(scheduled),     icon: "⏰", bg: "#fef3c7", color: "#d97706" },
          { label: "Total Cost",     value: `GH₵ ${totalCost.toFixed(2)}`, icon: "💰", bg: "#dcfce7", color: "#16a34a" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ position: "relative" }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search messages..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 280px)" }}>
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 320, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} message{filtered.length!==1?"s":""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((msg) => {
                const st = statusStyle(msg.status);
                const isActive = selected.id === msg.id;
                return (
                  <div key={msg.id} onClick={() => { setSelected(msg); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.title}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: st.bg, color: st.color, flexShrink: 0 }}>{msg.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>👥 {msg.recipientCount} · {msg.recipients.substring(0, 20)}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{msg.date}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.message.substring(0, 70)}...</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <MessagePanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "82vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <MessagePanel />
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div onClick={() => setShowCompose(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>📱 Compose SMS</h2>
              <button onClick={() => setShowCompose(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Send To</label>
                <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                  {recipientGroups.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Subject / Title</label>
                <input placeholder="e.g. Fees Reminder" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Message <span style={{ color: "#9ca3af", fontWeight: 400 }}>(max 160 chars)</span></label>
                <textarea rows={4} maxLength={320} onChange={(e) => setCharCount(e.target.value.length)} placeholder="Type your SMS message here..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ fontSize: 11, color: charCount > 160 ? "#d97706" : "#9ca3af", textAlign: "right", marginTop: 3 }}>{charCount}/320 · {Math.ceil(charCount / 160) || 1} SMS unit{Math.ceil(charCount / 160) > 1 ? "s" : ""}</div>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
                <MessageSquare size={14} color="#7c3aed" />
                <span style={{ fontSize: 11.5, color: "#6b7280" }}>Estimated cost: <strong style={{ color: "#7c3aed" }}>GH₵ 0.02 per SMS</strong> · Credit balance: <strong style={{ color: "#16a34a" }}>GH₵ 45.60</strong></span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { showToast("Message scheduled for later", "info"); setShowCompose(false); }} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>⏰ Schedule</button>
                <button onClick={() => { showToast("SMS sent successfully!", "success"); setShowCompose(false); }} style={{ flex: 2, padding: "10px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📤 Send Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
