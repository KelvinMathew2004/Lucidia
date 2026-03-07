import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";
import MiniPlayer from "../components/shared/MiniPlayer";
import { useAudioPlayer } from "../components/shared/AudioPlayerContext";

// --- Voice Guide Utilities ---
const PHASE_VOICE_LINES: Record<string, string[]> = {
  inhale: [
    "Breathe in slowly",
    "Inhale deeply",
    "Fill your lungs gently",
    "Draw in a deep breath",
  ],
  hold: [
    "Hold it there",
    "Gently hold",
    "Stay still and hold",
    "Keep holding",
  ],
  exhale: [
    "Slowly release",
    "Breathe out gently",
    "Let it all go",
    "Exhale slowly",
  ],
};

const CYCLE_ENCOURAGEMENTS = [
  "Beautiful. Keep going.",
  "You're doing great.",
  "Wonderful rhythm.",
  "Feel the calm settling in.",
  "Let each breath deepen your peace.",
  "Your body is relaxing.",
];

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function speakText(text: string, rate = 0.85, pitch = 0.9) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 0.8;
  // Try to pick a soft/female voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.lang.startsWith("en") && (v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Female"))
  ) || voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

type BreathingTechnique = {
  id: string;
  name: string;
  description: string;
  phases: { label: string; duration: number; action: "inhale" | "hold" | "exhale" }[];
  color: string;
  gradient: string;
};

const TECHNIQUES: BreathingTechnique[] = [
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "The relaxing breath. Inhale 4s, hold 7s, exhale 8s. Promotes sleep onset.",
    phases: [
      { label: "Inhale", duration: 4, action: "inhale" },
      { label: "Hold", duration: 7, action: "hold" },
      { label: "Exhale", duration: 8, action: "exhale" },
    ],
    color: "#818cf8",
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal 4s intervals. Used by Navy SEALs for calm under pressure.",
    phases: [
      { label: "Inhale", duration: 4, action: "inhale" },
      { label: "Hold", duration: 4, action: "hold" },
      { label: "Exhale", duration: 4, action: "exhale" },
      { label: "Hold", duration: 4, action: "hold" },
    ],
    color: "#06b6d4",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5.5s inhale, 5.5s exhale. Optimizes heart rate variability.",
    phases: [
      { label: "Inhale", duration: 5.5, action: "inhale" },
      { label: "Exhale", duration: 5.5, action: "exhale" },
    ],
    color: "#10b981",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "calm",
    name: "Calming Breath",
    description: "Short inhale, long exhale. Activates parasympathetic response.",
    phases: [
      { label: "Inhale", duration: 3, action: "inhale" },
      { label: "Hold", duration: 2, action: "hold" },
      { label: "Exhale", duration: 6, action: "exhale" },
    ],
    color: "#a78bfa",
    gradient: "from-violet-500/20 to-pink-500/20",
  },
];

export default function BreathingScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { currentTrack } = useAudioPlayer();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [voiceGuide, setVoiceGuide] = useState(true);
  const animRef = useRef<number>();
  const startTimeRef = useRef(0);
  const lastSpokenPhaseRef = useRef(-1);
  const lastSpokenCycleRef = useRef(-1);

  const currentPhase = selectedTechnique?.phases[currentPhaseIndex];

  const stopExercise = useCallback(() => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setCycleCount(0);
    lastSpokenPhaseRef.current = -1;
    lastSpokenCycleRef.current = -1;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Voice guide: announce phase changes
  useEffect(() => {
    if (!voiceGuide || !isActive || !currentPhase) return;
    if (lastSpokenPhaseRef.current === currentPhaseIndex) return;
    lastSpokenPhaseRef.current = currentPhaseIndex;
    speakText(pickRandom(PHASE_VOICE_LINES[currentPhase.action]));
  }, [voiceGuide, isActive, currentPhaseIndex, currentPhase]);

  // Voice guide: cycle encouragement
  useEffect(() => {
    if (!voiceGuide || !isActive || cycleCount === 0) return;
    if (lastSpokenCycleRef.current === cycleCount) return;
    lastSpokenCycleRef.current = cycleCount;
    // Delay so it doesn't overlap with the next phase announcement
    const timeout = setTimeout(() => {
      if (cycleCount > 0 && cycleCount % 2 === 0) {
        speakText(pickRandom(CYCLE_ENCOURAGEMENTS), 0.8, 1.0);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [voiceGuide, isActive, cycleCount]);

  // Intro announcement when starting
  useEffect(() => {
    if (!voiceGuide || !isActive || !selectedTechnique) return;
    if (cycleCount === 0 && currentPhaseIndex === 0 && phaseProgress < 0.05) {
      // The phase announcement handles the first instruction
    }
  }, [voiceGuide, isActive, selectedTechnique, cycleCount, currentPhaseIndex, phaseProgress]);

  // Preload voices on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (!isActive || !selectedTechnique || !currentPhase) return;

    startTimeRef.current = Date.now();
    const duration = currentPhase.duration * 1000;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setPhaseProgress(progress);

      if (progress >= 1) {
        const nextIndex = (currentPhaseIndex + 1) % selectedTechnique.phases.length;
        if (nextIndex === 0) setCycleCount(c => c + 1);
        setCurrentPhaseIndex(nextIndex);
        setPhaseProgress(0);
        startTimeRef.current = Date.now();
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive, currentPhaseIndex, selectedTechnique, currentPhase]);

  const getOrbScale = () => {
    if (!currentPhase || !isActive) return 1;
    if (currentPhase.action === "inhale") return 1 + phaseProgress * 0.5;
    if (currentPhase.action === "exhale") return 1.5 - phaseProgress * 0.5;
    return 1.5; // hold
  };

  const getOrbOpacity = () => {
    if (!currentPhase || !isActive) return 0.4;
    if (currentPhase.action === "inhale") return 0.4 + phaseProgress * 0.4;
    if (currentPhase.action === "exhale") return 0.8 - phaseProgress * 0.4;
    return 0.8;
  };

  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <style dangerouslySetInnerHTML={{ __html: `.hide-scroll::-webkit-scrollbar{display:none}.hide-scroll{-ms-overflow-style:none;scrollbar-width:none}` }} />

      <div className={`absolute inset-0 -z-10 transition-colors duration-500 ${isDark ? 'bg-[#110d1f]' : 'bg-[#F4F2FA]'}`} />

      {/* Header */}
      <div className={`px-5 pt-12 pb-2 sticky top-0 backdrop-blur-xl z-30 ${isDark ? 'bg-[#110d1f]/90' : 'bg-[#F4F2FA]/90'}`}>
        <header className="flex items-center justify-between py-2 relative">
          <button
            onClick={() => selectedTechnique && !isActive ? setSelectedTechnique(null) : navigate("/home")}
            className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className={`text-base font-semibold tracking-wide absolute left-1/2 -translate-x-1/2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Breathing
          </span>
          <div className="w-10" />
        </header>
      </div>

      <div className={`flex-1 overflow-y-auto hide-scroll px-5 pt-4 ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        <AnimatePresence mode="wait">
          {!selectedTechnique ? (
            /* Technique Selection */
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Choose Your Breath
                </h2>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select a breathing technique to begin your relaxation
                </p>
              </div>

              {TECHNIQUES.map((tech, i) => (
                <motion.button
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTechnique(tech)}
                  className={`w-full rounded-2xl p-5 border text-left transition-all relative overflow-hidden ${
                    isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                  style={{ boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)' }}
                >
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${tech.gradient}`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tech.color}20` }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tech.color }} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{tech.name}</div>
                        <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {tech.phases.map(p => `${p.label} ${p.duration}s`).join(" · ")}
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {tech.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* Active Exercise */
            <motion.div
              key="exercise"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center flex-1 min-h-[60vh] relative"
            >
              {/* Technique name */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {selectedTechnique.name}
                </h2>
                {isActive && (
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Cycle {cycleCount + 1}
                  </p>
                )}
              </motion.div>

              {/* Breathing Orb */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer rings */}
                {[1, 2, 3].map(ring => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full border"
                    style={{
                      borderColor: `${selectedTechnique.color}${isActive ? '30' : '15'}`,
                      width: `${100 + ring * 20}%`,
                      height: `${100 + ring * 20}%`,
                    }}
                    animate={isActive ? {
                      scale: [1, 1 + ring * 0.02, 1],
                      opacity: [0.3, 0.5, 0.3],
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity, delay: ring * 0.3 }}
                  />
                ))}

                {/* Main Orb */}
                <motion.div
                  className="w-48 h-48 rounded-full relative overflow-hidden flex items-center justify-center"
                  animate={{
                    scale: getOrbScale(),
                  }}
                  transition={{ duration: 0.1, ease: "linear" }}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${selectedTechnique.color}80, ${selectedTechnique.color}40, ${selectedTechnique.color}10)`,
                    boxShadow: `0 0 ${isActive ? 60 : 30}px ${selectedTechnique.color}${isActive ? '60' : '30'}, inset 0 0 40px ${selectedTechnique.color}20`,
                    opacity: getOrbOpacity(),
                  }}
                >
                  {/* Glass highlight */}
                  <div className="absolute top-2 left-4 w-16 h-8 bg-white/20 rounded-full blur-md rotate-[-30deg]" />

                  {/* Center Text */}
                  <div className="text-center relative z-10">
                    {isActive && currentPhase ? (
                      <>
                        <div className="text-white text-2xl font-bold drop-shadow-lg">
                          {currentPhase.label}
                        </div>
                        <div className="text-white/70 text-sm font-medium mt-1">
                          {Math.ceil(currentPhase.duration * (1 - phaseProgress))}s
                        </div>
                      </>
                    ) : (
                      <div className="text-white/80 text-sm font-medium">Ready</div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Phase indicators */}
              {isActive && selectedTechnique && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 mt-10"
                >
                  {selectedTechnique.phases.map((phase, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentPhaseIndex ? 'w-8' : 'w-3'
                      }`}
                      style={{
                        backgroundColor: i === currentPhaseIndex ? selectedTechnique.color : `${selectedTechnique.color}40`,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-4 mt-10">
                {isActive && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={stopExercise}
                    className={`p-3 rounded-full ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isActive) {
                      stopExercise();
                    } else {
                      setIsActive(true);
                      setCycleCount(0);
                      setCurrentPhaseIndex(0);
                      setPhaseProgress(0);
                    }
                  }}
                  className="px-8 py-4 rounded-2xl text-white font-semibold flex items-center gap-2"
                  style={{ backgroundColor: selectedTechnique.color }}
                >
                  {isActive ? (
                    <><Pause className="w-5 h-5" /> Stop</>
                  ) : (
                    <><Play className="w-5 h-5" /> Begin</>
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVoiceGuide(!voiceGuide)}
                  className="p-3 rounded-full"
                  style={{ backgroundColor: voiceGuide ? selectedTechnique.color : '#6b7280' }}
                >
                  {voiceGuide ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MiniPlayer />
    </div>
  );
}