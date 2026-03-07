import { motion } from "motion/react";
import { Moon, Star } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

type TimeFilter = "Day" | "Week" | "Month";

interface SleepTimeSummaryProps {
  filter: TimeFilter;
  setFilter: (filter: TimeFilter) => void;
}

export default function SleepTimeSummary({ filter, setFilter }: SleepTimeSummaryProps) {
  const { isDark } = useTheme();

  const dataMap = {
    Day: { total: { h: 7, m: 28 }, deep: { h: 2, m: 18 } },
    Week: { total: { h: 52, m: 15 }, deep: { h: 16, m: 45 } },
    Month: { total: { h: 224, m: 30 }, deep: { h: 71, m: 10 } },
  };

  const currentData = dataMap[filter];

  return (
    <div className="flex flex-col gap-6">
      {/* Pill Toggle for Day/Week/Month */}
      <div className={`flex items-center justify-between rounded-full p-1.5 shadow-sm border ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-100'}`}>
        {(["Day", "Week", "Month"] as TimeFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`relative flex-1 py-2 text-sm font-semibold transition-all duration-300 rounded-full z-10 ${
              filter === tab 
                ? (isDark ? "text-slate-900 shadow-lg shadow-black/50 bg-slate-100 scale-[1.02]" : "text-slate-800 shadow-md shadow-slate-300/60 bg-white scale-[1.02]") 
                : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600")
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Blocks */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Sleep Block */}
        <motion.div
          key={`total-${filter}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-[1.5rem] p-5 text-white flex flex-col justify-between relative min-h-[140px] ${isDark ? 'bg-[#2D1B4E] border border-white/5' : 'bg-[#2D1B4E]'}`}
          style={{
            boxShadow: isDark 
              ? '0 8px 20px -4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 8px 20px -4px rgba(45,27,78,0.3), inset 0 2px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] pointer-events-none">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-200">Total Sleep Time</span>
              <InfoTooltip
                content="Total time spent asleep. Adults need 7-9 hours per night."
                iconClassName="text-purple-300 hover:text-white"
                variant="mini"
              />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">{currentData.total.h}</span>
              <span className="text-sm font-medium text-purple-200">h</span>
              <span className="text-3xl font-bold tracking-tight ml-1">{currentData.total.m}</span>
              <span className="text-sm font-medium text-purple-200">min</span>
            </div>
          </div>
          <Moon className="w-6 h-6 text-purple-400 mt-auto relative z-10" fill="currentColor" />
        </motion.div>

        {/* Deep Sleep Block */}
        <motion.div
          key={`deep-${filter}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`rounded-[1.5rem] p-5 flex flex-col justify-between border min-h-[140px] ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-50'}`}
          style={{
            boxShadow: isDark 
              ? '0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
          }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Deep Sleep</span>
              <InfoTooltip
                content="Most restorative sleep stage. Helps physical recovery and memory. Need 1.5-2 hours/night."
                iconClassName={isDark ? 'text-slate-500 hover:text-indigo-300' : 'text-slate-400 hover:text-[#2D1B4E]'}
                variant="mini"
              />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-indigo-300' : 'text-[#2D1B4E]'}`}>{currentData.deep.h}</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>h</span>
              <span className={`text-3xl font-bold tracking-tight ml-1 ${isDark ? 'text-indigo-300' : 'text-[#2D1B4E]'}`}>{currentData.deep.m}</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>min</span>
            </div>
          </div>
          <Star className={`w-6 h-6 mt-auto ${isDark ? 'text-indigo-500/50' : 'text-indigo-100'}`} fill="currentColor" />
        </motion.div>
      </div>
    </div>
  );
}