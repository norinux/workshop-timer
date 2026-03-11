import { describe, it, expect, beforeEach } from "vitest";
import { NOTIFICATION_SECONDS, COUNTDOWN_FROM, isMuted, setMuted } from "../sound";

describe("sound constants", () => {
  it("NOTIFICATION_SECONDS contains expected values", () => {
    expect(NOTIFICATION_SECONDS).toEqual([300, 180, 60, 30]);
  });

  it("NOTIFICATION_SECONDS is in descending order", () => {
    for (let i = 0; i < NOTIFICATION_SECONDS.length - 1; i++) {
      expect(NOTIFICATION_SECONDS[i]).toBeGreaterThan(
        NOTIFICATION_SECONDS[i + 1]
      );
    }
  });

  it("COUNTDOWN_FROM is 10", () => {
    expect(COUNTDOWN_FROM).toBe(10);
  });
});

describe("mute control", () => {
  beforeEach(() => {
    setMuted(false);
  });

  it("is not muted by default", () => {
    expect(isMuted()).toBe(false);
  });

  it("can be muted", () => {
    setMuted(true);
    expect(isMuted()).toBe(true);
  });

  it("can be unmuted", () => {
    setMuted(true);
    setMuted(false);
    expect(isMuted()).toBe(false);
  });
});
