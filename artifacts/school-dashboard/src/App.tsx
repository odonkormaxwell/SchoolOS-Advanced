import { useState, useCallback } from "react";
import { AppContext, ToastType } from "./context/AppContext";
import { useWindowSize } from "./hooks/useWindowSize";
import Toast from "./components/Toast";
import Sidebar, { UserRole } from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Topbar from "./components/Topbar";
import DashboardHeader from "./components/DashboardHeader";
import KpiCards from "./components/KpiCards";
import FeeCollectionChart from "./components/FeeCollectionChart";
import AttendanceChart from "./components/AttendanceChart";
import Announcements from "./components/Announcements";
import RecentPayments from "./components/RecentPayments";
import OutstandingFeesChart from "./components/OutstandingFeesChart";
import QuickActions from "./components/QuickActions";
import TransportStatus from "./components/TransportStatus";
import TodaySchedule from "./components/TodaySchedule";
import EventsCalendar from "./components/EventsCalendar";

// Pages — V1 sidebar
import AllStudents from "./pages/AllStudents";
import Admissions from "./pages/Admissions";
import Attendance from "./pages/Attendance";
import Subjects from "./pages/Subjects";
import Classes from "./pages/Classes";
import Timetable from "./pages/Timetable";
import Assessments from "./pages/Assessments";
import FeeStructure from "./pages/FeeStructure";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Balances from "./pages/Balances";
import AnnouncementsPage from "./pages/Announcements";
import SMS from "./pages/SMS";
import WhatsApp from "./pages/WhatsApp";
import Email from "./pages/Email";
import Staff from "./pages/Staff";
import RolesPermissions from "./pages/RolesPermissions";
import AllReports from "./pages/AllReports";

// Hidden pages (still accessible via direct navigation / redirects)
import Gradebook from "./pages/Gradebook";
import Billing from "./pages/Billing";
import CommunicationHub from "./pages/CommunicationHub";
import Transport from "./pages/Transport";
import ReportCards from "./pages/ReportCards";
import HealthRecords from "./pages/HealthRecords";
import Exams from "./pages/Exams";
import Discipline from "./pages/Discipline";
import Library from "./pages/Library";
import Homework from "./pages/Homework";
import Events from "./pages/Events";
import Notices from "./pages/Notices";
import Expenses from "./pages/Expenses";
import Results from "./pages/Results";
import Inventory from "./pages/Inventory";
import Feeding from "./pages/Feeding";
import Payroll from "./pages/Payroll";
import Scholarships from "./pages/Scholarships";
import FinancialReports from "./pages/FinancialReports";

import { kpiCards } from "./data/staticData";

interface ToastState { id: number; message: string; type: ToastType; }

function DashboardPage() {
  const { isMobile, isTablet } = useWindowSize();
  const cols3 = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 320px";
  const cols3eq = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <>
      <DashboardHeader />
      <KpiCards cards={kpiCards} />
      <div style={{ display: "grid", gridTemplateColumns: cols3, gap: 14, marginBottom: 14, alignItems: "start" }}>
        <FeeCollectionChart />
        <AttendanceChart />
        {!isMobile && <Announcements />}
      </div>
      {isMobile && <div style={{ marginBottom: 14 }}><Announcements /></div>}
      <div style={{ display: "grid", gridTemplateColumns: cols3, gap: 14, marginBottom: 14, alignItems: "start" }}>
        <RecentPayments />
        <OutstandingFeesChart />
        {!isMobile && <QuickActions />}
      </div>
      {isMobile && <div style={{ marginBottom: 14 }}><QuickActions /></div>}
      <div style={{ display: "grid", gridTemplateColumns: cols3eq, gap: 14, alignItems: "start" }}>
        <TransportStatus />
        {!isMobile && <TodaySchedule />}
        {!isMobile && <EventsCalendar />}
      </div>
      {isMobile && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginTop: 14 }}>
          <TodaySchedule />
          <EventsCalendar />
        </div>
      )}
    </>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "55vh", color: "#9ca3af" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🚧</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#374151", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13 }}>This section is coming soon.</div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [userRole] = useState<UserRole>("administrator");
  const { isMobile, isTablet } = useWindowSize();

  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 220;

  const onNavigate = useCallback((page: string) => {
    // Redirect old routes to merged modules
    const redirects: Record<string, string> = {
      "homework":          "assessments",
      "exams":             "assessments",
      "results":           "assessments",
      "gradebook":         "assessments",
      "report-cards":      "assessments",
      "billing":           "fee-structure",
      "financial-reports": "reports",
      "expenses":          "reports",
      "scholarships":      "fee-structure",
      "communication-hub": "announcements",
      "notices":           "announcements",
      "events":            "announcements",
      "all-reports":       "reports",
      "payroll":           "staff",
    };
    setActivePage(redirects[page] ?? page);
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const renderPage = () => {
    switch (activePage) {
      // Dashboard
      case "dashboard":         return <DashboardPage />;

      // Students
      case "all-students":      return <AllStudents />;
      case "admissions":        return <Admissions />;
      case "attendance":        return <Attendance />;

      // Academics
      case "subjects":          return <Subjects />;
      case "classes":           return <Classes />;
      case "timetable":         return <Timetable />;
      case "assessments":       return <Assessments />;

      // Fees
      case "fee-structure":     return <FeeStructure />;
      case "invoices":          return <Invoices />;
      case "payments":          return <Payments />;
      case "balances":          return <Balances />;

      // Communication
      case "announcements":     return <AnnouncementsPage />;
      case "sms":               return <SMS />;
      case "whatsapp":          return <WhatsApp />;
      case "email":             return <Email />;

      // Staff
      case "staff":             return <Staff />;
      case "roles-permissions": return <RolesPermissions />;

      // Reports
      case "reports":           return <AllReports />;

      // Settings
      case "settings":          return <ComingSoon label="Settings" />;

      // Hidden pages — kept for compatibility but not in sidebar
      case "health":            return <HealthRecords />;
      case "discipline":        return <Discipline />;
      case "transport":         return <Transport />;
      case "library-ops":       return <Library />;
      case "feeding":           return <Feeding />;
      case "inventory":         return <Inventory />;
      case "payroll":           return <Payroll />;

      default:
        return <ComingSoon label={activePage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />;
    }
  };

  return (
    <AppContext.Provider value={{ onNavigate, showToast }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        input, select, textarea, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fa", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {!isMobile && (
          <Sidebar
            activePage={activePage}
            onNavigate={onNavigate}
            compact={isTablet}
            userRole={userRole}
          />
        )}

        <div style={{ marginLeft: sidebarWidth, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar />
          <main style={{
            marginTop: 56,
            padding: isMobile ? "14px 12px 80px" : "20px 20px 30px",
            flex: 1,
            overflow: "auto",
            minWidth: 0,
          }}>
            {renderPage()}
          </main>
        </div>
      </div>

      {isMobile && <MobileNav activePage={activePage} />}

      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </AppContext.Provider>
  );
}
