import { useEffect, useState } from "react";

export interface Timer {
  timeout: NodeJS.Timeout;
  isPaused?: boolean;
  remaining: number;
  startTime: number;
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
  const [timers, setTimers] = useState<Record<string, Timer>>({});
  const [timerEvents, setTimerEvents] = useState<{ id: string }[]>([]);

  //   console.log(
  //     `timers: [${Object.keys(timers).join(", ")}]; events: [${timerEvents.join(
  //       ", "
  //     )}]`
  //   );

  useEffect(() => {
    // TODO: check that the event was an 'end' event?
    if (timerEvents && timerEvents.length) {
      const newEvent = timerEvents[timerEvents.length - 1];
      onTimerEnd(newEvent.id);

      // Clear out this event so it's not retriggered
      setTimerEvents([...timerEvents.filter((t) => t?.id !== newEvent?.id)]);

      // Clear out this timer so it's not tracked anymore
      const tempTimers = { ...timers };
      delete tempTimers[newEvent.id];
      setTimers(tempTimers);
    }
  }, [timerEvents, onTimerEnd, timers]);

  const startTimer = (id: string, duration?: number) => {
    setTimers({
      ...timers,
      [id]: {
        isPaused: true,
        remaining: duration || DEFAULT_TIMEOUT,
        startTime: Date.now(),
        timeout: setTimeout(() => {
          setTimerEvents([...timerEvents, { id }]);
        }, duration || DEFAULT_TIMEOUT),
      },
    });
  };

  const pauseTimer = (id: string) => {
    if (!Object.keys(timers).includes(id)) {
      return;
    }

    const timer = { ...timers[id] };
    timer.isPaused = true;
    timer.remaining -= Date.now() - timer.startTime;
    clearTimeout(timer.timeout);

    onTimerPause?.(id);
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
