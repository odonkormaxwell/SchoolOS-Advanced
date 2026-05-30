import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  role: string;
  roleKey: string;
  email: string;
  password: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  phone: string;
  language: string;
  timezone: string;
  twoFAEnabled: boolean;
  avatar?: string;
};

export type AuthView = "login" | "register" | "forgot-password" | "2fa";

export type SecurityEvent = {
  id: string;
  type: string;
  description: string;
  device: string;
  ip: string;
  status: "success" | "failed";
  timestamp: string;
};

const INITIAL_USERS: AuthUser[] = [
  { id: "u0", name: "Daniel Asiedu",    role: "Super Admin",           roleKey: "super_admin",        email: "superadmin@edulex.io",           password: "password123", initials: "DA", avatarBg: "#e0e7ff", avatarColor: "#3730a3", phone: "+233 30 000 0001", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u1", name: "Emmanuel Mensah",  role: "Headteacher",           roleKey: "headteacher",        email: "headteacher@happykids.edu.gh",  password: "password123", initials: "EM", avatarBg: "#ede9fe", avatarColor: "#7c3aed", phone: "+233 24 456 7890", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u2", name: "Kofi Mensah",      role: "School Owner",          roleKey: "school_owner",       email: "admin@happykids.edu.gh",         password: "password123", initials: "KM", avatarBg: "#dbeafe", avatarColor: "#0369a1", phone: "+233 20 345 6789", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u3", name: "Ama Owusu",        role: "Teacher (Class)",       roleKey: "teacher",            email: "ama.owusu@happykids.edu.gh",    password: "password123", initials: "AO", avatarBg: "#fce7f3", avatarColor: "#9d174d", phone: "+233 26 234 5678", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u4", name: "Kwame Asante",     role: "Teacher (Subject)",     roleKey: "teacher",            email: "kwame.asante@happykids.edu.gh", password: "password123", initials: "KA", avatarBg: "#dcfce7", avatarColor: "#16a34a", phone: "+233 23 123 4567", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u5", name: "Yaw Boateng",      role: "Accountant",            roleKey: "accountant",         email: "accounts@happykids.edu.gh",     password: "password123", initials: "YB", avatarBg: "#f0fdf4", avatarColor: "#15803d", phone: "+233 27 987 6543", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u6", name: "Abena Nyarko",     role: "Admissions Officer",    roleKey: "admissions_officer", email: "admissions@happykids.edu.gh",   password: "password123", initials: "AN", avatarBg: "#fef3c7", avatarColor: "#d97706", phone: "+233 25 876 5432", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u7", name: "Grace Ofori",      role: "Parent",                roleKey: "parent",             email: "parent.demo@happykids.edu.gh",  password: "password123", initials: "GO", avatarBg: "#f3f4f6", avatarColor: "#6b7280", phone: "+233 24 765 4321", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
  { id: "u8", name: "Michael Ofori",    role: "Student",               roleKey: "student",            email: "student.demo@happykids.edu.gh", password: "password123", initials: "MO", avatarBg: "#fdf4ff", avatarColor: "#9333ea", phone: "", language: "English (UK)", timezone: "Africa/Accra", twoFAEnabled: false },
];

// Roles that trigger 2FA on login
const TWO_FA_ROLES = ["school_owner", "headteacher", "accountant"];
const INACTIVITY_MS = 30 * 60 * 1000;
const OTP_VALID_MS  = 10 * 60 * 1000;

function generateOtp() { return String(Math.floor(100000 + Math.random() * 900000)); }
function getDevice() {
  const ua = navigator.userAgent;
  const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : "Browser";
  return `${navigator.platform || "Web"} · ${browser}`;
}
function loadUsers(): AuthUser[] { try { const s = localStorage.getItem("schoolos_users"); return s ? JSON.parse(s) : INITIAL_USERS; } catch { return INITIAL_USERS; } }
function saveUsers(u: AuthUser[]) { try { localStorage.setItem("schoolos_users", JSON.stringify(u)); } catch {} }
function loadLog(): SecurityEvent[] { try { const s = localStorage.getItem("schoolos_log"); return s ? JSON.parse(s) : []; } catch { return []; } }
function saveLog(l: SecurityEvent[]) { try { localStorage.setItem("schoolos_log", JSON.stringify(l.slice(0, 200))); } catch {} }

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  login: (email: string, password: string, remember: boolean) => { success: boolean; error?: string; needs2fa?: boolean };
  logout: (msg?: string) => void;
  verify2fa: (otp: string) => { success: boolean; error?: string };
  resend2fa: () => void;
  currentOtp: string;
  otpExpiry: number;
  otp2faAttempts: number;
  pendingEmail: string;
  updateProfile: (updates: Partial<AuthUser>) => void;
  changePassword: (current: string, newPwd: string) => { success: boolean; error?: string };
  toggle2fa: (enable: boolean) => void;
  activityLog: SecurityEvent[];
  logoutMessage: string;
  clearLogoutMessage: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers]             = useState<AuthUser[]>(loadUsers);
  const [user, setUser]               = useState<AuthUser | null>(null);
  const [authView, setAuthView]       = useState<AuthView>("login");
  const [activityLog, setActivityLog] = useState<SecurityEvent[]>(loadLog);
  const [logoutMessage, setLogoutMessage] = useState("");

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail]   = useState("");
  const [currentOtp, setCurrentOtp]       = useState("");
  const [otpCreatedAt, setOtpCreatedAt]   = useState(0);
  const [otpExpiry, setOtpExpiry]         = useState(600);
  const [otp2faAttempts, setOtp2faAttempts] = useState(0);

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const otpInterval     = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("schoolos_session") || sessionStorage.getItem("schoolos_session");
      if (!raw) return;
      const { userId, timestamp, remember } = JSON.parse(raw);
      const maxAge = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > maxAge) { localStorage.removeItem("schoolos_session"); sessionStorage.removeItem("schoolos_session"); return; }
      const found = loadUsers().find((u) => u.id === userId);
      if (found) setUser(found);
    } catch {}
  }, []);

  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => { saveLog(activityLog); }, [activityLog]);

  const addLog = useCallback((type: string, description: string, status: "success" | "failed") => {
    const ev: SecurityEvent = { id: Date.now().toString(), type, description, device: getDevice(), ip: "197.255.xxx.xxx", status, timestamp: new Date().toISOString() };
    setActivityLog((prev) => [ev, ...prev].slice(0, 200));
  }, []);

  const resetInactivity = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setUser(null);
      localStorage.removeItem("schoolos_session");
      sessionStorage.removeItem("schoolos_session");
      setAuthView("login");
      setLogoutMessage("You were automatically logged out due to inactivity.");
    }, INACTIVITY_MS);
  }, []);

  useEffect(() => {
    if (!user) { if (inactivityTimer.current) clearTimeout(inactivityTimer.current); return; }
    const evts = ["mousedown", "keydown", "touchstart", "scroll"];
    evts.forEach((e) => document.addEventListener(e, resetInactivity, { passive: true }));
    resetInactivity();
    return () => {
      evts.forEach((e) => document.removeEventListener(e, resetInactivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, resetInactivity]);

  useEffect(() => {
    if (!currentOtp) { if (otpInterval.current) clearInterval(otpInterval.current); return; }
    otpInterval.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((OTP_VALID_MS - (Date.now() - otpCreatedAt)) / 1000));
      setOtpExpiry(remaining);
      if (remaining === 0 && otpInterval.current) clearInterval(otpInterval.current);
    }, 1000);
    return () => { if (otpInterval.current) clearInterval(otpInterval.current); };
  }, [currentOtp, otpCreatedAt]);

  const login = useCallback((email: string, password: string, remember: boolean) => {
    const recent = activityLog.filter((e) => e.type === "failed_login" && Date.now() - new Date(e.timestamp).getTime() < 15 * 60 * 1000).length;
    if (recent >= 5) return { success: false, error: "Account temporarily locked. Too many failed attempts. Try again in 15 minutes." };

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) { addLog("failed_login", `Failed login for ${email}`, "failed"); return { success: false, error: "No account found with that email address." }; }
    if (found.password !== password) { addLog("failed_login", `Failed login for ${email}`, "failed"); return { success: false, error: "Incorrect password. Please try again." }; }

    if (TWO_FA_ROLES.includes(found.roleKey)) {
      const otp = generateOtp();
      setPendingUserId(found.id);
      setPendingEmail(found.email);
      setCurrentOtp(otp);
      setOtpCreatedAt(Date.now());
      setOtpExpiry(600);
      setOtp2faAttempts(0);
      sessionStorage.setItem("schoolos_pending_remember", String(remember));
      return { success: true, needs2fa: true };
    }

    setUser(found);
    const sess = JSON.stringify({ userId: found.id, timestamp: Date.now(), remember });
    if (remember) localStorage.setItem("schoolos_session", sess); else sessionStorage.setItem("schoolos_session", sess);
    addLog("login", `Signed in — ${found.name} (${found.role})`, "success");
    return { success: true };
  }, [users, activityLog, addLog]);

  const logout = useCallback((msg = "You have logged out successfully.") => {
    if (user) addLog("logout", `Signed out — ${user.name}`, "success");
    setUser(null);
    setPendingUserId(null);
    setPendingEmail("");
    setCurrentOtp("");
    localStorage.removeItem("schoolos_session");
    sessionStorage.removeItem("schoolos_session");
    sessionStorage.removeItem("schoolos_pending_remember");
    setAuthView("login");
    setLogoutMessage(msg);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  }, [user, addLog]);

  const verify2fa = useCallback((otp: string) => {
    if (otp2faAttempts >= 5) return { success: false, error: "Too many attempts. Please log in again." };
    if (Date.now() - otpCreatedAt > OTP_VALID_MS) return { success: false, error: "OTP has expired. Please request a new one." };
    if (otp !== currentOtp) {
      const left = 4 - otp2faAttempts;
      setOtp2faAttempts((n) => n + 1);
      addLog("failed_login", "Failed 2FA OTP attempt", "failed");
      return { success: false, error: `Incorrect code. ${left} attempt${left !== 1 ? "s" : ""} remaining.` };
    }
    const found = users.find((u) => u.id === pendingUserId);
    if (!found) return { success: false, error: "Session expired. Please log in again." };
    setUser(found);
    const remember = sessionStorage.getItem("schoolos_pending_remember") === "true";
    const sess = JSON.stringify({ userId: found.id, timestamp: Date.now(), remember });
    if (remember) localStorage.setItem("schoolos_session", sess); else sessionStorage.setItem("schoolos_session", sess);
    addLog("login", `Signed in via 2FA — ${found.name}`, "success");
    setPendingUserId(null);
    setCurrentOtp("");
    return { success: true };
  }, [otp2faAttempts, otpCreatedAt, currentOtp, pendingUserId, users, addLog]);

  const resend2fa = useCallback(() => {
    const otp = generateOtp();
    setCurrentOtp(otp);
    setOtpCreatedAt(Date.now());
    setOtpExpiry(600);
    setOtp2faAttempts(0);
  }, []);

  const updateProfile = useCallback((updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setUsers((prev) => prev.map((u) => u.id === user.id ? updated : u));
  }, [user]);

  const changePassword = useCallback((current: string, newPwd: string) => {
    if (!user) return { success: false, error: "Not authenticated." };
    if (current !== user.password) return { success: false, error: "Current password is incorrect." };
    if (newPwd.length < 8)          return { success: false, error: "Password must be at least 8 characters." };
    if (!/[A-Z]/.test(newPwd))      return { success: false, error: "Must contain at least one uppercase letter." };
    if (!/[a-z]/.test(newPwd))      return { success: false, error: "Must contain at least one lowercase letter." };
    if (!/[0-9]/.test(newPwd))      return { success: false, error: "Must contain at least one number." };
    if (!/[^A-Za-z0-9]/.test(newPwd)) return { success: false, error: "Must contain at least one special character (!@#$...)." };
    updateProfile({ password: newPwd });
    addLog("password_change", "Password changed successfully", "success");
    return { success: true };
  }, [user, updateProfile, addLog]);

  const toggle2fa = useCallback((enable: boolean) => {
    updateProfile({ twoFAEnabled: enable });
    addLog(enable ? "2fa_enabled" : "2fa_disabled", `Two-factor authentication ${enable ? "enabled" : "disabled"}`, "success");
  }, [updateProfile, addLog]);

  const clearLogoutMessage = useCallback(() => setLogoutMessage(""), []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, authView, setAuthView,
      login, logout, verify2fa, resend2fa, currentOtp, otpExpiry, otp2faAttempts, pendingEmail,
      updateProfile, changePassword, toggle2fa,
      activityLog, logoutMessage, clearLogoutMessage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
