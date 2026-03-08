import { motion } from "motion/react";
import { useState } from "react";
import { Eye, Hand, Wind, Brain, AlertTriangle, CheckCircle } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";
import { useNavigate } from "react-router";

export default function SensoryInterventionCard() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [hasAdded, setHasAdded] = useState(false);

  const phobiaData = {
    id: "Claustrophobia (Visual Expansion)",
    sense: "Visual",
    icon: Eye,
    trigger: "Claustrophobia",
    desc: "Neural patterns indicated spatial confinement distress. Suggest applying Visual Spatial Expansion to alter perceived room dimensions in future dreams."
  };

  const Icon = phobiaData.icon;

  const handleAddIntervention = () => {
    setHasAdded(true);
    // Store in localStorage
    const saved = localStorage.getItem("lucidia_addedPhobias");
    const current = saved ? JSON.parse(saved) : [];
    if (!current.includes(phobiaData.id)) {
      localStorage.setItem("lucidia_addedPhobias", JSON.stringify([...current, phobiaData.id]));
    }
  };

  return (
    <div className="space-y-4">
      {/* Sensory Discomfort Detection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`rounded-[2rem] p-6 border ${
          isDark 
            ? 'bg-indigo-900/20 border-indigo-500/30' 
            : 'bg-indigo-50 border-indigo-200'
        }`}
        style={{
          boxShadow: isDark 
            ? '0 8px 20px -4px rgba(0,0,0,0.3)' 
            : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-base font-bold tracking-tight ${
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            Sensory Discomfort Detected
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
            isDark 
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
              : 'bg-white text-indigo-600 border-indigo-200'
          }`}>
            Sense: {phobiaData.sense}
          </span>
          <span className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
            isDark 
              ? 'bg-red-500/10 text-red-300 border-red-500/20' 
              : 'bg-white text-red-600 border-red-200'
          }`}>
            Trigger: {phobiaData.trigger}
          </span>
        </div>

        <p className={`text-sm mb-5 leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {phobiaData.desc}
        </p>

        <button
          onClick={handleAddIntervention}
          disabled={hasAdded}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            hasAdded
              ? (isDark 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-green-50 text-green-600 border border-green-200')
              : (isDark
                  ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md')
          }`}
        >
          {hasAdded ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Added to Override Protocol
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Add to Sensory Override Protocol
            </>
          )}
        </button>
      </motion.div>

      {/* Configure Medical Interventions Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/sensory-override")}
        className={`w-full py-4 rounded-[2rem] border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          isDark 
            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 shadow-lg shadow-red-500/10' 
            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-md'
        }`}
      >
        <AlertTriangle className="w-5 h-5" />
        Configure Medical Interventions
      </motion.button>
    </div>
  );
}
