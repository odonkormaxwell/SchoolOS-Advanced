import React, { useEffect, useRef } from "react";
import { Bus } from "lucide-react";

export default function TransportStatus() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;

      const options = {
        chart: {
          type: "radialBar",
          height: 140,
          toolbar: { show: false },
        },
        series: [Math.round((16 / 18) * 100)],
        plotOptions: {
          radialBar: {
            hollow: { size: "55%" },
            dataLabels: {
              show: true,
              name: { show: false },
              value: {
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
                formatter: () => "16/18",
              },
            },
            track: { background: "#f3f4f6" },
          },
        },
        colors: ["#7c3aed"],
        stroke: { lineCap: "round" },
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Bus size={14} color="#6b7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Transport Status</span>
        </div>
        <button style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
          View All
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Radial chart */}
        <div style={{ width: 120, flexShrink: 0 }} ref={chartRef} />

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 2 }}>
            Buses On Route
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12 }}>
            2 buses in school compound
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "On Time", value: 15, color: "#22c55e" },
              { label: "Delayed", value: 1, color: "#f59e0b" },
              { label: "Not Started", value: 2, color: "#ef4444" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />
                  <span style={{ fontSize: 11.5, color: "#6b7280" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
