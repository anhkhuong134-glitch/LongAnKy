/**
 * Web Audio API Soundscape Engine for "Long Ấn Thức Tỉnh"
 * Generates procedural organic ambient soundscapes (River Waves, Harbor Rain, Clockwork Gears, Mystic Bells)
 * completely in-browser without any external audio asset dependency.
 */

export type SoundscapeType = 'none' | 'river_waves' | 'harbor_rain' | 'clockwork_gears' | 'mystic_bell';

export interface SoundscapePreset {
  id: SoundscapeType;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
}

export const SOUNDSCAPE_PRESETS: SoundscapePreset[] = [
  {
    id: 'river_waves',
    name: 'Sóng Đêm Sông Asera',
    subtitle: 'Nước vỗ bờ đá huyền ảo',
    icon: '🌊',
    description: 'Âm thanh sóng nước trầm lắng của dòng Asera về đêm, mang cảm giác kỳ bí và thư thái.'
  },
  {
    id: 'harbor_rain',
    name: 'Mưa Rào Bến Arumo',
    subtitle: 'Mưa đêm rơi trên mái gỗ',
    icon: '🌧️',
    description: 'Tiếng mưa rơi nhẹ nhàng trên mặt nước và bến tàu bốc xếp, tối ưu cho việc tập trung đọc sâu.'
  },
  {
    id: 'clockwork_gears',
    name: 'Bánh Răng & Xưởng Máy Cổ',
    subtitle: 'Nhịp tích tắc cơ khí êm dịu',
    icon: '⚙️',
    description: 'Nhịp tích tắc đều đặn từ các cụm bánh răng tời máy và guồng nước xưởng Rento.'
  },
  {
    id: 'mystic_bell',
    name: 'Chuông Gió & Tiếng Nước Trầm',
    subtitle: 'Thanh âm thiền định kỳ ảo',
    icon: '🔔',
    description: 'Những hồi chuông ngân vang thanh thoát hòa cùng tiếng ngân rồng cổ phong dưới đáy vực.'
  }
];

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentPreset: SoundscapeType = 'none';
  private volume: number = 0.45;
  private isRunning: boolean = false;
  private cleanupFns: (() => void)[] = [];
  private bellIntervalId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentPreset(): SoundscapeType {
    return this.currentPreset;
  }

  public isPlaying(): boolean {
    return this.isRunning && this.currentPreset !== 'none';
  }

  public stop() {
    this.cleanup();
    this.currentPreset = 'none';
    this.isRunning = false;
  }

  private cleanup() {
    if (this.bellIntervalId) {
      clearInterval(this.bellIntervalId);
      this.bellIntervalId = null;
    }
    this.cleanupFns.forEach(fn => {
      try { fn(); } catch (_) {}
    });
    this.cleanupFns = [];
  }

  public playPreset(preset: SoundscapeType) {
    if (preset === 'none') {
      this.stop();
      return;
    }

    this.initContext();
    this.cleanup();
    this.currentPreset = preset;
    this.isRunning = true;

    if (!this.ctx || !this.masterGain) return;

    switch (preset) {
      case 'river_waves':
        this.createRiverWaves();
        break;
      case 'harbor_rain':
        this.createHarborRain();
        break;
      case 'clockwork_gears':
        this.createClockworkGears();
        break;
      case 'mystic_bell':
        this.createMysticBell();
        break;
    }
  }

  // Preset 1: River Waves (Deep pink noise + sweeping resonant lowpass filter)
  private createRiverWaves() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating water surge
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.cleanupFns.push(() => {
      whiteNoise.stop();
      lfo.stop();
      whiteNoise.disconnect();
      filter.disconnect();
      lfo.disconnect();
    });
  }

  // Preset 2: Harbor Rain (Soft white noise with randomized droplet clicks)
  private createHarborRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.6, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    this.cleanupFns.push(() => {
      noise.stop();
      noise.disconnect();
      filter.disconnect();
    });
  }

  // Preset 3: Clockwork Gears (Rhythmic wooden mechanical ticks)
  private createClockworkGears() {
    if (!this.ctx || !this.masterGain) return;

    let isTick = true;
    const interval = setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isTick ? 850 : 640, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
      isTick = !isTick;
    }, 750); // Tick every 750ms

    this.cleanupFns.push(() => clearInterval(interval));
  }

  // Preset 4: Mystic Bell (Singing bowl / Eastern wind bell harmony)
  private createMysticBell() {
    if (!this.ctx || !this.masterGain) return;

    const ringBell = () => {
      if (!this.ctx || !this.masterGain) return;

      const freqs = [380, 570, 855]; // Harmonious overtone chord
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const initialGain = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, this.ctx!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 5.5);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 6.0);
      });
    };

    ringBell();
    this.bellIntervalId = setInterval(ringBell, 9000); // Bells ring every 9 seconds

    this.cleanupFns.push(() => {
      if (this.bellIntervalId) clearInterval(this.bellIntervalId);
    });
  }
}

export const soundscapeEngine = new SoundscapeEngine();
