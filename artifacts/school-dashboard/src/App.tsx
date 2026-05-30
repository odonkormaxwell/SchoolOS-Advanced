import { useState, useCallback } from "react";
import { AppContext, ToastType } from "./context/AppContext";
import { useWindowSize } from "./hooks/useWindowSize";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
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
import AllStudents from "./pages/AllStudents";
import Admissions from "./pages/Admissions";
import Attendance from "./pages/Attendance";
import Gradebook from "./pages/Gradebook";
import Billing from "./pages/Billing";
import CommunicationHub from "./pages/CommunicationHub";
import Transport from "./pages/Transport";
import Timetable from "./pages/Timetable";
import ReportCards from "./pages/ReportCards";
import HealthRecords from "./pages/HealthRecords";
import Exams from "./pages/Exams";
import Discipline from "./pages/Discipline";
import Staff from "./pages/Staff";
import Library from "./pages/Library";
import Homework from "./pages/Homework";
import Events from "./pages/Events";
import Subjects from "./pages/Subjects";
import Invoices from "./pages/Invoices";
import Notices from "./pages/Notices";
import Expenses from "./pages/Expenses";
import Results from "./pages/Results";
import Inventory from "./pages/Inventory";
import Payments from "./pages/Payments";
import Feeding from "./pages/Feeding";
import Payroll from "./pages/Payroll";
import Classes from "./pages/Classes";
import Scholarships from "./pages/Scholarships";
import FinancialReports from "./pages/FinancialReports";
import SMS from "./pages/SMS";
import WhatsApp from "./pages/WhatsApp";
import Email from "./pages/Email";
import AllReports from "./pages/AllReports";
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
  const { isMobile, isTablet } = useWindowSize();

  const sidebarWidth = isMobile ? 0 : isTablet ? 64 : 220;

  const onNavigate = useCallback((page: string) => {
    setActivePage(page);
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
      case "dashboard":         return <DashboardPage />;
      case "all-students":      return <AllStudents />;
      case "admissions":        return <Admissions />;
      case "attendance":        return <Attendance />;
      case "gradebook":         return <Gradebook />;
      case "billing":           return <Billing />;
      case "communication-hub": return <CommunicationHub />;
      case "transport":         return <Transport />;
      case "timetable":         return <Timetable />;
      case "report-cards":      return <ReportCards />;
      case "health":            return <HealthRecords />;
      case "exams":             return <Exams />;
      case "discipline":        return <Discipline />;
      case "staff":             return <Staff />;
      case "library-ops":       return <Library />;
      case "homework":          return <Homework />;
      case "events":            return <Events />;
      case "subjects":          return <Subjects />;
      case "invoices":          return <Invoices />;
      case "notices":           return <Notices />;
      case "expenses":          return <Expenses />;
      case "results":           return <Results />;
      case "inventory":         return <Inventory />;
      case "payments":          return <Payments />;
      case "feeding":           return <Feeding />;
      case "payroll":           return <Payroll />;
      case "classes":           return <Classes />;
      case "scholarships":      return <Scholarships />;
      case "financial-reports": return <FinancialReports />;
      case "sms":               return <SMS />;
      case "whatsapp":          return <WhatsApp />;
      case "email":             return <Email />;
      case "all-reports":       return <AllReports />;
      default:                  return <ComingSoon label={activePage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />;
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
        {/* Sidebar — hidden on mobile */}
        {!isMobile && <Sidebar activePage={activePage} onNavigate={onNavigate} compact={isTablet} />}

        {/* Main content */}
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

      {/* Mobile bottom navigation */}
      {isMobile && <MobileNav activePage={activePage} />}

      {/* Toasts */}
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </AppContext.Provider>
  );
}
