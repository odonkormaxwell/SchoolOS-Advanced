import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, X, MapPin, Clock, Users, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type EventCategory = "Academic" | "Sports" | "Cultural" | "Administrative" | "Holiday" | "PTA";

type SchoolEvent = {
  id: number; title: string; date: string; day: number; month: number;
  time: string; endTime: string; location: string; category: EventCategory;
  audience: string; organizer: string; description: string;
  color: string; bg: string; emoji: string; attendees?: number;
};

const CURRENT_MONTH = 5;
const CURRENT_YEAR = 2024;

const events: SchoolEvent[] = [
  { id: 1,  title: "PTA Meeting",                  date: "Sat, 18 May 2024",  day: 18, month: 5, time: "10:00 AM", endTime: "12:00 PM", location: "School Hall",       category: "PTA",            audience: "All Parents",       organizer: "PTA Executives",  description: "Termly Parents-Teachers Association meeting. Agenda includes term report, school improvements, and PTA contributions.", color: "#7c3aed", bg: "#ede9fe", emoji: "👨‍👩‍👧" },
  { id: 2,  title: "Mid-Term Exams Begin",         date: "Mon, 27 May 2024",  day: 27, month: 5, time: "08:00 AM", endTime: "02:00 PM", location: "All Classrooms",    category: "Academic",       audience: "All Students",      organizer: "Exam Office",     description: "Mid-term examinations commence for all classes from P3 to JHS 3. Students must bring exam slips and school ID.",        color: "#2563eb", bg: "#dbeafe", emoji: "📝" },
  { id: 3,  title: "Sports Day",                   date: "Fri, 31 May 2024",  day: 31, month: 5, time: "07:30 AM", endTime: "04:00 PM", location: "School Field",      category: "Sports",         audience: "Whole School",      organizer: "Coach A. Gyasi",  description: "Annual inter-house sports competition. Events include 100m sprint, relay races, long jump, shot put, and football.",   color: "#16a34a", bg: "#dcfce7", emoji: "🏆" },
  { id: 4,  title: "Speech & Prize-Giving Day",    date: "Fri, 7 Jun 2024",   day: 7,  month: 6, time: "09:00 AM", endTime: "01:00 PM", location: "School Hall",       category: "Academic",       audience: "Whole School",      organizer: "Headteacher",     description: "Annual speech and prize-giving day. Best students across all subjects and classes will be recognized and awarded.",        color: "#2563eb", bg: "#dbeafe", emoji: "🎓" },
  { id: 5,  title: "School Open Day",              date: "Sat, 8 Jun 2024",   day: 8,  month: 6, time: "08:00 AM", endTime: "12:00 PM", location: "Whole School",      category: "Administrative", audience: "Prospective Parents", organizer: "Admin Office",  description: "Open day for prospective parents and students to tour the school, meet teachers, and learn about our programs.",       color: "#d97706", bg: "#fef3c7", emoji: "🏫" },
  { id: 6,  title: "Cultural Fiesta",              date: "Fri, 14 Jun 2024",  day: 14, month: 6, time: "09:00 AM", endTime: "03:00 PM", location: "School Grounds",    category: "Cultural",       audience: "Whole School",      organizer: "Cultural Club",   description: "Annual cultural fiesta celebrating Ghana's diverse cultures. Students present dances, songs, and traditional costumes.", color: "#b45309", bg: "#fef3c7", emoji: "🎭" },
  { id: 7,  title: "Third Term Begins",            date: "Mon, 17 Jun 2024",  day: 17, month: 6, time: "07:00 AM", endTime: "02:30 PM", location: "School",            category: "Academic",       audience: "All Students",      organizer: "Administration",  description: "Third term of the 2023/2024 academic year begins. All students are expected to be in school in proper uniform.",        color: "#2563eb", bg: "#dbeafe", emoji: "📚" },
  { id: 8,  title: "Independence Day Holiday",     date: "Fri, 6 Mar 2024",   day: 6,  month: 3, time: "All Day",  endTime: "All Day",  location: "School Closed",     category: "Holiday",        audience: "Whole School",      organizer: "Government",      description: "Ghana Independence Day public holiday. School is closed.",                                                               color: "#dc2626", bg: "#fee2e2", emoji: "🇬🇭" },
  { id: 9,  title: "End-of-Term Exams",           date: "Mon, 24 Jun 2024",  day: 24, month: 6, time: "08:00 AM", endTime: "02:00 PM", location: "All Classrooms",    category: "Academic",       audience: "All Students",      organizer: "Exam Office",     description: "End-of-term examinations for all classes. Timetable will be published one week before commencement.",                   color: "#2563eb", bg: "#dbeafe", emoji: "📋" },
  { id: 10, title: "Founder's Day",               date: "Sat, 29 Jun 2024",  day: 29, month: 6, time: "09:00 AM", endTime: "01:00 PM", location: "School Hall",       category: "Administrative", audience: "Whole School",      organizer: "Administration",  description: "Annual Founder's Day celebration. Special assembly with thanksgiving service and recognition of outstanding staff.",     color: "#7c3aed", bg: "#ede9fe", emoji: "🌟" },
];

const categoryColors: Record<EventCategory, { color: string; bg: string }> = {
  Academic:       { color: "#2563eb", bg: "#dbeafe" },
  Sports:         { color: "#16a34a", bg: "#dcfce7" },
  Cultural:       { color: "#b45309", bg: "#fef3c7" },
  Administrative: { color: "#d97706", bg: "#fef3c7" },
  Holiday:        { color: "#dc2626", bg: "#fee2e2" },
  PTA:            { color: "#7c3aed", bg: "#ede9fe" },
};

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fullMonthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function Events() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [viewMonth,    setViewMonth]    = useState(CURRENT_MONTH);
  const [viewYear,     setViewYear]     = useState(CURRENT_YEAR);
  const [selectedEvent,setSelectedEvent]= useState<SchoolEvent | null>(events.find(e => e.month === CURRENT_MONTH) || events[0]);
  const [catFilter,    setCatFilter]    = useState<string>("All");
  const [showPanel,    setShowPanel]    = useState(false);
  const [showForm,     setShowForm]     = useState(false);

  const daysInMonth  = getDaysInMonth(viewMonth, viewYear);
  const firstDay     = getFirstDayOfMonth(viewMonth, viewYear);
  const monthEvents  = events.filter(e => e.month === viewMonth);
  const filteredList = events.filter(e => catFilter === "All" || e.category === catFilter);

  const prevMonth = () => { if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 12) { setViewMonth(1);  setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const getEventsForDay = (day: number) => monthEvents.filter(e => e.day === day);

  const EventPanel = ({ event }: { event: SchoolEvent }) => {
    const cc = categoryColors[event.category];
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Event Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast("Editing event...", "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Hero banner */}
          <div style={{ background: `linear-gradient(135deg, ${event.color}15, ${event.color}25)`, borderRadius: 12, padding: "20px", textAlign: "center", border: `1px solid ${event.color}20` }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{event.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{event.title}</div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: cc.bg, color: cc.color }}>{event.category}</span>
            </div>
          </div>

          {/* Date & time card */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: event.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={16} color={event.color} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>DATE</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{event.date.split(",")[1]?.trim().slice(0, -5) || event.date}</div>
              </div>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={16} color="#2563eb" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>TIME</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{event.time}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>until {event.endTime}</div>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>EVENT INFO</div>
            {[
              ["Location",  event.location, <MapPin size={12} color="#d97706" />],
              ["Audience",  event.audience, <Users size={12} color="#7c3aed" />],
              ["Organizer", event.organizer, <Users size={12} color="#6b7280" />],
            ].map(([k, v, icon]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{icon}<span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span></div>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>DESCRIPTION</div>
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "12px", fontSize: 12.5, color: "#374151", lineHeight: 1.7 }}>{event.description}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Announcement sent for "${event.title}"`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📢 Send Announcement
            </button>
            <button onClick={() => { showToast("Event added to school calendar", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📅 Add to Calendar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Events & Calendar</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Communication", "Events"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Add Event"}
        </button>
      </div>

      {/* Category filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["All", ...Object.keys(categoryColors)].map((cat) => {
          const cc = cat !== "All" ? categoryColors[cat as EventCategory] : { color: "#7c3aed", bg: "#ede9fe" };
          const isActive = catFilter === cat;
          return (
            <button key={cat} onClick={() => setCatFilter(cat)}
              style={{ padding: "6px 12px", border: `1px solid ${isActive ? cc.color : "#e5e7eb"}`, borderRadius: 20, background: isActive ? cc.bg : "white", color: isActive ? cc.color : "#6b7280", fontSize: 12, fontWeight: isActive ? 700 : 400, cursor: "pointer", transition: "all 0.1s" }}>
              {cat}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row" }}>
        {/* Left: Calendar + list */}
        <div style={{ flex: isMobile ? undefined : "0 0 auto", width: isMobile ? "100%" : 360, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Calendar widget */}
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
            {/* Month nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
              <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex" }}><ChevronLeft size={16} /></button>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{fullMonthNames[viewMonth - 1]} {viewYear}</span>
              <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex" }}><ChevronRight size={16} /></button>
            </div>
            <div style={{ padding: "10px 12px" }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                {dayNames.map((d) => (
                  <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", padding: "4px 0" }}>{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === 15 && viewMonth === CURRENT_MONTH && viewYear === CURRENT_YEAR;
                  const hasEvent = dayEvents.length > 0;
                  return (
                    <div key={day}
                      onClick={() => { if (hasEvent) { setSelectedEvent(dayEvents[0]); if (isMobile) setShowPanel(true); } }}
                      style={{ position: "relative", aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 8, background: isToday ? "#7c3aed" : hasEvent ? dayEvents[0].bg : "transparent", cursor: hasEvent ? "pointer" : "default", border: isToday ? "none" : hasEvent ? `1px solid ${dayEvents[0].color}30` : "1px solid transparent", transition: "all 0.1s" }}
                      onMouseEnter={(e) => { if (!isToday && hasEvent) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    >
                      <span style={{ fontSize: 11.5, fontWeight: isToday || hasEvent ? 700 : 400, color: isToday ? "white" : hasEvent ? dayEvents[0].color : "#374151" }}>{day}</span>
                      {hasEvent && dayEvents.length > 1 && (
                        <div style={{ position: "absolute", bottom: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: dayEvents[1].color, fontSize: 0 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming events list */}
          {(!isMobile || !showPanel) && (
            <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>All Events</span>
              </div>
              <div style={{ overflowY: "auto", maxHeight: 380 }}>
                {filteredList.map((event, i) => {
                  const cc = categoryColors[event.category];
                  const isActive = selectedEvent?.id === event.id;
                  return (
                    <div key={event.id}
                      onClick={() => { setSelectedEvent(event); if (isMobile) setShowPanel(true); }}
                      style={{ display: "flex", gap: 12, padding: "11px 14px", borderBottom: i < filteredList.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 9, background: event.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{event.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.title}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{event.date.split(",")[1]?.trim() || event.date} · {event.time}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: cc.bg, color: cc.color, flexShrink: 0, alignSelf: "flex-start" }}>{event.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Event detail */}
        {selectedEvent && (!isMobile || showPanel) && (
          <EventPanel event={selectedEvent} />
        )}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && selectedEvent && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <EventPanel event={selectedEvent} />
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Add New Event</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Event Title", "text", "e.g. Annual Science Fair"], ["Location", "text", "e.g. School Hall"]].map(([label, type, placeholder]) => (
                <div key={label as string}>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                  <input type={type as string} placeholder={placeholder as string} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Date", "date"], ["Category", "select"]].map(([label, type]) => (
                  <div key={label as string}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                    {type === "select" ? (
                      <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                        {Object.keys(categoryColors).map((c) => <option key={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input type="date" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Start Time", "time"], ["End Time", "time"]].map(([label, type]) => (
                  <div key={label as string}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>
                    <input type="time" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Description</label>
                <textarea rows={3} placeholder="Describe the event..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => { showToast("Event added to school calendar!", "success"); setShowForm(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
