import React, { useState } from 'react';
import { GameMode, BladeType } from '../types';
import { TEXTS } from '../utils/i18n';
import { soundManager } from '../utils/sound';
import { Sword, Sparkles, Flame, Snowflake, Shield, ShieldCheck, Info } from 'lucide-react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { AboutModal } from './AboutModal';

interface Props {
  onStartGame: (mode: GameMode) => void;
  selectedBlade: BladeType;
  onSelectBlade: (blade: BladeType) => void;
  highScores: Record<GameMode, number>;
}

export const MenuOverlay: React.FC<Props> = ({
  onStartGame,
  selectedBlade,
  onSelectBlade,
  highScores,
}) => {
  const [showBladeSelector, setShowBladeSelector] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const BLADES: { id: BladeType; name: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'classic',
      name: TEXTS.bladeClassic,
      desc: 'Forged polished steel blade',
      icon: <Sword className="w-5 h-5 text-cyan-300" />,
    },
    {
      id: 'flame',
      name: TEXTS.bladeFlame,
      desc: 'Fiery blazing cuts & flying embers',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'ice',
      name: TEXTS.bladeIce,
      desc: 'Glacial frost trail & snowflakes',
      icon: <Snowflake className="w-5 h-5 text-sky-300" />,
    },
    {
      id: 'rainbow',
      name: TEXTS.bladeRainbow,
      desc: 'Prismatic rainbow stream',
      icon: <Sparkles className="w-5 h-5 text-pink-400" />,
    },
    {
      id: 'shadow',
      name: TEXTS.bladeShadow,
      desc: 'Dark void energy trail',
      icon: <Shield className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-4 sm:p-8 pointer-events-auto bg-black/40 backdrop-blur-[2px] overflow-y-auto">
      {/* Title Header */}
      <div className="flex flex-col items-center text-center mt-2 sm:mt-6 shrink-0">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-ninja text-amber-400 drop-shadow-[0_6px_16px_rgba(0,0,0,0.95)] tracking-wider">
          {TEXTS.title}
        </h1>
      </div>

      {/* Mode Selection Cards (Responsive Grid auto-adjusting for mobile phones and desktops) */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 my-auto py-2">
        {/* Classic Mode */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartGame('classic');
          }}
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-stone-900/85 hover:bg-stone-800/95 border border-amber-600/30 hover:border-amber-500 shadow-xl transition-all duration-200 text-left flex flex-col justify-between min-h-[110px] sm:h-48 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl">🍉</span>
            <span className="text-[11px] sm:text-xs font-mono text-amber-400/90 font-bold tabular-nums">
              {TEXTS.highScore}: {highScores.classic}
            </span>
          </div>
          <div className="my-1 sm:my-0">
            <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              {TEXTS.classic}
            </h2>
            <p className="hidden sm:block mt-1 text-xs text-stone-300 leading-relaxed">
              {TEXTS.classicDesc}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400/90 pt-2 border-t border-white/10">
            <span>{TEXTS.play}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Zen Mode */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartGame('zen');
          }}
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-stone-900/85 hover:bg-stone-800/95 border border-emerald-600/30 hover:border-emerald-500 shadow-xl transition-all duration-200 text-left flex flex-col justify-between min-h-[110px] sm:h-48 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl">🍎</span>
            <span className="text-[11px] sm:text-xs font-mono text-emerald-400/90 font-bold tabular-nums">
              {TEXTS.highScore}: {highScores.zen}
            </span>
          </div>
          <div className="my-1 sm:my-0">
            <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
              {TEXTS.zen}
            </h2>
            <p className="hidden sm:block mt-1 text-xs text-stone-300 leading-relaxed">
              {TEXTS.zenDesc}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400/90 pt-2 border-t border-white/10">
            <span>{TEXTS.play}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Arcade Mode */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartGame('arcade');
          }}
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-stone-900/85 hover:bg-stone-800/95 border border-purple-600/30 hover:border-purple-500 shadow-xl transition-all duration-200 text-left flex flex-col justify-between min-h-[110px] sm:h-48 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl">🍌</span>
            <span className="text-[11px] sm:text-xs font-mono text-purple-400/90 font-bold tabular-nums">
              {TEXTS.highScore}: {highScores.arcade}
            </span>
          </div>
          <div className="my-1 sm:my-0">
            <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
              {TEXTS.arcade}
            </h2>
            <p className="hidden sm:block mt-1 text-xs text-stone-300 leading-relaxed">
              {TEXTS.arcadeDesc}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-purple-400/90 pt-2 border-t border-white/10">
            <span>{TEXTS.play}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>

      {/* Footer bar with Blade selector, About and Privacy Policy */}
      <div className="w-full max-w-4xl flex items-center justify-center gap-2 sm:gap-3 shrink-0 pb-1 flex-wrap">
        <button
          onClick={() => {
            soundManager.playClick();
            setShowBladeSelector(!showBladeSelector);
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg"
        >
          <Sword className="w-4 h-4 text-amber-400" />
          <span>{TEXTS.blades}:</span>
          <span className="text-amber-400">
            {BLADES.find(b => b.id === selectedBlade)?.name}
          </span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowAbout(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shadow-lg"
          title="About Game / ක්‍රීඩාව ගැන"
        >
          <Info className="w-4 h-4 text-amber-400" />
          <span>{TEXTS.about}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowPrivacyPolicy(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shadow-lg"
          title="Privacy Policy / රහස්‍යතා ප්‍රතිපත්තිය"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{TEXTS.privacyPolicy}</span>
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {/* Blade Selection Modal Drawer */}
      {showBladeSelector && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-600/40 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Sword className="w-5 h-5" />
                {TEXTS.blades}
              </h3>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowBladeSelector(false);
                }}
                className="text-stone-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {BLADES.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectBlade(b.id);
                    setShowBladeSelector(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedBlade === b.id
                      ? 'bg-amber-950/40 border-amber-500 shadow-md'
                      : 'bg-stone-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {b.icon}
                    <div>
                      <div className="text-sm font-semibold text-white">{b.name}</div>
                      <div className="text-xs text-stone-400">{b.desc}</div>
                    </div>
                  </div>
                  {selectedBlade === b.id && (
                    <span className="text-xs font-bold text-amber-400">✓ Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
