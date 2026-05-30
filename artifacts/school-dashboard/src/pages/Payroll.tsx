import { useState } from "react";
import { ChevronRight, Download, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type PayrollStatus = "Paid" | "Pending" | "Processing";

type StaffPayroll = {
  id: number; name: string; role: string; department: string;
  initials: string; avatarBg: string; avatarColor: string;
  basicSalary: number; allowances: number; deductions: number; netPay: number;
  bank: string; accountNo: string; month: string; status: PayrollStatus;
  payDate: string;
};

const payrolls: StaffPayroll[] = [
  { id: 1,  name: "Mr. E. Mensah",        role: "Headteacher",          department: "Admin",    initials: "EM", avatarBg: "#ede9fe",  avatarColor: "#6d28d9", basicSalary: 5200, allowances: 1800, deductions: 620,  netPay: 6380, bank: "GCB Bank",    accountNo: "****4231", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 2,  name: "Mrs. A. Asante",        role: "English Teacher",      department: "Teaching", initials: "AA", avatarBg: "#fce7f3",  avatarColor: "#9d174d", basicSalary: 3800, allowances: 1200, deductions: 480,  netPay: 4520, bank: "Ecobank",     accountNo: "****8814", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 3,  name: "Mr. K. Mensah",         role: "Maths Teacher",        department: "Teaching", initials: "KM", avatarBg: "#bfdbfe",  avatarColor: "#1e3a8a", basicSalary: 3800, allowances: 1200, deductions: 480,  netPay: 4520, bank: "GCB Bank",    accountNo: "****5521", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 4,  name: "Mrs. A. Boateng",       role: "Science Teacher",      department: "Teaching", initials: "AB", avatarBg: "#fce7f3",  avatarColor: "#9d174d", basicSalary: 3800, allowances: 1200, deductions: 480,  netPay: 4520, bank: "Stanbic",     accountNo: "****0041", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 5,  name: "Mr. N. Lartey",         role: "Social Studies Tchr",  department: "Teaching", initials: "NL", avatarBg: "#dbeafe",  avatarColor: "#1e3a8a", basicSalary: 3800, allowances: 1200, deductions: 480,  netPay: 4520, bank: "Fidelity",    accountNo: "****7732", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 6,  name: "Mr. K. Opoku",          role: "ICT Teacher",          department: "Teaching", initials: "KO", avatarBg: "#e0e7ff",  avatarColor: "#3730a3", basicSalary: 3600, allowances: 1000, deductions: 440,  netPay: 4160, bank: "Ecobank",     accountNo: "****2291", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 7,  name: "Mme. A. Boakye",        role: "French Teacher",       department: "Teaching", initials: "AB", avatarBg: "#fce7f3",  avatarColor: "#9d174d", basicSalary: 3600, allowances: 1000, deductions: 440,  netPay: 4160, bank: "GCB Bank",    accountNo: "****6612", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 8,  name: "Coach A. Gyasi",        role: "PE Teacher",           department: "Teaching", initials: "AG", avatarBg: "#dcfce7",  avatarColor: "#15803d", basicSalary: 3400, allowances: 800,  deductions: 400,  netPay: 3800, bank: "GCB Bank",    accountNo: "****9930", month: "May 2024", status: "Processing", payDate: "—"           },
  { id: 9,  name: "Mrs. A. Aidoo",         role: "Admin Officer",        department: "Admin",    initials: "AA", avatarBg: "#fce7f3",  avatarColor: "#9d174d", basicSalary: 3000, allowances: 700,  deductions: 360,  netPay: 3340, bank: "Stanbic",     accountNo: "****1124", month: "May 2024", status: "Pending",    payDate: "—"           },
  { id: 10, name: "Mr. S. Darko",          role: "Accountant",           department: "Finance",  initials: "SD", avatarBg: "#fef9c3",  avatarColor: "#713f12", basicSalary: 4000, allowances: 1000, deductions: 480,  netPay: 4520, bank: "Ecobank",     accountNo: "****3385", month: "May 2024", status: "Processing", payDate: "—"           },
  { id: 11, name: "Mrs. E. Acheampong",    role: "School Nurse",         department: "Health",   initials: "EA", avatarBg: "#fce7f3",  avatarColor: "#9d174d", basicSalary: 3200, allowances: 900,  deductions: 380,  netPay: 3720, bank: "GCB Bank",    accountNo: "****7741", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 12, name: "Ms. G. Tetteh",         role: "Librarian",            department: "Admin",    initials: "GT", avatarBg: "#fce7f3",  avatarColor: "#9d174d", basicSalary: 2800, allowances: 600,  deductions: 336,  netPay: 3064, bank: "Fidelity",    accountNo: "****5599", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
  { id: 13, name: "Mr. T. Acheampong",     role: "Security / Driver",    department: "Ops",      initials: "TA", avatarBg: "#dbeafe",  avatarColor: "#1e3a8a", basicSalary: 2200, allowances: 500,  deductions: 264,  netPay: 2436, bank: "GCB Bank",    accountNo: "****1107", month: "May 2024", status: "Paid",       payDate: "30 May 2024" },
];

const statusStyle = (s: PayrollStatus) => {
  if (s === "Paid")       return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Processing") return { bg: "#dbeafe", color: "#2563eb" };
  return                         { bg: "#fef3c7", color: "#d97706" };
};

const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

const departments = ["All", "Teaching", "Admin", "Finance", "Health", "Ops"];
const months = ["May 2024", "Apr 2024", "Mar 2024"];

export default function Payroll() {
  const { showToast }  = useApp();
  const { isMobile }   = useWindowSize();

  const [selected,    setSelected]    = useState<StaffPayroll>(payrolls[0]);
  const [deptFilter,  setDeptFilter]  = useState("All");
  const [monthFilter, setMonthFilter] = useState("May 2024");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = payrolls.filter((p) => {
    const mDept  = deptFilter === "All" || p.department === deptFilter;
    const mMonth = p.month === monthFilter;
    return mDept && mMonth;
  });

  const totalPayroll  = payrolls.reduce((s, p) => s + p.netPay, 0);
  const paidCount     = payrolls.filter(p => p.status === "Paid").length;
  const pendingCount  = payrolls.filter(p => p.status !== "Paid").length;
  const totalBasic    = payrolls.reduce((s, p) => s + p.basicSalary, 0);

  const PayslipPanel = () => {
    const st = statusStyle(selected.status);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Payslip — {selected.month}</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => { showToast(`Payslip sent to ${selected.name}`, "success"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, color: "#374151" }}>📤 Send</button>
            <button onClick={() => { showToast("Payslip downloaded", "info"); if (isMobile) setShowPanel(false); }} style={{ padding: "6px 10px", border: "none", borderRadius: 8, background: "#7c3aed", color: "white", cursor: "pointer", fontSize: 12 }}><Download size={12} /></button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 12, padding: "18px", color: "white" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>MAXIBERN EDUCATION CENTRE</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{selected.role} · {selected.department}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{selected.month}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: selected.status==="Paid"?"rgba(22,163,74,0.3)":selected.status==="Processing"?"rgba(37,99,235,0.3)":"rgba(217,119,6,0.3)", color: selected.status==="Paid"?"#86efac":selected.status==="Processing"?"#93c5fd":"#fcd34d" }}>{selected.status}</span>
            </div>
          </div>

          {/* Earnings / Deductions */}
          <div style={{ background: "#f9fafb", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: "#f3f4f6", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>EARNINGS</div>
            {[["Basic Salary", selected.basicSalary], ["Allowances", selected.allowances]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 12.5, color: "#374151" }}>{k}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#16a34a" }}>+ {fmt(v as number)}</span>
              </div>
            ))}
            <div style={{ padding: "8px 12px", background: "#f3f4f6", fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>DEDUCTIONS</div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, color: "#374151" }}>SSNIT + Tax + Others</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626" }}>- {fmt(selected.deductions)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#ede9fe" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>NET PAY</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#7c3aed" }}>{fmt(selected.netPay)}</span>
            </div>
          </div>

          {/* Bank info */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>BANK DETAILS</div>
            {[["Bank", selected.bank], ["Account No.", selected.accountNo], ["Payment Date", selected.payDate]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          {selected.status !== "Paid" && (
            <button onClick={() => setShowConfirm(true)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              💳 Process Payment — {fmt(selected.netPay)}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Payroll</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","HR","Payroll"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => showToast("Payroll report exported", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Download size={14} />{!isMobile && " Export"}
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Payroll",  value: fmt(totalPayroll), icon: "💰", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Total Basic",    value: fmt(totalBasic),   icon: "📋", bg: "#dbeafe", color: "#2563eb" },
          { label: "Paid",           value: `${paidCount}/${payrolls.length} staff`, icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Pending/Processing", value: String(pendingCount), icon: "⏳", bg: "#fef3c7", color: "#d97706" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Month + Department filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {months.map((m) => (
            <button key={m} onClick={() => setMonthFilter(m)} style={{ padding: "6px 10px", border: `1px solid ${monthFilter===m?"#7c3aed":"#e5e7eb"}`, borderRadius: 8, background: monthFilter===m?"#7c3aed":"white", color: monthFilter===m?"white":"#374151", fontSize: 11.5, fontWeight: monthFilter===m?600:400, cursor: "pointer", whiteSpace: "nowrap" }}>{m}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {departments.map((d) => (
            <button key={d} onClick={() => setDeptFilter(d)} style={{ padding: "5px 9px", border: `1px solid ${deptFilter===d?"#374151":"#e5e7eb"}`, borderRadius: 8, background: deptFilter===d?"#111827":"white", color: deptFilter===d?"white":"#374151", fontSize: 11, fontWeight: deptFilter===d?600:400, cursor: "pointer" }}>{d}</button>
          ))}
        </div>
        {pendingCount > 0 && (
          <button onClick={() => showToast(`Processing payroll for ${pendingCount} remaining staff...`, "info")} style={{ marginLeft: "auto", padding: "7px 14px", border: "none", borderRadius: 8, background: "#16a34a", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            💳 Run Payroll for All
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 300px)" }}>
        {/* Staff list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 330, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} staff</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#7c3aed" }}>{fmt(filtered.reduce((s,p)=>s+p.netPay,0))}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((staff) => {
                const st = statusStyle(staff.status);
                const isActive = selected.id === staff.id;
                return (
                  <div key={staff.id} onClick={() => { setSelected(staff); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: staff.avatarBg, color: staff.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{staff.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{staff.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: st.bg, color: st.color, flexShrink: 0 }}>{staff.status}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{staff.role}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{fmt(staff.netPay)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <PayslipPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <PayslipPanel />
          </div>
        </div>
      )}

      {showConfirm && (
        <div onClick={() => setShowConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Confirm Payment</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>
              You are about to process a payroll payment of <strong>{fmt(selected.netPay)}</strong> to <strong>{selected.name}</strong> via {selected.bank}.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { showToast(`Payment of ${fmt(selected.netPay)} processed for ${selected.name}`, "success"); setShowConfirm(false); if (isMobile) setShowPanel(false); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
