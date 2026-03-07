import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Star, Sparkles, PenLine } from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";

type Mood = { emoji: string; label: string; color: string };

const MOODS: Mood[] = [
  { emoji: "😴", label: "Groggy", color: "#94a3b8" },
  { emoji: "😐", label: "Neutral", color: "#64748b" },
  { emoji: "😊", label: "Rested", color: "#34d399" },
  { emoji: "😄", label: "Energized", color: "#fbbf24" },
  { emoji: "🤩", label: "Amazing", color: "#a78bfa" },
];

export default function MorningCheckInScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [step, setStep] = useState(0); // 0: mood, 1: rating, 2: journal, 3: done
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [sleepRating, setSleepRating] = useState(0);
  const [dreamRecall, setDreamRecall] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [remembersDream, setRemembersDream] = useState<boolean | null>(null);

  const saveCheckIn = () => {
    localStorage.setItem("dreamSync_lastCheckIn", Date.now().toString());
  };

  const handleComplete = () => {
    saveCheckIn();
    setStep(3);
    setTimeout(() => navigate("/home"), 2000);
  };

  const handleSkip = () => {
    saveCheckIn();
    navigate("/home");
  };

  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <div className={`absolute inset-0 -z-10 ${isDark ? 'bg-[#110d1f]' : 'bg-[#F4F2FA]'}`} />
      <div className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b opacity-60 -z-10 ${isDark ? 'from-indigo-900/30 to-transparent' : 'from-amber-100/50 to-transparent'}`} />

      {/* Top bar with skip */}
      <div className="flex items-center justify-between pt-14 px-5">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-indigo-500' : `w-4 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`
              }`}
            />
          ))}
        </div>
        {step < 3 && (
          <button
            onClick={handleSkip}
            className={`text-xs font-medium uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 pb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 0: Mood */}
          {step === 0 && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col"
            >
              <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                How do you feel?
              </h1>
              <p className={`text-sm mb-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tap the mood that matches how you woke up
              </p>

              <div className="flex-1 flex flex-col justify-center gap-4">
                {MOODS.map((mood, i) => (
                  <motion.button
                    key={mood.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedMood(mood)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      selectedMood?.label === mood.label
                        ? `border-[${mood.color}] ${isDark ? 'bg-white/10' : 'bg-indigo-50'}`
                        : isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'
                    }`}
                    style={{
                      borderColor: selectedMood?.label === mood.label ? mood.color : undefined,
                      boxShadow: selectedMood?.label === mood.label ? `0 0 20px ${mood.color}20` : undefined,
                    }}
                  >
                    <motion.span
                      className="text-3xl"
                      animate={selectedMood?.label === mood.label ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {mood.emoji}
                    </motion.span>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {mood.label}
                    </span>
                    {selectedMood?.label === mood.label && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: mood.color }}>
                          <ChevronRight className="w-3 h-3 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => selectedMood && setStep(1)}
                disabled={!selectedMood}
                className={`mt-6 w-full py-4 rounded-2xl text-white font-semibold transition-all ${
                  selectedMood ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-indigo-500/30 cursor-not-allowed'
                }`}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Step 1: Sleep Rating */}
          {step === 1 && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col"
            >
              <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Rate your sleep
              </h1>
              <p className={`text-sm mb-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                How would you rate last night's sleep quality?
              </p>

              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <motion.button
                      key={n}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSleepRating(n)}
                      className="p-2"
                    >
                      <Star
                        className={`w-10 h-10 transition-all ${n <= sleepRating ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : isDark ? 'text-white/15' : 'text-slate-200'}`}
                        fill={n <= sleepRating ? "currentColor" : "none"}
                        strokeWidth={n <= sleepRating ? 0 : 1.5}
                      />
                    </motion.button>
                  ))}
                </div>
                {sleepRating > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    {sleepRating <= 2 ? "Rough night — we'll help you improve" : sleepRating <= 4 ? "Not bad — let's make it even better" : "Fantastic! Keep it up"}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => sleepRating > 0 && setStep(2)}
                disabled={sleepRating === 0}
                className={`mt-6 w-full py-4 rounded-2xl text-white font-semibold transition-all ${
                  sleepRating > 0 ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-indigo-500/30 cursor-not-allowed'
                }`}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Dream Journal */}
          {step === 2 && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col"
            >
              <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Dream Recall
              </h1>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Do you remember any dreams from last night?
              </p>

              {remembersDream === null ? (
                <div className="flex gap-3 mb-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRemembersDream(true)}
                    className={`flex-1 py-4 rounded-2xl border font-semibold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                  >
                    Yes, I remember!
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRemembersDream(false)}
                    className={`flex-1 py-4 rounded-2xl border font-semibold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                  >
                    Not really
                  </motion.button>
                </div>
              ) : remembersDream ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <PenLine className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Describe your dream
                    </span>
                  </div>
                  <textarea
                    autoFocus
                    value={dreamRecall}
                    onChange={(e) => setDreamRecall(e.target.value)}
                    placeholder="I was in a vast forest, the trees were glowing with soft blue light..."
                    className={`flex-1 rounded-2xl p-4 border text-sm leading-relaxed resize-none outline-none transition-colors min-h-[200px] ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className={`rounded-2xl p-6 border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-3xl mb-3 block">🌙</span>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      That's okay! Dream recall improves with practice. Try keeping a journal by your bed.
                    </p>
                  </div>
                  <div className="flex-1" />
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                className="mt-6 w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30"
              >
                {remembersDream === null ? "Skip" : "Complete Check-In"}
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-6xl mb-6"
              >
                ✨
              </motion.div>
              <h1 className={`text-3xl font-bold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Check-In Saved
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedMood?.emoji} {selectedMood?.label} · {"⭐".repeat(sleepRating)} · {remembersDream ? "Dream logged" : "No dream recall"}
              </p>
              <p className={`text-xs mt-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                Redirecting to Home...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}