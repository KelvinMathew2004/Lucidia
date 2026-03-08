import { createBrowserRouter, redirect } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import HomeScreen from "./screens/HomeScreen";
import SleepDataScreen from "./screens/SleepDataScreen";
import DreamBankScreen from "./screens/DreamBankScreen";
import SoundLibraryScreen from "./screens/SoundLibraryScreen";
import BreathingScreen from "./screens/BreathingScreen";
import RoutineScreen from "./screens/RoutineScreen";
import BciSetupScreen from "./screens/BciSetupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import StatsScreen from "./screens/StatsScreen";
import SensoryTopologyScreen from "./screens/SensoryTopologyScreen";
import NeuralPlaybackScreen from "./screens/NeuralPlaybackScreen";
import SensoryOverrideScreen from "./screens/SensoryOverrideScreen";
import AdvancedAnalyticsScreen from "./screens/AdvancedAnalyticsScreen";
import RealityAnchoringScreen from "./screens/RealityAnchoringScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "welcome", Component: WelcomeScreen },
      { path: "home", Component: HomeScreen },
      { path: "sleep", Component: SleepDataScreen },
      { path: "dream-bank", Component: DreamBankScreen },
      { path: "sounds", Component: SoundLibraryScreen },
      { path: "breathing", Component: BreathingScreen },
      { path: "routine", Component: RoutineScreen },
      { path: "setup", Component: BciSetupScreen },
      { path: "stats", Component: StatsScreen },
      { path: "sensory-topology", Component: SensoryTopologyScreen },
      { path: "neural-playback", Component: NeuralPlaybackScreen },
      { path: "sensory-override", Component: SensoryOverrideScreen },
      { path: "advanced-analytics", Component: AdvancedAnalyticsScreen },
      { path: "reality-anchoring", Component: RealityAnchoringScreen },
      {
        index: true,
        loader: () => redirect("/welcome"),
      },
    ],
  },
]);