import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function SpaceBackground() {
  const [stars, setStars] = useState<Array<{ id: number; top: string; left: string; size: number; delay: number; duration: number }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; topStart: string; leftStart: string; delay: number; duration: number; repeatDelay: number; width: number }>>([]);

  useEffect(() => {
    // Generate random stars on mount
    const generatedStars = Array.from({ length: 90 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);

    // Generate shooting stars
    const generatedShootingStars = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      topStart: `${Math.random() * 30}%`,
      leftStart: `${100 + Math.random() * 20}%`, // Start off-screen right
      delay: Math.random() * 10,
      duration: 1.2 + Math.random() * 0.8,
      repeatDelay: 5 + Math.random() * 10,
      width: 100 + Math.random() * 100,
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none w-full h-full bg-gradient-to-b from-[#1a1030] via-[#110d1f] to-[#0d0a18] overflow-hidden z-[-1]">
      
      {/* Slow Moving Auroras / Glowing Lines */}
      <motion.div
        className="absolute w-[200%] h-[30vh] bg-gradient-to-t from-transparent via-indigo-500/10 to-transparent -rotate-45"
        style={{ top: "10%", left: "-50%" }}
        animate={{
          y: [-30, 30, -30],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[200%] h-[20vh] bg-gradient-to-t from-transparent via-purple-500/10 to-transparent -rotate-45"
        style={{ top: "40%", left: "-30%" }}
        animate={{
          y: [30, -30, 30],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Dynamic Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`,
          }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [1, 1.3, 1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          className="absolute h-[2px] bg-gradient-to-r from-white via-indigo-200/50 to-transparent rounded-full shadow-[0_0_10px_#fff]"
          style={{
            width: `${star.width}px`,
            top: star.topStart,
            left: star.leftStart,
            rotate: "-35deg", // points up-right, but moves down-left
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [-100, -900], // move left relative to screen
            y: [50, 600],    // move down relative to screen
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
            repeatDelay: star.repeatDelay,
          }}
        />
      ))}

      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-20%] w-[60vh] h-[60vh] bg-indigo-600/20 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-fuchsia-600/10 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-[30vh] h-[30vh] bg-blue-500/10 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}