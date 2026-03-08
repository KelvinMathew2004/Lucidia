import { motion } from "motion/react";
import { useState, useRef } from "react";
import { 
  AlertTriangle, 
  Clock, 
  Heart, 
  Move, 
  Thermometer, 
  Wind, 
  Droplet,
  Zap,
  Shield,
  Radio
} from "lucide-react";
import { useTheme } from "../shared/ThemeContext";
import SlideToConfirm from "../shared/SlideToConfirm";

// Extended Sensory Topology with Anomaly Detection
function ExtendedSensoryTopology() {
  const { isDark } = useTheme();
  const [hoveredSense, setHoveredSense] = useState<number | null>(null);

  // Sensory data with anomaly flags
  const senseData = [
    { label: "Visual", value: 85, color: "#8B5CF6", isAnomaly: false },
    { label: "Interoception", value: 92, color: "#EF4444", isAnomaly: true }, // ANOMALY
    { label: "Proprioception", value: 34, color: "#06B6D4", isAnomaly: false },
    { label: "Chronoception", value: 94, color: "#F97316", isAnomaly: true }, // ANOMALY
    { label: "Vestibular", value: 89, color: "#F59E0B", isAnomaly: false },
    { label: "Tactile", value: 72, color: "#6366F1", isAnomaly: false }
  ];

  const centerX = 200;
  const centerY = 200;
  const radius = 130;
  const numberOfSenses = senseData.length;

  const getPolygonPoints = (values: number[]) => {
    return values
      .map((value, i) => {
        const angle = (Math.PI * 2 * i) / numberOfSenses - Math.PI / 2;
        const distance = (value / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const getDataPointPosition = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numberOfSenses - Math.PI / 2;
    const distance = (value / 100) * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    return { x, y };
  };

  const getLabelPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / numberOfSenses - Math.PI / 2;
    const labelDistance = radius + 45;
    const x = centerX + Math.cos(angle) * labelDistance;
    const y = centerY + Math.sin(angle) * labelDistance;
    return { x, y };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl p-8 border ${
        isDark 
          ? 'bg-zinc-900/80 border-white/10' 
          : 'bg-white border-slate-200'
      }`}
      style={{
        boxShadow: isDark 
          ? '0 20px 40px -8px rgba(0,0,0,0.4)' 
          : '0 20px 40px -8px rgba(0,0,0,0.08)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
          <Radio className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Extended Sensory Topology
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            REM Sleep Neural Mapping • 3:14 AM Event
          </p>
        </div>
      </div>

      <div className="relative w-full aspect-square max-w-[450px] mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            {senseData.map((sense, i) => (
              <radialGradient key={`gradient-${i}`} id={`glow-dash-${i}`}>
                <stop offset="0%" stopColor={sense.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={sense.color} stopOpacity="0" />
              </radialGradient>
            ))}

            <linearGradient id="polygonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>

            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="strongGlowFilter">
              <feGaussianBlur stdDeviation="12" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background concentric circles */}
          {[0.33, 0.66, 1].map((scale, i) => (
            <motion.circle
              key={`circle-${i}`}
              cx={centerX}
              cy={centerY}
              r={radius * scale}
              fill="none"
              stroke={isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.2)'}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}

          {/* Axis lines */}
          {senseData.map((_, i) => {
            const angle = (Math.PI * 2 * i) / numberOfSenses - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            return (
              <line
                key={`axis-${i}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.25)'}
                strokeWidth="1"
              />
            );
          })}

          {/* Main data polygon - breathing effect */}
          <motion.polygon
            points={getPolygonPoints(senseData.map(d => d.value))}
            fill="url(#polygonGradient)"
            stroke="#8B5CF6"
            strokeWidth="2"
            filter="url(#glowFilter)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.7, 0.9, 0.7],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Data points with AGGRESSIVE GLOW for anomalies */}
          {senseData.map((sense, i) => {
            const point = getDataPointPosition(i, sense.value);
            const isHovered = hoveredSense === i;

            return (
              <g key={`point-${i}`}>
                {/* Hit area */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredSense(i)}
                  onMouseLeave={() => setHoveredSense(null)}
                />

                {/* AGGRESSIVE GLOW for anomalies */}
                {sense.isAnomaly && (
                  <>
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="30"
                      fill={`url(#glow-dash-${i})`}
                      animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="15"
                      fill="none"
                      stroke={sense.color}
                      strokeWidth="2"
                      animate={{
                        r: [15, 35, 15],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  </>
                )}

                {/* Normal glow */}
                {!sense.isAnomaly && (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 25 : 15}
                    fill={`url(#glow-dash-${i})`}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: isHovered ? 0.8 : 0.4 }}
                  />
                )}

                {/* Main data point */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={sense.isAnomaly ? 10 : 7}
                  fill={sense.color}
                  stroke="#ffffff"
                  strokeWidth={sense.isAnomaly ? 4 : 2}
                  filter={sense.isAnomaly ? "url(#strongGlowFilter)" : "url(#glowFilter)"}
                  style={{ cursor: "pointer" }}
                  animate={sense.isAnomaly ? {
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={sense.isAnomaly ? {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                />
              </g>
            );
          })}

          {/* Labels */}
          {senseData.map((sense, i) => {
            const labelPos = getLabelPosition(i);
            const isHovered = hoveredSense === i;

            return (
              <text
                key={`label-${i}`}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[11px] font-semibold select-none ${
                  sense.isAnomaly ? 'animate-pulse' : ''
                }`}
                fill={sense.isAnomaly ? sense.color : (isHovered ? sense.color : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)')}
                style={{ pointerEvents: "none" }}
              >
                {sense.label}
                {sense.isAnomaly && " ⚠️"}
              </text>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}

// Dream Timeline Scrubber with Phobia Trigger
function DreamTimelineScrubber() {
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const TIMELINE_DURATION = 300; // 5 minutes
  const PHOBIA_TRIGGER_TIME = 194; // 194 seconds into timeline

  const tracks = [
    { id: "interoception", label: "Interoception", color: "#EF4444", icon: Heart },
    { id: "vestibular", label: "Vestibular", color: "#F59E0B", icon: Move },
    { id: "chronoception", label: "Chronoception", color: "#F97316", icon: Clock },
    { id: "proprioception", label: "Proprioception", color: "#06B6D4", icon: Droplet }
  ];

  const formatTime = (seconds: number) => {
    // Start timeline realistically at 12:14 AM
    const totalSeconds = 14 * 60 + Math.floor(seconds);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `12:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} AM`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setCurrentTime(percentage * TIMELINE_DURATION);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      setCurrentTime(percentage * TIMELINE_DURATION);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-3xl p-8 border ${
        isDark 
          ? 'bg-zinc-900/80 border-white/10' 
          : 'bg-white border-slate-200'
      }`}
      style={{
        boxShadow: isDark 
          ? '0 20px 40px -8px rgba(0,0,0,0.4)' 
          : '0 20px 40px -8px rgba(0,0,0,0.08)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
          <Clock className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
        </div>
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Dream Timeline Scrubber
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Neural Event Recording • Event at 12:17 AM
          </p>
        </div>
      </div>

      {/* Timeline tracks */}
      <div className="space-y-4 mb-6">
        {tracks.map((track, index) => {
          const Icon = track.icon;
          const isAffectedByTrigger = track.id === "interoception" || track.id === "vestibular";
          
          return (
            <div key={track.id}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: track.color }} />
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {track.label}
                </span>
              </div>
              
              {/* Waveform track */}
              <div 
                className={`relative h-16 rounded-lg overflow-hidden cursor-pointer ${
                  isDark ? 'bg-black/40' : 'bg-slate-100'
                }`}
                onPointerDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, x / rect.width));
                  setCurrentTime(percentage * TIMELINE_DURATION);
                }}
              >
                {/* Waveform visualization */}
                <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 64" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`gradient-${track.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={track.color} stopOpacity="0.6" />
                      <stop offset="100%" stopColor={track.color} stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={generateWaveformPath(track.id, isAffectedByTrigger)}
                    fill={`url(#gradient-${track.id})`}
                    stroke={track.color}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </svg>

                {/* Event Marker at trigger point */}
                {isAffectedByTrigger && (
                  <motion.div
                    className="absolute top-0 bottom-0 pointer-events-none border-l border-dashed"
                    style={{ 
                      left: `${(PHOBIA_TRIGGER_TIME / TIMELINE_DURATION) * 100}%`,
                      borderColor: track.color,
                      opacity: 0.6
                    }}
                  />
                )}

                {/* Moving Playhead Scrubber */}
                <motion.div
                  className="absolute top-0 bottom-0 w-[2px] z-20 pointer-events-none"
                  style={{ 
                    left: `${(currentTime / TIMELINE_DURATION) * 100}%`,
                    backgroundColor: track.color,
                    boxShadow: `0 0 8px ${track.color}`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Phobia Trigger Badge */}
      <motion.div
        className="relative mb-6"
        style={{ height: '60px' }}
      >
        <div 
          ref={timelineRef}
          onPointerDown={(e) => {
            setIsDragging(true);
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            handleTimelineClick(e);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          }}
          onPointerLeave={(e) => {
            setIsDragging(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          }}
          className="relative w-full h-8 flex flex-col justify-center cursor-pointer select-none"
        >
          {/* Progress bar background */}
          <div className="relative w-full h-1 bg-white/10 rounded-full">
            {/* Progress bar */}
            <motion.div
              className="absolute h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 pointer-events-none"
              style={{ width: `${(currentTime / TIMELINE_DURATION) * 100}%` }}
            />
          </div>
          
          {/* Scrubber Handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              left: `${(currentTime / TIMELINE_DURATION) * 100}%`,
              x: '-50%'
            }}
          >
            <motion.div
              className={`w-4 h-4 rounded-full border-2 ${
                isDark ? 'bg-white border-purple-400' : 'bg-slate-900 border-purple-500'
              }`}
              animate={{
                scale: isDragging ? 1.3 : 1,
                boxShadow: isDragging 
                  ? '0 0 20px rgba(139, 92, 246, 0.8)' 
                  : '0 0 10px rgba(139, 92, 246, 0.4)'
              }}
            />
          </motion.div>
          
          {/* Phobia Trigger Marker */}
          <div
            className="absolute -translate-x-1/2 bottom-[100%] mb-2 pointer-events-none"
            style={{ 
              left: `${(PHOBIA_TRIGGER_TIME / TIMELINE_DURATION) * 100}%`
            }}
          >
            <div className="relative">
              {/* Badge */}
              <div className={`relative px-3 py-1.5 rounded-md border flex items-center gap-1.5 whitespace-nowrap ${
                isDark 
                  ? 'bg-red-500/20 border-red-500/50' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <AlertTriangle className={`w-3.5 h-3.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                <span className={`text-[10px] uppercase tracking-wider font-bold ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  Phobia Trigger Detected
                </span>
              </div>
              
              {/* Pointing triangle */}
              <div className={`absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent ${
                isDark ? 'border-t-red-500/50' : 'border-t-red-300'
              }`} />
            </div>
          </div>
        </div>

        {/* Time display */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between">
          <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatTime(currentTime)}
          </span>
          <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatTime(TIMELINE_DURATION)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to generate waveform path
function generateWaveformPath(trackId: string, hasSpike: boolean): string {
  const points = 100;
  const spikePosition = 65; // 65% through
  let path = "M 0 50 ";
  
  // Deterministic pseudo-random seed based on trackId length to keep wave stable
  const seed = trackId.length;
  
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 100;
    
    // Base sci-fi telemetry wave (smoother, more organic data flow)
    const baseWave = Math.sin(i * 0.15 + seed) * 8 + Math.sin(i * 0.4 + seed * 2) * 4;
    let y = 45 + baseWave;
    
    // Add micro-jitter for realism
    y += Math.sin(i * 12) * 1.5;
    
    // Add anomaly spike
    if (hasSpike) {
      const dist = Math.abs(i - spikePosition);
      if (dist < 15) {
        // Smooth exponential spike curve
        const spikeIntensity = Math.exp(-Math.pow(dist, 2) / 8);
        const noiseSpike = Math.sin(i * 3) * 8;
        y -= (spikeIntensity * 25) + (spikeIntensity * noiseSpike);
      }
    }
    
    if (i === 0) {
      path = `M ${x} ${y} `;
    } else {
      path += `L ${x} ${y} `;
    }
  }
  
  path += "L 100 64 L 0 64 Z";
  return path;
}

// Habitat & Totem Sync - Active Interventions
function HabitatTotemSync() {
  const { isDark } = useTheme();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const interventionCards = [
    {
      icon: Radio,
      title: "Lucidia Totem",
      subtitle: "Haptic Reality Anchor",
      status: "Pulsing at 40 BPM to induce Lucidity",
      color: "#8B5CF6",
      isActive: true
    },
    {
      icon: Wind,
      title: "Habitat Sync - Olfactory",
      subtitle: "Smart Diffuser",
      status: "Releasing Lavender to lower Interoceptive stress",
      color: "#10B981",
      isActive: true
    },
    {
      icon: Thermometer,
      title: "Habitat Sync - Thermoception",
      subtitle: "Room Climate",
      status: "Lowering to 66°F to counteract nocturnal sweating",
      color: "#3B82F6",
      isActive: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`rounded-3xl p-8 border ${
        isDark 
          ? 'bg-zinc-900/80 border-white/10' 
          : 'bg-white border-slate-200'
      }`}
      style={{
        boxShadow: isDark 
          ? '0 20px 40px -8px rgba(0,0,0,0.4)' 
          : '0 20px 40px -8px rgba(0,0,0,0.08)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
          <Zap className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
        </div>
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Active Sensory Overrides
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Physical Environment Interventions
          </p>
        </div>
      </div>

      {/* Intervention Cards */}
      <div className="space-y-4 mb-8">
        {interventionCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`relative rounded-2xl p-5 border overflow-hidden ${
                isDark 
                  ? 'bg-white/5 border-white/10 backdrop-blur-xl' 
                  : 'bg-white border-slate-200'
              }`}
              style={{
                boxShadow: isDark 
                  ? `0 8px 20px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)` 
                  : '0 8px 20px -4px rgba(0,0,0,0.05)'
              }}
            >
              {/* Pulsing border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  border: `1px solid ${card.color}40`
                }}
                animate={{
                  boxShadow: [
                    `0 0 0 0 ${card.color}00`,
                    `0 0 20px 2px ${card.color}60`,
                    `0 0 0 0 ${card.color}00`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative flex items-start gap-4">
                {/* Icon with active indicator */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: `${card.color}20`,
                      boxShadow: `0 0 20px ${card.color}40`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  
                  {/* Active pulse indicator */}
                  {card.isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: card.color }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.6, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {card.title}
                    </h3>
                    {card.isActive && (
                      <span 
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${card.color}20`,
                          color: card.color
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {card.subtitle}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {card.status}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Neural Write-Access Control */}
      <div className={`rounded-2xl p-5 border ${
        isDark 
          ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30' 
          : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <Shield className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`} />
          <div>
            <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Neural Write-Access Control
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              BCI interventions require explicit authorization. Slide to modify active sensory overrides.
            </p>
          </div>
        </div>

        <SlideToConfirm
          onConfirm={() => setIsAuthorized(true)}
          text="Slide to Modify Neural Write-Access"
          confirmedText="Neural Access Authorized"
        />
      </div>
    </motion.div>
  );
}

// Main Dashboard Component
export default function LucidiaSensoryDashboard() {
  return (
    <div className="space-y-6">
      <ExtendedSensoryTopology />
      <DreamTimelineScrubber />
      <HabitatTotemSync />
    </div>
  );
}