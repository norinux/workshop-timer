"use client";

import { TimerState } from "@/lib/timer";

interface TimerControlsProps {
  timer: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerControls({
  timer,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4">
      {timer.status === "running" ? (
        <button
          onClick={onPause}
          className="rounded-xl bg-amber-500 px-8 py-4 text-xl font-bold text-white shadow-md transition-colors hover:bg-amber-400"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={timer.status === "finished"}
          className="rounded-xl bg-green-600 px-8 py-4 text-xl font-bold text-white shadow-md transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {timer.status === "paused" ? "Resume" : "Start"}
        </button>
      )}
      <button
        onClick={onReset}
        className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-xl font-bold text-slate-600 shadow-md transition-colors hover:bg-slate-50"
      >
        Reset
      </button>
    </div>
  );
}
