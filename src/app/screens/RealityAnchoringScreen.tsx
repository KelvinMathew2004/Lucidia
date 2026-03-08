import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, Circle, CheckCircle2, Zap, Eye, Hand, Ear, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../components/shared/ThemeContext";

const EXERCISES = [
  {
    title: "Visual Grounding",
    icon: Eye,
    instruction: "Name 5 things you can see right now",
    duration: 10,
    color: "#8B5CF6"
  },
  {
    title: "Tactile Awareness",
    icon: Hand,
    instruction: "Touch 4 different textures around you",
    duration: 12,
    color: "#3B82F6"
  },
  {
    title: "Auditory Focus",
    icon: Ear,
    instruction: "Identify 3 sounds in your environment",
    duration: 10,
    color: "#10B981"
  },
  {
    title: "Body Scan",
    icon: Circle,
    instruction: "Feel 2 points of contact with your body",
    duration: 10,
    color: "#F59E0B"
  },
  {
    title: "Verbal Affirmation",
    icon: MessageCircle,
    instruction: "Say out loud: 'I am awake and present'",
    duration: 8,
    color: "#EC4899"
  }
];

export default function RealityAnchoringScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXERCISES[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      handleStepComplete();
    }
  }, [isActive, timeLeft]);

  const handleStepComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    
    if (currentStep < EXERCISES.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeLeft(EXERCISES[nextStep].duration);
    } else {
      setIsComplete(true);
      setIsActive(false);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setTimeLeft(EXERCISES[0].duration);
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsComplete(false);
  };

  const currentExercise = EXERCISES[currentStep];
  const Icon = currentExercise.icon;
  const progress = ((EXERCISES.length - (EXERCISES.length - completedSteps.length)) / EXERCISES.length) * 100;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#110d1f]' : 'bg-[#f8f9fc]'}`}>
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
              Reality Anchoring Exercise
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              5-4-3-2-1 Grounding Technique
            </p>
          </div>

          <div className={`p-2.5 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Zap className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {!isActive && !isComplete && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-md"
            >
              <motion.div
                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20' : 'bg-gradient-to-br from-purple-100 to-indigo-100'
                }`}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </motion.div>

              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ground Yourself in Reality
              </h2>
              
              <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                This 60-second exercise will help you differentiate dream memories from reality 
                using the 5-4-3-2-1 grounding technique. Focus on your immediate sensory environment.
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startExercise}
                className={`w-full py-4 rounded-2xl font-bold text-base ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                }`}
              >
                Start Exercise
              </motion.button>
            </motion.div>
          )}

          {isActive && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-md w-full"
            >
              {/* Timer Circle */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="90"
                    stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="90"
                    stroke={currentExercise.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: timeLeft / currentExercise.duration }}
                    transition={{ duration: 0.5 }}
                    style={{
                      strokeDasharray: 565.48,
                      strokeDashoffset: 565.48 * (1 - timeLeft / currentExercise.duration),
                      filter: `drop-shadow(0 0 10px ${currentExercise.color})`
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Icon 
                    className="w-12 h-12 mb-2" 
                    style={{ color: currentExercise.color }}
                  />
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {timeLeft}
                  </span>
                </div>
              </div>

              {/* Current Exercise */}
              <div className={`rounded-2xl p-6 mb-6 ${
                isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
              }`}>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentExercise.title}
                </h3>
                <p className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {currentExercise.instruction}
                </p>
              </div>

              {/* Progress Indicators */}
              <div className="flex justify-center gap-2">
                {EXERCISES.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      completedSteps.includes(index) || index === currentStep
                        ? 'w-8'
                        : 'w-2'
                    }`}
                    style={{
                      backgroundColor: completedSteps.includes(index)
                        ? currentExercise.color
                        : index === currentStep
                        ? `${currentExercise.color}80`
                        : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-green-100 to-emerald-100'
                }`}
              >
                <CheckCircle2 className={`w-12 h-12 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </motion.div>

              <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Exercise Complete!
              </h2>
              
              <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                You've successfully grounded yourself in reality. Your conscious awareness has been 
                anchored to the present moment, differentiating waking life from dream memories.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={startExercise}
                  className={`w-full py-4 rounded-2xl font-semibold text-base ${
                    isDark 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  Do It Again
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className={`w-full py-4 rounded-2xl font-bold text-base ${
                    isDark 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  }`}
                >
                  Return to Sleep Analysis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}