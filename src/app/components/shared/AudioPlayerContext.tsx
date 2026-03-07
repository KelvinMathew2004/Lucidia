import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type SoundTrack = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  color: string;
  duration?: string;
};

type AudioPlayerContextType = {
  currentTrack: SoundTrack | null;
  isPlaying: boolean;
  sleepTimer: number | null; // minutes remaining
  volume: number;
  play: (track: SoundTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setSleepTimer: (minutes: number | null) => void;
  setVolume: (vol: number) => void;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sleepTimer, setSleepTimerState] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMinimized, setIsMinimized] = useState(true);

  const play = useCallback((track: SoundTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setIsMinimized(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(true), []);
  const stop = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setSleepTimerState(null);
  }, []);

  const setSleepTimer = useCallback((minutes: number | null) => {
    setSleepTimerState(minutes);
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack, isPlaying, sleepTimer, volume,
      play, pause, resume, stop, setSleepTimer, setVolume,
      isMinimized, setIsMinimized
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return context;
}
