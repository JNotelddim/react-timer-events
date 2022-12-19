import { useEffect, useState } from "react";

export interface Timer {
  id: string;
  remaining: number;
  startTime: number;
  timeout: NodeJS.Timeout;
  isPaused?: boolean;
}

const DEFAULT_TIMEOUT = 5000;

/**
 * useStatefulTimeout, allows you to have stateful callbacks with timeouts.
 *
 * Normally, the callback you pass to a `setTimeout` will be out-of-sync
 * with component state once it's called, because it's a separate closure.
 */
export const useStatefulTimeouts = ({
  onTimerEnd,
  onTimerPause,
}: {
  onTimerEnd: (id: string) => void;
  onTimerPause?: (id: string) => void;
}) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [timerEvents, setTimerEvents] = useState<
    { id: string; type: "end" | "pause" }[]
  >([]);

  useEffect(() => {
    // TODO: check that the event was an 'end' event?
    if (timerEvents && timerEvents.length) {
      const newEvent = timerEvents[timerEvents.length - 1];

      if (newEvent.type === "end") {
        onTimerEnd(newEvent.id);
        // TODO: resume -- but this should be part of ^ callback , but it can't be because that'd be circular...
        resumeTop();
      }

      // Clear out this event so it's not retriggered
      setTimerEvents([...timerEvents.filter((t) => t?.id !== newEvent?.id)]);

      // Clear out this timer so it's not tracked anymore
      const tempTimers = [...timers.filter((t) => t.id !== newEvent.id)];
      setTimers(tempTimers);
    }
  }, [timerEvents, onTimerEnd, timers]);

  const startTimer = (id: string, duration?: number) => {
    setTimers([
      ...timers,
      {
        id,
        isPaused: true,
        remaining: duration || DEFAULT_TIMEOUT,
        startTime: Date.now(),
        timeout: setTimeout(() => {
          setTimerEvents([...timerEvents, { id, type: "end" }]);
        }, duration || DEFAULT_TIMEOUT),
      },
    ]);
  };

  const resumeTop = () => {
    if (timers.length <= 0) {
      return;
    }

    console.log("todo, resume top");

    // TODO: resume top timer
    // const newTop =
  };

  const pauseTimer = (id: string) => {
    const timer = timers.find((t) => t.id);
    if (!timer) {
      return;
    }

    const tmpTimer = { ...timer };
    tmpTimer.isPaused = true;
    tmpTimer.remaining -= Date.now() - timer.startTime;
    clearTimeout(timer.timeout);

    // TODO: read onPause later
    // onTimerPause?.(id);
    setTimers({ ...timers, [id]: timer });
  };

  /* Pause all of the timers */
  const pauseAll = () => {
    // console.log(`pausing all ${Object.keys(timers).join(", ")}`);
    for (const id of Object.keys(timers)) {
      pauseTimer(id);
    }
  };

  return { startTimer, pauseTimer, pauseAll };
};
