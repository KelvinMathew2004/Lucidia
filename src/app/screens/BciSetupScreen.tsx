import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Cpu, CircleCheck, Loader2, Target, Smartphone, ShieldCheck, Wifi, User, Activity } from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";

const BCI_MODELS = [
  "NeuroLink v2.4",
  "Cortical Sync Pro",
  "NeuralWeave Active",
  "CerebroBand Lite",
  "DreamCapture X1"
];

const APP_GOALS = [
  "Dream Recording",
  "Lucid Dream Induction",
  "Sleep Cycle Optimization",
  "Memory Consolidation",
  "Nightmare Prevention"
];

// Helper to generate random particles for "sucking in" animation
const PARTICLES = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  angle: Math.random() * Math.PI * 2,
  distance: 100 + Math.random() * 150,
  duration: 0.6 + Math.random() * 0.8,
  delay: Math.random() * 1.5,
  size: 3 + Math.random() * 4,
}));

export default function BciSetupScreen() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [step, setStep] = useState(0); // 0: BCI Pair, 1: Data Sync, 2: Profile & Goals
  const [name, setName] = useState("");
  const [selectedModel, setSelectedModel] = useState(BCI_MODELS[0]);
  const [pairingStatus, setPairingStatus] = useState<"idle" | "pairing" | "success">("idle");
  const [syncStatus, setSyncStatus] = useState<"idle" | "scanning" | "found" | "confirming" | "syncing" | "success">("idle");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    const savedName = localStorage.getItem("lucidia_userName");
    if (savedName) setName(savedName);
  }, []);

  const handleBciPairing = () => {
    setPairingStatus("pairing");
    setTimeout(() => {
      setPairingStatus("success");
    }, 2500);
  };

  const handleStartSync = () => {
    setSyncStatus("scanning");
    setTimeout(() => {
      setSyncStatus("found");
    }, 2500);
  };

  const handleConnectDevice = () => {
    setSyncStatus("confirming");
    setTimeout(() => {
      setSyncStatus("syncing");
      setTimeout(() => {
        setSyncStatus("success");
        // Pre-fill profile since we synced
        setName("Alex");
        setSelectedGoals([APP_GOALS[0], APP_GOALS[2]]);
      }, 3500);
    }, 2500);
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const completeSetup = () => {
    if (name.trim()) {
      localStorage.setItem("lucidia_userName", name.trim());
    }
    localStorage.setItem("lucidia_setupComplete", "true");
    navigate("/home");
  };

  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <div className={`absolute inset-0 -z-10 ${isDark ? 'bg-[#110d1f]' : 'bg-[#F4F2FA]'}`} />
      
      {/* Background gradients with blur to prevent banding/blocking */}
      <div className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b opacity-60 -z-10 blur-3xl ${isDark ? 'from-indigo-900/40 to-transparent' : 'from-indigo-200/50 to-transparent'}`} style={{ transform: 'translate3d(0,0,0)' }} />
      <div className={`absolute top-[-20%] left-[-10%] w-[120%] h-96 bg-indigo-500/10 rounded-[100%] blur-[80px] -z-10 pointer-events-none`} />

      {/* Top bar with progress */}
      <div className="flex items-center justify-between pt-14 px-5 z-10">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-indigo-500' : `w-4 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 pb-8 overflow-hidden z-10">
        <AnimatePresence mode="wait">
          
          {/* Step 0: BCI Pair */}
          {step === 0 && (
            <motion.div
              key="bci"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <Cpu className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Connect BCI
                </h1>
              </div>
              <p className={`text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Select your Brain-Computer Interface model to authorize real-time neural syncing.
              </p>

              <div className="flex-1 flex flex-col items-center justify-center">
                {pairingStatus === "idle" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-4"
                  >
                    <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Available Devices
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className={`w-full px-5 py-4 rounded-2xl outline-none font-medium appearance-none ${
                        isDark 
                          ? 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50' 
                          : 'bg-white border border-slate-200 text-slate-900 shadow-sm focus:border-indigo-400'
                      }`}
                    >
                      {BCI_MODELS.map(model => (
                        <option key={model} value={model} className={isDark ? "bg-slate-900" : ""}>{model}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {pairingStatus === "pairing" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                      <div className={`p-6 rounded-full ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                      </div>
                    </div>
                    <p className={`text-lg font-medium animate-pulse ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      Establishing secure link with {selectedModel}...
                    </p>
                  </motion.div>
                )}

                {pairingStatus === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="relative">
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} 
                        className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" 
                      />
                      <div className={`p-6 rounded-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <CircleCheck className="w-12 h-12 text-emerald-500" />
                      </div>
                    </div>
                    <p className={`text-lg font-medium text-emerald-500`}>
                      Neural Link Established
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-indigo-50 border border-indigo-100'}`}>
                <ShieldCheck className={`w-6 h-6 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-indigo-600'}`} />
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Your neural data is secured using advanced post-quantum cryptography standards. All cognitive analysis is strictly performed using on-device models to ensure total privacy.
                </p>
              </div>

              {pairingStatus === "idle" && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBciPairing}
                  className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30"
                >
                  Authorize Pairing
                </motion.button>
              )}
              {pairingStatus === "success" && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Step 1: Data Transfer */}
          {step === 1 && (
            <motion.div
              key="transfer"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <Wifi className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Data Transfer
                </h1>
              </div>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Sync previous sleep metrics and neural profiles from a nearby device.
              </p>

              <div className="flex-1 flex flex-col items-center justify-center">
                {syncStatus === "idle" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <Smartphone className={`w-10 h-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                    <p className={`text-center mb-8 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Make sure your previous device is unlocked and nearby to transfer data securely.
                    </p>
                  </motion.div>
                )}

                {syncStatus === "scanning" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    {/* Radar animation */}
                    <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                      <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full border-2 border-indigo-500" />
                      <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }} className="absolute inset-0 rounded-full border-2 border-indigo-500" />
                      <Activity className="w-10 h-10 text-indigo-500 z-10" />
                    </div>
                    <p className={`text-lg font-medium animate-pulse ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      Scanning for nearby devices...
                    </p>
                  </motion.div>
                )}

                {syncStatus === "found" && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full">
                    <div className={`w-full p-6 rounded-2xl border mb-6 flex flex-col items-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <Smartphone className={`w-12 h-12 mb-3 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                      <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Alex's iPhone 15 Pro</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready to pair</p>
                    </div>
                  </motion.div>
                )}

                {syncStatus === "confirming" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
                      <Smartphone className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className={`text-lg font-medium text-center px-4 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      Please confirm the connection on Alex's iPhone 15 Pro...
                    </p>
                  </motion.div>
                )}

                {syncStatus === "syncing" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center relative w-full h-64 justify-center">
                    <div className="relative w-24 h-24 flex items-center justify-center z-10">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse" />
                      <Activity className="w-12 h-12 text-indigo-400 relative z-10" />
                    </div>
                    
                    {/* Sucking in particles */}
                    {PARTICLES.map(p => (
                      <motion.div
                        key={p.id}
                        initial={{ 
                          x: Math.cos(p.angle) * p.distance, 
                          y: Math.sin(p.angle) * p.distance,
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{ 
                          x: 0, 
                          y: 0,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0.5]
                        }}
                        transition={{ 
                          duration: p.duration, 
                          repeat: Infinity, 
                          delay: p.delay,
                          ease: "easeIn"
                        }}
                        className="absolute top-1/2 left-1/2 rounded-full bg-indigo-400"
                        style={{ width: p.size, height: p.size, marginLeft: -p.size/2, marginTop: -p.size/2 }}
                      />
                    ))}
                    
                    <p className={`mt-8 text-sm font-medium animate-pulse text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Transferring neural patterns and sleep history...
                    </p>
                  </motion.div>
                )}

                {syncStatus === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                      <div className={`p-6 rounded-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <CircleCheck className="w-12 h-12 text-emerald-500" />
                      </div>
                    </div>
                    <p className={`text-lg font-medium text-emerald-500`}>
                      Data Successfully Transferred
                    </p>
                  </motion.div>
                )}
              </div>

              {syncStatus === "idle" && (
                <div className="flex flex-col gap-3 mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartSync}
                    className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30"
                  >
                    Scan for Devices
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(2)}
                    className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
                      isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Skip Transfer
                  </motion.button>
                </div>
              )}

              {syncStatus === "found" && (
                <div className="flex flex-col gap-3 mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConnectDevice}
                    className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30"
                  >
                    Connect
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSyncStatus("idle")}
                    className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
                      isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </motion.button>
                </div>
              )}

              {syncStatus === "success" && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(2)}
                  className="mt-auto w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Step 2: Profile & Goals */}
          {step === 2 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-2">
                <User className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Profile & Goals
                </h1>
              </div>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Confirm your details. These settings can be adjusted later.
              </p>

              <div className="flex-1 overflow-y-auto pb-4 pr-1 -mr-1">
                <div className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      What should we call you?
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className={`w-full text-lg px-5 py-4 rounded-2xl outline-none font-medium transition-all ${
                        isDark 
                          ? 'bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-indigo-500' 
                          : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-300 focus:border-indigo-500 shadow-sm'
                      }`}
                    />
                  </div>

                  {/* Goals Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <Target className="w-4 h-4" /> Primary Objectives
                    </label>
                    <div className="flex flex-col gap-2">
                      {APP_GOALS.map((goal, i) => {
                        const isSelected = selectedGoals.includes(goal);
                        return (
                          <motion.button
                            key={goal}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleGoal(goal)}
                            className={`flex items-center p-4 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? `border-indigo-500 ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'}`
                                : isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                              isSelected ? 'border-indigo-500 bg-indigo-500' : isDark ? 'border-slate-600' : 'border-slate-300'
                            }`}>
                              {isSelected && <CircleCheck className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`font-medium ${
                              isSelected ? (isDark ? 'text-white' : 'text-indigo-900') : (isDark ? 'text-slate-300' : 'text-slate-700')
                            }`}>
                              {goal}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(3)}
                disabled={!name.trim() || selectedGoals.length === 0}
                className={`mt-4 w-full py-4 rounded-2xl text-white font-semibold transition-all shrink-0 ${
                  name.trim() && selectedGoals.length > 0 ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-indigo-500/30 cursor-not-allowed'
                }`}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Medical Emergency Settings */}
          {step === 3 && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className={`w-8 h-8 text-red-500`} />
                <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Neural Override
                </h1>
              </div>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Lucidia can use your BCI to actively combat sleep disorders by emitting precise neural counter-signals.
              </p>

              <div className="flex-1 overflow-y-auto pb-4 pr-1 -mr-1">
                <div className="space-y-6">
                  <div className={`p-4 rounded-2xl flex items-start gap-3 ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'}`}>
                    <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-red-400' : 'text-red-700'}`}>Important Warning</h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-red-200' : 'text-red-800'}`}>
                        By default, Lucidia only <strong>reads</strong> neural data. Enabling Neural Override gives the device permission to <strong>write</strong> data directly to your cortex. Only use this if you suffer from severe insomnia, recurring trauma nightmares, or sleepwalking. 
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Enable Override</span>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          name="toggle" 
                          id="toggle" 
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          onChange={(e) => {
                            if (e.target.checked) {
                              localStorage.setItem("lucidia_interventionActive", "true");
                            } else {
                              localStorage.removeItem("lucidia_interventionActive");
                            }
                          }}
                        />
                        <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer ${isDark ? 'bg-slate-700' : ''}`}></label>
                      </div>
                      <style dangerouslySetInnerHTML={{ __html: `
                        .toggle-checkbox:checked {
                          right: 0;
                          border-color: #ef4444;
                        }
                        .toggle-checkbox:checked + .toggle-label {
                          background-color: #ef4444;
                        }
                        .toggle-checkbox {
                          right: 24px;
                          z-index: 1;
                          border-color: #cbd5e1;
                          transition: all 0.3s;
                        }
                      `}} />
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      You can turn this on or off at any time from the main dashboard or dream analysis views.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={completeSetup}
                className="mt-4 w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 shrink-0"
              >
                Complete Setup
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
