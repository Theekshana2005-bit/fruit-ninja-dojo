import React, { useState } from 'react';
import { Info, User, Sparkles, Heart, Rocket, MessageSquare, X } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface Props {
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ onClose }) => {
  const [lang, setLang] = useState<'si' | 'en'>('si');

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-stone-950 border border-amber-600/40 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-stone-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Info className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-ninja text-amber-400 tracking-wide">
                {lang === 'si' ? 'ක්‍රීඩාව ගැන (About)' : 'About Fruit Ninja'}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400">
                Fruit Ninja Dojo · Created by Theekshana
              </p>
            </div>
          </div>

          {/* Language Switcher & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-900 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setLang('si');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  lang === 'si'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setLang('en');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
          
          {/* Creator Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900/80 to-stone-900/40 border border-amber-500/30 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                {lang === 'si' ? 'නිර්මාතෘ (Developer)' : 'Developer & Creator'}
              </div>
              <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Theekshana</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                  Author
                </span>
              </div>
            </div>
          </div>

          {/* AI Collaboration Box */}
          <div className="p-4 rounded-2xl bg-stone-900/70 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'si' ? 'Gemini AI සහයෝගීතාව' : 'Built with Gemini AI'}</span>
            </div>
            <p className="text-stone-300 pl-6">
              {lang === 'si'
                ? 'මෙම Fruit Ninja Dojo ක්‍රීඩාව Theekshana විසින් Gemini AI තාක්ෂණය උපයෝගී කරගනිමින්, නිවැරදි භෞතික විද්‍යාත්මක ගණනය කිරීම් (Physics), සැබෑ ශබ්ද ප්‍රයෝග (Realistic Audio) සහ උසස් තත්වයේ UI අත්දැකීමක් සහිතව නිර්මාණය කරන ලද්දකි.'
                : 'This Fruit Ninja Dojo arcade game was proudly built by Theekshana in collaboration with Gemini AI, featuring responsive 1:1 slicing physics, realistic acoustic sound design, and an authentic arcade experience.'}
            </p>
          </div>

          {/* Future Plans */}
          <div className="p-4 rounded-2xl bg-stone-900/70 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm">
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'si' ? 'ඉදිරි සංවර්ධන සැලසුම්' : 'Future Development & Roadmap'}</span>
            </div>
            <p className="text-stone-300 pl-6">
              {lang === 'si'
                ? 'මෙම ක්‍රීඩාව ඉදිරියට තවත් බොහෝ අලුත් අංගයන්ගෙන් (New Blades, Game Modes, Special Powers, Leaderboards) සමන්විතව තවදුරටත් සංවර්ධනය කිරීමට බලාපොරොත්තු වේ.'
                : 'We are actively planning to expand this game with brand new Katana blade trails, new special fruits, multiplayer modes, and global leaderboards.'}
            </p>
          </div>

          {/* User Feedback Callout */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{lang === 'si' ? 'ඔබගේ ප්‍රතිචාර (User Feedback)' : 'Player Feedback'}</span>
            </div>
            <p className="text-amber-200/90 pl-6">
              {lang === 'si'
                ? 'ක්‍රීඩාව පිළිබඳව ඔබගේ අදහස්, යෝජනා සහ හොඳ ප්‍රතිචාර ඉතාම සාදරයෙන් බලාපොරොත්තු වෙමු! ක්‍රීඩාව තවදුරටත් හොඳම තත්වයට ගෙන ඒමට ඔබගේ සහයෝගය ඉමහත් ශක්තියකි.'
                : 'Your valuable feedback, suggestions, and positive reviews are deeply appreciated! Your support motivates continuous improvements and updates.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-stone-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Made with passion</span>
          </div>
          <button
            onClick={handleClose}
            className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {lang === 'si' ? 'තේරුම් ගත්තා (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
