import { useEffect, useState } from "react";

/**
 * useStatefulTimeout, allows you to have stateful callbacks with timeouts.
 *
 * Normally, the callback you pass to a `setTimeout` will be out-of-sync
 * with component state once it's called, because it's a separate closure.
 */
export const useStatefulTimeouts = ({
  onTimerEnd,
}: {
  onTimerEnd: (id: string) => void;
}) => {
  const [timerEvents, setTimerEvents] = useState<{ id: string }[]>([]);

  useEffect(() => {
    if (timerEvents && timerEvents.length) {
      const newEvent = timerEvents[timerEvents.length - 1];
      onTimerEnd(newEvent.id);

      setTimerEvents([...timerEvents.filter((t) => t?.id !== newEvent?.id)]);
    }
  }, [timerEvents, onTimerEnd]);

  const startTimer = (id: string) => {
    setTimeout(() => {
      setTimerEvents([...timerEvents, { id }]);
    }, 5000);
  };

  return { startTimer };
};
