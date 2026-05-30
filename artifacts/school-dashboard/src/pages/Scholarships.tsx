import { useState } from "react";
import { Plus, Search, ChevronRight, X, Award } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type ScholarshipStatus = "Active" | "Pending" | "Completed" | "Suspended";
type ScholarshipType   = "Academic Merit" | "Financial Need" | "Sports" | "Orphan Support" | "Government";

type Scholarship = {
  id: number; name: string; studentId: string; class: string;
  initials: string; avatarBg: string; avatarColor: string;
  scholarshipName: string; type: ScholarshipType; funder: string;
  amount: number; coveragePercent: number; status: ScholarshipStatus;
  startDate: string; endDate: string; gpa: number;
  criteria: string; notes: string;
};

const scholarships: Scholarship[] = [
  { id: 1,  name: "Adjoa Mensah",        studentId: "STU-2024-0067", class: "JHS 3",      initials: "AM", avatarBg: "#fce7f3", avatarColor: "#9d174d", scholarshipName: "Excellence Award",             type: "Academic Merit", funder: "School PTA",         amount: 1850, coveragePercent: 100, status: "Active",    startDate: "Jan 2024", endDate: "Dec 2024", gpa: 88.2, criteria: "Top 1% of class. GPA ≥ 85%.", notes: "Adjoa has maintained top position in JHS 3 for 3 consecutive terms." },
  { id: 2,  name: "Emmanuel Kofi Adu",   studentId: "STU-2024-0033", class: "JHS 1",      initials: "EK", avatarBg: "#e0e7ff", avatarColor: "#3730a3", scholarshipName: "Orphan Support Bursary",       type: "Orphan Support", funder: "Community Foundation",amount: 2100, coveragePercent: 100, status: "Active",    startDate: "Sep 2023", endDate: "Aug 2025", gpa: 50.3, criteria: "Confirmed orphan or single-parent household with financial hardship.", notes: "Approved by the School Welfare Committee. Parent passed in 2022." },
  { id: 3,  name: "Yaw Darko",           studentId: "STU-2024-0018", class: "P5 - Ruby",  initials: "YD", avatarBg: "#fef9c3", avatarColor: "#713f12", scholarshipName: "GETFUND Scholarship",          type: "Government",     funder: "Ghana GETFund",      amount: 1850, coveragePercent: 80,  status: "Active",    startDate: "Jan 2024", endDate: "Dec 2024", gpa: 65.8, criteria: "BECE candidate or Primary 5-6 with demonstrated financial need.", notes: "GETFund award for Term 2. Parent is a farmer in Brong-Ahafo." },
  { id: 4,  name: "Ama Serwaa Ofori",    studentId: "STU-2024-0013", class: "JHS 3",      initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", scholarshipName: "Academic Merit Bursary",       type: "Academic Merit", funder: "School Board",       amount: 925,  coveragePercent: 50,  status: "Active",    startDate: "Apr 2024", endDate: "Jun 2024", gpa: 83.5, criteria: "Top 3 in class per term. GPA ≥ 80%.", notes: "Covers 50% of Term 2 fees. Must maintain position in top 3." },
  { id: 5,  name: "Kwame Asante",        studentId: "STU-2024-0042", class: "JHS 2",      initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", scholarshipName: "Sports Scholarship",           type: "Sports",         funder: "Ghana Education Trust", amount: 1050, coveragePercent: 50, status: "Active",   startDate: "Jan 2024", endDate: "Dec 2024", gpa: 65.8, criteria: "School athletic team member. Represent school in regional competitions.", notes: "Kwame is the school's 100m and 200m sprint champion. Regional finalist." },
  { id: 6,  name: "Yaw Antwi Boakye",   studentId: "STU-2024-0016", class: "JHS 3",      initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", scholarshipName: "Financial Need Bursary",       type: "Financial Need", funder: "Anonymous Donor",    amount: 2100, coveragePercent: 100, status: "Pending",   startDate: "—",        endDate: "—",        gpa: 40.5, criteria: "Household income below GH₵ 800/month, confirmed by community leader.", notes: "Application under review. Home visit scheduled for 10 June 2024." },
  { id: 7,  name: "Abena Yaa Darko",     studentId: "STU-2024-0019", class: "P6 - Topaz", initials: "AD", avatarBg: "#fce7f3", avatarColor: "#9d174d", scholarshipName: "Gender Equity Scholarship",    type: "Financial Need", funder: "Maxibern Foundation", amount: 1850, coveragePercent: 100, status: "Completed", startDate: "Sep 2023", endDate: "Dec 2023", gpa: 78.4, criteria: "Female student with financial need and strong academic performance.", notes: "Scholarship covered Term 1 2023. Renewal application submitted." },
  { id: 8,  name: "Daniel Lartey",       studentId: "STU-2024-0014", class: "P6 - Topaz", initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", scholarshipName: "LEAP Programme Support",       type: "Government",     funder: "Dept. of Social Welfare", amount: 600, coveragePercent: 33, status: "Suspended", startDate: "Jan 2024", endDate: "Jun 2024", gpa: 76.3, criteria: "LEAP beneficiary household registered with Dept. of Social Welfare.", notes: "Suspended pending re-verification of household LEAP status. Due June 15." },
];

const statusStyle = (s: ScholarshipStatus) => {
  if (s === "Active")    return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Pending")   return { bg: "#fef3c7", color: "#d97706" };
  if (s === "Completed") return { bg: "#dbeafe", color: "#2563eb" };
  return                        { bg: "#fee2e2", color: "#dc2626" };
};

const typeStyle: Record<ScholarshipType, { bg: string; color: string; emoji: string }> = {
  "Academic Merit": { bg: "#ede9fe", color: "#7c3aed", emoji: "🏆" },
  "Financial Need": { bg: "#fef3c7", color: "#d97706", emoji: "💛" },
  "Sports":         { bg: "#dcfce7", color: "#16a34a", emoji: "⚽" },
  "Orphan Support": { bg: "#fce7f3", color: "#9d174d", emoji: "🤝" },
  "Government":     { bg: "#dbeafe", color: "#2563eb", emoji: "🏛️" },
};

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const statuses: ScholarshipStatus[] = ["Active", "Pending", "Completed", "Suspended"];

export default function Scholarships() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,      setSelected]      = useState<Scholarship>(scholarships[0]);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [showPanel,     setShowPanel]     = useState(false);
  const [showForm,      setShowForm]      = useState(false);

  const filtered = scholarships.filter((s) => {
    const mSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.scholarshipName.toLowerCase().includes(searchQuery.toLowerCase());
    const mStatus = statusFilter === "All" || s.status === statusFilter;
    return mSearch && mStatus;
  });

  const activeCount  = scholarships.filter(s => s.status === "Active").length;
  const totalAwarded = scholarships.filter(s => s.status === "Active").reduce((t, s) => t + s.amount, 0);
  const pendingCount = scholarships.filter(s => s.status === "Pending").length;

  const ScholarshipPanel = () => {
    const ss = statusStyle(selected.status);
    const ts = typeStyle[selected.type];
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Scholarship Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast("Opening edit form...", "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Banner */}
          <div style={{ background: ts.bg, borderRadius: 14, padding: "18px", border: `1px solid ${ts.color}20` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{ts.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{selected.scholarshipName}</div>
                <div style={{ fontSize: 12, color: ts.color, fontWeight: 600, marginTop: 3 }}>{selected.type}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>Funded by: {selected.funder}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: ss.bg, color: ss.color, flexShrink: 0 }}>{selected.status}</span>
            </div>
          </div>

          {/* Student */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{selected.name}</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{selected.studentId} · {selected.class}</div>
              <div style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 600, marginTop: 2 }}>GPA: {selected.gpa}%</div>
            </div>
          </div>

          {/* Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Award Amount",    value: fmt(selected.amount),           bg: "#ede9fe", color: "#7c3aed" },
              { label: "Fee Coverage",    value: `${selected.coveragePercent}%`, bg: "#dcfce7", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Dates */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>PERIOD</div>
            {[["Start Date", selected.startDate], ["End Date", selected.endDate]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Criteria */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>ELIGIBILITY CRITERIA</div>
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "11px", fontSize: 12.5, color: "#374151", lineHeight: 1.7 }}>{selected.criteria}</div>
          </div>

          {/* Notes */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>NOTES</div>
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "11px", fontSize: 12.5, color: "#374151", lineHeight: 1.7, borderLeft: "3px solid #7c3aed" }}>{selected.notes}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.status === "Pending" && (
              <button onClick={() => { showToast(`Scholarship approved for ${selected.name}`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>✅ Approve Application</button>
            )}
            <button onClick={() => { showToast("Scholarship letter sent", "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📄 Generate Award Letter</button>
            <button onClick={() => { showToast("Notification sent to parent", "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>📱 Notify Parent</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Scholarships</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Finance","Scholarships"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " New Award"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Recipients",  value: String(scholarships.length), icon: "🏆", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Active Awards",     value: String(activeCount),          icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Total Awarded",     value: fmt(totalAwarded),            icon: "💰", bg: "#dbeafe", color: "#2563eb" },
          { label: "Pending Review",    value: String(pendingCount),         icon: "⏳", bg: "#fef3c7", color: "#d97706" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search student or scholarship..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        {["All", ...statuses].map((s) => {
          const ss = s !== "All" ? statusStyle(s as ScholarshipStatus) : { bg: "#ede9fe", color: "#7c3aed" };
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "6px 12px", border: `1px solid ${statusFilter===s?ss.color:"#e5e7eb"}`, borderRadius: 8, background: statusFilter===s?ss.bg:"white", color: statusFilter===s?ss.color:"#374151", fontSize: 12, fontWeight: statusFilter===s?700:400, cursor: "pointer" }}>{s}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 300px)" }}>
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 320, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} scholarship{filtered.length!==1?"s":""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((sch) => {
                const ss = statusStyle(sch.status);
                const ts = typeStyle[sch.type];
                const isActive = selected.id === sch.id;
                return (
                  <div key={sch.id} onClick={() => { setSelected(sch); if (isMobile) setShowPanel(true); }}
                    style={{ padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: sch.avatarBg, color: sch.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{sch.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{sch.name}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: ss.bg, color: ss.color, flexShrink: 0 }}>{sch.status}</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: ts.color, fontWeight: 600, marginTop: 2 }}>{ts.emoji} {sch.scholarshipName}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>{sch.class} · {sch.coveragePercent}% coverage</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>{fmt(sch.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <ScholarshipPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "82vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <ScholarshipPanel />
          </div>
        </div>
      )}

      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>New Scholarship Award</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Student Name","text","e.g. Adjoa Mensah"],["Scholarship Name","text","e.g. Excellence Award"],["Funder / Donor","text","e.g. PTA / GETFund"]].map(([l,t,p]) => (
                <div key={l as string}><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l}</label><input type={t as string} placeholder={p as string} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Amount (GH₵)</label><input type="number" placeholder="0" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
                <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Type</label><select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                  {(["Academic Merit","Financial Need","Sports","Orphan Support","Government"] as ScholarshipType[]).map(t => <option key={t}>{t}</option>)}
                </select></div>
              </div>
              <button onClick={() => { showToast("Scholarship award created!", "success"); setShowForm(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Award</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
