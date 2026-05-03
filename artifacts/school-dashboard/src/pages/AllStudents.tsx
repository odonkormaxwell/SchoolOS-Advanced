import { useState } from "react";
import {
  Download,
  Upload,
  Plus,
  Search,
  ChevronDown,
  Filter,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { studentsKpiCards, students } from "../data/studentsData";

const iconMap: Record<string, React.ReactNode> = {
  students: <Users size={22} />,
  male: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10" cy="14" r="5"/>
      <path d="M19 5l-5.4 5.4M19 5h-5M19 5v5"/>
    </svg>
  ),
  female: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="5"/>
      <line x1="12" y1="13" x2="12" y2="21"/>
      <line x1="9" y1="18" x2="15" y2="18"/>
    </svg>
  ),
  new: <GraduationCap size={22} />,
  active: <UserCheck size={22} />,
};

export default function AllStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedHouse, setSelectedHouse] = useState("All Houses");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = selectedClass === "All Classes" || s.class === selectedClass;
    const matchHouse = selectedHouse === "All Houses" || s.house === selectedHouse;
    const matchStatus = selectedStatus === "All Status" || s.status === selectedStatus;
    return matchSearch && matchClass && matchHouse && matchStatus;
  });

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredStudents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredStudents.map((s) => s.id));
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>
            All Students
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            {["Dashboard", "Students", "All Students"].map((crumb, i, arr) => (
              <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: i === arr.length - 1 ? "#374151" : "#9ca3af",
                    fontWeight: i === arr.length - 1 ? 500 : 400,
                    cursor: i < arr.length - 1 ? "pointer" : "default",
                  }}
                >
                  {crumb}
                </span>
                {i < arr.length - 1 && (
                  <ChevronRight size={12} color="#d1d5db" />
                )}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            <Upload size={14} color="#6b7280" /> Import Students
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            <Download size={14} color="#6b7280" /> Export
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
              border: "none",
              borderRadius: 8,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 600,
              color: "white",
              boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
            }}
          >
            <Plus size={15} /> Add New Student
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {studentsKpiCards.map((card) => (
          <div
            key={card.id}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #f3f4f6",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.iconColor,
                flexShrink: 0,
              }}
            >
              {iconMap[card.icon]}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 2 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2, marginBottom: 2 }}>
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: card.subColor, fontWeight: 500 }}>
                {card.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table Card */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid #f3f4f6",
          overflow: "hidden",
        }}
      >
        {/* Filter Bar */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search
              size={14}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, admission no., student ID..."
              style={{
                width: "100%",
                padding: "8px 10px 8px 32px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12.5,
                color: "#374151",
                outline: "none",
                background: "#fafafa",
              }}
            />
          </div>

          {/* Dropdowns */}
          {[
            { label: "Class", value: selectedClass, setValue: setSelectedClass, options: ["All Classes", "P1 - Coral", "P2 - Pearl", "P3 - Emerald", "P4 - Ruby", "P5 - Diamond", "P6 - Topaz"] },
            { label: "House", value: selectedHouse, setValue: setSelectedHouse, options: ["All Houses", "Topaz", "Diamond", "Pearl", "Ruby", "Emerald"] },
            { label: "Status", value: selectedStatus, setValue: setSelectedStatus, options: ["All Status", "Active", "Inactive"] },
          ].map(({ label, value, setValue, options }) => (
            <div key={label} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11.5, color: "#9ca3af", whiteSpace: "nowrap" }}>{label}</span>
              <div style={{ position: "relative" }}>
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  style={{
                    appearance: "none",
                    padding: "7px 28px 7px 10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 12.5,
                    color: "#374151",
                    background: "white",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={12} color="#9ca3af" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          ))}

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            <Filter size={13} color="#6b7280" /> Filter
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              border: "none",
              borderRadius: 8,
              background: "none",
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#9ca3af",
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                <th style={{ padding: "10px 16px", width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleAll}
                    style={{ cursor: "pointer", accentColor: "#7c3aed" }}
                  />
                </th>
                {["STUDENT", "STUDENT ID", "ADMISSION NO.", "CLASS", "HOUSE", "DATE OF BIRTH", "PARENT / GUARDIAN", "STATUS", "ACTIONS"].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 12px",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#9ca3af",
                      textAlign: "left",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr
                  key={student.id}
                  style={{
                    borderBottom: idx < filteredStudents.length - 1 ? "1px solid #f9fafb" : "none",
                    background: selectedRows.includes(student.id) ? "#faf5ff" : "white",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedRows.includes(student.id))
                      (e.currentTarget as HTMLElement).style.background = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedRows.includes(student.id))
                      (e.currentTarget as HTMLElement).style.background = "white";
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: "12px 16px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(student.id)}
                      onChange={() => toggleRow(student.id)}
                      style={{ cursor: "pointer", accentColor: "#7c3aed" }}
                    />
                  </td>

                  {/* Student name + avatar */}
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: student.avatarBg,
                          color: student.avatarColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {student.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{student.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>
                          {student.gender} • {student.age} years
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Student ID */}
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500, cursor: "pointer" }}>
                      {student.studentId}
                    </span>
                  </td>

                  {/* Admission No */}
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{student.admissionNo}</span>
                  </td>

                  {/* Class */}
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{student.class}</span>
                  </td>

                  {/* House badge */}
                  <td style={{ padding: "12px 12px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: student.houseBg,
                        color: student.houseColor,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {student.house}
                    </span>
                  </td>

                  {/* Date of birth */}
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{student.dob}</span>
                  </td>

                  {/* Parent / Guardian */}
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{student.parent}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{student.parentPhone}</div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 12px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: student.status === "Active" ? "#dcfce7" : "#fee2e2",
                        color: student.status === "Active" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {student.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 12px" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                        padding: 4,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Showing 1 to {filteredStudents.length} of{" "}
            <strong style={{ color: "#374151" }}>1,248</strong> students
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              <ChevronLeft size={14} />
            </button>

            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: currentPage === p ? "none" : "1px solid #e5e7eb",
                  background: currentPage === p ? "#7c3aed" : "white",
                  color: currentPage === p ? "white" : "#374151",
                  fontSize: 12.5,
                  fontWeight: currentPage === p ? 600 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p}
              </button>
            ))}

            <span style={{ padding: "0 4px", color: "#9ca3af", fontSize: 13 }}>…</span>

            <button
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: "white",
                color: "#374151",
                fontSize: 12.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              125
            </button>

            <button
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              <ChevronRight size={14} />
            </button>

            <div style={{ marginLeft: 8, position: "relative" }}>
              <select
                style={{
                  appearance: "none",
                  padding: "5px 28px 5px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#374151",
                  background: "white",
                  cursor: "pointer",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              >
                <option>10 / page</option>
                <option>25 / page</option>
                <option>50 / page</option>
              </select>
              <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
