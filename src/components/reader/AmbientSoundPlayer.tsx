import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Music, Sparkles, Clock } from 'lucide-react';
import { soundscapeEngine, SOUNDSCAPE_PRESETS, SoundscapeType } from '../../services/soundscapeService';

interface AmbientSoundPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbientSoundPlayer: React.FC<AmbientSoundPlayerProps> = ({ isOpen, onClose }) => {
  const [activePreset, setActivePreset] = useState<SoundscapeType>(soundscapeEngine.getCurrentPreset());
  const [isPlaying, setIsPlaying] = useState<boolean>(soundscapeEngine.isPlaying());
  const [volume, setVolume] = useState<number>(soundscapeEngine.getVolume());
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes

  useEffect(() => {
    let timerId: any = null;
    if (sleepTimer && isPlaying) {
      timerId = setTimeout(() => {
        soundscapeEngine.stop();
        setIsPlaying(false);
        setActivePreset('none');
        setSleepTimer(null);
      }, sleepTimer * 60 * 1000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [sleepTimer, isPlaying]);

  const handleSelectPreset = (presetId: SoundscapeType) => {
    if (activePreset === presetId && isPlaying) {
      soundscapeEngine.stop();
      setIsPlaying(false);
      setActivePreset('none');
    } else {
      soundscapeEngine.playPreset(presetId);
      setActivePreset(presetId);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundscapeEngine.stop();
      setIsPlaying(false);
    } else {
      const target = activePreset !== 'none' ? activePreset : 'river_waves';
      soundscapeEngine.playPreset(target);
      setActivePreset(target);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundscapeEngine.setVolume(newVol);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
      />

      {/* Floating Control Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md bg-gradient-to-br from-slate-950 via-[#0a1026] to-slate-950 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-slate-200 select-none animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Music className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-1.5">
                <span>Âm Thanh Không Gian</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h3>
              <p className="text-[11px] text-slate-400">
                Nhạc nền tự nhiên tăng cường độ tập trung khi đọc
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound Equalizer Visualizer */}
        <div className="py-4 flex items-center justify-center gap-1.5">
          {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 85, 65].map((h, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying 
                  ? 'bg-gradient-to-t from-cyan-500 to-indigo-400 animate-pulse' 
                  : 'bg-slate-700 h-2'
              }`}
              style={{
                height: isPlaying ? `${Math.max(8, (h * volume) / 1.5)}px` : '6px',
                animationDelay: `${idx * 0.08}s`
              }}
            />
          ))}
        </div>

        {/* Sound Presets Grid */}
        <div className="space-y-2 py-2">
          {SOUNDSCAPE_PRESETS.map(preset => {
            const isSelected = activePreset === preset.id && isPlaying;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border-cyan-400/60 text-white shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                    : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform ${
                    isSelected ? 'scale-110 bg-cyan-500/20' : 'bg-slate-800 group-hover:scale-105'
                  }`}>
                    {preset.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-xs sm:text-sm text-white truncate flex items-center gap-2">
                      <span>{preset.name}</span>
                      {isSelected && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase">
                          Đang phát
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {preset.subtitle}
                    </p>
                  </div>
                </div>

                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-400 group-hover:text-white'
                }`}>
                  {isSelected ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume & Sleep Timer Controls */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          {/* Volume Slider */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleVolumeChange(volume === 0 ? 0.45 : 0)}
              className="text-slate-400 hover:text-white"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono text-cyan-300 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Sleep Timer Pills */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Hẹn giờ tắt:</span>
            </span>

            <div className="flex items-center gap-1.5">
              {[
                { min: null, label: 'Tắt' },
                { min: 15, label: '15p' },
                { min: 30, label: '30p' },
                { min: 60, label: '60p' }
              ].map(opt => (
                <button
                  key={String(opt.min)}
                  onClick={() => setSleepTimer(opt.min)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                    sleepTimer === opt.min
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={() => {
              soundscapeEngine.stop();
              setIsPlaying(false);
              setActivePreset('none');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            Dừng âm thanh
          </button>

          <button
            onClick={handleTogglePlay}
            className="flex items-center space-x-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Tạm Dừng' : 'Bật Ngay'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
