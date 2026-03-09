let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContext();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

/**
 * チンベル風の音（金属的な高音 + 残響）
 */
function playBellHit(audioContext: AudioContext, startTime: number): void {
  // メインの高音
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = 3200;
  osc1.type = "sine";
  gain1.gain.setValueAtTime(0.4, startTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
  osc1.start(startTime);
  osc1.stop(startTime + 0.8);

  // 倍音（金属感）
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = 6400;
  osc2.type = "sine";
  gain2.gain.setValueAtTime(0.15, startTime);
  gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
  osc2.start(startTime);
  osc2.stop(startTime + 0.5);

  // アタック音（パチッという打撃感）
  const osc3 = audioContext.createOscillator();
  const gain3 = audioContext.createGain();
  osc3.connect(gain3);
  gain3.connect(audioContext.destination);
  osc3.frequency.value = 8000;
  osc3.type = "square";
  gain3.gain.setValueAtTime(0.2, startTime);
  gain3.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
  osc3.start(startTime);
  osc3.stop(startTime + 0.05);
}

/**
 * 終了時：チンベル5回
 */
export function playFinishBell(): void {
  if (typeof window === "undefined") return;
  const audioContext = getAudioContext();
  const now = audioContext.currentTime;

  for (let i = 0; i < 5; i++) {
    playBellHit(audioContext, now + i * 0.6);
  }
}

/**
 * お知らせ音（5分前、3分前、1分前、30秒前）
 * 短い2音のチャイム
 */
export function playNotification(): void {
  if (typeof window === "undefined") return;
  const audioContext = getAudioContext();
  const now = audioContext.currentTime;

  const playTone = (startTime: number, freq: number, dur: number) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.35, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);
    osc.start(startTime);
    osc.stop(startTime + dur);
  };

  playTone(now, 880, 0.25);
  playTone(now + 0.3, 1100, 0.35);
}

/**
 * カウントダウン音（10秒前〜1秒前）
 */
export function playCountdownTick(): void {
  if (typeof window === "undefined") return;
  const audioContext = getAudioContext();
  const now = audioContext.currentTime;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.frequency.value = 800;
  osc.type = "sine";
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  osc.start(now);
  osc.stop(now + 0.12);
}

/** お知らせ対象の残り秒数 */
export const NOTIFICATION_SECONDS = [5 * 60, 3 * 60, 60, 30];

/** カウントダウン開始秒数 */
export const COUNTDOWN_FROM = 10;
