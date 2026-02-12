
export enum TimerStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}

export enum TimerMode {
  TIMER = 'TIMER',
  STOPWATCH = 'STOPWATCH'
}

export enum AppView {
  TIMER = 'TIMER',
  CALENDAR = 'CALENDAR',
  WORLD_CLOCK = 'WORLD_CLOCK'
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string; // ISO string format YYYY-MM-DD
  color: string;
}

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface TimerState {
  remainingSeconds: number;
  initialSeconds: number;
  status: TimerStatus;
  mode: TimerMode;
}
