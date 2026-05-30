import { useState } from "react";
import { Download, Upload, Plus, Search, ChevronDown, RotateCcw, MoreVertical, ChevronLeft, ChevronRight, Users, GraduationCap, UserCheck, X, Phone, Printer } from "lucide-react";
import { studentsKpiCards, students } from "../data/studentsData";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";
import ImportModal from "../components/ImportModal";
import { exportToCSV } from "../utils/csvExport";
import { printHTML } from "../utils/printUtils";

const iconMap: Record<string, React.ReactNode> = {
  students: <Users size={20} />,
  male: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="14" r="5" /><path d="M19 5l-5.4 5.4M19 5h-5M19 5v5" /></svg>,
  female: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5" /><line x1="12" y1="13" x2="12" y2="21" /><line x1="9" y1="18" x2="15" y2="18" /></svg>,
  new: <GraduationCap size={20} />,
  active: <UserCheck size={20} />,
};

const emptyForm = { name: "", class: "", gender: "Male", dob: "", parent: "", phone: "", status: "Active" };

export default function AllStudents() {
  const { showToast } = useApp();
  const { isMobile, isTablet } = useWindowSize();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedHouse, setSelectedHouse] = useState("All Houses");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClass === "All Classes" || s.class === selectedClass;
    const matchHouse = selectedHouse === "All Houses" || s.house === selectedHouse;
    const matchStatus = selectedStatus === "All Status" || s.status === selectedStatus;
    return matchSearch && matchClass && matchHouse && matchStatus;
  });

  const toggleRow = (id: number) => setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  const toggleAll = () => setSelectedRows(selectedRows.length === filteredStudents.length ? [] : filteredStudents.map((s) => s.id));

  const resetFilters = () => { setSearchQuery(""); setSelectedClass("All Classes"); setSelectedHouse("All Houses"); setSelectedStatus("All Status"); };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setForm(emptyForm);
    showToast("Student added successfully!", "success");
  };

  const handleImport = () => setShowImportModal(true);

  const handleExport = () => {
    const rows = filteredStudents.map((s) => ({
      "Student ID": s.studentId,
      "Admission No": s.admissionNo,
      "Full Name": s.name,
      "Gender": s.gender,
      "Age": s.age,
      "Class": s.class,
      "House": s.house,
      "Date of Birth": s.dob,
      "Parent/Guardian": s.parent,
      "Parent Phone": s.parentPhone,
      "Status": s.status,
    }));
    exportToCSV("students_export", rows);
    showToast(`${rows.length} student records exported to CSV`, "success");
  };

  const handlePrint = () => {
    const rows = filteredStudents.map((s) =>
      `<tr><td>${s.studentId}</td><td>${s.name}</td><td>${s.class}</td><td>${s.gender}</td><td>${s.dob}</td><td>${s.parent}</td><td>${s.parentPhone}</td><td>${s.status}</td></tr>`
    ).join("");
    printHTML(`
      <div class="header">
        <div><h1>Student List</h1><div class="school">Happy Kids Basic School · Academic Year 2025/2026</div></div>
        <div class="school">Printed: ${new Date().toLocaleDateString("en-GB")}</div>
      </div>
      <table>
        <thead><tr><th>Student ID</th><th>Full Name</th><th>Class</th><th>Gender</th><th>Date of Birth</th><th>Parent/Guardian</th><th>Phone</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `, "Student List");
  };

  const kpiCols = isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(5, 1fr)";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>All Students</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Students", "All Students"].map((c, i, a) => (
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
              <button onClick={handleImport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
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
          <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: isMobile ? "9px 14px" : "8px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white", boxShadow: "0 2px 8px rgba(124,58,237,0.3)" }}>
            <Plus size={14} />{!isMobile && " Add Student"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 12, marginBottom: 18 }}>
        {studentsKpiCards.map((card) => (
          <div key={card.id} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: card.iconColor, flexShrink: 0 }}>
              {iconMap[card.icon]}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 1 }}>{card.title}</div>
              <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#111827", lineHeight: 1.2, marginBottom: 1 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: card.subColor, fontWeight: 500 }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
        {/* Filter Bar */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, student ID..."
              style={{ width: "100%", padding: "8px 10px 8px 30px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>
          {!isMobile && (
            <>
              {[
                { label: "Class", value: selectedClass, setValue: setSelectedClass, options: ["All Classes", "P1 - Coral", "P2 - Pearl", "P3 - Emerald", "P4 - Ruby", "P5 - Diamond", "P6 - Topaz"] },
                { label: "Status", value: selectedStatus, setValue: setSelectedStatus, options: ["All Status", "Active", "Inactive"] },
              ].map(({ label, value, setValue, options }) => (
                <div key={label} style={{ position: "relative", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{label}</span>
                  <div style={{ position: "relative" }}>
                    <select value={value} onChange={(e) => setValue(e.target.value)} style={{ appearance: "none", padding: "7px 24px 7px 9px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", background: "white", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              ))}
            </>
          )}
          <button onClick={resetFilters} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", border: "none", borderRadius: 8, background: "none", cursor: "pointer", fontSize: 12, color: "#9ca3af" }}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* Mobile card list */}
        {isMobile ? (
          <div style={{ padding: "10px 12px" }}>
            {filteredStudents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#9ca3af", fontSize: 13 }}>No students found</div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} onClick={() => setSelectedStudent(student)}
                  style={{ background: selectedStudent?.id === student.id ? "#faf5ff" : "white", border: `1px solid ${selectedStudent?.id === student.id ? "#ede9fe" : "#f3f4f6"}`, borderRadius: 10, padding: "12px", marginBottom: 8, cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: student.avatarBg, color: student.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {student.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{student.name}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{student.class} · {student.studentId}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{student.parent}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: student.status === "Active" ? "#dcfce7" : "#fee2e2", color: student.status === "Active" ? "#16a34a" : "#dc2626" }}>
                      {student.status}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: student.houseBg, color: student.houseColor }}>
                      {student.house}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Desktop table */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  <th style={{ padding: "10px 14px", width: 36 }}>
                    <input type="checkbox" checked={selectedRows.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleAll} style={{ cursor: "pointer", accentColor: "#7c3aed" }} />
                  </th>
                  {["STUDENT", "STUDENT ID", "CLASS", "HOUSE", "DATE OF BIRTH", "PARENT / GUARDIAN", "STATUS", ""].map((col) => (
                    <th key={col} style={{ padding: "10px 10px", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textAlign: "left", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id}
                    style={{ borderBottom: idx < filteredStudents.length - 1 ? "1px solid #f9fafb" : "none", background: selectedRows.includes(student.id) ? "#faf5ff" : "white", transition: "background 0.1s", cursor: "pointer" }}
                    onMouseEnter={(e) => { if (!selectedRows.includes(student.id)) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!selectedRows.includes(student.id)) (e.currentTarget as HTMLElement).style.background = "white"; }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <input type="checkbox" checked={selectedRows.includes(student.id)} onChange={() => toggleRow(student.id)} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer", accentColor: "#7c3aed" }} />
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: student.avatarBg, color: student.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {student.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{student.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{student.gender} • {student.age} yrs</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500 }}>{student.studentId}</span></td>
                    <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 12, color: "#374151" }}>{student.class}</span></td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: student.houseBg, color: student.houseColor }}>{student.house}</span>
                    </td>
                    <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 12, color: "#374151" }}>{student.dob}</span></td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{student.parent}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{student.parentPhone}</div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: student.status === "Active" ? "#dcfce7" : "#fee2e2", color: student.status === "Active" ? "#16a34a" : "#dc2626" }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ position: "relative" }}>
                        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === student.id ? null : student.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4, borderRadius: 6, display: "flex" }}>
                          <MoreVertical size={15} />
                        </button>
                        {menuOpen === student.id && (
                          <div style={{ position: "absolute", right: 0, top: 28, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 10, width: 140, overflow: "hidden" }}>
                            {["View Profile", "Edit Student", "Message Parent", "Mark Absent", "Delete"].map((action) => (
                              <button key={action} onClick={() => { setMenuOpen(null); showToast(`${action}: ${student.name}`, action === "Delete" ? "error" : "info"); }}
                                style={{ display: "block", width: "100%", padding: "9px 12px", border: "none", background: "none", textAlign: "left", fontSize: 12.5, cursor: "pointer", color: action === "Delete" ? "#dc2626" : "#374151" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                              >{action}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing {filteredStudents.length} of <strong style={{ color: "#374151" }}>1,248</strong> students
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={13} /></button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 30, height: 30, borderRadius: 6, border: currentPage === p ? "none" : "1px solid #e5e7eb", background: currentPage === p ? "#7c3aed" : "white", color: currentPage === p ? "white" : "#374151", fontSize: 12.5, fontWeight: currentPage === p ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
            ))}
            <span style={{ padding: "0 2px", color: "#9ca3af" }}>…</span>
            <button style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>125</button>
            <button style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={13} /></button>
          </div>
        </div>
      </div>

      {/* Student Detail Bottom Sheet (mobile) */}
      {isMobile && selectedStudent && (
        <div onClick={() => setSelectedStudent(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", padding: "20px 16px 24px", maxHeight: "70vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb", margin: "0 auto 16px" }} />
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: selectedStudent.avatarBg, color: selectedStudent.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{selectedStudent.initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{selectedStudent.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{selectedStudent.studentId}</div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: selectedStudent.status === "Active" ? "#dcfce7" : "#fee2e2", color: selectedStudent.status === "Active" ? "#16a34a" : "#dc2626" }}>{selectedStudent.status}</span>
              </div>
            </div>
            {[["Class", selectedStudent.class], ["House", selectedStudent.house], ["Date of Birth", selectedStudent.dob], ["Parent/Guardian", selectedStudent.parent], ["Phone", selectedStudent.parentPhone]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 12.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => { setSelectedStudent(null); showToast("Message sent to parent", "success"); }} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 9, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Phone size={14} /> Call Parent
              </button>
              <button onClick={() => { setSelectedStudent(null); showToast("Opening student profile...", "info"); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: isMobile ? "20px 20px 0 0" : 16, padding: "24px", width: isMobile ? "100%" : 480, animation: "slideUp 0.2s ease", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Add New Student</span>
              <button onClick={() => setShowAddModal(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Kofi Asante" },
                  { label: "Date of Birth", key: "dob", type: "date", placeholder: "" },
                  { label: "Parent/Guardian", key: "parent", type: "text", placeholder: "Parent name" },
                  { label: "Phone Number", key: "phone", type: "tel", placeholder: "0244000000" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required
                      style={{ width: "100%", padding: "9px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Class</label>
                  <select value={form.class} onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))} style={{ width: "100%", padding: "9px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                    <option value="">Select class</option>
                    {["P1 - Coral", "P2 - Pearl", "P3 - Emerald", "P4 - Ruby", "P5 - Diamond", "P6 - Topaz"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Gender</label>
                  <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} style={{ width: "100%", padding: "9px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 9, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: "10px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          title="Students"
          templateFilename="students"
          templateHeaders={["Full Name", "Gender", "Date of Birth", "Class", "House", "Parent/Guardian", "Parent Phone"]}
          instructions={[
            "Download the sample template and open it in Excel or Google Sheets.",
            "Fill in one row per student. Do not change the column headers.",
            "Save as CSV (.csv) or Excel (.xlsx) format.",
            "Upload the file below and click Import.",
            "Duplicate student IDs will be skipped automatically.",
          ]}
          onClose={() => setShowImportModal(false)}
          onImport={() => showToast("Students imported successfully!", "success")}
        />
      )}
    </div>
  );
}
