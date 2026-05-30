import { useState } from "react";
import { Eye, EyeOff, Lock, Shield, Activity, CheckCircle, XCircle, AlertTriangle, LogIn, LogOut, Key, Smartphone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type Tab = "password" | "2fa" | "activity";

function StrengthBar({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",      pass: password.length >= 8 },
    { label: "Uppercase letter",   pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter",   pass: /[a-z]/.test(password) },
    { label: "Number",             pass: /[0-9]/.test(password) },
    { label: "Special character",  pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score  = checks.filter((c) => c.pass).length;
  const color  = score <= 1 ? "#dc2626" : score <= 3 ? "#d97706" : score === 4 ? "#2563eb" : "#16a34a";
  const label  = score === 0 ? "" : score <= 1 ? "Weak" : score <= 3 ? "Fair" : score === 4 ? "Good" : "Strong";
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1,2,3,4,5].map((n) => (
          <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= score ? color : "#e5e7eb", transition: "background 0.2s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {checks.map((c) => (
            <span key={c.label} title={c.label} style={{ fontSize: 10, color: c.pass ? "#16a34a" : "#9ca3af" }}>
              {c.pass ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Security() {
  const { user, changePassword, toggle2fa, activityLog } = useAuth();
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();

  const [tab, setTab]         = useState<Tab>("password");
  const [current,  setCurrent]  = useState("");
  const [newPwd,   setNewPwd]   = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showCon,  setShowCon]  = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError,   setPwdError]   = useState("");

  const [setup2fa, setSetup2fa] = useState(false);

  if (!user) return null;

  const handleChangePassword = () => {
    setPwdError("");
    if (!current || !newPwd || !confirm) return setPwdError("Please fill in all fields.");
    if (newPwd !== confirm) return setPwdError("New passwords do not match.");
    setPwdLoading(true);
    setTimeout(() => {
      const result = changePassword(current, newPwd);
      setPwdLoading(false);
      if (!result.success) { setPwdError(result.error || "Failed to change password."); return; }
      showToast("Password changed successfully!", "success");
      setCurrent(""); setNewPwd(""); setConfirm("");
    }, 700);
  };

  const handle2faToggle = () => {
    if (!user.twoFAEnabled) { setSetup2fa(true); return; }
    toggle2fa(false);
    showToast("Two-factor authentication disabled.", "warning");
  };

  const confirmEnable2fa = () => {
    toggle2fa(true);
    setSetup2fa(false);
    showToast("Two-factor authentication enabled!", "success");
  };

  const eventIcon = (type: string) => {
    if (type === "login")          return <LogIn size={14} color="#16a34a" />;
    if (type === "logout")         return <LogOut size={14} color="#6b7280" />;
    if (type === "password_change") return <Key size={14} color="#2563eb" />;
    if (type === "2fa_enabled")    return <Shield size={14} color="#7c3aed" />;
    if (type === "2fa_disabled")   return <Shield size={14} color="#d97706" />;
    if (type === "failed_login")   return <AlertTriangle size={14} color="#dc2626" />;
    return <Activity size={14} color="#9ca3af" />;
  };
  const eventBg = (type: string) => {
    if (type === "login")           return "#dcfce7";
    if (type === "logout")          return "#f3f4f6";
    if (type === "password_change") return "#dbeafe";
    if (type.startsWith("2fa"))     return "#f5f3ff";
    if (type === "failed_login")    return "#fee2e2";
    return "#f3f4f6";
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "password", label: "Change Password",        icon: <Lock size={14} /> },
    { id: "2fa",      label: "Two-Factor Auth",         icon: <Shield size={14} /> },
    { id: "activity", label: "Activity Log",            icon: <Activity size={14} /> },
  ];

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 36px 10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13, color: "#111827", background: "white", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Security</h1>
        {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Manage your password, two-factor authentication, and security activity</p>}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "white", borderRadius: 10, padding: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", marginBottom: 18, overflowX: "auto" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 7, border: "none",
            background: tab === t.id ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "transparent",
            color: tab === t.id ? "white" : "#6b7280", fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Change Password */}
      {tab === "password" && (
        <div style={{ background: "white", borderRadius: 14, padding: isMobile ? "18px" : "26px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={18} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Change Password</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Update your account password</div>
            </div>
          </div>

          {pwdError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#dc2626" }}>⚠️ {pwdError}</div>
          )}

          {[
            { label: "Current Password", val: current, set: setCurrent, show: showCur, toggle: () => setShowCur(!showCur) },
            { label: "New Password",     val: newPwd,  set: setNewPwd,  show: showNew, toggle: () => setShowNew(!showNew) },
            { label: "Confirm New Password", val: confirm, set: setConfirm, show: showCon, toggle: () => setShowCon(!showCon) },
          ].map(({ label, val, set, show, toggle }) => (
            <div key={label} style={{ marginBottom: label === "New Password" ? 4 : 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
              <div style={{ position: "relative" }}>
                <input type={show ? "text" : "password"} value={val} onChange={(e) => set(e.target.value)} placeholder="••••••••"
                  style={inputStyle} />
                <button type="button" onClick={toggle} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {label === "New Password" && <StrengthBar password={newPwd} />}
            </div>
          ))}

          <button onClick={handleChangePassword} disabled={pwdLoading} style={{
            width: "100%", padding: "11px", border: "none", borderRadius: 9, marginTop: 8,
            background: pwdLoading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
            color: "white", fontSize: 13.5, fontWeight: 700, cursor: pwdLoading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {pwdLoading ? <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Updating...</> : "Update Password"}
          </button>
        </div>
      )}

      {/* 2FA */}
      {tab === "2fa" && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ background: "white", borderRadius: 14, padding: isMobile ? "18px" : "26px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: user.twoFAEnabled ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Shield size={20} color={user.twoFAEnabled ? "#16a34a" : "#9ca3af"} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.6 }}>
                    {user.twoFAEnabled
                      ? "2FA is enabled. Your account is protected with an OTP code on every login."
                      : "Add an extra layer of security to your account. A code will be sent to your email on login."}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, padding: "3px 10px", borderRadius: 20, background: user.twoFAEnabled ? "#dcfce7" : "#fef3c7" }}>
                    {user.twoFAEnabled
                      ? <><CheckCircle size={11} color="#16a34a" /><span style={{ fontSize: 11, fontWeight: 600, color: "#16a34a" }}>Enabled</span></>
                      : <><XCircle size={11} color="#d97706" /><span style={{ fontSize: 11, fontWeight: 600, color: "#d97706" }}>Disabled</span></>}
                  </div>
                </div>
              </div>
              <button onClick={handle2faToggle} style={{
                padding: "8px 14px", border: "none", borderRadius: 8, flexShrink: 0,
                background: user.twoFAEnabled ? "#fee2e2" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                color: user.twoFAEnabled ? "#dc2626" : "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              }}>
                {user.twoFAEnabled ? "Disable" : "Enable 2FA"}
              </button>
            </div>

            {setup2fa && (
              <div style={{ marginTop: 18, padding: "16px", background: "#f5f3ff", borderRadius: 10, border: "1px solid #ddd6fe" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Smartphone size={16} color="#7c3aed" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>Enable Email OTP</span>
                </div>
                <p style={{ fontSize: 12.5, color: "#4c1d95", margin: "0 0 12px", lineHeight: 1.6 }}>
                  When enabled, a 6-digit code will be sent to <strong>{user.email}</strong> every time you sign in. The code expires in 10 minutes.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={confirmEnable2fa} style={{ padding: "8px 16px", border: "none", borderRadius: 8, background: "#7c3aed", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                    Confirm & Enable
                  </button>
                  <button onClick={() => setSetup2fa(false)} style={{ padding: "8px 14px", border: "1.5px solid #ddd6fe", borderRadius: 8, background: "white", color: "#7c3aed", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: "#fffbeb", border: "1px solid #fef08a", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>Supported 2FA Methods</div>
            {[
              { label: "Email OTP",        status: "Available",    color: "#16a34a", bg: "#dcfce7" },
              { label: "SMS OTP",          status: "Coming Soon",  color: "#d97706", bg: "#fef3c7" },
              { label: "Authenticator App",status: "Coming Soon",  color: "#d97706", bg: "#fef3c7" },
              { label: "WhatsApp OTP",     status: "Coming Soon",  color: "#d97706", bg: "#fef3c7" },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #fef9c3" }}>
                <span style={{ fontSize: 12.5, color: "#78350f" }}>{m.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: m.bg, color: m.color }}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      {tab === "activity" && (
        <div style={{ background: "white", borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Security Activity</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{activityLog.length} events</span>
          </div>
          {activityLog.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>
              <Activity size={28} style={{ margin: "0 auto 10px", display: "block" }} />
              <div style={{ fontSize: 13 }}>No activity recorded yet</div>
            </div>
          ) : (
            <div style={{ overflowY: "auto", maxHeight: "60vh" }}>
              {activityLog.map((ev) => (
                <div key={ev.id} style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f9fafb", alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: eventBg(ev.type), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {eventIcon(ev.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{ev.description}</span>
                      <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 20, background: ev.status === "success" ? "#dcfce7" : "#fee2e2", color: ev.status === "success" ? "#16a34a" : "#dc2626", fontWeight: 600, flexShrink: 0 }}>
                        {ev.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>
                      {new Date(ev.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · {ev.device} · IP: {ev.ip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
