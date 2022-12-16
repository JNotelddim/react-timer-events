import { SubComponent, SubComponentVariant } from "./components/SubComponent";

function App() {
  /**
   * PLAN:
   *
   *
   * - SubComponent
   *  - each one uses `addToast` & passes the variant
   *
   * - ToastProvider
   *   - renders the contextual Toast notifications
   *   - useToast hook allows for SubComponents to `addToast`
   *   - Toast renders black w/ icon using the variant color passed in
   *   - toasts have timeouts
   *   - toast are a *stack* (LIFO)
   *   - publish "pause"-id event when not top-of-stack
   *   - ToastProvider is subscribed to timer events so it can update
   *       stack state at end of timer without having to use refs.
   *
   *   - [ each toast could also consider using the Timer context just to
   *     render its timer's state. ]
   *
   * - "TimerProvider"
   *   - shares a context-providing hook for subcomponents to be able to subscribe to timer events
   *   - Events: "timer-start", "timer-pause", "timer-end", "timer-clear" -- would need to pass `id` w/ events
   *
   * - headless ui transition in & out?
   *   - you can do it without headless UI :)
   *
   */
  return (
    <div className="h-full">
      <header className="text-xl w-full text-center py-10">
        Timer Subscriptions Demo
      </header>

      <div className="flex flex-row h-1/2">
        {/* 4 subcomponent sections, plus one Toast provider. */}
        {(["red", "blue", "green", "yellow"] as SubComponentVariant[]).map(
          (color) => (
            <SubComponent variant={color} />
          )
        )}
      </div>
    </div>
  );
}

export default App;
