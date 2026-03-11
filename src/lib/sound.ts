let muted = false;

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
}

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
  if (muted) return;
  const audioContext = getAudioContext();
  const now = audioContext.currentTime;

  for (let i = 0; i < 5; i++) {
    playBellHit(audioContext, now + i * 0.6);
  }
}

/**
 * 残り秒数に対応する音声ファイル
 */
const NOTIFICATION_AUDIO: Record<number, string> = {
  [5 * 60]: "/audio/notify-300.mp3",
  [3 * 60]: "/audio/notify-180.mp3",
  [60]: "/audio/notify-60.mp3",
  [30]: "/audio/notify-30.mp3",
};

/**
 * 日本語音声アナウンス（事前録音MP3） + チャイム音
 */
export function playNotification(remainingSeconds: number): void {
  if (typeof window === "undefined") return;
  if (muted) return;

  // チャイム音
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

  // 事前録音の日本語音声を再生
  const audioFile = NOTIFICATION_AUDIO[remainingSeconds];
  if (audioFile) {
    setTimeout(() => {
      const audio = new Audio(audioFile);
      audio.volume = 1.0;
      audio.play().catch(() => {
        // autoplay blocked
      });
    }, 700);
  }
}

/**
 * カウントダウン音（10秒前〜1秒前）
 */
export function playCountdownTick(): void {
  if (typeof window === "undefined") return;
  if (muted) return;
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

/**
 * ユーザー操作時に呼び出して音声を初期化する。
 */
export function initSpeech(): void {
  if (typeof window === "undefined") return;

  // AudioContext をアンロック
  getAudioContext();
}
