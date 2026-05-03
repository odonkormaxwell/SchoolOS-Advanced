import { useRef, useEffect, useState } from "react";
import {
  Settings, FileText, ChevronDown, ChevronLeft, ChevronRight,
  Search, Users, UserX, Clock, CheckCircle, MoreVertical,
  MessageSquare, Phone, Bell, AlertCircle, Download, Check,
} from "lucide-react";

const kpiCards = [
  { label: "Present", value: "318", sub: "80.6%", color: "#16a34a", subColor: "#16a34a", icon: "👥", iconBg: "#dcfce7" },
  { label: "Absent", value: "56", sub: "14.2%", color: "#dc2626", subColor: "#dc2626", icon: "🚫", iconBg: "#fee2e2" },
  { label: "Late", value: "16", sub: "4.1%", color: "#d97706", subColor: "#d97706", icon: "⏰", iconBg: "#fef3c7" },
  { label: "Excused", value: "5", sub: "1.1%", color: "#7c3aed", subColor: "#7c3aed", icon: "✅", iconBg: "#ede9fe" },
  { label: "Teachers Present", value: "24 / 28", sub: "85.7%", color: "#2563eb", subColor: "#2563eb", icon: "🎓", iconBg: "#dbeafe" },
];

const students = [
  { id: 1, name: "Kofi Junior Asante", sid: "STU-2024-0012", status: "Present", time: "08:05 AM", mode: "QR Code", note: "—", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: 2, name: "Ama Serwaa Ofori", sid: "STU-2024-0013", status: "Absent", time: "—", mode: "—", note: "No excuse note", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 3, name: "Daniel Nii Lartey", sid: "STU-2024-0014", status: "Late", time: "08:25 AM", mode: "RFID Card", note: "Late arrival", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { id: 4, name: "Akosua Adwoa Mensah", sid: "STU-2024-0015", status: "Present", time: "08:03 AM", mode: "Biometric", note: "—", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 5, name: "Yaw Antwi Boakye", sid: "STU-2024-0016", status: "Excused", time: "—", mode: "Parent Note", note: "Illness (Fever)", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { id: 6, name: "Efua Korkor Lamptey", sid: "STU-2024-0017", status: "Present", time: "08:07 AM", mode: "QR Code", note: "—", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
];

const statusStyle = (s: string) => {
  if (s === "Present") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Absent") return { bg: "#fee2e2", color: "#dc2626" };
  if (s === "Late") return { bg: "#fef3c7", color: "#d97706" };
  return { bg: "#ede9fe", color: "#7c3aed" };
};

function WeeklyTrendChart() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "line", height: 90, toolbar: { show: false }, sparkline: { enabled: false }, animations: { enabled: false } },
        series: [{ name: "Attendance %", data: [88, 85, 82, 90, 92] }],
        xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"], labels: { style: { fontSize: "9px", colors: "#9ca3af" } }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { min: 70, max: 100, labels: { style: { fontSize: "9px", colors: "#9ca3af" } }, tickAmount: 4 },
        colors: ["#7c3aed"],
        stroke: { width: 2, curve: "smooth" },
        markers: { size: 3 },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
        tooltip: { style: { fontSize: "11px" } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("Manual");
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [statuses, setStatuses] = useState<Record<number, string>>(
    Object.fromEntries(students.map((s) => [s.id, s.status]))
  );

  const tabs = ["Manual", "QR Code", "RFID Card", "Biometric", "Bulk Import"];

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Attendance</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Attendance", "Today's Attendance"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Settings size={13} color="#6b7280" /> Attendance Settings
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <FileText size={13} color="#6b7280" /> Add Excuse Note
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              Mark Attendance <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
              <div>
                <div style={{ fontSize: 10.5, color: "#6b7280", marginBottom: 2, fontWeight: 500 }}>{k.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{k.value}</div>
                <div style={{ fontSize: 11, color: k.subColor, fontWeight: 600 }}>{k.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          {/* Tabs + Auto Alerts */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 0 }}>
              {tabs.map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "#111827" : "#6b7280", background: activeTab === t ? "white" : "transparent", border: "1px solid", borderColor: activeTab === t ? "#e5e7eb" : "transparent", borderRadius: 8, cursor: "pointer", marginRight: 4 }}>
                  {t === "QR Code" && <span style={{ fontSize: 12 }}>⬛</span>}
                  {t === "RFID Card" && <span style={{ fontSize: 12 }}>📡</span>}
                  {t === "Biometric" && <span style={{ fontSize: 12 }}>🖐</span>}
                  {t === "Bulk Import" && <span style={{ fontSize: 12 }}>📤</span>}
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", padding: "6px 12px", borderRadius: 8 }}>
              <Bell size={13} color="#16a34a" />
              <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600 }}>Auto Alerts ON</span>
              <span style={{ fontSize: 10.5, color: "#6b7280" }}>SMS/WhatsApp alerts for absentees</span>
            </div>
          </div>

          {/* Class info + actions */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 16, alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>P6 - Topaz</span>
                <ChevronDown size={13} color="#6b7280" />
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Class Teacher: Mr. K. Appiah</div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>Total Students</div><div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>39</div></div>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>Boys</div><div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>20</div></div>
              <div><div style={{ fontSize: 11, color: "#9ca3af" }}>Girls</div><div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>19</div></div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={13} color="#9ca3af" />
              <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500 }}>08:00 AM – 10:00 AM</span>
              <button style={{ padding: "5px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#374151" }}>Edit Time</button>
            </div>
          </div>

          {/* Mark Attendance header */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Mark Attendance</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input placeholder="Search student..." style={{ padding: "6px 10px 6px 28px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, outline: "none", color: "#374151", background: "#fafafa", width: 180 }} />
              </div>
              <button style={{ padding: "7px 14px", border: "none", borderRadius: 7, background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <Users size={12} /> Bulk Present
              </button>
              <button style={{ padding: "7px 14px", border: "none", borderRadius: 7, background: "#fee2e2", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <UserX size={12} /> Bulk Absent
              </button>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "9px 16px", width: 36 }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></th>
                {["STUDENT", "STATUS", "CHECK IN TIME", "MODE", "NOTE", ""].map((c, i) => (
                  <th key={i} style={{ padding: "9px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const st = statusStyle(statuses[s.id] || s.status);
                return (
                  <tr key={s.id} onClick={() => setSelectedStudent(s)}
                    style={{ borderBottom: idx < students.length - 1 ? "1px solid #f9fafb" : "none", background: selectedStudent.id === s.id ? "#faf5ff" : "white", cursor: "pointer" }}>
                    <td style={{ padding: "10px 16px" }}><input type="checkbox" style={{ accentColor: "#7c3aed" }} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.avatarBg, color: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{s.initials}</div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.sid}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select value={statuses[s.id] || s.status} onChange={(e) => setStatuses((p) => ({ ...p, [s.id]: e.target.value }))}
                          style={{ appearance: "none", padding: "4px 22px 4px 8px", borderRadius: 12, border: "none", fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                          {["Present", "Absent", "Late", "Excused"].map((o) => <option key={o}>{o}</option>)}
                        </select>
                        <ChevronDown size={10} style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", color: st.color, pointerEvents: "none" }} />
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 12, color: "#374151" }}>{s.time}</span>
                        {s.time !== "—" && <CheckCircle size={11} color="#16a34a" />}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 12, color: "#374151" }}>{s.mode}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, color: s.note === "No excuse note" ? "#dc2626" : "#6b7280" }}>{s.note}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to 6 of <strong>39</strong> students</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "7px 16px", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
              <button style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 12.5, color: "#374151", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {/* Absentee Alerts */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Absentee Alerts</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>3 students absent today</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {["AS", "DL", "MK"].map((i, idx) => (
                <div key={idx} style={{ width: 28, height: 28, borderRadius: "50%", background: ["#fce7f3", "#dbeafe", "#e0e7ff"][idx], color: ["#9d174d", "#1e3a8a", "#3730a3"][idx], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{i}</div>
              ))}
              <span style={{ fontSize: 11, color: "#9ca3af" }}>+1</span>
              <button style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 7, border: "none", background: "#7c3aed", color: "white", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Send Alerts</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: "📝", label: "Add Note" },
                { icon: "📋", label: "Add Excuse" },
                { icon: "🖨️", label: "Print Sheet" },
                { icon: "📊", label: "Export Report" },
              ].map((a) => (
                <button key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 8px", border: "1px solid #f3f4f6", borderRadius: 8, background: "#fafafa", cursor: "pointer" }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <span style={{ fontSize: 10.5, color: "#374151" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Summary */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Attendance Summary</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>This Term (April - May)</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Present", value: "92.3%", color: "#16a34a" },
                { label: "Absent", value: "5.4%", color: "#dc2626" },
                { label: "Late", value: "2.3%", color: "#d97706" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 270, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Date Nav */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", borderRadius: 8, padding: "7px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><ChevronLeft size={14} /></button>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Wednesday, 15 May 2024</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Student card */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: selectedStudent.avatarBg, color: selectedStudent.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{selectedStudent.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selectedStudent.name}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Student ID: {selectedStudent.sid}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>P6 - Topaz</div>
              </div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 12, background: "#dcfce7", color: "#16a34a" }}>Present</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", marginBottom: 12 }}>
            {["Overview", "History", "Notes", "Transport"].map((t) => (
              <button key={t} style={{ padding: "6px 8px", fontSize: 11, fontWeight: t === "Overview" ? 600 : 400, color: t === "Overview" ? "#7c3aed" : "#9ca3af", background: "none", border: "none", borderBottom: t === "Overview" ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer" }}>{t}</button>
            ))}
          </div>

          {/* Today's Attendance */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Today's Attendance</div>
            {[
              ["Check In Time", "08:05 AM"],
              ["Mode", "QR Code"],
              ["Marked By", "Mr. K. Appiah"],
              ["Location", "Main Campus"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>This Term Overall</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>80%</span>
                <span style={{ fontSize: 10.5, color: "#16a34a" }}>Excellent</span>
              </div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Weekly Attendance Trend</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>This Week</span>
            </div>
            <WeeklyTrendChart />
          </div>

          {/* Parent Excuse Notes */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Parent Excuse Notes</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>Illness (Fever)</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#dcfce7", color: "#16a34a" }}>Approved</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>By Mrs. Priscilla Asante (Mother)</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>15 May 2024, 07:45 AM</div>
            </div>
          </div>

          {/* Automated Alerts */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Automated Alerts</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>Configure</button>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 2 }}>Absent Alert Sent</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>To Mrs. Priscilla Asante (Mother)</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>15 May 2024, 08:15 AM</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: "#16a34a" }}>Sent</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#374151", fontWeight: 500 }}>
              <MessageSquare size={13} color="#7c3aed" /> Send Message
            </button>
            <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#ede9fe", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#7c3aed", fontWeight: 500 }}>
              <Phone size={13} /> Call Parent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
