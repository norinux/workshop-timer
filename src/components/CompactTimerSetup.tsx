"use client";

import { useState } from "react";

interface CompactTimerSetupProps {
  onSetDuration: (minutes: number) => void;
  currentDuration: number;
}

const PRESET_MINUTES = [1, 3, 5, 10, 15, 20, 30];

export default function CompactTimerSetup({
  onSetDuration,
  currentDuration,
}: CompactTimerSetupProps) {
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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1">
        {PRESET_MINUTES.map((min) => (
          <button
            key={min}
            onClick={() => onSetDuration(min)}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
              currentMinutes === min
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {min}m
          </button>
        ))}
      </div>
      <form onSubmit={handleCustomSubmit} className="flex gap-1">
        <input
          type="number"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          placeholder="Min"
          min={1}
          max={180}
          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Set
        </button>
      </form>
    </div>
  );
}
