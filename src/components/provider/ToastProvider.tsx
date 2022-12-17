import React, { useContext, useState } from "react";
import { nanoid } from "nanoid";
import { SubComponentVariant } from "../SubComponent";
import { Toast } from "../Toast";

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

  const addToast = (newToast: ToastInput) => {
    // TODO: handle timeouts and auto-removal
    setToasts([...toasts, { ...newToast, id: nanoid() }]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}

      <div id="toast-area" className="flex gap-4 p-4 flex-wrap">
        {toasts.map((toast) => (
          <Toast variant={toast.variant} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
