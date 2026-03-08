import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Headphones,
  Wind,
  ClipboardList,
  Sparkles,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  Flame,
  Moon,
  TrendingUp,
  Target,
  Trophy,
  Calendar,
} from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";
import MiniPlayer from "../components/shared/MiniPlayer";
import { useAudioPlayer } from "../components/shared/AudioPlayerContext";

// Mock progress data
const STREAK = 12;
const BEST_STREAK = 24;
const AVG_SLEEP = 7.4;
const SLEEP_SCORE = 82;
const WEEK_GOAL = 5;
const TOTAL_NIGHTS = 47;
const WEEK_DATA = [true, true, false, true, true, true, false];
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { currentTrack } = useAudioPlayer();

  const NAV_ITEMS = [
    { label: "Sounds", icon: Headphones, path: "/sounds", color: "#818cf8", desc: "Sleep soundscapes" },
    { label: "Breathe", icon: Wind, path: "/breathing", color: "#06b6d4", desc: "Guided breathing" },
    { label: "Routine", icon: ClipboardList, path: "/routine", color: "#10b981", desc: "Bedtime builder" },
    { label: "Dream Bank", icon: Sparkles, path: "/dream-bank", color: "#a78bfa", desc: "Dream journal" },
    { label: "Sleep Data", icon: Brain, path: "/sleep", color: "#f472b6", desc: "AI synthesis" },
  ];

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-500 ${isDark ? 'text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <style dangerouslySetInnerHTML={{ __html: `.hide-scroll::-webkit-scrollbar{display:none}.hide-scroll{-ms-overflow-style:none;scrollbar-width:none}` }} />

      {/* Header */}
      <div className={`px-5 pt-12 pb-2 sticky top-0 backdrop-blur-xl z-30 ${isDark ? 'bg-[#110d1f]/60' : 'bg-[#F4F2FA]/60'}`}>
        <header className="flex items-center justify-between py-2 relative">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className={`text-base font-semibold tracking-wide absolute left-1/2 -translate-x-1/2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Explore
          </span>
          <div className="w-10" />
        </header>
      </div>

      <div className={`flex-1 overflow-y-auto hide-scroll px-5 pt-2 ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Tools
          </div>
          <div className="space-y-2">
            {NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] active:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.label}</div>
                    <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Progress
            </div>
            <button
              onClick={() => navigate("/stats")}
              className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}
            >
              View all
            </button>
          </div>

          {/* Streak + Score Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Streak</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{STREAK}</span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>nights</span>
              </div>
            </div>

            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{SLEEP_SCORE}</span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/100</span>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className={`rounded-2xl p-4 border mt-3 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>This Week</span>
              </div>
              <span className={`text-xs font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{WEEK_GOAL}/7</span>
            </div>
            <div className="flex justify-between">
              {WEEK_DAYS.map((day, i) => (
                <div key={`wd-${i}`} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                    WEEK_DATA[i]
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : isDark ? 'bg-white/5 text-slate-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className={`rounded-xl p-3 border text-center ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100'}`}>
              <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <span className={`text-lg font-black block ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{BEST_STREAK}</span>
              <span className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Best</span>
            </div>
            <div className={`rounded-xl p-3 border text-center ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100'}`}>
              <Moon className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-1" />
              <span className={`text-lg font-black block ${isDark ? 'text-white' : 'text-slate-900'}`}>{AVG_SLEEP}h</span>
              <span className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Avg</span>
            </div>
            <div className={`rounded-xl p-3 border text-center ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-100'}`}>
              <Calendar className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <span className={`text-lg font-black block ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{TOTAL_NIGHTS}</span>
              <span className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Total</span>
            </div>
          </div>
        </motion.div>
      </div>

      <MiniPlayer />
    </div>
  );
}