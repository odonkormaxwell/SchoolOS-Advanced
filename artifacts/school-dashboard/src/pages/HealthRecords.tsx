import { useState } from "react";
import { Search, ChevronRight, Plus, X, AlertCircle, CheckCircle, Heart, Activity } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Student = {
  id: number; name: string; sid: string; class: string; age: number;
  gender: string; bloodType: string; height: string; weight: string; bmi: string; bmiStatus: string;
  allergies: string[]; conditions: string[]; lastCheckup: string; healthStatus: string;
  initials: string; avatarBg: string; avatarColor: string;
  emergencyContact: string; emergencyPhone: string; emergencyRelation: string;
};

const students: Student[] = [
  { id: 1, name: "Kofi Junior Asante",  sid: "STU-2024-0012", class: "P6 - Topaz",  age: 12, gender: "Male",   bloodType: "O+",  height: "148 cm", weight: "42 kg", bmi: "19.2", bmiStatus: "Normal",      allergies: ["Peanuts"],               conditions: [],                       lastCheckup: "10 May 2024", healthStatus: "Healthy",   initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", emergencyContact: "Mr. Kwame Asante",  emergencyPhone: "0244001001", emergencyRelation: "Father" },
  { id: 2, name: "Ama Serwaa Ofori",    sid: "STU-2024-0013", class: "P6 - Topaz",  age: 11, gender: "Female", bloodType: "A+",  height: "145 cm", weight: "39 kg", bmi: "18.5", bmiStatus: "Normal",      allergies: [],                        conditions: ["Asthma (mild)"],        lastCheckup: "8 May 2024",  healthStatus: "Monitor",   initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", emergencyContact: "Mrs. Abena Ofori", emergencyPhone: "0244001002", emergencyRelation: "Mother" },
  { id: 3, name: "Daniel Nii Lartey",  sid: "STU-2024-0014", class: "P6 - Topaz",  age: 12, gender: "Male",   bloodType: "B+",  height: "150 cm", weight: "40 kg", bmi: "17.8", bmiStatus: "Normal",      allergies: ["Penicillin"],            conditions: [],                       lastCheckup: "2 May 2024",  healthStatus: "Healthy",   initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", emergencyContact: "Mr. Nii Lartey",  emergencyPhone: "0244001003", emergencyRelation: "Father" },
  { id: 4, name: "Akosua Adwoa Mensah", sid: "STU-2024-0015", class: "P6 - Topaz", age: 11, gender: "Female", bloodType: "AB+", height: "143 cm", weight: "38 kg", bmi: "18.6", bmiStatus: "Normal",      allergies: ["Dust", "Pollen"],        conditions: ["Allergic Rhinitis"],    lastCheckup: "14 May 2024", healthStatus: "Monitor",   initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d", emergencyContact: "Mrs. Adwoa Mensah", emergencyPhone: "0244001004", emergencyRelation: "Mother" },
  { id: 5, name: "Yaw Antwi Boakye",   sid: "STU-2024-0016", class: "P6 - Topaz",  age: 13, gender: "Male",   bloodType: "O-",  height: "155 cm", weight: "48 kg", bmi: "20.0", bmiStatus: "Normal",      allergies: [],                        conditions: [],                       lastCheckup: "28 Apr 2024", healthStatus: "Healthy",   initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", emergencyContact: "Mr. Kwabena Boakye", emergencyPhone: "0244001005", emergencyRelation: "Father" },
  { id: 6, name: "Efua Korkor Lamptey", sid: "STU-2024-0017", class: "P6 - Topaz", age: 11, gender: "Female", bloodType: "A-",  height: "140 cm", weight: "32 kg", bmi: "16.3", bmiStatus: "Underweight", allergies: ["Shellfish"],             conditions: ["Anemia"],               lastCheckup: "12 May 2024", healthStatus: "At Risk",   initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d", emergencyContact: "Mrs. Korkor Lamptey", emergencyPhone: "0244001006", emergencyRelation: "Mother" },
  { id: 7, name: "Michael Kojo Addo",  sid: "STU-2024-0018", class: "P6 - Topaz",  age: 12, gender: "Male",   bloodType: "B-",  height: "149 cm", weight: "55 kg", bmi: "24.8", bmiStatus: "Overweight",  allergies: [],                        conditions: ["Obesity (monitoring)"], lastCheckup: "5 May 2024",  healthStatus: "Monitor",   initials: "MK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", emergencyContact: "Mr. Kojo Addo",   emergencyPhone: "0244001007", emergencyRelation: "Father" },
];

const vaccinations = [
  { name: "BCG",     date: "Jan 2012", status: "Done" },
  { name: "OPV",     date: "Mar 2012", status: "Done" },
  { name: "Measles", date: "Sep 2012", status: "Done" },
  { name: "Yellow Fever", date: "Sep 2012", status: "Done" },
  { name: "Hepatitis B",  date: "Jan 2013", status: "Done" },
  { name: "DPT",    date: "Mar 2013", status: "Done" },
];

const medicalVisits = [
  { date: "10 May 2024", reason: "Annual Health Check",    outcome: "All vitals normal", doctor: "Dr. Asare" },
  { date: "15 Mar 2024", reason: "Stomach ache complaint", outcome: "Mild gastritis — rest prescribed", doctor: "School Nurse" },
  { date: "22 Jan 2024", reason: "Routine Checkup",        outcome: "Healthy — continue vitamins", doctor: "Dr. Asare" },
];

const healthStatusStyle = (s: string) => {
  if (s === "Healthy")  return { bg: "#dcfce7", color: "#16a34a", icon: "✅" };
  if (s === "Monitor")  return { bg: "#fef3c7", color: "#d97706", icon: "⚠️" };
  return                       { bg: "#fee2e2", color: "#dc2626", icon: "🔴" };
};

const bmiStatusColor = (s: string) => {
  if (s === "Normal")      return "#16a34a";
  if (s === "Underweight") return "#d97706";
  if (s === "Overweight")  return "#dc2626";
  return "#9ca3af";
};

export default function HealthRecords() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [selected,     setSelected]     = useState<Student>(students[0]);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showPanel,    setShowPanel]    = useState(false);

  const filtered = students.filter((s) => {
    const mSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.sid.toLowerCase().includes(searchQuery.toLowerCase());
    const mStatus = statusFilter === "All" || s.healthStatus === statusFilter;
    return mSearch && mStatus;
  });

  const kpiData = [
    { label: "Total Students",  value: String(students.length),                                              icon: "👥", bg: "#ede9fe", color: "#7c3aed" },
    { label: "Healthy",         value: String(students.filter(s => s.healthStatus === "Healthy").length),   icon: "✅", bg: "#dcfce7", color: "#16a34a" },
    { label: "Monitoring",      value: String(students.filter(s => s.healthStatus === "Monitor").length),   icon: "⚠️", bg: "#fef3c7", color: "#d97706" },
    { label: "At Risk",         value: String(students.filter(s => s.healthStatus === "At Risk").length),   icon: "🔴", bg: "#fee2e2", color: "#dc2626" },
  ];

  const PanelContent = () => {
    const st = healthStatusStyle(selected.healthStatus);
    return (
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "14px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{selected.sid} · {selected.class}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color }}>
                  {st.icon} {selected.healthStatus}
                </span>
              </div>
            </div>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} /></button>}
          </div>
        </div>

        <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Vitals */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 10 }}>VITALS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Blood Type", value: selected.bloodType, icon: "🩸", color: "#dc2626" },
                { label: "Height",     value: selected.height,    icon: "📏", color: "#2563eb" },
                { label: "Weight",     value: selected.weight,    icon: "⚖️",  color: "#7c3aed" },
                { label: "BMI",        value: `${selected.bmi} — ${selected.bmiStatus}`, icon: "❤️", color: bmiStatusColor(selected.bmiStatus) },
              ].map((v) => (
                <div key={v.label} style={{ background: "#f9fafb", borderRadius: 9, padding: "10px 11px" }}>
                  <div style={{ fontSize: 15, marginBottom: 4 }}>{v.icon}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af", marginBottom: 2 }}>{v.label}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: v.color }}>{v.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info row */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>BASIC INFO</div>
            {[
              ["Age", `${selected.age} years`],
              ["Gender", selected.gender],
              ["Last Checkup", selected.lastCheckup],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Allergies & Conditions */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>ALLERGIES & CONDITIONS</div>
            {selected.allergies.length === 0 && selected.conditions.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 12 }}>
                <CheckCircle size={13} /> No known allergies or conditions
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.allergies.map((a) => (
                  <span key={a} style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 20, background: "#fee2e2", color: "#dc2626", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    ⚠️ {a} (Allergy)
                  </span>
                ))}
                {selected.conditions.map((c) => (
                  <span key={c} style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 20, background: "#fef3c7", color: "#d97706", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    🩺 {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Vaccinations */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>VACCINATION RECORD</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {vaccinations.map((v) => (
                <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", background: "#f0fdf4", borderRadius: 8 }}>
                  <CheckCircle size={12} color="#16a34a" />
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#111827" }}>{v.name}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{v.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical visits */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>RECENT MEDICAL VISITS</div>
            {medicalVisits.map((v, i) => (
              <div key={i} style={{ padding: "10px", background: "#f9fafb", borderRadius: 9, marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{v.reason}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{v.date}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#6b7280", marginBottom: 2 }}>{v.outcome}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>By: {v.doctor}</div>
              </div>
            ))}
          </div>

          {/* Emergency contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>EMERGENCY CONTACT</div>
            <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.emergencyContact}</div>
              <div style={{ fontSize: 11.5, color: "#6b7280" }}>{selected.emergencyRelation}</div>
              <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, marginTop: 4 }}>{selected.emergencyPhone}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Scheduling checkup for ${selected.name}`, "info"); if (isMobile) setShowPanel(false); }}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📅 Schedule Checkup
            </button>
            <button onClick={() => { showToast(`Health report generated for ${selected.name}`, "success"); if (isMobile) setShowPanel(false); }}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📄 Generate Health Report
            </button>
            <button onClick={() => { showToast(`Emergency alert sent for ${selected.name}`, "error"); if (isMobile) setShowPanel(false); }}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              🚨 Send Emergency Alert
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Health Records</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Students", "Health Records"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!isMobile && (
            <button onClick={() => showToast("Generating school health report...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <Activity size={13} color="#6b7280" /> Health Report
            </button>
          )}
          <button onClick={() => showToast("Opening add health record form...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Plus size={14} />{!isMobile && " Add Record"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {kpiData.map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & filter */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or student ID..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["All", "Healthy", "Monitor", "At Risk"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)}
              style={{ padding: "7px 12px", border: `1px solid ${statusFilter === f ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: statusFilter === f ? "#7c3aed" : "white", color: statusFilter === f ? "white" : "#374151", fontSize: 12, fontWeight: statusFilter === f ? 600 : 400, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 300px)" }}>
        {/* Student list */}
        <div style={{ width: isMobile ? "100%" : 300, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>Students ({filtered.length})</span>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.map((s) => {
              const st = healthStatusStyle(s.healthStatus);
              const isActive = selected.id === s.id;
              return (
                <div key={s.id}
                  onClick={() => { setSelected(s); if (isMobile) setShowPanel(true); }}
                  style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: s.avatarBg, color: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{s.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>{s.healthStatus}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.class} · {s.bloodType}</div>
                    {(s.allergies.length > 0 || s.conditions.length > 0) && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <AlertCircle size={10} color="#d97706" />
                        <span style={{ fontSize: 10.5, color: "#d97706", fontWeight: 500 }}>
                          {[...s.allergies, ...s.conditions].join(", ").slice(0, 28)}{[...s.allergies, ...s.conditions].join(", ").length > 28 ? "…" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel — Desktop */}
        {!isMobile && (
          <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <PanelContent />
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <PanelContent />
          </div>
        </div>
      )}
    </div>
  );
}
