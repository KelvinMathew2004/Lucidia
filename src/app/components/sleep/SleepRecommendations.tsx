import { motion } from "motion/react";
import { Music, Play, Sparkles, Thermometer, Smartphone, Wind, Headphones } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

interface SleepRecommendationsProps {
  filter?: "Day" | "Week" | "Month";
}

export default function SleepRecommendations({ filter = "Day" }: SleepRecommendationsProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const content = useMemo(() => {
    if (filter === "Day") {
      return {
        title: "Tips to improve your sleep",
        desc: "Listen to these curated sounds to reduce heart rate spikes and improve deep sleep cycles tonight.",
        tips: [
          {
            id: 1,
            title: "Relaxation",
            subtitle: "14 Playlist",
            bgDark: "bg-[#1e1535]",
            bgLight: "bg-[#2D1B4E]",
            icon: <Music className="w-10 h-10 text-pink-400 absolute bottom-4 left-4 opacity-50" />,
            route: "/sounds",
          },
          {
            id: 2,
            title: "Yoga Training",
            subtitle: "10 Playlist",
            bgDark: "bg-[#251840]",
            bgLight: "bg-[#4B2C84]",
            icon: <Sparkles className="w-10 h-10 text-purple-300 absolute bottom-4 right-4 opacity-50" />,
            route: "/breathing",
          },
        ]
      };
    } else if (filter === "Week") {
      return {
        title: "Weekly Routine Reset",
        desc: "Based on your weekly trends, these routines will help stabilize your circadian rhythm.",
        tips: [
          {
            id: 1,
            title: "Evening Wind Down",
            subtitle: "Guided Routine",
            bgDark: "bg-indigo-950",
            bgLight: "bg-indigo-900",
            icon: <Music className="w-10 h-10 text-indigo-300 absolute bottom-4 left-4 opacity-50" />,
            route: "/routine",
          },
          {
            id: 2,
            title: "Morning Sunlight",
            subtitle: "Circadian Sync",
            bgDark: "bg-amber-950",
            bgLight: "bg-amber-700",
            icon: <Sparkles className="w-10 h-10 text-amber-300 absolute bottom-4 right-4 opacity-50" />,
            route: "/routine",
          },
        ]
      };
    } else {
      return {
        title: "Long-term Sleep Fixes",
        desc: "Addressing your monthly sleep debt requires systemic changes to your evening environment.",
        tips: [
          {
            id: 1,
            title: "Temp Control",
            subtitle: "Optimize Room",
            bgDark: "bg-cyan-950",
            bgLight: "bg-cyan-900",
            icon: <Thermometer className="w-10 h-10 text-cyan-300 absolute bottom-4 left-4 opacity-50" />,
            route: "/routine",
          },
          {
            id: 2,
            title: "Digital Detox",
            subtitle: "Screen Rules",
            bgDark: "bg-slate-900",
            bgLight: "bg-slate-800",
            icon: <Smartphone className="w-10 h-10 text-slate-300 absolute bottom-4 right-4 opacity-50" />,
            route: "/routine",
          },
        ]
      };
    }
  }, [filter]);

  return (
    <div 
      className={`rounded-[2rem] p-6 border relative ${isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-white border-slate-50'}`}
      style={{
        boxShadow: isDark 
          ? '0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{content.title}</h2>
        </div>
        <InfoTooltip
          content="Personalized recommendations based on your sleep patterns to help you improve sleep quality and maintain healthy sleep habits."
          iconClassName={isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}
        />
      </div>
      
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {content.desc}
      </p>

      <div className="grid grid-cols-2 gap-4">
        {content.tips.map((tip) => (
          <motion.div
            key={`${filter}-${tip.id}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(tip.route)}
            className={`${isDark ? tip.bgDark : tip.bgLight} rounded-[1.5rem] p-4 text-white relative overflow-hidden h-36 flex flex-col cursor-pointer border ${isDark ? 'border-white/10 shadow-lg shadow-purple-900/20' : 'border-transparent shadow-lg shadow-purple-900/10'}`}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
            
            <h3 className="text-sm font-semibold mb-2">{tip.title}</h3>
            
            <div className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-[10px] flex items-center gap-1 w-max mb-auto border border-white/10">
              <Play className="w-3 h-3 fill-white" />
              {tip.subtitle}
            </div>

            {tip.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
