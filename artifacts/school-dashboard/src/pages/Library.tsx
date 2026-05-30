import { useState } from "react";
import { Plus, Search, ChevronRight, X, BookOpen, User, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type BookStatus = "Available" | "Borrowed" | "Reserved" | "Lost";

type Book = {
  id: number; title: string; author: string; isbn: string; category: string;
  copies: number; available: number; status: BookStatus;
  coverColor: string; coverText: string; publishYear: string;
};

type BorrowRecord = {
  id: number; studentName: string; studentId: string; bookTitle: string;
  borrowDate: string; dueDate: string; returnDate?: string;
  status: "Active" | "Overdue" | "Returned";
  initials: string; avatarBg: string; avatarColor: string;
  daysLeft?: number;
};

const books: Book[] = [
  { id: 1,  title: "New Integrated Science for JHS",   author: "Asiedu-Addo et al.", isbn: "978-9988-617-0-0", category: "Science",       copies: 8,  available: 5,  status: "Available", coverColor: "#16a34a", coverText: "Sci", publishYear: "2021" },
  { id: 2,  title: "Brilliant English for JHS 3",      author: "Amu Djoleto",        isbn: "978-9988-617-1-0", category: "English",       copies: 12, available: 9,  status: "Available", coverColor: "#2563eb", coverText: "Eng", publishYear: "2020" },
  { id: 3,  title: "Mathematics for JHS 3",            author: "Laryea & Partners",  isbn: "978-9988-617-2-0", category: "Mathematics",   copies: 10, available: 3,  status: "Available", coverColor: "#7c3aed", coverText: "Mat", publishYear: "2022" },
  { id: 4,  title: "Social Studies for Upper Primary", author: "Kankam et al.",      isbn: "978-9988-617-3-0", category: "Social Studies",copies: 6,  available: 6,  status: "Available", coverColor: "#d97706", coverText: "Soc", publishYear: "2021" },
  { id: 5,  title: "Our Africa — Geography",           author: "Wiredu & Abban",     isbn: "978-9988-617-4-0", category: "Geography",     copies: 4,  available: 0,  status: "Borrowed",  coverColor: "#0891b2", coverText: "Geo", publishYear: "2019" },
  { id: 6,  title: "Basic French for JHS",             author: "Attuah Padi",        isbn: "978-9988-617-5-0", category: "French",        copies: 5,  available: 4,  status: "Available", coverColor: "#0369a1", coverText: "FR",  publishYear: "2020" },
  { id: 7,  title: "Concise History of Ghana",         author: "A.A. Aryee",         isbn: "978-9988-617-6-0", category: "History",       copies: 3,  available: 1,  status: "Available", coverColor: "#b45309", coverText: "His", publishYear: "2018" },
  { id: 8,  title: "ICT for Schools",                  author: "Quaye & Asante",     isbn: "978-9988-617-7-0", category: "ICT",           copies: 7,  available: 0,  status: "Borrowed",  coverColor: "#6d28d9", coverText: "ICT", publishYear: "2022" },
  { id: 9,  title: "The Beautyful Ones Are Not Yet Born", author: "Ayi Kwei Armah", isbn: "978-9988-617-8-0", category: "Literature",    copies: 2,  available: 2,  status: "Available", coverColor: "#dc2626", coverText: "Lit", publishYear: "1968" },
  { id: 10, title: "Ghana's Heritage — RME",           author: "Opoku-Agyeman",      isbn: "978-9988-617-9-0", category: "RME",           copies: 5,  available: 3,  status: "Available", coverColor: "#065f46", coverText: "RME", publishYear: "2020" },
];

const borrowRecords: BorrowRecord[] = [
  { id: 1, studentName: "Kofi Junior Asante",  studentId: "STU-2024-0012", bookTitle: "Mathematics for JHS 3",            borrowDate: "15 May 2024", dueDate: "29 May 2024", status: "Overdue", initials: "KJ", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a", daysLeft: -1 },
  { id: 2, studentName: "Ama Serwaa Ofori",    studentId: "STU-2024-0013", bookTitle: "Our Africa — Geography",           borrowDate: "20 May 2024", dueDate: "3 Jun 2024",  status: "Active",  initials: "AS", avatarBg: "#fce7f3", avatarColor: "#9d174d", daysLeft: 4 },
  { id: 3, studentName: "Daniel Lartey",       studentId: "STU-2024-0014", bookTitle: "ICT for Schools",                  borrowDate: "18 May 2024", dueDate: "1 Jun 2024",  status: "Active",  initials: "DL", avatarBg: "#dbeafe", avatarColor: "#1e3a8a", daysLeft: 2 },
  { id: 4, studentName: "Abena Yaa Darko",     studentId: "STU-2024-0019", bookTitle: "The Beautyful Ones Are Not Yet Born", borrowDate: "10 May 2024", dueDate: "24 May 2024", status: "Overdue", initials: "AD", avatarBg: "#fce7f3", avatarColor: "#9d174d", daysLeft: -6 },
  { id: 5, studentName: "Yaw Antwi Boakye",   studentId: "STU-2024-0016", bookTitle: "Brilliant English for JHS 3",      borrowDate: "22 May 2024", dueDate: "5 Jun 2024",  status: "Active",  initials: "YA", avatarBg: "#fef9c3", avatarColor: "#713f12", daysLeft: 6 },
  { id: 6, studentName: "Efua Korkor Lamptey",studentId: "STU-2024-0017", bookTitle: "New Integrated Science for JHS",   borrowDate: "8 May 2024",  dueDate: "22 May 2024", status: "Returned", returnDate: "21 May 2024", initials: "EK", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
];

const categories = ["All", "Science", "English", "Mathematics", "Social Studies", "Geography", "French", "History", "ICT", "Literature", "RME"];

const statusColor = (s: BookStatus) => {
  if (s === "Available") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Borrowed")  return { bg: "#fee2e2", color: "#dc2626" };
  if (s === "Reserved")  return { bg: "#fef3c7", color: "#d97706" };
  return                        { bg: "#f3f4f6", color: "#6b7280" };
};

const borrowStatusColor = (s: string) => {
  if (s === "Active")   return { bg: "#dbeafe", color: "#2563eb" };
  if (s === "Overdue")  return { bg: "#fee2e2", color: "#dc2626" };
  return                       { bg: "#dcfce7", color: "#16a34a" };
};

export default function Library() {
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [activeTab,    setActiveTab]    = useState("Catalog");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [catFilter,    setCatFilter]    = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [showPanel,    setShowPanel]    = useState(false);

  const filteredBooks = books.filter((b) => {
    const mSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat    = catFilter === "All" || b.category === catFilter;
    return mSearch && mCat;
  });

  const totalBooks  = books.reduce((s, b) => s + b.copies, 0);
  const available   = books.reduce((s, b) => s + b.available, 0);
  const borrowed    = totalBooks - available;
  const overdue     = borrowRecords.filter(r => r.status === "Overdue").length;

  const BookPanel = () => {
    const sc = statusColor(selectedBook.status);
    const avail = selectedBook.available;
    const pct = Math.round((avail / selectedBook.copies) * 100);
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Book Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast(`Book "${selectedBook.title}" edited`, "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Book cover */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 72, height: 96, borderRadius: 8, background: selectedBook.coverColor, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "3px 3px 10px rgba(0,0,0,0.2)", flexShrink: 0 }}>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 20, fontWeight: 800 }}>{selectedBook.coverText}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 4 }}>{selectedBook.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{selectedBook.author}</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{selectedBook.category} · {selectedBook.publishYear}</div>
              <span style={{ display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: sc.bg, color: sc.color }}>{selectedBook.status}</span>
            </div>
          </div>

          {/* Availability bar */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Availability</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: avail > 0 ? "#16a34a" : "#dc2626" }}>{avail} / {selectedBook.copies} available</span>
            </div>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: avail > 0 ? "#16a34a" : "#dc2626", borderRadius: 4 }} />
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>BOOK DETAILS</div>
            {[["ISBN", selectedBook.isbn], ["Category", selectedBook.category], ["Total Copies", String(selectedBook.copies)], ["Published", selectedBook.publishYear]].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Book "${selectedBook.title}" issued successfully`, "success"); if (isMobile) setShowPanel(false); }}
              disabled={avail === 0}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: avail > 0 ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb", color: avail > 0 ? "white" : "#9ca3af", fontSize: 12.5, fontWeight: 600, cursor: avail > 0 ? "pointer" : "not-allowed" }}>
              📤 Issue to Student
            </button>
            <button onClick={() => { showToast(`Return processed for "${selectedBook.title}"`, "success"); if (isMobile) setShowPanel(false); }}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📥 Process Return
            </button>
            <button onClick={() => { showToast(`Report generated for "${selectedBook.title}"`, "info"); if (isMobile) setShowPanel(false); }}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📄 View Borrow History
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
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Library</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard", "Operations", "Library"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Opening add book form...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Add Book"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Books",   value: String(totalBooks), icon: "📚", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Available",     value: String(available),  icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Borrowed",      value: String(borrowed),   icon: "📖", bg: "#dbeafe", color: "#2563eb" },
          { label: "Overdue",       value: String(overdue),    icon: "⚠️",  bg: "#fee2e2", color: "#dc2626" },
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

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: 10, padding: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 2, marginBottom: 14, overflowX: "auto" }}>
        {["Catalog", "Borrowed Books", "Overdue"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "8px 12px", fontSize: 12.5, fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "white" : "#6b7280", background: activeTab === t ? "#7c3aed" : "transparent", border: "none", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      {activeTab === "Catalog" && (
        <>
          {/* Search + category */}
          <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search title or author..."
                style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 5, overflowX: "auto", maxWidth: isMobile ? "100%" : "60%" }}>
              {(isMobile ? ["All", "Science", "English", "Maths"] : categories.slice(0, 7)).map((c) => (
                <button key={c} onClick={() => setCatFilter(c === "Maths" ? "Mathematics" : c)}
                  style={{ padding: "6px 10px", border: `1px solid ${catFilter === c || (c === "Maths" && catFilter === "Mathematics") ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 8, background: catFilter === c || (c === "Maths" && catFilter === "Mathematics") ? "#7c3aed" : "white", color: catFilter === c || (c === "Maths" && catFilter === "Mathematics") ? "white" : "#374151", fontSize: 11.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 330px)" }}>
            {/* Book grid / list */}
            {(!isMobile || !showPanel) && (
              <div style={{ flex: isMobile ? undefined : "0 0 auto", width: isMobile ? "100%" : 360, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {filteredBooks.map((book) => {
                    const sc = statusColor(book.status);
                    const isActive = selectedBook.id === book.id;
                    return (
                      <div key={book.id}
                        onClick={() => { setSelectedBook(book); if (isMobile) setShowPanel(true); }}
                        style={{ display: "flex", gap: 12, padding: "12px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : "white", transition: "background 0.1s" }}
                        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                        onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "white"; }}
                      >
                        <div style={{ width: 36, height: 48, borderRadius: 5, background: book.coverColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 5px rgba(0,0,0,0.15)" }}>
                          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: 800 }}>{book.coverText}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{book.author}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                            <span style={{ fontSize: 11, color: "#6b7280" }}>{book.category}</span>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 10.5, color: book.available > 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{book.available}/{book.copies} avail.</span>
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 10, background: sc.bg, color: sc.color }}>{book.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(!isMobile || showPanel) && <BookPanel />}
          </div>
        </>
      )}

      {(activeTab === "Borrowed Books" || activeTab === "Overdue") && (
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{activeTab === "Overdue" ? "Overdue Books" : "Currently Borrowed"}</span>
          </div>
          {borrowRecords
            .filter(r => activeTab === "Overdue" ? r.status === "Overdue" : r.status !== "Returned")
            .map((rec, i, arr) => {
              const bs = borrowStatusColor(rec.status);
              return (
                <div key={rec.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #f9fafb" : "none", alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: rec.avatarBg, color: rec.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{rec.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{rec.studentName}</div>
                    <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rec.bookTitle}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Borrowed: {rec.borrowDate} · Due: {rec.dueDate}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: bs.color, background: bs.bg, padding: "3px 9px", borderRadius: 20, marginBottom: 6 }}>
                      {rec.status === "Overdue" ? <AlertCircle size={10} /> : rec.status === "Active" ? <Clock size={10} /> : <CheckCircle size={10} />}
                      {rec.status}
                    </div>
                    {rec.status === "Overdue" && rec.daysLeft !== undefined && (
                      <div style={{ fontSize: 10.5, color: "#dc2626", fontWeight: 600 }}>{Math.abs(rec.daysLeft)} day{Math.abs(rec.daysLeft) !== 1 ? "s" : ""} overdue</div>
                    )}
                    {rec.status === "Active" && rec.daysLeft !== undefined && (
                      <div style={{ fontSize: 10.5, color: "#6b7280" }}>{rec.daysLeft} day{rec.daysLeft !== 1 ? "s" : ""} left</div>
                    )}
                    {rec.status === "Overdue" && (
                      <button onClick={() => showToast(`Overdue notice sent to ${rec.studentName}`, "info")} style={{ marginTop: 4, padding: "4px 8px", border: "none", borderRadius: 6, background: "#fee2e2", color: "#dc2626", fontSize: 10.5, fontWeight: 600, cursor: "pointer" }}>Send Notice</button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
            </div>
            <BookPanel />
          </div>
        </div>
      )}
    </div>
  );
}
