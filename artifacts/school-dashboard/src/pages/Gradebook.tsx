import { useRef, useEffect, useState } from "react";
import {
  ChevronDown, ChevronRight, Search, Download, MoreVertical,
  ChevronLeft, Zap, TrendingUp, AlertTriangle, Send, FileText, Sparkles,
} from "lucide-react";

const gradeRows = [
  { rank: 1, name: "Kofi Junior Asante", sid: "STU-2024-0012", eng: 17, maths: 18, sci: 16, soc: 17, ict: 17, total: 86, avg: "88.0%", grade: "A", remark: "Excellent", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { rank: 2, name: "Ama Serwaa Ofori", sid: "STU-2024-0013", eng: 15, maths: 15, sci: 16, soc: 16, ict: 17, total: 79, avg: "79.0%", grade: "B", remark: "Very Good", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { rank: 3, name: "Daniel Nii Lartey", sid: "STU-2024-0014", eng: 13, maths: 14, sci: 12, soc: 14, ict: 13, total: 66, avg: "66.0%", grade: "C", remark: "Good", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { rank: 4, name: "Akosua Adwoa Mensah", sid: "STU-2024-0015", eng: 16, maths: 17, sci: 15, soc: 15, ict: 16, total: 79, avg: "79.0%", grade: "B", remark: "Very Good", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { rank: 5, name: "Yaw Antwi Boakye", sid: "STU-2024-0016", eng: 12, maths: 13, sci: 11, soc: 11, ict: 13, total: 61, avg: "61.0%", grade: "C", remark: "Satisfactory", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { rank: 6, name: "Efua Korkor Lamptey", sid: "STU-2024-0017", eng: 18, maths: 19, sci: 17, soc: 18, ict: 18, total: 91, avg: "91.0%", grade: "A", remark: "Excellent", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { rank: 7, name: "Michael Kojo Addo", sid: "STU-2024-0018", eng: 10, maths: 9, sci: 9, soc: 10, ict: 10, total: 50, avg: "50.0%", grade: "D", remark: "Needs Improvement", initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
  { rank: 8, name: "Abena Yaa Darko", sid: "STU-2024-0019", eng: 14, maths: 15, sci: 13, soc: 14, ict: 14, total: 70, avg: "70.0%", grade: "B-", remark: "Good", initials: "AD", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
];

const gradeColor = (g: string) => {
  if (g === "A") return { color: "#16a34a", bg: "#dcfce7" };
  if (g === "B" || g === "B-") return { color: "#2563eb", bg: "#dbeafe" };
  if (g === "C") return { color: "#d97706", bg: "#fef3c7" };
  return { color: "#dc2626", bg: "#fee2e2" };
};

const avgColor = (avg: string) => {
  const n = parseFloat(avg);
  if (n >= 80) return "#16a34a";
  if (n >= 70) return "#2563eb";
  if (n >= 60) return "#d97706";
  return "#dc2626";
};

function PerformanceDonut({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "radialBar", height: 130, toolbar: { show: false } },
        series: [pct],
        plotOptions: { radialBar: { hollow: { size: "55%" }, dataLabels: { name: { show: false }, value: { fontSize: "20px", fontWeight: 700, color: "#111827", formatter: (v: number) => `${v}%` } } } },
        colors: ["#7c3aed"],
        labels: ["Score"],
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, [pct]);
  return <div ref={ref} />;
}

function TermTrendChart() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "line", height: 100, toolbar: { show: false }, animations: { enabled: false } },
        series: [{ name: "Score %", data: [78, 80, 76, 82, 84, 86] }],
        xaxis: { categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Now"], labels: { style: { fontSize: "9px", colors: "#9ca3af" } }, axisBorder: { show: false } },
        yaxis: { min: 60, max: 100, labels: { style: { fontSize: "9px", colors: "#9ca3af" } }, tickAmount: 4 },
        colors: ["#7c3aed"],
        stroke: { width: 2, curve: "smooth" },
        markers: { size: 3 },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
        fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0, stops: [0, 100] } },
        tooltip: { style: { fontSize: "11px" } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

function ClassPerfChart() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "bar", height: 140, toolbar: { show: false }, animations: { enabled: false } },
        series: [{ name: "Average %", data: [76, 72, 74, 76, 81] }, { name: "Class Avg", data: [76, 76, 76, 76, 76] }],
        xaxis: { categories: ["Eng Lang", "Maths", "Science", "Soc Studies", "ICT"], labels: { style: { fontSize: "9px" } }, axisBorder: { show: false } },
        yaxis: { min: 50, max: 100, labels: { style: { fontSize: "9px" } }, tickAmount: 3 },
        colors: ["#7c3aed", "#e5e7eb"],
        plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
        legend: { show: false },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
        dataLabels: { enabled: false },
        tooltip: { style: { fontSize: "11px" } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

function SubjectDistDonut() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      chart = new ApexCharts(ref.current, {
        chart: { type: "donut", height: 150, toolbar: { show: false } },
        series: [12, 16, 7, 4],
        labels: ["A (80-100%)", "B (70-79%)", "C (60-69%)", "D (Below 50%)"],
        colors: ["#16a34a", "#2563eb", "#d97706", "#dc2626"],
        legend: { show: false },
        plotOptions: { pie: { donut: { size: "60%", labels: { show: true, total: { show: true, label: "39", fontSize: "14px", fontWeight: 700, color: "#111827" } } } } },
        dataLabels: { enabled: false },
        tooltip: { style: { fontSize: "11px" } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

export default function Gradebook() {
  const [selected, setSelected] = useState(gradeRows[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Gradebook");

  const pageTabs = ["Overview", "Continuous Assessment", "Exams", "Gradebook", "Rankings", "Learning Analytics", "BECE Readiness"];
  const studentPanelTabs = ["Profile", "Performance", "Homework", "Reports"];

  const subjects = [
    { name: "English Language", score: 85 },
    { name: "Mathematics", score: 90 },
    { name: "Integrated Science", score: 80 },
    { name: "Social Studies", score: 85 },
    { name: "ICT", score: 88 },
  ];

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Gradebook</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            {["Dashboard", "Academics", "Gradebook"].map((c, i, a) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
              </span>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {[
            { label: "Class", value: "P6 - Topaz", sub: "39 Students", icon: "🏫", iconBg: "#ede9fe", iconColor: "#7c3aed" },
            { label: "Average Score", value: "76.4%", sub: "+4.8% vs last term", icon: "🎓", iconBg: "#dcfce7", iconColor: "#16a34a" },
            { label: "Top Student", value: "Kofi Asante", sub: "86.7%", icon: "⭐", iconBg: "#fef3c7", iconColor: "#d97706" },
            { label: "Pass Rate", value: "92.3%", sub: "36 / 39 Students", icon: "📈", iconBg: "#dbeafe", iconColor: "#2563eb" },
            { label: "Students at Risk", value: "6 Students", sub: "Need attention", icon: "⚠️", iconBg: "#fee2e2", iconColor: "#dc2626" },
          ].map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 10.5, color: "#6b7280", marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.iconColor, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Page tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2 }}>
          {pageTabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ flex: 1, padding: "7px 4px", fontSize: 11.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "white" : "#6b7280", background: activeTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </div>

        {/* Filters + Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
            {[
              { label: null, opts: ["First Term (2024/2025)", "Second Term", "Third Term"] },
              { label: null, opts: ["All Subjects", "English", "Maths", "Science"] },
              { label: null, opts: ["All Assessment Types", "Exams", "CA", "Projects"] },
            ].map(({ opts }, i) => (
              <div key={i} style={{ position: "relative" }}>
                <select style={{ appearance: "none", padding: "7px 24px 7px 10px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            ))}
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input placeholder="Search student..." style={{ width: "100%", padding: "7px 10px 7px 30px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", outline: "none", background: "#fafafa" }} />
            </div>
            <button style={{ padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", fontSize: 12, cursor: "pointer", color: "#374151" }}>Bulk Enter Scores</button>
            <button style={{ padding: "7px 14px", border: "none", borderRadius: 7, background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Download size={12} /> Export
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  <th style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", width: 30 }}>#</th>
                  <th style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left" }}>STUDENT</th>
                  {["ENG LANG (20)", "MATHS (20)", "SCIENCE (20)", "SOC STUDIES (20)", "ICT (20)", "TOTAL (100)", "AVERAGE", "GRADE", "REMARKS"].map((c) => (
                    <th key={c} style={{ padding: "10px 8px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textAlign: "center", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                  <th style={{ padding: "10px 8px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af" }}></th>
                </tr>
              </thead>
              <tbody>
                {gradeRows.map((r, idx) => {
                  const gc = gradeColor(r.grade);
                  const ac = avgColor(r.avg);
                  const isActive = selected.sid === r.sid;
                  return (
                    <tr key={r.rank} onClick={() => setSelected(r)}
                      style={{ borderBottom: idx < gradeRows.length - 1 ? "1px solid #f9fafb" : "none", background: isActive ? "#faf5ff" : "white", cursor: "pointer" }}>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af" }}>{r.rank}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: r.avatarBg, color: r.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{r.initials}</div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{r.name}</div>
                            <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{r.sid}</div>
                          </div>
                        </div>
                      </td>
                      {[r.eng, r.maths, r.sci, r.soc, r.ict, r.total].map((v, i) => (
                        <td key={i} style={{ padding: "10px 8px", textAlign: "center", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>{v}</td>
                      ))}
                      <td style={{ padding: "10px 8px", textAlign: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: ac }}>{r.avg}</span>
                      </td>
                      <td style={{ padding: "10px 8px", textAlign: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 12, background: gc.bg, color: gc.color }}>{r.grade}</span>
                      </td>
                      <td style={{ padding: "10px 8px", fontSize: 12, color: "#6b7280", textAlign: "center" }}>{r.remark}</td>
                      <td style={{ padding: "10px 8px" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={13} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to 8 of <strong>39</strong> students</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
              ))}
              <span style={{ color: "#9ca3af" }}>…</span>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>5</button>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
              <div style={{ position: "relative", marginLeft: 8 }}>
                <select style={{ appearance: "none", padding: "5px 24px 5px 9px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                  <option>10 / page</option><option>25 / page</option>
                </select>
                <ChevronDown size={10} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Class Performance Overview</div>
            <ClassPerfChart />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "#7c3aed" }} />
              <span style={{ fontSize: 10.5, color: "#6b7280" }}>Class Average</span>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Subject Performance Distribution</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <SubjectDistDonut />
              <div style={{ flex: 1 }}>
                {[
                  { label: "A (80-100%)", count: 12, pct: "30.8%", color: "#16a34a" },
                  { label: "B (70-79%)", count: 16, pct: "41.0%", color: "#2563eb" },
                  { label: "C (60-69%)", count: 7, pct: "17.9%", color: "#d97706" },
                  { label: "D (Below 50%)", count: 4, pct: "10.3%", color: "#dc2626" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10.5, color: "#374151", flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>AI Insights</span>
              <span style={{ fontSize: 10, background: "#ede9fe", color: "#7c3aed", fontWeight: 600, padding: "2px 7px", borderRadius: 8 }}>BETA</span>
            </div>
            {[
              { icon: "🎉", color: "#16a34a", bg: "#f0fdf4", text: "Great job! 12 students (30.8%) scored above 80%." },
              { icon: "⚠️", color: "#d97706", bg: "#fefce8", text: "6 students are at risk of not meeting term targets. Provide extra support." },
              { icon: "📈", color: "#2563eb", bg: "#eff6ff", text: "Science scores improved by 8% compared to last term." },
            ].map((ins, i) => (
              <div key={i} style={{ background: ins.bg, borderRadius: 8, padding: "8px 10px", marginBottom: 7 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{ins.icon}</span>
                  <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.4 }}>{ins.text}</span>
                </div>
              </div>
            ))}
            <button style={{ width: "100%", padding: "8px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Sparkles size={13} /> Generate AI Report Comments
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 270, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Student Details</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{selected.initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{selected.sid}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>P6 - Topaz</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 12, background: "#dcfce7", color: "#16a34a" }}>Active</span>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 14px" }}>
          {studentPanelTabs.map((t) => (
            <button key={t} style={{ padding: "8px 6px", fontSize: 11, fontWeight: t === "Performance" ? 600 : 400, color: t === "Performance" ? "#7c3aed" : "#9ca3af", background: "none", border: "none", borderBottom: t === "Performance" ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer" }}>{t}</button>
          ))}
        </div>

        <div style={{ padding: "14px", flex: 1 }}>
          {/* Performance Summary */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Performance Summary</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <PerformanceDonut pct={Math.round(parseFloat(selected.avg))} />
              </div>
              <div>
                {[
                  ["Total Score", `${selected.total} / 100`],
                  ["Class Rank", "1 of 39"],
                  ["Position", "Top 2%"],
                  ["Improvement", "↑ 12%"],
                ].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: k === "Improvement" ? "#16a34a" : "#111827" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Breakdown */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Subject Breakdown</span>
              <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View Details</button>
            </div>
            {subjects.map((sub) => (
              <div key={sub.name} style={{ marginBottom: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11.5, color: "#374151" }}>{sub.name}</span>
                  <span style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 600 }}>{sub.score}%</span>
                </div>
                <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3 }}>
                  <div style={{ width: `${sub.score}%`, height: "100%", background: "linear-gradient(90deg,#7c3aed,#4f46e5)", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Term Trend */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Term Trend</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>This Term</span>
            </div>
            <TermTrendChart />
          </div>

          {/* Actions */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Actions</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "7px", borderRadius: 7, border: "1px solid #e5e7eb", background: "white", fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#374151" }}>
                <Send size={12} color="#7c3aed" /> Send to Parent
              </button>
              <button style={{ flex: 1, padding: "7px", borderRadius: 7, border: "1px solid #e5e7eb", background: "white", fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#374151" }}>
                <FileText size={12} color="#7c3aed" /> Add Note
              </button>
            </div>
          </div>

          {/* AI Comment */}
          <div style={{ background: "#faf5ff", borderRadius: 10, padding: "12px", border: "1px solid #e9d5ff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
              <Sparkles size={13} color="#7c3aed" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>AI Report Comment (Preview)</span>
            </div>
            <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.5, margin: "0 0 10px" }}>
              {selected.name} has shown excellent performance this term. He demonstrates strong understanding in Mathematics and ICT. Keep up the great work!
            </p>
            <button style={{ width: "100%", padding: "7px", borderRadius: 7, border: "none", background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Use This Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
