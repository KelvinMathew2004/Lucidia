import { Outlet } from "react-router";
import SpaceBackground from "./SpaceBackground";
import { AudioPlayerProvider } from "../shared/AudioPlayerContext";
import { ThemeProvider } from "../shared/ThemeContext";
import { TooltipProvider, GlobalTooltip } from "../shared/TooltipContext";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <AudioPlayerProvider>
        <TooltipProvider>
          <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#0a0812] sm:bg-[#0a0812] p-0 sm:p-8">
            {/* Mobile Device Container */}
            <div
              id="app-root-container"
              className="relative w-full h-[100dvh] sm:h-[852px] sm:max-w-[393px] sm:rounded-[3rem] overflow-hidden bg-[#110d1f] text-slate-50 font-sans selection:bg-indigo-500/30 shadow-2xl sm:ring-1 sm:ring-white/10 sm:shadow-[0_0_100px_rgba(79,70,229,0.15)] isolate transform-gpu">
              <SpaceBackground />
              
              {/* Overlay to ensure text readability */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
              
              {/* Main Content Area */}
              <main className="relative z-10 w-full h-full overflow-hidden flex flex-col">
                <Outlet />
              </main>

              <GlobalTooltip />
            </div>
          </div>
        </TooltipProvider>
      </AudioPlayerProvider>
    </ThemeProvider>
  );
}