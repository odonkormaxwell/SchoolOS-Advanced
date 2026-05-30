import { useState } from "react";
import { CheckCircle, XCircle, Globe, Lock, Send, Printer, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { ToastType } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import ReportCards from "./ReportCards";
import {
  ASSESSMENT_COMPONENTS, getGrade, calcTotal,
  JHS3_STUDENTS, JHS3_SUBJECTS, SUBJECT_SCORES, WORKFLOW_STATUS, STATUS_STYLE,
  rowToScores,
  type ComponentScores, type AssessmentStatus,
} from "../data/academicData";

// ─── Types ────────────────────────────────────────────────────────────────────
type AllScores = Record<string, Record<number, ComponentScores>>;
type WorkflowMap = Record<string, AssessmentStatus>;

function initAllScores(): AllScores {
  const result: AllScores = {};
  JHS3_SUBJECTS.forEach((subj) => {
    result[subj.code] = {};
    JHS3_STUDENTS.forEach((st) => {
      const raw = SUBJECT_SCORES[subj.code]?.[st.id];
      result[subj.code][st.id] = raw
        ? rowToScores(raw)
        : { classEx: 0, homework: 0, project: 0, midterm: 0, exam: 0 };
    });
  });
  return result;
}

// ─── Score Entry Tab ──────────────────────────────────────────────────────────
interface ScoreEntryProps {
  allScores: AllScores;
  setAllScores: React.Dispatch<React.SetStateAction<AllScores>>;
  workflowStatus: WorkflowMap;
  onStatusChange: (code: string, status: AssessmentStatus) => void;
  showToast: (msg: string, type?: ToastType) => void;
  canApprove: boolean;
}

function ScoreEntryTab({ allScores, setAllScores, workflowStatus, onStatusChange, showToast, canApprove }: ScoreEntryProps) {
  const [subjectCode, setSubjectCode] = useState("MTH");
  const subject  = JHS3_SUBJECTS.find((s) => s.code === subjectCode)!;
  const status   = workflowStatus[subjectCode];
  const ss       = STATUS_STYLE[status];
  const editable = status === "draft";

  const updateScore = (studentId: number, key: keyof ComponentScores, value: number) => {
    setAllScores((prev) => ({
      ...prev,
      [subjectCode]: {
        ...prev[subjectCode],
        [studentId]: { ...prev[subjectCode][studentId], [key]: value },
      },
    }));
  };

  return (
    <div>
      {/* Subject pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {JHS3_SUBJECTS.map((s) => {
          const st  = workflowStatus[s.code];
          const sst = STATUS_STYLE[st];
          const active = s.code === subjectCode;
          return (
            <button key={s.code} onClick={() => setSubjectCode(s.code)}
              style={{ padding: "6px 13px", border: `1.5px solid ${active ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 20, background: active ? "#7c3aed" : "white", color: active ? "white" : "#374151", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.12s" }}>
              {s.name}
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: active ? "rgba(255,255,255,0.25)" : sst.bg, color: active ? "white" : sst.color }}>{sst.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status banner */}
      <div style={{ background: ss.bg, border: `1px solid ${ss.border}`, borderRadius: 10, padding: "10px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: ss.color }}>{ss.label}</span>
          <span style={{ fontSize: 12.5, color: "#6b7280", marginLeft: 10 }}>
            {subject.name} · JHS 3 · Term 2, 2025/2026 · {subject.teacher}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {status === "draft" && (
            <>
              <button onClick={() => showToast("Draft saved!", "success")}
                style={{ padding: "6px 13px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", fontSize: 12, cursor: "pointer", color: "#374151" }}>
                Save Draft
              </button>
              <button onClick={() => { onStatusChange(subjectCode, "submitted"); showToast(`${subject.name} submitted for approval`, "success"); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", border: "none", borderRadius: 7, background: "#2563eb", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                <Send size={12} /> Submit for Approval
              </button>
            </>
          )}
          {status === "submitted" && canApprove && (
            <>
              <button onClick={() => { onStatusChange(subjectCode, "draft"); showToast(`${subject.name} returned to teacher`, "info"); }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", border: "1px solid #fecaca", borderRadius: 7, background: "white", fontSize: 12, cursor: "pointer", color: "#dc2626" }}>
                <XCircle size={12} /> Reject
              </button>
              <button onClick={() => { onStatusChange(subjectCode, "approved"); showToast(`${subject.name} approved!`, "success"); }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", border: "none", borderRadius: 7, background: "#16a34a", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                <CheckCircle size={12} /> Approve
              </button>
            </>
          )}
          {status === "approved" && canApprove && (
            <button onClick={() => { onStatusChange(subjectCode, "published"); showToast(`${subject.name} published to parents!`, "success"); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", border: "none", borderRadius: 7, background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Globe size={12} /> Publish
            </button>
          )}
          {status === "published" && canApprove && (
            <button onClick={() => { onStatusChange(subjectCode, "locked"); showToast(`${subject.name} locked — no further edits`, "info"); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", border: "none", borderRadius: 7, background: "#374151", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <Lock size={12} /> Lock Results
            </button>
          )}
        </div>
      </div>

      {/* Score table */}
      <div style={{ overflowX: "auto", background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 760 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#374151", fontSize: 12, minWidth: 180 }}>Student</th>
              {ASSESSMENT_COMPONENTS.map((c) => (
                <th key={c.id} style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#374151", fontSize: 11, minWidth: 74 }}>
                  <div style={{ color: "#374151" }}>{c.short}</div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af" }}>/{c.max}</div>
                </th>
              ))}
              <th style={{ padding: "9px 10px", textAlign: "center", fontWeight: 800, color: "#111827", fontSize: 12, minWidth: 62 }}>Total</th>
              <th style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#111827", fontSize: 12 }}>Grade</th>
              <th style={{ padding: "9px 14px", textAlign: "left", fontWeight: 700, color: "#111827", fontSize: 12 }}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {JHS3_STUDENTS.map((student, i) => {
              const scores = allScores[subjectCode]?.[student.id] ?? { classEx: 0, homework: 0, project: 0, midterm: 0, exam: 0 };
              const total  = calcTotal(scores);
              const gr     = getGrade(total);
              return (
                <tr key={student.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "9px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 31, height: 31, borderRadius: "50%", background: student.avatarBg, color: student.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10.5, flexShrink: 0 }}>{student.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#111827", fontSize: 12.5 }}>{student.name}</div>
                        <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  {ASSESSMENT_COMPONENTS.map((c) => (
                    <td key={c.id} style={{ padding: "8px 10px", textAlign: "center" }}>
                      {editable ? (
                        <input
                          type="number" min={0} max={c.max} value={scores[c.id]}
                          onChange={(e) => updateScore(student.id, c.id, Math.min(c.max, Math.max(0, Number(e.target.value) || 0)))}
                          style={{ width: "100%", padding: "5px 4px", border: "1.5px solid #e5e7eb", borderRadius: 6, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#111827", background: "white", outline: "none", boxSizing: "border-box" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#7c3aed"; }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
                        />
                      ) : (
                        <span style={{ fontWeight: 600, color: "#374151" }}>{scores[c.id]}</span>
                      )}
                    </td>
                  ))}
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 800, fontSize: 16, color: gr.color }}>{total}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: gr.bg, color: gr.color }}>{gr.grade}</span>
                  </td>
                  <td style={{ padding: "9px 14px", fontSize: 12, color: "#6b7280", fontStyle: "italic" }}>{gr.remark}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f9fafb", borderTop: "2px solid #e5e7eb" }}>
              <td style={{ padding: "9px 14px", fontWeight: 700, color: "#374151", fontSize: 12 }}>Class Average</td>
              {ASSESSMENT_COMPONENTS.map((c) => {
                const avg = JHS3_STUDENTS.reduce((s, st) => s + (allScores[subjectCode]?.[st.id]?.[c.id] ?? 0), 0) / JHS3_STUDENTS.length;
                return <td key={c.id} style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#374151" }}>{avg.toFixed(1)}</td>;
              })}
              {(() => {
                const avgTotal = JHS3_STUDENTS.reduce((s, st) => s + calcTotal(allScores[subjectCode]?.[st.id] ?? { classEx:0,homework:0,project:0,midterm:0,exam:0 }), 0) / JHS3_STUDENTS.length;
                const gr = getGrade(avgTotal);
                return (
                  <>
                    <td style={{ padding:"9px 10px",textAlign:"center",fontWeight:800,color:gr.color,fontSize:14 }}>{avgTotal.toFixed(1)}</td>
                    <td style={{ padding:"9px 10px",textAlign:"center" }}><span style={{fontSize:11.5,fontWeight:800,padding:"2px 8px",borderRadius:20,background:gr.bg,color:gr.color}}>{gr.grade}</span></td>
                    <td />
                  </>
                );
              })()}
            </tr>
          </tfoot>
        </table>
      </div>
      <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 8, textAlign: "right" }}>
        {editable ? "✏️ Editable — scores auto-calculate total, grade & remark" : `🔒 Read-only (${ss.label}) — use Reject to reopen for editing`}
      </p>
    </div>
  );
}

// ─── Result Workflow Tab ──────────────────────────────────────────────────────
interface WorkflowProps {
  workflowStatus: WorkflowMap;
  onStatusChange: (code: string, status: AssessmentStatus) => void;
  showToast: (msg: string, type?: ToastType) => void;
  canApprove: boolean;
}

function WorkflowTab({ workflowStatus, onStatusChange, showToast, canApprove }: WorkflowProps) {
  const stages: { id: AssessmentStatus; label: string; color: string; bg: string }[] = [
    { id: "draft",     label: "Draft",     color: "#92400e", bg: "#fef3c7" },
    { id: "submitted", label: "Submitted", color: "#1d4ed8", bg: "#dbeafe" },
    { id: "approved",  label: "Approved",  color: "#15803d", bg: "#dcfce7" },
    { id: "published", label: "Published", color: "#7c3aed", bg: "#ede9fe" },
    { id: "locked",    label: "Locked",    color: "#374151", bg: "#f3f4f6" },
  ];

  return (
    <div>
      {/* Pipeline counters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {stages.map((stage, i) => {
          const count = JHS3_SUBJECTS.filter((s) => workflowStatus[s.code] === stage.id).length;
          return (
            <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: i > 0 ? 8 : 0 }}>
              {i > 0 && <span style={{ fontSize: 16, color: "#d1d5db", flexShrink: 0 }}>→</span>}
              <div style={{ background: "white", border: `1.5px solid ${stage.bg}`, borderRadius: 10, padding: "12px 20px", textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: stage.color }}>{count}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>{stage.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval note for non-headteachers */}
      {!canApprove && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12.5, color: "#1e40af" }}>
          ℹ️ Only the Headteacher or School Owner can approve, publish, and lock results.
        </div>
      )}

      {/* Workflow table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>JHS 3 — Term 2, 2025/2026 · Result Approval Status</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{JHS3_SUBJECTS.length} subjects</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Subject", "Teacher", "Status", "Last Updated", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {JHS3_SUBJECTS.map((subj) => {
                const st  = workflowStatus[subj.code];
                const ss  = STATUS_STYLE[st];
                const wf  = WORKFLOW_STATUS.find((w) => w.code === subj.code)!;
                return (
                  <tr key={subj.code} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "11px 14px", fontWeight: 700, color: "#111827" }}>{subj.name}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: subj.tBg, color: subj.tColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 9.5, flexShrink: 0 }}>{subj.tInitials}</div>
                        <span style={{ fontSize: 12, color: "#374151" }}>{subj.teacher}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: ss.bg, color: ss.color }}>{ss.label}</span>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "#9ca3af" }}>{wf.date || "—"}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        {st === "draft"     && <span style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>Awaiting teacher submission</span>}
                        {st === "submitted" && !canApprove && <span style={{ fontSize: 12, color: "#2563eb", fontStyle: "italic" }}>Pending Headteacher review</span>}
                        {st === "submitted" && canApprove && (
                          <>
                            <button onClick={() => { onStatusChange(subj.code, "approved"); showToast(`${subj.name} approved`, "success"); }}
                              style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 11px",border:"none",borderRadius:6,background:"#dcfce7",color:"#15803d",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                              <CheckCircle size={11}/> Approve
                            </button>
                            <button onClick={() => { onStatusChange(subj.code, "draft"); showToast(`${subj.name} returned to teacher`, "info"); }}
                              style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 11px",border:"none",borderRadius:6,background:"#fee2e2",color:"#dc2626",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                              <XCircle size={11}/> Reject
                            </button>
                          </>
                        )}
                        {st === "approved" && !canApprove && <span style={{fontSize:12,color:"#15803d",fontStyle:"italic"}}>Approved — pending publication</span>}
                        {st === "approved" && canApprove && (
                          <button onClick={() => { onStatusChange(subj.code, "published"); showToast(`${subj.name} published to parents`, "success"); }}
                            style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 11px",border:"none",borderRadius:6,background:"#ede9fe",color:"#7c3aed",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                            <Globe size={11}/> Publish to Parents
                          </button>
                        )}
                        {st === "published" && canApprove && (
                          <button onClick={() => { onStatusChange(subj.code, "locked"); showToast(`${subj.name} locked`, "info"); }}
                            style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 11px",border:"none",borderRadius:6,background:"#f3f4f6",color:"#374151",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                            <Lock size={11}/> Lock
                          </button>
                        )}
                        {st === "published" && !canApprove && <span style={{fontSize:12,color:"#7c3aed"}}>✓ Published to parents</span>}
                        {st === "locked"    && <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#9ca3af"}}><Lock size={11}/> Locked</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Broadsheet Tab ───────────────────────────────────────────────────────────
function BroadsheetTab({ showToast }: { showToast: (m: string, t?: ToastType) => void }) {
  const subjects = JHS3_SUBJECTS.slice(0, 6); // 6 BECE core subjects

  const rows = JHS3_STUDENTS.map((student) => {
    const subjectTotals = subjects.map((subj) => {
      const raw = SUBJECT_SCORES[subj.code]?.[student.id];
      return raw ? raw[0] + raw[1] + raw[2] + raw[3] + raw[4] : 0;
    });
    const total = subjectTotals.reduce((a, b) => a + b, 0);
    const avg   = total / subjectTotals.length;
    return { student, subjectTotals, total, avg };
  }).sort((a, b) => b.total - a.total);

  const ranked = rows.map((r, i) => ({ ...r, position: i + 1, gr: getGrade(r.avg) }));

  const subjectAvgs = subjects.map((subj) => {
    const scores = JHS3_STUDENTS.map((st) => {
      const raw = SUBJECT_SCORES[subj.code]?.[st.id];
      return raw ? raw[0]+raw[1]+raw[2]+raw[3]+raw[4] : 0;
    });
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>JHS 3 — Term 2, 2025/2026 · Academic Broadsheet</span>
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 10 }}>BECE Core Subjects · {JHS3_STUDENTS.length} students</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => showToast("Printing broadsheet…", "info")}
            style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"1px solid #e5e7eb",borderRadius:8,background:"white",fontSize:12,cursor:"pointer",color:"#374151" }}>
            <Printer size={13}/> Print
          </button>
          <button onClick={() => showToast("Exporting CSV…", "success")}
            style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 13px",border:"none",borderRadius:8,background:"#7c3aed",color:"white",fontSize:12,fontWeight:700,cursor:"pointer" }}>
            <Download size={13}/> Export CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto", background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 820 }}>
          <thead>
            <tr style={{ background: "#7c3aed" }}>
              <th style={{ padding: "10px 12px", textAlign: "center", color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 11 }}>Pos</th>
              <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, fontSize: 11 }}>Student</th>
              {subjects.map((s) => (
                <th key={s.code} style={{ padding: "9px 10px", textAlign: "center", color: "white", fontWeight: 700, fontSize: 11, minWidth: 66 }}>
                  <div>{s.code}</div><div style={{ fontSize: 9, opacity: 0.75 }}>/100</div>
                </th>
              ))}
              <th style={{ padding: "9px 10px", textAlign: "center", color: "white", fontWeight: 700, fontSize: 11 }}>Total</th>
              <th style={{ padding: "9px 10px", textAlign: "center", color: "white", fontWeight: 700, fontSize: 11 }}>Avg</th>
              <th style={{ padding: "9px 10px", textAlign: "center", color: "white", fontWeight: 700, fontSize: 11 }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => (
              <tr key={r.student.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: r.position <= 3 ? "#7c3aed" : "#9ca3af", fontSize: r.position <= 3 ? 16 : 13 }}>
                  {r.position <= 3 ? ["🥇","🥈","🥉"][r.position-1] : r.position}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: r.student.avatarBg, color: r.student.avatarColor, display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:10,flexShrink:0 }}>{r.student.initials}</div>
                    <span style={{ fontWeight: 600, color: "#111827" }}>{r.student.name}</span>
                  </div>
                </td>
                {r.subjectTotals.map((score, si) => {
                  const g = getGrade(score);
                  return (
                    <td key={si} style={{ padding:"10px",textAlign:"center",fontWeight:700,color:score?g.color:"#d1d5db",background:score===0?"#f9fafb":"transparent" }}>
                      {score || "—"}
                    </td>
                  );
                })}
                <td style={{ padding:"10px",textAlign:"center",fontWeight:800,fontSize:14,color:"#111827" }}>{r.total}</td>
                <td style={{ padding:"10px",textAlign:"center",fontWeight:700,color:r.gr.color }}>{r.avg.toFixed(1)}</td>
                <td style={{ padding:"10px",textAlign:"center" }}>
                  <span style={{fontSize:12,fontWeight:800,padding:"3px 10px",borderRadius:20,background:r.gr.bg,color:r.gr.color}}>{r.gr.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f1f5f9", borderTop: "2px solid #e5e7eb" }}>
              <td colSpan={2} style={{ padding:"10px 14px",fontWeight:700,color:"#374151",fontSize:12 }}>Class Average</td>
              {subjectAvgs.map((avg, i) => {
                const g = getGrade(avg);
                return <td key={i} style={{padding:"10px",textAlign:"center",fontWeight:700,color:g.color}}>{avg.toFixed(1)}</td>;
              })}
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const subjects = JHS3_SUBJECTS.slice(0, 6);

  const subjectStats = subjects.map((subj) => {
    const scores = JHS3_STUDENTS.map((st) => {
      const raw = SUBJECT_SCORES[subj.code]?.[st.id];
      return raw ? raw[0]+raw[1]+raw[2]+raw[3]+raw[4] : 0;
    });
    const avg      = scores.reduce((a, b) => a + b, 0) / scores.length;
    const passRate = Math.round((scores.filter((s) => s >= 50).length / scores.length) * 100);
    return { subj, avg, passRate };
  });

  const sortedByAvg = [...subjectStats].sort((a, b) => b.avg - a.avg);
  const classAvg    = subjectStats.reduce((a, s) => a + s.avg, 0) / subjectStats.length;

  const studentRankings = JHS3_STUDENTS.map((st) => {
    const total = subjects.reduce((sum, subj) => {
      const raw = SUBJECT_SCORES[subj.code]?.[st.id];
      return sum + (raw ? raw[0]+raw[1]+raw[2]+raw[3]+raw[4] : 0);
    }, 0);
    return { student: st, avg: total / subjects.length };
  }).sort((a, b) => b.avg - a.avg);

  const passStudents = studentRankings.filter((s) => s.avg >= 50).length;

  const kpis = [
    { label: "Class Average",    value: `${classAvg.toFixed(1)}%`,  sub: "Across 6 BECE subjects",         color: "#7c3aed", bg: "#ede9fe" },
    { label: "Overall Pass Rate", value: `${Math.round((passStudents/studentRankings.length)*100)}%`, sub: `${passStudents}/${studentRankings.length} students passed`, color: "#16a34a", bg: "#dcfce7" },
    { label: "Top Student",      value: studentRankings[0].student.name.split(" ")[0], sub: `${studentRankings[0].avg.toFixed(1)}% — ${getGrade(studentRankings[0].avg).grade}`,  color: "#d97706", bg: "#fef3c7" },
    { label: "Best Subject",     value: sortedByAvg[0].subj.code, sub: `${sortedByAvg[0].subj.name.split(" ")[0]} — ${sortedByAvg[0].avg.toFixed(1)}% avg`, color: "#2563eb", bg: "#dbeafe" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 5 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, marginBottom: 2 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Subject Performance */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Subject Performance · JHS 3</div>
          {sortedByAvg.map(({ subj, avg, passRate }) => {
            const gr = getGrade(avg);
            return (
              <div key={subj.code} style={{ marginBottom: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{subj.name}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 11.5, color: "#9ca3af" }}>Pass {passRate}%</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: gr.color }}>{avg.toFixed(1)}</span>
                  </div>
                </div>
                <div style={{ height: 7, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${avg}%`, background: gr.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Rankings */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Student Rankings · JHS 3</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Top Performers</div>
            {studentRankings.slice(0, 4).map((r, i) => {
              const gr = getGrade(r.avg);
              return (
                <div key={r.student.id} style={{ display:"flex",alignItems:"center",gap:9,marginBottom:9 }}>
                  <span style={{ fontSize: 15, width: 22, flexShrink: 0 }}>{["🥇","🥈","🥉","④"][i]}</span>
                  <div style={{ width:28,height:28,borderRadius:"50%",background:r.student.avatarBg,color:r.student.avatarColor,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:10,flexShrink:0 }}>{r.student.initials}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:12.5,fontWeight:600,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.student.name}</div>
                    <div style={{ height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden",marginTop:3 }}>
                      <div style={{ height:"100%",width:`${r.avg}%`,background:"#7c3aed",borderRadius:2 }} />
                    </div>
                  </div>
                  <span style={{ fontSize:12.5,fontWeight:700,color:gr.color,flexShrink:0 }}>{r.avg.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Needs Academic Support</div>
            {[...studentRankings].reverse().slice(0, 3).map((r) => {
              const gr = getGrade(r.avg);
              return (
                <div key={r.student.id} style={{ display:"flex",alignItems:"center",gap:9,marginBottom:9 }}>
                  <div style={{ width:28,height:28,borderRadius:"50%",background:r.student.avatarBg,color:r.student.avatarColor,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:10,flexShrink:0 }}>{r.student.initials}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12.5,fontWeight:600,color:"#111827" }}>{r.student.name}</div>
                    <span style={{ fontSize:10.5,fontWeight:700,padding:"1px 6px",borderRadius:10,background:gr.bg,color:gr.color }}>{gr.grade} · {gr.remark}</span>
                  </div>
                  <span style={{ fontSize:12.5,fontWeight:700,color:gr.color,flexShrink:0 }}>{r.avg.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "score-entry",  label: "Score Entry",    icon: "✏️" },
  { id: "workflow",     label: "Result Workflow", icon: "🔄" },
  { id: "broadsheet",   label: "Broadsheet",      icon: "📊" },
  { id: "analytics",    label: "Analytics",       icon: "📈" },
  { id: "report-cards", label: "Report Cards",    icon: "📋" },
];

export default function Assessments() {
  const { showToast } = useApp();
  const { user } = useAuth();
  const [activeTab,      setActiveTab]      = useState("score-entry");
  const [allScores,      setAllScores]      = useState<AllScores>(initAllScores);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowMap>(
    () => Object.fromEntries(WORKFLOW_STATUS.map((w) => [w.code, w.status]))
  );

  const handleStatusChange = (code: string, status: AssessmentStatus) =>
    setWorkflowStatus((prev) => ({ ...prev, [code]: status }));

  const canApprove = ["headteacher", "school_owner"].includes(user?.role ?? "");

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 21, fontWeight: 800, color: "#111827", margin: "0 0 3px" }}>Academic Engine</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Score entry · Approval workflow · Broadsheet · Analytics · Report cards — JHS 3 · Term 2, 2025/2026
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap", borderBottom: "2px solid #e5e7eb", marginBottom: 20 }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: `2.5px solid ${active ? "#7c3aed" : "transparent"}`, marginBottom: -2, color: active ? "#7c3aed" : "#6b7280", fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", transition: "color 0.12s" }}>
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "score-entry"  && <ScoreEntryTab allScores={allScores} setAllScores={setAllScores} workflowStatus={workflowStatus} onStatusChange={handleStatusChange} showToast={showToast} canApprove={canApprove} />}
      {activeTab === "workflow"     && <WorkflowTab workflowStatus={workflowStatus} onStatusChange={handleStatusChange} showToast={showToast} canApprove={canApprove} />}
      {activeTab === "broadsheet"   && <BroadsheetTab showToast={showToast} />}
      {activeTab === "analytics"    && <AnalyticsTab />}
      {activeTab === "report-cards" && <ReportCards />}
    </div>
  );
}
