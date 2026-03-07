import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, X, Timer, ChevronUp, Volume2 } from "lucide-react";
import { useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";
import { useTheme } from "./ThemeContext";

const TIMER_OPTIONS = [15, 30, 45, 60, 90];

export default function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, stop, sleepTimer, setSleepTimer } = useAudioPlayer();
  const { isDark } = useTheme();
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!currentTrack) return null;

  return (
    <>
      <motion.div
        key="mini-player"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-3"
      >
        {/* Timer Picker Overlay */}
        <AnimatePresence>
          {showTimerPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mb-2 rounded-2xl p-4 backdrop-blur-xl border ${
                isDark ? 'bg-zinc-900/95 border-white/10' : 'bg-white/95 border-slate-200'
              }`}
              style={{ boxShadow: '0 -8px 30px rgba(0,0,0,0.3)' }}
            >
              <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Sleep Timer
              </div>
              <div className="flex gap-2 flex-wrap">
                {TIMER_OPTIONS.map((min) => (
                  <button
                    key={min}
                    onClick={() => { setSleepTimer(min); setShowTimerPicker(false); }}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      sleepTimer === min
                        ? 'bg-indigo-500 text-white'
                        : isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {min}m
                  </button>
                ))}
                <button
                  onClick={() => { setSleepTimer(null); setShowTimerPicker(false); }}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isDark ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  Off
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Player Bar */}
        <motion.div
          layout
          className={`rounded-2xl backdrop-blur-xl border overflow-hidden ${
            isDark ? 'bg-zinc-900/95 border-white/10' : 'bg-white/95 border-slate-200'
          }`}
          style={{ boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.1)' }}
        >
          {/* Main Row */}
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Track Icon */}
            <motion.div
              animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={isPlaying ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: `linear-gradient(135deg, ${currentTrack.color}40, ${currentTrack.color}20)` }}
            >
              {currentTrack.icon}
            </motion.div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {currentTrack.title}
              </div>
              <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentTrack.subtitle}
                {sleepTimer && (
                  <span className="text-indigo-400 ml-2">{sleepTimer}m timer</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowTimerPicker(!showTimerPicker)}
                className={`p-2 rounded-full transition-colors ${
                  sleepTimer
                    ? 'text-indigo-400 bg-indigo-500/20'
                    : isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Timer className="w-4 h-4" />
              </button>
              <button
                onClick={() => isPlaying ? pause() : resume()}
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'}`}
              >
                {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
              </button>
              <button
                onClick={stop}
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-slate-500 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Animated playing indicator */}
          {isPlaying && (
            <div className="px-4 pb-2 flex gap-[3px] items-end h-3">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{ backgroundColor: currentTrack.color }}
                  animate={{ height: ["30%", `${40 + Math.random() * 60}%`, "30%"] }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}