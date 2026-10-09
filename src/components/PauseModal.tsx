import React, { useState } from 'react';
import { GameMode } from '../types';
import { TEXTS } from '../utils/i18n';
import { soundManager } from '../utils/sound';
import { Play, RotateCcw, Home, ShieldCheck } from 'lucide-react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

interface Props {
  gameMode: GameMode;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onReturnToMenu: () => void;
}

export const PauseModal: React.FC<Props> = ({
  gameMode,
  score,
  onResume,
  onRestart,
  onReturnToMenu,
}) => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto select-none">
      <div className="w-full max-w-xs sm:max-w-sm bg-stone-950 border border-amber-600/30 rounded-3xl p-6 text-center shadow-2xl">
        <h3 className="text-2xl font-ninja text-amber-400 drop-shadow">
          {TEXTS.paused}
        </h3>
        <p className="text-xs text-stone-400 mt-1 uppercase font-semibold">
          {TEXTS[gameMode]} · {TEXTS.score}: {score}
        </p>

        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>{TEXTS.resume}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-xs border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{TEXTS.playAgain}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onReturnToMenu();
            }}
            className="w-full py-2.5 px-5 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{TEXTS.menu}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowPrivacy(true);
            }}
            className="mt-1 text-[11px] text-stone-500 hover:text-amber-400 flex items-center justify-center gap-1 transition-colors cursor-pointer self-center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
            <span>{TEXTS.privacyPolicy}</span>
          </button>
        </div>
      </div>

      {showPrivacy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
};
