import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeContext";

export type TooltipVariant = 'default' | 'compact' | 'mini';

interface TooltipData {
  isOpen: boolean;
  content: string;
  rect: DOMRect | null;
  variant: TooltipVariant;
}

interface TooltipContextType {
  tooltip: TooltipData;
  openTooltip: (content: string, rect: DOMRect, variant?: TooltipVariant) => void;
  closeTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipData>({
    isOpen: false,
    content: "",
    rect: null,
    variant: 'default',
  });

  const openTooltip = (content: string, rect: DOMRect, variant: TooltipVariant = 'default') => {
    setTooltip({ isOpen: true, content, rect, variant });
  };

  const closeTooltip = () => {
    setTooltip((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <TooltipContext.Provider value={{ tooltip, openTooltip, closeTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
}

export function GlobalTooltip() {
  const { tooltip, closeTooltip } = useTooltip();
  const { isDark } = useTheme();
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [direction, setDirection] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    if (!tooltip.isOpen) return;

    const handleScroll = () => {
      closeTooltip();
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const el = document.getElementById('global-tooltip');
      // If clicking inside the tooltip container itself, don't close
      if (el && el.contains(target)) return;
      closeTooltip();
    };

    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousedown', handleClick, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousedown', handleClick, true);
    };
  }, [tooltip.isOpen, closeTooltip]);

  useEffect(() => {
    if (tooltip.isOpen && tooltip.rect) {
      const containerEl = document.getElementById("app-root-container");
      if (!containerEl) return;

      const containerRect = containerEl.getBoundingClientRect();
      const rect = tooltip.rect;

      const tooltipWidth = tooltip.variant === 'mini' ? 152 : tooltip.variant === 'compact' ? 192 : 256;
      const margin = 12;

      // Container-relative button coords
      const btnTop = rect.top - containerRect.top;
      const btnBottom = rect.bottom - containerRect.top;
      const btnLeft = rect.left - containerRect.left;

      const spaceBelow = containerRect.height - btnBottom;
      const spaceAbove = btnTop;
      
      const tooltipHeightEstimate = 100;
      let dir: 'bottom' | 'top' = 'bottom';
      
      if (spaceBelow < tooltipHeightEstimate && spaceAbove > spaceBelow) {
        dir = 'top';
      }

      // Center horizontally on button
      const btnCenter = btnLeft + (rect.width / 2);
      let left = btnCenter - (tooltipWidth / 2);

      // Clamp left
      left = Math.max(margin, left);
      if (left + tooltipWidth > containerRect.width - margin) {
        left = containerRect.width - margin - tooltipWidth;
      }

      setDirection(dir);
      setStyle({
        position: 'absolute',
        [dir === 'bottom' ? 'top' : 'bottom']: dir === 'bottom' ? btnBottom + 8 : containerRect.height - btnTop + 8,
        left,
        width: tooltipWidth,
        zIndex: 100000,
      });
    }
  }, [tooltip]);

  return (
    <AnimatePresence>
      {tooltip.isOpen && (
        <motion.div
          id="global-tooltip"
          initial={{ opacity: 0, y: direction === 'bottom' ? -8 : 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: direction === 'bottom' ? -8 : 8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={style}
          className="pointer-events-auto"
        >
          <div
            className={`rounded-2xl p-4 border shadow-2xl ${
              isDark
                ? "border-white/25"
                : "border-slate-200 shadow-slate-200/60"
            }`}
            style={{
              background: isDark ? "#1c1530" : "#ffffff",
              boxShadow: isDark
                ? "0 24px 48px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12)"
                : "0 24px 48px -8px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          >
            <p
              className={`text-xs leading-relaxed ${
                isDark ? "text-white font-semibold" : "text-slate-900 font-semibold"
              }`}
            >
              {tooltip.content}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
