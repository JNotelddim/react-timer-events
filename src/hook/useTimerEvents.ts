import React, { useEffect, useState } from "react";

export interface Timer {
  id: string;
  remaining: number;
  startTime: number;
  isPaused: boolean;
  timeout: NodeJS.Timeout;
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
}: //   onTimerPause,
{
  onTimerEnd: (id: string) => void;
  onTimerPause?: (id: string) => void;
}) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [timerEvents, setTimerEvents] = useState<
    { id: string; type: "end" | "pause" }[]
  >([]);

  console.log({ timers });
  // TODO: why is 'pausing' timer not effecting this hook's state??

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
        isPaused: false,
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

    const newTop = { ...timers[timers.length - 1] };
    newTop.startTime = Date.now();
    newTop.isPaused = false;
    newTop.timeout = setTimeout(() => {
      setTimerEvents([...timerEvents, { id: newTop.id, type: "end" }]);
    }, newTop.remaining);
    setTimers([...timers.filter((t) => t.id !== newTop.id), newTop]);
  };

  const pauseTimer = React.useCallback(
    (id: string) => {
      const timer = timers.find((t) => t.id === id);
      if (!timer) {
        return;
      }

      const tmpTimer = { ...timer };
      tmpTimer.isPaused = true;
      tmpTimer.remaining -= Date.now() - timer.startTime;
      clearTimeout(timer.timeout);

      console.log("pausedTimer", tmpTimer);
      // TODO: __ BUG __ -- why isn't `setTimers` updating the state here??

      // TODO: read onPause later
      // onTimerPause?.(id);
      setTimers([...timers, tmpTimer]);
    },
    [timers, setTimers]
  );

  /* Pause all of the timers */
  const pauseAll = () => {
    for (const timer of timers.filter((t) => t.isPaused !== true)) {
      pauseTimer(timer.id);
    }
  };

  return { startTimer, pauseTimer, pauseAll };
};
