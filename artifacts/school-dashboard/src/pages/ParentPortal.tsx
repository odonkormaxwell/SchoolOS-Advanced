import { useState } from "react";
import { LayoutDashboard, Users, CalendarCheck, FileText, BookOpen, CreditCard,
  Megaphone, Bell, UserCog, LogOut, ChevronRight, AlertCircle, Download,
  Printer, CheckCircle, Menu, X, Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";

// ─── Demo Data ────────────────────────────────────────────────────────────────
const CHILDREN = [
  {
    id: 1, name: "Kwame Ofori", initials: "KO", gender: "M",
    studentId: "HKBS-2023-0087", class: "JHS 2", avatarBg: "#dbeafe", avatarColor: "#1e3a8a",
    avg: 76.3, grade: "B+", attendancePct: 88, position: 7, totalStudents: 52,
    outstanding: 1950, status: "Active",
    results: [
      { subject: "Mathematics",        ca: 38, exam: 39, total: 77, grade: "B+", remark: "Very Good"     },
      { subject: "English Language",   ca: 42, exam: 40, total: 82, grade: "A",  remark: "Excellent"     },
      { subject: "Integrated Science", ca: 35, exam: 35, total: 70, grade: "B+", remark: "Very Good"     },
      { subject: "Social Studies",     ca: 38, exam: 38, total: 76, grade: "B+", remark: "Very Good"     },
      { subject: "ICT",                ca: 41, exam: 42, total: 83, grade: "A",  remark: "Excellent"     },
      { subject: "French",             ca: 32, exam: 29, total: 61, grade: "B",  remark: "Good"          },
      { subject: "RME",                ca: 40, exam: 38, total: 78, grade: "B+", remark: "Very Good"     },
      { subject: "Ghanaian Language",  ca: 36, exam: 35, total: 71, grade: "B+", remark: "Very Good"     },
      { subject: "Physical Education", ca: 45, exam: 44, total: 89, grade: "A",  remark: "Excellent"     },
    ],
    invoices: [
      { id: "INV-2026-0234", category: "Tuition Fee",  amount: 1800, paid: 0,    status: "Pending", due: "15 Jun 2026" },
      { id: "INV-2026-0235", category: "Transport Levy",amount: 350,  paid: 350,  status: "Paid",    due: "1 May 2026"  },
      { id: "INV-2026-0236", category: "PTA Levy",     amount: 150,  paid: 0,    status: "Pending", due: "30 Jun 2026" },
    ],
    payments: [
      { date: "28 Apr 2026", amount: 350, method: "Mobile Money", ref: "PAY-2026-0112", desc: "Transport Levy" },
    ],
    attendance: { present: 38, absent: 4, late: 2, total: 44 },
  },
  {
    id: 2, name: "Akosua Ofori", initials: "AO", gender: "F",
    studentId: "HKBS-2024-0045", class: "P4 - Emerald", avatarBg: "#fce7f3", avatarColor: "#9d174d",
    avg: 75.4, grade: "B+", attendancePct: 91, position: 9, totalStudents: 42,
    outstanding: 0, status: "Active",
    results: [
      { subject: "Mathematics",        ca: 36, exam: 36, total: 72, grade: "B+", remark: "Very Good"     },
      { subject: "English Language",   ca: 38, exam: 40, total: 78, grade: "B+", remark: "Very Good"     },
      { subject: "Integrated Science", ca: 30, exam: 36, total: 66, grade: "B",  remark: "Good"          },
      { subject: "Social Studies",     ca: 35, exam: 37, total: 72, grade: "B+", remark: "Very Good"     },
      { subject: "ICT",                ca: 40, exam: 38, total: 78, grade: "B+", remark: "Very Good"     },
      { subject: "RME",                ca: 38, exam: 40, total: 78, grade: "B+", remark: "Very Good"     },
      { subject: "Creative Arts",      ca: 42, exam: 40, total: 82, grade: "A",  remark: "Excellent"     },
      { subject: "Ghanaian Language",  ca: 34, exam: 32, total: 66, grade: "B",  remark: "Good"          },
      { subject: "Physical Education", ca: 44, exam: 43, total: 87, grade: "A",  remark: "Excellent"     },
    ],
    invoices: [
      { id: "INV-2026-0198", category: "Tuition Fee",  amount: 1200, paid: 1200, status: "Paid", due: "1 May 2026"  },
      { id: "INV-2026-0199", category: "Transport Levy",amount: 350,  paid: 350,  status: "Paid", due: "1 May 2026"  },
      { id: "INV-2026-0200", category: "PTA Levy",     amount: 150,  paid: 150,  status: "Paid", due: "1 May 2026"  },
    ],
    payments: [
      { date: "2 May 2026",  amount: 1200, method: "Bank Transfer", ref: "PAY-2026-0098", desc: "Tuition Fee"   },
      { date: "1 May 2026",  amount: 350,  method: "Mobile Money",  ref: "PAY-2026-0097", desc: "Transport Levy" },
      { date: "1 May 2026",  amount: 150,  method: "Mobile Money",  ref: "PAY-2026-0096", desc: "PTA Levy"       },
    ],
    attendance: { present: 40, absent: 3, late: 1, total: 44 },
  },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "End of Term Examination Schedule",     body: "End of Term 2 examinations begin on Monday 15th June 2026. All students must arrive by 7:00 AM.", date: "30 May 2026", type: "Academic",  read: false },
  { id: 2, title: "Term 2 Fee Payment Deadline",          body: "Kindly ensure all outstanding Term 2 fees are cleared by 13th June 2026 to avoid late payment penalties.", date: "28 May 2026", type: "Finance",   read: false },
  { id: 3, title: "Parent-Teacher Conference",            body: "PTA meeting scheduled for Saturday 7th June 2026 at 10:00 AM in the school hall. Attendance is compulsory.", date: "25 May 2026", type: "Meeting",   read: true  },
  { id: 4, title: "Sports Day – June 21st, 2026",         body: "Annual Sports Day will be held on Saturday 21st June. Students should report in their house colours.", date: "20 May 2026", type: "Event",     read: true  },
  { id: 5, title: "Term 2 Results Now Published",         body: "Results for JHS 2 have been published. Log in to view your child's performance.", date: "18 May 2026", type: "Academic",  read: true  },
];

const NOTIFICATIONS = [
  { id: 1, icon: "📊", text: "Term 2 results for Kwame Ofori (JHS 2) are now published.",          time: "2 days ago",  read: false },
  { id: 2, icon: "💳", text: "Outstanding fee reminder: GH₵ 1,950 due for Kwame Ofori.",           time: "3 days ago",  read: false },
  { id: 3, icon: "✅", text: "Payment of GH₵ 1,700 received for Akosua Ofori. All fees cleared.",  time: "1 week ago",  read: true  },
  { id: 4, icon: "📅", text: "Attendance alert: Kwame Ofori was absent on Tuesday 26th May.",      time: "4 days ago",  read: false },
  { id: 5, icon: "📢", text: "New school announcement: End of Term Examination Schedule posted.",  time: "5 days ago",  read: true  },
];

function gradeStyle(g: string) {
  if (g === "A")  return { color: "#16a34a", bg: "#dcfce7" };
  if (g === "B+") return { color: "#2563eb", bg: "#dbeafe" };
  if (g === "B")  return { color: "#0891b2", bg: "#cffafe" };
  if (g === "C+") return { color: "#d97706", bg: "#fef3c7" };
  return               { color: "#dc2626", bg: "#fee2e2" };
}

const NAV = [
  { id: "dashboard",    label: "Dashboard",      icon: <LayoutDashboard size={16} />, badge: 0 },
  { id: "children",     label: "My Children",    icon: <Users size={16} />,           badge: 0 },
  { id: "attendance",   label: "Attendance",     icon: <CalendarCheck size={16} />,   badge: 0 },
  { id: "results",      label: "Results",        icon: <FileText size={16} />,        badge: 0 },
  { id: "report-cards", label: "Report Cards",   icon: <BookOpen size={16} />,        badge: 0 },
  { id: "fees",         label: "Fees & Payments",icon: <CreditCard size={16} />,      badge: 1 },
  { id: "announcements",label: "Announcements",  icon: <Megaphone size={16} />,       badge: 2 },
  { id: "notifications",label: "Notifications",  icon: <Bell size={16} />,            badge: 3 },
  { id: "account",      label: "My Account",     icon: <UserCog size={16} />,         badge: 0 },
];

// ─── Sections ─────────────────────────────────────────────────────────────────
function ChildSelector({ selected, onSelect }: { selected: number; onSelect: (id: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {CHILDREN.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)}
          style={{ padding: "7px 16px", border: `1.5px solid ${selected === c.id ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 20, background: selected === c.id ? "#7c3aed" : "white", color: selected === c.id ? "white" : "#374151", fontSize: 13, fontWeight: selected === c.id ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: selected === c.id ? "rgba(255,255,255,0.3)" : c.avatarBg, color: selected === c.id ? "white" : c.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 9 }}>{c.initials}</div>
          {c.name}
        </button>
      ))}
    </div>
  );
}

function Dashboard() {
  const totalOutstanding = CHILDREN.reduce((s, c) => s + c.outstanding, 0);
  const avgAttendance = Math.round(CHILDREN.reduce((s, c) => s + c.attendancePct, 0) / CHILDREN.length);
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Welcome back, Mrs. Grace Ofori 👋</h2>
      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>Happy Kids Basic School · Term 2, 2025/2026 · May 30, 2026</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Linked Children",   value: "2",             sub: "Kwame & Akosua",     color: "#7c3aed", bg: "#ede9fe", icon: "👨‍👧" },
          { label: "Outstanding Fees",  value: `GH₵ ${totalOutstanding.toLocaleString()}`, sub: "Kwame (JHS 2)",   color: "#dc2626", bg: "#fee2e2", icon: "💳" },
          { label: "Avg Attendance",    value: `${avgAttendance}%`,  sub: "Both children",     color: "#16a34a", bg: "#dcfce7", icon: "📅" },
          { label: "Results Status",    value: "Published",     sub: "Term 2 available",  color: "#2563eb", bg: "#dbeafe", icon: "📊" },
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CHILDREN.map((c) => (
            <div key={c.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: c.avatarBg, color: c.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{c.class} · {c.studentId}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "#dcfce7", color: "#15803d" }}>{c.status}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { label: "Average",    value: `${c.avg}%`, color: gradeStyle(c.grade).color },
                  { label: "Attendance", value: `${c.attendancePct}%`, color: c.attendancePct >= 90 ? "#16a34a" : c.attendancePct >= 80 ? "#d97706" : "#dc2626" },
                  { label: "Position",  value: `${c.position}/${c.totalStudents}`, color: c.position <= 5 ? "#7c3aed" : "#374151" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", background: "#f9fafb", borderRadius: 8, padding: "8px 4px" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {c.outstanding > 0 && (
                <div style={{ marginTop: 10, padding: "7px 10px", background: "#fef3c7", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <AlertCircle size={12} color="#d97706" /> <span style={{ color: "#92400e" }}>Outstanding: <strong>GH₵ {c.outstanding.toLocaleString()}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Recent Activity</div>
          {NOTIFICATIONS.slice(0, 5).map((n) => (
            <div key={n.id} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f9fafb" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: n.read ? "#f3f4f6" : "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, color: n.read ? "#6b7280" : "#111827", fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChildrenSection() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>My Children</h2>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12.5, color: "#1e40af", display: "flex", gap: 7 }}>
        <Shield size={14} style={{ flexShrink: 0, marginTop: 1 }} /> Data access is restricted to your linked children only. You cannot view other students' records.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CHILDREN.map((c) => (
          <div key={c.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: c.avatarBg, color: c.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17 }}>{c.initials}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>{c.class} · {c.studentId} · {c.gender === "M" ? "Male" : "Female"}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#dcfce7", color: "#15803d" }}>{c.status}</span>
                    <span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 10, background: "#f3f4f6", color: "#374151" }}>Term 2, 2025/2026</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, minWidth: 280 }}>
                {[
                  { label: "Avg Score",   value: `${c.avg}%`,              color: gradeStyle(c.grade).color },
                  { label: "Grade",       value: c.grade,                  color: gradeStyle(c.grade).color },
                  { label: "Attendance",  value: `${c.attendancePct}%`,       color: c.attendancePct >= 90 ? "#16a34a" : "#d97706" },
                  { label: "Position",   value: `${c.position}/${c.totalStudents}`, color: "#7c3aed" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", background: "#f9fafb", borderRadius: 8, padding: "8px 4px" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendanceSection() {
  const [childId, setChildId] = useState(1);
  const child = CHILDREN.find((c) => c.id === childId)!;
  const att = child.attendance;
  const pct = Math.round((att.present / att.total) * 100);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Attendance</h2>
      <ChildSelector selected={childId} onSelect={setChildId} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Present Days", value: att.present, color: "#16a34a", bg: "#dcfce7", icon: "✅" },
          { label: "Absent Days",  value: att.absent,  color: "#dc2626", bg: "#fee2e2", icon: "❌" },
          { label: "Late Arrivals",value: att.late,    color: "#d97706", bg: "#fef3c7", icon: "⏰" },
          { label: "Attendance %", value: `${pct}%`,   color: pct >= 90 ? "#16a34a" : pct >= 75 ? "#d97706" : "#dc2626", bg: "#f9fafb", icon: "📊" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Term 2 Attendance · {child.name} · {child.class}</div>
        <div style={{ height: 12, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? "#16a34a" : pct >= 75 ? "#d97706" : "#dc2626", borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
          <span>{pct}% attendance rate ({att.present}/{att.total} days)</span>
          <span style={{ color: pct >= 90 ? "#16a34a" : "#d97706", fontWeight: 700 }}>{pct >= 90 ? "Excellent" : pct >= 80 ? "Good" : "Needs Improvement"}</span>
        </div>
        {att.absent > 0 && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#fff7ed", borderRadius: 8, border: "1px solid #fed7aa", fontSize: 12.5, color: "#9a3412" }}>
            ⚠️ {child.name} has been absent {att.absent} time{att.absent > 1 ? "s" : ""} this term. Please contact the school if this persists.
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsSection() {
  const [childId, setChildId] = useState(1);
  const child = CHILDREN.find((c) => c.id === childId)!;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Results</h2>
      <ChildSelector selected={childId} onSelect={setChildId} />
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#1e40af", display: "flex", gap: 7, alignItems: "center" }}>
        <Eye size={13} style={{ flexShrink: 0 }} /> Only <strong>published</strong> results are shown. Unpublished or draft results are not accessible from the Parent Portal.
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{child.name} · {child.class} · Term 2, 2025/2026</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"1px solid #e5e7eb",borderRadius:8,background:"white",fontSize:12,cursor:"pointer",color:"#374151" }}>
            <Printer size={12}/> Print
          </button>
          <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"none",borderRadius:8,background:"#7c3aed",color:"white",fontSize:12,fontWeight:700,cursor:"pointer" }}>
            <Download size={12}/> Download PDF
          </button>
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "#7c3aed" }}>
              {["Subject","CA (/50)","Exam (/50)","Total (/100)","Grade","Remark"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {child.results.map((r, i) => {
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
              <td style={{ padding: "10px 14px", fontWeight: 800, fontSize: 16, color: gradeStyle(child.grade).color }}>{child.avg.toFixed(1)}</td>
              <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: gradeStyle(child.grade).bg, color: gradeStyle(child.grade).color }}>{child.grade}</span></td>
              <td style={{ padding: "10px 14px", fontWeight: 600, color: "#374151" }}>Position {child.position} of {child.totalStudents}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function FeesSection() {
  const [childId, setChildId] = useState(1);
  const child = CHILDREN.find((c) => c.id === childId)!;
  const outstanding = child.invoices.reduce((s, inv) => s + (inv.amount - inv.paid), 0);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Fees & Payments</h2>
      <ChildSelector selected={childId} onSelect={setChildId} />
      {outstanding > 0 && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#9a3412" }}>⚠️ Outstanding balance for <strong>{child.name}</strong></span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#dc2626" }}>GH₵ {outstanding.toLocaleString()}</span>
        </div>
      )}
      {outstanding === 0 && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle size={16} color="#16a34a" /> <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>All fees paid for {child.name}. Thank you!</span>
        </div>
      )}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", fontSize: 13, fontWeight: 700, color: "#111827" }}>Invoices — {child.class} · Term 2, 2025/2026</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Invoice #","Category","Amount","Paid","Balance","Due Date","Status"].map((h) => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {child.invoices.map((inv, i) => {
              const balance = inv.amount - inv.paid;
              const sc = inv.status === "Paid" ? { color: "#15803d", bg: "#dcfce7" } : inv.status === "Pending" ? { color: "#d97706", bg: "#fef3c7" } : { color: "#dc2626", bg: "#fee2e2" };
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{inv.id}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111827" }}>{inv.category}</td>
                  <td style={{ padding: "10px 14px", color: "#374151" }}>GH₵ {inv.amount.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", color: "#16a34a", fontWeight: 600 }}>GH₵ {inv.paid.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: balance > 0 ? "#dc2626" : "#16a34a" }}>GH₵ {balance.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#6b7280" }}>{inv.due}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>{inv.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 12.5, color: "#166534" }}>
        💳 <strong>Payment Instructions:</strong> Contact the school accounts office or use Mobile Money (MTN/Vodafone) to make payments. Quote the invoice number as reference. For enquiries call: <strong>+233 30 123 4567</strong>
      </div>
      {child.payments.length > 0 && (
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", fontSize: 13, fontWeight: 700, color: "#111827" }}>Payment History</div>
          {child.payments.map((p, i) => (
            <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid #f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{p.desc}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{p.date} · {p.method} · Ref: {p.ref}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#16a34a" }}>GH₵ {p.amount.toLocaleString()}</span>
                <button style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 10px",border:"1px solid #e5e7eb",borderRadius:6,background:"white",fontSize:11.5,cursor:"pointer",color:"#374151" }}>
                  <Download size={11}/> Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const toggle = (id: number) => setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, read: !a.read } : a));
  const typeColor = (t: string) => {
    if (t === "Academic") return { color: "#2563eb", bg: "#dbeafe" };
    if (t === "Finance")  return { color: "#d97706", bg: "#fef3c7" };
    if (t === "Event")    return { color: "#7c3aed", bg: "#ede9fe" };
    return { color: "#6b7280", bg: "#f3f4f6" };
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Announcements</h2>
        <button onClick={() => setAnnouncements((p) => p.map((a) => ({ ...a, read: true })))}
          style={{ padding: "7px 13px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 12, cursor: "pointer", color: "#374151" }}>
          Mark all read
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {announcements.map((a) => {
          const tc = typeColor(a.type);
          return (
            <div key={a.id} style={{ background: a.read ? "white" : "#fafaf9", borderRadius: 12, border: `1px solid ${a.read ? "#e5e7eb" : "#7c3aed30"}`, padding: "14px 16px", borderLeft: `3px solid ${a.read ? "#e5e7eb" : "#7c3aed"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {!a.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                    <span style={{ fontSize: 13.5, fontWeight: a.read ? 600 : 800, color: "#111827" }}>{a.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: tc.bg, color: tc.color }}>{a.type}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 6px", lineHeight: 1.5 }}>{a.body}</p>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{a.date}</span>
                </div>
                <button onClick={() => toggle(a.id)} style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#6b7280", whiteSpace: "nowrap" }}>
                  {a.read ? "Mark unread" : "Mark read"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Notifications</h2>
        <button onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
          style={{ padding: "7px 13px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 12, cursor: "pointer", color: "#374151" }}>
          Mark all read
        </button>
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {notifs.map((n, i) => (
          <div key={n.id} onClick={() => setNotifs((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}
            style={{ padding: "14px 16px", borderBottom: i < notifs.length - 1 ? "1px solid #f3f4f6" : "none", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", background: n.read ? "white" : "#fefce8" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: n.read ? "#f3f4f6" : "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: n.read ? "#6b7280" : "#111827", fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.text}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: 5 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSection({ user }: { user: { name: string; email: string; initials: string; avatarBg: string; avatarColor: string } }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>My Account</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Profile Information</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: user.avatarBg, color: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{user.initials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{user.name}</div>
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#ede9fe", color: "#7c3aed" }}>Parent Portal</span>
            </div>
          </div>
          {[{ label: "Full Name", value: user.name }, { label: "Email", value: user.email }, { label: "Phone", value: "+233 24 765 4321" }, { label: "School", value: "Happy Kids Basic School" }].map((f) => (
            <div key={f.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{f.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Linked Children</div>
            {CHILDREN.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.avatarBg, color: c.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>{c.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{c.class} · {c.studentId}</div>
                </div>
                <CheckCircle size={14} color="#16a34a" style={{ marginLeft: "auto" }} />
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Security</div>
            <button onClick={() => setShowPw(!showPw)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500, marginBottom: 8 }}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />} Change Password
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500 }}>
              <Shield size={14} /> Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
export default function ParentPortal() {
  const { user, logout } = useAuth();
  const { isMobile } = useWindowSize();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":     return <Dashboard />;
      case "children":      return <ChildrenSection />;
      case "attendance":    return <AttendanceSection />;
      case "results":       return <ResultsSection />;
      case "report-cards":  return (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>Report Cards</h2>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#1e40af" }}>
            📋 Report cards are generated from published Term 2 results. Select a child to preview and download.
          </div>
          {CHILDREN.map((c) => (
            <div key={c.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.avatarBg, color: c.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{c.initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{c.class} · Term 2, 2025/2026 · Avg: {c.avg}% ({c.grade})</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"1px solid #e5e7eb",borderRadius:8,background:"white",fontSize:12,cursor:"pointer",color:"#374151" }}><Printer size={12}/> Print</button>
                <button style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"none",borderRadius:8,background:"#7c3aed",color:"white",fontSize:12,fontWeight:700,cursor:"pointer" }}><Download size={12}/> PDF</button>
              </div>
            </div>
          ))}
        </div>
      );
      case "fees":           return <FeesSection />;
      case "announcements":  return <AnnouncementsSection />;
      case "notifications":  return <NotificationsSection />;
      case "account":        return <AccountSection user={user!} />;
      default:               return <Dashboard />;
    }
  };

  const Sidebar = () => (
    <div style={{ width: 240, background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>🏫</span>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>Happy Kids</div>
            <div style={{ fontSize: 10.5, color: "#9ca3af" }}>Basic School</div>
          </div>
        </div>
        <div style={{ background: "#ede9fe", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: user?.avatarBg, color: user?.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{user?.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div style={{ fontSize: 10.5, color: "#7c3aed", fontWeight: 600 }}>Parent Portal</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {NAV.map((item) => {
          const active = activePage === item.id;
          const badgeCount = item.id === "notifications" ? unread : item.badge;
          return (
            <button key={item.id} onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", border: "none", borderRadius: 9, background: active ? "#ede9fe" : "transparent", color: active ? "#7c3aed" : "#374151", fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
              <span style={{ color: active ? "#7c3aed" : "#9ca3af" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {badgeCount > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 10, background: active ? "#7c3aed" : "#dc2626", color: "white" }}>{badgeCount}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid #f3f4f6" }}>
        <button onClick={() => logout()} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", border: "none", borderRadius: 9, background: "transparent", color: "#dc2626", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
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
            <div style={{ fontSize: 14, fontWeight: 700, color: "#7c3aed" }}>Parent Portal</div>
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
