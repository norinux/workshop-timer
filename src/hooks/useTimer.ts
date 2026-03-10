"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { TimerState, createTimer } from "@/lib/timer";
import {
  playFinishBell,
  playNotification,
  playCountdownTick,
  initSpeech,
  NOTIFICATION_SECONDS,
  COUNTDOWN_FROM,
} from "@/lib/sound";

export function useTimer(id: string, durationMinutes: number) {
  const [timer, setTimer] = useState<TimerState>(() =>
    createTimer(id, durationMinutes)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playedSoundsRef = useRef<Set<string>>(new Set());

  // Track the real start time and the remaining value at that moment
  const startTimeRef = useRef<number>(0);
  const remainingAtStartRef = useRef<number>(0);

  const clearTickInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    clearTickInterval();

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newRemaining = remainingAtStartRef.current - elapsed;

      setTimer((prev) => {
        if (prev.status !== "running" && prev.status !== "overtime") return prev;

        const played = playedSoundsRef.current;

        // Transition to overtime
        if (newRemaining <= 0 && prev.status === "running") {
          if (!played.has("finish-bell")) {
            played.add("finish-bell");
            playFinishBell();
          }
          return { ...prev, remaining: newRemaining, status: "overtime" };
        }

        // Overtime: just update remaining
        if (prev.status === "overtime") {
          return { ...prev, remaining: newRemaining };
        }

        // Notification sounds at 5min, 3min, 1min, 30sec
        for (const sec of NOTIFICATION_SECONDS) {
          if (
            newRemaining <= sec &&
            prev.remaining > sec &&
            !played.has(`notify-${sec}`)
          ) {
            played.add(`notify-${sec}`);
            playNotification(sec);
            break;
          }
        }

        // Countdown tick for last 10 seconds
        if (newRemaining <= COUNTDOWN_FROM && newRemaining > 0) {
          // Play tick for each second we crossed
          for (
            let s = Math.min(prev.remaining, COUNTDOWN_FROM);
            s > newRemaining;
            s--
          ) {
            if (s > 0 && !played.has(`tick-${s}`)) {
              played.add(`tick-${s}`);
              playCountdownTick();
            }
          }
        }

        return { ...prev, remaining: newRemaining };
      });
    }, 200); // Check more frequently for accuracy
  }, [clearTickInterval]);

  const start = useCallback(() => {
    initSpeech();
    setTimer((prev) => {
      if (prev.status === "finished" || prev.status === "overtime") return prev;
      if (prev.remaining <= 0) return prev;

      startTimeRef.current = Date.now();
      remainingAtStartRef.current = prev.remaining;

      return { ...prev, status: "running" };
    });
  }, []);

  const pause = useCallback(() => {
    clearTickInterval();
    setTimer((prev) => {
      if (prev.status !== "running" && prev.status !== "overtime") return prev;
      return { ...prev, status: "paused" };
    });
  }, [clearTickInterval]);

  const reset = useCallback(() => {
    clearTickInterval();
    playedSoundsRef.current.clear();
    setTimer((prev) => ({
      ...prev,
      remaining: prev.duration,
      status: "idle",
    }));
  }, [clearTickInterval]);

  const setDuration = useCallback(
    (minutes: number) => {
      clearTickInterval();
      playedSoundsRef.current.clear();
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

  // Start/stop interval based on status
  useEffect(() => {
    if (timer.status === "running" || timer.status === "overtime") {
      // When resuming from pause, reset the reference point
      if (!intervalRef.current) {
        startTimeRef.current = Date.now();
        remainingAtStartRef.current = timer.remaining;
        startInterval();
      }
    } else {
      clearTickInterval();
    }

    return clearTickInterval;
  }, [timer.status, startInterval, clearTickInterval]);

  return {
    timer,
    start,
    pause,
    reset,
    setDuration,
  };
}
