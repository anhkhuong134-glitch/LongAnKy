// Ambient Sound Engine using Web Audio API procedural synthesis
// Zero external assets, infinite seamless soothing soundscapes for deep reading immersion

export type AmbientSoundType = 'none' | 'rain' | 'campfire' | 'river' | 'wind';

export interface AmbientPreset {
  id: AmbientSoundType;
  name: string;
  icon: string;
  description: string;
}

export const AMBIENT_PRESETS: AmbientPreset[] = [
  { id: 'none', name: 'Tắt Âm Nền', icon: '🔇', description: 'Yên tĩnh hoàn toàn' },
  { id: 'rain', name: 'Mưa Đêm Mái Ngói', icon: '🌧️', description: 'Tiếng mưa rơi nhẹ nhàng trên hiên ngói cổ trang' },
  { id: 'campfire', name: 'Lửa Trại Tu Tiên', icon: '🔥', description: 'Tiếng củi lửa bập bùng tí tách ấm áp' },
  { id: 'river', name: 'Dòng Nước Hoàng Hà', icon: '🌊', description: 'Tiếng sóng nước trôi êm đềm miên man' },
  { id: 'wind', name: 'Gió Rừng Trúc', icon: '🍃', description: 'Tiếng gió vi vu qua rặng trúc thanh tịnh' },
];

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private masterGain: GainNode | null = null;
  private volume: number = 0.35; // 0 to 1
  private isMuted: boolean = false;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private crackleTimer: any = null;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (!this.masterGain) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
  }

  // Create pink noise buffer
  private createNoiseBuffer(durationSeconds = 5): AudioBuffer {
    if (!this.audioCtx) throw new Error('No context');
    const bufferSize = this.audioCtx.sampleRate * durationSeconds;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public setSound(type: AmbientSoundType) {
    this.stopCurrent();
    this.currentType = type;

    if (type === 'none') return;
    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    if (type === 'rain') {
      this.startRain();
    } else if (type === 'campfire') {
      this.startCampfire();
    } else if (type === 'river') {
      this.startRiver();
    } else if (type === 'wind') {
      this.startWind();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private stopCurrent() {
    if (this.crackleTimer) {
      clearInterval(this.crackleTimer);
      this.crackleTimer = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // 1. Rain Synthesizer
  private startRain() {
    if (!this.audioCtx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(4);

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);

    const highpass = this.audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(300, this.audioCtx.currentTime);

    const rainGain = this.audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);

    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(this.masterGain);

    source.start();
    this.activeNodes.push(source, filter, highpass, rainGain);
  }

  // 2. Campfire Synthesizer
  private startCampfire() {
    if (!this.audioCtx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(4);

    // Warm low rumble
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    const rumbleGain = this.audioCtx.createGain();
    rumbleGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

    source.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    source.start();

    this.activeNodes.push(source, filter, rumbleGain);

    // Random crackle pops
    const triggerCrackle = () => {
      if (!this.audioCtx || !this.masterGain || this.currentType !== 'campfire') return;
      const osc = this.audioCtx.createOscillator();
      const popGain = this.audioCtx.createGain();
      const popFilter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 800, this.audioCtx.currentTime);

      popFilter.type = 'bandpass';
      popFilter.frequency.setValueAtTime(1200 + Math.random() * 1500, this.audioCtx.currentTime);
      popFilter.Q.setValueAtTime(3, this.audioCtx.currentTime);

      const popTime = this.audioCtx.currentTime;
      popGain.gain.setValueAtTime(0.12 * Math.random(), popTime);
      popGain.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.04 + Math.random() * 0.04);

      osc.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(this.masterGain);

      osc.start(popTime);
      osc.stop(popTime + 0.1);
    };

    this.crackleTimer = setInterval(() => {
      if (Math.random() > 0.35) {
        triggerCrackle();
      }
    }, 180);
  }

  // 3. Flowing River Synthesizer
  private startRiver() {
    if (!this.audioCtx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(5);

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

    // Subtle wave LFO
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, this.audioCtx.currentTime);

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(250, this.audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const riverGain = this.audioCtx.createGain();
    riverGain.gain.setValueAtTime(0.65, this.audioCtx.currentTime);

    source.connect(filter);
    filter.connect(riverGain);
    riverGain.connect(this.masterGain);

    source.start();
    lfo.start();
    this.activeNodes.push(source, filter, lfo, lfoGain, riverGain);
  }

  // 4. Bamboo Wind Synthesizer
  private startWind() {
    if (!this.audioCtx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(6);

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(2.5, this.audioCtx.currentTime);

    // Slow wind swell LFO
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime);

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(320, this.audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = this.audioCtx.createGain();
    windGain.gain.setValueAtTime(0.55, this.audioCtx.currentTime);

    source.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    source.start();
    lfo.start();
    this.activeNodes.push(source, filter, lfo, lfoGain, windGain);
  }
}

export const ambientAudio = new AmbientAudioEngine();
