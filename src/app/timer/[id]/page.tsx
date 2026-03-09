"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTimer } from "@/hooks/useTimer";
import { broadcastTimerState } from "@/lib/sync";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import TimerSetup from "@/components/TimerSetup";
import ShareLink from "@/components/ShareLink";
import SlideEmbed from "@/components/SlideEmbed";
import CompactShareLink from "@/components/CompactShareLink";
import CompactTimerSetup from "@/components/CompactTimerSetup";

export default function TimerPage() {
  const params = useParams();
  const id = params.id as string;
  const { timer, start, pause, reset, setDuration } = useTimer(id, 5);
  const [slideUrl, setSlideUrl] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  // Broadcast timer state to viewers
  useEffect(() => {
    broadcastTimerState(timer);
  }, [timer]);

  // Slide mode: compact timer at top + slides below
  if (slideUrl) {
    return (
      <main className="flex h-screen flex-col bg-white">
        {showTimer ? (
          <div className="border-b-2 border-slate-200">
            <div className="flex items-center gap-4 px-6 py-3">
              <div className="flex-1">
                <TimerDisplay timer={timer} size="normal" />
              </div>
              <TimerControls
                timer={timer}
                onStart={start}
                onPause={pause}
                onReset={reset}
                layout="vertical"
              />
              <CompactShareLink timerId={id} />
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-2">
              {showPanel ? (
                <CompactTimerSetup
                  onSetDuration={setDuration}
                  currentDuration={timer.duration}
                />
              ) : null}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    showPanel
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowTimer(false);
                    setShowPanel(false);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50"
                >
                  Hide Timer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end border-b border-slate-100 px-6 py-2">
            <button
              onClick={() => setShowTimer(true)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50"
            >
              Show Timer
            </button>
          </div>
        )}
        <div className="flex flex-1 flex-col p-4">
          <SlideEmbed embedUrl={slideUrl} onSetSlideUrl={setSlideUrl} />
        </div>
      </main>
    );
  }

  // Normal mode: full-screen timer
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white p-8">
      <TimerDisplay timer={timer} size="large" />
      <TimerControls
        timer={timer}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
      {timer.status === "idle" && (
        <TimerSetup
          onSetDuration={setDuration}
          currentDuration={timer.duration}
        />
      )}
      <SlideEmbed embedUrl={slideUrl} onSetSlideUrl={setSlideUrl} />
      <ShareLink timerId={id} />
    </main>
  );
}
