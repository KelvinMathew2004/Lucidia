import { Outlet } from "react-router";
import { useState } from "react";
import SpaceBackground from "./SpaceBackground";
import { AudioPlayerProvider } from "../shared/AudioPlayerContext";
import { ThemeProvider } from "../shared/ThemeContext";
import { TooltipProvider, GlobalTooltip } from "../shared/TooltipContext";
import { Headset, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AppLayout() {
  const [isArMode, setIsArMode] = useState(false);

  return (
    <ThemeProvider>
      <AudioPlayerProvider>
        <TooltipProvider>
          <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#0a0812] overflow-hidden p-0 lg:p-8 lg:pt-20 transition-colors duration-1000">
            
            {/* AR/VR Room Background */}
            <AnimatePresence>
              {isArMode && (
                <motion.div 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 z-0"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1726695729873-42ed00980867?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwbmlnaHQlMjBkYXJrfGVufDF8fHx8MTc3MzAwMTQwNHww&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral")' }}
                  />
                  {/* Dark overlay to ensure tablet is the focal point */}
                  <div className="absolute inset-0 bg-black/60" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wrapper to attach the floating button to the tablet's bounds */}
            <div className="relative z-10 w-full lg:max-w-[1280px]">
              {/* AR Toggle Button (Floating just outside top-right corner) */}
              <button
                onClick={() => setIsArMode(!isArMode)}
                className="absolute -top-6 -right-6 lg:-top-6 lg:-right-6 z-50 flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 group"
                title={isArMode ? "Switch to Screen Mode" : "Switch to AR/VR Headset Mode"}
              >
                {isArMode ? (
                  <Monitor className="w-6 h-6 text-indigo-100 group-hover:text-white drop-shadow-md" />
                ) : (
                  <Headset className="w-6 h-6 text-indigo-100 group-hover:text-white drop-shadow-md" />
                )}
              </button>

              {/* Tablet Device Container - Landscape orientation like Nest Hub/Echo Show */}
              <div
                id="app-root-container"
                className={`relative w-full h-[100dvh] lg:h-[720px] lg:max-w-[1280px] lg:rounded-[3rem] overflow-hidden text-slate-50 font-sans selection:bg-indigo-500/30 shadow-2xl lg:ring-1 lg:ring-white/10 transition-all duration-1000 isolate ${
                  isArMode 
                    ? "bg-[rgba(17,13,31,0.4)] backdrop-blur-2xl shadow-[0_0_150px_rgba(79,70,229,0.3)] lg:ring-white/30" 
                    : "bg-[#110d1f] shadow-[0_0_100px_rgba(79,70,229,0.15)]"
                }`}
                style={{ aspectRatio: '16/9' }}
              >
                <SpaceBackground isTransparent={isArMode} />
              
              {/* Overlay to ensure text readability */}
              <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
                isArMode ? "bg-black/10" : "bg-black/20"
              }`} />
              
              {isArMode && (
                <style dangerouslySetInnerHTML={{ __html: `
                  #app-root-container [class*="bg-[#110d1f]"],
                  #app-root-container [class*="bg-[#f8f9fc]"] {
                    background-color: transparent !important;
                  }
                  #app-root-container [class*="bg-[#110d1f]/60"],
                  #app-root-container [class*="bg-[#F4F2FA]/60"] {
                    background-color: rgba(17, 13, 31, 0.4) !important;
                    backdrop-filter: blur(12px) !important;
                  }
                  #app-root-container [style*="background-color: #110d1f"],
                  #app-root-container [style*="background-color: rgb(17, 13, 31)"],
                  #app-root-container [style*="background-color: #f8f9fc"],
                  #app-root-container [style*="background-color: rgb(248, 249, 252)"] {
                    background-color: transparent !important;
                  }
                  #app-root-container .backdrop-blur-xl,
                  #app-root-container .backdrop-blur-2xl,
                  #app-root-container .backdrop-blur-3xl {
                    background-color: rgba(17, 13, 31, 0.3) !important;
                  }
                `}} />
              )}
              
              {/* Main Content Area */}
              <main className="relative z-10 w-full h-full overflow-hidden flex flex-col">
                <Outlet />
              </main>

              <GlobalTooltip />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </AudioPlayerProvider>
  </ThemeProvider>
);
}