export const kpiCards = [
  {
    id: 1,
    title: "Total Students",
    value: "312",
    change: "+18 this term",
    changePositive: true,
    icon: "students",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: 2,
    title: "Attendance Today",
    value: "91.4%",
    change: "+2.1% vs yesterday",
    changePositive: true,
    icon: "attendance",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: 3,
    title: "Outstanding Fees",
    value: "GH₵ 47,850",
    change: "-8.7% vs last month",
    changePositive: false,
    icon: "fees",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
  {
    id: 4,
    title: "Revenue This Month",
    value: "GH₵ 148,000",
    change: "+12.3% vs last month",
    changePositive: true,
    icon: "revenue",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
  },
  {
    id: 5,
    title: "Top Class (Avg.)",
    value: "JHS 3",
    change: "78.4%",
    changePositive: true,
    icon: "trophy",
    iconBg: "#ffe4e6",
    iconColor: "#e11d48",
  },
];

export const feeCollectionData = {
  categories: ["1 May", "5 May", "10 May", "15 May", "20 May", "25 May", "31 May"],
  collected: [20000, 45000, 75000, 95000, 110000, 130000, 148000],
  target: [30000, 60000, 90000, 110000, 125000, 140000, 150000],
};

export const attendanceData = {
  days: ["Mon 18 May", "Tue 19 May", "Wed 20 May", "Thu 21 May", "Fri 22 May"],
  percentages: [94, 91, 92, 90, 93],
};

export const announcements = [
  {
    id: 1,
    title: "PTA Meeting",
    description: "There will be a PTA meeting this Saturday, 7th June at 10:00am in the main hall.",
    time: "2 hours ago",
    icon: "pta",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: 2,
    title: "End-of-Term Exams",
    description: "Term 2 end-of-term examinations begin on 16th June, 2026.",
    time: "1 day ago",
    icon: "exam",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: 3,
    title: "School Fees Reminder",
    description: "Kindly clear all outstanding Term 2 fees before 13th June 2026.",
    time: "2 days ago",
    icon: "bus",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
];

export const recentPayments = [
  {
    id: 1,
    name: "Akua Pomaa Acheampong",
    class: "JHS 2",
    amount: "GH₵ 1,800",
    status: "Paid",
    time: "Today, 08:35 AM",
    initials: "AA",
    avatarBg: "#fde68a",
    avatarColor: "#92400e",
  },
  {
    id: 2,
    name: "Amos Kofi Asante",
    class: "Basic 6",
    amount: "GH₵ 1,200",
    status: "Paid",
    time: "Today, 08:12 AM",
    initials: "AK",
    avatarBg: "#bbf7d0",
    avatarColor: "#14532d",
  },
  {
    id: 3,
    name: "Akosua Adwoa Mensah",
    class: "Basic 4",
    amount: "GH₵ 1,200",
    status: "Paid",
    time: "Today, 07:45 AM",
    initials: "AM",
    avatarBg: "#bfdbfe",
    avatarColor: "#1e3a8a",
  },
  {
    id: 4,
    name: "Yaw Adjei Mensah",
    class: "JHS 2",
    amount: "GH₵ 1,800",
    status: "Paid",
    time: "Yesterday, 06:30 PM",
    initials: "YA",
    avatarBg: "#e9d5ff",
    avatarColor: "#581c87",
  },
  {
    id: 5,
    name: "Efua Korkor Lamptey",
    class: "Basic 3",
    amount: "GH₵ 1,200",
    status: "Pending",
    time: "Yesterday, 04:20 PM",
    initials: "EK",
    avatarBg: "#fecdd3",
    avatarColor: "#881337",
  },
];

export const outstandingFeesByClass = [
  { class: "KG 1",     amount: "GH₵ 2,400", color: "#f87171" },
  { class: "KG 2",     amount: "GH₵ 2,800", color: "#fbbf24" },
  { class: "Basic 1",  amount: "GH₵ 3,200", color: "#34d399" },
  { class: "Basic 2",  amount: "GH₵ 4,100", color: "#60a5fa" },
  { class: "Basic 3",  amount: "GH₵ 5,500", color: "#a78bfa" },
  { class: "Basic 4",  amount: "GH₵ 6,200", color: "#fb923c" },
  { class: "Basic 5",  amount: "GH₵ 7,850", color: "#f472b6" },
  { class: "Basic 6",  amount: "GH₵ 8,400", color: "#2dd4bf" },
  { class: "JHS 1",    amount: "GH₵ 5,900", color: "#818cf8" },
  { class: "JHS 2",    amount: "GH₵ 6,100", color: "#4ade80" },
  { class: "JHS 3",    amount: "GH₵ 5,400", color: "#facc15" },
];

export const quickActions = [
  { id: 1, label: "Add Student", icon: "add-student", color: "#7c3aed", bg: "#ede9fe" },
  { id: 2, label: "Take Attendance", icon: "attendance", color: "#16a34a", bg: "#dcfce7" },
  { id: 3, label: "Create Invoice", icon: "invoice", color: "#2563eb", bg: "#dbeafe" },
  { id: 4, label: "Send Notice", icon: "notice", color: "#7c3aed", bg: "#ede9fe" },
  { id: 5, label: "Record Payment", icon: "payment", color: "#16a34a", bg: "#dcfce7" },
  { id: 6, label: "View Reports", icon: "reports", color: "#d97706", bg: "#fef3c7" },
];

export const transportStatus = {
  total: 18,
  onRoute: 16,
  onTime: 15,
  delayed: 1,
  notStarted: 2,
};

export const todaySchedule = [
  {
    id: 1,
    time: "08:00 AM - 09:40 AM",
    subject: "Mathematics",
    class: "JHS 3",
    classColor: "#7c3aed",
    classBg: "#ede9fe",
    teacher: "Mr. K. Appiah",
  },
  {
    id: 2,
    time: "10:00 AM - 11:40 AM",
    subject: "English Language",
    class: "JHS 2",
    classColor: "#2563eb",
    classBg: "#dbeafe",
    teacher: "Ms. A. Mensah",
  },
  {
    id: 3,
    time: "12:00 PM - 01:40 PM",
    subject: "Integrated Science",
    class: "Basic 6",
    classColor: "#16a34a",
    classBg: "#dcfce7",
    teacher: "Mr. Y. Boateng",
  },
];

export const eventsCalendar = [
  {
    id: 1,
    day: 7,
    month: "JUN",
    title: "PTA Meeting",
    time: "10:00 AM - 12:00 PM",
    color: "#7c3aed",
  },
  {
    id: 2,
    day: 13,
    month: "JUN",
    title: "Fees Deadline",
    time: "All Day",
    color: "#d97706",
  },
  {
    id: 3,
    day: 16,
    month: "JUN",
    title: "End-of-Term Exams",
    time: "All Day Event",
    color: "#e11d48",
  },
];

export const navItems = [
  {
    section: "STUDENTS",
    items: [
      { label: "All Students", icon: "users", hasChildren: false },
      { label: "Admissions", icon: "user-plus", hasChildren: false },
      { label: "Attendance", icon: "calendar-check", hasChildren: false },
      { label: "Health Records", icon: "heart-pulse", hasChildren: false },
      { label: "Discipline", icon: "shield", hasChildren: false },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      { label: "Subjects", icon: "book", hasChildren: false },
      { label: "Classes", icon: "school", hasChildren: true },
      { label: "Timetable", icon: "clock", hasChildren: false },
      { label: "Homework", icon: "file-text", hasChildren: false },
      { label: "Exams", icon: "pen-line", hasChildren: false },
      { label: "Results", icon: "chart-bar", hasChildren: false },
      { label: "Report Cards", icon: "file-badge", hasChildren: false },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { label: "Billing", icon: "receipt", hasChildren: true },
      { label: "Payment", icon: "credit-card", hasChildren: false },
      { label: "Expenses", icon: "trending-down", hasChildren: false },
      { label: "Payroll", icon: "banknote", hasChildren: false },
      { label: "Scholarships", icon: "award", hasChildren: false },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [
      { label: "SMS", icon: "message-square", hasChildren: true },
      { label: "WhatsApp", icon: "message-circle", hasChildren: false },
      { label: "Email", icon: "mail", hasChildren: false },
      { label: "Notices", icon: "bell", hasChildren: false },
      { label: "Events", icon: "calendar", hasChildren: false },
    ],
  },
];
