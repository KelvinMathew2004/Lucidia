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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        loader: () => {
          const onboarded = localStorage.getItem("dreamSync_onboarded") === "true";
          if (!onboarded) return redirect("/welcome");
          const setupComplete = localStorage.getItem("lucidia_setupComplete") === "true";
          if (!setupComplete) return redirect("/setup");
          return redirect("/home");
        },
      },
      { path: "welcome", Component: WelcomeScreen },
      { path: "home", Component: HomeScreen },
      { path: "sleep", Component: SleepDataScreen },
      { path: "dream-bank", Component: DreamBankScreen },
      { path: "sounds", Component: SoundLibraryScreen },
      { path: "breathing", Component: BreathingScreen },
      { path: "routine", Component: RoutineScreen },
      { path: "setup", Component: BciSetupScreen },
      { path: "stats", Component: StatsScreen },
    ],
  },
]);