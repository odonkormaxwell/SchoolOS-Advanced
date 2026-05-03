import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CalEvent {
  day: number;
  month: number;
  year: number;
  title: string;
  time: string;
  color: string;
  page: string;
}

const allEvents: CalEvent[] = [
  { day: 18, month: 4, year: 2024, title: "PTA Meeting",         time: "10:00 AM – 12:00 PM", color: "#7c3aed", page: "communication-hub" },
  { day: 20, month: 4, year: 2024, title: "Bus Routes Update",   time: "All Day Event",        color: "#d97706", page: "transport" },
  { day: 27, month: 4, year: 2024, title: "Mid-Term Exams Begin",time: "All Day Event",        color: "#e11d48", page: "gradebook" },
  { day: 1,  month: 5, year: 2024, title: "End of Term Sports",  time: "2:00 PM – 5:00 PM",   color: "#16a34a", page: "all-students" },
  { day: 15, month: 5, year: 2024, title: "Awards Ceremony",     time: "10:00 AM – 1:00 PM",  color: "#2563eb", page: "gradebook" },
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function EventsCalendar() {
  const { onNavigate } = useApp();
  // Start at May 2024
  const [viewYear, setViewYear] = useState(2024);
  const [viewMonth, setViewMonth] = useState(4); // 0-indexed: May=4
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const eventsThisMonth = allEvents.filter((e) => e.month === viewMonth && e.year === viewYear);
  const eventDays = new Set(eventsThisMonth.map((e) => e.day));

  const isToday = (day: number) => day === 15 && viewMonth === 4 && viewYear === 2024;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const selectedEvents = selectedDay ? eventsThisMonth.filter((e) => e.day === selectedDay) : [];
  const upcomingEvents = eventsThisMonth
    .filter((e) => !selectedDay || !selectedEvents.includes(e))
    .slice(0, selectedDay && selectedEvents.length > 0 ? 1 : 3);

  // Build calendar cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={14} color="#6b7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Events Calendar</span>
        </div>
        <button onClick={() => onNavigate("events")} style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          View All →
        </button>
      </div>

      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 4, borderRadius: 6 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
        >
          <ChevronLeft size={15} />
        </button>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 4, borderRadius: 6 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 9.5, fontWeight: 700, color: "#9ca3af", padding: "2px 0", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const hasEvent = eventDays.has(day);
          const isSel = selectedDay === day;
          const tod = isToday(day);
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(isSel ? null : day)}
              style={{
                aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 2, borderRadius: 6, cursor: "pointer",
                background: isSel ? "#7c3aed" : tod ? "#ede9fe" : "transparent",
                border: tod && !isSel ? "1px solid #c4b5fd" : "1px solid transparent",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { if (!isSel) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isSel ? "#7c3aed" : tod ? "#ede9fe" : "transparent"; }}
            >
              <span style={{ fontSize: 11, fontWeight: tod || isSel ? 700 : 400, color: isSel ? "white" : tod ? "#7c3aed" : "#374151", lineHeight: 1 }}>{day}</span>
              {hasEvent && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? "rgba(255,255,255,0.8)" : "#7c3aed" }} />}
            </div>
          );
        })}
      </div>

      {/* Event details / upcoming */}
      <div style={{ marginTop: 12, borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
        {selectedEvents.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {MONTH_NAMES[viewMonth]} {selectedDay}
            </div>
            {selectedEvents.map((e, i) => (
              <div
                key={i}
                onClick={() => onNavigate(e.page)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 7, cursor: "pointer", background: "#f9fafb", marginBottom: 4 }}
                onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{e.title}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {selectedEvents.length > 0 ? "Other Events" : "Upcoming"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {upcomingEvents.map((e, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate(e.page)}
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "4px 0" }}
                >
                  <div style={{ width: 36, height: 38, borderRadius: 8, background: "#f9fafb", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{e.day}</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em" }}>{MONTH_NAMES[e.month].slice(0, 3).toUpperCase()}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.color }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{e.title}</div>
                    </div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {eventsThisMonth.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, padding: "8px 0" }}>No events this month</div>
        )}
      </div>
    </div>
  );
}
