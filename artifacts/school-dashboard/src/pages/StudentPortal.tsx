import { useState } from "react";
import { LayoutDashboard, User, Clock, CalendarCheck, FileText, BookOpen,
  PenLine, Megaphone, Bell, UserCog, LogOut, Shield, Download,
  Printer, Menu, X, Eye, ChevronRight, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";

// ─── Demo Data ────────────────────────────────────────────────────────────────
const STUDENT = {
  name: "Michael Ofori", initials: "MO", studentId: "HKBS-2024-0076",
  class: "P5 - Ruby", classTeacher: "Mme. A. Boakye", academicYear: "2025/2026",
  term: "Term 2", dob: "14 March 2014", gender: "Male", house: "Red House",
  avatarBg: "#fdf4ff", avatarColor: "#9333ea",
  avg: 74.3, grade: "B+", attendance: 92, position: 8, totalStudents: 44,
};

const RESULTS = [
  { subject: "Mathematics",        ca: 38, exam: 36, total: 74, grade: "B+", remark: "Very Good",  published: true },
  { subject: "English Language",   ca: 40, exam: 35, total: 75, grade: "B+", remark: "Very Good",  published: true },
  { subject: "Integrated Science", ca: 35, exam: 33, total: 68, grade: "B",  remark: "Good",       published: true },
  { subject: "Social Studies",     ca: 37, exam: 35, total: 72, grade: "B+", remark: "Very Good",  published: true },
  { subject: "ICT",                ca: 42, exam: 39, total: 81, grade: "A",  remark: "Excellent",  published: true },
  { subject: "RME",                ca: 38, exam: 38, total: 76, grade: "B+", remark: "Very Good",  published: true },
  { subject: "Creative Arts",      ca: 43, exam: 40, total: 83, grade: "A",  remark: "Excellent",  published: true },
  { subject: "Ghanaian Language",  ca: 33, exam: 32, total: 65, grade: "B",  remark: "Good",       published: false },
  { subject: "Physical Education", ca: 44, exam: 43, total: 87, grade: "A",  remark: "Excellent",  published: true },
];

const TIMETABLE: { period: string; mon: string; tue: string; wed: string; thu: string; fri: string }[] = [
  { period: "7:30 – 8:00",   mon: "🏫 Assembly",        tue: "Mathematics",       wed: "English Language",  thu: "Assembly",          fri: "Mathematics"    },
  { period: "8:00 – 8:40",   mon: "Mathematics",        tue: "English Language",  wed: "Integrated Science",thu: "Social Studies",    fri: "English Language"},
  { period: "8:40 – 9:20",   mon: "English Language",   tue: "Integrated Science",wed: "Social Studies",    thu: "ICT",               fri: "Integrated Sci." },
  { period: "9:20 – 10:00",  mon: "Integrated Science", tue: "Social Studies",    wed: "ICT",               thu: "RME",               fri: "Social Studies" },
  { period: "10:00 – 10:20", mon: "☕ Break",            tue: "☕ Break",           wed: "☕ Break",           thu: "☕ Break",           fri: "☕ Break"        },
  { period: "10:20 – 11:00", mon: "Social Studies",     tue: "ICT",               wed: "RME",               thu: "Creative Arts",     fri: "ICT"            },
  { period: "11:00 – 11:40", mon: "ICT",                tue: "RME",               wed: "Ghanaian Language", thu: "Physical Education",fri: "Creative Arts"  },
  { period: "11:40 – 12:20", mon: "Ghanaian Language",  tue: "Physical Education",wed: "Mathematics",       thu: "Ghanaian Language", fri: "Physical Educ." },
  { period: "12:20 – 1:00",  mon: "🍽️ Lunch",           tue: "🍽️ Lunch",          wed: "🍽️ Lunch",          thu: "🍽️ Lunch",          fri: "🍽️ Lunch"       },
  { period: "1:00 – 1:40",   mon: "RME",                tue: "Ghanaian Language", wed: "Creative Arts",     thu: "Mathematics",       fri: "RME"            },
  { period: "1:40 – 2:20",   mon: "Creative Arts",      tue: "Creative Arts",     wed: "Physical Education",thu: "English Language",  fri: "Ghanaian Lang." },
  { period: "2:20 – 3:00",   mon: "Physical Education", tue: "Mathematics",       wed: "Ghanaian Language", thu: "Creative Arts",     fri: "Assembly"       },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "End of Term Examinations — 15th June", body: "Examinations begin Monday 15th June. All students must arrive by 7:00 AM with their stationery.", date: "30 May 2026", type: "Academic", read: false },
  { id: 2, title: "Sports Day — Saturday 21st June",     body: "Annual Sports Day is on 21st June. Wear your house colours (Red House). Report at 7:30 AM.", date: "25 May 2026", type: "Event",    read: false },
  { id: 3, title: "Term 2 Results Published",            body: "Most results for P5 Ruby have been published. Log in to view your scores.", date: "18 May 2026", type: "Academic", read: true  },
  { id: 4, title: "Library Books Return",                body: "All library books borrowed this term must be returned by 10th June 2026.", date: "15 May 2026", type: "General",  read: true  },
];

const NOTIFICATIONS = [
  { id: 1, icon: "📊", text: "Your Term 2 ICT result has been published — you scored 81% (A). Excellent!", time: "2 days ago",  read: false },
  { id: 2, icon: "📢", text: "New school announcement: End of Term Examinations schedule posted.", time: "5 days ago",  read: false },
  { id: 3, icon: "📅", text: "Attendance reminder: Please ensure you arrive on time each day.", time: "1 week ago",  read: true  },
  { id: 4, icon: "🏆", text: "Congratulations! You are ranked 8th out of 44 in P5 Ruby this term.", time: "2 weeks ago", read: true  },
];

function gradeStyle(g: string) {
  if (g === "A")  return { color: "#16a34a", bg: "#dcfce7" };
  if (g === "B+") return { color: "#2563eb", bg: "#dbeafe" };
  if (g === "B")  return { color: "#0891b2", bg: "#cffafe" };
  return               { color: "#d97706", bg: "#fef3c7" };
}

const NAV = [
  { id: "dashboard",    label: "Dashboard",     icon: <LayoutDashboard size={16} />, badge: 0 },
  { id: "profile",      label: "My Profile",    icon: <User size={16} />,            badge: 0 },
  { id: "timetable",    label: "Timetable",     icon: <Clock size={16} />,           badge: 0 },
  { id: "attendance",   label: "Attendance",    icon: <CalendarCheck size={16} />,   badge: 0 },
  { id: "results",      label: "Results",       icon: <FileText size={16} />,        badge: 0 },
  { id: "report-cards", label: "Report Cards",  icon: <BookOpen size={16} />,        badge: 0 },
  { id: "assignments",  label: "Assignments",   icon: <PenLine size={16} />,         badge: 0 },
  { id: "announcements",label: "Announcements", icon: <Megaphone size={16} />,       badge: 2 },
  { id: "notifications",label: "Notifications", icon: <Bell size={16} />,            badge: 2 },
  { id: "account",      label: "My Account",    icon: <UserCog size={16} />,         badge: 0 },
];

// ─── Sections ─────────────────────────────────────────────────────────────────
function DashboardSection() {
  const publishedResults = RESULTS.filter((r) => r.published);
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Welcome back, Michael! 👋</h2>
      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>Happy Kids Basic School · {STUDENT.class} · {STUDENT.term}, {STUDENT.academicYear}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Term Average",  value: `${STUDENT.avg}%`,    sub: "Grade " + STUDENT.grade,           color: "#7c3aed", icon: "📊" },
          { label: "Attendance",    value: `${STUDENT.attendance}%`, sub: "92% present this term",       color: "#16a34a", icon: "✅" },
          { label: "Class Position",value: `${STUDENT.position}/${STUDENT.totalStudents}`, sub: "P5 Ruby ranking", color: "#d97706", icon: "🏆" },
          { label: "Subjects",      value: `${publishedResults.length}/${RESULTS.length}`, sub: "results published", color: "#2563eb", icon: "📚" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Recent Results</div>
          {publishedResults.slice(0, 5).map((r) => {
            const gs = gradeStyle(r.grade);
            return (
              <div key={r.subject} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{r.subject}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>CA {r.ca} + Exam {r.exam}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ height: 6, width: 60, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${r.total}%`, background: gs.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: gs.color, minWidth: 30 }}>{r.total}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: gs.bg, color: gs.color }}>{r.grade}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Upcoming Events</div>
          {[
            { date: "15 Jun", event: "End of Term Exams Begin",    type: "Academic", icon: "📝" },
            { date: "21 Jun", event: "Sports Day",                  type: "Event",    icon: "⚽" },
            { date: "30 Jun", event: "Term 2 Ends",                 type: "Academic", icon: "🏫" },
            { date: "1 Jul",  event: "Long Vacation Begins",        type: "Vacation", icon: "🌴" },
          ].map((e) => (
            <div key={e.event} style={{ display: "flex", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f9fafb" }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{e.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{e.event}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{e.date}, 2026</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>My Profile</h2>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12.5, color: "#1e40af", display: "flex", gap: 7 }}>
        <Shield size={14} style={{ flexShrink: 0, marginTop: 1 }} /> Academic records are read-only. Contact your class teacher or admin to update personal information.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "24px 20px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: STUDENT.avatarBg, color: STUDENT.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26, margin: "0 auto 14px" }}>{STUDENT.initials}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{STUDENT.name}</div>
          <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 10 }}>{STUDENT.studentId}</div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>{STUDENT.class}</span>
          <div style={{ marginTop: 16, padding: "12px", background: "#f9fafb", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Current Term Average</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: gradeStyle(STUDENT.grade).color }}>{STUDENT.avg}%</div>
            <span style={{ fontSize: 13, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: gradeStyle(STUDENT.grade).bg, color: gradeStyle(STUDENT.grade).color }}>{STUDENT.grade} · {STUDENT.grade === "B+" ? "Very Good" : "Good"}</span>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Student Information <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8, background: "#f3f4f6", color: "#9ca3af", marginLeft: 6 }}>Read-only</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { label: "Full Name",     value: STUDENT.name },
              { label: "Student ID",    value: STUDENT.studentId },
              { label: "Class",         value: STUDENT.class },
              { label: "Class Teacher", value: STUDENT.classTeacher },
              { label: "Academic Year", value: STUDENT.academicYear },
              { label: "Current Term",  value: STUDENT.term },
              { label: "Date of Birth", value: STUDENT.dob },
              { label: "Gender",        value: STUDENT.gender },
              { label: "House",         value: STUDENT.house },
              { label: "School",        value: "Happy Kids Basic School" },
            ].map((f) => (
              <div key={f.label}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimetableSection() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayKeys: (keyof (typeof TIMETABLE)[0])[] = ["mon", "tue", "wed", "thu", "fri"];
  const subjectColors: Record<string, string> = {
    Mathematics: "#ede9fe", "English Language": "#dbeafe", "Integrated Science": "#dcfce7",
    "Social Studies": "#fef3c7", ICT: "#cffafe", RME: "#d1fae5",
    "Creative Arts": "#fce7f3", "Ghanaian Language": "#ffedd5", "Physical Education": "#dcfce7",
  };
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Weekly Timetable</h2>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>{STUDENT.class} · {STUDENT.classTeacher} · Term 2, 2025/2026</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
          <thead>
            <tr style={{ background: "#2563eb" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 11, width: 100 }}>Period</th>
              {days.map((d) => (
                <th key={d} style={{ padding: "10px 12px", textAlign: "center", color: "white", fontWeight: 700, fontSize: 12 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE.map((row, i) => {
              const isBreak = row.mon.includes("Break") || row.mon.includes("Lunch");
              return (
                <tr key={i} style={{ background: isBreak ? "#f3f4f6" : i % 2 === 0 ? "white" : "#fafafa", borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 12px", fontSize: 11, color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{row.period}</td>
                  {dayKeys.map((dk) => {
                    const cell = row[dk] as string;
                    const color = Object.keys(subjectColors).find((k) => cell.includes(k)) ?? "";
                    const bg = color ? subjectColors[color] : "transparent";
                    return (
                      <td key={dk} style={{ padding: "8px 10px", textAlign: "center", fontSize: 11.5, fontWeight: isBreak ? 500 : 600, color: isBreak ? "#9ca3af" : "#374151" }}>
                        {!isBreak && color ? (
                          <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 6, background: bg, fontSize: 11 }}>{cell}</span>
                        ) : cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceSection() {
  const present = 40, absent = 2, late = 2, total = 44;
  const pct = Math.round((present / total) * 100);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>My Attendance</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Present Days",  value: present,    color: "#16a34a", icon: "✅" },
          { label: "Absent Days",   value: absent,     color: "#dc2626", icon: "❌" },
          { label: "Late Arrivals", value: late,       color: "#d97706", icon: "⏰" },
          { label: "Attendance %",  value: `${pct}%`,  color: pct >= 90 ? "#16a34a" : "#d97706", icon: "📊" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "14px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Term 2 Attendance Rate · {STUDENT.class}</div>
        <div style={{ height: 12, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#16a34a", borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
          <span>{pct}% rate — {present} of {total} school days attended</span>
          <span style={{ color: "#16a34a", fontWeight: 700 }}>Excellent</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 12.5, color: "#6b7280" }}>
          💡 Keep up the great attendance! A minimum of 90% is required for end-of-term examinations.
        </div>
      </div>
    </div>
  );
}

function ResultsSection() {
  const published = RESULTS.filter((r) => r.published);
  const unpublished = RESULTS.filter((r) => !r.published);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>My Results</h2>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#1e40af", display: "flex", gap: 7 }}>
        <Eye size={13} style={{ flexShrink: 0, marginTop: 1 }} /> Only <strong>published</strong> results are shown. {unpublished.length > 0 && `${unpublished.length} subject${unpublished.length > 1 ? "s" : ""} pending publication.`}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{STUDENT.class} · {STUDENT.term}, {STUDENT.academicYear} · {published.length} subjects</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"1px solid #e5e7eb",borderRadius:8,background:"white",fontSize:12,cursor:"pointer",color:"#374151" }}><Printer size={12}/> Print</button>
          <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"none",borderRadius:8,background:"#2563eb",color:"white",fontSize:12,fontWeight:700,cursor:"pointer" }}><Download size={12}/> Download PDF</button>
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "#2563eb" }}>
              {["Subject","CA (/50)","Exam (/50)","Total (/100)","Grade","Remark"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {published.map((r, i) => {
              const gs = gradeStyle(r.grade);
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111827" }}>{r.subject}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{r.ca}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>{r.exam}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: gs.color, fontSize: 14 }}>{r.total}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: gs.bg, color: gs.color }}>{r.grade}</span>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280", fontStyle: "italic" }}>{r.remark}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f1f5f9", borderTop: "2px solid #e5e7eb" }}>
              <td style={{ padding: "10px 14px", fontWeight: 700, color: "#374151" }}>Overall</td>
              <td colSpan={2} />
              <td style={{ padding: "10px 14px", fontWeight: 800, fontSize: 16, color: gradeStyle(STUDENT.grade).color }}>{STUDENT.avg}</td>
              <td><span style={{ fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: gradeStyle(STUDENT.grade).bg, color: gradeStyle(STUDENT.grade).color }}>{STUDENT.grade}</span></td>
              <td style={{ padding: "10px 14px", fontWeight: 600, color: "#374151" }}>Position {STUDENT.position}/{STUDENT.totalStudents}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function AnnouncementsSection() {
  const [items, setItems] = useState(ANNOUNCEMENTS);
  const tc = (t: string) => t === "Academic" ? { color: "#2563eb", bg: "#dbeafe" } : t === "Event" ? { color: "#7c3aed", bg: "#ede9fe" } : { color: "#6b7280", bg: "#f3f4f6" };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Announcements</h2>
        <button onClick={() => setItems((p) => p.map((a) => ({ ...a, read: true })))} style={{ padding:"7px 13px",border:"1px solid #e5e7eb",borderRadius:8,background:"white",fontSize:12,cursor:"pointer",color:"#374151" }}>Mark all read</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((a) => {
          const c = tc(a.type);
          return (
            <div key={a.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "14px 16px", borderLeft: `3px solid ${a.read ? "#e5e7eb" : "#2563eb"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                {!a.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 4 }} />}
                <span style={{ fontSize: 13.5, fontWeight: a.read ? 600 : 800, color: "#111827", flex: 1 }}>{a.title}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: c.bg, color: c.color, flexShrink: 0 }}>{a.type}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 6px", lineHeight: 1.5 }}>{a.body}</p>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{a.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssignmentsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>📝</div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Assignments</h3>
      <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 360, lineHeight: 1.6, margin: "0 0 20px" }}>
        The Assignments module is coming soon. Your teachers will post homework, classwork, and project briefs here.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {["📚 Homework Tracker","📋 Project Briefs","⏰ Deadlines","📤 Submission"].map((f) => (
          <span key={f} style={{ fontSize: 12.5, padding: "7px 14px", borderRadius: 20, background: "#f3f4f6", color: "#6b7280", fontWeight: 500 }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

function AccountSection({ user }: { user: { name: string; email: string; initials: string; avatarBg: string; avatarColor: string } }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>My Account</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Account Details</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: user.avatarBg, color: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>{user.initials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{user.name}</div>
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#dbeafe", color: "#1d4ed8" }}>Student Portal</span>
            </div>
          </div>
          {[{ label: "Full Name", value: user.name }, { label: "Email", value: user.email }, { label: "Student ID", value: STUDENT.studentId }, { label: "Class", value: STUDENT.class }].map((f) => (
            <div key={f.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{f.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Security Settings</div>
          {[
            { label: "Change Password", icon: <Shield size={14} />, note: "Keep your account secure" },
            { label: "Enable Two-Factor Authentication", icon: <CheckCircle size={14} />, note: "Extra layer of protection" },
            { label: "Update Profile Photo", icon: <User size={14} />, note: "Change your display picture" },
          ].map((a) => (
            <button key={a.label} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", border: "1px solid #e5e7eb", borderRadius: 9, background: "#f9fafb", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500, marginBottom: 8, textAlign: "left" }}>
              <span style={{ color: "#6b7280" }}>{a.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.note}</div>
              </div>
              <ChevronRight size={13} color="#d1d5db" style={{ marginLeft: "auto" }} />
            </button>
          ))}
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#fef3c7", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
            ⚠️ You cannot edit academic records, grades, or attendance from the Student Portal.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
export default function StudentPortal() {
  const { user, logout } = useAuth();
  const { isMobile } = useWindowSize();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadNotifs = NOTIFICATIONS.filter((n) => !n.read).length;
  const unreadAnn    = ANNOUNCEMENTS.filter((a) => !a.read).length;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":    return <DashboardSection />;
      case "profile":      return <ProfileSection />;
      case "timetable":    return <TimetableSection />;
      case "attendance":   return <AttendanceSection />;
      case "results":      return <ResultsSection />;
      case "report-cards": return (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Report Cards</h2>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: STUDENT.avatarBg, color: STUDENT.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{STUDENT.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{STUDENT.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{STUDENT.class} · {STUDENT.term}, {STUDENT.academicYear} · Avg {STUDENT.avg}% ({STUDENT.grade})</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"1px solid #e5e7eb",borderRadius:8,background:"white",fontSize:12,cursor:"pointer",color:"#374151" }}><Printer size={12}/> Print</button>
              <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"none",borderRadius:8,background:"#2563eb",color:"white",fontSize:12,fontWeight:700,cursor:"pointer" }}><Download size={12}/> Download PDF</button>
            </div>
          </div>
        </div>
      );
      case "assignments":   return <AssignmentsSection />;
      case "announcements": return <AnnouncementsSection />;
      case "notifications": return (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Notifications</h2>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            {NOTIFICATIONS.map((n, i) => (
              <div key={n.id} style={{ padding: "14px 16px", borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid #f3f4f6" : "none", display: "flex", gap: 12, background: n.read ? "white" : "#eff6ff" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: n.read ? "#f3f4f6" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                <div>
                  <div style={{ fontSize: 13, color: n.read ? "#6b7280" : "#111827", fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 5 }} />}
              </div>
            ))}
          </div>
        </div>
      );
      case "account": return <AccountSection user={user!} />;
      default:        return <DashboardSection />;
    }
  };

  const Sidebar = () => (
    <div style={{ width: 240, background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>🏫</span>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: "#111827" }}>Happy Kids</div>
            <div style={{ fontSize: 10.5, color: "#9ca3af" }}>Basic School</div>
          </div>
        </div>
        <div style={{ background: "#eff6ff", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: STUDENT.avatarBg, color: STUDENT.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{STUDENT.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{STUDENT.name}</div>
            <div style={{ fontSize: 10.5, color: "#2563eb", fontWeight: 600 }}>Student · {STUDENT.class}</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {NAV.map((item) => {
          const active = activePage === item.id;
          const badge = item.id === "notifications" ? unreadNotifs : item.id === "announcements" ? unreadAnn : item.badge;
          return (
            <button key={item.id} onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",border:"none",borderRadius:9,background:active?"#dbeafe":"transparent",color:active?"#1d4ed8":"#374151",fontWeight:active?700:500,fontSize:13,cursor:"pointer",marginBottom:2,textAlign:"left" }}>
              <span style={{ color: active ? "#2563eb" : "#9ca3af" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge > 0 && <span style={{ fontSize:10,fontWeight:800,padding:"1px 6px",borderRadius:10,background:active?"#2563eb":"#dc2626",color:"white" }}>{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid #f3f4f6" }}>
        <button onClick={() => logout()} style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",border:"none",borderRadius:9,background:"transparent",color:"#dc2626",fontWeight:600,fontSize:13,cursor:"pointer" }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fa", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`* { box-sizing: border-box; } body { margin: 0; padding: 0; } input,select,button { font-family: inherit; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }`}</style>

      {!isMobile && <Sidebar />}
      {isMobile && sidebarOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }} onClick={() => setSidebarOpen(false)} />
          <Sidebar />
        </>
      )}

      <div style={{ marginLeft: isMobile ? 0 : 240, flex: 1, minWidth: 0 }}>
        {isMobile && (
          <div style={{ position: "sticky", top: 0, zIndex: 50, background: "white", borderBottom: "1px solid #e5e7eb", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2563eb" }}>Student Portal</div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151" }}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        )}
        <main style={{ padding: isMobile ? "16px 12px 30px" : "24px 28px 40px", maxWidth: 1100, margin: "0 auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
