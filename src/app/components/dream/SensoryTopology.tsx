import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "../../../lib/utils";

interface SenseData {
  label: string;
  value: number; // 0-100
  color: string;
  glowColor: string;
  description: string;
  timestamp: string;
}

interface SensoryTopologyProps {
  className?: string;
  data?: SenseData[];
}

const defaultSenseData: SenseData[] = [
  {
    label: "Visual",
    value: 85,
    color: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.6)",
    description: "Vivid imagery observed (Lucid landscapes)",
    timestamp: "02:47 AM"
  },
  {
    label: "Auditory",
    value: 62,
    color: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.6)",
    description: "Moderate sound clarity (Distant voices)",
    timestamp: "02:52 AM"
  },
  {
    label: "Proprioception",
    value: 34,
    color: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.6)",
    description: "Sleep paralysis detected (Body immobility)",
    timestamp: "03:08 AM"
  },
  {
    label: "Chronoception",
    value: 91,
    color: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.6)",
    description: "Extreme time dilation (Hours felt like minutes)",
    timestamp: "03:14 AM"
  },
  {
    label: "Interoception",
    value: 78,
    color: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.6)",
    description: "Elevated internal stress (Increased heart rate)",
    timestamp: "03:14 AM"
  },
  {
    label: "Vestibular",
    value: 95,
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.6)",
    description: "Extreme spatial disorientation detected (Sensation of Falling)",
    timestamp: "03:14 AM"
  },
  {
    label: "Thermoception",
    value: 58,
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.6)",
    description: "Mild temperature variance (Cool environment)",
    timestamp: "03:19 AM"
  },
  {
    label: "Tactile",
    value: 72,
    color: "#6366F1",
    glowColor: "rgba(99, 102, 241, 0.6)",
    description: "Heightened touch sensitivity (Texture awareness)",
    timestamp: "03:21 AM"
  }
];

export default function SensoryTopology({ className, data = defaultSenseData }: SensoryTopologyProps) {
  const [hoveredSense, setHoveredSense] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const centerX = 200;
  const centerY = 200;
  const radius = 140;
  const numberOfSenses = data.length;

  // Calculate polygon points for the radar chart
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

  // Get axis line endpoints
  const getAxisEndpoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / numberOfSenses - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return { x, y, angle };
  };

  // Get label position (slightly outside the radar)
  const getLabelPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / numberOfSenses - Math.PI / 2;
    const labelDistance = radius + 40;
    const x = centerX + Math.cos(angle) * labelDistance;
    const y = centerY + Math.sin(angle) * labelDistance;
    return { x, y };
  };

  // Get data point position
  const getDataPointPosition = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numberOfSenses - Math.PI / 2;
    const distance = (value / 100) * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const tooltipWidth = 280;
    const tooltipHeight = 120;
    const padding = 16;
    
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Check if tooltip would go off right edge
    if (x + tooltipWidth/2 > rect.width - padding) {
      x = rect.width - tooltipWidth/2 - padding;
    }
    // Check if tooltip would go off left edge
    if (x - tooltipWidth/2 < padding) {
      x = tooltipWidth/2 + padding;
    }
    // Check if tooltip would go off top edge
    if (y - tooltipHeight - padding < 0) {
      y = tooltipHeight + padding;
    }
    
    setMousePosition({ x, y });
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative w-full aspect-square max-w-[500px] mx-auto">
        {/* SVG Radar Chart */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSense(null)}
        >
          <defs>
            {/* Gradient definitions for each sense */}
            {data.map((sense, i) => (
              <radialGradient key={`gradient-${i}`} id={`glow-${i}`}>
                <stop offset="0%" stopColor={sense.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={sense.color} stopOpacity="0" />
              </radialGradient>
            ))}

            {/* Main polygon gradient */}
            <linearGradient id="polygonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Strong glow filter */}
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background concentric circles */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <motion.circle
              key={`circle-${i}`}
              cx={centerX}
              cy={centerY}
              r={radius * scale}
              fill="none"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            />
          ))}

          {/* Axis lines */}
          {data.map((_, i) => {
            const endpoint = getAxisEndpoint(i);
            return (
              <motion.line
                key={`axis-${i}`}
                x1={centerX}
                y1={centerY}
                x2={endpoint.x}
                y2={endpoint.y}
                stroke="rgba(139, 92, 246, 0.15)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
              />
            );
          })}

          {/* Main data polygon */}
          <motion.polygon
            points={getPolygonPoints(data.map(d => d.value))}
            fill="url(#polygonGradient)"
            stroke="#8B5CF6"
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
          />

          {/* Animated morphing effect */}
          <motion.polygon
            points={getPolygonPoints(data.map(d => d.value))}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
            opacity="0.4"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Data points and interactive areas */}
          {data.map((sense, i) => {
            const point = getDataPointPosition(i, sense.value);
            const isHovered = hoveredSense === i;

            return (
              <g key={`point-${i}`}>
                {/* Invisible larger hit area for better hover */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredSense(i)}
                />

                {/* Glow effect */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 25 : 15}
                  fill={`url(#glow-${i})`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isHovered ? 0.8 : 0.4 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main data point */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 8 : 6}
                  fill={sense.color}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 3 : 2}
                  filter={isHovered ? "url(#strongGlow)" : "url(#glow)"}
                  style={{ cursor: "pointer" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.3 }}
                />

                {/* Pulsing animation for high values */}
                {sense.value > 80 && (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="10"
                    fill="none"
                    stroke={sense.color}
                    strokeWidth="2"
                    opacity="0.6"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Labels */}
          {data.map((sense, i) => {
            const labelPos = getLabelPosition(i);
            const isHovered = hoveredSense === i;

            return (
              <motion.text
                key={`label-${i}`}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-medium select-none"
                fill={isHovered ? sense.color : "rgba(255, 255, 255, 0.7)"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                style={{ pointerEvents: "none" }}
              >
                {sense.label}
              </motion.text>
            );
          })}
        </svg>

        {/* Glassmorphic Tooltip */}
        {hoveredSense !== null && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              transform: "translate(-50%, -120%)"
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {/* Glow background */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                style={{
                  background: data[hoveredSense].glowColor
                }}
              />
              
              {/* Glass card */}
              <div className="relative rounded-2xl border border-white/20 bg-black/60 backdrop-blur-2xl px-4 py-3 shadow-2xl min-w-[280px]">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: data[hoveredSense].color,
                      boxShadow: `0 0 12px ${data[hoveredSense].glowColor}`
                    }}
                  />
                  <span className="text-white font-semibold text-sm">
                    {data[hoveredSense].label}
                  </span>
                  <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${data[hoveredSense].color}20`,
                      color: data[hoveredSense].color
                    }}
                  >
                    {data[hoveredSense].value}%
                  </span>
                </div>

                {/* Description */}
                <p className="text-white/80 text-xs mb-2 leading-relaxed">
                  {data[hoveredSense].description}
                </p>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M5 2.5V5L6.5 6.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                  <span>{data[hoveredSense].timestamp}</span>
                </div>

                {/* Arrow pointer */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 border-r border-b border-white/20"
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(24px)"
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <motion.div
        className="mt-8 grid grid-cols-2 gap-3 max-w-[500px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {data.map((sense, i) => (
          <div
            key={`legend-${i}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer",
              hoveredSense === i
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-white/5"
            )}
            onMouseEnter={() => setHoveredSense(i)}
            onMouseLeave={() => setHoveredSense(null)}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: sense.color,
                boxShadow: hoveredSense === i ? `0 0 12px ${sense.glowColor}` : "none"
              }}
            />
            <span className="text-white/70 text-xs truncate">{sense.label}</span>
            <span
              className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: `${sense.color}15`,
                color: hoveredSense === i ? sense.color : "rgba(255, 255, 255, 0.5)"
              }}
            >
              {sense.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}