"use client";

import { TimerState, formatTime, getProgress, getUrgencyLevel } from "@/lib/timer";

interface TimerDisplayProps {
  timer: TimerState;
  size?: "normal" | "large";
}

const urgencyStyles = {
  normal: "text-white",
  warning: "text-yellow-400",
  critical: "text-red-500 animate-pulse",
  finished: "text-red-600",
};

const urgencyBgStyles = {
  normal: "from-slate-900 to-slate-800",
  warning: "from-slate-900 to-yellow-950",
  critical: "from-red-950 to-slate-900",
  finished: "from-red-950 to-red-900",
};

export default function TimerDisplay({ timer, size = "normal" }: TimerDisplayProps) {
  const urgency = getUrgencyLevel(timer);
  const progress = getProgress(timer);
  const timeText = formatTime(timer.remaining);
  const isLarge = size === "large";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br p-8 ${urgencyBgStyles[urgency]} transition-all duration-500`}
      role="timer"
      aria-label={`${timer.label}: ${timeText} remaining`}
    >
      {timer.label && (
        <h2
          className={`mb-4 font-semibold text-slate-300 ${isLarge ? "text-3xl" : "text-xl"}`}
        >
          {timer.label}
        </h2>
      )}

      <div
        className={`font-mono font-bold tabular-nums ${urgencyStyles[urgency]} ${isLarge ? "text-[12rem] leading-none" : "text-8xl"}`}
      >
        {timeText}
      </div>

      {timer.status === "finished" && (
        <div className={`mt-4 font-bold text-red-500 ${isLarge ? "text-4xl" : "text-2xl"}`}>
          TIME&apos;S UP!
        </div>
      )}

      <div className="mt-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgency === "critical" || urgency === "finished"
              ? "bg-red-500"
              : urgency === "warning"
                ? "bg-yellow-400"
                : "bg-blue-500"
          }`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-2 text-sm text-slate-400">
        {timer.status === "idle" && "Ready"}
        {timer.status === "running" && "Running"}
        {timer.status === "paused" && "Paused"}
        {timer.status === "finished" && "Finished"}
      </div>
    </div>
  );
}
