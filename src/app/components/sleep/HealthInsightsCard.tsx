import { motion } from "motion/react";
import { AlertCircle, HeartPulse, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

interface HealthInsightsCardProps {
  filter?: "Day" | "Week" | "Month";
}

export default function HealthInsightsCard({ filter = "Day" }: HealthInsightsCardProps) {
  const { isDark } = useTheme();

  const issues = useMemo(() => {
    if (filter === "Day") {
      return [
        {
          id: 1,
          title: "Elevated Heart Rate",
          desc: "Your resting heart rate spiked to 85bpm during REM sleep, 15% higher than normal.",
          severity: "moderate",
          icon: HeartPulse,
          color: "text-amber-500",
          bg: isDark ? "bg-amber-950/20 border-amber-900/30" : "bg-amber-50 border-slate-100",
          iconBg: isDark ? "bg-amber-950/40" : "bg-white",
        },
        {
          id: 2,
          title: "Interrupted Deep Sleep",
          desc: "You woke up 3 times during your crucial deep sleep phase, impacting physical recovery.",
          severity: "high",
          icon: ShieldAlert,
          color: "text-rose-500",
          bg: isDark ? "bg-rose-950/20 border-rose-900/30" : "bg-rose-50 border-slate-100",
          iconBg: isDark ? "bg-rose-950/40" : "bg-white",
        },
      ];
    } else if (filter === "Week") {
      return [
        {
          id: 1,
          title: "Inconsistent Bedtimes",
          desc: "Your sleep onset varied by more than 2 hours this week, disrupting circadian rhythm.",
          severity: "moderate",
          icon: ShieldAlert,
          color: "text-amber-500",
          bg: isDark ? "bg-amber-950/20 border-amber-900/30" : "bg-amber-50 border-slate-100",
          iconBg: isDark ? "bg-amber-950/40" : "bg-white",
        },
        {
          id: 2,
          title: "Low REM Average",
          desc: "Averaging only 60 minutes of REM sleep per night this week.",
          severity: "high",
          icon: HeartPulse,
          color: "text-rose-500",
          bg: isDark ? "bg-rose-950/20 border-rose-900/30" : "bg-rose-50 border-slate-100",
          iconBg: isDark ? "bg-rose-950/40" : "bg-white",
        },
      ];
    } else {
      return [
        {
          id: 1,
          title: "Sleep Debt Accumulation",
          desc: "You have accumulated over 12 hours of sleep debt this month.",
          severity: "high",
          icon: AlertCircle,
          color: "text-rose-500",
          bg: isDark ? "bg-rose-950/20 border-rose-900/30" : "bg-rose-50 border-slate-100",
          iconBg: isDark ? "bg-rose-950/40" : "bg-white",
        }
      ];
    }
  }, [filter, isDark]);

  return (
    <div 
      className={`rounded-[2rem] p-6 border relative ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-50'}`}
      style={{
        boxShadow: isDark 
          ? '0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>System Anomalies</h2>
        </div>
        <InfoTooltip
          content="System anomalies highlight unusual patterns in your sleep that may impact your health, like elevated heart rate or disrupted sleep stages."
          iconClassName={isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}
        />
      </div>

      <div className="space-y-4">
        {issues.map((issue, i) => (
          <motion.div
            key={`${filter}-${issue.id}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 + 0.5 }}
            className={`p-4 rounded-2xl border flex gap-4 items-start ${issue.bg}`}
          >
            <div className={`p-2 rounded-xl shadow-sm ${issue.iconBg} ${issue.color}`}>
              <issue.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-1 ${issue.color}`}>
                {issue.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {issue.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}