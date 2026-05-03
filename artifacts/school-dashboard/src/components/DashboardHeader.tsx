import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDate(date: Date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return `${days[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function getHour() {
  return new Date().getHours();
}

function getGreeting() {
  const h = getHour();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 4, 15));
  const [calOpen, setCalOpen] = useState(false);
  const [viewYear, setViewYear] = useState(2024);
  const [viewMonth, setViewMonth] = useState(4);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setCalOpen(false);
    };
    if (calOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calOpen]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const selectDay = (day: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setCalOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isSel = (day: number) =>
    day === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>
          {getGreeting()}, Mr. Mensah 👋
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0", lineHeight: 1.5 }}>
          Here's what's happening in your school today.
        </p>
      </div>

      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setCalOpen((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
            border: calOpen ? "1px solid #c4b5fd" : "1px solid #e5e7eb",
            borderRadius: 8, background: calOpen ? "#f5f3ff" : "white",
            cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            transition: "all 0.15s",
          }}
        >
          <CalendarDays size={14} color={calOpen ? "#7c3aed" : "#6b7280"} />
          <span style={{ fontSize: 12.5, color: calOpen ? "#7c3aed" : "#374151", fontWeight: 500 }}>
            {formatDate(selectedDate)}
          </span>
          <ChevronDown size={13} color={calOpen ? "#7c3aed" : "#9ca3af"} style={{ transform: calOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>

        {calOpen && (
          <div style={{
            position: "absolute", top: 42, right: 0, width: 260, background: "white",
            borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #e5e7eb",
            zIndex: 100, padding: 14, animation: "fadeIn 0.15s ease",
          }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 4, borderRadius: 6 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
              >
                <ChevronLeft size={15} />
              </button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
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
              {DAY_NAMES.map((d) => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#9ca3af", padding: "2px 0" }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const sel = isSel(day);
                return (
                  <div
                    key={day}
                    onClick={() => selectDay(day)}
                    style={{
                      aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 6, cursor: "pointer", fontSize: 12,
                      fontWeight: sel ? 700 : 400,
                      background: sel ? "#7c3aed" : "transparent",
                      color: sel ? "white" : "#374151",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = sel ? "#7c3aed" : "transparent"; }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 10, borderTop: "1px solid #f3f4f6", paddingTop: 8, display: "flex", gap: 6 }}>
              <button
                onClick={() => { setSelectedDate(new Date(2024, 4, 15)); setViewMonth(4); setViewYear(2024); setCalOpen(false); }}
                style={{ flex: 1, padding: "6px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 11.5, color: "#6b7280", cursor: "pointer", fontWeight: 500 }}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
