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
import { kpiCards } from "./data/staticData";

export default function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fa", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main
          style={{
            marginTop: 56,
            padding: "20px 20px 30px",
            flex: 1,
            overflow: "auto",
            minWidth: 0,
          }}
        >
          {/* Dashboard header */}
          <DashboardHeader />

          {/* KPI cards */}
          <KpiCards cards={kpiCards} />

          {/* Row 2: Charts + Announcements */}
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

          {/* Row 3: Recent Payments + Outstanding Fees + Quick Actions */}
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

          {/* Row 4: Transport + Schedule + Events */}
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
        </main>
      </div>
    </div>
  );
}
