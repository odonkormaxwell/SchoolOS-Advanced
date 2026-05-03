import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Period = "This Week" | "This Month" | "This Term" | "Last Month";

const periodData: Record<Period, { categories: string[]; collected: number[]; target: number[]; yMax: number; label: string }> = {
  "This Week": {
    categories: ["Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17"],
    collected: [8200, 14500, 12800, 19600, 27400],
    target: [12000, 18000, 16000, 22000, 32000],
    yMax: 40000,
    label: "GH₵ 82,500 collected this week",
  },
  "This Month": {
    categories: ["1 May", "5 May", "10 May", "15 May", "20 May", "25 May", "31 May"],
    collected: [20000, 45000, 75000, 95000, 110000, 130000, 148000],
    target: [30000, 60000, 90000, 110000, 125000, 140000, 150000],
    yMax: 160000,
    label: "GH₵ 148,000 collected this month",
  },
  "This Term": {
    categories: ["Jan", "Feb", "Mar", "Apr", "May"],
    collected: [280000, 310000, 295000, 320000, 148000],
    target: [300000, 320000, 310000, 330000, 350000],
    yMax: 380000,
    label: "GH₵ 1,353,000 collected this term",
  },
  "Last Month": {
    categories: ["1 Apr", "5 Apr", "10 Apr", "15 Apr", "20 Apr", "25 Apr", "30 Apr"],
    collected: [18000, 38000, 62000, 84000, 100000, 116000, 128000],
    target: [25000, 55000, 85000, 105000, 120000, 130000, 140000],
    yMax: 150000,
    label: "GH₵ 128,000 collected last month",
  },
};

const periods: Period[] = ["This Week", "This Month", "This Term", "Last Month"];

export default function FeeCollectionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [period, setPeriod] = useState<Period>("This Month");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;
      const data = periodData[period];

      const options = {
        chart: { type: "area", height: 160, toolbar: { show: false }, zoom: { enabled: false }, animations: { enabled: true, speed: 400 } },
        series: [
          { name: "Collected", data: data.collected },
          { name: "Target", data: data.target },
        ],
        xaxis: {
          categories: data.categories,
          labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
          axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            style: { fontSize: "10px", colors: "#9ca3af" },
            formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(val),
          },
          tickAmount: 4, min: 0, max: data.yMax,
        },
        colors: ["#7c3aed", "#a5b4fc"],
        fill: {
          type: ["gradient", "gradient"],
          gradient: { shadeIntensity: 1, opacityFrom: [0.25, 0.1], opacityTo: [0.02, 0.02], stops: [0, 95] },
        },
        stroke: { curve: "smooth", width: [2, 1.5], dashArray: [0, 4] },
        legend: {
          show: true, position: "top", horizontalAlign: "left",
          markers: { size: 6, shape: "circle" },
          labels: { colors: "#6b7280" }, fontSize: "11px", offsetY: -4,
        },
        grid: { borderColor: "#f3f4f6", strokeDashArray: 4, xaxis: { lines: { show: false } } },
        tooltip: { y: { formatter: (val: number) => `GH₵ ${val.toLocaleString()}` } },
        dataLabels: { enabled: false },
        markers: { size: 0 },
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

  const data = periodData[period];

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Fee Collection Overview</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{data.label}</div>
        </div>
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
            style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151",
              background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "5px 10px", cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {period} <ChevronDown size={11} style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>
          {dropdownOpen && (
            <div style={{
              position: "absolute", top: 32, right: 0, background: "white", borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb",
              zIndex: 50, minWidth: 140, animation: "fadeIn 0.12s ease",
            }}>
              {periods.map((p) => (
                <div
                  key={p}
                  onClick={(e) => { e.stopPropagation(); setPeriod(p); setDropdownOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", fontSize: 12.5,
                    color: p === period ? "#7c3aed" : "#374151",
                    fontWeight: p === period ? 600 : 400,
                    background: p === period ? "#f5f3ff" : "white",
                  }}
                  onMouseEnter={(e) => { if (p !== period) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = p === period ? "#f5f3ff" : "white"; }}
                >
                  {p}
                  {p === period && <Check size={13} color="#7c3aed" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div ref={chartRef} />
    </div>
  );
}
