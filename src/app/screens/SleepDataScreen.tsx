import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Moon, Sun, Bookmark, BarChart3 } from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";
import { useAudioPlayer } from "../components/shared/AudioPlayerContext";
import TopNav from "../components/shared/TopNav";
import MiniPlayer from "../components/shared/MiniPlayer";
import AIOverview from "../components/sleep/AIOverview";
import SleepTimeSummary from "../components/sleep/SleepTimeSummary";
import SleepQualityGraph from "../components/sleep/SleepQualityGraph";
import SleepDetailBars from "../components/sleep/SleepDetailBars";
import SleepTimelineChart from "../components/sleep/SleepTimelineChart";
import HealthInsightsCard from "../components/sleep/HealthInsightsCard";
import SleepRecommendations from "../components/sleep/SleepRecommendations";

type Tab = "AI Overview" | "Sleep Stats";
type TimeFilter = "Day" | "Week" | "Month";

export default function SleepDataScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("AI Overview");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Day");
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const { currentTrack } = useAudioPlayer();

  const handleCapture = () => {
    setIsCapturing(true);
    // After the shrink animation completes, navigate to the bank
    setTimeout(() => {
      navigate("/dream-bank");
    }, 1200);
  };

  return (
    <motion.div 
      className={`flex flex-col h-full relative z-20 origin-center overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}
      initial={{ borderRadius: "0px", scale: 1, opacity: 1, backgroundColor: isDark ? "#110d1f" : "#f8f9fc" }}
      animate={
        isCapturing 
          ? { 
              scale: 0.05, 
              borderRadius: "2000px",
              backgroundColor: "#a855f7", // purple-500
              boxShadow: "0 0 150px 100px rgba(167, 139, 250, 1)",
            }
          : { borderRadius: "0px", scale: 1, opacity: 1, backgroundColor: isDark ? "#110d1f" : "#f8f9fc" }
      }
      transition={{ 
        duration: 1.5, 
        ease: [0.6, -0.05, 0.01, 0.99] // Anticipation/elastic ease
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scroll:hover::-webkit-scrollbar-thumb {
          background-color: rgba(99, 102, 241, 0.5);
        }
      `}} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isCapturing ? 0 : 1, scale: isCapturing ? 0.5 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col flex-1 h-full overflow-hidden"
      >
        {/* Light/Dark background overlay that covers the space theme */}
        <motion.div 
          className={`absolute inset-0 -z-10 transition-colors duration-500 ${isDark ? 'bg-[#110d1f]' : 'bg-[#F4F2FA]'}`} 
          animate={{ opacity: isCapturing ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Soft gradient blobs for the background */}
        <motion.div 
          className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b opacity-60 -z-10 transition-colors duration-500 ${isDark ? 'from-purple-900/30 to-transparent' : 'from-purple-100 to-transparent'}`} 
          animate={{ opacity: isCapturing ? 0 : 0.6 }}
        />
        <motion.div 
          className={`absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full blur-3xl opacity-50 -z-10 transition-colors duration-500 ${isDark ? 'bg-indigo-900/20' : 'bg-pink-100'}`} 
          animate={{ opacity: isCapturing ? 0 : 0.5 }}
        />

        <div className={`px-5 pt-12 pb-2 sticky top-0 backdrop-blur-xl z-30 transition-colors duration-500 ${isDark ? 'bg-[#110d1f]/90' : 'bg-[#F4F2FA]/90'}`}>
          <TopNav 
            title="Sleep Synthesis" 
            onBack={() => navigate("/home")}
            rightAction={
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleDark}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-slate-200 active:bg-slate-300 text-indigo-600 bg-indigo-100/50 border border-indigo-200'}`}
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 fill-amber-300/20" strokeWidth={2} />
                  ) : (
                    <Moon className="w-5 h-5 fill-indigo-600/20" strokeWidth={2.5} />
                  )}
                </button>
                <button
                  onClick={() => navigate("/stats")}
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${isDark ? 'hover:bg-white/10 text-indigo-300' : 'hover:bg-slate-200 active:bg-slate-300 text-indigo-600 bg-indigo-100/50 border border-indigo-200'}`}
                  title="Stats"
                >
                  <BarChart3 className="w-5 h-5" strokeWidth={2} />
                </button>
                <button 
                  onClick={handleCapture}
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${isDark ? 'hover:bg-indigo-500/20 text-indigo-300' : 'hover:bg-slate-200 active:bg-slate-300 text-indigo-600 bg-indigo-100/50 border border-indigo-200'}`}
                  title="Save to Dream Bank"
                >
                  <Bookmark className={`w-5 h-5 ${isDark ? 'fill-indigo-400/20' : 'fill-indigo-600/20'}`} strokeWidth={2.5} />
                </button>
              </div>
            }
          />
          
          {/* Main Tab Toggle */}
          <div 
            className={`flex p-1.5 rounded-[1.25rem] mt-4 mb-2 transition-colors duration-500 ${isDark ? 'bg-zinc-800/50' : 'bg-slate-200/50'}`}
            style={{ boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)' }}
          >
            {(["AI Overview", "Sleep Stats"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold transition-all duration-300 rounded-xl relative overflow-hidden ${
                  activeTab === tab ? (isDark ? "text-white" : "text-[#2D1B4E]") : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-xl border ${isDark ? 'bg-zinc-700/80 border-white/10' : 'bg-white border-slate-100/50'}`}
                    style={{
                      boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.2)' : '0 4px 6px -1px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 drop-shadow-sm">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-5 pb-16 pt-4 overflow-y-auto custom-scroll z-20">
          <AnimatePresence mode="wait">
            {activeTab === "AI Overview" ? (
              <motion.div
                key="ai-overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AIOverview />
              </motion.div>
            ) : (
              <motion.div
                key="sleep-stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Stats view includes the Day/Week/Month toggle inside the Time Summary */}
                <SleepTimeSummary filter={timeFilter} setFilter={setTimeFilter} />
                <SleepQualityGraph filter={timeFilter} />
                <SleepDetailBars filter={timeFilter} />
                <HealthInsightsCard filter={timeFilter} />
                <SleepTimelineChart filter={timeFilter} />
                <SleepRecommendations filter={timeFilter} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <MiniPlayer />
    </motion.div>
  );
}