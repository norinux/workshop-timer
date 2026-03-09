"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { TimerState, createTimer } from "@/lib/timer";
import { playAlarm, playCountdownTick } from "@/lib/sound";

export function useTimer(id: string, label: string, durationMinutes: number) {
  const [timer, setTimer] = useState<TimerState>(() =>
    createTimer(id, label, durationMinutes)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickSoundRef = useRef<number>(-1);

  const clearTickInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setTimer((prev) => {
      if (prev.status === "finished") return prev;
      if (prev.remaining <= 0) return prev;
      return { ...prev, status: "running" };
    });
  }, []);

  const pause = useCallback(() => {
    setTimer((prev) => {
      if (prev.status !== "running") return prev;
      return { ...prev, status: "paused" };
    });
  }, []);

  const reset = useCallback(() => {
    clearTickInterval();
    lastTickSoundRef.current = -1;
    setTimer((prev) => ({
      ...prev,
      remaining: prev.duration,
      status: "idle",
    }));
  }, [clearTickInterval]);

  const setDuration = useCallback(
    (minutes: number) => {
      clearTickInterval();
      lastTickSoundRef.current = -1;
      setTimer((prev) => {
        const duration = minutes * 60;
        return {
          ...prev,
          duration,
          remaining: duration,
          status: "idle",
        };
      });
    },
    [clearTickInterval]
  );

  const setLabel = useCallback((newLabel: string) => {
    setTimer((prev) => ({ ...prev, label: newLabel }));
  }, []);

  useEffect(() => {
    if (timer.status === "running") {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev.remaining <= 1) {
            playAlarm();
            return { ...prev, remaining: 0, status: "finished" };
          }

          const newRemaining = prev.remaining - 1;

          // Play countdown tick for last 5 seconds
          if (newRemaining <= 5 && newRemaining > 0) {
            if (lastTickSoundRef.current !== newRemaining) {
              lastTickSoundRef.current = newRemaining;
              playCountdownTick();
            }
          }

          return { ...prev, remaining: newRemaining };
        });
      }, 1000);
    } else {
      clearTickInterval();
    }

    return clearTickInterval;
  }, [timer.status, clearTickInterval]);

  return {
    timer,
    start,
    pause,
    reset,
    setDuration,
    setLabel,
  };
}
