import React, { useEffect, useRef } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

const feesByClass = [
  { class: "P1 - Coral", amount: "GH₵ 6,500", value: 6500, color: "#f87171" },
  { class: "P2 - Pearl", amount: "GH₵ 7,850", value: 7850, color: "#fbbf24" },
  { class: "P3 - Emerald", amount: "GH₵ 8,900", value: 8900, color: "#34d399" },
  { class: "P4 - Ruby", amount: "GH₵ 9,600", value: 9600, color: "#60a5fa" },
  { class: "P5 - Diamond", amount: "GH₵ 8,000", value: 8000, color: "#a78bfa" },
  { class: "P6 - Topaz", amount: "GH₵ 7,000", value: 7000, color: "#fb923c" },
];

export default function OutstandingFeesChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;

      const options = {
        chart: {
          type: "donut",
          height: 200,
          toolbar: { show: false },
        },
        series: feesByClass.map((f) => f.value),
        labels: feesByClass.map((f) => f.class),
        colors: feesByClass.map((f) => f.color),
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "11px",
                  color: "#6b7280",
                  offsetY: 20,
                },
                value: {
                  show: true,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#111827",
                  offsetY: -16,
                  formatter: () => "GH₵ 47,850",
                },
                total: {
                  show: true,
                  label: "Total",
                  fontSize: "11px",
                  color: "#6b7280",
                  fontWeight: 400,
                  formatter: () => "GH₵ 47,850",
                },
              },
            },
          },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        stroke: { width: 2, colors: ["white"] },
        tooltip: {
          y: {
            formatter: (val: number) => `GH₵ ${val.toLocaleString()}`,
          },
        },
      };

      if (chartRef.current) {
        if (chartInstance.current) chartInstance.current.destroy();
        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    };
    load();
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #f3f4f6",
        flex: 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Outstanding Fees by Class</div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "#6b7280",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          This Term <ChevronDown size={11} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Donut */}
        <div style={{ width: 180, flexShrink: 0 }} ref={chartRef} />

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {feesByClass.map((f) => (
            <div key={f.class} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: f.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: "#6b7280" }}>{f.class}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{f.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          color: "#7c3aed",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
          padding: 0,
        }}
      >
        View Full Report <ArrowRight size={13} />
      </button>
    </div>
  );
}
