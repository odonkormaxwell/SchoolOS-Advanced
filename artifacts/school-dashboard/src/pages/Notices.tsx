import { useState } from "react";
import { Plus, Search, ChevronRight, X, Pin, Bell, Calendar, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type NoticeCategory = "Academic" | "Administrative" | "Sports" | "Health" | "Finance" | "General";

type Notice = {
  id: number; title: string; body: string; category: NoticeCategory;
  author: string; authorInitials: string; authorBg: string; authorColor: string;
  date: string; pinned: boolean; audience: string; urgent: boolean;
};

const notices: Notice[] = [
  { id: 1,  title: "Mid-Term Examination Timetable",                   body: "The mid-term examination timetable for all classes from P3 to JHS 3 is now available. Examinations begin on Monday, 27th May 2024. Students are advised to collect their exam slips from the school office by Thursday, 23rd May. All students must arrive at least 15 minutes before the start of each paper. No student will be allowed into the examination hall after the examination has begun. Parents are encouraged to ensure students prepare adequately.",                        category: "Academic",       author: "Mr. E. Mensah",   authorInitials: "EM", authorBg: "#ede9fe", authorColor: "#6d28d9", date: "20 May 2024", pinned: true,  audience: "All Students & Parents", urgent: true  },
  { id: 2,  title: "Sports Day — Friday, 31st May 2024",                body: "The Annual Inter-House Sports Day will be held on Friday, 31st May 2024, on the school field. All students are expected to participate in at least one event. Houses are the Red Eagles, Blue Dolphins, Green Panthers, and Yellow Lions. The day will begin with a march past at 7:30 AM. Parents and guardians are warmly invited. Refreshments will be available for purchase. Students should wear their house colours on that day.",                                              category: "Sports",         author: "Coach A. Gyasi",  authorInitials: "AG", authorBg: "#dcfce7", authorColor: "#15803d", date: "18 May 2024", pinned: true,  audience: "Whole School",           urgent: false },
  { id: 3,  title: "School Fees Payment Reminder — Term 2",             body: "This is a reminder that Term 2 school fees were due on 15th April 2024. Parents who have not yet paid are urged to do so immediately to avoid their ward being sent home. The school administration will begin sending home students with outstanding fees from Monday, 27th May 2024. If you are experiencing financial difficulties, please visit the accounts office to discuss a payment plan. Receipts should be kept safely.",                                                       category: "Finance",        author: "Mr. S. Darko",    authorInitials: "SD", authorBg: "#fef9c3", authorColor: "#713f12", date: "17 May 2024", pinned: false, audience: "Parents",                urgent: true  },
  { id: 4,  title: "PTA Meeting — Saturday, 18th May 2024",             body: "The Parents-Teachers Association (PTA) meeting will be held on Saturday, 18th May 2024, at the school hall starting at 10:00 AM. Agenda items include: review of academic performance for Term 2, proposed infrastructure improvements, school feeding programme, and elections for new PTA executives. All parents and guardians are strongly encouraged to attend. Light refreshments will be served. Kindly sign the attendance register at the entrance.",                         category: "Administrative", author: "Mrs. A. Aidoo",   authorInitials: "AA", authorBg: "#fce7f3", authorColor: "#9d174d", date: "13 May 2024", pinned: false, audience: "All Parents",            urgent: false },
  { id: 5,  title: "Health Alert: Malaria Prevention Drive",             body: "In response to the recent increase in malaria cases in the community, the school has partnered with the Ghana Health Service to conduct a malaria prevention education drive. The school nurse will visit all classrooms this week to distribute insecticide-treated nets to families in need. Students are reminded to sleep under mosquito nets, wear protective clothing in the evenings, and report any symptoms such as fever, chills, or headache to the nurse immediately.", category: "Health",         author: "Mrs. E. Acheampong",authorInitials:"EA",authorBg: "#fce7f3", authorColor: "#9d174d", date: "10 May 2024", pinned: false, audience: "All Students & Parents", urgent: true  },
  { id: 6,  title: "Library Books Return Deadline",                      body: "All library books borrowed during Term 2 must be returned by Friday, 7th June 2024. Students who fail to return books on time will be charged a daily fine of GH₵ 2 per book. Students with outstanding library books will not receive their end-of-term report cards until books are returned. The library will be open from Monday to Friday, 7:30 AM to 3:00 PM. Parents are advised to help their wards locate and return any library books.",                                  category: "Academic",       author: "Ms. G. Tetteh",   authorInitials: "GT", authorBg: "#fce7f3", authorColor: "#9d174d", date: "8 May 2024",  pinned: false, audience: "All Students",           urgent: false },
  { id: 7,  title: "New School Uniform Policy — Effective Next Term",    body: "The school board has approved a new uniform policy effective from Term 3 of the 2023/2024 academic year. All students must wear the new school polo shirt with navy blue trousers or skirt. Sandals and slippers are no longer permitted; black school shoes must be worn at all times. The new uniform is available at the school shop. Parents who have financial constraints should speak with the headteacher. The old uniform will be acceptable until end of this term.",      category: "Administrative", author: "Mr. E. Mensah",   authorInitials: "EM", authorBg: "#ede9fe", authorColor: "#6d28d9", date: "5 May 2024",  pinned: false, audience: "Whole School",           urgent: false },
];

const catStyle: Record<NoticeCategory, { color: string; bg: string; emoji: string }> = {
  Academic:       { color: "#2563eb", bg: "#dbeafe", emoji: "📚" },
  Administrative: { color: "#7c3aed", bg: "#ede9fe", emoji: "🏫" },
  Sports:         { color: "#16a34a", bg: "#dcfce7", emoji: "⚽" },
  Health:         { color: "#dc2626", bg: "#fee2e2", emoji: "🏥" },
  Finance:        { color: "#d97706", bg: "#fef3c7", emoji: "💰" },
  General:        { color: "#6b7280", bg: "#f3f4f6", emoji: "📢" },
};

const categories: NoticeCategory[] = ["Academic", "Administrative", "Sports", "Health", "Finance", "General"];

export default function Notices() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<Notice>(notices[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter,   setCatFilter]   = useState<string>("All");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  const filtered = notices.filter((n) => {
    const mSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat    = catFilter === "All" || n.category === catFilter;
    return mSearch && mCat;
  });

  const pinned = notices.filter(n => n.pinned).length;
  const urgent = notices.filter(n => n.urgent).length;

  const NoticeDetail = () => {
    const cs = catStyle[selected.category];
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Notice</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast("Notice shared via SMS to all recipients", "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "white" }}>📤 Share</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: cs.bg, color: cs.color }}>
              {cs.emoji} {selected.category}
            </span>
            {selected.pinned && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#fef3c7", color: "#d97706" }}>
                <Pin size={11} /> Pinned
              </span>
            )}
            {selected.urgent && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#fee2e2", color: "#dc2626" }}>
                <Bell size={11} /> Urgent
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.35 }}>{selected.title}</h2>

          {/* Meta */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: "10px 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: selected.authorBg, color: selected.authorColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{selected.authorInitials}</div>
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{selected.author}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Calendar size={12} color="#9ca3af" />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{selected.date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <User size={12} color="#9ca3af" />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{selected.audience}</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>{selected.body}</div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`SMS sent to ${selected.audience}`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📱 Send via SMS
            </button>
            <button onClick={() => { showToast("Notice printed", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              🖨️ Print Notice
            </button>
            {!selected.pinned && (
              <button onClick={() => { showToast(`"${selected.title}" pinned to top`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #fde68a", background: "#fef9c3", color: "#d97706", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                📌 Pin to Top
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Notice Board</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Communication","Notices"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Post Notice"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Notices",  value: String(notices.length), icon: "📋", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Pinned",         value: String(pinned),         icon: "📌", bg: "#fef9c3", color: "#d97706" },
          { label: "Urgent",         value: String(urgent),         icon: "🔔", bg: "#fee2e2", color: "#dc2626" },
          { label: "Categories",     value: String(categories.length), icon: "🏷️", bg: "#dcfce7", color: "#16a34a" },
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

      {/* Search + category pills */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notices..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {["All", ...categories].map((c) => {
            const cs = c !== "All" ? catStyle[c as NoticeCategory] : { color: "#7c3aed", bg: "#ede9fe" };
            const isActive = catFilter === c;
            return (
              <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "5px 10px", border: `1px solid ${isActive ? cs.color : "#e5e7eb"}`, borderRadius: 20, background: isActive ? cs.bg : "white", color: isActive ? cs.color : "#6b7280", fontSize: 11.5, fontWeight: isActive ? 700 : 400, cursor: "pointer" }}>
                {c !== "All" && catStyle[c as NoticeCategory].emoji + " "}{c}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 300px)" }}>
        {/* Notice list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 340, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} notice{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {/* Pinned first */}
              {filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((notice) => {
                const cs = catStyle[notice.category];
                const isActive = selected.id === notice.id;
                return (
                  <div key={notice.id} onClick={() => { setSelected(notice); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : notice.pinned ? "#fffef0" : "white", borderLeft: `3px solid ${notice.urgent ? "#dc2626" : notice.pinned ? "#d97706" : "transparent"}`, transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = notice.pinned ? "#fffef0" : "white"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", flex: 1, lineHeight: 1.3 }}>{notice.title}</span>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        {notice.pinned && <Pin size={11} color="#d97706" />}
                        {notice.urgent && <Bell size={11} color="#dc2626" />}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: cs.bg, color: cs.color }}>{cs.emoji} {notice.category}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{notice.date}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{notice.body.substring(0, 80)}...</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <NoticeDetail />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <NoticeDetail />
          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Post New Notice</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Notice Title</label>
                <input placeholder="Enter notice title..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Category</label>
                  <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Audience</label>
                  <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                    {["Whole School","All Students","All Parents","All Staff","JHS Students","Upper Primary"].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Notice Body</label>
                <textarea rows={5} placeholder="Write the full notice content here..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[["📌 Pin to top","pin"],["🔔 Mark urgent","urgent"]].map(([label]) => (
                  <label key={label as string} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input type="checkbox" style={{ width: 14, height: 14, cursor: "pointer" }} />
                    <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
                  </label>
                ))}
              </div>
              <button onClick={() => { showToast("Notice posted to the board!", "success"); setShowForm(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Post Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
