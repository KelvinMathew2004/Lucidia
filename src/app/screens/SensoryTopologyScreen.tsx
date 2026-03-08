import { motion } from "motion/react";
import { ChevronLeft, Brain, Sparkles, Calendar, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router";
import SensoryTopology from "../components/dream/SensoryTopology";
import GlassCard from "../components/shared/GlassCard";
import { useTheme } from "../components/shared/ThemeContext";

export default function SensoryTopologyScreen() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className="h-screen overflow-y-auto bg-[#030213] relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)"
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -top-10 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)"
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #EC4899 0%, transparent 70%)"
          }}
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <div className="flex-1 ml-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-white text-xl font-semibold">Sensory Topology</h1>
              <p className="text-white/50 text-sm mt-0.5">REM Sleep Analysis</p>
            </motion.div>
          </div>

          <motion.div
            className="p-2.5 rounded-full bg-purple-500/20 border border-purple-400/30"
            animate={{
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>

        {/* Dream Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="mb-6 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold mb-1">Dream Session #47</h2>
                <p className="text-white/60 text-sm">March 8, 2026</p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30">
                <span className="text-purple-300 text-xs font-medium">REM Stage 4</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Duration</p>
                  <p className="text-white text-sm font-medium">47 min</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-500/10">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs">Lucidity</p>
                  <p className="text-white text-sm font-medium">High</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <GlassCard className="p-6 mb-6">
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-1">Neural Mapping</h3>
              <p className="text-white/50 text-sm">
                8-dimensional sensory analysis during REM sleep
              </p>
            </div>

            <SensoryTopology />
          </GlassCard>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-white font-semibold">Key Insights</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-400/20">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-200 text-sm font-medium mb-1">
                    Extreme Vestibular Activity
                  </p>
                  <p className="text-orange-100/60 text-xs leading-relaxed">
                    95% activation indicates intense falling sensation, common in lucid dream transitions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-purple-200 text-sm font-medium mb-1">
                    Time Dilation Detected
                  </p>
                  <p className="text-purple-100/60 text-xs leading-relaxed">
                    91% chronoception suggests perceived dream duration far exceeded actual REM time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-cyan-200 text-sm font-medium mb-1">
                    Sleep Paralysis Marker
                  </p>
                  <p className="text-cyan-100/60 text-xs leading-relaxed">
                    Low proprioception (34%) indicates successful REM atonia, preventing physical movement
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* View Neural Playback Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6"
        >
          <motion.button
            onClick={() => navigate("/neural-playback")}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-2xl border bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-400/30 hover:border-red-400/50 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Play className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">View Neural Playback</h4>
                <p className="text-white/50 text-xs">Review Night Terror intervention timeline</p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Technical Info */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/30 text-xs">
            Neural data captured via Lucidia BCI • Sleep Session #47
          </p>
        </motion.div>
      </div>
    </div>
  );
}