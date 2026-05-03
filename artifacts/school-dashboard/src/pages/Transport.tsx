import { useState } from "react";
import {
  Plus, Settings, ChevronDown, ChevronRight, MoreVertical,
  AlertCircle, Clock, Users, MapPin, Zap, Bell,
} from "lucide-react";

const kpiCards = [
  { label: "Active Buses", value: "12 / 15", sub: "In operation", icon: "🚌", iconBg: "#dbeafe", color: "#2563eb" },
  { label: "Students Transported", value: "326", sub: "Today", icon: "👥", iconBg: "#dcfce7", color: "#16a34a" },
  { label: "On Trip (Now)", value: "8", sub: "Buses on the road", icon: "🚐", iconBg: "#fef3c7", color: "#d97706" },
  { label: "Completed Trips", value: "18", sub: "Today", icon: "✅", iconBg: "#dcfce7", color: "#16a34a" },
  { label: "Pending Pickups", value: "23", sub: "Students", icon: "⏳", iconBg: "#fee2e2", color: "#dc2626" },
  { label: "Alerts", value: "3", sub: "Requires attention", icon: "🔔", iconBg: "#ffe4e6", color: "#dc2626" },
];

const buses = [
  { id: "BUS 01 - KAS 123-21", driver: "Kofi Adjei", route: "Route A", status: "On Trip", location: "Near A&C Mall", nextStop: "North Legon", eta: "8 min", students: 38 },
  { id: "BUS 03 - KAS 456-21", driver: "Madina Zongo", route: "Route B", status: "On Trip", location: "Atomic Junction", nextStop: "Madina Zongo", eta: "12 min", students: 41 },
  { id: "BUS 05 - KAS 789-21", driver: "Abdul Rahman", route: "Route C", status: "On Trip", location: "Haatso Overpass", nextStop: "Haatso", eta: "6 min", students: 35 },
  { id: "BUS 07 - KAS 321-21", driver: "Ama Tetseh", route: "Route D", status: "Delayed", location: "Ashongman Estate", nextStop: "Ashongman", eta: "15 min", students: 37 },
  { id: "BUS 09 - KAS 664-21", driver: "Yaw Mensah", route: "Route E", status: "On Trip", location: "Sowutuom Last Stop", nextStop: "Sowutuom", eta: "9 min", students: 34 },
];

const pendingPickups = [
  { name: "Efua Korley", route: "Route B - Madina Zongo", time: "Pickup: 8:05 AM", status: "Waiting", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Kwame Asare", route: "Route C - Haatso", time: "Pickup: 8:10 AM", status: "Waiting", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { name: "Akosua Prempah", route: "Route A - Ashaley Botwe", time: "Pickup: 8:15 AM", status: "Waiting", initials: "AP", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Yaw Antwi", route: "Route D - Sowutuom", time: "Pickup: 8:20 AM", status: "Waiting", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { name: "Nana Yaw Addo", route: "Route D - Ashongman", time: "Pickup: 8:25 AM", status: "Waiting", initials: "NY", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
];

const driversOnDuty = [
  { name: "Kofi Adjei", route: "Bus 01 - Route A", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { name: "Samuel Ofori", route: "Bus 03 - Route B", initials: "SO", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { name: "Abdul Rahman", route: "Bus 05 - Route C", initials: "AR", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
  { name: "Ada Tetseh", route: "Bus 07 - Route D", initials: "AT", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Yaw Mensah", route: "Bus 09 - Route E", initials: "YM", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { name: "Grace Mensah", route: "Bus 11 - Route F", initials: "GM", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
];

const statusStyle = (s: string) => {
  if (s === "On Trip") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Delayed") return { bg: "#fee2e2", color: "#dc2626" };
  if (s === "Waiting") return { bg: "#fef3c7", color: "#d97706" };
  return { bg: "#f3f4f6", color: "#6b7280" };
};

export default function Transport() {
  const [activeTab, setActiveTab] = useState("Live Tracking");
  const tabs = ["Live Tracking", "Routes", "Drivers", "Students", "Vehicles", "Trips", "Fuel & Maintenance", "Reports"];

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Transport Management</h1>
            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "4px 0 0" }}>Manage school buses, routes, students and real-time tracking.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", borderRadius: 8, background: "#1e1b4b", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              📡 Live Tracking
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Settings size={13} color="#6b7280" /> Transport Settings
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={14} /> Add Vehicle
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.color, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: "7px 10px", fontSize: 11.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "white" : "#6b7280", background: activeTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </div>

        {/* Live Map */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Live Bus Tracking</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#fee2e2", color: "#dc2626" }}>🔴 LIVE</span>
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>Real-time location of all active buses</div>
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ position: "relative", height: 220, background: "linear-gradient(135deg, #e8f4f8 0%, #d4e9f0 30%, #c8e3ec 60%, #d8eef5 100%)", overflow: "hidden" }}>
            {/* Road lines */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#b8d4dc" strokeWidth="3" />
              <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#b8d4dc" strokeWidth="3" />
              <line x1="20%" y1="10%" x2="80%" y2="90%" stroke="#c0d8e0" strokeWidth="2" />
              <line x1="80%" y1="10%" x2="20%" y2="90%" stroke="#c0d8e0" strokeWidth="2" />
              <line x1="5%" y1="25%" x2="95%" y2="75%" stroke="#ccdfe7" strokeWidth="1.5" />
              <line x1="5%" y1="75%" x2="95%" y2="25%" stroke="#ccdfe7" strokeWidth="1.5" />
              {/* Route line (blue) */}
              <polyline points="80,110 200,60 320,80 450,50 530,90" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeDasharray="6,3" />
            </svg>

            {/* Place labels */}
            {[
              { x: "18%", y: "20%", label: "North Legon" },
              { x: "55%", y: "15%", label: "Madina" },
              { x: "75%", y: "55%", label: "Haatso" },
              { x: "15%", y: "65%", label: "Atomic Junction" },
              { x: "40%", y: "72%", label: "Sowutuom" },
              { x: "65%", y: "80%", label: "Accra Mall" },
              { x: "30%", y: "38%", label: "ABC Mall" },
            ].map((p, i) => (
              <div key={i} style={{ position: "absolute", left: p.x, top: p.y, fontSize: 10, color: "#374151", fontWeight: 600, background: "rgba(255,255,255,0.8)", padding: "2px 5px", borderRadius: 4, whiteSpace: "nowrap" }}>{p.label}</div>
            ))}

            {/* Bus icons */}
            {[
              { x: "22%", y: "35%", color: "#16a34a" },
              { x: "42%", y: "22%", color: "#16a34a" },
              { x: "58%", y: "42%", color: "#d97706" },
              { x: "70%", y: "30%", color: "#16a34a" },
              { x: "34%", y: "58%", color: "#16a34a" },
            ].map((b, i) => (
              <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: 26, height: 26, borderRadius: "50%", background: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: "0 2px 6px rgba(0,0,0,0.2)", border: "2px solid white" }}>
                🚌
              </div>
            ))}

            {/* Legend */}
            <div style={{ position: "absolute", right: 16, top: 16, background: "rgba(255,255,255,0.95)", borderRadius: 8, padding: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", fontSize: 11 }}>
              {[
                { color: "#16a34a", label: "On Trip", count: 8 },
                { color: "#2563eb", label: "Completed", count: 18 },
                { color: "#d97706", label: "Waiting", count: 2 },
                { color: "#dc2626", label: "Delayed", count: 1 },
                { color: "#6b7280", label: "Offline", count: 1 },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                  <span style={{ color: "#374151" }}>{l.label}</span>
                  <span style={{ fontWeight: 700, color: "#111827", marginLeft: "auto" }}>{l.count}</span>
                </div>
              ))}
              <button style={{ marginTop: 4, fontSize: 11, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 3 }}>
                ⤢ Expand Map
              </button>
            </div>
          </div>
        </div>

        {/* Active Buses Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Active Buses <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: 12 }}>(8 on trip)</span></span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["BUS / DRIVER", "ROUTE", "STATUS", "CURRENT LOCATION", "NEXT STOP", "ETA", "STUDENTS", "ACTION"].map((c) => (
                  <th key={c} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buses.map((b, idx) => {
                const st = statusStyle(b.status);
                return (
                  <tr key={b.id} style={{ borderBottom: idx < buses.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{b.id}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Driver: {b.driver}</div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151", fontWeight: 500 }}>{b.route}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 12, background: st.bg, color: st.color }}>{b.status}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151" }}>{b.location}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151" }}>{b.nextStop}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, color: b.status === "Delayed" ? "#dc2626" : "#374151" }}>{b.eta}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#374151" }}>{b.students}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ padding: "5px 12px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#374151", fontWeight: 500 }}>Track</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6" }}>
            <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View all buses →</button>
          </div>
        </div>

        {/* Transport Overview */}
        <div style={{ background: "white", borderRadius: 12, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Transport Overview (This Month)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
            {[
              { label: "Total Trips", value: "487", icon: "🚌" },
              { label: "Total Distance", value: "12,842 km", icon: "📍" },
              { label: "Fuel Consumed", value: "1,245 L", icon: "⛽" },
              { label: "Total Cost", value: "GHS 18,560", icon: "💰" },
              { label: "Avg. Cost / Trip", value: "GHS 38.10", icon: "📊" },
              { label: "Safety First", value: "No accidents", icon: "🛡️" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 3 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 268, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        {/* Trip Summary */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Today's Trip Summary</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View Report</button>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Total Trips", value: "26" },
              { label: "Completed", value: "18 (69.2%)", color: "#16a34a" },
              { label: "On Trip", value: "8 (30.8%)", color: "#d97706" },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center", background: "#f9fafb", borderRadius: 8, padding: "8px" }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color || "#111827" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Pickups */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Pending Pickups</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {pendingPickups.map((p) => (
            <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: p.avatarBg, color: p.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.route}</div>
                <div style={{ fontSize: 10.5, color: "#6b7280" }}>{p.time}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#fef3c7", color: "#d97706", whiteSpace: "nowrap" }}>{p.status}</span>
            </div>
          ))}
          <button style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View all pending →</button>
        </div>

        {/* Driver on Duty */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Driver on Duty</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {driversOnDuty.map((d) => (
            <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: d.avatarBg, color: d.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{d.initials}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{d.name}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{d.route}</div>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#dcfce7", color: "#16a34a" }}>On Duty</span>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Alerts & Notifications</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {[
            { icon: "🚌", text: "Bus 07 Delay – Route D is 12 mins delayed", time: "8:07 AM", color: "#dc2626", bg: "#fee2e2" },
            { icon: "🔧", text: "Maintenance Due – Bus 03 - Oil change due in 3 days", time: "Yesterday", color: "#d97706", bg: "#fef3c7" },
            { icon: "⛽", text: "Low Fuel – Bus 09 fuel level is low (19%)", time: "Yesterday", color: "#d97706", bg: "#fef3c7" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, background: a.bg, padding: "8px", borderRadius: 7 }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: a.color, fontWeight: 600, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 10 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: "➕", label: "Add Trip" }, { icon: "👥", label: "Bulk Assign Students" },
              { icon: "🔔", label: "Send Alert to Parents" }, { icon: "📊", label: "Transport Report" },
            ].map((a) => (
              <button key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 6px", border: "1px solid #f3f4f6", borderRadius: 8, background: "#fafafa", cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ fontSize: 10.5, color: "#374151", textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Maintenance Reminders</span>
            <button style={{ fontSize: 11.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          {[
            { bus: "Bus 02", task: "Brake inspection due", when: "In 2 days", color: "#dc2626" },
            { bus: "Bus 04", task: "Tire rotation due", when: "In 5 days", color: "#d97706" },
            { bus: "Bus 10", task: "Insurance expires", when: "In 12 days", color: "#2563eb" },
          ].map((m) => (
            <div key={m.bus} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{m.bus}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{m.task}</div>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: m.color, background: m.color === "#dc2626" ? "#fee2e2" : m.color === "#d97706" ? "#fef3c7" : "#dbeafe", padding: "2px 8px", borderRadius: 10 }}>{m.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
