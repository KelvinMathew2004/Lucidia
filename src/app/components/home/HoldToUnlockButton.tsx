import { motion, useAnimation, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Brain, Cpu, Zap } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";

export default function HoldToUnlockButton() {
  const [isPressing, setIsPressing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loadingText, setLoadingText] = useState("Hold to Sync");
  const controls = useAnimation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const DURATION_MS = 3000;

  const handlePointerDown = () => {
    if (isUnlocked) return;
    setIsPressing(true);
    setLoadingText("Retrieving Neural Data...");

    // Start stroke animation
    controls.start({
      pathLength: 1,
      transition: { duration: DURATION_MS / 1000, ease: "linear" },
    });

    // Sequence loading text to make it feel like real retrieval
    setTimeout(() => {
      if (timerRef.current && !isUnlocked) setLoadingText("Analyzing Sleep Cycles...");
    }, 1000);

    setTimeout(() => {
      if (timerRef.current && !isUnlocked) setLoadingText("Synthesizing Dreams...");
    }, 2000);

    // Start timer for unlock
    timerRef.current = setTimeout(() => {
      setIsUnlocked(true);
      setIsPressing(false);
      setLoadingText("Access Granted");
      
      // Navigate to the next screen after ripple covers
      setTimeout(() => {
        navigate("/sleep");
      }, 1600);
    }, DURATION_MS);
  };

  const handlePointerUp = () => {
    if (isUnlocked) return;
    setIsPressing(false);
    setLoadingText("Hold to Sync");

    // Stop timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Reset stroke animation
    controls.start({
      pathLength: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple Effect (Full Screen overlay trigger) */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
          >
            {/* Multiple expanding ripple rings */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`explode-ring-${i}`}
                initial={{ scale: 0, opacity: 0.8, borderWidth: "40px" }}
                animate={{ 
                  scale: 15 + i * 5, 
                  opacity: 0,
                  borderWidth: "0px"
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.15,
                  ease: "easeOut" 
                }}
                className="absolute w-40 h-40 rounded-full border-indigo-300"
              />
            ))}

            {/* Central light burst that eventually covers the whole screen */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 35, opacity: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.3, 
                ease: [0.32, 0.72, 0, 1] 
              }}
              className={`absolute w-40 h-40 rounded-full ${isDark ? 'bg-[#1a1028]' : 'bg-[#f8f9fc]'} shadow-[0_0_100px_rgba(255,255,255,1)]`}
            />

            {/* Screen-wide white out fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`absolute inset-0 ${isDark ? 'bg-[#1a1028]' : 'bg-[#f8f9fc]'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hold Button Area */}
      <div 
        className="relative flex items-center justify-center w-72 h-72 touch-none group cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Continuous ripples while pressing */}
        {isPressing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`press-ripple-${i}`}
                className="absolute w-52 h-52 rounded-full border border-violet-400/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Decorative Outer Rings */}
        <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.15]" />
        <div className="absolute inset-0 rounded-full border border-indigo-500/10 scale-[1.05]" />

        {/* SVG Ring Background */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
          {/* Dashed background track */}
          <circle
            cx="144"
            cy="144"
            r="120"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
            strokeDasharray="8 8"
          />
          {/* Animated Stroke */}
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={controls}
            style={{ filter: "drop-shadow(0 0 12px rgba(167,139,250,0.8))" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" /> {/* violet-400 */}
              <stop offset="50%" stopColor="#f472b6" /> {/* pink-400 */}
              <stop offset="100%" stopColor="#818cf8" /> {/* indigo-400 */}
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Button Circle */}
        <motion.div
          className="relative w-52 h-52 rounded-full bg-gradient-to-br from-indigo-900/40 to-violet-900/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden"
          animate={{ 
            scale: isPressing ? 0.92 : 1,
            boxShadow: isPressing 
              ? "0 0 80px rgba(167,139,250,0.4), inset 0 0 40px rgba(167,139,250,0.4)" 
              : "0 0 50px rgba(139,92,246,0.15), inset 0 0 0px rgba(167,139,250,0)"
          }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Dynamic background pulse when pressing */}
          {isPressing && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-t from-violet-600/30 to-pink-500/30"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          )}
          
          <div className="flex flex-col items-center gap-3 text-center pointer-events-none z-10">
            {/* Brain Icon Container */}
            <div className="relative">
              <Brain 
                className={`w-12 h-12 transition-all duration-700 ${isPressing ? 'text-pink-300 scale-110 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]' : 'text-indigo-300'}`} 
                strokeWidth={1.5}
              />
              {/* Computer connection dots appearing on press */}
              {isPressing && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="absolute -top-1 -right-2 text-violet-300"
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0.2, repeatType: "reverse" }}
                    className="absolute bottom-0 -left-2 text-pink-300"
                  >
                    <Cpu className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </div>

            {/* Text labels */}
            <div className="flex flex-col items-center h-10 justify-start">
              <motion.div
                className="text-white/90 text-sm font-medium tracking-wide"
                animate={{ opacity: isPressing ? 1 : 0.7 }}
              >
                {loadingText}
              </motion.div>
              {isPressing && (
                <motion.div
                  className="text-white/40 text-[10px] mt-1 uppercase tracking-widest flex items-center gap-1"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  Establishing Link
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}