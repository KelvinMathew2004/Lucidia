import { motion } from "motion/react";
import { useMemo } from "react";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

interface SleepDetailBarsProps {
  filter?: "Day" | "Week" | "Month";
}

export default function SleepDetailBars({ filter = "Day" }: SleepDetailBarsProps) {
  const { isDark } = useTheme();

  const details = useMemo(() => {
    if (filter === "Day") {
      return [
        { label: "Deep sleep", percentage: 75, color: "bg-[#9333ea]", track: isDark ? "bg-purple-900/30" : "bg-purple-100" },
        { label: "REM sleep", percentage: 85, color: "bg-[#ec4899]", track: isDark ? "bg-pink-900/30" : "bg-pink-100" },
      ];
    } else if (filter === "Week") {
      return [
        { label: "Avg Deep sleep", percentage: 68, color: "bg-[#9333ea]", track: isDark ? "bg-purple-900/30" : "bg-purple-100" },
        { label: "Avg REM sleep", percentage: 72, color: "bg-[#ec4899]", track: isDark ? "bg-pink-900/30" : "bg-pink-100" },
      ];
    } else {
      return [
        { label: "Monthly Deep sleep", percentage: 62, color: "bg-[#9333ea]", track: isDark ? "bg-purple-900/30" : "bg-purple-100" },
        { label: "Monthly REM sleep", percentage: 65, color: "bg-[#ec4899]", track: isDark ? "bg-pink-900/30" : "bg-pink-100" },
      ];
    }
  }, [filter, isDark]);

  return (
    <div 
      className={`rounded-[2rem] p-6 border ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-50'}`}
      style={{
        boxShadow: isDark 
          ? '0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Sleep Detail</h2>
        <InfoTooltip
          content="Sleep details show the percentage of time spent in different sleep stages. Deep sleep aids physical recovery, while REM sleep supports memory and emotional processing."
          iconClassName={isDark ? 'text-slate-400 hover:text-pink-400' : 'text-slate-400 hover:text-pink-500'}
        />
      </div>

      <div className="space-y-8">
        {details.map((item, i) => (
          <div key={`${filter}-${item.label}`} className="relative flex flex-col items-end">
            <span className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {item.label}
            </span>
            
            <div className={`w-full h-8 rounded-full ${item.track} relative overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                className={`absolute left-0 top-0 h-full ${item.color} rounded-full flex items-center shadow-inner`}
              >
                <span className="text-xs font-bold text-white ml-3 z-10 drop-shadow-sm">
                  {item.percentage}%
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}