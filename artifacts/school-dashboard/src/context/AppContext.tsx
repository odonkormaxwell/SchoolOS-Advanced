import { createContext, useContext } from "react";

export type ToastType = "success" | "info" | "error" | "warning";

interface AppContextType {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export const AppContext = createContext<AppContextType>({
  onNavigate: () => {},
  showToast: () => {},
});

export const useApp = () => useContext(AppContext);
