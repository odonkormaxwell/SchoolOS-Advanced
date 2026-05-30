import { useState } from "react";
import { Plus, Search, ChevronRight, X, Send, Paperclip, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type EmailFolder = "inbox" | "sent" | "drafts" | "starred";
type EmailPriority = "High" | "Normal" | "Low";

type Email = {
  id: number; folder: EmailFolder; from: string; fromInitials: string;
  fromBg: string; fromColor: string; to: string; subject: string;
  preview: string; body: string; date: string; time: string;
  read: boolean; starred: boolean; priority: EmailPriority;
  hasAttachment: boolean;
};

const emails: Email[] = [
  { id: 1,  folder: "inbox",  from: "Ghana Education Service", fromInitials: "GES", fromBg: "#dbeafe", fromColor: "#1e3a8a", to: "headmaster@maxibern.edu.gh", subject: "2024 Term 2 Supervision Report — Due 14 June", preview: "Dear Headmaster, kindly submit your Term 2 supervision and academic performance report...", body: "Dear Headmaster,\n\nKindly note that the Term 2 Supervision and Academic Performance Report is due by Friday, 14th June 2024.\n\nPlease ensure the report includes:\n1. School enrollment statistics\n2. Attendance summary\n3. Academic performance (BECE mock results)\n4. Staffing situation\n5. Infrastructure updates\n\nSubmit via the GES portal at ges.gov.gh/reports or email back to this address.\n\nThank you for your cooperation.\n\nGhana Education Service\nGreater Accra Regional Office", date: "28 May 2024", time: "9:14 AM", read: false, starred: true,  priority: "High",   hasAttachment: true },
  { id: 2,  folder: "inbox",  from: "GETFund Secretariat",     fromInitials: "GF", fromBg: "#dcfce7", fromColor: "#15803d", to: "accounts@maxibern.edu.gh",    subject: "Scholarship Disbursement — May 2024",             preview: "Dear School Administrator, please find attached the scholarship disbursement schedule...", body: "Dear School Administrator,\n\nWe write to inform you that the GETFund scholarship disbursement for May 2024 has been processed.\n\nTotal disbursed: GH₵ 4,420 for 3 beneficiaries.\n\nKindly acknowledge receipt and ensure funds are applied to the beneficiaries' fee accounts.\n\nAttached is the disbursement schedule and individual breakdowns.\n\nGETFund Secretariat\nMinistry of Education, Ghana", date: "25 May 2024", time: "2:30 PM", read: false, starred: false, priority: "High",   hasAttachment: true },
  { id: 3,  folder: "inbox",  from: "PTA Chairman (Mr. Kojo)", fromInitials: "PK", fromBg: "#fef3c7", fromColor: "#92400e", to: "headmaster@maxibern.edu.gh", subject: "PTA Meeting Minutes — 18 May 2024",               preview: "Dear Headmaster, please find the minutes of our last PTA meeting for your records...", body: "Dear Headmaster,\n\nPlease find attached the official minutes of the PTA meeting held on 18th May 2024.\n\nKey decisions:\n- School fees for Term 3 to remain unchanged\n- New perimeter wall approved (budget: GH₵ 45,000)\n- PTA to sponsor 3 outstanding students for extra tuition\n- Headmaster's report adopted without amendments\n\nKindly countersign the minutes and return a copy for our records.\n\nWith regards,\nMr. Kojo Acheampong\nPTA Chairman", date: "22 May 2024", time: "4:00 PM", read: true,  starred: false, priority: "Normal", hasAttachment: true },
  { id: 4,  folder: "inbox",  from: "Accra Furniture Co",      fromInitials: "AF", fromBg: "#ede9fe", fromColor: "#6d28d9", to: "accounts@maxibern.edu.gh",    subject: "Invoice #2024-0451 for Student Desks",           preview: "Dear Accounts Team, please find attached our invoice for the 20 student desks...", body: "Dear Accounts Team,\n\nThank you for your recent order. Please find attached Invoice #2024-0451 for the supply and delivery of 20 student desks and chairs.\n\nTotal: GH₵ 3,600\nPayment due: 7 June 2024\nBank: GCB Bank, Acc: 1234-5678-90\n\nPlease confirm receipt of the invoice and expected payment date.\n\nBest regards,\nAccra Furniture Co", date: "20 May 2024", time: "11:45 AM", read: true,  starred: false, priority: "Normal", hasAttachment: true },
  { id: 5,  folder: "sent",   from: "Mr. E. Mensah",          fromInitials: "EM", fromBg: "#ede9fe", fromColor: "#6d28d9", to: "ges-accra@ges.gov.gh",        subject: "Re: School Performance Data Request",           preview: "Dear GES Officer, please find attached our school performance data for Term 1...", body: "Dear GES Officer,\n\nThank you for your request. Please find attached our school performance data for Term 1 2024.\n\nHighlights:\n- Total Enrollment: 480 students\n- Term 1 Attendance Rate: 91.4%\n- JHS 3 Mock Results: Avg score 78.2%\n- Staff complement: 13 (all qualified)\n\nPlease let us know if you need any further information.\n\nBest regards,\nMr. E. Mensah\nHeadteacher, Maxibern Education Centre", date: "26 May 2024", time: "10:00 AM", read: true, starred: false, priority: "Normal", hasAttachment: true },
  { id: 6,  folder: "sent",   from: "Mr. E. Mensah",          fromInitials: "EM", fromBg: "#ede9fe", fromColor: "#6d28d9", to: "parents@all.maxibern",        subject: "End-of-Term Schedule & Important Dates",         preview: "Dear Parents, please note the following important dates for the end of Term 2...", body: "Dear Parents,\n\nPlease note the following important dates for the end of Term 2 2024:\n\n• 31 May 2024 — Sports Day\n• 7 June 2024 — End of Term\n• 17 June 2024 — Report Card Collection\n• 16 September 2024 — Term 3 Begins\n\nWe thank you for your continued support and partnership.\n\nBest regards,\nMr. E. Mensah\nHeadteacher", date: "24 May 2024", time: "8:30 AM", read: true,  starred: true,  priority: "Normal", hasAttachment: false },
  { id: 7,  folder: "drafts", from: "Mr. E. Mensah",          fromInitials: "EM", fromBg: "#ede9fe", fromColor: "#6d28d9", to: "getfund@moe.gov.gh",          subject: "GETFund Scholarship Renewal Application — 2024/25", preview: "Dear GETFund Secretariat, we write to apply for the renewal of scholarships for...", body: "Dear GETFund Secretariat,\n\nWe write to apply for the renewal of scholarships for our three (3) current beneficiaries for the 2024/25 academic year.\n\nBeneficiaries:\n1. Emmanuel Kofi Adu — Orphan Support\n2. Yaw Darko — Financial Need\n3. [To be confirmed — pending welfare committee meeting]\n\n[DRAFT — attach supporting documents before sending]", date: "27 May 2024", time: "3:00 PM", read: true,  starred: false, priority: "High",   hasAttachment: false },
];

const folderCounts = {
  inbox:   emails.filter(e => e.folder === "inbox").length,
  sent:    emails.filter(e => e.folder === "sent").length,
  drafts:  emails.filter(e => e.folder === "drafts").length,
  starred: emails.filter(e => e.starred).length,
};

const priorityStyle = (p: EmailPriority) => {
  if (p === "High") return { color: "#dc2626", bg: "#fee2e2" };
  if (p === "Low")  return { color: "#9ca3af", bg: "#f3f4f6" };
  return                   { color: "#374151", bg: "#f3f4f6" };
};

export default function Email() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [folder,      setFolder]      = useState<EmailFolder>("inbox");
  const [selected,    setSelected]    = useState<Email>(emails[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const filtered = emails.filter((e) => {
    const mFolder = folder === "starred" ? e.starred : e.folder === folder;
    const mSearch = !searchQuery || e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || e.from.toLowerCase().includes(searchQuery.toLowerCase());
    return mFolder && mSearch;
  });

  const unreadCount = emails.filter(e => e.folder === "inbox" && !e.read).length;

  const EmailDetail = () => {
    const ps = priorityStyle(selected.priority);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Email</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast(`Reply sent to ${selected.from}`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, color: "#374151" }}>↩️ Reply</button>
            <button onClick={() => { showToast("Email forwarded", "info"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "none", borderRadius: 8, background: "#7c3aed", color: "white", cursor: "pointer", fontSize: 12 }}>→ Fwd</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Subject */}
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 8 }}>{selected.subject}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {selected.priority === "High" && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: ps.bg, color: ps.color }}>🔴 High Priority</span>}
              {selected.hasAttachment && <span style={{ fontSize: 11, color: "#9ca3af", display: "flex", gap: 3, alignItems: "center" }}><Paperclip size={11} /> Attachment</span>}
              {selected.starred && <span style={{ fontSize: 12 }}>⭐ Starred</span>}
            </div>
          </div>

          {/* Sender */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: selected.fromBg, color: selected.fromColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{selected.fromInitials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{selected.from}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>To: {selected.to}</div>
            </div>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{selected.date}, {selected.time}</span>
          </div>

          {/* Body */}
          <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-line" }}>{selected.body}</div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { showToast(`Reply sent to ${selected.from}`, "success"); if (isMobile) setShowPanel(false); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>↩️ Reply</button>
            <button onClick={() => showToast("Email forwarded", "info")} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>→ Forward</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Email</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Communication","Email"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowCompose(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Compose"}
        </button>
      </div>

      {/* Folders */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {(["inbox","sent","drafts","starred"] as EmailFolder[]).map((f) => {
          const labels: Record<EmailFolder, string> = { inbox: "📥 Inbox", sent: "📤 Sent", drafts: "📝 Drafts", starred: "⭐ Starred" };
          const count = folderCounts[f];
          return (
            <button key={f} onClick={() => setFolder(f)} style={{ padding: "7px 14px", border: `1px solid ${folder===f?"#7c3aed":"#e5e7eb"}`, borderRadius: 8, background: folder===f?"linear-gradient(135deg,#7c3aed,#6d28d9)":"white", color: folder===f?"white":"#374151", fontSize: 12.5, fontWeight: folder===f?600:400, cursor: "pointer", display: "flex", gap: 6, alignItems: "center" }}>
              {labels[f]} {count > 0 && <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 20, background: folder===f?"rgba(255,255,255,0.25)":"#f3f4f6", fontWeight: 700 }}>{count}</span>}
              {f === "inbox" && unreadCount > 0 && <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 20, background: "#dc2626", color: "white", fontWeight: 700 }}>{unreadCount}</span>}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
        <div style={{ position: "relative" }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search emails..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 290px)" }}>
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 320, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} email{filtered.length!==1?"s":""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((email) => {
                const ps = priorityStyle(email.priority);
                const isActive = selected.id === email.id;
                return (
                  <div key={email.id} onClick={() => { setSelected(email); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : email.read ? "white" : "#fafbff", borderLeft: `3px solid ${!email.read ? "#7c3aed" : "transparent"}`, transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = email.read ? "white" : "#fafbff"; }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: email.fromBg, color: email.fromColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{email.fromInitials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: email.read ? 500 : 800, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email.from}</span>
                          <span style={{ fontSize: 10.5, color: "#9ca3af", flexShrink: 0 }}>{email.time}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: email.read ? 400 : 700, color: email.read ? "#374151" : "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{email.subject}</div>
                        <div style={{ fontSize: 11.5, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{email.preview}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                          {email.priority === "High" && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: ps.bg, color: ps.color }}>🔴 High</span>}
                          {email.hasAttachment && <Paperclip size={11} color="#9ca3af" />}
                          {email.starred && <Star size={11} color="#d97706" fill="#d97706" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <EmailDetail />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <EmailDetail />
          </div>
        </div>
      )}

      {showCompose && (
        <div onClick={() => setShowCompose(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 520, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>✉️ Compose Email</h2>
              <button onClick={() => setShowCompose(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["To","email","e.g. parents@all.maxibern"],["Subject","text","e.g. Important School Notice"]].map(([l,t,p]) => (
                <div key={l as string} style={{ display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", width: 50, flexShrink: 0 }}>{l}:</label>
                  <input type={t as string} placeholder={p as string} style={{ flex: 1, border: "none", outline: "none", fontSize: 12.5, color: "#374151" }} />
                </div>
              ))}
              <textarea rows={8} placeholder="Write your email here..." style={{ width: "100%", padding: "9px 0", border: "none", outline: "none", fontSize: 12.5, color: "#374151", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.7 }} />
              <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
                <button onClick={() => { showToast("Attachment added", "info"); }} style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#374151", fontSize: 12, cursor: "pointer", display: "flex", gap: 5, alignItems: "center" }}><Paperclip size={13} /> Attach</button>
                <button onClick={() => { showToast("Email saved as draft", "info"); setShowCompose(false); }} style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#374151", fontSize: 12, cursor: "pointer" }}>Save Draft</button>
                <button onClick={() => { showToast("Email sent!", "success"); setShowCompose(false); }} style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", gap: 5, alignItems: "center", justifyContent: "center" }}><Send size={13} /> Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
