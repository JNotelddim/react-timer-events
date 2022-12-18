import React, { useContext, useState } from "react";
import { nanoid } from "nanoid";
import { Toast, SubComponentVariant } from "component";
import { useTimerEvents } from "hook";

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

  const handleTimerEnd = (detail?: { id: string }) => {
    setToasts([...toasts.filter((t) => t.id !== detail?.id)]);
  };
  const { addTimerEvent, publishEndEvent } = useTimerEvents({
    onEvent: handleTimerEnd,
  });

  const addToast = (newToast: ToastInput) => {
    const newToastId = nanoid();
    setToasts([...toasts, { ...newToast, id: newToastId }]);

    const timerEndEventName = `timer-${newToastId}-end`;
    addTimerEvent(timerEndEventName);

    setTimeout(() => {
      publishEndEvent(timerEndEventName, { id: newToastId });
    }, 5000);
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
