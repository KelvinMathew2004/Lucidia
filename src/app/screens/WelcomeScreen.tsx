import {
  Moon, Brain, Headphones, Wind, Sparkles, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

type SlideData = {
  id: string;
  iconName: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  orbColor: string;
};

const SLIDE_DATA: SlideData[] = [
  {
    id: "welcome",
    iconName: "Moon",
    iconColor: "text-indigo-300",
    title: "Welcome to\nDreamSync",
    subtitle: "Your Sleep Companion",
    description: "Track your sleep, decode your dreams, and wake up feeling your best — every single morning.",
    gradient: "from-indigo-600/30 via-purple-600/20 to-transparent",
    orbColor: "#818cf8",
  },
  {
    id: "synthesis",
    iconName: "Brain",
    iconColor: "text-purple-300",
    title: "Sleep Synthesis",
    subtitle: "AI-Powered Insights",
    description: "Our AI analyzes your sleep patterns, cycles, and heart rate to give you personalized insights and a daily sleep score.",
    gradient: "from-purple-600/30 via-pink-600/20 to-transparent",
    orbColor: "#c084fc",
  },
  {
    id: "dreams",
    iconName: "Sparkles",
    iconColor: "text-amber-300",
    title: "Dream Bank",
    subtitle: "Emotion-Orb Calendar",
    description: "Your dreams visualized as glowing orbs on a calendar. Tap any night to explore AI-decoded dream themes and patterns.",
    gradient: "from-amber-600/20 via-orange-600/15 to-transparent",
    orbColor: "#fbbf24",
  },
  {
    id: "sounds",
    iconName: "Headphones",
    iconColor: "text-cyan-300",
    title: "Soundscapes",
    subtitle: "Fall Asleep Faster",
    description: "Choose from rain, nature, binaural beats, and ambient sounds. Set a sleep timer and let the music fade as you drift off.",
    gradient: "from-cyan-600/20 via-blue-600/15 to-transparent",
    orbColor: "#22d3ee",
  },
  {
    id: "breathe",
    iconName: "Wind",
    iconColor: "text-emerald-300",
    title: "Breathe & Unwind",
    subtitle: "Guided Routines",
    description: "Guided breathing exercises and a bedtime checklist to prepare your body and mind for deep, restorative sleep.",
    gradient: "from-emerald-600/20 via-teal-600/15 to-transparent",
    orbColor: "#34d399",
  },
];

function SlideIcon({ name, colorClass }: { name: string; colorClass: string }) {
  const icons: Record<string, React.ComponentType<any>> = {
    Moon, Brain, Headphones, Wind, Sparkles,
  };
  const Icon = icons[name] || Moon;
  return <Icon className={`w-10 h-10 ${colorClass}`} strokeWidth={1.5} />;
}

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const slide = SLIDE_DATA[currentSlide];
  const isLast = currentSlide === SLIDE_DATA.length - 1;
  const isFirst = currentSlide === 0;

  const goNext = () => {
    if (isLast) {
      localStorage.setItem("dreamSync_onboarded", "true");
      navigate("/check-in");
    } else {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (!isFirst) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const skip = () => {
    localStorage.setItem("dreamSync_onboarded", "true");
    navigate("/check-in");
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#110d1f] text-slate-50">
      {/* Animated background gradient */}
      <motion.div
        key={slide.id + "-bg"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} -z-0 pointer-events-none`}
      />

      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[-20%] w-80 h-80 rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: slide.orbColor }}
        />
        <motion.div
          animate={{
            x: [0, -20, 30, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[-15%] w-60 h-60 rounded-full blur-[80px] opacity-15"
          style={{ backgroundColor: slide.orbColor }}
        />
      </div>

      {/* Skip button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-14 right-5 z-20"
      >
        {!isLast && (
          <button
            onClick={skip}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.15em] font-medium px-3 py-1.5 rounded-full hover:bg-white/5"
          >
            Skip
          </button>
        )}
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 pt-20 pb-8 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: (d || 1) * 80, scale: 0.95 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: (d || 1) * -80, scale: 0.95 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon orb */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", bounce: 0.4 }}
              className="relative mb-10"
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${slide.orbColor}30` }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${slide.orbColor}20` }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />

              <div
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${slide.orbColor}40, ${slide.orbColor}15, transparent)`,
                  boxShadow: `0 0 50px ${slide.orbColor}25, inset 0 0 30px ${slide.orbColor}10`,
                }}
              >
                {/* Glass highlight */}
                <div className="absolute top-1.5 left-3 w-8 h-4 bg-white/15 rounded-full blur-sm rotate-[-30deg]" />
                <SlideIcon name={slide.iconName} colorClass={slide.iconColor} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white whitespace-pre-line mb-3"
              style={{ lineHeight: 1.15 }}
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6"
              style={{
                backgroundColor: `${slide.orbColor}15`,
                border: `1px solid ${slide.orbColor}25`,
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: slide.orbColor }}
              >
                {slide.subtitle}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-sm text-slate-400 max-w-[280px] leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="px-8 pb-12 pt-4 relative z-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {SLIDE_DATA.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className="relative"
              animate={{
                width: i === currentSlide ? 32 : 8,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ height: 8 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  backgroundColor:
                    i === currentSlide ? slide.orbColor : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: i === currentSlide ? `0 0 10px ${slide.orbColor}40` : "none",
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {!isFirst && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="flex-1 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
            style={{
              background: `linear-gradient(135deg, ${slide.orbColor}, ${slide.orbColor}cc)`,
              boxShadow: `0 8px 25px ${slide.orbColor}30`,
            }}
          >
            {isLast ? (
              <span>Get Started</span>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}