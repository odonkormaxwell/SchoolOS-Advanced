import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Building2, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";

function Field({ label, icon, type = "text", value, onChange, placeholder, readOnly }: {
  label: string; icon: React.ReactNode; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string; readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none", display: "flex" }}>{icon}</div>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "10px 12px 10px 36px",
            border: `1.5px solid ${focused ? "#7c3aed" : "#e5e7eb"}`,
            boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
            borderRadius: 9, fontSize: 13, color: "#111827", background: readOnly ? "#f9fafb" : "white",
            outline: "none", boxSizing: "border-box" as const,
          }} />
      </div>
    </div>
  );
}

export default function Register() {
  const { setAuthView } = useAuth();
  const { isMobile } = useWindowSize();

  const [schoolName,   setSchoolName]   = useState("");
  const [contactName,  setContactName]  = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPwd,      setShowPwd]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [done,         setDone]         = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!schoolName.trim()) return setError("Please enter your school name.");
    if (!contactName.trim()) return setError("Please enter a contact person name.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email address.");
    if (!phone.trim()) return setError("Please enter a phone number.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1200);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 20, fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 20px" }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>Registration Submitted!</h2>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 24px", lineHeight: 1.6 }}>
            Your school account for <strong>{schoolName}</strong> has been submitted for review. You'll receive an email at <strong>{email}</strong> within 24 hours with your login credentials.
          </p>
          <button onClick={() => setAuthView("login")} style={{ padding: "10px 24px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Maxibern SchoolOS</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>School Registration</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, padding: isMobile ? "22px 18px" : "30px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Register Your School</h2>
          <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 22px" }}>Set up your school account on Maxibern SchoolOS</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#dc2626" }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <Field label="School Name" icon={<Building2 size={14} />} value={schoolName} onChange={setSchoolName} placeholder="e.g. Happy Kids Basic School" />
            <Field label="Contact Person Name" icon={<User size={14} />} value={contactName} onChange={setContactName} placeholder="e.g. Emmanuel Mensah" />

            <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Email Address" icon={<Mail size={14} />} type="email" value={email} onChange={setEmail} placeholder="admin@school.edu.gh" />
              <Field label="Phone Number" icon={<Phone size={14} />} type="tel" value={phone} onChange={setPhone} placeholder="+233 24 000 0000" />
            </div>

            {[
              { label: "Password", val: password, set: setPassword },
              { label: "Confirm Password", val: confirm,  set: setConfirm },
            ].map(({ label, val, set }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
                <div style={{ position: "relative" }}>
                  <Lock size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                  <input type={showPwd ? "text" : "password"} value={val} onChange={(e) => set(e.target.value)} placeholder="Min. 8 characters"
                    style={{ width: "100%", padding: "10px 36px 10px 36px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13, color: "#111827", background: "white", outline: "none", boxSizing: "border-box" as const }} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}

            <div style={{ background: "#f5f3ff", borderRadius: 8, padding: "10px 12px", marginBottom: 18, fontSize: 11.5, color: "#7c3aed", lineHeight: 1.6 }}>
              ℹ️ Only school administrators can register. Students, parents, and staff accounts are created by the school administrator.
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "11px", border: "none", borderRadius: 9,
              background: loading ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "white", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Registering...</> : "Register School"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={() => setAuthView("login")} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              <ArrowLeft size={13} /> Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
