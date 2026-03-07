import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Sun, ChevronLeft, ChevronDown, Clock, X, Moon, Star, CalendarDays, Sparkles, Activity, FileText, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../components/shared/ThemeContext";
import AIPersonalizedSummaryModal from "../components/sleep/AIPersonalizedSummaryModal";
import MiniPlayer from "../components/shared/MiniPlayer";

// --- DATA GENERATION ---
type DayData = {
  isEmpty: false;
  id: string;
  date: Date;
  score: number;
  bgClass: string;
  glowColor: string;
  category: string;
  aiData: {
    summary: string;
    metrics: string;
    suggestion: string;
    icon: any;
    coherence: number;
    anxiety: number;
    lucidity: number;
    people: string[];
    symbols: string[];
    emotions: string[];
    relationshipAdvice: string;
    dailyContext: string;
  };
  deepSleep: string;
  remSleep: string;
  animationDuration: number;
  animationDelay: number;
  meshGradient: string;
};

type EmptySlot = {
  isEmpty: true;
  id: string;
};

type CalendarSlot = DayData | EmptySlot;

type MonthData = {
  id: string;
  year: number;
  month: number;
  name: string;
  slots: CalendarSlot[];
};

const EMOTION_COLORS: Record<string, string> = {
  "Driven": "#34d399",
  "Curious": "#60a5fa",
  "Optimistic": "#fbbf24",
  "Euphoria": "#fde047",
  "Contentment": "#a7f3d0",
  "Freedom": "#7dd3fc",
  "Overwhelmed": "#f87171",
  "Determined": "#fb923c",
  "Confused": "#9ca3af",
  "Fear": "#ef4444",
  "Vulnerability": "#fda4af",
  "Exhaustion": "#94a3b8",
  "Intimacy": "#f472b6",
  "Desire": "#f43f5e",
  "Safety": "#6ee7b7",
  "Peace": "#bae6fd",
  "Acceptance": "#a7f3d0",
  "Stillness": "#e2e8f0",
  "Awe": "#818cf8",
  "Wonder": "#c084fc",
  "Relief": "#34d399",
  "Comfort": "#93c5fd",
  "Nurtured": "#6ee7b7",
  "Nostalgia": "#d8b4fe",
  "Melancholy": "#94a3b8",
  "Resolution": "#fcd34d",
  "Excitement": "#fbbf24",
  "Social Anxiety": "#fca5a5",
  "Belonging": "#fcd34d"
};

const getMeshGradient = (emotions: string[] = []) => {
  const c1 = EMOTION_COLORS[emotions[0]] || "#60a5fa";
  const c2 = EMOTION_COLORS[emotions[1]] || "#c084fc";
  const c3 = EMOTION_COLORS[emotions[2]] || "#34d399";
  
  return `radial-gradient(at 0% 0%, ${c1} 0px, transparent 60%),
          radial-gradient(at 100% 0%, ${c2} 0px, transparent 60%),
          radial-gradient(at 50% 100%, ${c3} 0px, transparent 60%),
          linear-gradient(135deg, ${c1} 0%, ${c3} 100%)`;
};

const DREAM_CATEGORIES = [
  { 
    category: "Passion & Aspirations",
    bgClass: "from-emerald-300 to-emerald-500", 
    glowColor: "rgba(52, 211, 153, 0.4)",
    aiData: {
      summary: "Strong focus on personal growth. Active subconscious problem-solving regarding your career or projects.",
      metrics: "Highly elevated frontal lobe activity during REM sleep.",
      suggestion: "Write down your immediate thoughts upon waking—your mind is actively working on solutions.",
      icon: Lightbulb,
      coherence: 85,
      anxiety: 30,
      lucidity: 60,
      people: ["Colleagues", "Mentors"],
      symbols: ["Stairs", "Open Doors", "Bright Lights"],
      emotions: ["Driven", "Curious", "Optimistic"],
      relationshipAdvice: "Your ambition is high, but ensure you aren't leaving your partner behind. Share your goals with them today to build mutual excitement.",
      dailyContext: "You spent 4 hours deeply focused on a new project and had an intense brainstorming session with colleagues."
    }
  },
  { 
    category: "Joy & Happiness",
    bgClass: "from-yellow-300 to-yellow-500", 
    glowColor: "rgba(253, 224, 71, 0.4)",
    aiData: {
      summary: "A highly positive sleep state. Vibrant, uplifting dreamscapes centered around fulfilling experiences.",
      metrics: "Serotonin-indicative wave patterns were dominant throughout the night.",
      suggestion: "Carry this positive momentum into your day. Excellent time for creative or social tasks.",
      icon: Sparkles,
      coherence: 90,
      anxiety: 10,
      lucidity: 45,
      people: ["Childhood Friends", "Family"],
      symbols: ["Sunlight", "Flying", "Music"],
      emotions: ["Euphoria", "Contentment", "Freedom"],
      relationshipAdvice: "Your emotional reserves are full. Plan a spontaneous date or write an appreciative note to someone you love to transfer this joy.",
      dailyContext: "You laughed genuinely during a lunch break and listened to your favorite upbeat playlist on the commute."
    }
  },
  { 
    category: "Processing & Adaptation",
    bgClass: "from-orange-400 to-orange-600", 
    glowColor: "rgba(249, 115, 22, 0.4)",
    aiData: {
      summary: "Your mind is actively digesting recent life changes and organizing chaos into structure.",
      metrics: "Frequent sleep spindle activity indicates you are consolidating new skills.",
      suggestion: "Pace yourself today. Your brain worked hard overnight to process new environments.",
      icon: Activity,
      coherence: 50,
      anxiety: 60,
      lucidity: 20,
      people: ["Strangers", "Authority Figures"],
      symbols: ["Mazes", "Clocks", "Suitcases"],
      emotions: ["Overwhelmed", "Determined", "Confused"],
      relationshipAdvice: "You might feel easily irritated due to subconscious processing. Communicate to your loved ones that you need a little patience today.",
      dailyContext: "BCI indicated scattered focus across multiple novel tasks and higher than average visual cortex stimulation."
    }
  },
  { 
    category: "Health & Physiology Alert",
    bgClass: "from-red-500 to-red-700", 
    glowColor: "rgba(239, 68, 68, 0.5)",
    aiData: {
      summary: "Sleep is communicating distress. Biometric data strongly indicates a physiological or mental disruption.",
      metrics: "Elevated resting heart rate, fragmented REM, and micro-awakenings detected.",
      suggestion: "Prioritize physical recovery today. Practice somatic grounding, check bedroom air quality, and monitor fatigue.",
      icon: AlertTriangle,
      coherence: 35,
      anxiety: 85,
      lucidity: 15,
      people: ["Shadows", "Medical Staff"],
      symbols: ["Falling", "Teeth Falling Out", "Alarms"],
      emotions: ["Fear", "Vulnerability", "Exhaustion"],
      relationshipAdvice: "Your body is physically stressed. Don't engage in difficult relationship conversations today; lean on your partner for comfort instead.",
      dailyContext: "BCI sensors recorded an elevated stress response during a 2pm meeting and inconsistent breathing patterns in the evening."
    }
  },
  { 
    category: "Romance & Connection",
    bgClass: "from-pink-300 to-pink-500", 
    glowColor: "rgba(244, 114, 182, 0.4)",
    aiData: {
      summary: "Elevated emotional resonance. Dreams involved interpersonal connections and deep bonding.",
      metrics: "Deep, restorative REM phases coupled with oxytocin-linked slow waves.",
      suggestion: "Reach out to a loved one today. Your subconscious is seeking emotional connection.",
      icon: CheckCircle2,
      coherence: 75,
      anxiety: 20,
      lucidity: 50,
      people: ["Partner", "Crush", "Faceless Guide"],
      symbols: ["Water", "Rings", "Warm Fires"],
      emotions: ["Intimacy", "Desire", "Safety"],
      relationshipAdvice: "Your subconscious is primed for intimacy. Tonight is the perfect time for a deep, honest conversation with your romantic partner.",
      dailyContext: "You had a relaxing dinner, with oxytocin and serotonin levels peaking around 7pm during shared laughter."
    }
  },
  { 
    category: "Calm & Clarity",
    bgClass: "from-cyan-300 to-cyan-500", 
    glowColor: "rgba(34, 211, 238, 0.4)",
    aiData: {
      summary: "Deeply grounded subconscious state. Dream content reflects mental peace and emotional balance.",
      metrics: "Remarkably stable sleep architecture completely free of immediate anxieties.",
      suggestion: "Capitalize on this mental clarity. Ideal day for deep-focus work or strategic planning.",
      icon: Sparkles,
      coherence: 95,
      anxiety: 5,
      lucidity: 70,
      people: ["Self", "Wise Elders"],
      symbols: ["Clear Skies", "Mirrors", "Empty Rooms"],
      emotions: ["Peace", "Acceptance", "Stillness"],
      relationshipAdvice: "You are in a highly rational state. If you've been putting off resolving a minor conflict, you have the clarity to address it calmly today.",
      dailyContext: "BCI showed prolonged periods of alpha wave dominance, indicating a highly relaxed waking state."
    }
  },
  { 
    category: "Mystery & Abstract",
    bgClass: "from-purple-400 to-purple-600", 
    glowColor: "rgba(168, 85, 247, 0.4)",
    aiData: {
      summary: "Deep processing of unassociated daytime stimuli resulting in surreal, non-linear narratives.",
      metrics: "Highly complex, rapid neural firing patterns observed in the visual cortex.",
      suggestion: "Engage in an unstructured creative activity today, like drawing or free-writing.",
      icon: Sparkles,
      coherence: 20,
      anxiety: 40,
      lucidity: 80,
      people: ["Abstract Entities", "Talking Animals"],
      symbols: ["Geometric Shapes", "Floating Objects", "Colors"],
      emotions: ["Awe", "Confusion", "Wonder"],
      relationshipAdvice: "Your mind is embracing the unconventional. Break your normal routine with your partner tonight to spark new connections.",
      dailyContext: "You consumed highly abstract media (movie/book) before sleep, with elevated dopamine responses."
    }
  },
  { 
    category: "Healing & Recovery",
    bgClass: "from-blue-400 to-emerald-400", 
    glowColor: "rgba(52, 211, 153, 0.4)",
    aiData: {
      summary: "Profound state of physical and mental restoration. Active tissue repair and immune strengthening.",
      metrics: "Delta-wave (slow-wave) sleep was heavily dominant over lighter phases.",
      suggestion: "Your body is recovering well. Maintain a nutritious diet today to support continued healing.",
      icon: Activity,
      coherence: 60,
      anxiety: 15,
      lucidity: 10,
      people: ["Healers", "Childhood Pets"],
      symbols: ["Gardens", "Forests", "Soft Beds"],
      emotions: ["Relief", "Comfort", "Nurtured"],
      relationshipAdvice: "Offer the same grace to your relationships that your body is giving you. Forgive a small transgression and move forward.",
      dailyContext: "Physical exertion was high during your workout, but HRV indicates optimal post-exercise recovery."
    }
  },
  { 
    category: "Deep Subconscious & Identity",
    bgClass: "from-purple-400 to-pink-500", 
    glowColor: "rgba(192, 132, 252, 0.4)",
    aiData: {
      summary: "Navigating core identity, past memories, and emotional resolution. Deep introspection.",
      metrics: "Significant activity in the brain's default mode network detected.",
      suggestion: "Take 10 minutes to meditate or journal. Avoid overwhelming social situations today.",
      icon: CheckCircle2,
      coherence: 80,
      anxiety: 45,
      lucidity: 30,
      people: ["Past Selves", "Parents"],
      symbols: ["Old Houses", "Photographs", "Keys"],
      emotions: ["Nostalgia", "Melancholy", "Resolution"],
      relationshipAdvice: "You may be projecting past relationship patterns onto your current situation. Take a step back and separate the past from the present.",
      dailyContext: "You spent significant time reminiscing, with BCI indicating emotional volatility during a specific conversation."
    }
  },
  { 
    category: "Social & Extroversion",
    bgClass: "from-yellow-300 to-orange-500", 
    glowColor: "rgba(251, 191, 36, 0.4)",
    aiData: {
      summary: "Highly social dreamscape. Filled with crowds, conversations, and complex dynamics.",
      metrics: "Regions associated with facial recognition and language processing were highly active.",
      suggestion: "You are primed for collaboration. Schedule meetings or social gatherings for today.",
      icon: Lightbulb,
      coherence: 70,
      anxiety: 35,
      lucidity: 25,
      people: ["Crowds", "Old Classmates", "Celebrities"],
      symbols: ["Parties", "Stages", "Microphones"],
      emotions: ["Excitement", "Social Anxiety", "Belonging"],
      relationshipAdvice: "Your social energy is high. Use this to introduce your partner to friends or engage in a group activity together to bond differently.",
      dailyContext: "You engaged in multiple highly stimulating social interactions, resulting in sustained beta wave activity throughout the afternoon."
    }
  }
];

const generateCalendarData = (): MonthData[] => {
  const data: MonthData[] = [];
  const start = new Date(2025, 0, 1);
  const end = new Date(2026, 2, 7); // Up to current
  let curr = new Date(start);

  while (curr <= end) {
    const y = curr.getFullYear();
    const m = curr.getMonth();
    
    let monthObj = data.find(d => d.year === y && d.month === m);
    if (!monthObj) {
      monthObj = { 
        id: `month-${y}-${m}`,
        year: y, 
        month: m, 
        name: curr.toLocaleString('default', { month: 'long' }), 
        slots: [] 
      };
      
      const firstDay = new Date(y, m, 1).getDay();
      for(let i = 0; i < firstDay; i++) {
        monthObj.slots.push({ isEmpty: true, id: `empty-${y}-${m}-${i}` });
      }
      data.push(monthObj);
    }

    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    
    const isToday = curr.getTime() === end.getTime();
    const styleDef = isToday 
      ? DREAM_CATEGORIES.find(c => c.category === "Mystery & Abstract")!
      : DREAM_CATEGORIES[Math.floor(Math.random() * DREAM_CATEGORIES.length)];

    monthObj.slots.push({
      isEmpty: false,
      id: curr.toISOString(),
      date: new Date(curr),
      score: isToday ? 95 : score,
      bgClass: styleDef.bgClass,
      glowColor: styleDef.glowColor,
      category: styleDef.category,
      aiData: styleDef.aiData,
      deepSleep: `${Math.floor(score * 0.02)}h ${Math.floor(Math.random() * 45)}m`,
      remSleep: `${Math.floor(score * 0.015)}h ${Math.floor(Math.random() * 45)}m`,
      animationDuration: 3 + Math.random() * 2,
      animationDelay: Math.random() * 2,
      meshGradient: getMeshGradient(styleDef.aiData.emotions)
    });

    curr.setDate(curr.getDate() + 1);
  }
  return data;
};

const calendarData = generateCalendarData().reverse();

export default function DreamBankScreen() {
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const [animationStage, setAnimationStage] = useState(0);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [bciExpanded, setBciExpanded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationStage(1), 800);
    return () => clearTimeout(t1);
  }, []);

  const handleCloseModal = () => {
    setSelectedDay(null);
    setTimeout(() => {
      setIsExpanded(false);
      setBciExpanded(false);
    }, 300); // Wait for exit animation
  };

  const renderMonthGrid = (month: MonthData) => {
    const weeks = [];
    for (let i = 0; i < month.slots.length; i += 7) {
      weeks.push(month.slots.slice(i, i + 7));
    }

    return (
      <div key={month.id} id={month.id} className="mb-12 w-full px-2">
        <div className="relative flex items-center gap-3 py-2 bg-transparent px-2 mb-4">
          <CalendarDays className="w-5 h-5 text-indigo-400" />
          <h2 className={`text-sm font-bold tracking-[0.15em] uppercase ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {month.name} {month.year}
          </h2>
        </div>

        <div className="grid grid-cols-7 w-full gap-2 px-1 mb-4 z-10 relative">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={`dow-${i}`} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="relative flex items-center justify-between px-1">
              <div className={`absolute top-1/2 left-0 w-full h-1 ${isDark ? 'bg-gradient-to-b from-zinc-800 to-zinc-950 border-white/5' : 'bg-gradient-to-b from-slate-200 to-slate-100 border-slate-300'} rounded-full border-t -translate-y-1/2 z-0 opacity-50`} />
              <div className="grid grid-cols-7 w-full gap-2 z-10 relative">
                {week.map((slot) => {
                  if (slot.isEmpty) {
                    return <div key={slot.id} className="w-9 h-9 sm:w-11 sm:h-11 mx-auto flex-shrink-0" />;
                  }

                  const isLatest = slot === calendarData[0].slots[calendarData[0].slots.length - 1];

                  return (
                    <div key={slot.id} className="relative flex justify-center items-center flex-shrink-0">
                      <motion.button
                        onClick={() => setSelectedDay(slot)}
                        whileHover={{ scale: 1.15, zIndex: 50 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ y: 0 }}
                        animate={{ y: [0, -1, 0] }}
                        transition={{ 
                          duration: slot.animationDuration, 
                          repeat: Infinity, 
                          delay: slot.animationDelay,
                          ease: "easeInOut"
                        }}
                        className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 ease-out
                          ${isLatest && animationStage === 0 ? 'opacity-0' : ''}
                        `}
                        style={{
                          background: slot.meshGradient,
                          boxShadow: `0 0 8px 1px ${slot.glowColor}, inset -1px -1px 3px rgba(0,0,0,0.1), inset 1px 1px 3px rgba(255,255,255,0.15)`
                        }}
                      >
                        <span className="relative z-10 text-white font-medium text-[11px] sm:text-xs"
                          style={{
                            textShadow: isDark 
                              ? '0 1px 3px rgba(0,0,0,0.8), 0 0px 6px rgba(0,0,0,0.5)' 
                              : '0 1px 2px rgba(0,0,0,0.5), 0 0px 4px rgba(0,0,0,0.3)'
                          }}
                        >
                          {slot.date.getDate()}
                        </span>
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-full flex flex-col overflow-hidden font-sans z-10 transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <header className={`flex items-center justify-between z-40 px-5 pt-12 pb-4 backdrop-blur-xl border-b absolute top-0 w-full transition-colors duration-500 ${isDark ? 'bg-[#110d1f]/90 border-white/5' : 'bg-[#F4F2FA]/90 border-slate-200'}`}>
        <button
          onClick={() => navigate("/sleep")}
          className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <span className={`text-sm font-medium tracking-[0.2em] uppercase absolute left-1/2 -translate-x-1/2 ${isDark ? 'text-indigo-200' : 'text-indigo-600'}`}>
          Dream Bank
        </span>
        <div className="flex items-center gap-1 -mr-2">
          <button
            onClick={toggleDark}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-slate-200 active:bg-slate-300 text-indigo-600 bg-indigo-100/50 border border-indigo-200'}`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 fill-amber-300/20" strokeWidth={2} />
            ) : (
              <Moon className="w-5 h-5 fill-indigo-600/20" strokeWidth={2.5} />
            )}
          </button>
          <button
            onClick={() => setIsAISummaryOpen(true)}
            className={`p-2 rounded-full transition-colors relative group ${isDark ? 'hover:bg-indigo-500/20 text-indigo-300' : 'hover:bg-indigo-100 text-indigo-600'}`}
          >
            <Sparkles className="w-6 h-6" strokeWidth={2} />
            <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/20'}`} />
          </button>
        </div>
      </header>

      <div 
        className="flex-1 relative overflow-y-auto overflow-x-hidden hide-scroll px-3 pb-24 pt-24"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)"
        }}
      >
        <AnimatePresence>
          {animationStage === 0 && (
            <motion.div
              initial={{ left: "50%", top: "80%", x: "-50%", y: "-50%", scale: 1.5, opacity: 1 }}
              animate={{ 
                left: ["50%", "30%", "70%", "85%"], 
                top: ["80%", "50%", "30%", "15%"], 
                x: "-50%", y: "-50%",
                scale: [1.5, 1.2, 1, 1],
                opacity: [1, 1, 1, 0] 
              }}
              transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }}
              className="fixed z-[100] w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-[0_0_16px_2px_rgba(168,85,247,0.5),inset_-1px_-1px_3px_rgba(0,0,0,0.1),inset_1px_1px_3px_rgba(255,255,255,0.15)] pointer-events-none flex items-center justify-center"
              style={{
                background: (calendarData[0].slots.filter(s => !s.isEmpty).pop() as DayData)?.meshGradient || 'radial-gradient(circle, #a855f7, #c084fc)'
              }}
            >
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-md mx-auto relative z-10 pb-12">
          {calendarData.map((month) => renderMonthGrid(month))}
        </div>
      </div>

      {/* Selected Day Overlay Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${isDark ? 'bg-zinc-950/80' : 'bg-slate-900/40'}`}
            onClick={handleCloseModal}
          >
            <motion.div
              layout
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className={`relative w-full max-w-sm backdrop-blur-2xl border rounded-[32px] p-6 shadow-2xl overflow-hidden flex flex-col ${isExpanded ? 'h-[85vh]' : 'h-auto'} ${isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/95 border-slate-200'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Ambient Glow */}
              <div 
                className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isDark ? 'opacity-15' : 'opacity-30'}`} 
                style={{ background: selectedDay.meshGradient }}
              />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6 shrink-0 z-10">
                <div>
                  <h3 className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h3>
                  <p className={`text-2xl font-bold mt-1 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedDay.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Orb & Score Section */}
              <motion.div layout className="flex items-center gap-6 mb-6 shrink-0 z-10">
                <motion.div 
                  layout
                  className={`w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden shrink-0`}
                  style={{
                    background: selectedDay.meshGradient,
                    boxShadow: `0 0 24px ${selectedDay.glowColor}, inset -2px -2px 6px rgba(0,0,0,0.1), inset 2px 2px 6px rgba(255,255,255,0.15)`
                  }}
                >
                  <Moon className="w-8 h-8 text-white/90 drop-shadow-sm z-10" />
                </motion.div>
                
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sleep Score</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedDay.score}</span>
                    <span className={`text-lg font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/100</span>
                  </div>
                </div>
              </motion.div>

              {/* Category Badge */}
              <motion.div layout className="mb-6 shrink-0 z-10">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${selectedDay.bgClass} bg-opacity-20 border border-white/10`}>
                  {selectedDay.category.includes("Alert") ? (
                    <Activity className="w-4 h-4 text-white drop-shadow-md" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                  <span className="text-xs font-bold text-white drop-shadow-md uppercase tracking-wide">
                    {selectedDay.category}
                  </span>
                </div>
              </motion.div>

              {/* Scrollable Expanded Content */}
              <AnimatePresence mode="popLayout">
                {isExpanded ? (
                  <motion.div
                    key="expanded-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex-1 overflow-y-auto hide-scroll flex flex-col gap-3 pb-4 z-10"
                  >
                    
                    {/* Section 1: Executive Summary */}
                    <div className={`rounded-2xl p-4 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Synthesis</h4>
                      </div>
                      <p className={`text-sm font-medium leading-relaxed mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {selectedDay.aiData?.summary || (selectedDay as any).aiOverview || "Data loading..."}
                      </p>
                      
                      <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                        {selectedDay.aiData?.emotions?.map((emotion: string) => (
                          <span key={emotion} className={`text-[10px] px-2 py-1 rounded-md border ${isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-white text-slate-600 border-slate-200'}`}>
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Extracted Elements */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className={`rounded-2xl p-4 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>People</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedDay.aiData?.people?.map((person: string, i: number, arr: string[]) => (
                            <span key={person} className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              {person}{i < arr.length - 1 && <span className={isDark ? "text-slate-600" : "text-slate-300"}>, </span>}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`rounded-2xl p-4 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Symbols</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedDay.aiData?.symbols?.map((symbol: string, i: number, arr: string[]) => (
                            <span key={symbol} className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              {symbol}{i < arr.length - 1 && <span className={isDark ? "text-slate-600" : "text-slate-300"}>, </span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className={`rounded-2xl p-3 border flex flex-col items-center justify-center text-center ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Coherence</div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedDay.aiData?.coherence}%</div>
                      </div>
                      <div className={`rounded-2xl p-3 border flex flex-col items-center justify-center text-center ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Lucidity</div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedDay.aiData?.lucidity}%</div>
                      </div>
                      <div className={`rounded-2xl p-3 border flex flex-col items-center justify-center text-center ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Anxiety</div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedDay.aiData?.anxiety}%</div>
                      </div>
                    </div>

                    {/* Section 2: Biometrics & Metrics */}
                    <div className={`rounded-2xl p-4 border mt-1 ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Biometrics</h4>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {selectedDay.aiData?.metrics || "Analyzing biometrics..."}
                      </p>
                    </div>

                    {/* Section 3: Actionable AI Suggestion */}
                    <div className={`rounded-2xl p-4 border mt-1 relative overflow-hidden bg-gradient-to-br ${selectedDay.bgClass} ${isDark ? 'bg-opacity-15 border-white/20' : 'bg-opacity-20 border-slate-300 shadow-sm'}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${selectedDay.bgClass} opacity-10`} />
                      <div className="relative z-10 flex items-center gap-2 mb-2">
                        {/* Dynamic Icon based on category intent */}
                        {selectedDay.aiData?.icon ? <selectedDay.aiData.icon className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-800'}`} /> : <Sparkles className={`w-4 h-4 ${isDark ? 'text-white' : 'text-slate-800'}`} />}
                        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>Personal & Relational Advice</h4>
                      </div>
                      <p className={`relative z-10 text-sm leading-relaxed font-medium ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                        {selectedDay.aiData?.relationshipAdvice || "Preparing personalized action plan..."}
                      </p>
                    </div>

                    {/* Section 4: Daily BCI Context */}
                    <div className={`rounded-2xl border mt-1 overflow-hidden ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                      <button 
                        onClick={() => setBciExpanded(!bciExpanded)}
                        className="w-full flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Daily BCI Context</h4>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${bciExpanded ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      </button>
                      
                      <AnimatePresence>
                        {bciExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                          >
                            <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {selectedDay.aiData?.dailyContext || "BCI signals matched with mild stress markers during your evening commute and an elevated dopamine response during dinner."}
                            </p>

                            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/20 before:to-transparent">
                              {/* Timeline Items */}
                              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-indigo-100 border-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isDark ? 'bg-zinc-800 border-indigo-500' : ''}`}>
                                  <Clock className={`w-3 h-3 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                </div>
                                <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border shadow-sm ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'}`}>
                                  <div className={`flex items-center justify-between space-x-2 mb-1`}>
                                    <div className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Deep Focus</div>
                                    <time className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>09:30 AM</time>
                                  </div>
                                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sustained beta wave activity indicating high concentration.</div>
                                </div>
                              </div>
                              
                              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-pink-100 border-pink-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isDark ? 'bg-zinc-800 border-pink-500' : ''}`}>
                                  <Activity className={`w-3 h-3 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                                </div>
                                <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border shadow-sm ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'}`}>
                                  <div className={`flex items-center justify-between space-x-2 mb-1`}>
                                    <div className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Stress Peak</div>
                                    <time className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>02:15 PM</time>
                                  </div>
                                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cortisol markers and elevated heart rate during a meeting.</div>
                                </div>
                              </div>

                              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-emerald-100 border-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isDark ? 'bg-zinc-800 border-emerald-500' : ''}`}>
                                  <Sparkles className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </div>
                                <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border shadow-sm ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'}`}>
                                  <div className={`flex items-center justify-between space-x-2 mb-1`}>
                                    <div className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Dopamine Release</div>
                                    <time className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>07:45 PM</time>
                                  </div>
                                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Relaxed alpha waves and dopamine spikes during social interaction.</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sleep Phases Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className={`rounded-2xl p-4 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Star className="w-3.5 h-3.5" /> Deep Sleep
                        </div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {selectedDay.deepSleep}
                        </div>
                      </div>
                      <div className={`rounded-2xl p-4 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Moon className="w-3.5 h-3.5" /> REM Phase
                        </div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {selectedDay.remSleep}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="expand-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsExpanded(true)}
                    className={`w-full py-4 rounded-2xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 z-10 ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/5 text-white' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white shadow-md'}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Dream Details
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIPersonalizedSummaryModal 
        isOpen={isAISummaryOpen} 
        onClose={() => setIsAISummaryOpen(false)} 
      />
      <MiniPlayer />
    </div>
  );
}