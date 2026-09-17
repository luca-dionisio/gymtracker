/**
 * timer.js
 * Timer di recupero integrato per le pause tra serie ed esercizi.
 * Include segnali sonori sintetizzati con Web Audio API (senza file esterni)
 * e vibrazione su dispositivi mobile compatibili.
 */

class RestTimer {
  constructor() {
    this.totalSeconds = 90;
    this.remainingSeconds = 90;
    this.intervalId = null;
    this.isRunning = false;
    this.onTickCallback = null;
    this.onCompleteCallback = null;
    this.audioCtx = null;
  }

  /**
   * Inizializza o riattiva il contesto Web Audio in modo sicuro (senza bloccare in caso di policy browser)
   */
  initAudio() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {
      // Audio disabilitato o policy restrittiva
    }
  }

  /**
   * Riproduce un beep sintetizzato
   */
  playBeep(frequency = 880, duration = 0.15, type = "sine") {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio non riproducibile:", e);
    }
  }

  /**
   * Suono squillante di fine recupero (triplo chime ascendente)
   */
  playFinishAlarm() {
    this.playBeep(587.33, 0.15, "triangle"); // D5
    setTimeout(() => this.playBeep(739.99, 0.15, "triangle"), 150); // F#5
    setTimeout(() => this.playBeep(880.00, 0.35, "triangle"), 300); // A5

    // Vibrazione su mobile (es. due impulsi da 250ms)
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([250, 100, 250, 100, 400]);
      } catch (e) {}
    }
  }

  /**
   * Avvia il timer con una durata specificata in secondi
   */
  start(seconds, onTick, onComplete) {
    this.stop();
    this.initAudio();
    this.totalSeconds = Math.max(1, seconds);
    this.remainingSeconds = this.totalSeconds;
    this.onTickCallback = onTick;
    this.onCompleteCallback = onComplete;
    this.isRunning = true;

    if (this.onTickCallback) {
      this.onTickCallback(this.remainingSeconds, this.totalSeconds, this.getProgress());
    }

    this.intervalId = setInterval(() => {
      this.remainingSeconds--;
      
      // Beep per gli ultimi 3 secondi di countdown
      if (this.remainingSeconds > 0 && this.remainingSeconds <= 3) {
        this.playBeep(440, 0.08);
      }

      if (this.onTickCallback) {
        this.onTickCallback(this.remainingSeconds, this.totalSeconds, this.getProgress());
      }

      if (this.remainingSeconds <= 0) {
        this.stop();
        this.playFinishAlarm();
        if (this.onCompleteCallback) {
          this.onCompleteCallback();
        }
      }
    }, 1000);
  }

  /**
   * Aggiunge o sottrae secondi al volo (+15s / -15s)
   */
  adjustTime(deltaSeconds) {
    if (!this.isRunning) return;
    this.remainingSeconds = Math.max(0, this.remainingSeconds + deltaSeconds);
    this.totalSeconds = Math.max(this.totalSeconds, this.remainingSeconds);
    if (this.onTickCallback) {
      this.onTickCallback(this.remainingSeconds, this.totalSeconds, this.getProgress());
    }
    if (this.remainingSeconds <= 0) {
      this.stop();
      this.playFinishAlarm();
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    }
  }

  /**
   * Ferma il timer corrente
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Calcola la percentuale di avanzamento (da 0 a 1)
   */
  getProgress() {
    if (this.totalSeconds <= 0) return 1;
    return (this.totalSeconds - this.remainingSeconds) / this.totalSeconds;
  }

  /**
   * Formatta secondi in mm:ss
   */
  static formatTime(totalSec) {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

// Istanza globale esportata
window.GymTimer = new RestTimer();
