import React, { useContext, useState } from "react";
import { nanoid } from "nanoid";
import { Toast, SubComponentVariant } from "component";
import { useStatefulTimeouts } from "hook";

export type ToastProps = {
  id: string;
  variant?: SubComponentVariant;
  timeoutDuration?: number;
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

  const { startTimer } = useStatefulTimeouts({
    onTimerEnd: (id: string) => {
      setToasts([...toasts.filter((t) => t.id !== id)]);
    },
  });

  const addToast = (newToast: ToastInput) => {
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
