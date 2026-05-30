import { useState } from "react";
import Homework from "./Homework";
import Exams from "./Exams";
import Results from "./Results";
import Gradebook from "./Gradebook";
import ReportCards from "./ReportCards";

const tabs = [
  { id: "homework",     label: "Homework" },
  { id: "class-tests",  label: "Class Tests" },
  { id: "exams",        label: "Exams" },
  { id: "results",      label: "Results" },
  { id: "gradebook",    label: "Gradebook" },
  { id: "report-cards", label: "Report Cards" },
];

function ComingSoonTab({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "45vh", color: "#9ca3af",
    }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>✏️</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13 }}>This section is coming soon.</div>
    </div>
  );
}

export default function Assessments() {
  const [activeTab, setActiveTab] = useState("homework");

  const renderTab = () => {
    switch (activeTab) {
      case "homework":     return <Homework />;
      case "exams":        return <Exams />;
      case "results":      return <Results />;
      case "gradebook":    return <Gradebook />;
      case "report-cards": return <ReportCards />;
      default:             return <ComingSoonTab label="Class Tests" />;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>
          Assessments
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Manage homework, exams, results, gradebooks, and report cards.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, flexWrap: "wrap",
        borderBottom: "2px solid #e5e7eb", marginBottom: 20,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#7c3aed" : "#6b7280",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #7c3aed" : "2px solid transparent",
              marginBottom: -2,
              cursor: "pointer",
              transition: "color 0.12s",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
