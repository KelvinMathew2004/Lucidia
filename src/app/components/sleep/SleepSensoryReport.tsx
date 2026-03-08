import { motion } from "motion/react";
import { Brain, Sparkles, Plane, Clock, Eye, Zap } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";
import { useNavigate } from "react-router";

export default function SleepSensoryReport() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Sensory load percentage (0-100)
  const sensoryLoad = 78;
  
  // Calculate circle properties
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (sensoryLoad / 100) * circumference;

  const dominantSenses = [
    { rank: 1, name: "Vestibular", context: "Flying", icon: Plane, color: "purple" },
    { rank: 2, name: "Chronoception", context: "Time Dilation", icon: Clock, color: "blue" },
    { rank: 3, name: "Visual", context: "Vivid", icon: Eye, color: "pink" }
  ];

  const colorMap = {
    purple: {
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
      border: isDark ? 'border-purple-500/30' : 'border-purple-200',
      text: isDark ? 'text-purple-300' : 'text-purple-700',
      icon: isDark ? 'text-purple-400' : 'text-purple-600'
    },
    blue: {
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
      border: isDark ? 'border-blue-500/30' : 'border-blue-200',
      text: isDark ? 'text-blue-300' : 'text-blue-700',
      icon: isDark ? 'text-blue-400' : 'text-blue-600'
    },
    pink: {
      bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50',
      border: isDark ? 'border-pink-500/30' : 'border-pink-200',
      text: isDark ? 'text-pink-300' : 'text-pink-700',
      icon: isDark ? 'text-pink-400' : 'text-pink-600'
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Morning Report Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-[2rem] p-8 border relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent border-indigo-500/20' 
            : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-white border-indigo-100'
        }`}
        style={{
          boxShadow: isDark 
            ? '0 20px 40px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' 
            : '0 20px 40px -8px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,1)'
        }}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' 
                : 'radial-gradient(circle, #C084FC 0%, transparent 70%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className={`p-2.5 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(99, 102, 241, 0.3)',
                  '0 0 30px rgba(99, 102, 241, 0.5)',
                  '0 0 20px rgba(99, 102, 241, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className={`w-5 h-5 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />
            </motion.div>
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Sleep & Sensory Report
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Today, March 8, 2026 • 7:28 AM
              </p>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Background Circle */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="flex flex-col items-center text-center px-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", duration: 0.8 }}
                  className={`text-4xl font-bold mb-1 bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent`}
                >
                  {sensoryLoad}%
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`text-xs font-semibold leading-tight ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  High Interoceptive<br />Load Detected
                </motion.p>
              </div>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(139, 92, 246, 0.2)',
                    '0 0 50px rgba(139, 92, 246, 0.4)',
                    '0 0 30px rgba(139, 92, 246, 0.2)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Dominant Senses Pills */}
          <div className="space-y-3 mb-6">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Dominant Senses
            </h3>
            {dominantSenses.map((sense, index) => {
              const colors = colorMap[sense.color as keyof typeof colorMap];
              const Icon = sense.icon;
              
              return (
                <motion.div
                  key={sense.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full border ${colors.bg} ${colors.border}`}
                  style={{
                    boxShadow: isDark 
                      ? '0 4px 12px -2px rgba(0,0,0,0.2)' 
                      : '0 4px 12px -2px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${colors.bg} border ${colors.border}`}>
                    <span className={`text-xs font-bold ${colors.text}`}>{sense.rank}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {sense.name}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {' '}({sense.context})
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={`rounded-2xl p-5 border ${
              isDark 
                ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30' 
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  AI Insight
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  You experienced high spatial fluidity (flying) and time dilation. This correlates with high memory consolidation, but you may feel slightly disassociated this morning.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/reality-anchoring')}
              className={`w-full mt-3 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isDark 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              <Zap className="w-4 h-4" />
              Run 60-Second Reality Anchoring Exercise
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}