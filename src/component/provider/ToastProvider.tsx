import React, { useContext, useState } from "react";
import { nanoid } from "nanoid";
import { Toast, SubComponentVariant } from "component";
import { useStatefulTimeouts } from "hook";

export type ToastProps = {
  id: string;
  variant?: SubComponentVariant;
  timeoutDuration?: number;
  isPaused?: boolean;
};

export type ToastInput = Omit<ToastProps, "id">;

export interface ToastProviderState {
  toasts: ToastProps[];
  addToast: (toast: ToastInput) => void;
  emptyToasts?: () => void;
  removeToast?: (toast: ToastProps) => void;
}

export const initialState: ToastProviderState = {
  toasts: [],
  addToast: () => undefined,
};

const ToastContext = React.createContext(initialState);

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const { startTimer, pauseAll } = useStatefulTimeouts({
    onTimerEnd: (id: string) => {
      setToasts([...toasts.filter((t) => t.id !== id)]);
    },
    onTimerPause: (id: string) => {
      const toast = toasts.find((t) => t.id === id);
      if (!toast) {
        return;
      }

      setToasts([
        ...toasts.filter((t) => t.id !== id),
        { ...toast, isPaused: true },
      ]);
    },
  });

  const addToast = (newToast: ToastInput) => {
    pauseAll();
    const newToastId = nanoid();
    setToasts([...toasts, { ...newToast, id: newToastId }]);
    startTimer(newToastId);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}

      <div id="toast-area" className="flex gap-4 p-4 flex-wrap">
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
