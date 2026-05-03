import React, { useEffect, useRef } from "react";

export default function AttendanceChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const mod = await import("apexcharts");
      const ApexCharts = mod.default;

      const days = ["Mon 9 May", "Tue 10 May", "Wed 11 May", "Thu 12 May", "Fri 13 May"];
      const values = [94, 91, 92, 90, 93];

      const options = {
        chart: {
          type: "bar",
          height: 185,
          toolbar: { show: false },
          zoom: { enabled: false },
          parentHeightOffset: 0,
        },
        series: [{ name: "Attendance", data: values }],
        xaxis: {
          categories: days,
          labels: { style: { fontSize: "9px", colors: "#9ca3af" } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          min: 0,
          max: 100,
          tickAmount: 5,
          labels: {
            style: { fontSize: "10px", colors: "#9ca3af" },
            formatter: (val: number) => `${val}%`,
          },
        },
        colors: ["#4ade80"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.2,
            gradientToColors: ["#86efac"],
            opacityFrom: 1,
            opacityTo: 0.88,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            columnWidth: "50%",
            dataLabels: { position: "top" },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val}%`,
          offsetY: -18,
          style: { fontSize: "10px", colors: ["#374151"], fontWeight: 600 },
          background: { enabled: false },
        },
        grid: {
          borderColor: "#f3f4f6",
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
        },
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          Student Attendance (This Week)
        </div>
        <button
          style={{
            fontSize: 11,
            color: "#7c3aed",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          View Report
        </button>
      </div>
      <div ref={chartRef} />
    </div>
  );
}
