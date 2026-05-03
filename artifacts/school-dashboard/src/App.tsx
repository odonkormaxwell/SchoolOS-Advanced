import { useState } from "react";
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
import { kpiCards } from "./data/staticData";

function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <KpiCards cards={kpiCards} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 320px",
          gap: 14,
          marginBottom: 14,
          alignItems: "start",
        }}
      >
        <FeeCollectionChart />
        <AttendanceChart />
        <Announcements />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 320px",
          gap: 14,
          marginBottom: 14,
          alignItems: "start",
        }}
      >
        <RecentPayments />
        <OutstandingFeesChart />
        <QuickActions />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <TransportStatus />
        <TodaySchedule />
        <EventsCalendar />
      </div>
    </>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "all-students":
        return <AllStudents />;
      default:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              color: "#9ca3af",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Coming Soon
            </div>
            <div style={{ fontSize: 13 }}>This section is under construction.</div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6fa",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div
        style={{
          marginLeft: 220,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar />

        <main
          style={{
            marginTop: 56,
            padding: "20px 20px 30px",
            flex: 1,
            overflow: "auto",
            minWidth: 0,
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
