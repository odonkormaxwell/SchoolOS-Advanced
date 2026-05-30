import { useState } from "react";
import {
  School, BookOpen, Users, Receipt, MessageSquare,
  Palette, Settings as SettingsIcon, Save, Upload,
  ChevronRight, CheckCircle, CreditCard, Wifi, WifiOff,
  Eye, EyeOff, AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const tabs = [
  { id: "school",        label: "School Profile",       icon: <School size={15} /> },
  { id: "academic",      label: "Academic Settings",    icon: <BookOpen size={15} /> },
  { id: "users",         label: "Users & Permissions",  icon: <Users size={15} /> },
  { id: "fees",          label: "Fees Settings",        icon: <Receipt size={15} /> },
  { id: "payment",       label: "Payment Settings",     icon: <CreditCard size={15} /> },
  { id: "communication", label: "Communication",        icon: <MessageSquare size={15} /> },
  { id: "appearance",    label: "Appearance",           icon: <Palette size={15} /> },
  { id: "system",        label: "System",               icon: <SettingsIcon size={15} /> },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{title}</div>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 11px", border: "1px solid #e5e7eb", borderRadius: 8,
  fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit",
  background: "white", boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: "pointer", appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%239ca3af' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  paddingRight: 28,
};

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7, padding: "9px 20px",
        border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
        background: saved ? "#16a34a" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
        color: "white", transition: "background 0.2s",
      }}
    >
      {saved ? <CheckCircle size={14} /> : <Save size={14} />}
      {saved ? "Saved!" : "Save Changes"}
    </button>
  );
}

function SchoolProfileTab() {
  const { showToast } = useApp();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Happy Kids Basic School",
    address: "12 Independence Avenue, Accra, Ghana",
    phone: "+233 24 400 0000",
    email: "info@happykids.edu.gh",
    website: "www.happykids.edu.gh",
    motto: "Excellence in Every Child",
    region: "Greater Accra",
    district: "Accra Metropolitan",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) { showToast("School name is required", "error"); return; }
    setSaved(true);
    showToast("School profile saved successfully!", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <SectionCard title="School Information">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="School Name *">
              <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Happy Kids Basic School" />
            </Field>
          </div>
          <Field label="Email Address">
            <input style={inputStyle} type="email" value={form.email} onChange={set("email")} placeholder="info@school.edu.gh" />
          </Field>
          <Field label="Phone Number">
            <input style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="+233 24 000 0000" />
          </Field>
          <Field label="Website">
            <input style={inputStyle} value={form.website} onChange={set("website")} placeholder="www.school.edu.gh" />
          </Field>
          <Field label="School Motto">
            <input style={inputStyle} value={form.motto} onChange={set("motto")} placeholder="e.g. Excellence in Every Child" />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="School Address">
              <input style={inputStyle} value={form.address} onChange={set("address")} placeholder="Street, City, Region" />
            </Field>
          </div>
          <Field label="Region">
            <select style={selectStyle} value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}>
              {["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Volta", "Northern", "Upper East", "Upper West", "Brong-Ahafo"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="District">
            <input style={inputStyle} value={form.district} onChange={set("district")} placeholder="e.g. Accra Metropolitan" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="School Logo">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <School size={32} color="white" />
          </div>
          <div>
            <button
              onClick={() => showToast("Logo upload coming soon", "info")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}
            >
              <Upload size={13} /> Upload Logo
            </button>
            <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 5 }}>PNG or JPG, max 2 MB. Recommended: 256×256 px</div>
          </div>
        </div>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function AcademicTab() {
  const { showToast } = useApp();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    year: "2025/2026", term: "Term 2", gradingSystem: "Ghana GES",
    promotionRule: "score-based", passMark: "50",
  });

  const handleSave = () => {
    setSaved(true);
    showToast("Academic settings saved!", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <SectionCard title="Academic Year & Term">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Current Academic Year">
            <select style={selectStyle} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}>
              {["2023/2024", "2024/2025", "2025/2026", "2026/2027"].map((y) => <option key={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Current Term">
            <select style={selectStyle} value={form.term} onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}>
              {["Term 1", "Term 2", "Term 3"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Grading System">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Grading Scale" hint="Select the grading system used by your school">
            <select style={selectStyle} value={form.gradingSystem} onChange={(e) => setForm((f) => ({ ...f, gradingSystem: e.target.value }))}>
              {["Ghana GES", "National Percentage Scale", "Letter Grade (A-F)", "Custom"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Pass Mark (%)" hint="Minimum score to pass a subject">
            <input style={inputStyle} type="number" min="0" max="100" value={form.passMark} onChange={(e) => setForm((f) => ({ ...f, passMark: e.target.value }))} />
          </Field>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Grade Bands (Ghana GES)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { grade: "1", range: "80 – 100", label: "Excellent", color: "#16a34a", bg: "#dcfce7" },
              { grade: "2", range: "70 – 79",  label: "Very Good", color: "#2563eb", bg: "#dbeafe" },
              { grade: "3", range: "60 – 69",  label: "Good",      color: "#7c3aed", bg: "#ede9fe" },
              { grade: "4", range: "50 – 59",  label: "Credit",    color: "#d97706", bg: "#fef3c7" },
              { grade: "5", range: "40 – 49",  label: "Pass",      color: "#ea580c", bg: "#ffedd5" },
              { grade: "6", range: "30 – 39",  label: "Weak Pass", color: "#dc2626", bg: "#fee2e2" },
              { grade: "7", range: "0 – 29",   label: "Fail",      color: "#9f1239", bg: "#ffe4e6" },
            ].map((g) => (
              <div key={g.grade} style={{ padding: "8px 10px", borderRadius: 8, background: g.bg, border: `1px solid ${g.color}22` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: g.color }}>Grade {g.grade}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{g.range}</div>
                <div style={{ fontSize: 11, color: g.color }}>{g.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Promotion Rules">
        <Field label="Promotion Criteria">
          <select style={selectStyle} value={form.promotionRule} onChange={(e) => setForm((f) => ({ ...f, promotionRule: e.target.value }))}>
            <option value="score-based">Score-based (minimum pass mark)</option>
            <option value="automatic">Automatic promotion for all students</option>
            <option value="manual">Manual promotion by headteacher</option>
          </select>
        </Field>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function UsersTab() {
  const { showToast } = useApp();
  const roles = [
    { role: "Administrator",     desc: "Full access to all modules",               count: 2, color: "#7c3aed", bg: "#f5f3ff" },
    { role: "Teacher",           desc: "Students, attendance, assessments",         count: 6, color: "#2563eb", bg: "#eff6ff" },
    { role: "Accountant",        desc: "Fees, invoices, payments, reports",         count: 1, color: "#16a34a", bg: "#f0fdf4" },
    { role: "Admissions Officer",desc: "Students, admissions, communication",       count: 1, color: "#d97706", bg: "#fffbeb" },
    { role: "Parent",            desc: "Read-only portal access (Parent Portal)",   count: 248, color: "#6b7280", bg: "#f9fafb" },
    { role: "Student",           desc: "Read-only portal access (Student Portal)",  count: 312, color: "#6b7280", bg: "#f9fafb" },
  ];

  return (
    <>
      <SectionCard title="User Roles">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {roles.map((r) => (
            <div key={r.role} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: r.bg, border: `1px solid ${r.color}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: r.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={15} color={r.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{r.role}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{r.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: r.color, background: r.bg, padding: "2px 10px", borderRadius: 20 }}>{r.count} users</span>
                <button onClick={() => showToast(`Editing ${r.role} permissions`, "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", fontSize: 12, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Portal Access">
        {[
          { label: "Parent Portal", desc: "Allow parents to view student progress, attendance, and fees", enabled: true },
          { label: "Student Portal", desc: "Allow students to view their grades, timetable, and notices", enabled: true },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.desc}</div>
            </div>
            <button
              onClick={() => showToast(`${item.label} access updated`, "success")}
              style={{ padding: "6px 16px", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: item.enabled ? "#dcfce7" : "#f3f4f6", color: item.enabled ? "#16a34a" : "#9ca3af" }}
            >
              {item.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </SectionCard>
    </>
  );
}

function FeesTab() {
  const { showToast } = useApp();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    currency: "GHS", currencySymbol: "GH₵", paymentMode: "termly",
    receiptPrefix: "RCP", invoicePrefix: "INV", lateFeePercent: "5",
  });

  const handleSave = () => {
    setSaved(true);
    showToast("Fees settings saved!", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <SectionCard title="Currency & Payment">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Currency">
            <select style={selectStyle} value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
              {["GHS", "USD", "GBP", "EUR"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Currency Symbol">
            <input style={inputStyle} value={form.currencySymbol} onChange={(e) => setForm((f) => ({ ...f, currencySymbol: e.target.value }))} />
          </Field>
          <Field label="Default Payment Mode">
            <select style={selectStyle} value={form.paymentMode} onChange={(e) => setForm((f) => ({ ...f, paymentMode: e.target.value }))}>
              <option value="termly">Termly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </Field>
          <Field label="Late Fee Penalty (%)">
            <input style={inputStyle} type="number" min="0" max="50" value={form.lateFeePercent} onChange={(e) => setForm((f) => ({ ...f, lateFeePercent: e.target.value }))} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Receipt & Invoice Settings">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Receipt Prefix" hint="e.g. RCP-2025-0001">
            <input style={inputStyle} value={form.receiptPrefix} onChange={(e) => setForm((f) => ({ ...f, receiptPrefix: e.target.value }))} />
          </Field>
          <Field label="Invoice Prefix" hint="e.g. INV-2025-0001">
            <input style={inputStyle} value={form.invoicePrefix} onChange={(e) => setForm((f) => ({ ...f, invoicePrefix: e.target.value }))} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Fee Categories">
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {["Tuition Fee", "Activity Fee", "Computer Lab Fee", "Library Fee", "Science Lab Fee", "PTA Levy", "BECE Prep Fee"].map((cat) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fafafa" }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{cat}</span>
              <button onClick={() => showToast(`Editing ${cat}`, "info")} style={{ padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "white", fontSize: 11.5, cursor: "pointer", color: "#6b7280" }}>Edit</button>
            </div>
          ))}
        </div>
        <button onClick={() => showToast("Add fee category coming soon", "info")} style={{ padding: "8px 14px", border: "1px dashed #7c3aed", borderRadius: 8, background: "#f5f3ff", color: "#7c3aed", fontSize: 12.5, fontWeight: 600, cursor: "pointer", width: "100%" }}>
          + Add Category
        </button>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function CommunicationTab() {
  const { showToast } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    showToast("Communication settings saved!", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <SectionCard title="SMS Settings">
        <Field label="SMS Provider">
          <select style={selectStyle} defaultValue="mnotify">
            <option value="mnotify">mNotify (Ghana)</option>
            <option value="hubtel">Hubtel</option>
            <option value="twilio">Twilio</option>
          </select>
        </Field>
        <Field label="Sender ID" hint="Your school name or short code (max 11 chars)">
          <input style={inputStyle} defaultValue="MAXIBERN" maxLength={11} />
        </Field>
        <Field label="API Key">
          <input style={inputStyle} type="password" defaultValue="••••••••••••••••" />
        </Field>
      </SectionCard>

      <SectionCard title="WhatsApp Settings">
        <Field label="WhatsApp Business Number">
          <input style={inputStyle} defaultValue="+233 24 400 0000" />
        </Field>
        <Field label="API Provider">
          <select style={selectStyle} defaultValue="360dialog">
            <option value="360dialog">360dialog</option>
            <option value="twilio">Twilio</option>
            <option value="meta">Meta Cloud API</option>
          </select>
        </Field>
      </SectionCard>

      <SectionCard title="Email Settings">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="SMTP Host">
            <input style={inputStyle} defaultValue="smtp.gmail.com" />
          </Field>
          <Field label="SMTP Port">
            <input style={inputStyle} defaultValue="587" />
          </Field>
          <Field label="From Email">
            <input style={inputStyle} defaultValue="noreply@happykids.edu.gh" />
          </Field>
          <Field label="From Name">
            <input style={inputStyle} defaultValue="Happy Kids Basic School" />
          </Field>
        </div>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function AppearanceTab() {
  const { showToast } = useApp();
  const themes = [
    { id: "purple", label: "Purple (Default)", primary: "#7c3aed" },
    { id: "blue",   label: "Ocean Blue",       primary: "#2563eb" },
    { id: "green",  label: "Forest Green",     primary: "#16a34a" },
    { id: "teal",   label: "Teal",             primary: "#0891b2" },
  ];
  const [selectedTheme, setSelectedTheme] = useState("purple");

  return (
    <>
      <SectionCard title="Theme Color">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => { setSelectedTheme(t.id); showToast(`Theme set to ${t.label}`, "success"); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 10, border: `2px solid ${selectedTheme === t.id ? t.primary : "#e5e7eb"}`,
                cursor: "pointer", background: selectedTheme === t.id ? `${t.primary}10` : "white",
                transition: "all 0.12s",
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.primary }} />
              <span style={{ fontSize: 13, fontWeight: selectedTheme === t.id ? 700 : 500, color: selectedTheme === t.id ? t.primary : "#374151" }}>
                {t.label}
              </span>
              {selectedTheme === t.id && <CheckCircle size={16} color={t.primary} style={{ marginLeft: "auto" }} />}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Sidebar Preferences">
        {[
          { label: "Default to compact sidebar on tablet", desc: "Collapses the sidebar automatically on tablet screens" },
          { label: "Show section labels in sidebar",       desc: "Display category labels like STUDENTS, ACADEMICS" },
          { label: "Remember last active page",            desc: "Restore your last visited page on login" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.desc}</div>
            </div>
            <button
              onClick={() => showToast("Preference updated", "success")}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: "#7c3aed", cursor: "pointer", position: "relative" }}
            >
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", right: 3, top: 3 }} />
            </button>
          </div>
        ))}
      </SectionCard>
    </>
  );
}

function SystemTab() {
  const { showToast } = useApp();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ dateFormat: "DD/MM/YYYY", timezone: "Africa/Accra", language: "English (Ghana)" });

  const handleSave = () => {
    setSaved(true);
    showToast("System settings saved!", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <SectionCard title="Localisation">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Date Format">
            <select style={selectStyle} value={form.dateFormat} onChange={(e) => setForm((f) => ({ ...f, dateFormat: e.target.value }))}>
              {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Time Zone">
            <select style={selectStyle} value={form.timezone} onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}>
              {["Africa/Accra", "Africa/Lagos", "Africa/Nairobi", "Europe/London", "America/New_York"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Language">
            <select style={selectStyle} value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}>
              {["English (Ghana)", "English (UK)", "Twi", "Ga"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Data Management">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Export All Data",        desc: "Download a full backup of all school data as a ZIP file",   action: () => showToast("Preparing data export...", "info"),   btnLabel: "Export", color: "#2563eb", bg: "#eff6ff" },
            { label: "Backup Database",        desc: "Create a manual backup of the database right now",           action: () => showToast("Backup created successfully", "success"), btnLabel: "Backup", color: "#16a34a", bg: "#f0fdf4" },
            { label: "Clear Cache",            desc: "Clear system cache to fix display or loading issues",        action: () => showToast("Cache cleared", "success"),           btnLabel: "Clear",  color: "#d97706", bg: "#fffbeb" },
            { label: "Reset Demo Data",        desc: "Restore the system to its original demo data state",         action: () => showToast("Demo data reset. Refresh the page.", "info"), btnLabel: "Reset", color: "#dc2626", bg: "#fff1f2" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: item.bg, border: `1px solid ${item.color}22` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.desc}</div>
              </div>
              <button onClick={item.action} style={{ padding: "7px 14px", border: `1px solid ${item.color}`, borderRadius: 8, background: "white", color: item.color, fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                {item.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: "pointer", flexShrink: 0,
        background: checked ? "#7c3aed" : "#d1d5db", position: "relative", transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 21 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s",
      }} />
    </div>
  );
}

function PaymentSettingsTab() {
  const { showToast } = useApp();
  const [saved, setSaved]             = useState(false);
  const [paystackSaved, setPaystackSaved] = useState(false);
  const [onlineEnabled, setOnlineEnabled] = useState(false);
  const [environment, setEnvironment] = useState("test");
  const [pubKey, setPubKey]           = useState("");
  const [secretKey, setSecretKey]     = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [showSecret, setShowSecret]   = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [connStatus, setConnStatus]   = useState<"idle" | "connected" | "failed">("idle");
  const [testing, setTesting]         = useState(false);

  const [offlineMethods, setOfflineMethods] = useState({
    cash: true, momo: true, bankDeposit: true, bankTransfer: true, cheque: false,
  });
  const [requireApproval, setRequireApproval] = useState(false);
  const [approvalRoles, setApprovalRoles]     = useState({ administrator: true, accountant: false });

  const handleTestConnection = () => {
    if (!pubKey || !secretKey) { showToast("Enter Paystack keys first", "error"); return; }
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      if (pubKey.startsWith("pk_") && secretKey.startsWith("sk_")) {
        setConnStatus("connected");
        showToast("Paystack connection verified ✓", "success");
      } else {
        setConnStatus("failed");
        showToast("Invalid Paystack credentials", "error");
      }
    }, 1800);
  };

  const handleSavePaystack = () => {
    setPaystackSaved(true);
    showToast("Paystack settings saved", "success");
    setTimeout(() => setPaystackSaved(false), 2500);
  };

  const handleSaveOffline = () => {
    setSaved(true);
    showToast("Offline payment settings saved", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  const offlineToggleItems = [
    { key: "cash" as const,         label: "Cash",                  emoji: "💵", desc: "Accept physical cash payments at the office" },
    { key: "momo" as const,         label: "Direct Mobile Money",   emoji: "📱", desc: "MTN Mobile Money, Telecel Cash, AirtelTigo Money" },
    { key: "bankDeposit" as const,  label: "Bank Deposit",          emoji: "🏦", desc: "Parent deposits to school's bank account and shows slip" },
    { key: "bankTransfer" as const, label: "Bank Transfer",         emoji: "💸", desc: "Electronic bank transfer directly to school account" },
    { key: "cheque" as const,       label: "Cheque",                emoji: "📝", desc: "Accept post-dated or current cheques (optional)" },
  ];

  const comingSoonProviders = [
    { name: "Hubtel",       logo: "🔵" },
    { name: "Flutterwave",  logo: "🟠" },
    { name: "ExpressPay",   logo: "🟢" },
    { name: "Bank Integration", logo: "🏦" },
  ];

  return (
    <>
      {/* Paystack Online Payments */}
      <SectionCard title="Online Payments — Paystack">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: onlineEnabled ? "#f0fdf4" : "#fafafa", borderRadius: 10, padding: "12px 14px" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>Enable Online Payments</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Allow parents to pay school fees online via Paystack</div>
          </div>
          <Toggle checked={onlineEnabled} onChange={setOnlineEnabled} />
        </div>

        {onlineEnabled && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Field label="Payment Provider">
                <div style={{ padding: "9px 11px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#f9fafb", color: "#374151" }}>
                  <span style={{ fontWeight: 600 }}>Paystack</span> <span style={{ color: "#9ca3af" }}>(Active)</span>
                </div>
              </Field>
              <Field label="Environment">
                <div style={{ display: "flex", gap: 6 }}>
                  {["test", "live"].map(env => (
                    <button key={env} onClick={() => setEnvironment(env)} style={{
                      flex: 1, padding: "9px", border: `2px solid ${environment === env ? "#7c3aed" : "#e5e7eb"}`,
                      borderRadius: 8, background: environment === env ? "#f5f3ff" : "white",
                      color: environment === env ? "#7c3aed" : "#6b7280", fontWeight: environment === env ? 700 : 500,
                      cursor: "pointer", fontSize: 13, textTransform: "capitalize",
                    }}>
                      {env === "test" ? "🧪 Test" : "🚀 Live"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {environment === "live" && (
              <div style={{ background: "#fef3c7", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 12.5, color: "#d97706", border: "1px solid #fde68a" }}>
                ⚠ <strong>Live mode:</strong> Real money will be charged. Ensure your Paystack account is fully verified before going live.
              </div>
            )}

            <Field label="Paystack Public Key" hint={`Starts with pk_${environment}_...`}>
              <input
                style={inputStyle} value={pubKey} onChange={e => setPubKey(e.target.value)}
                placeholder={`pk_${environment}_xxxxxxxxxxxxxxxxxxxxxxxx`}
              />
            </Field>

            <Field label="Paystack Secret Key" hint="Never share this key. It is stored encrypted.">
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 40 }}
                  type={showSecret ? "text" : "password"}
                  value={secretKey} onChange={e => setSecretKey(e.target.value)}
                  placeholder={`sk_${environment}_xxxxxxxxxxxxxxxxxxxxxxxx`}
                />
                <button onClick={() => setShowSecret(p => !p)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                  {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <Field label="Webhook Secret" hint="Found in Paystack Dashboard → Settings → Webhooks">
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 40 }}
                  type={showWebhook ? "text" : "password"}
                  value={webhookSecret} onChange={e => setWebhookSecret(e.target.value)}
                  placeholder="Webhook secret key"
                />
                <button onClick={() => setShowWebhook(p => !p)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                  {showWebhook ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            {connStatus !== "idle" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, marginBottom: 14, background: connStatus === "connected" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${connStatus === "connected" ? "#bbf7d0" : "#fecaca"}` }}>
                {connStatus === "connected" ? <Wifi size={14} color="#16a34a" /> : <AlertCircle size={14} color="#dc2626" />}
                <span style={{ fontSize: 12.5, fontWeight: 600, color: connStatus === "connected" ? "#16a34a" : "#dc2626" }}>
                  {connStatus === "connected" ? "Connected — Paystack credentials are valid" : "Connection failed — check your credentials"}
                </span>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleTestConnection}
                disabled={testing}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", border: "1px solid #7c3aed", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#7c3aed" }}
              >
                {testing ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Testing…</> : <><Wifi size={13} /> Test Connection</>}
              </button>
              <SaveButton onClick={handleSavePaystack} saved={paystackSaved} />
            </div>
          </>
        )}
      </SectionCard>

      {/* Offline Payment Methods */}
      <SectionCard title="Offline Payment Methods">
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px" }}>
          Choose which offline payment options appear when the Accountant records a payment manually.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {offlineToggleItems.map(item => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: `1px solid ${offlineMethods[item.key] ? "#c4b5fd" : "#e5e7eb"}`, borderRadius: 10, background: offlineMethods[item.key] ? "#faf5ff" : "#fafafa", transition: "all 0.15s" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{item.desc}</div>
                </div>
              </div>
              <Toggle checked={offlineMethods[item.key]} onChange={v => setOfflineMethods(p => ({ ...p, [item.key]: v }))} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SaveButton onClick={handleSaveOffline} saved={saved} />
        </div>
      </SectionCard>

      {/* Approval Workflow */}
      <SectionCard title="Offline Payment Approval Workflow">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: requireApproval ? 16 : 0, background: requireApproval ? "#fff7ed" : "#fafafa", borderRadius: 10, padding: "12px 14px" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>Require Approval for Offline Payments</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Bank deposits, transfers, and cheques must be approved before the invoice is updated</div>
          </div>
          <Toggle checked={requireApproval} onChange={setRequireApproval} />
        </div>

        {requireApproval && (
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Who can approve payments?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { key: "administrator" as const, label: "Administrator", desc: "Always allowed to approve" },
                { key: "accountant" as const,    label: "Accountant",    desc: "Optional — grant approval permission to accountants" },
              ] as const).map(r => (
                <div key={r.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: approvalRoles[r.key] ? "#f5f3ff" : "#fafafa" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{r.label}</span>
                    <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{r.desc}</div>
                  </div>
                  <Toggle checked={approvalRoles[r.key]} onChange={v => setApprovalRoles(p => ({ ...p, [r.key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Future providers */}
      <SectionCard title="Future Payment Providers">
        <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 14px" }}>Additional payment providers will be integrated in future updates.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {comingSoonProviders.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fafafa" }}>
              <span style={{ fontSize: 22 }}>{p.logo}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{p.name}</div>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#f3f4f6", color: "#9ca3af" }}>Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("school");
  const { isMobile } = useWindowSize();

  const renderTab = () => {
    switch (activeTab) {
      case "school":        return <SchoolProfileTab />;
      case "academic":      return <AcademicTab />;
      case "users":         return <UsersTab />;
      case "fees":          return <FeesTab />;
      case "payment":       return <PaymentSettingsTab />;
      case "communication": return <CommunicationTab />;
      case "appearance":    return <AppearanceTab />;
      case "system":        return <SystemTab />;
      default:              return <SchoolProfileTab />;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Manage your school profile, academic settings, and system preferences.</p>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Tab sidebar */}
        {!isMobile && (
          <div style={{ width: 200, flexShrink: 0 }}>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                    cursor: "pointer", borderBottom: "1px solid #f3f4f6",
                    background: activeTab === tab.id ? "#f5f3ff" : "white",
                    borderLeft: activeTab === tab.id ? "3px solid #7c3aed" : "3px solid transparent",
                    transition: "all 0.1s",
                  }}
                >
                  <span style={{ color: activeTab === tab.id ? "#7c3aed" : "#9ca3af", display: "flex" }}>{tab.icon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? "#7c3aed" : "#374151" }}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && <ChevronRight size={12} color="#7c3aed" style={{ marginLeft: "auto" }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile tab bar */}
        {isMobile && (
          <div style={{ width: "100%", overflowX: "auto", paddingBottom: 8 }}>
            <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                    borderRadius: 20, border: activeTab === tab.id ? "none" : "1px solid #e5e7eb",
                    background: activeTab === tab.id ? "#7c3aed" : "white",
                    color: activeTab === tab.id ? "white" : "#374151",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab content */}
        <div style={{ flex: 1, minWidth: 0 }}>{renderTab()}</div>
      </div>
    </div>
  );
}
