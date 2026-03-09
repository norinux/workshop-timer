"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TimerState } from "@/lib/timer";
import { subscribeToTimer } from "@/lib/sync";
import TimerDisplay from "@/components/TimerDisplay";

export default function ViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [timer, setTimer] = useState<TimerState | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTimer(id, (data) => {
      setTimer(data.timer);
    });

    return unsubscribe;
  }, [id]);

  if (!timer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
        <div className="text-center">
          <p className="text-2xl text-slate-400">Waiting for timer...</p>
          <p className="mt-2 text-sm text-slate-500">
            The facilitator hasn&apos;t started a timer yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
      <TimerDisplay timer={timer} size="large" />
    </main>
  );
}
