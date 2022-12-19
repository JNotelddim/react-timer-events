import React, { useContext, useState } from "react";
import { nanoid } from "nanoid";
import { Toast, SubComponentVariant } from "component";
import { useStatefulTimeouts } from "hook";
import { useCallback } from "react";

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

  console.log({ toasts });

  const handleTimerEnd = useCallback(
    (id: string) => {
      setToasts([...toasts.filter((t) => t.id !== id)]);
    },
    [toasts, setToasts]
  );

  // const handleTimerPause = useCallback(
  //   (id: string) => {
  //     const toast = toasts.find((t) => t.id === id);
  //     console.log("onPauseToast", toast);
  //     if (!toast) {
  //       return;
  //     }

  //     const updatedToasts = [
  //       ...toasts.filter((t) => t.id !== id),
  //       { ...toast, isPaused: true },
  //     ];
  //     // __ BUG __ : this updatedToasts value isn't being applied to state??
  //     console.log("setToasts", updatedToasts);
  //     setToasts(updatedToasts);
  //   },
  //   [toasts, setToasts]
  // );

  const { startTimer, pauseAll } = useStatefulTimeouts({
    onTimerEnd: handleTimerEnd,
    // onTimerPause: handleTimerPause,
  });

  const addToast = (newToast: ToastInput) => {
    pauseAll();
    const newToastId = nanoid();
    // console.log("addtoast", { ...newToast, id: newToastId });
    setToasts([...toasts, { ...newToast, id: newToastId }]);
    // console.log("startTimer", newToastId);
    startTimer(newToastId);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}

      <div id="toast-area" className="flex gap-4 p-4 flex-wrap">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            isPaused={toast.isPaused}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
