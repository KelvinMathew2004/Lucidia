import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, Sun, Moon, Check, Plus, X, Smartphone, Thermometer,
  BookOpen, Wind, Music, Droplets, Sparkles, Shield, GripVertical
} from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";
import MiniPlayer from "../components/shared/MiniPlayer";
import { useAudioPlayer } from "../components/shared/AudioPlayerContext";

type RoutineItem = {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  completed: boolean;
  isCustom?: boolean;
};

const DEFAULT_ITEMS: Omit<RoutineItem, 'completed'>[] = [
  { id: "screens", title: "Digital Detox", subtitle: "Put devices away 30 min before bed", iconName: "Smartphone", color: "#6366f1" },
  { id: "temp", title: "Temperature Check", subtitle: "Set room to 65-68°F (18-20°C)", iconName: "Thermometer", color: "#06b6d4" },
  { id: "read", title: "Read or Journal", subtitle: "15 minutes of calm reading", iconName: "BookOpen", color: "#f59e0b" },
  { id: "breathing", title: "Breathing Exercise", subtitle: "4-7-8 or Box Breathing", iconName: "Wind", color: "#10b981" },
  { id: "sounds", title: "Start Soundscape", subtitle: "Play calming sounds with sleep timer", iconName: "Music", color: "#8b5cf6" },
  { id: "skincare", title: "Skincare & Hygiene", subtitle: "Brush teeth, wash face", iconName: "Droplets", color: "#ec4899" },
  { id: "lights", title: "Dim Lights", subtitle: "Switch to warm, low lighting", iconName: "Sun", color: "#f97316" },
  { id: "gratitude", title: "Gratitude Moment", subtitle: "Name 3 things you're grateful for", iconName: "Sparkles", color: "#a78bfa" },
];

function getIcon(name: string) {
  const icons: Record<string, React.ComponentType<any>> = {
    Smartphone, Thermometer, BookOpen, Wind, Music, Droplets, Sun, Sparkles, Shield,
  };
  const Icon = icons[name] || Shield;
  return <Icon className="w-5 h-5" />;
}

export default function RoutineScreen() {
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const { currentTrack } = useAudioPlayer();
  const [items, setItems] = useState<RoutineItem[]>(
    DEFAULT_ITEMS.map(item => ({ ...item, completed: false }))
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [allCompleted, setAllCompleted] = useState(false);

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? completedCount / items.length : 0;

  const toggleItem = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);

    // Check if all completed
    const allDone = updated.every(i => i.completed);
    if (allDone && !allCompleted) {
      setAllCompleted(true);
    }
  };

  const addCustomItem = () => {
    if (!newItemTitle.trim()) return;
    const newItem: RoutineItem = {
      id: `custom-${Date.now()}`,
      title: newItemTitle.trim(),
      subtitle: "Custom step",
      iconName: "Shield",
      color: "#64748b",
      completed: false,
      isCustom: true,
    };
    setItems([...items, newItem]);
    setNewItemTitle("");
    setShowAdd(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemAction = (id: string) => {
    if (id === "breathing") navigate("/breathing");
    else if (id === "sounds") navigate("/sounds");
    else toggleItem(id);
  };

  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <style dangerouslySetInnerHTML={{ __html: `.hide-scroll::-webkit-scrollbar{display:none}.hide-scroll{-ms-overflow-style:none;scrollbar-width:none}` }} />

      <div className={`absolute inset-0 -z-10 ${isDark ? 'bg-[#110d1f]' : 'bg-[#F4F2FA]'}`} />

      {/* Header */}
      <div className={`px-5 pt-12 pb-2 sticky top-0 backdrop-blur-xl z-30 ${isDark ? 'bg-[#110d1f]/60' : 'bg-[#F4F2FA]/60'}`}>
        <header className="flex items-center justify-between py-2 relative">
          <button onClick={() => navigate(-1)} className={`p-2 -ml-2 rounded-full ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className={`text-base font-semibold tracking-wide absolute left-1/2 -translate-x-1/2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Bedtime Routine
          </span>
          <button onClick={toggleDark} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-slate-200 text-indigo-600 bg-indigo-100/50 border border-indigo-200'}`}>
            {isDark ? <Sun className="w-5 h-5 fill-amber-300/20" /> : <Moon className="w-5 h-5 fill-indigo-600/20" />}
          </button>
        </header>

        {/* Progress Ring */}
        <div className="flex items-center gap-4 mt-4 mb-2">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="97.4"
                initial={{ strokeDashoffset: 97.4 }}
                animate={{ strokeDashoffset: 97.4 * (1 - progress) }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {completedCount}/{items.length}
              </span>
            </div>
          </div>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {allCompleted ? "All Done!" : "Wind Down Checklist"}
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {allCompleted ? "Sweet dreams tonight" : "Complete your routine before bed"}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className={`flex-1 px-5 pt-4 overflow-y-auto hide-scroll ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        {/* Completion Celebration */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`rounded-2xl p-6 mb-6 text-center border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-4xl mb-3"
              >
                🌙
              </motion.div>
              <p className={`text-sm font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                Routine complete! Your body is ready for deep, restorative sleep.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              layout
              className={`flex items-center gap-3 rounded-2xl p-4 border transition-all ${
                item.completed
                  ? isDark ? 'bg-white/5 border-white/5 opacity-60' : 'bg-slate-50 border-slate-100 opacity-60'
                  : isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'
              }`}
              style={{ boxShadow: item.completed ? 'none' : isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)' }}
            >
              {/* Checkbox */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleItem(item.id)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                  item.completed
                    ? 'border-transparent'
                    : isDark ? 'border-white/20' : 'border-slate-300'
                }`}
                style={item.completed ? { backgroundColor: item.color } : {}}
              >
                {item.completed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </motion.button>

              {/* Content */}
              <button
                onClick={() => handleItemAction(item.id)}
                className="flex-1 text-left"
              >
                <div className={`text-sm font-semibold ${item.completed ? 'line-through' : ''} ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {item.title}
                </div>
                <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {item.subtitle}
                </div>
              </button>

              {/* Icon */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                {getIcon(item.iconName)}
              </div>

              {/* Remove custom items */}
              {item.isCustom && (
                <button onClick={() => removeItem(item.id)} className={`p-1 rounded-full ${isDark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add Custom Item */}
        <AnimatePresence>
          {showAdd ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-3 rounded-2xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <input
                autoFocus
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
                placeholder="Custom routine step..."
                className={`w-full bg-transparent text-sm outline-none mb-3 ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-400'}`}
              />
              <div className="flex gap-2">
                <button onClick={addCustomItem} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-semibold">Add</button>
                <button onClick={() => setShowAdd(false)} className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAdd(true)}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed transition-colors ${
                isDark ? 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add custom step</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <MiniPlayer />
    </div>
  );
}