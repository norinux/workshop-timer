"use client";

import { TimerState, formatTime, getProgress, getUrgencyLevel } from "@/lib/timer";

interface TimerDisplayProps {
  timer: TimerState;
  size?: "normal" | "large";
}

const urgencyStyles = {
  normal: "text-slate-800",
  warning: "text-amber-600",
  critical: "text-red-600 animate-pulse",
  finished: "text-red-600",
};

const urgencyBorderStyles = {
  normal: "border-slate-200",
  warning: "border-amber-300 bg-amber-50",
  critical: "border-red-300 bg-red-50",
  finished: "border-red-400 bg-red-50",
};

export default function TimerDisplay({ timer, size = "normal" }: TimerDisplayProps) {
  const urgency = getUrgencyLevel(timer);
  const progress = getProgress(timer);
  const timeText = formatTime(timer.remaining);
  const isLarge = size === "large";

  // Green → Yellow → Red based on progress (100→0)
  const getBarColor = (pct: number): string => {
    if (pct <= 0) return "rgb(239, 68, 68)"; // red-500
    if (pct >= 100) return "rgb(34, 197, 94)"; // green-500
    if (pct > 50) {
      // green → yellow (100→50)
      const t = (pct - 50) / 50;
      const r = Math.round(234 + (34 - 234) * t);
      const g = Math.round(179 + (197 - 179) * t);
      const b = Math.round(8 + (94 - 8) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
    // yellow → red (50→0)
    const t = pct / 50;
    const r = Math.round(239 + (234 - 239) * t);
    const g = Math.round(68 + (179 - 68) * t);
    const b = Math.round(68 + (8 - 68) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div
      className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-500 sm:p-8 ${urgencyBorderStyles[urgency]}`}
      role="timer"
      aria-label={`${timeText} remaining`}
    >
      <div
        className={`font-mono font-bold tabular-nums ${urgencyStyles[urgency]} ${isLarge ? "text-6xl leading-none sm:text-8xl md:text-[12rem]" : "text-5xl sm:text-8xl"}`}
      >
        {timeText}
      </div>

      {(timer.status === "finished" || timer.status === "overtime") && (
        <div className={`mt-4 font-bold text-red-600 ${isLarge ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
          {timer.status === "overtime" ? "OVERTIME" : "TIME\u0027S UP!"}
        </div>
      )}

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200 sm:mt-6">
        <div
          className="ml-auto h-full rounded-full transition-all duration-1000"
          style={{
            width: `${progress}%`,
            backgroundColor: getBarColor(progress),
          }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-2 text-sm font-medium text-slate-400">
        {timer.status === "idle" && "Ready"}
        {timer.status === "running" && "Running"}
        {timer.status === "paused" && "Paused"}
        {timer.status === "finished" && "Finished"}
        {timer.status === "overtime" && "Overtime"}
      </div>
    </div>
  );
}
