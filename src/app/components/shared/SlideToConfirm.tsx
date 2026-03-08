import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { ChevronRight, Lock, Check } from "lucide-react";

interface SlideToConfirmProps {
  onConfirm: () => void;
  text?: string;
  disabled?: boolean;
  className?: string;
}

export default function SlideToConfirm({
  onConfirm,
  text = "Slide to Confirm",
  disabled = false,
  className = ""
}: SlideToConfirmProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    if (constraintsRef.current) {
      const sliderWidth = 56; // Width of the slider button
      setMaxWidth(constraintsRef.current.offsetWidth - sliderWidth);
    }
    
    // Update maxWidth on window resize for responsive landscape support
    const handleResize = () => {
      if (constraintsRef.current) {
        const sliderWidth = 56;
        setMaxWidth(constraintsRef.current.offsetWidth - sliderWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate background progress
  const background = useTransform(
    x,
    [0, maxWidth],
    [
      "linear-gradient(to right, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 0%)",
      "linear-gradient(to right, rgba(239, 68, 68, 0.15) 100%, rgba(239, 68, 68, 0.05) 100%)"
    ]
  );

  const opacity = useTransform(x, [0, maxWidth * 0.5, maxWidth], [1, 0.5, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = maxWidth * 0.85; // 85% of the way

    if (info.point.x >= threshold && !disabled) {
      setIsConfirmed(true);
      x.set(maxWidth);
      
      // Trigger confirmation after animation
      setTimeout(() => {
        onConfirm();
      }, 300);
    } else {
      x.set(0);
    }
  };

  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative h-14 rounded-2xl border-2 border-green-500/50 bg-green-500/10 overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Check className="w-5 h-5 text-green-400" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-green-300 font-semibold text-sm"
          >
            Neural Write-Access Authorized
          </motion.span>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={constraintsRef}
      className={`relative h-14 rounded-2xl border-2 border-red-500/30 overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Background progress */}
      <motion.div
        className="absolute inset-0"
        style={{ background }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: disabled
            ? "none"
            : [
                "0 0 20px rgba(239, 68, 68, 0.2)",
                "0 0 30px rgba(239, 68, 68, 0.4)",
                "0 0 20px rgba(239, 68, 68, 0.2)"
              ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity }}
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-400" />
          <span className="text-red-300 font-semibold text-sm tracking-wide uppercase">
            {text}
          </span>
        </div>
      </motion.div>

      {/* Slider button */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxWidth }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`absolute left-1 top-1 bottom-1 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 border border-red-400/50 shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <motion.div
          animate={{
            x: [0, 3, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            background: [
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)"
            ],
            x: [-100, 100]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
}