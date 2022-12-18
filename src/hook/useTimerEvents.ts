import { useEffect, useState } from "react";

/**
 * useTimerEvents, allows you to have stateful callbacks with timeouts.
 *
 * Normally, the callback you pass to a `setTimeout` will be out-of-sync
 * with component state once it's called, because it's a separate closure.
 *
 * By tracking the timer end events with CustomEvents, we can trigger the
 * callback which happens at the end of the timeout and have it be up-to-date
 * with the component state.
 */

// ... I could remove all of the actual Event subscription/publishing though couldn't I?
// like I could lierally just have the timeout's callback call like `setTimeoutEnded`
// which would then trigger a useEffect to call the `onEvent` function :thinking:....
export const useTimerEvents = ({
  onEvent,
}: {
  onEvent: (detail?: { id: string }) => void;
}) => {
  const [timerEvents, setTimerEvents] = useState<
    CustomEventInit<{ id: string }>[]
  >([]);

  useEffect(() => {
    if (timerEvents && timerEvents.length) {
      const newEvent = timerEvents[timerEvents.length - 1];
      onEvent(newEvent.detail);

      setTimerEvents([
        ...timerEvents.filter((t) => t?.detail?.id !== newEvent?.detail?.id),
      ]);
    }
  }, [timerEvents, onEvent]);

  const addTimerEvent = (name: string) => {
    document.addEventListener(
      name,
      (endEvent: CustomEventInit<{ id: string }>) => {
        setTimerEvents([...timerEvents, endEvent]);
      }
    );
  };

  const publishEndEvent = (eventName: string, detail?: { id: string }) => {
    const endEvent = new CustomEvent(eventName, {
      detail,
    });
    document.dispatchEvent(endEvent);
  };

  return { addTimerEvent, publishEndEvent };
};
