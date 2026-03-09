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

export default function TimerPage() {
  const params = useParams();
  const id = params.id as string;
  const { timer, start, pause, reset, setDuration, setLabel } = useTimer(
    id,
    "",
    5
  );
  const [slideUrl, setSlideUrl] = useState<string | null>(null);

  // Broadcast timer state to viewers
  useEffect(() => {
    broadcastTimerState(timer);
  }, [timer]);

  // Slide mode: compact timer at top + slides below
  if (slideUrl) {
    return (
      <main className="flex h-screen flex-col bg-white">
        <div className="flex items-center gap-6 border-b-2 border-slate-200 px-6 py-3">
          <div className="flex-1">
            <TimerDisplay timer={timer} size="normal" />
          </div>
          <TimerControls
            timer={timer}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
        </div>
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
          onSetLabel={setLabel}
          currentLabel={timer.label}
          currentDuration={timer.duration}
        />
      )}
      <SlideEmbed embedUrl={slideUrl} onSetSlideUrl={setSlideUrl} />
      <ShareLink timerId={id} />
    </main>
  );
}
