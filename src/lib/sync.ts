import { TimerState } from "./timer";

const CHANNEL_NAME = "workshop-timer-sync";
const STORAGE_PREFIX = "workshop-timer:";

export interface TimerSyncData {
  timer: TimerState;
  updatedAt: number;
}

export function broadcastTimerState(timer: TimerState): void {
  if (typeof window === "undefined") return;

  const data: TimerSyncData = {
    timer,
    updatedAt: Date.now(),
  };

  // Save to localStorage for new viewers
  localStorage.setItem(`${STORAGE_PREFIX}${timer.id}`, JSON.stringify(data));

  // Broadcast to open tabs
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(data);
    channel.close();
  } catch {
    // BroadcastChannel not supported
  }
}

export function getStoredTimerState(id: string): TimerSyncData | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as TimerSyncData;
  } catch {
    return null;
  }
}

export function subscribeToTimer(
  id: string,
  callback: (data: TimerSyncData) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  // Poll localStorage for cross-tab sync
  const pollInterval = setInterval(() => {
    const data = getStoredTimerState(id);
    if (data) {
      callback(data);
    }
  }, 500);

  // Also listen to BroadcastChannel for instant updates
  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent<TimerSyncData>) => {
      if (event.data.timer.id === id) {
        callback(event.data);
      }
    };
  } catch {
    // BroadcastChannel not supported
  }

  return () => {
    clearInterval(pollInterval);
    channel?.close();
  };
}
