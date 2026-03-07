import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share2, Moon, Star, Brain, TrendingUp, Flame } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";

interface SleepReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SleepReportModal({ isOpen, onClose }: SleepReportModalProps) {
  const { isDark } = useTheme();

  // Mock weekly data
  const weekData = {
    avgScore: 82,
    totalSleep: "52h 15m",
    avgBedtime: "11:24 PM",
    avgWakeTime: "7:02 AM",
    bestNight: "Tuesday",
    bestScore: 95,
    streak: 12,
    dreamCategories: [
      { name: "Mystery", pct: 30, color: "#a78bfa" },
      { name: "Joy", pct: 25, color: "#fbbf24" },
      { name: "Healing", pct: 20, color: "#34d399" },
      { name: "Processing", pct: 15, color: "#f97316" },
      { name: "Romance", pct: 10, color: "#f472b6" },
    ],
    dailyScores: [78, 85, 95, 72, 88, 80, 82],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm overflow-hidden rounded-[2rem] relative"
          style={{ maxHeight: "85vh" }}
        >
          {/* Card with gradient background */}
          <div
            className="p-6 relative overflow-y-auto"
            style={{
              background: "linear-gradient(145deg, #1e1040 0%, #150d2e 30%, #0f0a1f 100%)",
              maxHeight: "85vh",
            }}
          >
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/60">Stats</div>
                <div className="text-lg font-bold text-white mt-0.5">Mar 1 - Mar 7, 2026</div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Hero */}
            <div className="relative z-10 flex items-center gap-5 mb-6">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="url(#reportGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${94.2 * (weekData.avgScore / 100)} ${94.2 * (1 - weekData.avgScore / 100)}`}
                  />
                  <defs>
                    <linearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">{weekData.avgScore}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Avg Sleep Score</div>
                <div className="text-xs text-slate-400 mt-1">Total: {weekData.totalSleep}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-orange-300 font-medium">{weekData.streak} night streak</span>
                </div>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="relative z-10 mb-6">
              <div className="flex items-end gap-2 h-20">
                {weekData.dailyScores.map((score, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(score / 100) * 60}px` }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="w-full rounded-lg"
                      style={{
                        background: weekData.days[i] === weekData.bestNight
                          ? "linear-gradient(to top, #818cf8, #c084fc)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                    <span className="text-[9px] text-slate-500 font-medium">{weekData.days[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Avg Bedtime", value: weekData.avgBedtime, icon: <Moon className="w-4 h-4 text-indigo-400" /> },
                { label: "Avg Wake", value: weekData.avgWakeTime, icon: <Star className="w-4 h-4 text-amber-400" /> },
                { label: "Best Night", value: weekData.bestNight, icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
                { label: "Best Score", value: `${weekData.bestScore}/100`, icon: <Brain className="w-4 h-4 text-purple-400" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    {stat.icon}
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Dream Categories */}
            <div className="relative z-10 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Dream Categories</div>
              <div className="space-y-2">
                {weekData.dreamCategories.map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-slate-300 flex-1">{cat.name}</span>
                    <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.pct}%` }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{cat.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex gap-3 pt-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 text-slate-300 text-sm font-semibold">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}