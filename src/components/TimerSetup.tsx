"use client";

import { useState } from "react";

interface TimerSetupProps {
  onSetDuration: (minutes: number) => void;
  onSetLabel: (label: string) => void;
  currentLabel: string;
  currentDuration: number; // in seconds
}

const PRESET_MINUTES = [1, 3, 5, 10, 15, 20, 30];

export default function TimerSetup({
  onSetDuration,
  onSetLabel,
  currentLabel,
  currentDuration,
}: TimerSetupProps) {
  const [customMinutes, setCustomMinutes] = useState("");
  const currentMinutes = currentDuration / 60;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes, 10);
    if (minutes > 0 && minutes <= 180) {
      onSetDuration(minutes);
      setCustomMinutes("");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <label htmlFor="timer-label" className="mb-2 block text-sm text-slate-400">
          Session Name
        </label>
        <input
          id="timer-label"
          type="text"
          value={currentLabel}
          onChange={(e) => onSetLabel(e.target.value)}
          placeholder="e.g. Brainstorming"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-slate-400">Quick Set (minutes)</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_MINUTES.map((min) => (
            <button
              key={min}
              onClick={() => onSetDuration(min)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                currentMinutes === min
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {min}m
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="number"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          placeholder="Custom minutes"
          min={1}
          max={180}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Set
        </button>
      </form>
    </div>
  );
}
