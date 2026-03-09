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

  const clearTickInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    initSpeech();
    setTimer((prev) => {
      if (prev.status === "finished" || prev.status === "overtime") return prev;
      if (prev.remaining <= 0) return prev;
      return { ...prev, status: "running" };
    });
  }, []);

  const pause = useCallback(() => {
    setTimer((prev) => {
      if (prev.status !== "running" && prev.status !== "overtime") return prev;
      return { ...prev, status: "paused" };
    });
  }, []);

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

  useEffect(() => {
    if (timer.status === "running" || timer.status === "overtime") {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          const newRemaining = prev.remaining - 1;
          const played = playedSoundsRef.current;

          // Hit zero: play bell and switch to overtime
          if (prev.remaining === 1 && prev.status === "running") {
            if (!played.has("finish-bell")) {
              played.add("finish-bell");
              playFinishBell();
            }
            return { ...prev, remaining: 0, status: "overtime" };
          }

          // Already in overtime: keep counting down (negative)
          if (prev.status === "overtime") {
            return { ...prev, remaining: newRemaining };
          }

          // Notification sounds at 5min, 3min, 1min, 30sec
          for (const sec of NOTIFICATION_SECONDS) {
            if (newRemaining === sec && !played.has(`notify-${sec}`)) {
              played.add(`notify-${sec}`);
              playNotification(sec);
              break;
            }
          }

          // Countdown tick for last 10 seconds
          if (
            newRemaining <= COUNTDOWN_FROM &&
            newRemaining > 0 &&
            !played.has(`tick-${newRemaining}`)
          ) {
            played.add(`tick-${newRemaining}`);
            playCountdownTick();
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
  };
}
