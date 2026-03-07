import { motion } from "motion/react";
import { Flame, Trophy, Target } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";

export default function SleepStreaks() {
  const { isDark } = useTheme();

  // Mock data
  const currentStreak = 12;
  const bestStreak = 24;
  const weeklyGoalHits = 5; // out of 7
  const weekProgress = weeklyGoalHits / 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="w-full"
    >
      <div className="flex items-center gap-3 w-full">
        {/* Streak Card */}
        <div className={`flex-1 rounded-2xl p-3.5 border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200/50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Streak
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentStreak}
            </span>
            <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              nights
            </span>
          </div>
        </div>

        {/* Weekly Ring */}
        <div className={`flex-1 rounded-2xl p-3.5 border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200/50'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              This Week
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini ring */}
            <div className="relative w-7 h-7">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="#818cf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${87.96 * weekProgress} ${87.96 * (1 - weekProgress)}`}
                />
              </svg>
            </div>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {weeklyGoalHits}/7
            </span>
          </div>
        </div>

        {/* Best */}
        <div className={`rounded-2xl p-3.5 border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200/50'}`}>
          <div className="flex items-center gap-1 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Best
            </span>
          </div>
          <span className={`text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
            {bestStreak}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
