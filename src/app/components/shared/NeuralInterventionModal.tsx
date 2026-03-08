import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Activity, X, ShieldAlert, Cpu, CheckCircle2, Moon, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  triggerContext?: string; // "home" or "dream_analysis"
}

export default function NeuralInterventionModal({ isOpen, onClose, triggerContext = "home" }: Props) {
  const { isDark } = useTheme();
  // 0: Warning, 1: Settings/Timings, 2: Simulating Send, 3: Active
  const [step, setStep] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState<string>("Insomnia");
  const [selectedTiming, setSelectedTiming] = useState<string>("During REM cycle");
  const [customPhobias, setCustomPhobias] = useState<string[]>([]);

  const issues = ["Insomnia", "Recurring Nightmares", "Sleepwalking", "Night Terrors", "Sleep Paralysis"];
  const timings = ["Only when detected", "During REM cycle", "Deep Sleep Phase", "Continuous Light Pulses"];

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      // Check if already active
      const isActive = localStorage.getItem("lucidia_interventionActive") === "true";
      setStep(isActive ? 3 : 0);
      
      const savedPhobias = localStorage.getItem("lucidia_addedPhobias");
      if (savedPhobias) {
        const parsed = JSON.parse(savedPhobias);
        setCustomPhobias(parsed);
        if (parsed.length > 0 && triggerContext === "dream_analysis") {
          setSelectedIssue(parsed[parsed.length - 1]);
        }
      }
    }
  }, [isOpen, triggerContext]);

  const handleActivate = () => {
    setStep(2);
    setTimeout(() => {
      localStorage.setItem("lucidia_interventionActive", "true");
      setStep(3);
    }, 3000);
  };

  const handleDeactivate = () => {
    localStorage.setItem("lucidia_interventionActive", "false");
    setStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl ${
            isDark ? "bg-[#161224] border-red-500/20 shadow-red-500/10" : "bg-white border-red-200 shadow-red-200/50"
          }`}
        >
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? "border-white/10" : "border-slate-100"
          }`}>
            <div className="flex items-center gap-2 text-red-500">
              <Activity className="w-5 h-5" />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Medical Intervention</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? "bg-white/5 hover:bg-white/10 text-slate-400" : "bg-slate-100 hover:bg-slate-200 text-slate-500"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 relative">
            <AnimatePresence mode="wait">
              {/* Step 0: Warning */}
              {step === 0 && (
                <motion.div
                  key="warning"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Override Neural Constraints?
                  </h3>
                  <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Until now, your headset only had permission to <strong className={isDark ? "text-slate-200" : "text-slate-800"}>receive</strong> dream data. 
                    Activating Neural Intervention grants the device permission to <strong className="text-red-500">transmit active counter-signals</strong> to manipulate your dreams in real-time.
                  </p>
                  <div className={`w-full p-4 rounded-2xl text-left mb-6 flex items-start gap-3 ${
                    isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"
                  }`}>
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className={`text-xs ${isDark ? "text-red-200" : "text-red-800"}`}>
                      This mode should only be used to counter severe medical issues such as recurring trauma, extreme sleepwalking, or intense insomnia. You can revoke this permission at any time.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  >
                    I Understand the Risks
                  </button>
                </motion.div>
              )}

              {/* Step 1: Configuration */}
              {step === 1 && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col"
                >
                  <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Configure Intervention
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Target Issue
                      </label>
                      <select
                        value={selectedIssue}
                        onChange={(e) => setSelectedIssue(e.target.value)}
                        className={`w-full p-3 rounded-xl outline-none text-sm appearance-none ${
                          isDark ? "bg-white/5 border border-white/10 text-white" : "bg-slate-50 border border-slate-200 text-slate-900"
                        }`}
                      >
                        <optgroup label="General Sleep Issues" className={isDark ? "bg-zinc-900" : ""}>
                          {issues.map(issue => <option key={issue} value={issue}>{issue}</option>)}
                        </optgroup>
                        {customPhobias.length > 0 && (
                          <optgroup label="Sensory Phobias (Added)" className={isDark ? "bg-zinc-900" : ""}>
                            {customPhobias.map(phobia => <option key={phobia} value={phobia}>{phobia}</option>)}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        <Clock className="w-3 h-3" /> Allowed Timing
                      </label>
                      <select
                        value={selectedTiming}
                        onChange={(e) => setSelectedTiming(e.target.value)}
                        className={`w-full p-3 rounded-xl outline-none text-sm appearance-none ${
                          isDark ? "bg-white/5 border border-white/10 text-white" : "bg-slate-50 border border-slate-200 text-slate-900"
                        }`}
                      >
                        {timings.map(t => <option key={t} value={t} className={isDark ? "bg-zinc-900" : ""}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(0)}
                      className={`flex-1 py-3.5 rounded-xl font-medium transition-colors ${
                        isDark ? "bg-white/5 text-slate-300 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleActivate}
                      className="flex-[2] py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex justify-center items-center gap-2"
                    >
                      <Cpu className="w-4 h-4" /> Send to Headset
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Simulating Send */}
              {step === 2 && (
                <motion.div
                  key="sending"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-red-500"
                    />
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center relative z-10">
                      <Cpu className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 animate-pulse ${isDark ? "text-white" : "text-slate-900"}`}>
                    Awaiting Headset Approval...
                  </h3>
                  <p className={`text-sm text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Double tap the right node on your device to confirm new firmware overrides.
                  </p>
                </motion.div>
              )}

              {/* Step 3: Active */}
              {step === 3 && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 text-red-500`}>
                    Intervention Active
                  </h3>
                  <p className={`text-sm mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Your BCI is now actively monitoring for <strong className="text-red-500">{selectedIssue}</strong> and will transmit counter-signals <strong>{selectedTiming.toLowerCase()}</strong>.
                  </p>
                  
                  <button
                    onClick={handleDeactivate}
                    className={`w-full py-3.5 rounded-xl font-medium transition-colors ${
                      isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    Deactivate Override
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
