import { useEffect } from "react";
import { CheckCircle, Info, AlertCircle, XCircle, X } from "lucide-react";
import { ToastType } from "../context/AppContext";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const config = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", Icon: CheckCircle },
  info:    { bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb", Icon: Info },
  warning: { bg: "#fffbeb", border: "#fde68a", color: "#d97706", Icon: AlertCircle },
  error:   { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", Icon: XCircle },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const { bg, border, color, Icon } = config[type];

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 68,
      right: 20,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      borderRadius: 10,
      background: bg,
      border: `1px solid ${border}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      fontSize: 13,
      fontWeight: 600,
      color,
      zIndex: 9999,
      maxWidth: 340,
      animation: "slideIn 0.25s ease",
    }}>
      <Icon size={16} />
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color, opacity: 0.6, display: "flex", padding: 0 }}>
        <X size={14} />
      </button>
    </div>
  );
}
