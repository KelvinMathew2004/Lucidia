import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Sun, Moon, Search, Play, Pause, CloudRain, Wind, Waves, TreePine, Flame, Headphones, Music, Zap } from "lucide-react";
import { useTheme } from "../components/shared/ThemeContext";
import { useAudioPlayer, SoundTrack } from "../components/shared/AudioPlayerContext";
import MiniPlayer from "../components/shared/MiniPlayer";

type Category = "All" | "Rain" | "Nature" | "White Noise" | "Binaural" | "Ambient";

const SOUND_LIBRARY: SoundTrack[] = [
  // Rain
  { id: "rain-1", title: "Light Drizzle", subtitle: "Gentle rain on leaves", category: "Rain", icon: "🌧️", color: "#60a5fa" },
  { id: "rain-2", title: "Steady Rain", subtitle: "Consistent rainfall", category: "Rain", icon: "🌧️", color: "#3b82f6" },
  { id: "rain-3", title: "Heavy Downpour", subtitle: "Intense storm rain", category: "Rain", icon: "⛈️", color: "#2563eb" },
  { id: "rain-4", title: "Rain on Tent", subtitle: "Camping ambience", category: "Rain", icon: "⛺", color: "#818cf8" },
  { id: "rain-5", title: "Rain on Window", subtitle: "Indoor comfort", category: "Rain", icon: "🪟", color: "#a78bfa" },
  { id: "rain-6", title: "Thunderstorm", subtitle: "Distant rolling thunder", category: "Rain", icon: "⚡", color: "#6366f1" },
  // Nature
  { id: "nature-1", title: "Ocean Waves", subtitle: "Rhythmic shoreline", category: "Nature", icon: "🌊", color: "#06b6d4" },
  { id: "nature-2", title: "Forest Night", subtitle: "Crickets & owls", category: "Nature", icon: "🌲", color: "#10b981" },
  { id: "nature-3", title: "Campfire", subtitle: "Crackling embers", category: "Nature", icon: "🔥", color: "#f59e0b" },
  { id: "nature-4", title: "River Stream", subtitle: "Flowing water", category: "Nature", icon: "💧", color: "#22d3ee" },
  { id: "nature-5", title: "Wind Through Trees", subtitle: "Gentle breeze", category: "Nature", icon: "🍃", color: "#34d399" },
  { id: "nature-6", title: "Bird Song Dawn", subtitle: "Morning chorus", category: "Nature", icon: "🐦", color: "#a3e635" },
  // White Noise
  { id: "white-1", title: "Pure White Noise", subtitle: "Full spectrum", category: "White Noise", icon: "📡", color: "#94a3b8" },
  { id: "white-2", title: "Pink Noise", subtitle: "Balanced frequency", category: "White Noise", icon: "🎵", color: "#f472b6" },
  { id: "white-3", title: "Brown Noise", subtitle: "Deep & warm", category: "White Noise", icon: "🎶", color: "#a78bfa" },
  { id: "white-4", title: "Fan Sound", subtitle: "Steady airflow", category: "White Noise", icon: "💨", color: "#64748b" },
  // Binaural
  { id: "bin-1", title: "Delta Waves", subtitle: "Deep sleep · 0.5-4 Hz", category: "Binaural", icon: "🧠", color: "#8b5cf6" },
  { id: "bin-2", title: "Theta Waves", subtitle: "Dreaming · 4-8 Hz", category: "Binaural", icon: "🧠", color: "#c084fc" },
  { id: "bin-3", title: "Alpha Waves", subtitle: "Relaxation · 8-13 Hz", category: "Binaural", icon: "🧠", color: "#a78bfa" },
  { id: "bin-4", title: "432 Hz Harmony", subtitle: "Universal frequency", category: "Binaural", icon: "🎧", color: "#e879f9" },
  // Ambient
  { id: "amb-1", title: "Deep Space Drone", subtitle: "Cosmic ambience", category: "Ambient", icon: "🌌", color: "#6366f1" },
  { id: "amb-2", title: "Tibetan Bowls", subtitle: "Singing bowl resonance", category: "Ambient", icon: "🔔", color: "#f59e0b" },
  { id: "amb-3", title: "Lo-fi Sleep Pads", subtitle: "Warm analog textures", category: "Ambient", icon: "🎹", color: "#ec4899" },
  { id: "amb-4", title: "Crystal Cavern", subtitle: "Ethereal echoes", category: "Ambient", icon: "💎", color: "#22d3ee" },
];

// Module-scope icon map using component references only (no JSX at module scope)
const CATEGORY_ICON_COMPONENTS: Record<Category, React.ComponentType<{ className?: string }>> = {
  "All": Music,
  "Rain": CloudRain,
  "Nature": TreePine,
  "White Noise": Wind,
  "Binaural": Headphones,
  "Ambient": Waves,
};

export default function SoundLibraryScreen() {
  const navigate = useNavigate();
  const { isDark, toggleDark } = useTheme();
  const { currentTrack, isPlaying, play, pause, resume } = useAudioPlayer();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSounds = SOUND_LIBRARY.filter(sound => {
    const matchesCategory = activeCategory === "All" || sound.category === activeCategory;
    const matchesSearch = sound.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sound.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTrackPress = (track: SoundTrack) => {
    if (currentTrack?.id === track.id) {
      isPlaying ? pause() : resume();
    } else {
      play(track);
    }
  };

  const categories: Category[] = ["All", "Rain", "Nature", "White Noise", "Binaural", "Ambient"];

  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#110d1f] text-slate-50' : 'bg-[#f8f9fc] text-slate-800'}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Background */}
      <div className={`absolute inset-0 -z-10 transition-colors duration-500 ${isDark ? 'bg-[#110d1f]' : 'bg-[#F4F2FA]'}`} />
      <div className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b opacity-60 -z-10 transition-colors duration-500 ${isDark ? 'from-indigo-900/30 to-transparent' : 'from-indigo-100 to-transparent'}`} />

      {/* Header */}
      <div className={`px-5 pt-12 pb-3 sticky top-0 backdrop-blur-xl z-30 transition-colors duration-500 ${isDark ? 'bg-[#110d1f]/90' : 'bg-[#F4F2FA]/90'}`}>
        <header className="flex items-center justify-between py-2 relative">
          <button
            onClick={() => navigate("/home")}
            className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className={`text-base font-semibold tracking-wide absolute left-1/2 -translate-x-1/2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Soundscapes
          </span>
          <button
            onClick={toggleDark}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-slate-200 text-indigo-600 bg-indigo-100/50 border border-indigo-200'}`}
          >
            {isDark ? <Sun className="w-5 h-5 fill-amber-300/20" strokeWidth={2} /> : <Moon className="w-5 h-5 fill-indigo-600/20" strokeWidth={2.5} />}
          </button>
        </header>

        {/* Search */}
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 mt-2 border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
          <Search className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'}`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scroll pb-1">
          {categories.map(cat => {
            const CatIcon = CATEGORY_ICON_COMPONENTS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <CatIcon className="w-4 h-4" />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound Grid */}
      <div className={`flex-1 px-5 pt-4 overflow-y-auto hide-scroll ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredSounds.map((sound, i) => {
              const isActive = currentTrack?.id === sound.id;
              const isTrackPlaying = isActive && isPlaying;

              return (
                <motion.button
                  key={sound.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTrackPress(sound)}
                  className={`relative rounded-2xl p-4 text-left border overflow-hidden transition-all h-32 flex flex-col justify-between ${
                    isActive
                      ? `border-indigo-500/50 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`
                      : isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? `0 0 20px ${sound.color}30`
                      : isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Background glow */}
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: sound.color }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{sound.icon}</span>
                      {isTrackPlaying && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex gap-[2px] items-end h-3"
                        >
                          {[...Array(3)].map((_, j) => (
                            <motion.div
                              key={j}
                              className="w-[3px] rounded-full"
                              style={{ backgroundColor: sound.color }}
                              animate={{ height: ["4px", "12px", "4px"] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.15 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div className={`text-sm font-semibold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {sound.title}
                    </div>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {sound.subtitle}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isTrackPlaying ? <Pause className="w-3 h-3" fill="currentColor" /> : <Play className="w-3 h-3 ml-0.5" fill="currentColor" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredSounds.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No sounds found</p>
          </div>
        )}
      </div>

      <MiniPlayer />
    </div>
  );
}