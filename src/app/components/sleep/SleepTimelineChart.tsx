import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

interface SleepTimelineChartProps {
  filter?: "Day" | "Week" | "Month";
}

export default function SleepTimelineChart({ filter = "Day" }: SleepTimelineChartProps) {
  const { isDark } = useTheme();

  const data = useMemo(() => {
    if (filter === "Day") {
      return [
        { time: "11PM", deep: 80, core: 10, rem: 5, awake: 0 },
        { time: "12AM", deep: 75, core: 15, rem: 10, awake: 0 },
        { time: "1AM", deep: 60, core: 30, rem: 10, awake: 0 },
        { time: "2AM", deep: 40, core: 45, rem: 15, awake: 0 },
        { time: "3AM", deep: 5, core: 10, rem: 5, awake: 80 },
        { time: "4AM", deep: 30, core: 40, rem: 30, awake: 0 },
        { time: "5AM", deep: 5, core: 30, rem: 60, awake: 5 },
        { time: "6AM", deep: 0, core: 40, rem: 50, awake: 10 },
        { time: "7AM", deep: 0, core: 20, rem: 40, awake: 40 },
      ];
    } else if (filter === "Week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map(day => ({
        time: day,
        deep: Math.round(15 + Math.random() * 20),
        core: Math.round(40 + Math.random() * 20),
        rem: Math.round(15 + Math.random() * 15),
        awake: Math.round(2 + Math.random() * 8),
      }));
    } else {
      const daysInMonth = Array.from({ length: 15 }, (_, i) => (i + 1) * 2); // Show every 2nd day
      return daysInMonth.map(day => ({
        time: `${day}`,
        deep: Math.round(15 + Math.random() * 20),
        core: Math.round(40 + Math.random() * 20),
        rem: Math.round(15 + Math.random() * 15),
        awake: Math.round(2 + Math.random() * 8),
      }));
    }
  }, [filter]);

  return (
    <div 
      className={`rounded-[2rem] p-6 border relative h-[340px] flex flex-col ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-50'}`}
      style={{
        boxShadow: isDark 
          ? '0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {filter === "Day" ? "Timeline" : filter === "Week" ? "Weekly Stages" : "Monthly Stages"}
          </h2>
        </div>
        <InfoTooltip
          content="Sleep timeline tracks your progression through sleep stages throughout the night. Deep sleep occurs early, while REM sleep increases toward morning."
          iconClassName={isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}
        />
      </div>

      {filter === "Day" && (
        <div className="flex items-center mb-3">
          <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${isDark ? 'text-amber-300 bg-amber-900/30 border border-amber-500/20' : 'text-amber-700 bg-amber-50 border border-amber-200'}`}>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`} /> Woke up 3AM (Water)
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 w-full mt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={filter} data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDeep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 12, fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`backdrop-blur-md border rounded-2xl p-4 shadow-xl ${isDark ? 'bg-zinc-900/90 border-white/10 shadow-black/50' : 'bg-white/90 border-slate-100 shadow-slate-200/50'}`}>
                      <p className={`text-xs font-bold uppercase mb-3 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{filter === "Month" ? `Day ${label}` : label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm mt-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full shadow-inner"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className={`capitalize font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{entry.name}</span>
                          <span className={`ml-auto font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{filter === "Day" ? `${entry.value}%` : `${entry.value}m`}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="rem"
              stroke="#d946ef"
              strokeWidth={3}
              fill="url(#colorRem)"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="core"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorCore)"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="deep"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#colorDeep)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}