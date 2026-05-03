export const kpiCards = [
  {
    id: 1,
    title: "Total Students",
    value: "1,248",
    change: "+12 this month",
    changePositive: true,
    icon: "students",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: 2,
    title: "Attendance Today",
    value: "92.6%",
    change: "+3.4% vs yesterday",
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
    value: "GH₵ 128,650",
    change: "+18.4% vs last month",
    changePositive: true,
    icon: "revenue",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
  },
  {
    id: 5,
    title: "Top Class (Avg.)",
    value: "P6 – Topaz",
    change: "76.5%",
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
  days: ["Mon 9 May", "Tue 10 May", "Wed 11 May", "Thu 12 May", "Fri 13 May"],
  percentages: [94, 91, 92, 90, 93],
};

export const announcements = [
  {
    id: 1,
    title: "PTA Meeting",
    description: "There will be a PTA meeting this Saturday, 18th May at 10:00am.",
    time: "2 hours ago",
    icon: "pta",
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: 2,
    title: "Mid-Term Exams",
    description: "Mid-term examinations begin on 27th May, 2024.",
    time: "1 day ago",
    icon: "exam",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: 3,
    title: "Bus Routes Update",
    description: "Please check the new bus routes effective Monday, 20th May.",
    time: "2 days ago",
    icon: "bus",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
];

export const recentPayments = [
  {
    id: 1,
    name: "Nana Ama Owusu",
    class: "P4 - Ruby",
    amount: "GH₵ 2,400",
    status: "Paid",
    time: "Today, 08:35 AM",
    initials: "NA",
    avatarBg: "#fde68a",
    avatarColor: "#92400e",
  },
  {
    id: 2,
    name: "Kofi Asante",
    class: "P6 - Topaz",
    amount: "GH₵ 1,800",
    status: "Paid",
    time: "Today, 08:12 AM",
    initials: "KA",
    avatarBg: "#bbf7d0",
    avatarColor: "#14532d",
  },
  {
    id: 3,
    name: "Akosua Mensah",
    class: "P2 - Pearl",
    amount: "GH₵ 1,600",
    status: "Paid",
    time: "Today, 07:45 AM",
    initials: "AM",
    avatarBg: "#bfdbfe",
    avatarColor: "#1e3a8a",
  },
  {
    id: 4,
    name: "Yaw Addo",
    class: "P5 - Diamond",
    amount: "GH₵ 2,400",
    status: "Paid",
    time: "Yesterday, 06:30 PM",
    initials: "YA",
    avatarBg: "#e9d5ff",
    avatarColor: "#581c87",
  },
  {
    id: 5,
    name: "Abena Boateng",
    class: "P1 - Coral",
    amount: "GH₵ 1,600",
    status: "Pending",
    time: "Yesterday, 04:20 PM",
    initials: "AB",
    avatarBg: "#fecdd3",
    avatarColor: "#881337",
  },
];

export const outstandingFeesByClass = [
  { class: "P1 - Coral", amount: "GH₵ 6,500", color: "#f87171" },
  { class: "P2 - Pearl", amount: "GH₵ 7,850", color: "#fbbf24" },
  { class: "P3 - Emerald", amount: "GH₵ 8,900", color: "#34d399" },
  { class: "P4 - Ruby", amount: "GH₵ 9,600", color: "#60a5fa" },
  { class: "P5 - Diamond", amount: "GH₵ 8,000", color: "#a78bfa" },
  { class: "P6 - Topaz", amount: "GH₵ 7,000", color: "#fb923c" },
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
    time: "08:00 AM - 10:00 AM",
    subject: "Mathematics",
    class: "P6 - Topaz",
    classColor: "#7c3aed",
    classBg: "#ede9fe",
    teacher: "Mr. K. Appiah",
  },
  {
    id: 2,
    time: "10:15 AM - 12:15 PM",
    subject: "English Language",
    class: "P5 - Diamond",
    classColor: "#2563eb",
    classBg: "#dbeafe",
    teacher: "Ms. A. Mensah",
  },
];

export const eventsCalendar = [
  {
    id: 1,
    day: 18,
    month: "MAY",
    title: "PTA Meeting",
    time: "10:00 AM - 12:00 PM",
    color: "#7c3aed",
  },
  {
    id: 2,
    day: 27,
    month: "MAY",
    title: "Mid-Term Exams Begin",
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
