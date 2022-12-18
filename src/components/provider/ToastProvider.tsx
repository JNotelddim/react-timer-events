import React, { useContext, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { SubComponentVariant } from "../SubComponent";
import { Toast } from "../Toast";
import { useTimers } from "./TimerProvider";

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
  //   const { startTimer /*pauseTimer, clearTimer*/ } = useTimers();
  const [timerEvents, setTimerEvents] = useState<
    CustomEventInit<{ id: string }>[]
  >([]);

  console.log({ toasts, timerEvents });

  useEffect(() => {
    if (timerEvents && timerEvents.length) {
      console.log("useEffect from state event list updating");
      const newEvent = timerEvents[timerEvents.length - 1];
      const toastId = newEvent.detail?.id;
      console.log({ newEvent, toastId });
      setToasts([...toasts.filter((t) => t.id !== toastId)]);
      setTimerEvents([
        ...timerEvents.filter((t) => t?.detail?.id !== newEvent?.detail?.id),
      ]);
    }
  }, [timerEvents, toasts]);

  const addToast = (newToast: ToastInput) => {
    const newToastId = nanoid();
    setToasts([...toasts, { ...newToast, id: newToastId }]);

    const timerEndEventName = `timer-${newToastId}-end`;
    document.addEventListener(
      timerEndEventName,
      (endEvent: CustomEventInit<{ id: string }>) => {
        console.log("end event subscriber", endEvent);
        // How to push to state array without using a ref to get most up-to-date state??
        // I think it's impossible...
        setTimerEvents([...timerEvents, endEvent]);
      }
    );

    console.log("starting timeout", newToastId);
    setTimeout(() => {
      console.log("timeout ended, publishing event", timerEndEventName);
      const endEvent = new CustomEvent(timerEndEventName, {
        detail: { id: newToastId },
      });
      document.dispatchEvent(endEvent);
    }, 5000);

    // set up event for "toast-{id}-timer-end"
    // setTimeout, () => { publishEvent(^) }, <duration>

    // setSubscriptions([...subscriptions, "toast-id-timer-end"])

    // useEffect(() => { }, [subscriptions])

    // ... nope.. that will still have the same problem with the state being out of sync.

    // startTimer({
    //   timerName: `${counter++}-${newToast.variant}`,
    //   // so this callback is going to have all the same out-of-sync state closure problems as with the regular setTimeout...
    //   callback: () => {
    //     clearToast(newToastId);
    //   },
    // });
  };

  const clearToast = (id: string) => {
    setToasts([...toasts.filter((t) => t.id !== id)]);
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
