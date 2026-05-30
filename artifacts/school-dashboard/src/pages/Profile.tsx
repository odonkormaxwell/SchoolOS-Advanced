import { useState, useRef } from "react";
import { Camera, Save, X, User, Phone, Globe, Clock, Mail, Shield, Building2, Edit3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

const LANGUAGES = ["English (UK)", "English (US)", "French", "Twi", "Hausa", "Ga"];
const TIMEZONES  = ["Africa/Accra", "Africa/Lagos", "Africa/Nairobi", "Europe/London", "America/New_York"];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useApp();
  const { isMobile } = useWindowSize();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing]   = useState(false);
  const [name,    setName]      = useState(user?.name || "");
  const [phone,   setPhone]     = useState(user?.phone || "");
  const [lang,    setLang]      = useState(user?.language || "English (UK)");
  const [tz,      setTz]        = useState(user?.timezone || "Africa/Accra");
  const [avatar,  setAvatar]    = useState(user?.avatar || "");
  const [saving,  setSaving]    = useState(false);

  if (!user) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast("Image must be under 2MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return showToast("Name cannot be empty", "error");
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: name.trim(), phone, language: lang, timezone: tz, avatar });
      setSaving(false);
      setEditing(false);
      showToast("Profile updated successfully!", "success");
    }, 600);
  };

  const handleCancel = () => {
    setName(user.name);
    setPhone(user.phone);
    setLang(user.language);
    setTz(user.timezone);
    setAvatar(user.avatar || "");
    setEditing(false);
  };

  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" };
  const valueStyle: React.CSSProperties = { fontSize: 13.5, color: "#111827", fontWeight: 500 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "white", outline: "none", boxSizing: "border-box" };
  const readOnlyStyle: React.CSSProperties = { ...inputStyle, background: "#f9fafb", color: "#6b7280", cursor: "not-allowed" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>My Profile</h1>
          {!isMobile && <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Manage your personal information and preferences</p>}
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Edit3 size={13} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleCancel} style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>
              <X size={13} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", border: "none", borderRadius: 8, background: saving ? "#a78bfa" : "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: saving ? "not-allowed" : "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
              {saving ? <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : <Save size={13} />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "240px 1fr", gap: 16, alignItems: "start" }}>
        {/* Avatar card */}
        <div style={{ background: "white", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
            {avatar
              ? <img src={avatar} alt="Avatar" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #ede9fe" }} />
              : <div style={{ width: 90, height: 90, borderRadius: "50%", background: user.avatarBg, color: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, border: "3px solid #ede9fe", margin: "0 auto" }}>{user.initials}</div>
            }
            {editing && (
              <button onClick={() => fileRef.current?.click()}
                style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: "#7c3aed", border: "2px solid white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={13} color="white" />
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />

          <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, marginBottom: 12 }}>{user.role}</div>
          <div style={{ padding: "6px 12px", borderRadius: 20, background: "#f5f3ff", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Shield size={11} color="#7c3aed" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed" }}>Active Account</span>
          </div>

          {editing && (
            <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 12, lineHeight: 1.6 }}>
              Click the camera icon to upload a photo. Max 2MB, JPG or PNG.
            </p>
          )}
        </div>

        {/* Info card */}
        <div style={{ background: "white", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>Personal Information</div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px 20px" }}>
            {/* Full Name (editable) */}
            <div>
              <label style={labelStyle}><User size={10} style={{ display: "inline", marginRight: 4 }} />Full Name</label>
              {editing
                ? <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                : <div style={valueStyle}>{user.name}</div>}
            </div>

            {/* Email (read-only) */}
            <div>
              <label style={labelStyle}><Mail size={10} style={{ display: "inline", marginRight: 4 }} />Email Address <span style={{ color: "#9ca3af", fontSize: 10, fontWeight: 400, textTransform: "none" }}>(read-only)</span></label>
              {editing
                ? <input value={user.email} readOnly style={readOnlyStyle} />
                : <div style={valueStyle}>{user.email}</div>}
            </div>

            {/* Phone (editable) */}
            <div>
              <label style={labelStyle}><Phone size={10} style={{ display: "inline", marginRight: 4 }} />Phone Number</label>
              {editing
                ? <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 24 000 0000" style={inputStyle} />
                : <div style={valueStyle}>{user.phone || <span style={{ color: "#9ca3af" }}>Not set</span>}</div>}
            </div>

            {/* Role (read-only) */}
            <div>
              <label style={labelStyle}><Shield size={10} style={{ display: "inline", marginRight: 4 }} />Role <span style={{ color: "#9ca3af", fontSize: 10, fontWeight: 400, textTransform: "none" }}>(read-only)</span></label>
              {editing
                ? <input value={user.role} readOnly style={readOnlyStyle} />
                : <div style={valueStyle}>{user.role}</div>}
            </div>

            {/* School (read-only) */}
            <div>
              <label style={labelStyle}><Building2 size={10} style={{ display: "inline", marginRight: 4 }} />School <span style={{ color: "#9ca3af", fontSize: 10, fontWeight: 400, textTransform: "none" }}>(read-only)</span></label>
              {editing
                ? <input value="Happy Kids Basic School" readOnly style={readOnlyStyle} />
                : <div style={valueStyle}>Happy Kids Basic School</div>}
            </div>

            {/* Language (editable) */}
            <div>
              <label style={labelStyle}><Globe size={10} style={{ display: "inline", marginRight: 4 }} />Preferred Language</label>
              {editing
                ? <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                  </select>
                : <div style={valueStyle}>{user.language}</div>}
            </div>

            {/* Timezone (editable) */}
            <div>
              <label style={labelStyle}><Clock size={10} style={{ display: "inline", marginRight: 4 }} />Time Zone</label>
              {editing
                ? <select value={tz} onChange={(e) => setTz(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                : <div style={valueStyle}>{user.timezone}</div>}
            </div>
          </div>

          {editing && (
            <div style={{ marginTop: 20, padding: "10px 14px", background: "#f5f3ff", borderRadius: 9, fontSize: 12, color: "#7c3aed" }}>
              ℹ️ Email, role, and school name can only be changed by your system administrator.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
