import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const triggerToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  };

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      
      {/* --- GLOBAL DYNAMIC SLIDE-IN TOASTS ALERTS --- */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-2.5 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl glass-panel shadow-2xl border flex items-center gap-3 transition-all duration-300 animate-fade-in-up ${
              toast.type === "info"
                ? "border-blue-200/50 bg-blue-50/90 text-blue-900"
                : toast.type === "ai"
                  ? "border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 text-orange-950"
                  : "border-emerald-200/50 bg-emerald-50/90 text-emerald-950"
            }`}
          >
            <span className="text-xl shrink-0">
              {toast.type === "info" ? "ℹ️" : toast.type === "ai" ? "✨" : "✓"}
            </span>
            <p className="text-xs font-semibold leading-relaxed">
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
