import { useState } from "react";
import { Plus, Search, ChevronRight, X, Phone, Mail, MapPin, Star, Calendar, BookOpen, Download, Printer, Upload } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import ImportModal from "../components/ImportModal";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";

type StaffMember = {
  id: number; name: string; staffId: string; role: string; department: string;
  subjects?: string[]; email: string; phone: string; gender: string;
  joinDate: string; qualification: string; experience: string;
  status: "Active" | "On Leave" | "Part-Time";
  rating: number; classesCount: number; attendance: string;
  initials: string; avatarBg: string; avatarColor: string;
  address: string;
};

const staff: StaffMember[] = [
  { id: 1,  name: "Mr. Kofi Appiah",        staffId: "STF-001", role: "Class Teacher",     department: "Teaching",   subjects: ["Mathematics","Science"],         email: "k.appiah@happykids.edu.gh",   phone: "0244100001", gender: "Male",   joinDate: "Sep 2018", qualification: "B.Ed Mathematics",    experience: "6 years",  status: "Active",    rating: 4.8, classesCount: 5, attendance: "98%", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", address: "Madina, Accra" },
  { id: 2,  name: "Mrs. Akua Asante",        staffId: "STF-002", role: "English Teacher",   department: "Teaching",   subjects: ["English Language","French"],      email: "a.asante@happykids.edu.gh",   phone: "0244100002", gender: "Female", joinDate: "Jan 2016", qualification: "B.A English",          experience: "8 years",  status: "Active",    rating: 4.9, classesCount: 6, attendance: "99%", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d", address: "East Legon, Accra" },
  { id: 3,  name: "Mrs. Ama Boateng",        staffId: "STF-003", role: "Science Teacher",   department: "Teaching",   subjects: ["Integrated Science","BDT"],       email: "a.boateng@happykids.edu.gh",  phone: "0244100003", gender: "Female", joinDate: "Sep 2019", qualification: "B.Sc. Biology",        experience: "5 years",  status: "Active",    rating: 4.6, classesCount: 4, attendance: "95%", initials: "AB", avatarBg: "#fce7f3", avatarColor: "#9d174d", address: "Adenta, Accra" },
  { id: 4,  name: "Mr. Nii Lartey",          staffId: "STF-004", role: "Social Studies",    department: "Teaching",   subjects: ["Social Studies","RME"],           email: "n.lartey@happykids.edu.gh",   phone: "0244100004", gender: "Male",   joinDate: "Jan 2020", qualification: "B.Ed Social Studies",  experience: "4 years",  status: "Active",    rating: 4.4, classesCount: 4, attendance: "94%", initials: "NL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", address: "Teshie, Accra" },
  { id: 5,  name: "Mr. Kweku Opoku",         staffId: "STF-005", role: "ICT Teacher",       department: "Teaching",   subjects: ["ICT","Computing"],                email: "k.opoku@happykids.edu.gh",    phone: "0244100005", gender: "Male",   joinDate: "Sep 2021", qualification: "B.Sc. Computer Sci",   experience: "3 years",  status: "Active",    rating: 4.7, classesCount: 5, attendance: "97%", initials: "KO", avatarBg: "#e0e7ff", avatarColor: "#3730a3", address: "Dome, Accra" },
  { id: 6,  name: "Coach Albert Gyasi",      staffId: "STF-006", role: "P.E. Teacher",      department: "Teaching",   subjects: ["Physical Education"],            email: "a.gyasi@happykids.edu.gh",    phone: "0244100006", gender: "Male",   joinDate: "Sep 2017", qualification: "B.Sc Sports Science",  experience: "7 years",  status: "Active",    rating: 4.5, classesCount: 8, attendance: "96%", initials: "AG", avatarBg: "#dcfce7", avatarColor: "#15803d", address: "Achimota, Accra" },
  { id: 7,  name: "Mme. Adwoa Boakye",       staffId: "STF-007", role: "French Teacher",    department: "Teaching",   subjects: ["French","Ghanaian Language"],     email: "a.boakye@happykids.edu.gh",   phone: "0244100007", gender: "Female", joinDate: "Jan 2022", qualification: "B.A French",           experience: "2 years",  status: "On Leave",  rating: 4.3, classesCount: 0, attendance: "—",   initials: "AB", avatarBg: "#fce7f3", avatarColor: "#9d174d", address: "Lapaz, Accra" },
  { id: 8,  name: "Mr. Emmanuel Mensah",     staffId: "STF-008", role: "Headteacher",       department: "Admin",      subjects: [],                                email: "e.mensah@happykids.edu.gh",   phone: "0244100008", gender: "Male",   joinDate: "Jan 2010", qualification: "M.Ed Administration", experience: "14 years", status: "Active",    rating: 5.0, classesCount: 0, attendance: "100%",initials: "EM", avatarBg: "#ede9fe", avatarColor: "#6d28d9", address: "Accra Central" },
  { id: 9,  name: "Mrs. Abena Aidoo",        staffId: "STF-009", role: "School Secretary",  department: "Admin",      subjects: [],                                email: "a.aidoo@happykids.edu.gh",    phone: "0244100009", gender: "Female", joinDate: "Mar 2015", qualification: "HND Secretarial",      experience: "9 years",  status: "Active",    rating: 4.6, classesCount: 0, attendance: "98%", initials: "AA", avatarBg: "#fce7f3", avatarColor: "#9d174d", address: "Tema, Greater Accra" },
  { id: 10, name: "Mr. Samuel Darko",        staffId: "STF-010", role: "Accountant",        department: "Finance",    subjects: [],                                email: "s.darko@happykids.edu.gh",    phone: "0244100010", gender: "Male",   joinDate: "Sep 2016", qualification: "B.Sc Accounting",      experience: "8 years",  status: "Active",    rating: 4.4, classesCount: 0, attendance: "97%", initials: "SD", avatarBg: "#fef9c3", avatarColor: "#713f12", address: "Kasoa, CR" },
  { id: 11, name: "Mrs. Efua Acheampong",    staffId: "STF-011", role: "School Nurse",      department: "Health",     subjects: [],                                email: "e.acheampong@happykids.edu.gh",phone:"0244100011",gender: "Female", joinDate: "Jan 2019", qualification: "Diploma Nursing",       experience: "5 years",  status: "Active",    rating: 4.8, classesCount: 0, attendance: "99%", initials: "EA", avatarBg: "#fce7f3", avatarColor: "#9d174d", address: "Dome, Accra" },
  { id: 12, name: "Mr. Kofi Adjei (Driver)", staffId: "STF-012", role: "Bus Driver",        department: "Operations", subjects: [],                                email: "k.adjei@happykids.edu.gh",    phone: "0244100012", gender: "Male",   joinDate: "Jan 2013", qualification: "Professional Driver",  experience: "11 years", status: "Active",    rating: 4.5, classesCount: 0, attendance: "96%", initials: "KA", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", address: "Spintex, Accra" },
  { id: 13, name: "Ms. Grace Tetteh",        staffId: "STF-013", role: "Librarian",         department: "Operations", subjects: [],                                email: "g.tetteh@happykids.edu.gh",   phone: "0244100013", gender: "Female", joinDate: "Sep 2020", qualification: "B.A Library Studies", experience: "4 years",  status: "Part-Time", rating: 4.2, classesCount: 0, attendance: "82%", initials: "GT", avatarBg: "#fce7f3", avatarColor: "#9d174d", address: "Achimota, Accra" },
];

const departments = ["All", "Teaching", "Admin", "Finance", "Health", "Operations"];

const statusStyle = (s: string) => {
  if (s === "Active")    return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "On Leave")  return { bg: "#fef3c7", color: "#d97706" };
  return                        { bg: "#dbeafe", color: "#2563eb" };
};

export default function Staff() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [selected,   setSelected]   = useState<StaffMember>(staff[0]);
  const [searchQuery,setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter]  = useState("All");
  const [showPanel,  setShowPanel]   = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = () => {
    const rows = filtered.map((s) => ({
      "Staff ID":      s.staffId,
      "Name":          s.name,
      "Role":          s.role,
      "Department":    s.department,
      "Email":         s.email,
      "Phone":         s.phone,
      "Gender":        s.gender,
      "Join Date":     s.joinDate,
      "Qualification": s.qualification,
      "Experience":    s.experience,
      "Status":        s.status,
      "Attendance":    s.attendance,
    }));
    exportToCSV("staff_export", rows);
    showToast(`${rows.length} staff records exported to CSV`, "success");
  };

  const handlePrint = () => {
    const rows = filtered.map((s) =>
      `<tr><td>${s.staffId}</td><td>${s.name}</td><td>${s.role}</td><td>${s.department}</td><td>${s.phone}</td><td>${s.status}</td></tr>`
    ).join("");
    printHTML(`
      <h2 style="margin:0 0 10px;font-size:16px;">Staff Directory — Happy Kids Basic School</h2>
      <p style="margin:0 0 14px;font-size:12px;color:#666;">Academic Year 2025/2026 · Generated ${new Date().toLocaleDateString("en-GB")}</p>
      <table border="1" cellpadding="7" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead style="background:#ede9fe;"><tr>
          <th>Staff ID</th><th>Name</th><th>Role</th><th>Department</th><th>Phone</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:#999;">Total: ${filtered.length} staff members</p>
    `);
  };

  const filtered = staff.filter((s) => {
    const mSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const mDept   = deptFilter === "All" || s.department === deptFilter;
    return mSearch && mDept;
  });

  const active    = staff.filter(s => s.status === "Active").length;
  const onLeave   = staff.filter(s => s.status === "On Leave").length;
  const teaching  = staff.filter(s => s.department === "Teaching").length;

  const renderStars = (rating: number) => (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={11} fill={n <= Math.round(rating) ? "#f59e0b" : "none"} color={n <= Math.round(rating) ? "#f59e0b" : "#d1d5db"} />
      ))}
      <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 3 }}>{rating.toFixed(1)}</span>
    </div>
  );

  const StaffPanel = () => {
    const st = statusStyle(selected.status);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Staff Profile</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast(`Opening edit form for ${selected.name}`, "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Avatar & name */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "#f9fafb", borderRadius: 12, padding: "14px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: selected.avatarBg, color: selected.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{selected.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{selected.role} · {selected.department}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{selected.status}</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{selected.staffId}</span>
              </div>
            </div>
          </div>

          {/* Rating + stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Rating", value: selected.rating.toFixed(1), sub: "out of 5.0", bg: "#fef3c7", color: "#d97706" },
              { label: "Classes", value: selected.classesCount > 0 ? String(selected.classesCount) : "N/A", sub: "this week", bg: "#dbeafe", color: "#2563eb" },
              { label: "Attendance", value: selected.attendance, sub: "this term", bg: "#dcfce7", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9.5, color: s.color, fontWeight: 600, marginTop: 1 }}>{s.label}</div>
                <div style={{ fontSize: 9.5, color: s.color, opacity: 0.7 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>INFORMATION</div>
            {[
              ["Email",         selected.email,         <Mail size={12} color="#7c3aed" />],
              ["Phone",         selected.phone,         <Phone size={12} color="#16a34a" />],
              ["Gender",        selected.gender,        null],
              ["Joined",        selected.joinDate,      <Calendar size={12} color="#2563eb" />],
              ["Qualification", selected.qualification, null],
              ["Experience",    selected.experience,    null],
              ["Address",       selected.address,       <MapPin size={12} color="#d97706" />],
            ].map(([k, v, icon]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {icon}{<span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>}
                </div>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500, textAlign: "right", maxWidth: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Subjects */}
          {selected.subjects && selected.subjects.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>SUBJECTS TAUGHT</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.subjects.map((subj) => (
                  <div key={subj} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: "#ede9fe", border: "1px solid #ddd6fe" }}>
                    <BookOpen size={11} color="#7c3aed" />
                    <span style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 600 }}>{subj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating stars */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>PERFORMANCE RATING</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {renderStars(selected.rating)}
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>Rated by peers & admin</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Calling ${selected.name}...`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📞 Call Staff
            </button>
            <button onClick={() => { showToast(`Email drafted for ${selected.name}`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              ✉️ Send Email
            </button>
            <button onClick={() => { showToast(`Viewing attendance log for ${selected.name}`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📅 View Attendance Log
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
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Staff</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "HR", "Staff"].map((c, i, a) => (
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
            <>
              <button onClick={() => setShowImportModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                <Upload size={13} color="#6b7280" /> Import
              </button>
              <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                <Download size={13} color="#6b7280" /> Export
              </button>
              <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
                <Printer size={13} color="#6b7280" /> Print
              </button>
            </>
          )}
          <button onClick={() => showToast("Add staff form coming soon", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Plus size={14} />{!isMobile && " Add Staff"}
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Staff",    value: String(staff.length),  icon: "👨‍🏫", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Active Today",   value: String(active),        icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "On Leave",       value: String(onLeave),       icon: "🏖️",  bg: "#fef3c7", color: "#d97706" },
          { label: "Teaching Staff", value: String(teaching),      icon: "📚", bg: "#dbeafe", color: "#2563eb" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + dept filter */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or role..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {departments.map((d) => (
            <button key={d} onClick={() => setDeptFilter(d)}
              style={{ padding: "7px 12px", border: `1px solid ${deptFilter === d ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: deptFilter === d ? "#7c3aed" : "white", color: deptFilter === d ? "white" : "#374151", fontSize: 12, fontWeight: deptFilter === d ? 600 : 400, cursor: "pointer" }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 310px)" }}>
        {/* Staff list */}
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 320, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} staff member{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((member) => {
                const st = statusStyle(member.status);
                const isActive = selected.id === member.id;
                return (
                  <div key={member.id}
                    onClick={() => { setSelected(member); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 10, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: member.avatarBg, color: member.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{member.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{member.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>{member.status}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 500, marginTop: 1 }}>{member.role}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{member.department} · {member.experience}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail panel */}
        {(!isMobile || showPanel) && <StaffPanel />}
      </div>

      {showImportModal && (
        <ImportModal
          title="Import Staff Members"
          templateHeaders={["Name", "Role", "Department", "Email", "Phone", "Gender", "Qualification", "Status"]}
          templateFilename="staff_template"
          onClose={() => setShowImportModal(false)}
          onImport={() => { setShowImportModal(false); showToast("Staff records imported successfully!", "success"); }}
        />
      )}

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <StaffPanel />
          </div>
        </div>
      )}
    </div>
  );
}
