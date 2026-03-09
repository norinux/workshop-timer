"use client";

import { TimerState } from "@/lib/timer";

interface TimerControlsProps {
  timer: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  layout?: "horizontal" | "vertical";
}

export default function TimerControls({
  timer,
  onStart,
  onPause,
  onReset,
  layout = "horizontal",
}: TimerControlsProps) {
  const isVertical = layout === "vertical";

  return (
    <div className={`flex ${isVertical ? "flex-col gap-2" : "gap-4"}`}>
      {timer.status === "running" ? (
        <button
          onClick={onPause}
          className={`rounded-xl bg-amber-500 font-bold text-white shadow-md transition-colors hover:bg-amber-400 ${
            isVertical ? "px-4 py-2 text-sm" : "px-8 py-4 text-xl"
          }`}
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={timer.status === "finished"}
          className={`rounded-xl bg-green-600 font-bold text-white shadow-md transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            isVertical ? "px-4 py-2 text-sm" : "px-8 py-4 text-xl"
          }`}
        >
          {timer.status === "paused" ? "Resume" : "Start"}
        </button>
      )}
      <button
        onClick={onReset}
        className={`rounded-xl border-2 border-slate-300 bg-white font-bold text-slate-600 shadow-md transition-colors hover:bg-slate-50 ${
          isVertical ? "px-4 py-2 text-sm" : "px-8 py-4 text-xl"
        }`}
      >
        Reset
      </button>
    </div>
  );
}
