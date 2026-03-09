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
          className="rounded-xl bg-yellow-600 px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-yellow-500"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={timer.status === "finished"}
          className="rounded-xl bg-green-600 px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {timer.status === "paused" ? "Resume" : "Start"}
        </button>
      )}
      <button
        onClick={onReset}
        className="rounded-xl bg-slate-600 px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-slate-500"
      >
        Reset
      </button>
    </div>
  );
}
