import { useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, Search, Download, MoreVertical, Sparkles, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const gradeRows = [
  { rank: 1, name: "Kofi Junior Asante", sid: "STU-2024-0012", eng: 17, maths: 18, sci: 16, soc: 17, ict: 17, total: 85, avg: "88.0%", grade: "A", remark: "Excellent", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { rank: 2, name: "Ama Serwaa Ofori", sid: "STU-2024-0013", eng: 15, maths: 15, sci: 16, soc: 16, ict: 17, total: 79, avg: "79.0%", grade: "B", remark: "Very Good", initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { rank: 3, name: "Daniel Nii Lartey", sid: "STU-2024-0014", eng: 13, maths: 14, sci: 12, soc: 14, ict: 13, total: 66, avg: "66.0%", grade: "C", remark: "Good", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { rank: 4, name: "Akosua Adwoa Mensah", sid: "STU-2024-0015", eng: 16, maths: 17, sci: 15, soc: 15, ict: 16, total: 79, avg: "79.0%", grade: "B", remark: "Very Good", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { rank: 5, name: "Yaw Antwi Boakye", sid: "STU-2024-0016", eng: 12, maths: 13, sci: 11, soc: 11, ict: 13, total: 60, avg: "60.0%", grade: "C", remark: "Satisfactory", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { rank: 6, name: "Efua Korkor Lamptey", sid: "STU-2024-0017", eng: 18, maths: 19, sci: 17, soc: 18, ict: 18, total: 90, avg: "91.0%", grade: "A", remark: "Excellent", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { rank: 7, name: "Michael Kojo Addo", sid: "STU-2024-0018", eng: 10, maths: 9, sci: 9, soc: 10, ict: 10, total: 48, avg: "48.0%", grade: "D", remark: "Needs Improvement", initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
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
      if (!ref.current) return;
      chart = new ApexCharts(ref.current, {
        chart: { type: "radialBar", height: 120, toolbar: { show: false } },
        series: [pct], colors: ["#7c3aed"], labels: ["Score"],
        plotOptions: { radialBar: { hollow: { size: "55%" }, dataLabels: { name: { show: false }, value: { fontSize: "18px", fontWeight: 700, color: "#111827", formatter: (v: number) => `${v}%` } } } },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, [pct]);
  return <div ref={ref} />;
}

function ClassPerfChart() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: any;
    import("apexcharts").then(({ default: ApexCharts }) => {
      if (!ref.current) return;
      chart = new ApexCharts(ref.current, {
        chart: { type: "bar", height: 130, toolbar: { show: false }, animations: { enabled: false } },
        series: [{ name: "Average %", data: [76, 72, 74, 76, 81] }],
        xaxis: { categories: ["Eng", "Maths", "Science", "Soc.", "ICT"], labels: { style: { fontSize: "9px" } }, axisBorder: { show: false } },
        yaxis: { min: 50, max: 100, labels: { style: { fontSize: "9px" } }, tickAmount: 3 },
        colors: ["#7c3aed"], plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
        legend: { show: false }, grid: { borderColor: "#f3f4f6", strokeDashArray: 3 }, dataLabels: { enabled: false },
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
      if (!ref.current) return;
      chart = new ApexCharts(ref.current, {
        chart: { type: "donut", height: 140, toolbar: { show: false } },
        series: [12, 16, 7, 4], labels: ["A (80+%)", "B (70-79%)", "C (60-69%)", "D (<50%)"],
        colors: ["#16a34a", "#2563eb", "#d97706", "#dc2626"], legend: { show: false },
        plotOptions: { pie: { donut: { size: "60%", labels: { show: true, total: { show: true, label: "39", fontSize: "14px", fontWeight: 700, color: "#111827" } } } } },
        dataLabels: { enabled: false },
      });
      chart.render();
    });
    return () => { try { chart?.destroy(); } catch {} };
  }, []);
  return <div ref={ref} />;
}

export default function Gradebook() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [selected, setSelected] = useState(gradeRows[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Gradebook");
  const [aiLoading, setAiLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const pageTabs = isMobile
    ? ["Gradebook", "Analytics", "Rankings"]
    : ["Overview", "Continuous Assessment", "Exams", "Gradebook", "Rankings", "Analytics", "BECE Readiness"];

  const handleAiReport = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      showToast("AI report comments generated for 39 students!", "success");
    }, 2200);
  };

  const handleExport = () => showToast("Exporting gradebook to Excel...", "success");

  return (
    <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: isMobile ? "visible" : "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Gradebook</h1>
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                {["Dashboard", "Academics", "Gradebook"].map((c, i, a) => (
                  <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                    {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Download size={13} color="#6b7280" />{!isMobile && " Export"}
            </button>
            <button onClick={handleAiReport} disabled={aiLoading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: aiLoading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: aiLoading ? "not-allowed" : "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Sparkles size={13} />{isMobile ? "" : aiLoading ? " Generating..." : " AI Comments"}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)", gap: 10 }}>
          {[
            { label: "Class", value: "P6 - Topaz", sub: "39 Students", icon: "🏫", iconBg: "#ede9fe", iconColor: "#7c3aed" },
            { label: "Average Score", value: "76.4%", sub: "+4.8% vs last term", icon: "🎓", iconBg: "#dcfce7", iconColor: "#16a34a" },
            { label: "Top Student", value: "Kofi Asante", sub: "88.0%", icon: "⭐", iconBg: "#fef3c7", iconColor: "#d97706" },
            { label: "Pass Rate", value: "92.3%", sub: "36 / 39 Students", icon: "📈", iconBg: "#dbeafe", iconColor: "#2563eb" },
            { label: "At Risk", value: "6 Students", sub: "Need attention", icon: "⚠️", iconBg: "#fee2e2", iconColor: "#dc2626" },
          ].map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 1 }}>{k.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.iconColor, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Page tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {pageTabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "7px 6px", fontSize: isMobile ? 11 : 11.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "white" : "#6b7280", background: activeTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap", minWidth: "fit-content" }}>{t}</button>
          ))}
        </div>

        {/* Filters + Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {!isMobile && (
              <>
                {[
                  ["First Term (2024/2025)", "Second Term", "Third Term"],
                  ["All Subjects", "English", "Maths", "Science"],
                ].map((opts, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <select style={{ appearance: "none", padding: "7px 22px 7px 9px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                      {opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={10} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                ))}
              </>
            )}
            <div style={{ position: "relative", flex: 1, minWidth: 140 }}>
              <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input placeholder="Search student..." style={{ width: "100%", padding: "7px 10px 7px 27px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 12, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
            </div>
            {!isMobile && (
              <button onClick={handleExport} style={{ padding: "7px 12px", border: "none", borderRadius: 7, background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                <Download size={12} /> Export
              </button>
            )}
          </div>

          {/* Mobile card list */}
          {isMobile ? (
            <div style={{ padding: "10px 12px" }}>
              {gradeRows.map((r) => {
                const gc = gradeColor(r.grade);
                const ac = avgColor(r.avg);
                return (
                  <div key={r.rank} onClick={() => { setSelected(r); setShowPanel(true); }}
                    style={{ background: selected.sid === r.sid ? "#faf5ff" : "white", border: `1px solid ${selected.sid === r.sid ? "#ede9fe" : "#f3f4f6"}`, borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.avatarBg, color: r.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{r.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 12, background: gc.bg, color: gc.color, flexShrink: 0 }}>{r.grade}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.sid}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: ac }}>{r.avg}</div>
                      <div style={{ fontSize: 10.5, color: "#9ca3af" }}>#{r.rank}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                    <th style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", width: 30 }}>#</th>
                    <th style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left" }}>STUDENT</th>
                    {["ENG (20)", "MATHS (20)", "SCI (20)", "SOC (20)", "ICT (20)", "TOTAL", "AVG", "GRADE", "REMARK"].map((c) => (
                      <th key={c} style={{ padding: "10px 8px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textAlign: "center", whiteSpace: "nowrap" }}>{c}</th>
                    ))}
                    <th style={{ padding: "10px 8px" }}></th>
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
                        <td style={{ padding: "10px 8px", textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: ac }}>{r.avg}</span></td>
                        <td style={{ padding: "10px 8px", textAlign: "center" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 12, background: gc.bg, color: gc.color }}>{r.grade}</span></td>
                        <td style={{ padding: "10px 8px", fontSize: 11.5, color: "#6b7280", textAlign: "center" }}>{r.remark}</td>
                        <td style={{ padding: "10px 8px" }}><button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><MoreVertical size={13} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to 8 of <strong>39</strong> students</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 28, height: 28, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
              ))}
              <button style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>

        {/* Bottom charts */}
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Class Performance</div>
              <ClassPerfChart />
            </div>
            <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Grade Distribution</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <SubjectDistDonut />
                <div style={{ flex: 1 }}>
                  {[{ label: "A (80+%)", count: 12, pct: "30.8%", color: "#16a34a" }, { label: "B (70-79%)", count: 16, pct: "41.0%", color: "#2563eb" }, { label: "C (60-69%)", count: 7, pct: "17.9%", color: "#d97706" }, { label: "D (<50%)", count: 4, pct: "10.3%", color: "#dc2626" }].map((item) => (
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
                { icon: "🎉", color: "#16a34a", bg: "#f0fdf4", text: "12 students (30.8%) scored above 80% this term." },
                { icon: "⚠️", color: "#d97706", bg: "#fefce8", text: "6 students need extra support to meet term targets." },
                { icon: "📈", color: "#2563eb", bg: "#eff6ff", text: "Science scores improved by 8% vs. last term." },
              ].map((ins, i) => (
                <div key={i} style={{ background: ins.bg, borderRadius: 8, padding: "8px 10px", marginBottom: 7 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{ins.icon}</span>
                    <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.4 }}>{ins.text}</span>
                  </div>
                </div>
              ))}
              <button onClick={handleAiReport} disabled={aiLoading} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "none", background: aiLoading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontSize: 12, fontWeight: 600, cursor: aiLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Sparkles size={13} /> {aiLoading ? "Generating..." : "Generate AI Report Comments"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel — Desktop */}
      {!isMobile && (
        <div style={{ width: 270, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Student Details</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{selected.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{selected.sid}</div>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: "#dcfce7", color: "#16a34a" }}>Active</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "14px", flex: 1 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Performance Summary</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}><PerformanceDonut pct={Math.round(parseFloat(selected.avg))} /></div>
                <div>
                  {[["Total", `${selected.total} / 100`], ["Rank", `#${selected.rank} of 39`], ["Grade", selected.grade], ["Remark", selected.remark]].map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{k}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#111827" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Subject Scores</div>
              {[["English Language", selected.eng, 20], ["Mathematics", selected.maths, 20], ["Integrated Science", selected.sci, 20], ["Social Studies", selected.soc, 20], ["ICT", selected.ict, 20]].map(([subject, score, max]) => (
                <div key={subject as string} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11.5, color: "#374151" }}>{subject}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#111827" }}>{score}/{max}</span>
                  </div>
                  <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3 }}>
                    <div style={{ width: `${((score as number) / (max as number)) * 100}%`, height: "100%", background: "#7c3aed", borderRadius: 3, transition: "width 0.3s" }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => showToast(`Viewing full report for ${selected.name}`, "info")} style={{ width: "100%", padding: "9px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              View Full Report
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "12px auto 0" }} />
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{selected.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>P6 - Topaz · #{selected.rank}</div>
                  </div>
                </div>
                <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                {[{ label: "Total", value: `${selected.total}/100` }, { label: "Average", value: selected.avg }, { label: "Grade", value: selected.grade }].map((item) => (
                  <div key={item.label} style={{ textAlign: "center", background: "#f9fafb", borderRadius: 8, padding: "10px" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{item.value}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              {[["English Language", selected.eng, 20], ["Mathematics", selected.maths, 20], ["Science", selected.sci, 20], ["Social Studies", selected.soc, 20], ["ICT", selected.ict, 20]].map(([subject, score, max]) => (
                <div key={subject as string} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{subject}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{score}/{max}</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3 }}>
                    <div style={{ width: `${((score as number) / (max as number)) * 100}%`, height: "100%", background: "#7c3aed", borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
