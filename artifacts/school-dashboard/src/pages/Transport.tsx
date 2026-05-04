import { useState } from "react";
import { Plus, Settings, ChevronDown, ChevronRight, MoreVertical, AlertCircle, Clock, Users, MapPin, Zap, Bell, X, Phone, Navigation } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const kpiCards = [
  { label: "Active Buses", value: "12 / 15", sub: "In operation", icon: "🚌", iconBg: "#dbeafe", color: "#2563eb" },
  { label: "Students Transported", value: "326", sub: "Today", icon: "👥", iconBg: "#dcfce7", color: "#16a34a" },
  { label: "On Trip (Now)", value: "8", sub: "Buses on the road", icon: "🚐", iconBg: "#fef3c7", color: "#d97706" },
  { label: "Completed Trips", value: "18", sub: "Today", icon: "✅", iconBg: "#dcfce7", color: "#16a34a" },
  { label: "Pending Pickups", value: "23", sub: "Students", icon: "⏳", iconBg: "#fee2e2", color: "#dc2626" },
  { label: "Alerts", value: "3", sub: "Need attention", icon: "🔔", iconBg: "#ffe4e6", color: "#dc2626" },
];

const buses = [
  { id: "BUS 01 - KAS 123-21", driver: "Kofi Adjei", route: "Route A", status: "On Trip", location: "Near A&C Mall", nextStop: "North Legon", eta: "8 min", students: 38, phone: "0244001001" },
  { id: "BUS 03 - KAS 456-21", driver: "Madina Zongo", route: "Route B", status: "On Trip", location: "Atomic Junction", nextStop: "Madina Zongo", eta: "12 min", students: 41, phone: "0244001002" },
  { id: "BUS 05 - KAS 789-21", driver: "Abdul Rahman", route: "Route C", status: "On Trip", location: "Haatso Overpass", nextStop: "Haatso", eta: "6 min", students: 35, phone: "0244001003" },
  { id: "BUS 07 - KAS 321-21", driver: "Ama Tetseh", route: "Route D", status: "Delayed", location: "Ashongman Estate", nextStop: "Ashongman", eta: "15 min", students: 37, phone: "0244001004" },
  { id: "BUS 09 - KAS 664-21", driver: "Yaw Mensah", route: "Route E", status: "On Trip", location: "Sowutuom Last Stop", nextStop: "Sowutuom", eta: "9 min", students: 34, phone: "0244001005" },
];

const pendingPickups = [
  { name: "Efua Korley", route: "Route B - Madina Zongo", time: "Pickup: 8:05 AM", status: "Waiting", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Kwame Asare", route: "Route C - Haatso", time: "Pickup: 8:10 AM", status: "Waiting", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { name: "Akosua Prempah", route: "Route A - Ashaley Botwe", time: "Pickup: 8:15 AM", status: "Waiting", initials: "AP", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Yaw Antwi", route: "Route D - Sowutuom", time: "Pickup: 8:20 AM", status: "Waiting", initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12" },
];

const driversOnDuty = [
  { name: "Kofi Adjei", route: "Bus 01 - Route A", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { name: "Samuel Ofori", route: "Bus 03 - Route B", initials: "SO", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { name: "Abdul Rahman", route: "Bus 05 - Route C", initials: "AR", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
  { name: "Ada Tetseh", route: "Bus 07 - Route D", initials: "AT", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { name: "Yaw Mensah", route: "Bus 09 - Route E", initials: "YM", avatarBg: "#fef9c3", avatarColor: "#713f12" },
];

const initAlerts = [
  { id: 1, icon: "⚠️", title: "Bus 07 is 12 minutes delayed", sub: "Route D – Ashongman Estate", time: "9:20 AM", severity: "warning" },
  { id: 2, icon: "🔔", title: "5 students not picked up yet", sub: "Route B – Madina Zongo area", time: "9:00 AM", severity: "warning" },
  { id: 3, icon: "✅", title: "Bus 01 completed Route A", sub: "All 38 students delivered", time: "8:45 AM", severity: "success" },
];

const statusStyle = (s: string) => {
  if (s === "On Trip") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Delayed") return { bg: "#fee2e2", color: "#dc2626" };
  if (s === "Waiting") return { bg: "#fef3c7", color: "#d97706" };
  return { bg: "#f3f4f6", color: "#6b7280" };
};

export default function Transport() {
  const { showToast } = useApp();
  const { isMobile, isTablet } = useWindowSize();

  const [activeTab, setActiveTab] = useState("Live Tracking");
  const [selectedBus, setSelectedBus] = useState(buses[0]);
  const [showPanel, setShowPanel] = useState(false);
  const [trackingBus, setTrackingBus] = useState<typeof buses[0] | null>(null);
  const [alerts, setAlerts] = useState(initAlerts);

  const tabs = isMobile
    ? ["Live Tracking", "Routes", "Drivers", "Alerts"]
    : ["Live Tracking", "Routes", "Drivers", "Students", "Vehicles", "Trips", "Fuel & Maintenance", "Reports"];

  const kpiCols = isMobile ? "repeat(3, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)";

  const handleTrack = (bus: typeof buses[0]) => {
    setTrackingBus(bus);
    showToast(`Live tracking: ${bus.id} – ${bus.location}`, "info");
  };

  const handleCallDriver = (bus: typeof buses[0]) => {
    showToast(`Calling driver ${bus.driver} (${bus.phone})...`, "info");
  };

  const dismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast("Alert dismissed", "info");
  };

  const BusPanel = ({ bus }: { bus: typeof buses[0] }) => (
    <div style={{ padding: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{bus.id}</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{bus.route}</div>
          <span style={{ display: "inline-block", marginTop: 4, fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: statusStyle(bus.status).bg, color: statusStyle(bus.status).color }}>{bus.status}</span>
        </div>
        {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>}
      </div>

      {[["Driver", bus.driver], ["Current Location", bus.location], ["Next Stop", bus.nextStop], ["ETA", bus.eta], ["Students on Board", String(bus.students)]].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
          <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
          <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
        </div>
      ))}

      {/* Simulated Map */}
      <div style={{ marginTop: 14, marginBottom: 14, background: "linear-gradient(135deg, #e0e7ff, #ede9fe)", borderRadius: 10, height: 120, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Navigation size={20} color="white" />
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#7c3aed" }}>{bus.location}</span>
        <span style={{ fontSize: 10.5, color: "#9ca3af" }}>Live tracking active</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => { handleTrack(bus); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1e1b4b,#3730a3)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          📡 Track Live
        </button>
        <button onClick={() => { handleCallDriver(bus); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Phone size={13} /> Call Driver
        </button>
        {bus.status === "Delayed" && (
          <button onClick={() => { showToast(`Delay alert sent to parents on ${bus.route}`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
            🔔 Alert Parents of Delay
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 96px)" }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: isMobile ? "visible" : "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Transport</h1>
            {!isMobile && <p style={{ fontSize: 12.5, color: "#6b7280", margin: "4px 0 0" }}>Manage buses, routes, students and live tracking.</p>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!isMobile && (
              <>
                <button onClick={() => showToast("Opening live tracking view...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "none", borderRadius: 8, background: "#1e1b4b", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
                  📡 Live Tracking
                </button>
                <button onClick={() => showToast("Opening transport settings...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                  <Settings size={13} color="#6b7280" /> Settings
                </button>
              </>
            )}
            <button onClick={() => showToast("Add vehicle form opening...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              <Plus size={13} />{!isMobile && " Add Vehicle"}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 10 }}>
          {kpiCards.map((k) => (
            <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: k.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, color: "#111827" }}>{k.value}</div>
              <div style={{ fontSize: 10.5, color: k.color, fontWeight: 500 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", gap: 2, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "7px 6px", fontSize: isMobile ? 11 : 11.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "white" : "#6b7280", background: activeTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap", minWidth: "fit-content" }}>{t}</button>
          ))}
        </div>

        {/* Map Placeholder */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 12, overflow: "hidden", position: "relative", height: isMobile ? 180 : 220 }}>
          {/* Simulated map dots */}
          {[
            { x: "25%", y: "40%", label: "Bus 01", color: "#22c55e" },
            { x: "50%", y: "55%", label: "Bus 03", color: "#22c55e" },
            { x: "70%", y: "30%", label: "Bus 05", color: "#22c55e" },
            { x: "35%", y: "70%", label: "Bus 07", color: "#ef4444" },
            { x: "80%", y: "60%", label: "Bus 09", color: "#22c55e" },
          ].map((dot, i) => (
            <div key={i} style={{ position: "absolute", left: dot.x, top: dot.y, transform: "translate(-50%, -50%)" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: dot.color, boxShadow: `0 0 0 3px ${dot.color}40` }} />
              <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "white", background: "rgba(0,0,0,0.6)", padding: "1px 5px", borderRadius: 4, whiteSpace: "nowrap" }}>{dot.label}</div>
            </div>
          ))}
          {/* Map grid lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
            {[20, 40, 60, 80].map((pct) => (
              <g key={pct}>
                <line x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke="white" strokeWidth="0.5" />
                <line x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke="white" strokeWidth="0.5" />
              </g>
            ))}
          </svg>
          <div style={{ position: "absolute", top: 12, left: 14, color: "white" }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>📡 Live Fleet Map</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)" }}>8 buses active · Updated 30s ago</div>
          </div>
          <div style={{ position: "absolute", top: 12, right: 14, display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 10.5, color: "white" }}>On Trip</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontSize: 10.5, color: "white" }}>Delayed</span>
            </div>
          </div>
          <button onClick={() => showToast("Opening full-screen tracking map...", "info")} style={{ position: "absolute", bottom: 12, right: 14, padding: "6px 12px", border: "none", borderRadius: 8, background: "rgba(255,255,255,0.15)", color: "white", fontSize: 11.5, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)" }}>
            Expand Map ↗
          </button>
        </div>

        {/* Buses Table */}
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Active Buses</span>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600, background: "#f0fdf4", padding: "3px 8px", borderRadius: 20 }}>● 8 On Trip</span>
              <span style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 600, background: "#fff5f5", padding: "3px 8px", borderRadius: 20 }}>● 1 Delayed</span>
            </div>
          </div>

          {/* Mobile card list */}
          {isMobile ? (
            <div style={{ padding: "10px 12px" }}>
              {buses.map((bus) => {
                const st = statusStyle(bus.status);
                return (
                  <div key={bus.id} onClick={() => { setSelectedBus(bus); setShowPanel(true); }}
                    style={{ background: selectedBus.id === bus.id ? "#faf5ff" : "white", border: `1px solid ${selectedBus.id === bus.id ? "#ede9fe" : "#f3f4f6"}`, borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{bus.id}</div>
                        <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{bus.route} · {bus.driver}</div>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color }}>{bus.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11.5, color: "#6b7280" }}>{bus.location}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Next: {bus.nextStop} · ETA {bus.eta}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f9fafb", padding: "4px 8px", borderRadius: 20 }}>
                          <Users size={11} color="#6b7280" />
                          <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 600 }}>{bus.students}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleTrack(bus); }} style={{ padding: "5px 10px", border: "none", borderRadius: 7, background: "#1e1b4b", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Track</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                    {["BUS ID", "DRIVER", "ROUTE", "STATUS", "CURRENT LOCATION", "NEXT STOP", "ETA", "STUDENTS", "ACTIONS"].map((c) => (
                      <th key={c} style={{ padding: "10px 12px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus, idx) => {
                    const st = statusStyle(bus.status);
                    return (
                      <tr key={bus.id} onClick={() => setSelectedBus(bus)}
                        style={{ borderBottom: idx < buses.length - 1 ? "1px solid #f9fafb" : "none", background: selectedBus.id === bus.id ? "#faf5ff" : "white", cursor: "pointer", transition: "background 0.1s" }}>
                        <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{bus.id}</span></td>
                        <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 12.5, color: "#374151" }}>{bus.driver}</span></td>
                        <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>{bus.route}</span></td>
                        <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{bus.status}</span></td>
                        <td style={{ padding: "11px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <MapPin size={12} color="#7c3aed" />
                            <span style={{ fontSize: 12, color: "#374151" }}>{bus.location}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 12px" }}><span style={{ fontSize: 12, color: "#374151" }}>{bus.nextStop}</span></td>
                        <td style={{ padding: "11px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={11} color="#9ca3af" />
                            <span style={{ fontSize: 12, color: bus.status === "Delayed" ? "#dc2626" : "#374151", fontWeight: bus.status === "Delayed" ? 600 : 400 }}>{bus.eta}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Users size={12} color="#6b7280" />
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{bus.students}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={(e) => { e.stopPropagation(); handleTrack(bus); }} style={{ padding: "5px 10px", border: "none", borderRadius: 7, background: "#1e1b4b", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📡 Track</button>
                            <button onClick={(e) => { e.stopPropagation(); handleCallDriver(bus); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 5, display: "flex" }}><MoreVertical size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
          {/* Alerts */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Bell size={14} color="#dc2626" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>Alerts</span>
                {alerts.length > 0 && <span style={{ fontSize: 10.5, fontWeight: 600, background: "#fee2e2", color: "#dc2626", padding: "1px 6px", borderRadius: 10 }}>{alerts.length}</span>}
              </div>
            </div>
            {alerts.map((a) => (
              <div key={a.id} style={{ display: "flex", gap: 8, padding: "8px", background: a.severity === "warning" ? "#fff8f0" : "#f0fdf4", borderRadius: 8, marginBottom: 7, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16 }}>{a.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "#374151" }}>{a.title}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{a.sub}</div>
                </div>
                <button onClick={() => dismissAlert(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", flexShrink: 0, display: "flex" }}><X size={12} /></button>
              </div>
            ))}
            {alerts.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: "#9ca3af", fontSize: 12 }}>All clear! No alerts.</div>}
          </div>

          {/* Pending Pickups */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>Pending Pickups</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#dc2626" }}>{pendingPickups.length} waiting</span>
            </div>
            {pendingPickups.map((p, idx) => (
              <div key={idx} style={{ display: "flex", gap: 9, marginBottom: 8, alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.avatarBg, color: p.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.route}</div>
                </div>
                <button onClick={() => showToast(`${p.name} marked as picked up`, "success")} style={{ padding: "4px 8px", border: "none", borderRadius: 6, background: "#dcfce7", color: "#16a34a", fontSize: 10.5, fontWeight: 600, cursor: "pointer" }}>Mark</button>
              </div>
            ))}
          </div>

          {/* Drivers on Duty */}
          <div style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Drivers on Duty</div>
            {driversOnDuty.map((d, idx) => (
              <div key={idx} style={{ display: "flex", gap: 9, marginBottom: 8, alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: d.avatarBg, color: d.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{d.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{d.name}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{d.route}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Desktop */}
      {!isMobile && (
        <div style={{ width: 270, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Bus Details</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <BusPanel bus={selectedBus} />
          </div>
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "12px auto 0" }} />
            <BusPanel bus={selectedBus} />
          </div>
        </div>
      )}

      {/* Track Modal */}
      {trackingBus && (
        <div onClick={() => setTrackingBus(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", width: 360, animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>📡 Live Tracking</span>
              <button onClick={() => setTrackingBus(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
            </div>
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius: 10, padding: "20px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{trackingBus.id}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 8 }}>{trackingBus.location}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 12, color: "white" }}>Live · Updated just now</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Next Stop", trackingBus.nextStop], ["ETA", trackingBus.eta], ["Driver", trackingBus.driver], ["Students", String(trackingBus.students)]].map(([k, v]) => (
                <div key={k} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px" }}>
                  <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{v}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setTrackingBus(null)} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
