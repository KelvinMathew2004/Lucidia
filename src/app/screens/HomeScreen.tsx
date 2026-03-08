import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";
import { Sparkles, Headphones, Wind, ClipboardList, Activity } from "lucide-react";
import HoldToUnlockButton from "../components/home/HoldToUnlockButton";
import MiniPlayer from "../components/shared/MiniPlayer";
import { useAudioPlayer } from "../components/shared/AudioPlayerContext";
import NeuralInterventionModal from "../components/shared/NeuralInterventionModal";

export default function HomeScreen() {
  const { currentTrack } = useAudioPlayer();
  const userName = localStorage.getItem("lucidia_userName") || "Robert";
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col items-center justify-between h-full overflow-hidden pt-16 pb-6 px-6 relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-center space-y-2 z-10"
      >
        <h1 className="text-5xl font-light tracking-tight text-white/90">
          Good Morning,
          <br />
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
            {userName}.
          </span>
        </h1>
        <p className="text-slate-400 font-light text-lg">
          Hold to reveal your night.
        </p>
      </motion.div>

      {/* Center Interactive Element */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
        className="flex-grow flex flex-col items-center justify-center gap-6 w-full z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-indigo-200/60 font-medium tracking-widest uppercase text-xs text-center"
        >
          {today}
        </motion.div>
        
        <HoldToUnlockButton />
      </motion.div>

      {/* Footer Nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className={`flex flex-col items-center gap-3 z-10 w-full ${currentTrack ? 'mb-16' : ''}`}
      >
        {/* Quick Action Row */}
        <div className="flex items-center gap-2 w-full">
          <Link 
            to="/sounds"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-slate-300 text-[10px] uppercase tracking-widest"
          >
            <Headphones className="w-3 h-3" />
            <span>Sounds</span>
          </Link>
          <Link 
            to="/breathing"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-slate-300 text-[10px] uppercase tracking-widest"
          >
            <Wind className="w-3 h-3" />
            <span>Breathe</span>
          </Link>
          <Link 
            to="/routine"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-slate-300 text-[10px] uppercase tracking-widest"
          >
            <ClipboardList className="w-3 h-3" />
            <span>Routine</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 w-full">
          <Link 
            to="/dream-bank" 
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-400 hover:text-slate-300 text-[10px] uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            <span>Dream Bank</span>
          </Link>
          <button 
            onClick={() => setInterventionModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors text-red-400 hover:text-red-300 text-[10px] uppercase tracking-widest"
          >
            <Activity className="w-3 h-3" />
            <span>Intervention</span>
          </button>
        </div>
      </motion.div>

      <NeuralInterventionModal 
        isOpen={interventionModalOpen} 
        onClose={() => setInterventionModalOpen(false)} 
      />
      <MiniPlayer />
    </div>
  );
}