import { useEffect, useRef } from "react";
import { Bus, ArrowRight } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { useApp } from "../context/AppContext";

export default function TransportStatus() {
  const { onNavigate } = useApp();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;
      const options: ApexOptions = {
        chart: { type: "radialBar", height: 140, toolbar: { show: false } },
        series: [Math.round((16 / 18) * 100)],
        plotOptions: {
          radialBar: {
            hollow: { size: "55%" },
            dataLabels: {
              show: true,
              name: { show: false },
              value: { fontSize: "16px", fontWeight: 700, color: "#111827", formatter: () => "16/18" },
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
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  const stats = [
    { label: "On Time", value: 15, color: "#22c55e" },
    { label: "Delayed", value: 1, color: "#f59e0b" },
    { label: "In Compound", value: 2, color: "#6b7280" },
  ];

  const buses = [
    { id: "Bus 01", route: "Route A – Dansoman", status: "On Route", eta: "8 min", statusColor: "#16a34a", statusBg: "#dcfce7" },
    { id: "Bus 07", route: "Route D – Achimota", status: "Delayed", eta: "22 min", statusColor: "#d97706", statusBg: "#fef3c7" },
  ];

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Bus size={14} color="#6b7280" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Transport Status</span>
        </div>
        <button onClick={() => onNavigate("transport")} style={{ fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
          View All →
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 120, flexShrink: 0 }} ref={chartRef} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 2 }}>Buses On Route</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>2 buses in school compound</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stats.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: 11.5, color: "#6b7280" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live bus cards */}
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {buses.map((b) => (
          <div
            key={b.id}
            onClick={() => onNavigate("transport")}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 8, background: "#f9fafb", cursor: "pointer", transition: "background 0.12s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
          >
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "#111827" }}>{b.id}</div>
              <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{b.route}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: b.statusBg, color: b.statusColor }}>{b.status}</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>ETA {b.eta}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate("transport")}
        style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
      >
        Track all buses <ArrowRight size={13} />
      </button>
    </div>
  );
}
