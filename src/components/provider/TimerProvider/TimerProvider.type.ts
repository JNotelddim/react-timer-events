export interface Timer {
  id: string;
  duration: number;
  isActive: boolean;
  event: {
    eventName: string;
    listener: () => void;
  };
}

export interface TimerContextState {
  startTimer: (params: StartTimerParams) => Timer;
  clearTimer: (id: string) => void;
  pauseTimer: (
    id: string
  ) => (Pick<Timer, "id"> & { remaining: number }) | undefined;
}

export interface StartTimerParams {
  timerName?: string;
  callback: () => void;
  duration?: number;
}
