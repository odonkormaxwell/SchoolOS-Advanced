import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function FeeCollectionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    let ApexCharts: any;
    const load = async () => {
      const mod = await import("apexcharts");
      ApexCharts = mod.default;

      const options = {
        chart: {
          type: "area",
          height: 160,
          toolbar: { show: false },
          sparkline: { enabled: false },
          zoom: { enabled: false },
        },
        series: [
          {
            name: "Collected",
            data: [20000, 45000, 75000, 95000, 110000, 130000, 148000],
          },
          {
            name: "Target",
            data: [30000, 60000, 90000, 110000, 125000, 140000, 150000],
          },
        ],
        xaxis: {
          categories: ["1 May", "5 May", "10 May", "15 May", "20 May", "25 May", "31 May"],
          labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            style: { fontSize: "10px", colors: "#9ca3af" },
            formatter: (val: number) => {
              if (val >= 1000) return `${val / 1000}k`;
              return String(val);
            },
          },
          tickAmount: 4,
          min: 0,
          max: 150000,
        },
        colors: ["#7c3aed", "#a5b4fc"],
        fill: {
          type: ["gradient", "gradient"],
          gradient: {
            shadeIntensity: 1,
            opacityFrom: [0.25, 0.1],
            opacityTo: [0.02, 0.02],
            stops: [0, 95],
          },
        },
        stroke: {
          curve: "smooth",
          width: [2, 1.5],
          dashArray: [0, 4],
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          markers: { size: 6, shape: "circle" },
          labels: { colors: "#6b7280" },
          fontSize: "11px",
          offsetY: -4,
        },
        grid: {
          borderColor: "#f3f4f6",
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
        },
        tooltip: {
          y: {
            formatter: (val: number) => `GH₵ ${val.toLocaleString()}`,
          },
        },
        dataLabels: { enabled: false },
        markers: { size: 0 },
      };

      if (chartRef.current) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    };
    load();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Fee Collection Overview</div>
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
          This Month <ChevronDown size={11} />
        </button>
      </div>
      <div ref={chartRef} />
    </div>
  );
}
