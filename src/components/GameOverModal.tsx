import React from 'react';
import { GameMode } from '../types';
import { TEXTS } from '../utils/i18n';
import { soundManager } from '../utils/sound';
import { RotateCcw, Home, Trophy, Award } from 'lucide-react';

interface Props {
  score: number;
  highScore: number;
  gameMode: GameMode;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<Props> = ({
  score,
  highScore,
  gameMode,
  onPlayAgain,
  onReturnToMenu,
}) => {
  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto select-none">
      <div className="w-full max-w-sm sm:max-w-md bg-stone-950 border border-amber-600/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        <h2 className="text-3xl sm:text-4xl font-ninja text-amber-400 drop-shadow">
          {TEXTS.gameOver}
        </h2>
        <p className="text-xs text-amber-200/70 font-semibold tracking-wider uppercase mt-1">
          {TEXTS[gameMode]}
        </p>

        {/* Score Display */}
        <div className="my-5 sm:my-6 py-5 sm:py-6 px-4 bg-stone-900/80 rounded-2xl border border-white/5 shadow-inner">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
            {TEXTS.finalScore}
          </div>
          <div className="text-5xl sm:text-6xl font-ninja text-white mt-1 mb-2 font-black tabular-nums drop-shadow-md">
            {score}
          </div>

          {isNewHighScore ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full">
              <Award className="w-4 h-4 text-amber-400" />
              <span>NEW HIGH SCORE!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{TEXTS.highScore}: {highScore}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{TEXTS.playAgain}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onReturnToMenu();
            }}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white font-semibold text-xs border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{TEXTS.menu}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
