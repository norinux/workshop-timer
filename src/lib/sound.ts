export function playAlarm(): void {
  if (typeof window === "undefined") return;

  const audioContext = new AudioContext();

  const playBeep = (startTime: number, frequency: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const now = audioContext.currentTime;
  // 3 beeps
  playBeep(now, 880, 0.3);
  playBeep(now + 0.4, 880, 0.3);
  playBeep(now + 0.8, 1320, 0.5);
}

export function playCountdownTick(): void {
  if (typeof window === "undefined") return;

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 660;
  oscillator.type = "sine";

  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  oscillator.start(now);
  oscillator.stop(now + 0.15);
}
