import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, School, CreditCard, DollarSign, MessageSquare, AtSign,
  Users, LifeBuoy, BarChart2, ScrollText, Settings, KeyRound, LogOut,
  ChevronRight, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp,
  Building2, RefreshCw, Send, Eye, Ban, Trash2, MoreHorizontal, Shield,
  Globe, Bell, Lock, Zap, Database, Activity,
} from "lucide-react";

// ─── accent ───────────────────────────────────────────────────────────────
const A = "#4f46e5";          // indigo-600
const SB_BG = "#0f172a";      // slate-900 sidebar
const SB_TEXT = "rgba(255,255,255,0.72)";
const SB_ACTIVE_BG = "rgba(79,70,229,0.25)";
const SB_ACTIVE = "#a5b4fc";  // indigo-300

// ─── types ────────────────────────────────────────────────────────────────
type Page =
  | "dashboard" | "schools" | "subscriptions" | "billing" | "sms"
  | "sender-ids" | "platform-users" | "support" | "reports"
  | "audit-logs" | "settings" | "demo-credentials";

// ─── demo data ────────────────────────────────────────────────────────────
const SCHOOLS = [
  { id: "s1", name: "Happy Kids Basic School", owner: "Kofi Mensah",    location: "Accra",      plan: "Growth",    status: "Active",    students: 312, joined: "Jan 2024" },
  { id: "s2", name: "Bright Star Academy",     owner: "Efua Asante",    location: "Kumasi",     plan: "Starter",   status: "Trial",     students:  88, joined: "Apr 2026" },
  { id: "s3", name: "Golden Gate School",      owner: "Joe Agyemang",   location: "Takoradi",   plan: "Enterprise",status: "Active",    students: 620, joined: "Sep 2023" },
  { id: "s4", name: "New Horizon Academy",     owner: "Linda Boateng",  location: "Tamale",     plan: "Starter",   status: "Suspended", students: 134, joined: "Mar 2025" },
  { id: "s5", name: "Sunshine Preparatory",    owner: "Kweku Darko",    location: "Cape Coast", plan: "Growth",    status: "Active",    students: 245, joined: "Aug 2024" },
  { id: "s6", name: "Faith Academy",           owner: "Patricia Ofori", location: "Ho",         plan: "Starter",   status: "Trial",     students:  62, joined: "May 2026" },
];

const PLANS = [
  { name: "Starter",    price: "GH₵ 250/mo",  students: "Up to 150",  features: ["Student Management", "Fee Collection", "Basic Reports", "1 Admin"],    schools: 18, color: "#16a34a" },
  { name: "Growth",     price: "GH₵ 600/mo",  students: "Up to 500",  features: ["All Starter", "SMS Alerts", "Parent Portal", "5 Admins", "Analytics"], schools: 21, color: A },
  { name: "Enterprise", price: "GH₵ 1,400/mo",students: "Unlimited",  features: ["All Growth", "White-label", "API Access", "Unlimited Admins", "SLA"], schools: 8,  color: "#d97706" },
];

const INVOICES = [
  { ref: "INV-2026-0241", school: "Happy Kids Basic School", plan: "Growth",     amount: "GH₵ 600", date: "01 May 2026", status: "Paid" },
  { ref: "INV-2026-0242", school: "Bright Star Academy",     plan: "Starter",    amount: "GH₵ 250", date: "01 May 2026", status: "Trial" },
  { ref: "INV-2026-0243", school: "Golden Gate School",      plan: "Enterprise", amount: "GH₵ 1,400",date: "01 May 2026",status: "Paid" },
  { ref: "INV-2026-0244", school: "New Horizon Academy",     plan: "Starter",    amount: "GH₵ 250", date: "01 Apr 2026", status: "Failed" },
  { ref: "INV-2026-0245", school: "Sunshine Preparatory",    plan: "Growth",     amount: "GH₵ 600", date: "01 May 2026", status: "Paid" },
  { ref: "INV-2026-0246", school: "Faith Academy",           plan: "Starter",    amount: "GH₵ 250", date: "15 May 2026", status: "Trial" },
];

const SMS_SCHOOLS = [
  { school: "Happy Kids Basic School", balance: 1_240, used: 3_410, provider: "Arkesel", status: "Active" },
  { school: "Golden Gate School",      balance: 5_800, used: 8_120, provider: "Arkesel", status: "Active" },
  { school: "Sunshine Preparatory",    balance:   310, used: 1_080, provider: "Arkesel", status: "Low" },
  { school: "New Horizon Academy",     balance:     0, used:   640, provider: "Arkesel", status: "Suspended" },
  { school: "Bright Star Academy",     balance:   500, used:    40, provider: "Arkesel", status: "Active" },
];

const SENDER_IDS = [
  { id: "sid1", senderId: "HappyKids",  school: "Happy Kids Basic School", requested: "28 May 2026", status: "Pending" },
  { id: "sid2", senderId: "GoldenGate", school: "Golden Gate School",      requested: "26 May 2026", status: "Pending" },
  { id: "sid3", senderId: "BrightStar", school: "Bright Star Academy",     requested: "25 May 2026", status: "Approved" },
  { id: "sid4", senderId: "Sunshine",   school: "Sunshine Preparatory",    requested: "20 May 2026", status: "Pending" },
  { id: "sid5", senderId: "FaithAcad",  school: "Faith Academy",           requested: "29 May 2026", status: "Pending" },
];

const PLATFORM_USERS = [
  { name: "Daniel Asiedu",   role: "Super Admin",    email: "superadmin@edulex.io",   status: "Active",   lastSeen: "Now"          },
  { name: "Nana Brobbey",    role: "Support Admin",  email: "support@edulex.io",      status: "Active",   lastSeen: "2 hours ago"  },
  { name: "Serwa Amponsah",  role: "Billing Admin",  email: "billing@edulex.io",      status: "Active",   lastSeen: "Yesterday"    },
  { name: "Kojo Ankomah",    role: "Tech Admin",     email: "tech@edulex.io",         status: "Inactive", lastSeen: "5 days ago"   },
];

const TICKETS = [
  { id: "TKT-001", school: "New Horizon Academy",     subject: "Unable to process fee payment",   priority: "High",   status: "Open",        created: "29 May 2026" },
  { id: "TKT-002", school: "Sunshine Preparatory",    subject: "SMS not delivering to MTN numbers",priority: "Medium", status: "In Progress", created: "28 May 2026" },
  { id: "TKT-003", school: "Happy Kids Basic School", subject: "Report card export shows blank",  priority: "Low",    status: "Resolved",    created: "26 May 2026" },
  { id: "TKT-004", school: "Bright Star Academy",     subject: "Cannot add new teacher account",  priority: "Medium", status: "Open",        created: "27 May 2026" },
  { id: "TKT-005", school: "Golden Gate School",      subject: "Upgrade to Enterprise — billing", priority: "High",   status: "Closed",      created: "20 May 2026" },
];

const AUDIT = [
  { action: "School created",          actor: "Daniel Asiedu", target: "Faith Academy",           time: "29 May 2026 09:14" },
  { action: "Sender ID approved",      actor: "Daniel Asiedu", target: "BrightStar (Sender ID)",  time: "28 May 2026 15:32" },
  { action: "School suspended",        actor: "Daniel Asiedu", target: "New Horizon Academy",     time: "25 May 2026 11:05" },
  { action: "SMS credits allocated",   actor: "Nana Brobbey",  target: "Happy Kids (500 credits)",time: "24 May 2026 13:20" },
  { action: "Subscription upgraded",   actor: "Daniel Asiedu", target: "Golden Gate → Enterprise",time: "20 May 2026 10:48" },
  { action: "Platform settings changed",actor:"Daniel Asiedu", target: "Maintenance mode OFF",    time: "18 May 2026 08:00" },
  { action: "User impersonated",        actor: "Nana Brobbey", target: "Kofi Mensah (Happy Kids)",time: "15 May 2026 14:11" },
  { action: "Billing action",           actor: "Serwa Amponsah",target: "Invoice INV-2026-0241 sent",time:"01 May 2026 09:30" },
];

const DEMO_CREDS = [
  { role: "Super Admin",        name: "Daniel Asiedu",   email: "superadmin@edulex.io",           perms: ["platform_dashboard_view","manage_schools","manage_subscriptions","manage_platform_billing","manage_sms_provider","manage_sender_ids","manage_platform_users","manage_support_tickets","view_platform_reports","view_platform_audit_logs","manage_platform_settings","impersonate_users","view_demo_credentials_dev_only"] },
  { role: "School Owner",       name: "Kofi Mensah",     email: "admin@happykids.edu.gh",         perms: ["manage_school_settings","manage_staff","view_all_reports","manage_fees","view_financials"] },
  { role: "Headteacher",        name: "Emmanuel Mensah", email: "headteacher@happykids.edu.gh",   perms: ["manage_students","manage_academics","manage_attendance","view_reports","approve_results"] },
  { role: "Teacher",            name: "Ama Owusu",       email: "ama.owusu@happykids.edu.gh",     perms: ["manage_class_attendance","enter_scores","view_class_students","send_class_announcements"] },
  { role: "Accountant",         name: "Yaw Boateng",     email: "accounts@happykids.edu.gh",      perms: ["manage_fees","record_payments","view_financial_reports","generate_invoices","reconcile_accounts"] },
  { role: "Admissions Officer", name: "Abena Nyarko",    email: "admissions@happykids.edu.gh",    perms: ["manage_admissions","enroll_students","view_student_profiles","manage_class_allocation"] },
  { role: "Parent",             name: "Grace Ofori",     email: "parent.demo@happykids.edu.gh",   perms: ["view_child_results","view_child_attendance","view_child_fees","receive_announcements"] },
  { role: "Student",            name: "Michael Ofori",   email: "student.demo@happykids.edu.gh",  perms: ["view_own_results","view_own_timetable","view_own_attendance","view_announcements"] },
];

// ─── helpers ──────────────────────────────────────────────────────────────
function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 20 }}>{text}</span>;
}
function statusBadge(s: string) {
  const m: Record<string, [string, string]> = {
    Active:    ["#16a34a", "#dcfce7"], Trial:     ["#d97706", "#fef3c7"],
    Suspended: ["#dc2626", "#fee2e2"], Paid:      ["#16a34a", "#dcfce7"],
    Failed:    ["#dc2626", "#fee2e2"], Pending:   ["#d97706", "#fef3c7"],
    Approved:  ["#16a34a", "#dcfce7"], Rejected:  ["#dc2626", "#fee2e2"],
    Open:      ["#2563eb", "#dbeafe"], "In Progress": ["#d97706","#fef3c7"],
    Resolved:  ["#16a34a", "#dcfce7"], Closed:    ["#6b7280", "#f3f4f6"],
    Low:       ["#d97706", "#fef3c7"], Inactive:  ["#6b7280", "#f3f4f6"],
  };
  const [c, b] = m[s] || ["#6b7280","#f3f4f6"];
  return <Badge text={s} color={c} bg={b} />;
}
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px", ...style }}>{children}</div>;
}
function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{title}</h2>
      {sub && <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#6b7280" }}>{sub}</p>}
    </div>
  );
}
function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"45vh", color:"#9ca3af" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12.5 }}>Coming soon in next release</div>
    </div>
  );
}

// ─── sidebar ─────────────────────────────────────────────────────────────
const NAV_ITEMS: { key: Page; label: string; icon: React.ReactNode; devOnly?: boolean }[] = [
  { key: "dashboard",       label: "Dashboard",         icon: <LayoutDashboard size={15} /> },
  { key: "schools",         label: "Schools",           icon: <School size={15} /> },
  { key: "subscriptions",   label: "Subscriptions",     icon: <CreditCard size={15} /> },
  { key: "billing",         label: "Edulex Billing",    icon: <DollarSign size={15} /> },
  { key: "sms",             label: "SMS Management",    icon: <MessageSquare size={15} /> },
  { key: "sender-ids",      label: "Sender ID Requests",icon: <AtSign size={15} /> },
  { key: "platform-users",  label: "Platform Users",    icon: <Users size={15} /> },
  { key: "support",         label: "Support / Tickets", icon: <LifeBuoy size={15} /> },
  { key: "reports",         label: "Platform Reports",  icon: <BarChart2 size={15} /> },
  { key: "audit-logs",      label: "Audit Logs",        icon: <ScrollText size={15} /> },
  { key: "settings",        label: "Platform Settings", icon: <Settings size={15} /> },
  { key: "demo-credentials",label: "Demo Credentials",  icon: <KeyRound size={15} />, devOnly: true },
];

function Sidebar({ active, onNav }: { active: Page; onNav: (p: Page) => void }) {
  const { logout, user } = useAuth();
  return (
    <div style={{
      width: 230, flexShrink: 0, background: SB_BG, display: "flex",
      flexDirection: "column", height: "100vh", position: "fixed", top: 0, left: 0,
      zIndex: 100, overflowY: "auto",
    }}>
      {/* brand */}
      <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: A, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "-0.2px" }}>Edulex</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Super Admin Console</div>
          </div>
        </div>
        {/* identity */}
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,0.06)", borderRadius: 9, padding: "8px 10px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: A, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>
            {user?.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Super Admin</div>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav style={{ flex: 1, padding: "10px 8px" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", border: "none", borderRadius: 8, cursor: "pointer",
                background: isActive ? SB_ACTIVE_BG : "transparent",
                color: isActive ? SB_ACTIVE : SB_TEXT,
                fontSize: 12.5, fontWeight: isActive ? 700 : 500,
                marginBottom: 2, transition: "all 0.12s", textAlign: "left",
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.devOnly && <span style={{ fontSize: 9, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.15)", padding: "1px 5px", borderRadius: 4 }}>DEV</span>}
              {isActive && <ChevronRight size={11} />}
            </button>
          );
        })}
      </nav>

      {/* sign out */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={() => logout()}
          style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 10px",border:"none",borderRadius:8,background:"transparent",color:"#f87171",fontWeight:600,fontSize:12.5,cursor:"pointer" }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── page: dashboard ─────────────────────────────────────────────────────
function DashboardPage() {
  const kpis = [
    { label: "Total Schools",      value: "47",         icon: <School size={18} />,     color: A,        bg: "#eef2ff" },
    { label: "Active Schools",     value: "38",         icon: <CheckCircle size={18} />,color: "#16a34a", bg: "#dcfce7" },
    { label: "Trial Schools",      value: "6",          icon: <Clock size={18} />,      color: "#d97706", bg: "#fef3c7" },
    { label: "Suspended",          value: "3",          icon: <Ban size={18} />,         color: "#dc2626", bg: "#fee2e2" },
    { label: "Monthly Revenue",    value: "GH₵ 23,400", icon: <DollarSign size={18} />, color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Annual Revenue",     value: "GH₵ 218,000",icon: <TrendingUp size={18} />, color: "#0891b2", bg: "#ecfeff" },
    { label: "SMS Credits Sold",   value: "145,200",    icon: <Send size={18} />,        color: "#16a34a", bg: "#dcfce7" },
    { label: "Pending Sender IDs", value: "4",          icon: <AtSign size={18} />,     color: "#d97706", bg: "#fef3c7" },
    { label: "Support Tickets",    value: "12",         icon: <LifeBuoy size={18} />,   color: "#dc2626", bg: "#fee2e2" },
    { label: "New Signups (30d)",  value: "5",          icon: <Building2 size={18} />,  color: A,        bg: "#eef2ff" },
    { label: "Paid Schools",       value: "32",         icon: <CreditCard size={18} />, color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Expired Subs",       value: "3",          icon: <AlertCircle size={18} />,color: "#dc2626", bg: "#fee2e2" },
  ];
  return (
    <div>
      <SectionTitle title="Platform Dashboard" sub="Edulex platform-wide analytics · May 30, 2026" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12, marginBottom: 24 }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ display:"flex",alignItems:"center",gap:14,padding:"16px 18px" }}>
            <div style={{ width:42,height:42,borderRadius:11,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",color:k.color,flexShrink:0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize:18,fontWeight:800,color:"#0f172a",lineHeight:1 }}>{k.value}</div>
              <div style={{ fontSize:11.5,color:"#6b7280",marginTop:3 }}>{k.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* recent signups */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", marginBottom: 14 }}>Recent School Signups</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {SCHOOLS.slice(0,4).map((s) => (
            <div key={s.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,background:"#f8fafc",border:"1px solid #f1f5f9" }}>
              <div style={{ width:34,height:34,borderRadius:9,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",color:A,fontWeight:800,fontSize:13 }}>{s.name[0]}</div>
              <div>
                <div style={{ fontSize:12.5,fontWeight:700,color:"#1e293b" }}>{s.name}</div>
                <div style={{ fontSize:11,color:"#94a3b8",marginTop:2 }}>{s.location} · {s.joined}</div>
              </div>
              <div style={{ marginLeft:"auto" }}>{statusBadge(s.status)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── page: schools ────────────────────────────────────────────────────────
function SchoolsPage() {
  const [search, setSearch] = useState("");
  const filtered = SCHOOLS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <SectionTitle title="Schools" sub={`${SCHOOLS.length} schools registered on Edulex`} />
        <button style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 16px",background:A,color:"white",border:"none",borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer" }}>
          <Building2 size={13} /> Create School
        </button>
      </div>
      <Card style={{ padding: 0 }}>
        <div style={{ padding:"12px 16px",borderBottom:"1px solid #f1f5f9" }}>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search schools..." style={{ width:"100%",padding:"7px 10px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:12.5,outline:"none",boxSizing:"border-box" as const }} />
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["School","Owner","Location","Plan","Students","Status","Actions"].map((h)=>(
                  <th key={h} style={{ padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s,i)=>(
                <tr key={s.id} style={{ borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa" }}>
                  <td style={{ padding:"11px 14px",fontSize:12.5,fontWeight:700,color:"#0f172a" }}>{s.name}</td>
                  <td style={{ padding:"11px 14px",fontSize:12.5,color:"#374151" }}>{s.owner}</td>
                  <td style={{ padding:"11px 14px",fontSize:12.5,color:"#374151" }}>{s.location}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ fontSize:11,fontWeight:700,color:PLANS.find(p=>p.name===s.plan)?.color||A,background:"#eef2ff",padding:"2px 7px",borderRadius:20 }}>{s.plan}</span>
                  </td>
                  <td style={{ padding:"11px 14px",fontSize:12.5,color:"#374151" }}>{s.students.toLocaleString()}</td>
                  <td style={{ padding:"11px 14px" }}>{statusBadge(s.status)}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex",gap:6 }}>
                      <button style={{ padding:"4px 8px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11,cursor:"pointer",background:"white",color:"#374151",fontWeight:600 }}>View</button>
                      {s.status==="Active"
                        ? <button style={{ padding:"4px 8px",border:"1px solid #fee2e2",borderRadius:6,fontSize:11,cursor:"pointer",background:"#fef2f2",color:"#dc2626",fontWeight:600 }}>Suspend</button>
                        : <button style={{ padding:"4px 8px",border:"1px solid #dcfce7",borderRadius:6,fontSize:11,cursor:"pointer",background:"#f0fdf4",color:"#16a34a",fontWeight:600 }}>Activate</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── page: subscriptions ──────────────────────────────────────────────────
function SubscriptionsPage() {
  return (
    <div>
      <SectionTitle title="Subscriptions" sub="Manage Edulex subscription plans and school assignments" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,marginBottom:24 }}>
        {PLANS.map((p)=>(
          <Card key={p.name}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
              <span style={{ fontSize:15,fontWeight:800,color:p.color }}>{p.name}</span>
              <span style={{ fontSize:11,fontWeight:700,color:p.color,background:p.color+"20",padding:"2px 8px",borderRadius:20 }}>{p.schools} schools</span>
            </div>
            <div style={{ fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:4 }}>{p.price}</div>
            <div style={{ fontSize:11.5,color:"#6b7280",marginBottom:12 }}>{p.students} students</div>
            {p.features.map((f)=>(
              <div key={f} style={{ display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#374151",marginBottom:5 }}>
                <CheckCircle size={12} color="#16a34a" />{f}
              </div>
            ))}
            <div style={{ display:"flex",gap:8,marginTop:14 }}>
              <button style={{ flex:1,padding:"6px 10px",background:p.color,color:"white",border:"none",borderRadius:7,fontSize:11.5,fontWeight:700,cursor:"pointer" }}>Edit Plan</button>
              <button style={{ padding:"6px 10px",background:"#f8fafc",color:"#374151",border:"1px solid #e5e7eb",borderRadius:7,fontSize:11.5,fontWeight:700,cursor:"pointer" }}>Assign</button>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ fontWeight:700,fontSize:13.5,color:"#0f172a",marginBottom:14 }}>Subscription History</div>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["School","Plan","Amount","Date","Status"].map((h)=>(
                <th key={h} style={{ padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv,i)=>(
              <tr key={inv.ref} style={{ borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa" }}>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:600,color:"#1e293b" }}>{inv.school}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,color:"#374151" }}>{inv.plan}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:700,color:"#0f172a" }}>{inv.amount}</td>
                <td style={{ padding:"10px 14px",fontSize:12,color:"#6b7280" }}>{inv.date}</td>
                <td style={{ padding:"10px 14px" }}>{statusBadge(inv.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── page: billing ────────────────────────────────────────────────────────
function BillingPage() {
  const stats = [
    { label:"Monthly Revenue", value:"GH₵ 23,400",  color:"#7c3aed",bg:"#f5f3ff", icon:<TrendingUp size={18}/> },
    { label:"Annual Revenue",  value:"GH₵ 218,000", color:"#16a34a",bg:"#dcfce7", icon:<DollarSign size={18}/> },
    { label:"Paid Invoices",   value:"32",           color:A,         bg:"#eef2ff", icon:<CheckCircle size={18}/> },
    { label:"Failed Payments", value:"3",            color:"#dc2626", bg:"#fee2e2", icon:<XCircle size={18}/> },
  ];
  return (
    <div>
      <SectionTitle title="Edulex Billing" sub="Platform revenue, invoices and payment tracking" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:22 }}>
        {stats.map((s)=>(
          <Card key={s.label} style={{ display:"flex",alignItems:"center",gap:14,padding:"16px 18px" }}>
            <div style={{ width:42,height:42,borderRadius:11,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",color:s.color,flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:18,fontWeight:800,color:"#0f172a" }}>{s.value}</div>
              <div style={{ fontSize:11.5,color:"#6b7280",marginTop:2 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <div style={{ fontWeight:700,fontSize:13.5,color:"#0f172a" }}>School Subscription Invoices</div>
          <div style={{ display:"flex",gap:8 }}>
            <button style={{ padding:"6px 12px",background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",color:"#374151" }}>Export</button>
            <button style={{ padding:"6px 12px",background:A,border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",color:"white" }}>Generate Invoice</button>
          </div>
        </div>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Ref","School","Plan","Amount","Date","Status","Actions"].map((h)=>(
                <th key={h} style={{ padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv,i)=>(
              <tr key={inv.ref} style={{ borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa" }}>
                <td style={{ padding:"10px 14px",fontSize:12,color:"#6b7280",fontFamily:"monospace" }}>{inv.ref}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:600,color:"#1e293b" }}>{inv.school}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,color:"#374151" }}>{inv.plan}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:700,color:"#0f172a" }}>{inv.amount}</td>
                <td style={{ padding:"10px 14px",fontSize:12,color:"#6b7280" }}>{inv.date}</td>
                <td style={{ padding:"10px 14px" }}>{statusBadge(inv.status)}</td>
                <td style={{ padding:"10px 14px" }}>
                  <div style={{ display:"flex",gap:6 }}>
                    <button style={{ padding:"3px 7px",border:"1px solid #e5e7eb",borderRadius:5,fontSize:11,cursor:"pointer",background:"white",color:"#374151",fontWeight:600 }}>Download</button>
                    <button style={{ padding:"3px 7px",border:"1px solid #e5e7eb",borderRadius:5,fontSize:11,cursor:"pointer",background:"white",color:"#374151",fontWeight:600 }}>Print</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── page: sms ────────────────────────────────────────────────────────────
function SMSPage() {
  return (
    <div>
      <SectionTitle title="SMS Management" sub="Global SMS provider config and credit allocation" />
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20 }}>
        <Card>
          <div style={{ fontWeight:700,fontSize:13.5,color:"#0f172a",marginBottom:14 }}>SMS Provider Configuration</div>
          {[
            { label:"Provider",      value:"Arkesel",             edit:true  },
            { label:"API Key",       value:"••••••••••••••••••",  edit:true  },
            { label:"Sender Name",   value:"Edulex",              edit:true  },
            { label:"Unit Price",    value:"GH₵ 0.04 / SMS",     edit:true  },
            { label:"Status",        value:"Active",              edit:false },
          ].map((row)=>(
            <div key={row.label} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9" }}>
              <span style={{ fontSize:12.5,color:"#6b7280" }}>{row.label}</span>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:12.5,fontWeight:600,color:"#0f172a" }}>{row.value}</span>
                {row.edit && <button style={{ padding:"2px 7px",border:"1px solid #e5e7eb",borderRadius:5,fontSize:11,cursor:"pointer",background:"white",color:A,fontWeight:600 }}>Edit</button>}
              </div>
            </div>
          ))}
          <button style={{ marginTop:14,width:"100%",padding:"9px 16px",background:A,color:"white",border:"none",borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer" }}>Save Configuration</button>
        </Card>
        <Card>
          <div style={{ fontWeight:700,fontSize:13.5,color:"#0f172a",marginBottom:14 }}>SMS Bundles</div>
          {[
            { units:"500",    price:"GH₵ 20",   label:"Starter Bundle"  },
            { units:"2,000",  price:"GH₵ 75",   label:"Growth Bundle"   },
            { units:"10,000", price:"GH₵ 350",  label:"Pro Bundle"      },
            { units:"50,000", price:"GH₵ 1,600",label:"Enterprise Bundle"},
          ].map((b)=>(
            <div key={b.units} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:8,border:"1px solid #f1f5f9",marginBottom:8 }}>
              <div>
                <div style={{ fontSize:12.5,fontWeight:700,color:"#0f172a" }}>{b.label}</div>
                <div style={{ fontSize:11,color:"#6b7280",marginTop:2 }}>{b.units} SMS credits</div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:13,fontWeight:800,color:"#7c3aed" }}>{b.price}</span>
                <button style={{ padding:"3px 8px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11,cursor:"pointer",background:"white",color:"#374151",fontWeight:600 }}>Edit</button>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <div style={{ fontWeight:700,fontSize:13.5,color:"#0f172a",marginBottom:14 }}>SMS Usage by School</div>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["School","Balance","Used","Provider","Status","Actions"].map((h)=>(
                <th key={h} style={{ padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SMS_SCHOOLS.map((row,i)=>(
              <tr key={row.school} style={{ borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa" }}>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:600,color:"#1e293b" }}>{row.school}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:700,color:row.balance===0?"#dc2626":row.balance<500?"#d97706":"#0f172a" }}>{row.balance.toLocaleString()}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,color:"#374151" }}>{row.used.toLocaleString()}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,color:"#374151" }}>{row.provider}</td>
                <td style={{ padding:"10px 14px" }}>{statusBadge(row.status)}</td>
                <td style={{ padding:"10px 14px" }}>
                  <button style={{ padding:"4px 10px",background:A,color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer" }}>Allocate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── page: sender ids ─────────────────────────────────────────────────────
function SenderIdsPage() {
  const [ids, setIds] = useState(SENDER_IDS);
  const approve = (id: string) => setIds((prev) => prev.map((s) => s.id===id ? {...s,status:"Approved"} : s));
  const reject  = (id: string) => setIds((prev) => prev.map((s) => s.id===id ? {...s,status:"Rejected"} : s));
  return (
    <div>
      <SectionTitle title="Sender ID Requests" sub="Review and approve school SMS sender IDs" />
      <Card style={{ marginBottom:16,padding:"12px 16px",background:"#fefce8",border:"1px solid #fef08a" }}>
        <div style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
          <AlertCircle size={15} color="#ca8a04" style={{ marginTop:1,flexShrink:0 }} />
          <div style={{ fontSize:12.5,color:"#713f12" }}>
            <strong>Sender ID Rules:</strong> Max 11 characters · Letters (upper/lower) and numbers only · No spaces, special characters, or emojis.
            <br/>Examples allowed: <code style={{ fontFamily:"monospace" }}>Stanbic</code> · <code style={{ fontFamily:"monospace" }}>VenusBaby</code> · <code style={{ fontFamily:"monospace" }}>StMarys</code>
          </div>
        </div>
      </Card>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {ids.map((sid)=>(
          <Card key={sid.id} style={{ display:"flex",alignItems:"center",gap:16,padding:"14px 18px" }}>
            <div style={{ width:42,height:42,borderRadius:10,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:A,letterSpacing:"-0.5px" }}><AtSign size={18}/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:800,color:"#0f172a",fontFamily:"monospace" }}>{sid.senderId}</div>
              <div style={{ fontSize:12,color:"#6b7280",marginTop:3 }}>{sid.school} · Requested {sid.requested}</div>
            </div>
            {statusBadge(sid.status)}
            {sid.status==="Pending" && (
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>approve(sid.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#16a34a",color:"white",border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer" }}>
                  <CheckCircle size={13} /> Approve
                </button>
                <button onClick={()=>reject(sid.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer" }}>
                  <XCircle size={13} /> Reject
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── page: platform users ─────────────────────────────────────────────────
function PlatformUsersPage() {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <SectionTitle title="Platform Users" sub="Manage internal Edulex team members" />
        <button style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 16px",background:A,color:"white",border:"none",borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer" }}>
          <Users size={13} /> Add User
        </button>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {PLATFORM_USERS.map((u)=>(
          <Card key={u.email} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 18px" }}>
            <div style={{ width:40,height:40,borderRadius:10,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:A }}>
              {u.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:700,color:"#0f172a" }}>{u.name}</div>
              <div style={{ fontSize:11.5,color:"#6b7280",marginTop:2 }}>{u.email}</div>
            </div>
            <span style={{ fontSize:11.5,fontWeight:700,color:A,background:"#eef2ff",padding:"2px 9px",borderRadius:20 }}>{u.role}</span>
            {statusBadge(u.status)}
            <span style={{ fontSize:11,color:"#9ca3af" }}>{u.lastSeen}</span>
            <div style={{ display:"flex",gap:6 }}>
              <button style={{ padding:"4px 10px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11,cursor:"pointer",background:"white",color:"#374151",fontWeight:600 }}>Edit</button>
              {u.role!=="Super Admin" && <button style={{ padding:"4px 10px",border:"1px solid #fee2e2",borderRadius:6,fontSize:11,cursor:"pointer",background:"#fef2f2",color:"#dc2626",fontWeight:600 }}>Suspend</button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── page: support ────────────────────────────────────────────────────────
function SupportPage() {
  const priorityColor = (p: string) => p==="High" ? "#dc2626" : p==="Medium" ? "#d97706" : "#16a34a";
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <SectionTitle title="Support / Tickets" sub="View and manage platform support tickets" />
        <div style={{ display:"flex",gap:8 }}>
          {(["Open","In Progress","Resolved"] as const).map((s)=>(
            <span key={s} style={{ fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:20,
              color: s==="Open"?"#2563eb":s==="In Progress"?"#d97706":"#16a34a",
              background: s==="Open"?"#dbeafe":s==="In Progress"?"#fef3c7":"#dcfce7" }}>
              {TICKETS.filter(t=>t.status===s).length} {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {TICKETS.map((t)=>(
          <Card key={t.id} style={{ padding:"14px 18px" }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
              <div style={{ width:38,height:38,borderRadius:9,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",color:A,flexShrink:0 }}>
                <LifeBuoy size={17}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
                  <span style={{ fontSize:12,fontFamily:"monospace",color:"#6b7280" }}>{t.id}</span>
                  <span style={{ fontSize:11,fontWeight:700,color:priorityColor(t.priority),background:priorityColor(t.priority)+"15",padding:"1px 7px",borderRadius:20 }}>{t.priority}</span>
                  {statusBadge(t.status)}
                </div>
                <div style={{ fontSize:13,fontWeight:700,color:"#0f172a",marginBottom:4 }}>{t.subject}</div>
                <div style={{ fontSize:12,color:"#6b7280" }}>{t.school} · Created {t.created}</div>
              </div>
              <div style={{ display:"flex",gap:6 }}>
                <button style={{ padding:"5px 11px",background:A,color:"white",border:"none",borderRadius:7,fontSize:11.5,fontWeight:700,cursor:"pointer" }}>View</button>
                <button style={{ padding:"5px 11px",background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:7,fontSize:11.5,fontWeight:700,cursor:"pointer",color:"#374151" }}>Reply</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── page: reports ────────────────────────────────────────────────────────
function ReportsPage() {
  const reports = [
    { name:"Schools Report",        desc:"All schools, status, plans, and usage",             icon:<School size={20}/>,       color:"#0891b2",bg:"#ecfeff" },
    { name:"Subscription Report",   desc:"Active, trial, expired plans and renewal rates",    icon:<CreditCard size={20}/>,   color:A,         bg:"#eef2ff" },
    { name:"Revenue Report",        desc:"Monthly and annual Edulex revenue breakdown",        icon:<DollarSign size={20}/>,   color:"#16a34a", bg:"#dcfce7" },
    { name:"SMS Usage Report",      desc:"Credits sold, used, and remaining per school",      icon:<MessageSquare size={20}/>,color:"#7c3aed", bg:"#f5f3ff" },
    { name:"Sender ID Report",      desc:"All sender IDs, approval status, school mapping",   icon:<AtSign size={20}/>,       color:"#d97706", bg:"#fef3c7" },
    { name:"Support Ticket Report", desc:"Ticket volumes, resolution times, status breakdown",icon:<LifeBuoy size={20}/>,     color:"#dc2626", bg:"#fee2e2" },
    { name:"User Activity Report",  desc:"Platform user logins, actions, and audit trail",    icon:<Activity size={20}/>,     color:"#0f172a", bg:"#f8fafc" },
  ];
  return (
    <div>
      <SectionTitle title="Platform Reports" sub="Generate and download platform-level reports" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12 }}>
        {reports.map((r)=>(
          <Card key={r.name} style={{ display:"flex",alignItems:"center",gap:16,padding:"18px 20px" }}>
            <div style={{ width:48,height:48,borderRadius:12,background:r.bg,display:"flex",alignItems:"center",justifyContent:"center",color:r.color,flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:13.5,fontWeight:700,color:"#0f172a",marginBottom:3 }}>{r.name}</div>
              <div style={{ fontSize:11.5,color:"#6b7280",lineHeight:1.4 }}>{r.desc}</div>
            </div>
            <button style={{ padding:"6px 12px",background:A,color:"white",border:"none",borderRadius:7,fontSize:11.5,fontWeight:700,cursor:"pointer",flexShrink:0 }}>Generate</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── page: audit logs ─────────────────────────────────────────────────────
function AuditLogsPage() {
  return (
    <div>
      <SectionTitle title="Audit Logs" sub="Immutable record of all platform-level actions" />
      <Card style={{ marginBottom:14,padding:"12px 16px",background:"#f0fdf4",border:"1px solid #bbf7d0" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:12.5,color:"#14532d" }}>
          <Shield size={14} color="#16a34a" />
          Audit logs are <strong>immutable</strong> — they cannot be edited or deleted.
        </div>
      </Card>
      <Card style={{ padding:0 }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Action","Actor","Target","Timestamp"].map((h)=>(
                <th key={h} style={{ padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUDIT.map((row,i)=>(
              <tr key={i} style={{ borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa" }}>
                <td style={{ padding:"10px 14px",fontSize:12.5,fontWeight:600,color:"#0f172a" }}>{row.action}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,color:"#374151" }}>{row.actor}</td>
                <td style={{ padding:"10px 14px",fontSize:12.5,color:"#6b7280" }}>{row.target}</td>
                <td style={{ padding:"10px 14px",fontSize:12,color:"#9ca3af",fontFamily:"monospace" }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── page: settings ───────────────────────────────────────────────────────
function SettingsPage() {
  const sections = [
    { title:"Edulex Branding",       icon:<Globe size={16}/>,    items:["Platform name","Logo URL","Favicon","Support email","Terms URL"] },
    { title:"Payment Settings",      icon:<CreditCard size={16}/>,items:["Paystack public key","Paystack secret key","Payment currency","VAT rate"] },
    { title:"Email Provider",        icon:<Send size={16}/>,     items:["SMTP host","SMTP port","SMTP user","From name","From email"] },
    { title:"Security Settings",     icon:<Lock size={16}/>,     items:["Session timeout","Max login attempts","2FA enforcement","IP whitelist"] },
    { title:"System Notifications",  icon:<Bell size={16}/>,     items:["New school signup","Failed payment","Low SMS balance","Ticket opened"] },
    { title:"Maintenance Mode",      icon:<Zap size={16}/>,      items:["Enable maintenance mode","Maintenance message","Allowed IPs during maintenance"] },
  ];
  return (
    <div>
      <SectionTitle title="Platform Settings" sub="Configure Edulex-wide settings and integrations" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14 }}>
        {sections.map((sec)=>(
          <Card key={sec.title}>
            <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:14 }}>
              <div style={{ width:32,height:32,borderRadius:8,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",color:A }}>{sec.icon}</div>
              <div style={{ fontSize:13.5,fontWeight:700,color:"#0f172a" }}>{sec.title}</div>
            </div>
            {sec.items.map((item)=>(
              <div key={item} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f8fafc" }}>
                <span style={{ fontSize:12.5,color:"#374151" }}>{item}</span>
                <button style={{ padding:"3px 9px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11,cursor:"pointer",background:"white",color:A,fontWeight:600 }}>Edit</button>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── page: demo credentials ───────────────────────────────────────────────
function DemoCredentialsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(()=>{ setCopied(key); setTimeout(()=>setCopied(null),2000); });
  };
  return (
    <div>
      <SectionTitle title="Demo Credentials" sub="DEV MODE ONLY — All passwords: password123" />
      <Card style={{ marginBottom:14,padding:"10px 14px",background:"#fef3c7",border:"1px solid #fcd34d" }}>
        <div style={{ fontSize:12.5,color:"#78350f",fontWeight:600 }}>⚠️ This page is hidden in production builds. All accounts share password: <code>password123</code></div>
      </Card>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {DEMO_CREDS.map((cred)=>(
          <Card key={cred.email} style={{ padding:"14px 18px" }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
              <div style={{ width:38,height:38,borderRadius:9,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:A,flexShrink:0 }}>
                {cred.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
                  <span style={{ fontSize:13.5,fontWeight:800,color:"#0f172a" }}>{cred.name}</span>
                  <span style={{ fontSize:11,fontWeight:700,color:A,background:"#eef2ff",padding:"2px 8px",borderRadius:20 }}>{cred.role}</span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                  <code style={{ fontSize:12,color:"#374151",background:"#f8fafc",padding:"3px 8px",borderRadius:5,fontFamily:"monospace" }}>{cred.email}</code>
                  <button onClick={()=>copy(cred.email,`e-${cred.email}`)} style={{ padding:"3px 8px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11,cursor:"pointer",background: copied===`e-${cred.email}`?"#dcfce7":"white",color:copied===`e-${cred.email}`?"#16a34a":"#374151",fontWeight:600 }}>
                    {copied===`e-${cred.email}`?"Copied!":"Copy"}
                  </button>
                  <code style={{ fontSize:12,color:"#374151",background:"#f8fafc",padding:"3px 8px",borderRadius:5,fontFamily:"monospace" }}>password123</code>
                  <button onClick={()=>copy("password123",`p-${cred.email}`)} style={{ padding:"3px 8px",border:"1px solid #e5e7eb",borderRadius:6,fontSize:11,cursor:"pointer",background:copied===`p-${cred.email}`?"#dcfce7":"white",color:copied===`p-${cred.email}`?"#16a34a":"#374151",fontWeight:600 }}>
                    {copied===`p-${cred.email}`?"Copied!":"Copy"}
                  </button>
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                  {cred.perms.map((p)=>(
                    <span key={p} style={{ fontSize:10,fontWeight:600,color:"#6b7280",background:"#f3f4f6",padding:"2px 7px",borderRadius:4,fontFamily:"monospace" }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────
export default function SuperAdminPortal() {
  const [page, setPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":       return <DashboardPage />;
      case "schools":         return <SchoolsPage />;
      case "subscriptions":   return <SubscriptionsPage />;
      case "billing":         return <BillingPage />;
      case "sms":             return <SMSPage />;
      case "sender-ids":      return <SenderIdsPage />;
      case "platform-users":  return <PlatformUsersPage />;
      case "support":         return <SupportPage />;
      case "reports":         return <ReportsPage />;
      case "audit-logs":      return <AuditLogsPage />;
      case "settings":        return <SettingsPage />;
      case "demo-credentials":return <DemoCredentialsPage />;
      default:                return <ComingSoon label={String(page)} />;
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        input, select, textarea, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
      `}</style>
      <div style={{ display:"flex", minHeight:"100vh", background:"#f8fafc", fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <Sidebar active={page} onNav={setPage} />
        <main style={{ marginLeft:230, flex:1, padding:"24px 24px 40px", overflowY:"auto", minWidth:0 }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}
