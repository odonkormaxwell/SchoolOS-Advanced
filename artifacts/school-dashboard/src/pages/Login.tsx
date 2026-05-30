import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";

const quickUsers = [
  { label: "Super Admin",       email: "superadmin@edulex.io",         color: "#3730a3", bg: "#e0e7ff" },
  { label: "Headteacher",       email: "headteacher@happykids.edu.gh", color: "#7c3aed", bg: "#f5f3ff" },
  { label: "Teacher",           email: "ama.owusu@happykids.edu.gh",   color: "#2563eb", bg: "#eff6ff" },
  { label: "Accountant",        email: "accounts@happykids.edu.gh",    color: "#16a34a", bg: "#f0fdf4" },
  { label: "Admissions",        email: "admissions@happykids.edu.gh",  color: "#d97706", bg: "#fffbeb" },
  { label: "Parent",            email: "parent.demo@happykids.edu.gh", color: "#6b7280", bg: "#f9fafb" },
  { label: "Student",           email: "student.demo@happykids.edu.gh",color: "#6b7280", bg: "#f9fafb" },
];

export default function Login() {
  const { login, setAuthView, logoutMessage, clearLogoutMessage } = useAuth();
  const { isMobile } = useWindowSize();

  const [email, setEmail]       = useState("headteacher@happykids.edu.gh");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (logoutMessage) { setSuccessMsg(logoutMessage); clearLogoutMessage(); }
  }, [logoutMessage, clearLogoutMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccessMsg("");
    if (!email.trim()) return setError("Please enter your email address.");
    if (!password)     return setError("Please enter your password.");
    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password, remember);
      setLoading(false);
      if (!result.success) setError(result.error || "Login failed.");
      else if (result.needs2fa) setAuthView("2fa");
    }, 500);
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%", padding: "10px 12px 10px 36px",
    border: `1.5px solid ${focused ? "#7c3aed" : "#e5e7eb"}`,
    boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
    borderRadius: 9, fontSize: 13, color: "#111827", background: "white",
    outline: "none", boxSizing: "border-box" as const, transition: "all 0.15s",
  });

  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused,   setPwdFocused]   = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Left branding panel — desktop only */}
      {!isMobile && (
        <div style={{
          width: "42%", flexShrink: 0,
          background: "linear-gradient(150deg, #3b0764 0%, #6d28d9 55%, #7c3aed 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px 44px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 52 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎓</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "white", letterSpacing: "-0.3px" }}>Maxibern SchoolOS</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Happy Kids Basic School · Accra</div>
            </div>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", margin: "0 0 14px", lineHeight: 1.25, letterSpacing: "-0.5px" }}>
            Empowering Ghana's Schools
          </h1>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px" }}>
            A complete school management platform built for KG to JHS 3 schools across Ghana.
          </p>

          {[
            { icon: "👥", label: "Student Management",    desc: "312 students enrolled · KG to JHS 3" },
            { icon: "💰", label: "Fee Collection",         desc: "GH₵ 148,000 collected this month" },
            { icon: "📊", label: "Reports & Analytics",    desc: "15+ report types, auto-generated" },
            { icon: "📱", label: "Parent Communication",   desc: "SMS, WhatsApp & Email alerts" },
          ].map((f) => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "white" }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{f.desc}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 36, padding: "14px 16px", background: "rgba(255,255,255,0.08)", borderRadius: 10, borderLeft: "3px solid rgba(255,255,255,0.25)" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: "0 0 6px", fontStyle: "italic", lineHeight: 1.6 }}>
              "Everything we need to run our school is now in one place. The system has transformed how we work."
            </p>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>— Mr. Emmanuel Mensah, Headteacher</p>
          </div>
        </div>
      )}

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px", background: "#f8fafc", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Maxibern SchoolOS</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Happy Kids Basic School</div>
              </div>
            </div>
          )}

          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.3px" }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 22px" }}>Sign in to your account to continue</p>

          {successMsg && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15 }}>✅</span>
              <span style={{ fontSize: 12.5, color: "#15803d", fontWeight: 500 }}>{successMsg}</span>
            </div>
          )}

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15 }}>⚠️</span>
              <span style={{ fontSize: 12.5, color: "#dc2626" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu.gh" autoComplete="email"
                  onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)}
                  style={inputStyle(emailFocused)} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Password</label>
                <button type="button" onClick={() => setAuthView("forgot-password")} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password"
                  onFocus={() => setPwdFocused(true)} onBlur={() => setPwdFocused(false)}
                  style={{ ...inputStyle(pwdFocused), paddingRight: 38 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 3 }}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, cursor: "pointer", accentColor: "#7c3aed" }} />
              <label htmlFor="remember" style={{ fontSize: 12.5, color: "#6b7280", cursor: "pointer", userSelect: "none" }}>Remember me for 7 days</label>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "11px 16px", border: "none", borderRadius: 9,
              background: loading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "white", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Signing in...</>
                : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Quick demo sign-in */}
          <div style={{ marginTop: 22, padding: 14, background: "white", borderRadius: 10, border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Quick Demo Sign-In</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {quickUsers.map((qu) => (
                <button key={qu.email} onClick={() => { setEmail(qu.email); setPassword("password123"); setError(""); }}
                  style={{
                    padding: "6px 8px", borderRadius: 7, border: `1.5px solid ${email === qu.email ? qu.color : "#e5e7eb"}`,
                    background: email === qu.email ? qu.bg : "white", cursor: "pointer",
                    fontSize: 11, fontWeight: 600, color: email === qu.email ? qu.color : "#6b7280",
                    transition: "all 0.1s",
                  }}>
                  {qu.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 9, textAlign: "center" }}>
              All accounts: password <code style={{ background: "#f3f4f6", padding: "1px 6px", borderRadius: 4, color: "#374151" }}>password123</code>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>New school? </span>
            <button onClick={() => setAuthView("register")} style={{ fontSize: 12.5, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
              Register your school →
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 18 }}>
            <Shield size={11} color="#9ca3af" />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Secured · Term 2, 2025/2026 · Ghana</span>
          </div>
        </div>
      </div>
    </div>
  );
}
