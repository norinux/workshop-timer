import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWakeLock } from "../useWakeLock";

type FakeSentinel = {
  released: boolean;
  release: ReturnType<typeof vi.fn>;
};

function createFakeSentinel(): FakeSentinel {
  const sentinel: FakeSentinel = {
    released: false,
    release: vi.fn(),
  };
  sentinel.release.mockImplementation(async () => {
    sentinel.released = true;
  });
  return sentinel;
}

function setupWakeLockMock() {
  const sentinels: FakeSentinel[] = [];
  const request = vi.fn(async (_type: "screen") => {
    const sentinel = createFakeSentinel();
    sentinels.push(sentinel);
    return sentinel;
  });
  Object.defineProperty(navigator, "wakeLock", {
    value: { request },
    configurable: true,
    writable: true,
  });
  return { request, sentinels };
}

function clearWakeLockMock() {
  Object.defineProperty(navigator, "wakeLock", {
    value: undefined,
    configurable: true,
    writable: true,
  });
}

describe("useWakeLock", () => {
  beforeEach(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  });

  afterEach(() => {
    clearWakeLockMock();
    vi.restoreAllMocks();
  });

  it("does nothing when inactive", () => {
    const { request } = setupWakeLockMock();
    renderHook(() => useWakeLock(false));
    expect(request).not.toHaveBeenCalled();
  });

  it("requests a screen wake lock when active", async () => {
    const { request } = setupWakeLockMock();
    renderHook(() => useWakeLock(true));
    await act(async () => {});
    expect(request).toHaveBeenCalledWith("screen");
  });

  it("releases the wake lock when becoming inactive", async () => {
    const { sentinels } = setupWakeLockMock();
    const { rerender } = renderHook(({ active }) => useWakeLock(active), {
      initialProps: { active: true },
    });
    await act(async () => {});
    expect(sentinels).toHaveLength(1);

    rerender({ active: false });
    await act(async () => {});
    expect(sentinels[0].release).toHaveBeenCalled();
  });

  it("releases the wake lock on unmount", async () => {
    const { sentinels } = setupWakeLockMock();
    const { unmount } = renderHook(() => useWakeLock(true));
    await act(async () => {});

    unmount();
    expect(sentinels[0].release).toHaveBeenCalled();
  });

  it("re-acquires the wake lock when the tab becomes visible again", async () => {
    const { request, sentinels } = setupWakeLockMock();
    renderHook(() => useWakeLock(true));
    await act(async () => {});
    expect(request).toHaveBeenCalledTimes(1);

    // Simulate tab being hidden — browser auto-releases the lock
    sentinels[0].released = true;
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });

    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(request).toHaveBeenCalledTimes(2);
  });

  it("is a no-op when wakeLock API is unavailable", () => {
    clearWakeLockMock();
    expect(() => {
      renderHook(() => useWakeLock(true));
    }).not.toThrow();
  });

  it("swallows request errors", async () => {
    const request = vi.fn(async () => {
      throw new Error("denied");
    });
    Object.defineProperty(navigator, "wakeLock", {
      value: { request },
      configurable: true,
      writable: true,
    });

    expect(() => {
      renderHook(() => useWakeLock(true));
    }).not.toThrow();

    await act(async () => {});
    expect(request).toHaveBeenCalled();
  });
});
