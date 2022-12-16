# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Concept

I don't like my current implementation of the ToastProvider and how it manages the various
toast timeouts because it relies on refs to be able to get the up-to-date version of the
toasts stack in the timeout callback, which feels kinda icky.

So I was thinking about it and wondered if I could make something that could remain stateful
by using event subscriptions.

##

PLAN:

- SubComponent

  - each one uses `addToast` & passes the variant

- ToastProvider

  - renders the contextual Toast notifications
  - useToast hook allows for SubComponents to `addToast`
  - Toast renders black w/ icon using the variant color passed in
  - toasts have timeouts
  - toast are a _stack_ (LIFO)
  - publish "pause"-id event when not top-of-stack
  - ToastProvider is subscribed to timer events so it can update
    stack state at end of timer without having to use refs.

  - [ each toast could also consider using the Timer context just to
    render its timer's state. ]

- "TimerProvider"

  - shares a context-providing hook for subcomponents to be able to subscribe to timer events
  - Events: "timer-start", "timer-pause", "timer-end", "timer-clear" -- would need to pass `id` w/ events

- headless ui transition in & out?
  - you can do it without headless UI :)
