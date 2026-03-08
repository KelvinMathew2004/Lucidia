import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Activity, Zap, AlertTriangle, CheckCircle2, ThermometerSnowflake, Move, Heart } from "lucide-react";
import { cn } from "../../../lib/utils";

interface WaveformTrack {
  id: string;
  label: string;
  color: string;
  glowColor: string;
  icon: any;
  data: number[]; // 0-100 values representing intensity
  description: string;
}

interface NeuralIntervention {
  timestamp: number; // 0-300 (seconds in 5 min timeline)
  type: string;
  description: string;
  tracksAffected: string[];
}

const TIMELINE_DURATION = 300; // 5 minutes in seconds
const SAMPLES_PER_SECOND = 4; // 4 data points per second
const TOTAL_SAMPLES = TIMELINE_DURATION * SAMPLES_PER_SECOND;

// Generate realistic waveform data
const generateWaveform = (baseLevel: number, variance: number, spikes: { position: number; intensity: number }[] = []): number[] => {
  const data: number[] = [];
  const phase = baseLevel * 0.1;
  
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    // Smooth telemetry-like wave using combined sine functions
    const noise = Math.sin(i * 0.1 + phase) * 0.5 + Math.sin(i * 0.03 + phase) * 0.3 + Math.sin(i * 0.4) * 0.2;
    let value = baseLevel + noise * variance;
    
    // Add spikes
    spikes.forEach(spike => {
      const spikePosition = spike.position * SAMPLES_PER_SECOND;
      const distance = Math.abs(i - spikePosition);
      if (distance < 40) { // Spike duration
        const spikeEffect = spike.intensity * Math.exp(-Math.pow(distance, 2) / 100);
        const chaoticNoise = (Math.sin(i * 1.5) * 0.5 + 0.5) * spikeEffect;
        value += chaoticNoise + spikeEffect * 0.5;
      }
    });
    
    data.push(Math.max(0, Math.min(100, value)));
  }
  return data;
};

const NIGHT_TERROR_TIMESTAMP = 142; // 2:22 into the timeline

const defaultTracks: WaveformTrack[] = [
  {
    id: "interoception",
    label: "Interoception",
    color: "#EF4444",
    glowColor: "rgba(239, 68, 68, 0.6)",
    icon: Heart,
    description: "Internal visceral dread",
    data: generateWaveform(25, 15, [{ position: NIGHT_TERROR_TIMESTAMP, intensity: 75 }])
  },
  {
    id: "proprioception",
    label: "Proprioception",
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.6)",
    icon: Move,
    description: "Sleep paralysis / Inability to move",
    data: generateWaveform(30, 12, [{ position: NIGHT_TERROR_TIMESTAMP, intensity: 70 }])
  },
  {
    id: "thermoception",
    label: "Thermoception",
    color: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.6)",
    icon: ThermometerSnowflake,
    description: "Sudden cold sweat",
    data: generateWaveform(20, 10, [{ position: NIGHT_TERROR_TIMESTAMP, intensity: 65 }])
  },
  {
    id: "visual",
    label: "Visual",
    color: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.6)",
    icon: Activity,
    description: "Visual cortex activity",
    data: generateWaveform(45, 20, [{ position: NIGHT_TERROR_TIMESTAMP, intensity: 30 }])
  },
  {
    id: "auditory",
    label: "Auditory",
    color: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.6)",
    icon: Activity,
    description: "Auditory processing",
    data: generateWaveform(35, 18, [{ position: NIGHT_TERROR_TIMESTAMP, intensity: 25 }])
  }
];

const intervention: NeuralIntervention = {
  timestamp: NIGHT_TERROR_TIMESTAMP,
  type: "Somatic Warmth & Kinetic Freedom",
  description: "BCI detected critical stress convergence. Auto-injected calming protocol.",
  tracksAffected: ["interoception", "proprioception", "thermoception"]
};

interface NeuralPlaybackScrubberProps {
  className?: string;
  tracks?: WaveformTrack[];
  autoPlay?: boolean;
}

export default function NeuralPlaybackScrubber({ 
  className, 
  tracks = defaultTracks,
  autoPlay = false 
}: NeuralPlaybackScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  const playheadX = useMotionValue(0);
  const timelineWidth = 1000; // Will be adjusted based on container

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if playhead is near intervention
  const isNearIntervention = Math.abs(currentTime - intervention.timestamp) < 3;

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && currentTime < TIMELINE_DURATION) {
      const startTime = Date.now();
      const startValue = currentTime;
      
      animationRef.current = animate(startValue, TIMELINE_DURATION, {
        duration: (TIMELINE_DURATION - startValue),
        ease: "linear",
        onUpdate: (latest) => {
          setCurrentTime(latest);
          if (timelineRef.current) {
            const progress = latest / TIMELINE_DURATION;
            playheadX.set(progress * timelineRef.current.offsetWidth);
          }
        },
        onComplete: () => {
          setIsPlaying(false);
          setCurrentTime(0);
          playheadX.set(0);
        }
      });

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    }
  }, [isPlaying, currentTime]);

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    const newTime = progress * TIMELINE_DURATION;
    
    setCurrentTime(newTime);
    playheadX.set(x);
    
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const togglePlayPause = () => {
    if (currentTime >= TIMELINE_DURATION) {
      setCurrentTime(0);
      playheadX.set(0);
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    if (timelineRef.current) {
      playheadX.set((newTime / TIMELINE_DURATION) * timelineRef.current.offsetWidth);
    }
  };

  const skipForward = () => {
    const newTime = Math.min(TIMELINE_DURATION, currentTime + 10);
    setCurrentTime(newTime);
    if (timelineRef.current) {
      playheadX.set((newTime / TIMELINE_DURATION) * timelineRef.current.offsetWidth);
    }
  };

  return (
    <div className={cn("relative w-full bg-[#0A0A0F] rounded-2xl border border-white/10 overflow-hidden", className)}>
      {/* Top Control Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-sm font-semibold whitespace-nowrap">Neural Playback</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-white/50 text-xs truncate">Night Terror Event • March 8, 2026 • 03:14 AM</span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <button
            onClick={skipBackward}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <SkipBack className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={togglePlayPause}
            className="p-2.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-purple-300" />
            ) : (
              <Play className="w-4 h-4 text-purple-300" />
            )}
          </button>
          <button
            onClick={skipForward}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <SkipForward className="w-4 h-4 text-white" />
          </button>
          
          <div className="h-4 w-px bg-white/10 ml-2" />
          
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white font-mono text-sm tabular-nums">
              {formatTime(currentTime)} / {formatTime(TIMELINE_DURATION)}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="p-6 space-y-6">
        {/* Timeline Ruler */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2 px-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-px h-2 bg-white/20" />
                <span className="text-[10px] text-white/40 font-mono mt-1 tabular-nums">
                  {formatTime(i * 60)}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline Track */}
          <div 
            ref={timelineRef}
            className="relative h-12 bg-black/40 rounded-lg border border-white/10 cursor-pointer overflow-hidden"
            onClick={handleTimelineClick}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 border-r border-white/5"
                />
              ))}
            </div>

            {/* Intervention marker */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 z-10"
              style={{
                left: `${(intervention.timestamp / TIMELINE_DURATION) * 100}%`,
                background: "linear-gradient(to bottom, #F59E0B, #EF4444)"
              }}
              animate={{
                boxShadow: isNearIntervention 
                  ? ["0 0 10px rgba(245, 158, 11, 0.6)", "0 0 20px rgba(245, 158, 11, 1)", "0 0 10px rgba(245, 158, 11, 0.6)"]
                  : "0 0 5px rgba(245, 158, 11, 0.3)"
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
              </div>
            </motion.div>

            {/* Playhead */}
            <motion.div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{ x: playheadX }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </motion.div>

            {/* Progress fill */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-500/20 to-purple-500/10 border-r border-purple-400/30"
              style={{
                width: `${(currentTime / TIMELINE_DURATION) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Neural Intervention Badge */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isNearIntervention ? 1 : 0.4,
            y: isNearIntervention ? 0 : 10,
            scale: isNearIntervention ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn(
            "relative rounded-xl border p-4 transition-all duration-300",
            isNearIntervention 
              ? "bg-orange-500/10 border-orange-400/40" 
              : "bg-white/5 border-white/10"
          )}>
            {isNearIntervention && (
              <div 
                className="absolute inset-0 rounded-xl blur-xl opacity-40"
                style={{
                  background: "radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)"
                }}
              />
            )}
            
            <div className="relative flex items-start gap-3">
              <motion.div
                className="p-2 rounded-lg bg-orange-500/20 border border-orange-400/30"
                animate={{
                  boxShadow: isNearIntervention 
                    ? ["0 0 0px rgba(245, 158, 11, 0)", "0 0 20px rgba(245, 158, 11, 0.8)", "0 0 0px rgba(245, 158, 11, 0)"]
                    : "none"
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-orange-400" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-semibold text-sm">Neural Intervention Active</h4>
                  {isNearIntervention && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/30"
                    >
                      <span className="text-green-300 text-[10px] font-bold">DEPLOYED</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-white/60 text-xs mb-2">{intervention.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40">Protocol:</span>
                  <span className="text-[10px] text-orange-300 font-medium">{intervention.type}</span>
                  <span className="text-[10px] text-white/40">•</span>
                  <span className="text-[10px] text-white/40">
                    @ {formatTime(intervention.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Waveform Tracks */}
        <div className="space-y-3">
          {tracks.map((track) => {
            const isAffected = intervention.tracksAffected.includes(track.id);
            const Icon = track.icon;
            const currentSample = Math.floor((currentTime / TIMELINE_DURATION) * TOTAL_SAMPLES);
            const currentValue = track.data[currentSample] || 0;
            const isHovered = hoveredTrack === track.id;

            return (
              <motion.div
                key={track.id}
                className={cn(
                  "relative rounded-lg border p-3 transition-all duration-300",
                  isHovered ? "bg-white/5 border-white/20" : "bg-white/[0.02] border-white/5"
                )}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                animate={{
                  borderColor: isAffected && isNearIntervention 
                    ? track.glowColor 
                    : isHovered ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)"
                }}
              >
                {/* Track Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-lg border"
                      style={{
                        backgroundColor: `${track.color}15`,
                        borderColor: `${track.color}30`
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: track.color }} />
                    </div>
                    <div>
                      <h5 className="text-white text-xs font-semibold">{track.label}</h5>
                      <p className="text-white/40 text-[10px]">{track.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isAffected && isNearIntervention && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2 py-1 rounded-md bg-orange-500/10 border border-orange-400/20"
                      >
                        <span className="text-orange-300 text-[9px] font-bold">REGULATED</span>
                      </motion.div>
                    )}
                    <div className="text-right">
                      <div 
                        className="text-xs font-mono font-bold tabular-nums"
                        style={{ color: track.color }}
                      >
                        {currentValue.toFixed(0)}%
                      </div>
                      <div className="text-[9px] text-white/30">intensity</div>
                    </div>
                  </div>
                </div>

                {/* Waveform */}
                <div className="relative h-16 rounded-md bg-black/40 border border-white/5 overflow-hidden">
                  {/* Intervention marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-orange-400/30 z-10"
                    style={{
                      left: `${(intervention.timestamp / TIMELINE_DURATION) * 100}%`
                    }}
                  />

                  {/* Waveform visualization */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id={`gradient-${track.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={track.color} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={track.color} stopOpacity="0.1" />
                      </linearGradient>
                      <filter id={`glow-${track.id}`}>
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Waveform path */}
                    <path
                      d={track.data.map((value, i) => {
                        const x = (i / TOTAL_SAMPLES) * 100;
                        const y = 100 - value;
                        return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke={track.color}
                      strokeWidth="1.5"
                      opacity="0.8"
                      filter={`url(#glow-${track.id})`}
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Fill area */}
                    <path
                      d={`
                        M 0% 100%
                        ${track.data.map((value, i) => {
                          const x = (i / TOTAL_SAMPLES) * 100;
                          const y = 100 - value;
                          return `L ${x}% ${y}%`;
                        }).join(' ')}
                        L 100% 100%
                        Z
                      `}
                      fill={`url(#gradient-${track.id})`}
                      opacity="0.4"
                    />

                    {/* Current position indicator */}
                    <line
                      x1={`${(currentTime / TIMELINE_DURATION) * 100}%`}
                      y1="0%"
                      x2={`${(currentTime / TIMELINE_DURATION) * 100}%`}
                      y2="100%"
                      stroke="white"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3 pt-3 border-t border-white/5">
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1">Total Events</div>
            <div className="text-white text-sm font-bold">1</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1">Interventions</div>
            <div className="text-green-400 text-sm font-bold">1</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1">Peak Stress</div>
            <div className="text-red-400 text-sm font-bold">94%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1">Avg BPM</div>
            <div className="text-white text-sm font-bold">68</div>
          </div>
        </div>
      </div>
    </div>
  );
}
