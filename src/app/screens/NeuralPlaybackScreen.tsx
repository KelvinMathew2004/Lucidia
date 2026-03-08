import { motion } from "motion/react";
import { ChevronLeft, AlertTriangle, Brain, Clock, Activity, TrendingDown, Shield, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import NeuralPlaybackScrubber from "../components/dream/NeuralPlaybackScrubber";
import GlassCard from "../components/shared/GlassCard";

export default function NeuralPlaybackScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030213] pb-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #EF4444 0%, transparent 70%)"
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
          className="absolute top-1/3 right-10 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)"
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
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-6 max-w-6xl mx-auto">
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
              <h1 className="text-white text-xl font-semibold">Neural Playback</h1>
              <p className="text-white/50 text-sm mt-0.5">Night Terror Event Analysis</p>
            </motion.div>
          </div>

          <motion.div
            className="p-2.5 rounded-full bg-red-500/20 border border-red-400/30"
            animate={{
              boxShadow: [
                "0 0 20px rgba(239, 68, 68, 0.3)",
                "0 0 30px rgba(239, 68, 68, 0.5)",
                "0 0 20px rgba(239, 68, 68, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </motion.div>
        </div>

        {/* Event Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="px-2 py-1 rounded-md bg-red-500/10 border border-red-400/20">
                <span className="text-red-300 text-[10px] font-bold">CRITICAL</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Event Type</h3>
            <p className="text-white/60 text-sm">Night Terror</p>
            <p className="text-white/40 text-xs mt-2">Detected at 03:14:22 AM</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Brain className="w-5 h-5 text-orange-400" />
              </div>
              <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-400/20">
                <span className="text-green-300 text-[10px] font-bold">AUTO-RESOLVED</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">BCI Response</h3>
            <p className="text-white/60 text-sm">Intervention Deployed</p>
            <p className="text-white/40 text-xs mt-2">Somatic Warmth Protocol</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingDown className="w-5 h-5 text-blue-400" />
              </div>
              <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-400/20">
                <span className="text-blue-300 text-[10px] font-bold">STABLE</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Recovery Time</h3>
            <p className="text-white/60 text-sm">8.4 seconds</p>
            <p className="text-white/40 text-xs mt-2">47% faster than avg</p>
          </GlassCard>
        </motion.div>

        {/* Neural Playback Scrubber */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <NeuralPlaybackScrubber />
        </motion.div>

        {/* Analysis Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">Clinical Analysis</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white/80 text-sm font-medium mb-2">Event Trigger</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Multi-sensory convergence detected at 02:22 into REM cycle. Simultaneous spikes in interoceptive stress (internal dread), proprioceptive disruption (sleep paralysis), and thermoceptive anomaly (cold sweat) created a critical threshold breach.
                </p>
              </div>

              <div className="h-px bg-white/5" />

              <div>
                <h4 className="text-white/80 text-sm font-medium mb-2">BCI Intervention Protocol</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  The Lucidia BCI automatically deployed a "Somatic Warmth & Kinetic Freedom" protocol. This intervention included:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-white/80">Thermoregulation:</strong> Gentle warming stimulus to counteract cold sweat response</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-white/80">Motor Reactivation:</strong> Subtle muscle stimulation to break paralysis perception</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <span><strong className="text-white/80">Vagal Tone Modulation:</strong> Parasympathetic activation to reduce visceral panic</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-white/5" />

              <div>
                <h4 className="text-white/80 text-sm font-medium mb-2">Outcome</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Subject returned to normal REM sleep within 8.4 seconds of intervention deployment. No conscious awakening occurred. Sleep quality score remained above 90% for the remainder of the night.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-400/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-green-300 font-semibold text-sm mb-1">Protective Intervention Success</h5>
                    <p className="text-green-200/60 text-xs leading-relaxed">
                      This event demonstrates the BCI's ability to detect and neutralize nocturnal distress before it escalates to full consciousness disruption. Without intervention, estimated wake probability was 87%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Configure Protocols Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6"
        >
          <motion.button
            onClick={() => navigate("/sensory-override")}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-2xl border bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30 hover:border-blue-400/50 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Settings className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Configure Override Protocols</h4>
                <p className="text-white/50 text-xs">Set up additional sensory interventions</p>
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
            Neural data captured via Lucidia BCI • Event ID: NT-2026-03-08-03:14
          </p>
        </motion.div>
      </div>
    </div>
  );
}