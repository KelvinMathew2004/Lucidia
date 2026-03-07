import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

interface SleepQualityGraphProps {
  filter?: "Day" | "Week" | "Month";
}

export default function SleepQualityGraph({ filter = "Day" }: SleepQualityGraphProps) {
  const { isDark } = useTheme();

  // Generate random sleep data based on the filter
  const data = useMemo(() => {
    if (filter === "Day") {
      const hours = [];
      const startHourOffset = Math.floor(Math.random() * 5); // 0 to 4
      const startHour = (21 + startHourOffset) % 24; 
      const duration = 5 + Math.floor(Math.random() * 5);
      
      let currentQuality = 60 + Math.random() * 20; 
      
      for (let i = 0; i <= duration * 2; i++) { 
        const hourVal = (startHour + Math.floor(i / 2)) % 24;
        const minVal = i % 2 === 0 ? "00" : "30";
        
        const ampm = hourVal >= 12 ? "PM" : "AM";
        const displayHour = hourVal % 12 === 0 ? 12 : hourVal % 12;
        
        const fluctuation = (Math.random() - 0.5) * 30;
        currentQuality = Math.max(10, Math.min(100, currentQuality + fluctuation));
        
        if (i > duration * 2 - 2) {
          currentQuality = Math.max(0, currentQuality - 20);
        }
        
        hours.push({
          time: `${displayHour}:${minVal} ${ampm}`,
          quality: Math.round(currentQuality)
        });
      }
      return hours;
    } else if (filter === "Week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map(day => ({
        time: day,
        quality: Math.round(60 + Math.random() * 35)
      }));
    } else {
      const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
      return daysInMonth.map(day => ({
        time: `${day}`,
        quality: Math.round(50 + Math.random() * 45)
      }));
    }
  }, [filter]);

  return (
    <div 
      className={`rounded-[2rem] p-6 border relative h-[300px] flex flex-col ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-50'}`}
      style={{
        boxShadow: isDark 
          ? '0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {filter === "Day" ? "Sleep Quality (Nightly)" : filter === "Week" ? "Sleep Quality (Weekly)" : "Sleep Quality (Monthly)"}
          </h2>
        </div>
        <InfoTooltip
          content="Sleep quality measures how well you sleep, based on factors like time to fall asleep, awakenings, and sleep stage distribution. Higher scores indicate more restful sleep."
          iconClassName={isDark ? 'text-slate-400 hover:text-purple-400' : 'text-slate-400 hover:text-purple-500'}
        />
      </div>

      <div className="flex-1 min-h-0 w-full mt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={filter} data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 11, fontWeight: 500 }}
              dy={10}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 11, fontWeight: 500 }}
              dx={-10}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`backdrop-blur-md border rounded-2xl p-3 shadow-xl ${isDark ? 'bg-zinc-900/90 border-white/10 shadow-black/50' : 'bg-white/90 border-slate-100 shadow-slate-200/50'}`}>
                      <p className={`text-xs font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{filter === "Day" ? label : filter === "Week" ? `${label} Night` : `Day ${label}`}</p>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <div className="w-2.5 h-2.5 rounded-full shadow-inner bg-gradient-to-r from-purple-500 to-pink-400" />
                        <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Quality Score</span>
                        <span className={`ml-2 font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{payload[0].value}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="quality"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#colorQuality)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}