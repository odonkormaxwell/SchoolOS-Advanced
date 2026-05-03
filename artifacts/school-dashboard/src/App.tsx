import { useState, useCallback } from "react";
import { AppContext, ToastType } from "./context/AppContext";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
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
import { kpiCards } from "./data/staticData";

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <KpiCards cards={kpiCards} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 320px", gap: 14, marginBottom: 14, alignItems: "start" }}>
        <FeeCollectionChart />
        <AttendanceChart />
        <Announcements />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 320px", gap: 14, marginBottom: 14, alignItems: "start" }}>
        <RecentPayments />
        <OutstandingFeesChart />
        <QuickActions />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "start" }}>
        <TransportStatus />
        <TodaySchedule />
        <EventsCalendar />
      </div>
    </>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", color: "#9ca3af" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🚧</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#374151", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13 }}>This section is coming soon.</div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [toasts, setToasts] = useState<ToastState[]>([]);

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
      default:                  return <ComingSoon label={activePage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />;
    }
  };

  return (
    <AppContext.Provider value={{ onNavigate, showToast }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fa", fontFamily: "'Inter', sans-serif" }}>
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar />
          <main style={{ marginTop: 56, padding: "20px 20px 30px", flex: 1, overflow: "auto", minWidth: 0 }}>
            {renderPage()}
          </main>
        </div>
      </div>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </AppContext.Provider>
  );
}
