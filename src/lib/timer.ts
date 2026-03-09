export interface TimerState {
  id: string;
  label: string;
  duration: number; // total duration in seconds
  remaining: number; // remaining time in seconds
  status: "idle" | "running" | "paused" | "finished";
}

export function createTimer(
  id: string,
  label: string,
  durationMinutes: number
): TimerState {
  const duration = durationMinutes * 60;
  return {
    id,
    label,
    duration,
    remaining: duration,
    status: "idle",
  };
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getProgress(timer: TimerState): number {
  if (timer.duration === 0) return 0;
  return ((timer.duration - timer.remaining) / timer.duration) * 100;
}

export function getUrgencyLevel(
  timer: TimerState
): "normal" | "warning" | "critical" | "finished" {
  if (timer.status === "finished") return "finished";
  const ratio = timer.remaining / timer.duration;
  if (ratio <= 0) return "finished";
  if (ratio <= 0.1) return "critical";
  if (ratio <= 0.25) return "warning";
  return "normal";
}

export function generateTimerId(): string {
  return Math.random().toString(36).substring(2, 8);
}
