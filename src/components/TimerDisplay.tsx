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

      <div className="mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200 sm:mt-6">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgency === "critical" || urgency === "finished"
              ? "bg-red-500"
              : urgency === "warning"
                ? "bg-amber-500"
                : "bg-blue-500"
          }`}
          style={{ width: `${progress}%` }}
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
