"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTimer } from "@/hooks/useTimer";
import { broadcastTimerState } from "@/lib/sync";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import TimerSetup from "@/components/TimerSetup";
import ShareLink from "@/components/ShareLink";

export default function TimerPage() {
  const params = useParams();
  const id = params.id as string;
  const { timer, start, pause, reset, setDuration, setLabel } = useTimer(
    id,
    "",
    5
  );

  // Broadcast timer state to viewers
  useEffect(() => {
    broadcastTimerState(timer);
  }, [timer]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-900 p-8">
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
      <ShareLink timerId={id} />
    </main>
  );
}
