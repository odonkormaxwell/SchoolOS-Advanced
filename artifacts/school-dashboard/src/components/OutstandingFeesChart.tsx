import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowRight, Check } from "lucide-react";
import { useApp } from "../context/AppContext";

type Term = "This Term" | "Last Term" | "Prev Term";

const termData: Record<Term, { classes: { class: string; amount: string; value: number; color: string }[]; total: string }> = {
  "This Term": {
    total: "GH₵ 47,850",
    classes: [
      { class: "P1 - Coral",   amount: "GH₵ 6,500",  value: 6500,  color: "#f87171" },
      { class: "P2 - Pearl",   amount: "GH₵ 7,850",  value: 7850,  color: "#fbbf24" },
      { class: "P3 - Emerald", amount: "GH₵ 8,900",  value: 8900,  color: "#34d399" },
      { class: "P4 - Ruby",    amount: "GH₵ 9,600",  value: 9600,  color: "#60a5fa" },
      { class: "P5 - Diamond", amount: "GH₵ 8,000",  value: 8000,  color: "#a78bfa" },
      { class: "P6 - Topaz",   amount: "GH₵ 7,000",  value: 7000,  color: "#fb923c" },
    ],
  },
  "Last Term": {
    total: "GH₵ 55,200",
    classes: [
      { class: "P1 - Coral",   amount: "GH₵ 7,800",  value: 7800,  color: "#f87171" },
      { class: "P2 - Pearl",   amount: "GH₵ 9,200",  value: 9200,  color: "#fbbf24" },
      { class: "P3 - Emerald", amount: "GH₵ 10,100", value: 10100, color: "#34d399" },
      { class: "P4 - Ruby",    amount: "GH₵ 11,400", value: 11400, color: "#60a5fa" },
      { class: "P5 - Diamond", amount: "GH₵ 9,500",  value: 9500,  color: "#a78bfa" },
      { class: "P6 - Topaz",   amount: "GH₵ 7,200",  value: 7200,  color: "#fb923c" },
    ],
  },
  "Prev Term": {
    total: "GH₵ 62,400",
    classes: [
      { class: "P1 - Coral",   amount: "GH₵ 8,900",  value: 8900,  color: "#f87171" },
      { class: "P2 - Pearl",   amount: "GH₵ 10,600", value: 10600, color: "#fbbf24" },
      { class: "P3 - Emerald", amount: "GH₵ 11,800", value: 11800, color: "#34d399" },
      { class: "P4 - Ruby",    amount: "GH₵ 13,200", value: 13200, color: "#60a5fa" },
      { class: "P5 - Diamond", amount: "GH₵ 10,400", value: 10400, color: "#a78bfa" },
      { class: "P6 - Topaz",   amount: "GH₵ 7,500",  value: 7500,  color: "#fb923c" },
    ],
  },
};

const terms: Term[] = ["This Term", "Last Term", "Prev Term"];

export default function OutstandingFeesChart() {
  const { onNavigate } = useApp();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [term, setTerm] = useState<Term>("This Term");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;
      const data = termData[term];

      const options = {
        chart: { type: "donut" as const, height: 200, toolbar: { show: false }, animations: { enabled: true, speed: 400 } },
        series: data.classes.map((f) => f.value),
        labels: data.classes.map((f) => f.class),
        colors: data.classes.map((f) => f.color),
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                name: { show: true, fontSize: "11px", color: "#6b7280", offsetY: 20 },
                value: { show: true, fontSize: "14px", fontWeight: 700, color: "#111827", offsetY: -16, formatter: () => data.total },
                total: { show: true, label: "Total", fontSize: "11px", color: "#6b7280", fontWeight: 400, formatter: () => data.total },
              },
            },
          },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        stroke: { width: 2, colors: ["white"] },
        tooltip: { y: { formatter: (val: number) => `GH₵ ${val.toLocaleString()}` } },
      };

      if (chartRef.current) {
        if (chartInstance.current) chartInstance.current.destroy();
        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    };
    load();
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [term]);

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    if (dropdownOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);

  const data = termData[term];

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Outstanding Fees by Class</div>
          <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 500, marginTop: 1 }}>{data.total} total outstanding</div>
        </div>
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 500 }}
          >
            {term} <ChevronDown size={11} style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>
          {dropdownOpen && (
            <div style={{ position: "absolute", top: 32, right: 0, background: "white", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", zIndex: 50, minWidth: 130, animation: "fadeIn 0.12s ease" }}>
              {terms.map((t) => (
                <div
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setTerm(t); setDropdownOpen(false); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", cursor: "pointer", fontSize: 12.5, color: t === term ? "#7c3aed" : "#374151", fontWeight: t === term ? 600 : 400, background: t === term ? "#f5f3ff" : "white" }}
                  onMouseEnter={(e) => { if (t !== term) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = t === term ? "#f5f3ff" : "white"; }}
                >
                  {t} {t === term && <Check size={13} color="#7c3aed" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 180, flexShrink: 0 }} ref={chartRef} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {data.classes.map((f) => (
            <div key={f.class} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#6b7280" }}>{f.class}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{f.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNavigate("billing")}
        style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
      >
        View Full Report <ArrowRight size={13} />
      </button>
    </div>
  );
}
