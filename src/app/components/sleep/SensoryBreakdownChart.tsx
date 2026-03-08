import { motion } from "motion/react";
import { Eye, Ear, Hand, Wind, Move, Droplet, Thermometer, Clock } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";

export default function SensoryBreakdownChart() {
  const { isDark } = useTheme();

  const senses = [
    { name: "Visual", value: 87, icon: Eye, color: "#8B5CF6", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30" },
    { name: "Auditory", value: 72, icon: Ear, color: "#3B82F6", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
    { name: "Vestibular", value: 65, icon: Move, color: "#EC4899", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30" },
    { name: "Tactile", value: 58, icon: Hand, color: "#10B981", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30" },
    { name: "Olfactory", value: 45, icon: Wind, color: "#F59E0B", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30" },
    { name: "Proprioception", value: 34, icon: Move, color: "#F97316", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
    { name: "Interoception", value: 89, icon: Droplet, color: "#06B6D4", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30" },
    { name: "Chronoception", value: 76, icon: Clock, color: "#6366F1", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/30" }
  ];

  const maxValue = Math.max(...senses.map(s => s.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
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
        <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
          <Eye className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>
        <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          8-Sense Intensity Map
        </h3>
      </div>

      <div className="space-y-4">
        {senses.map((sense, index) => {
          const Icon = sense.icon;
          const percentage = (sense.value / maxValue) * 100;

          return (
            <div key={sense.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${sense.bgColor}`}>
                    <Icon className="w-3.5 h-3.5" style={{ color: sense.color }} />
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {sense.name}
                  </span>
                </div>
                <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {sense.value}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ backgroundColor: sense.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                    }}
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.1
                    }}
                  />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`mt-6 pt-5 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Intensity measured via neural pattern recognition during REM sleep. Higher values indicate stronger sensory experiences in dreams.
        </p>
      </div>
    </motion.div>
  );
}
