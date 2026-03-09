import { describe, it, expect } from "vitest";
import {
  createTimer,
  formatTime,
  getProgress,
  getUrgencyLevel,
  generateTimerId,
  TimerState,
} from "../timer";

describe("createTimer", () => {
  it("creates a timer with correct initial state", () => {
    const timer = createTimer("abc", 5);
    expect(timer).toEqual({
      id: "abc",
      duration: 300,
      remaining: 300,
      status: "idle",
    });
  });

  it("handles 0 minutes", () => {
    const timer = createTimer("x", 0);
    expect(timer.duration).toBe(0);
    expect(timer.remaining).toBe(0);
  });
});

describe("formatTime", () => {
  it("formats 0 seconds as 00:00", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds only", () => {
    expect(formatTime(45)).toBe("00:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(125)).toBe("02:05");
  });

  it("formats exact minutes", () => {
    expect(formatTime(300)).toBe("05:00");
  });

  it("pads single digit values", () => {
    expect(formatTime(61)).toBe("01:01");
  });

  it("formats negative seconds with + prefix", () => {
    expect(formatTime(-30)).toBe("+00:30");
  });

  it("formats negative minutes with + prefix", () => {
    expect(formatTime(-125)).toBe("+02:05");
  });
});

describe("getProgress", () => {
  it("returns 0 when timer has not started", () => {
    const timer = createTimer("a", 5);
    expect(getProgress(timer)).toBe(0);
  });

  it("returns 50 when half the time has elapsed", () => {
    const timer: TimerState = {
      id: "a",
      duration: 300,
      remaining: 150,
      status: "running",
    };
    expect(getProgress(timer)).toBe(50);
  });

  it("returns 100 when time is up", () => {
    const timer: TimerState = {
      id: "a",
      duration: 300,
      remaining: 0,
      status: "finished",
    };
    expect(getProgress(timer)).toBe(100);
  });

  it("returns 0 when duration is 0", () => {
    const timer = createTimer("a", 0);
    expect(getProgress(timer)).toBe(0);
  });
});

describe("getUrgencyLevel", () => {
  it("returns normal when plenty of time remains", () => {
    const timer: TimerState = {
      id: "a",
      duration: 300,
      remaining: 200,
      status: "running",
    };
    expect(getUrgencyLevel(timer)).toBe("normal");
  });

  it("returns warning when 25% or less remains", () => {
    const timer: TimerState = {
      id: "a",
      duration: 100,
      remaining: 25,
      status: "running",
    };
    expect(getUrgencyLevel(timer)).toBe("warning");
  });

  it("returns critical when 10% or less remains", () => {
    const timer: TimerState = {
      id: "a",
      duration: 100,
      remaining: 10,
      status: "running",
    };
    expect(getUrgencyLevel(timer)).toBe("critical");
  });

  it("returns finished when status is finished", () => {
    const timer: TimerState = {
      id: "a",
      duration: 100,
      remaining: 0,
      status: "finished",
    };
    expect(getUrgencyLevel(timer)).toBe("finished");
  });

  it("returns finished when remaining is 0 even if not finished status", () => {
    const timer: TimerState = {
      id: "a",
      duration: 100,
      remaining: 0,
      status: "running",
    };
    expect(getUrgencyLevel(timer)).toBe("finished");
  });

  it("returns finished when status is overtime", () => {
    const timer: TimerState = {
      id: "a",
      duration: 100,
      remaining: -30,
      status: "overtime",
    };
    expect(getUrgencyLevel(timer)).toBe("finished");
  });
});

describe("generateTimerId", () => {
  it("generates a string id", () => {
    const id = generateTimerId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateTimerId()));
    expect(ids.size).toBe(100);
  });
});
