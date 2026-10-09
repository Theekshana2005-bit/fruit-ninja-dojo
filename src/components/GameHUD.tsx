import React from 'react';
import { GameMode, GameState } from '../types';
import { TEXTS } from '../utils/i18n';
import { soundManager } from '../utils/sound';
import { Volume2, VolumeX, Music, Pause } from 'lucide-react';

interface Props {
  gameState: GameState;
  gameMode: GameMode;
  score: number;
  highScore: number;
  strikes: number;
  timeRemaining: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onPauseToggle: () => void;
}

export const GameHUD: React.FC<Props> = ({
  gameState,
  gameMode,
  score,
  highScore,
  strikes,
  timeRemaining,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onPauseToggle,
}) => {
  // When in MENU screen, only show audio controls on top-right to prevent overlapping with the Title
  if (gameState === 'MENU') {
    return (
      <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-5 flex items-center justify-end select-none">
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className={`p-2 sm:p-2.5 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-black/45 hover:bg-black/65 text-amber-400 border-white/10'
                : 'bg-black/45 text-neutral-500 border-white/5'
            }`}
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Music Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMusic();
            }}
            className={`p-2 sm:p-2.5 rounded-lg border transition-colors cursor-pointer ${
              musicEnabled
                ? 'bg-black/45 hover:bg-black/65 text-amber-400 border-white/10'
                : 'bg-black/45 text-neutral-500 border-white/5'
            }`}
            title={musicEnabled ? 'Stop Music' : 'Start Music'}
            aria-label="Toggle Music"
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-5 flex items-start justify-between select-none">
      {/* Left: Score & High Score */}
      <div className="flex flex-col pointer-events-auto">
        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="text-3xl sm:text-5xl font-ninja text-amber-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] tracking-wide">
            {score}
          </span>
          <div className="flex flex-col text-[11px] sm:text-xs text-amber-200/80 font-medium">
            <span className="tabular-nums">{TEXTS.highScore}: {highScore}</span>
            <span className="text-amber-400 font-semibold">{TEXTS[gameMode]}</span>
          </div>
        </div>
      </div>

      {/* Middle: 3 Lives (Classic) or Countdown Timer (Zen/Arcade) */}
      <div className="pointer-events-auto flex items-center justify-center">
        {gameMode === 'classic' ? (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/45 backdrop-blur-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow-lg">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-bold mr-0.5">
              LIVES
            </span>
            {[0, 1, 2].map(idx => {
              const isStruck = idx < strikes;
              return (
                <span
                  key={idx}
                  className={`text-lg sm:text-xl transition-all duration-200 ${
                    isStruck
                      ? 'text-red-500 scale-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : 'text-emerald-400 scale-110 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                  }`}
                  title={isStruck ? 'Life Lost' : 'Active Life'}
                >
                  {isStruck ? '✖' : '❤️'}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-black/45 backdrop-blur-sm px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow-lg">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-bold">
              {TEXTS.time}
            </span>
            <span
              className={`text-xl sm:text-2xl font-mono font-bold tabular-nums ${
                timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
              }`}
            >
              {timeRemaining}s
            </span>
          </div>
        )}
      </div>

      {/* Right: Audio and Pause controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Sound FX Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleSound();
          }}
          className={`p-2 sm:p-2.5 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-black/45 hover:bg-black/65 text-amber-400 border-white/10'
              : 'bg-black/45 text-neutral-500 border-white/5'
          }`}
          title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Music Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleMusic();
          }}
          className={`p-2 sm:p-2.5 rounded-lg border transition-colors cursor-pointer ${
            musicEnabled
              ? 'bg-black/45 hover:bg-black/65 text-amber-400 border-white/10'
              : 'bg-black/45 text-neutral-500 border-white/5'
          }`}
          title={musicEnabled ? 'Stop Music' : 'Start Music'}
          aria-label="Toggle Music"
        >
          <Music className="w-4 h-4" />
        </button>

        {/* Pause Button */}
        {gameState === 'PLAYING' && (
          <button
            onClick={() => {
              soundManager.playClick();
              onPauseToggle();
            }}
            className="p-2 sm:p-2.5 rounded-lg bg-black/45 hover:bg-black/65 text-white border border-white/10 transition-colors cursor-pointer"
            title="Pause Game"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
