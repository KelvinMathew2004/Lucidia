import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Flame, Trophy, Target, TrendingUp, Moon, Calendar, ChevronRight } from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";
import TopNav from "../components/shared/TopNav";
import MiniPlayer from "../components/shared/MiniPlayer";
import { useAudioPlayer } from "../components/shared/AudioPlayerContext";

export default function StatsScreen() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { currentTrack } = useAudioPlayer();

  // Mock data
  const currentStreak = 12;
  const bestStreak = 24;
  const weeklyGoalHits = 5;
  const weekProgress = weeklyGoalHits / 7;
  const avgSleepHours = 7.4;
  const avgSleepScore = 82;
  const totalNightsTracked = 47;

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const weekData = [true, true, false, true, true, true, false];

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-500 ${isDark ? 'text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <div className="px-5 pt-12">
        <TopNav title="Sleep Stats" onBack={() => navigate("/home")} />
      </div>

      <div className={`flex-1 overflow-y-auto px-5 pb-8 hide-scroll ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        <style dangerouslySetInnerHTML={{ __html: `.hide-scroll::-webkit-scrollbar{display:none}.hide-scroll{-ms-overflow-style:none;scrollbar-width:none}` }} />

        {/* Streak Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl p-6 border text-center mt-4 ${isDark ? 'bg-gradient-to-b from-indigo-900/30 to-transparent border-white/10' : 'bg-gradient-to-b from-indigo-50 to-white border-slate-200'}`}
        >
          <Flame className="w-10 h-10 text-orange-400 mx-auto mb-2" />
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentStreak}</span>
            <span className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>nights</span>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Streak</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="grid grid-cols-3 gap-3 mt-4"
        >
          <div className={`rounded-2xl p-4 border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className={`text-2xl font-black block ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{bestStreak}</span>
            <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Best</span>
          </div>
          <div className={`rounded-2xl p-4 border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <Moon className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className={`text-2xl font-black block ${isDark ? 'text-white' : 'text-slate-900'}`}>{avgSleepHours}h</span>
            <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Avg Sleep</span>
          </div>
          <div className={`rounded-2xl p-4 border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className={`text-2xl font-black block ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{avgSleepScore}</span>
            <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score</span>
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`rounded-2xl p-5 border mt-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Weekly Goal</span>
            </div>
            <span className={`text-sm font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{weeklyGoalHits}/7</span>
          </div>

          {/* Weekly progress ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="#818cf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${87.96 * weekProgress} ${87.96 * (1 - weekProgress)}`}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {Math.round(weekProgress * 100)}%
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                {weekDays.map((day, i) => (
                  <div key={`day-${i}`} className="flex flex-col items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                      weekData[i]
                        ? 'bg-indigo-500 text-white'
                        : isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Tracked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className={`rounded-2xl p-5 border mt-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Total Nights Tracked</span>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Since you joined Lucidia</p>
            </div>
            <span className={`text-2xl font-black ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{totalNightsTracked}</span>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 space-y-2"
        >
          {[
            { label: "Sleep Synthesis", path: "/sleep" },
            { label: "Dream Bank", path: "/dream-bank" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
            >
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{link.label}</span>
              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </button>
          ))}
        </motion.div>
      </div>

      <MiniPlayer />
    </div>
  );
}
