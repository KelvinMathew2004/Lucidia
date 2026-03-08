import { motion, AnimatePresence } from "motion/react";
import { X, Brain, HeartPulse, Clock, Wind, Lightbulb, Droplets, Coffee, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface AIPersonalizedSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPersonalizedSummaryModal({ isOpen, onClose }: AIPersonalizedSummaryModalProps) {
  const [stage, setStage] = useState(0);

  // Staggered animation for the content
  useEffect(() => {
    if (isOpen) {
      setStage(0);
      const timers = [
        setTimeout(() => setStage(1), 300),
        setTimeout(() => setStage(2), 800),
        setTimeout(() => setStage(3), 1300),
        setTimeout(() => setStage(4), 1800),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-zinc-950/90 backdrop-blur-xl p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="relative w-full h-[90vh] sm:h-[85vh] sm:max-w-md bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle animated background gradients */}
          <motion.div 
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-purple-500/5 to-transparent pointer-events-none" 
          />
          
          {/* Header Actions - Just the close button now */}
          <div className="flex items-center justify-end p-5 pb-0 shrink-0 z-10 relative">
            <button 
              onClick={onClose}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors backdrop-blur-md border border-white/5"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scroll px-6 pb-10 z-10 relative">
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

            {/* Title Section */}
            <motion.div
              className="text-left mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl sm:text-4xl font-light text-white leading-tight">
                {localStorage.getItem("lucidia_userName") || "There"}, here are your <br/>
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  personalized recommendations.
                </span>
              </h1>
            </motion.div>

            <div className="space-y-10">
              {/* Optimal Sleep Window */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-indigo-400 font-bold tracking-widest uppercase text-[11px] flex items-center gap-2">
                    <Clock className="w-4 h-4"/> Optimal Sleep Window
                  </div>
                  <a href="https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need" target="_blank" rel="noopener noreferrer" className="text-indigo-400/50 hover:text-indigo-300 transition-colors p-1" title="Learn More">
                    <Info className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 flex flex-col gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Target Duration</div>
                      <div className="text-4xl font-light text-white tracking-tight">
                        7<span className="text-xl text-indigo-300/80 font-medium ml-1 mr-2">h</span> 
                        45<span className="text-xl text-indigo-300/80 font-medium ml-1">m</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Bedtime</div>
                      <div className="text-2xl font-medium text-indigo-300">10:45 PM</div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/5" />
                  
                  <p className="text-slate-300 leading-relaxed text-sm">
                    Based on your circadian rhythm and deep sleep cycles, this schedule maximizes your physical recovery and REM phases.
                  </p>
                </div>
              </motion.div>

              {/* Cognitive & Mental Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-purple-400 font-bold tracking-widest uppercase text-[11px] flex items-center gap-2">
                    <Brain className="w-4 h-4"/> Mental & Cognitive Focus
                  </div>
                  <a href="https://www.sleepfoundation.org/mental-health" target="_blank" rel="noopener noreferrer" className="text-purple-400/50 hover:text-purple-300 transition-colors p-1" title="Learn More">
                    <Info className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  
                  <p className="text-slate-200 text-sm mb-6 leading-relaxed relative z-10">
                    Your dream data shows recurring <span className="text-purple-300 font-semibold bg-purple-500/10 px-1.5 py-0.5 rounded-md">"Processing & Adaptation"</span> themes, suggesting a high daytime cognitive load.
                  </p>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="flex gap-4 items-start bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                      <div className="p-2 bg-purple-500/20 rounded-xl shrink-0"><Wind className="w-5 h-5 text-purple-300" /></div>
                      <div>
                        <div className="text-white font-medium text-sm mb-1">Pre-sleep Breathing</div>
                        <div className="text-slate-300 text-sm leading-relaxed">Practice 10 minutes of box breathing before bed to reduce cortisol levels.</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                      <div className="p-2 bg-purple-500/20 rounded-xl shrink-0"><Lightbulb className="w-5 h-5 text-purple-300" /></div>
                      <div>
                        <div className="text-white font-medium text-sm mb-1">Creative Peak</div>
                        <div className="text-slate-300 text-sm leading-relaxed">Creativity peaks the morning after "Abstract" nights. Schedule brainstorms then.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Physiological Markers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-emerald-400 font-bold tracking-widest uppercase text-[11px] flex items-center gap-2">
                    <HeartPulse className="w-4 h-4"/> Physiological Markers
                  </div>
                  <a href="https://www.sleepfoundation.org/physical-health" target="_blank" rel="noopener noreferrer" className="text-emerald-400/50 hover:text-emerald-300 transition-colors p-1" title="Learn More">
                    <Info className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  
                  <p className="text-slate-200 text-sm mb-6 leading-relaxed relative z-10">
                    We detected <span className="text-emerald-300 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">3 "Health Alert"</span> dreams correlating with elevated resting heart rates.
                  </p>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="flex gap-4 items-start bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                      <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0"><Droplets className="w-5 h-5 text-emerald-300" /></div>
                      <div>
                        <div className="text-white font-medium text-sm mb-1">Hydration Check</div>
                        <div className="text-slate-300 text-sm leading-relaxed">Possible mild dehydration. Consume 2L+ of water, tapering off by 8 PM.</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                      <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0"><Coffee className="w-5 h-5 text-emerald-300" /></div>
                      <div>
                        <div className="text-white font-medium text-sm mb-1">Caffeine Timing</div>
                        <div className="text-slate-300 text-sm leading-relaxed">Monitor intake after 2 PM; it is measurably delaying your deep sleep onset.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
          
          {/* Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: stage >= 4 ? 1 : 0, y: stage >= 4 ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 pt-2 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent relative z-20 shrink-0"
          >
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98]"
            >
              Acknowledge & Apply
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}