import React, { useState } from 'react';
import { ShieldCheck, X, Globe, Lock, Database, Music2, EyeOff, CheckCircle } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface Props {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<Props> = ({ onClose }) => {
  const [lang, setLang] = useState<'si' | 'en'>('si');

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-stone-950 border border-amber-600/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-stone-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-ninja text-amber-400 tracking-wide">
                {lang === 'si' ? 'රහස්‍යතා ප්‍රතිපත්තිය' : 'Privacy Policy'}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400">
                Fruit Ninja Dojo · {lang === 'si' ? 'යාවත්කාලීන කළ දිනය: 2026 ඔක්තෝබර්' : 'Last Updated: October 2026'}
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

        {/* Scrollable Policy Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
          {lang === 'si' ? (
            <>
              {/* Sinhala Version */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Fruit Ninja Dojo</strong> ක්‍රීඩාව ඔබගේ පෞද්ගලිකත්වයට උපරිම ගෞරවයක් දක්වයි. 
                  අප ඔබගේ කිසිදු පුද්ගලික තොරතුරක් (Personal Information) රැස් කිරීම, හුවමාරු කිරීම හෝ තෙවන පාර්ශවයකට විකිණීම සිදු නොකරයි.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  1. රැස්කරනු ලබන තොරතුරු (Information We Collect)
                </h3>
                <p className="text-stone-300 pl-6">
                  අපගේ ක්‍රීඩාව ක්‍රියාත්මක වීමේදී ඔබගේ නම, දුරකථන අංක, ඊමේල් ලිපින, මුරපද හෝ භූගෝලීය ස්ථානය (GPS Location) ආදී කිසිදු පෞද්ගලික දත්තයක් ඉල්ලා නොසිටින අතර රැස් නොකරයි.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  2. ඔබගේ උපාංගයේ මතකය (Local Storage) භාවිතය
                </h3>
                <div className="text-stone-300 pl-6 space-y-1">
                  <p>
                    ක්‍රීඩාව වඩාත් පහසු කිරීම සඳහා පහත දත්ත ඔබගේ වෙබ් බ්‍රවුසරයේ <strong>Local Storage</strong> තුළ පමණක් සුරැකේ:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-400">
                    <li>ඔබ ලබාගත් උපරිම ලකුණු (High Scores - Classic, Zen, Arcade)</li>
                    <li>ඔබ තෝරාගත් කඩුව (Selected Blade Katana)</li>
                  </ul>
                  <p className="text-[11px] text-stone-400 italic">
                    * මෙම දත්ත කිසිදු බාහිර සේවාදායකයකට (External Server) යැවීම සිදු නොවන අතර, ඕනෑම මොහොතක ඔබගේ බ්‍රවුසරයේ Cache/History මකා දැමීමෙන් ඉවත් කළ හැක.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-amber-400" />
                  3. ශ්‍රව්‍ය සහ බ්‍රවුසර අවසර (Audio & Browser APIs)
                </h3>
                <p className="text-stone-300 pl-6">
                  ක්‍රීඩාවේ කඩු කැපුම් ශබ්ද සහ චීන පසුබිම් සංගීතය වාදනය කිරීම සඳහා Web Audio API භාවිත කෙරේ. මෙහිදී ඔබගේ මයික්‍රෆෝනය (Microphone) හෝ කැමරාව (Camera) වෙත කිසිදු අවසරයක් ඉල්ලා නොසිටින අතර, කිසිදු ශබ්දයක් පටිගත නොකෙරේ.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  4. තෙවන පාර්ශවීය වෙළඳ දැන්වීම් හෝ Tracking නැත
                </h3>
                <p className="text-stone-300 pl-6">
                  අපගේ ක්‍රීඩාව තුළ කිසිදු තෙවන පාර්ශවීය වෙළඳ දැන්වීම් ජාල (Ad Networks), පරිශීලක හැසිරීම් නිරීක්ෂණ කේත (Tracking Trackers) හෝ කුකීස් (Tracking Cookies) අඩංගු නොවේ.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  5. ළමුන්ගේ ආරක්ෂාව සහ රහස්‍යතාව (Children's Privacy)
                </h3>
                <p className="text-stone-300 pl-6">
                  Fruit Ninja Dojo ක්‍රීඩාව සියලු වයස් කාණ්ඩයන්ට (ළමුන් ඇතුළුව) සුදුසු වන පරිදි සකසා ඇති අතර, COPPA (Children's Online Privacy Protection Act) නීතිරීතිවලට පූර්ණ වශයෙන් අනුකූල වේ.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* English Version */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Fruit Ninja Dojo</strong> is committed to protecting your privacy. We do not collect, store, share, or sell any of your personal identifiable information.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  1. Information We Collect
                </h3>
                <p className="text-stone-300 pl-6">
                  We collect zero personal data. We do not ask for your name, email, phone number, location, contacts, or account credentials. You can play freely without registration.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  2. Local Storage Usage
                </h3>
                <div className="text-stone-300 pl-6 space-y-1">
                  <p>
                    To save your game progress, the app exclusively uses your browser's local storage:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-400">
                    <li>Your best high scores per game mode (Classic, Zen, Arcade)</li>
                    <li>Your chosen active blade style (Original, Flame, Frost, etc.)</li>
                  </ul>
                  <p className="text-[11px] text-stone-400 italic">
                    * This data stays 100% on your device and is never sent to any external server. You can clear it anytime via your browser settings.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-amber-400" />
                  3. Audio & Permissions
                </h3>
                <p className="text-stone-300 pl-6">
                  We use standard Web Audio APIs strictly to play sound effects (blade slices, fruit splats, gong) and Chinese background music. We never access your microphone or record audio.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  4. Third-Party Tracking & Advertising
                </h3>
                <p className="text-stone-300 pl-6">
                  There are zero third-party advertising networks, analytics trackers, or surveillance cookies in this application.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  5. Children's Privacy
                </h3>
                <p className="text-stone-300 pl-6">
                  Our game is family-friendly and safe for players of all ages. Because no personal data is collected, it is fully COPPA compliant.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-stone-900/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-400">
            {lang === 'si' ? 'ස්තූතියි Fruit Ninja Dojo සමග ක්‍රීඩා කිරීම ගැන!' : 'Thank you for playing Fruit Ninja Dojo!'}
          </span>
          <button
            onClick={handleClose}
            className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {lang === 'si' ? 'තේරුම් ගත්තා (Close)' : 'I Understand'}
          </button>
        </div>

      </div>
    </div>
  );
};
