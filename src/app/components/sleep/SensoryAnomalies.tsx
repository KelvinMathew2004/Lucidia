import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, CheckCircle2, Clock, Move, Thermometer } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";

export default function SensoryAnomalies() {
  const { isDark } = useTheme();

  const anomalies = [
    {
      type: "warning",
      title: "Time Dilation Event",
      description: "Chronoception exceeded 300% threshold at 3:14 AM",
      sense: "Chronoception",
      icon: Clock,
      color: "orange",
      intervention: "Rhythmic Metronome deployed successfully"
    },
    {
      type: "success",
      title: "Vestibular Coherence",
      description: "Flying sensations remained stable throughout REM",
      sense: "Vestibular",
      icon: Move,
      color: "green",
      intervention: "No intervention needed"
    },
    {
      type: "info",
      title: "Temperature Spike",
      description: "Brief thermoception increase during dream transition",
      sense: "Thermoception",
      icon: Thermometer,
      color: "blue",
      intervention: "Somatic warmth protocol on standby"
    }
  ];

  const typeStyles = {
    warning: {
      bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
      border: isDark ? 'border-orange-500/30' : 'border-orange-200',
      icon: AlertTriangle,
      iconBg: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
      iconColor: isDark ? 'text-orange-400' : 'text-orange-600',
      textColor: isDark ? 'text-orange-300' : 'text-orange-700'
    },
    success: {
      bg: isDark ? 'bg-green-500/10' : 'bg-green-50',
      border: isDark ? 'border-green-500/30' : 'border-green-200',
      icon: CheckCircle2,
      iconBg: isDark ? 'bg-green-500/20' : 'bg-green-100',
      iconColor: isDark ? 'text-green-400' : 'text-green-600',
      textColor: isDark ? 'text-green-300' : 'text-green-700'
    },
    info: {
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      border: isDark ? 'border-blue-500/30' : 'border-blue-200',
      icon: TrendingUp,
      iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
      textColor: isDark ? 'text-blue-300' : 'text-blue-700'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-[2rem] p-6 border ${
        isDark 
          ? 'bg-zinc-900/80 border-white/5' 
          : 'bg-white border-slate-100'
      }`}
      style={{
        boxShadow: isDark 
          ? '0 8px 20px -4px rgba(0,0,0,0.3)' 
          : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
          <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
        </div>
        <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Sensory Events & Interventions
        </h3>
      </div>

      <div className="space-y-4">
        {anomalies.map((anomaly, index) => {
          const styles = typeStyles[anomaly.type as keyof typeof typeStyles];
          const TypeIcon = styles.icon;
          const SenseIcon = anomaly.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`rounded-2xl p-4 border ${styles.bg} ${styles.border}`}
              style={{
                boxShadow: isDark 
                  ? '0 4px 12px -2px rgba(0,0,0,0.2)' 
                  : '0 4px 12px -2px rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${styles.iconBg} flex-shrink-0`}>
                  <TypeIcon className={`w-4 h-4 ${styles.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {anomaly.title}
                    </h4>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${styles.bg} border ${styles.border}`}>
                      <SenseIcon className={`w-3 h-3 ${styles.iconColor}`} />
                      <span className={`text-[10px] font-semibold ${styles.textColor}`}>
                        {anomaly.sense}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {anomaly.description}
                  </p>

                  <div className={`flex items-start gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="text-[10px] font-medium mt-0.5">→</span>
                    <span className="text-[10px] font-medium">
                      {anomaly.intervention}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className={`mt-6 pt-5 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          All events are automatically logged. BCI interventions were deployed where necessary to maintain sleep quality.
        </p>
      </div>
    </motion.div>
  );
}
