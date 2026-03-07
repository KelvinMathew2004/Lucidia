import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "./ThemeContext";

export default function TopNav({ 
  title = "Sleep Statistic", 
  onBack,
  rightAction
}: { 
  title?: string; 
  onBack?: () => void;
  rightAction?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <header className="flex items-center justify-between z-20 py-2 relative">
      <button
        onClick={onBack || (() => navigate("/home"))}
        className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 active:bg-white/20 text-slate-300' : 'hover:bg-slate-100 active:bg-slate-200 text-slate-700'}`}
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
      </button>
      <span className={`text-base font-semibold tracking-wide absolute left-1/2 -translate-x-1/2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
        {title}
      </span>
      <div className="flex items-center justify-end shrink-0">
        {rightAction}
      </div>
    </header>
  );
}