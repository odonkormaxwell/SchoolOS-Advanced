import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

type Period = "This Week" | "Last Week" | "This Month";

const periodData: Record<Period, { days: string[]; values: number[]; avg: number }> = {
  "This Week": {
    days: ["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17"],
    values: [91, 93, 87, 94, 90],
    avg: 91.0,
  },
  "Last Week": {
    days: ["Mon 6", "Tue 7", "Wed 8", "Thu 9", "Fri 10"],
    values: [89, 92, 95, 88, 91],
    avg: 91.0,
  },
  "This Month": {
    days: ["Wk 1 (1–3)", "Wk 2 (6–10)", "Wk 3 (13–17)", "Wk 4 (20–24)"],
    values: [91.4, 92.6, 91.0, 0],
    avg: 91.7,
  },
};

const periods: Period[] = ["This Week", "Last Week", "This Month"];

export default function AttendanceChart() {
  const { onNavigate } = useApp();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [period, setPeriod] = useState<Period>("This Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;
      const data = periodData[period];

      const options = {
        chart: {
          type: "bar", height: 185, toolbar: { show: false }, zoom: { enabled: false },
          parentHeightOffset: 0, animations: { enabled: true, speed: 400 },
        },
        series: [{ name: "Attendance %", data: data.values }],
        xaxis: {
          categories: data.days,
          labels: { style: { fontSize: "9px", colors: "#9ca3af" } },
          axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: {
          min: 0, max: 100, tickAmount: 5,
          labels: { style: { fontSize: "10px", colors: "#9ca3af" }, formatter: (val: number) => `${val}%` },
        },
        colors: ["#4ade80"],
        fill: {
          type: "gradient",
          gradient: { shade: "light", type: "vertical", shadeIntensity: 0.2, gradientToColors: ["#86efac"], opacityFrom: 1, opacityTo: 0.88 },
        },
        plotOptions: { bar: { borderRadius: 5, columnWidth: "50%", dataLabels: { position: "top" } } },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => val > 0 ? `${val}%` : "—",
          offsetY: -18,
          style: { fontSize: "10px", colors: ["#374151"], fontWeight: 600 },
          background: { enabled: false },
        },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 4, xaxis: { lines: { show: false } } },
        tooltip: { y: { formatter: (val: number) => `${val}%` } },
        legend: { show: false },
      };

      if (chartRef.current) {
        if (chartInstance.current) chartInstance.current.destroy();
        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    };
    load();
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [period]);

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    if (dropdownOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);

  const avg = periodData[period].avg;

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Student Attendance</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>Avg {avg}% · {period.toLowerCase()}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 500 }}
            >
              {period} <ChevronDown size={11} style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", top: 32, right: 0, background: "white", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", zIndex: 50, minWidth: 130, animation: "fadeIn 0.12s ease" }}>
                {periods.map((p) => (
                  <div
                    key={p}
                    onClick={(e) => { e.stopPropagation(); setPeriod(p); setDropdownOpen(false); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", cursor: "pointer", fontSize: 12.5, color: p === period ? "#7c3aed" : "#374151", fontWeight: p === period ? 600 : 400, background: p === period ? "#f5f3ff" : "white" }}
                    onMouseEnter={(e) => { if (p !== period) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = p === period ? "#f5f3ff" : "white"; }}
                  >
                    {p} {p === period && <Check size={13} color="#7c3aed" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigate("attendance")}
            style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
          >
            View Report →
          </button>
        </div>
      </div>
      <div ref={chartRef} />
    </div>
  );
}
