import { useRef, useEffect, useState } from "react";
import { Settings, FileText, ChevronDown, ChevronLeft, ChevronRight, Search, Users, UserX, CheckCircle, MoreVertical, Bell, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const kpiCards = [
  { label: "Present", value: "318", sub: "80.6%", subColor: "#16a34a", icon: "👥", iconBg: "#dcfce7" },
  { label: "Absent", value: "56", sub: "14.2%", subColor: "#dc2626", icon: "🚫", iconBg: "#fee2e2" },
  { label: "Late", value: "16", sub: "4.1%", subColor: "#d97706", icon: "⏰", iconBg: "#fef3c7" },
  { label: "Excused", value: "5", sub: "1.1%", subColor: "#7c3aed", icon: "✅", iconBg: "#ede9fe" },
  { label: "Teachers Present", value: "24 / 28", sub: "85.7%", subColor: "#2563eb", icon: "🎓", iconBg: "#dbeafe" },
];

const initStudents = [
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
        colors: ["#7c3aed"], stroke: { width: 2, curve: "smooth" }, markers: { size: 3 },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 3 }, tooltip: { style: { fontSize: "11px" } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

export default function Attendance() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [activeTab, setActiveTab] = useState("Manual");
  const [selectedStudent, setSelectedStudent] = useState(initStudents[0]);
  const [statuses, setStatuses] = useState<Record<number, string>>(Object.fromEntries(initStudents.map((s) => [s.id, s.status])));
  const [searchQuery, setSearchQuery] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = ["Manual", "QR Code", "RFID Card", "Biometric", "Bulk Import"];

  const filteredStudents = initStudents.filter((s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const bulkMark = (status: string) => {
    const newStatuses = { ...statuses };
    filteredStudents.forEach((s) => { newStatuses[s.id] = status; });
    setStatuses(newStatuses);
    showToast(`Marked ${filteredStudents.length} students as ${status}`, "success");
  };

  const handleSave = () => {
    setSaved(true);
    showToast("Attendance saved successfully!", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSendAlerts = () => {
    const absentCount = Object.values(statuses).filter((s) => s === "Absent").length;
    showToast(`SMS/WhatsApp alerts sent to ${absentCount} parents of absent students`, "info");
  };

  const kpiCols = isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)";

  const StudentPanel = () => (
    <div style={{ padding: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: selectedStudent.avatarBg, color: selectedStudent.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{selectedStudent.initials}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selectedStudent.name}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{selectedStudent.sid}</div>
          </div>
        </div>
        {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>}
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Today's Status</div>
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <select value={statuses[selectedStudent.id]} onChange={(e) => setStatuses((p) => ({ ...p, [selectedStudent.id]: e.target.value }))}
            style={{ appearance: "none", width: "100%", padding: "9px 28px 9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, fontWeight: 600, background: statusStyle(statuses[selectedStudent.id]).bg, color: statusStyle(statuses[selectedStudent.id]).color, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            {["Present", "Absent", "Late", "Excused"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown size={12} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: statusStyle(statuses[selectedStudent.id]).color, pointerEvents: "none" }} />
        </div>
      </div>

      {[["Check In Time", selectedStudent.time], ["Mode", selectedStudent.mode], ["Class", "P6 - Topaz"], ["Marked By", "Mr. K. Appiah"]].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
          <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
          <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <span style={{ fontSize: 11.5, color: "#9ca3af" }}>This Term Overall</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>80%</span>
          <span style={{ fontSize: 10.5, color: "#16a34a" }}>Excellent</span>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Weekly Trend</div>
        <WeeklyTrendChart />
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
        <button onClick={() => { showToast(`Excuse note added for ${selectedStudent.name}`, "info"); if (isMobile) setShowPanel(false); }} style={{ padding: "9px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 12.5, fontWeight: 500, color: "#374151", cursor: "pointer" }}>
          📝 Add Excuse Note
        </button>
        <button onClick={() => { showToast(`Message sent to ${selectedStudent.name}'s parent`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "9px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", fontSize: 12.5, fontWeight: 600, color: "white", cursor: "pointer" }}>
          💬 Message Parent
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: isMobile ? "visible" : "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Attendance</h1>
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                {["Dashboard", "Attendance", "Today's Attendance"].map((c, i, a) => (
                  <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                    {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isMobile && (
              <>
                <button onClick={() => showToast("Attendance settings panel opened", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                  <Settings size={13} color="#6b7280" /> Settings
                </button>
                <button onClick={() => showToast("Excuse note form opened", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                  <FileText size={13} color="#6b7280" /> Add Excuse
                </button>
              </>
            )}
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: saved ? "#16a34a" : "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white", transition: "background 0.2s" }}>
              {saved ? <><Check size={13} /> Saved!</> : "Save Changes"}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{k.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 1, fontWeight: 500 }}>{k.label}</div>
                <div style={{ fontSize: isMobile ? 14 : 17, fontWeight: 700, color: "#111827" }}>{k.value}</div>
                <div style={{ fontSize: 10.5, color: k.subColor, fontWeight: 600 }}>{k.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
              {tabs.map((t) => (
                <button key={t} onClick={() => setActiveTab(t)} style={{ padding: isMobile ? "6px 10px" : "7px 12px", fontSize: isMobile ? 11.5 : 12.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "#111827" : "#6b7280", background: activeTab === t ? "white" : "transparent", border: "1px solid", borderColor: activeTab === t ? "#e5e7eb" : "transparent", borderRadius: 8, cursor: "pointer", marginRight: 4, whiteSpace: "nowrap" }}>
                  {t}
                </button>
              ))}
            </div>
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", padding: "6px 10px", borderRadius: 8, flexShrink: 0 }}>
                <Bell size={12} color="#16a34a" />
                <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>Auto Alerts ON</span>
              </div>
            )}
          </div>

          {/* Class info */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>P6 - Topaz</span>
                <ChevronDown size={13} color="#6b7280" />
              </div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>Class Teacher: Mr. K. Appiah</div>
            </div>
            {!isMobile && (
              <div style={{ display: "flex", gap: 16 }}>
                {[["Total", "39"], ["Boys", "20"], ["Girls", "19"]].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize: 10.5, color: "#9ca3af" }}>{l}</div><div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{v}</div></div>
                ))}
              </div>
            )}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>08:00 AM – 10:00 AM</span>
            </div>
          </div>

          {/* Bulk actions + search */}
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Mark Attendance</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={12} style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student..."
                  style={{ padding: "6px 10px 6px 26px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, outline: "none", color: "#374151", background: "#fafafa", width: isMobile ? 130 : 170 }} />
              </div>
              <button onClick={() => bulkMark("Present")} style={{ padding: "6px 12px", border: "none", borderRadius: 7, background: "#dcfce7", color: "#16a34a", fontSize: 11.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={11} /> Present All
              </button>
              <button onClick={() => bulkMark("Absent")} style={{ padding: "6px 12px", border: "none", borderRadius: 7, background: "#fee2e2", color: "#dc2626", fontSize: 11.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <UserX size={11} /> Absent All
              </button>
            </div>
          </div>

          {/* Student rows */}
          <div>
            {filteredStudents.map((s, idx) => {
              const st = statusStyle(statuses[s.id] || s.status);
              const isSelected = selectedStudent.id === s.id;
              return (
                <div key={s.id} onClick={() => { setSelectedStudent(s); if (isMobile) setShowPanel(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: idx < filteredStudents.length - 1 ? "1px solid #f9fafb" : "none", background: isSelected ? "#faf5ff" : "white", cursor: "pointer", transition: "background 0.1s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.avatarBg, color: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{s.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.sid}</div>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
                    <select value={statuses[s.id] || s.status} onChange={(e) => setStatuses((p) => ({ ...p, [s.id]: e.target.value }))}
                      style={{ appearance: "none", padding: "5px 22px 5px 9px", borderRadius: 12, border: "none", fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                      {["Present", "Absent", "Late", "Excused"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={10} style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", color: st.color, pointerEvents: "none" }} />
                  </div>
                  {!isMobile && (
                    <>
                      <span style={{ fontSize: 11.5, color: "#374151", minWidth: 70 }}>{s.time}</span>
                      <span style={{ fontSize: 11.5, color: "#6b7280", minWidth: 60 }}>{s.mode}</span>
                    </>
                  )}
                  {!isMobile && <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={13} /></button>}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing {filteredStudents.length} of <strong>39</strong> students</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSendAlerts} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#ede9fe", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <Bell size={12} /> Send Alerts
              </button>
              <button onClick={handleSave} style={{ padding: "7px 16px", borderRadius: 8, background: saved ? "#16a34a" : "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Absentee Alerts</span>
              <button onClick={() => showToast("Showing all absentees", "info")} style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>3 students absent today</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {["AS", "DL", "MK"].map((ini, idx) => (
                <div key={idx} style={{ width: 28, height: 28, borderRadius: "50%", background: ["#fce7f3", "#dbeafe", "#e0e7ff"][idx], color: ["#9d174d", "#1e3a8a", "#3730a3"][idx], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{ini}</div>
              ))}
              <button onClick={handleSendAlerts} style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 7, border: "none", background: "#7c3aed", color: "white", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Send Alerts</button>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ icon: "📝", label: "Add Note" }, { icon: "📋", label: "Add Excuse" }, { icon: "🖨️", label: "Print Sheet" }, { icon: "📊", label: "Export" }].map((a) => (
                <button key={a.label} onClick={() => showToast(`${a.label} action triggered`, "info")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 8px", border: "1px solid #f3f4f6", borderRadius: 8, background: "#fafafa", cursor: "pointer" }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <span style={{ fontSize: 10.5, color: "#374151" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Term Summary</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Apr - May</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ label: "Present", value: "92.3%", color: "#16a34a" }, { label: "Absent", value: "5.4%", color: "#dc2626" }, { label: "Late", value: "2.3%", color: "#d97706" }].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Desktop */}
      {!isMobile && (
        <div style={{ width: 270, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Date nav */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><ChevronLeft size={14} /></button>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Wednesday, 15 May</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><ChevronRight size={14} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <StudentPanel />
          </div>
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "12px auto 0" }} />
            <StudentPanel />
          </div>
        </div>
      )}
    </div>
  );
}
