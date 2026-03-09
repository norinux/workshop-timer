"use client";

import { useState } from "react";

interface TimerSetupProps {
  onSetDuration: (minutes: number) => void;
  currentDuration: number; // in seconds
}

const PRESET_MINUTES = [1, 3, 5, 10, 15, 20, 30];

export default function TimerSetup({
  onSetDuration,
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
        <p className="mb-2 text-sm font-medium text-slate-500">Quick Set (minutes)</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_MINUTES.map((min) => (
            <button
              key={min}
              onClick={() => onSetDuration(min)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                currentMinutes === min
                  ? "bg-blue-600 text-white shadow-md"
                  : "border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
          className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-blue-500"
        >
          Set
        </button>
      </form>
    </div>
  );
}
