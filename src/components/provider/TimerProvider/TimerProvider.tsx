import { nanoid } from "nanoid";
import React, { useContext, useState } from "react";
import {
  StartTimerParams,
  Timer,
  TimerContextState,
} from "./TimerProvider.type";

/**
 * Initial state for context.
 */
const initialTimers: TimerContextState = {
  startTimer: () => ({} as unknown as Timer),
  clearTimer: () => undefined,
  pauseTimer: () => undefined,
};

/**
 * The context.
 */
const TimerContext = React.createContext(initialTimers);

/**
 * Custom hook for component to use for reaching into this context throughout app.
 */
export const useTimers = () => {
  return useContext(TimerContext);
};

/**
 * Provider component to spread the context into the App.
 * @param param0
 * @returns
 */
export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [timers, setTimers] = useState<Timer[]>([]);

  console.log({ timers });

  const startTimer = ({
    timerName,
    callback,
    duration = 5000,
  }: StartTimerParams) => {
    const id = nanoid();

    // TODO really create subscription
    const eventName = `${timerName || id}-timer`;
    // publish 'start' event?
    const newTimer = {
      id,
      duration,
      isActive: true, // keep false until 'start' even is published?
      event: {
        eventName,
        listener: callback,
      },
    };

    setTimeout(() => {
      console.log("timeout elapsed", { timerName, id, eventName });
    }, duration);

    setTimers([...timers, newTimer]);
    return newTimer;
  };

  const clearTimer = (id: string) => {
    // TODO: publish a "stopTimer" event
    // TODO: unsubscribe to event
    // any other cleanup
    setTimers([...timers.filter((timer) => timer.id !== id)]);
  };

  const pauseTimer = (id: string) => {
    const remaining = 4500;

    const thisTimer = timers.find((t) => t.id === id);
    if (!thisTimer) {
      return;
    }

    thisTimer.isActive = false;
    // TODO: calculate remaining time
    // TODO publish 'pause' event

    setTimers([...timers.filter((t) => t.id !== id), thisTimer]);
    return { id, remaining };
  };

  return (
    <TimerContext.Provider value={{ startTimer, clearTimer, pauseTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
