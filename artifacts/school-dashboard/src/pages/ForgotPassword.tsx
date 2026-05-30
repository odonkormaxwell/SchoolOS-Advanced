import { useState } from "react";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { setAuthView } = useAuth();
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email address.");
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Maxibern SchoolOS</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Password Recovery</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, padding: "30px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          {!done ? (
            <>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <KeyRound size={24} color="#7c3aed" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Forgot your password?</h2>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 22px", lineHeight: 1.6 }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#dc2626" }}>⚠️ {error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@school.edu.gh"
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      style={{
                        width: "100%", padding: "10px 12px 10px 36px",
                        border: `1.5px solid ${focused ? "#7c3aed" : "#e5e7eb"}`,
                        boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                        borderRadius: 9, fontSize: 13, color: "#111827", background: "white",
                        outline: "none", boxSizing: "border-box" as const,
                      }} />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: "11px", border: "none", borderRadius: 9,
                  background: loading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "white", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Sending...</> : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px" }}>📧</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>Check your email</h2>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 6 }}>
                If an account exists for <strong>{email}</strong>, we have sent a password reset link to that address.
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 24 }}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button onClick={() => setDone(false)} style={{ padding: "8px 20px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer", marginRight: 10 }}>
                Try Again
              </button>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setAuthView("login")} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
