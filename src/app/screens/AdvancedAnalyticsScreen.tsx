import { motion } from "motion/react";
import { ChevronLeft, Activity } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../components/shared/ThemeContext";
import LucidiaSensoryDashboard from "../components/bci/LucidiaSensoryDashboard";

export default function AdvancedAnalyticsScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`h-screen overflow-y-auto ${isDark ? 'bg-[#110d1f]' : 'bg-[#f8f9fc]'}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          isDark 
            ? 'bg-[#110d1f]/90 border-white/10' 
            : 'bg-[#f8f9fc]/90 border-slate-200'
        }`}
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-xl transition-colors ${
              isDark 
                ? 'hover:bg-white/10' 
                : 'hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />
          </button>

          <div className="flex-1">
            <h1 className={`text-lg font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Advanced Dream Analytics
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Neural Intervention Dashboard
            </p>
          </div>

          <div className={`p-2.5 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Activity className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-24">
        <LucidiaSensoryDashboard />
      </div>
    </div>
  );
}