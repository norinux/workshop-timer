export interface TimerState {
  id: string;
  duration: number; // total duration in seconds
  remaining: number; // remaining time in seconds (negative = overtime)
  status: "idle" | "running" | "paused" | "finished" | "overtime";
}

export function createTimer(
  id: string,
  durationMinutes: number
): TimerState {
  const duration = durationMinutes * 60;
  return {
    id,
    duration,
    remaining: duration,
    status: "idle",
  };
}

export function formatTime(totalSeconds: number): string {
  const abs = Math.abs(totalSeconds);
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  const prefix = totalSeconds < 0 ? "+" : "";
  return `${prefix}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getProgress(timer: TimerState): number {
  if (timer.duration === 0) return 0;
  if (timer.remaining <= 0) return 0;
  return (timer.remaining / timer.duration) * 100;
}

export function getUrgencyLevel(
  timer: TimerState
): "normal" | "warning" | "critical" | "finished" {
  if (timer.status === "overtime") return "finished";
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
