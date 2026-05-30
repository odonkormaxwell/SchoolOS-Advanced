import { useState, useEffect, useRef } from "react";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TwoFactor() {
  const { verify2fa, resend2fa, currentOtp, otpExpiry, otp2faAttempts, pendingEmail, setAuthView } = useAuth();

  const [digits, setDigits]     = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend]     = useState(false);
  const [showHint, setShowHint]       = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError("");
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((d, i) => { if (i < 6) next[i] = d; });
    setDigits(next);
    const nextEmpty = next.findIndex((d) => !d);
    inputRefs.current[nextEmpty >= 0 ? nextEmpty : 5]?.focus();
  };

  const handleVerify = () => {
    const otp = digits.join("");
    if (otp.length < 6) return setError("Please enter all 6 digits.");
    setLoading(true);
    setError("");
    setTimeout(() => {
      const result = verify2fa(otp);
      setLoading(false);
      if (!result.success) {
        setError(result.error || "Verification failed.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        if (otp2faAttempts >= 4) setTimeout(() => setAuthView("login"), 2000);
      }
    }, 600);
  };

  const handleResend = () => {
    resend2fa();
    setResendTimer(60);
    setCanResend(false);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  const maskedEmail = pendingEmail.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.max(b.length, 3)) + c);
  const minutes = Math.floor(otpExpiry / 60);
  const seconds = otpExpiry % 60;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Maxibern SchoolOS</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Two-Factor Authentication</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, padding: "30px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={26} color="white" />
            </div>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 6px", textAlign: "center" }}>Verification Required</h2>
          <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 8px", textAlign: "center", lineHeight: 1.6 }}>
            A 6-digit code was sent to
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 22px", textAlign: "center" }}>{maskedEmail}</p>

          {/* Demo OTP hint */}
          {showHint && currentOtp && (
            <div style={{ background: "#fefce8", border: "1px solid #fef08a", borderRadius: 9, padding: "10px 12px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#a16207", marginBottom: 2 }}>DEMO MODE — Your OTP:</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#92400e", letterSpacing: 4, fontFamily: "monospace" }}>{currentOtp}</div>
              </div>
              <button onClick={() => setShowHint(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a16207", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
            </div>
          )}

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#dc2626", textAlign: "center" }}>
              ⚠️ {error}
            </div>
          )}

          {/* OTP digit inputs */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 22 }} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input key={i} ref={(el) => { inputRefs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 46, height: 52, textAlign: "center", fontSize: 22, fontWeight: 800,
                  border: `2px solid ${d ? "#7c3aed" : "#e5e7eb"}`,
                  borderRadius: 10, outline: "none", color: "#111827",
                  background: d ? "#faf5ff" : "white",
                  boxShadow: d ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                  transition: "all 0.1s",
                }} />
            ))}
          </div>

          <button onClick={handleVerify} disabled={loading || digits.join("").length < 6}
            style={{
              width: "100%", padding: "11px", border: "none", borderRadius: 9,
              background: digits.join("").length < 6 || loading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "white", fontSize: 14, fontWeight: 700,
              cursor: digits.join("").length < 6 || loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16,
            }}>
            {loading
              ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Verifying...</>
              : "Verify Code"}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
            <span style={{ color: "#9ca3af" }}>
              {otpExpiry > 0 ? `Expires in ${minutes}:${String(seconds).padStart(2, "0")}` : "Code expired"}
            </span>
            <button onClick={handleResend} disabled={!canResend}
              style={{ display: "flex", alignItems: "center", gap: 4, color: canResend ? "#7c3aed" : "#9ca3af", background: "none", border: "none", cursor: canResend ? "pointer" : "default", fontWeight: 600, fontSize: 12.5 }}>
              <RefreshCw size={12} />
              {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
            <button onClick={() => setAuthView("login")} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
