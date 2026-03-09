import { TimerState } from "./timer";
import { getSupabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface TimerSyncData {
  timer: TimerState;
  updatedAt: number;
}

let currentChannel: RealtimeChannel | null = null;

export function broadcastTimerState(timer: TimerState): void {
  if (typeof window === "undefined") return;

  const supabase = getSupabase();
  const data: TimerSyncData = {
    timer,
    updatedAt: Date.now(),
  };

  // Broadcast via Supabase Realtime
  const channelName = `timer-${timer.id}`;

  if (!currentChannel || currentChannel.topic !== `realtime:${channelName}`) {
    currentChannel?.unsubscribe();
    currentChannel = supabase.channel(channelName);
    currentChannel.subscribe();
  }

  currentChannel.send({
    type: "broadcast",
    event: "timer-update",
    payload: data,
  });
}

export function subscribeToTimer(
  id: string,
  callback: (data: TimerSyncData) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const supabase = getSupabase();
  const channelName = `timer-${id}`;
  const channel = supabase.channel(channelName);

  channel
    .on("broadcast", { event: "timer-update" }, (payload) => {
      const data = payload.payload as TimerSyncData;
      callback(data);
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
