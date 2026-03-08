import { motion } from "motion/react";
import { useState } from "react";
import { ChevronLeft, Clock, AlertTriangle, Zap, Volume2, Vibrate, Shield, Info, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import GlassCard from "../components/shared/GlassCard";
import SlideToConfirm from "../components/shared/SlideToConfirm";

export default function SensoryOverrideScreen() {
  const navigate = useNavigate();
  const [isMetronomeEnabled, setIsMetronomeEnabled] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAuthorization = () => {
    setIsAuthorized(true);
    
    // Show success and navigate back after delay
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#030213] pb-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)"
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)"
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-6 max-w-2xl mx-auto">
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
              <h1 className="text-white text-xl font-semibold">Sensory Override Protocol</h1>
              <p className="text-white/50 text-sm mt-0.5">Configure neural intervention</p>
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
            <Shield className="w-5 h-5 text-red-400" />
          </motion.div>
        </div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-400/30 flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-orange-200 font-semibold text-sm mb-1">
                  Neural Write-Access Required
                </h3>
                <p className="text-orange-100/70 text-xs leading-relaxed">
                  This protocol requires permission to actively modify sensory perception during REM sleep. Authorization is required for each intervention type and can be revoked at any time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chronoception Anchor Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <GlassCard className="p-6 border-2 border-blue-500/20">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <motion.div
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.2)",
                      "0 0 30px rgba(59, 130, 246, 0.4)",
                      "0 0 20px rgba(59, 130, 246, 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Clock className="w-6 h-6 text-blue-400" />
                </motion.div>
                <div>
                  <h2 className="text-white text-lg font-semibold mb-1">
                    Chronoception Anchor
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Detects severe time-dilation during REM. Prevents the distressing sensation of years passing in minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

            {/* Detection Info */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-1">Detection Criteria</h4>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Monitors chronoception intensity in real-time. Triggers when subjective time perception exceeds 300% of actual elapsed REM duration.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Threshold</p>
                  <p className="text-white font-semibold text-sm">300% dilation</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/40 text-xs mb-1">Response Time</p>
                  <p className="text-white font-semibold text-sm">&lt; 2 seconds</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

            {/* Intervention Toggle */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-white/80 text-sm font-medium mb-1">Intervention Method</h4>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">
                    When time-dilation is detected, the BCI will stabilize temporal perception.
                  </p>
                </div>
              </div>

              {/* Toggle Card */}
              <motion.div
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  isMetronomeEnabled
                    ? "bg-purple-500/10 border-purple-400/40"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                onClick={() => setIsMetronomeEnabled(!isMetronomeEnabled)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className={`w-4 h-4 ${isMetronomeEnabled ? "text-purple-400" : "text-white/40"}`} />
                      <Vibrate className={`w-4 h-4 ${isMetronomeEnabled ? "text-purple-400" : "text-white/40"}`} />
                      <h5 className={`text-sm font-semibold ${isMetronomeEnabled ? "text-white" : "text-white/70"}`}>
                        Rhythmic Metronome Protocol
                      </h5>
                    </div>
                    <p className={`text-xs leading-relaxed ${isMetronomeEnabled ? "text-purple-100/70" : "text-white/50"}`}>
                      Inject rhythmic metronome (Auditory + Haptic) to ground time perception
                    </p>

                    {isMetronomeEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-purple-400/20"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-200/70">Frequency</span>
                            <span className="text-purple-300 font-medium">60 BPM</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-200/70">Auditory Volume</span>
                            <span className="text-purple-300 font-medium">Subtle (15%)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-200/70">Haptic Intensity</span>
                            <span className="text-purple-300 font-medium">Light (25%)</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex-shrink-0 pt-1">
                    <motion.div
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${
                        isMetronomeEnabled ? "bg-purple-500/40" : "bg-white/10"
                      }`}
                      animate={{
                        boxShadow: isMetronomeEnabled
                          ? "0 0 20px rgba(139, 92, 246, 0.4)"
                          : "none"
                      }}
                    >
                      <motion.div
                        className={`w-5 h-5 rounded-full ${
                          isMetronomeEnabled ? "bg-purple-400" : "bg-white/40"
                        }`}
                        animate={{
                          x: isMetronomeEnabled ? 20 : 0
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Authorization Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">User Consent Required</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  You must explicitly authorize this protocol before it can be deployed during sleep. This is a strict safeguard to ensure you maintain full control over neural interventions.
                </p>
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-300 text-xs font-semibold">Encrypted</span>
                </div>
                <p className="text-green-200/50 text-[10px]">End-to-end neural security</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-300 text-xs font-semibold">Revocable</span>
                </div>
                <p className="text-blue-200/50 text-[10px]">Disable anytime in settings</p>
              </div>
            </div>

            {/* Slide to Confirm */}
            <div>
              <p className="text-white/40 text-xs mb-3 text-center">
                Slide to authorize neural write-access
              </p>
              <SlideToConfirm
                onConfirm={handleAuthorization}
                text="Slide to Authorize Neural Write-Access"
                disabled={!isMetronomeEnabled}
              />
              {!isMetronomeEnabled && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-orange-300/70 text-xs text-center mt-3"
                >
                  Enable an intervention method to authorize
                </motion.p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Success State */}
        {isAuthorized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-6"
          >
            <div className="rounded-2xl border-2 border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-3 mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="p-3 rounded-full bg-green-500/20 border border-green-400/40"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </motion.div>
                <h3 className="text-green-300 text-lg font-semibold">Protocol Activated</h3>
              </div>
              <p className="text-green-200/70 text-sm text-center leading-relaxed">
                Chronoception Anchor is now active. The BCI will monitor for time-dilation events and deploy interventions as configured.
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/30 text-xs leading-relaxed">
            All neural interventions are logged and can be reviewed in your sleep history. <br />
            You can revoke authorization at any time in Settings → Neural Access.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
