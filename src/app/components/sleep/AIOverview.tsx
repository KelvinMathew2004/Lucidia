import { motion } from "motion/react";
import { useState, useMemo } from "react";
import { Sparkles, Brain, Quote, RefreshCw, Activity, ShieldAlert, HeartPulse } from "lucide-react";
import { useTheme } from "../shared/ThemeContext";
import InfoTooltip from "../shared/InfoTooltip";

const DREAMS = [
  {
    theme: "Surreal Architecture",
    cycle: "Late REM",
    quote: "I was navigating through an intricate, neon-lit library searching for an old friend who eventually turned into a flock of geometric birds.",
    analysis: "This dream indicates a brain highly engaged in creative problem-solving. The 'geometric birds' suggest you are trying to organize chaotic thoughts into structured patterns.",
    healthImpact: "High cognitive activity during REM. Excellent for memory consolidation, though you might feel slightly mentally fatigued upon waking.",
    recommendation: "Engage in a 10-minute grounding meditation this morning to transition from abstract thought to reality.",
    coherence: 85,
    anxiety: 30,
    lucidity: 60,
    people: ["Old Friend", "Self"],
    symbols: ["Library", "Neon Lights", "Geometric Birds"],
    emotions: ["Curiosity", "Nostalgia", "Wonder"],
    relationshipAdvice: "Your mind is trying to reconnect with someone from your past. Reach out to an old friend today, even if it's just a quick message.",
    dailyContext: "You spent 2 hours looking at old college photos yesterday and passed by a modern art museum."
  },
  {
    theme: "Anxiety & Chase",
    cycle: "Mid REM",
    quote: "Running up an endless spiral staircase. Every time I looked back, a shadow with my own voice was telling me I forgot my passport.",
    analysis: "A classic manifestation of performance anxiety and unresolved daytime stress. The 'own voice' element shows internal self-criticism rather than external fear.",
    healthImpact: "Slightly elevated cortisol levels detected during this phase. May lead to muscle tension in the jaw (bruxism) and shoulders.",
    recommendation: "Consider a hot shower and light stretching tonight before bed. Avoid looking at your schedule past 8 PM.",
    coherence: 90,
    anxiety: 85,
    lucidity: 20,
    people: ["Shadow", "Self"],
    symbols: ["Spiral Staircase", "Passport", "Chasing"],
    emotions: ["Fear", "Urgency", "Panic"],
    relationshipAdvice: "Your internal self-criticism might be projecting onto your partner. Be gentle with yourself today so you can be patient with them.",
    dailyContext: "You had a stressful meeting at work where you felt unprepared, and later watched a thriller movie."
  },
  {
    theme: "Passionate Connection",
    cycle: "Deep REM",
    quote: "A warm sunset on a secluded beach. I felt an intense, overwhelming physical and emotional connection with a faceless stranger. Complete safety.",
    analysis: "Your mind is processing a deep desire for intimacy and emotional security. The 'facelessness' means it's about the *feeling* of connection, not a specific person.",
    healthImpact: "Highly restorative. Heart rate variability (HRV) was optimal during this dream, releasing oxytocin and reducing baseline stress.",
    recommendation: "Carry this positive emotional state into your day. Reach out to a loved one or partner to materialize this feeling.",
    coherence: 75,
    anxiety: 10,
    lucidity: 40,
    people: ["Faceless Stranger"],
    symbols: ["Sunset", "Beach", "Warmth"],
    emotions: ["Love", "Safety", "Desire"],
    relationshipAdvice: "You are craving deep emotional vulnerability. Plan an uninterrupted, screen-free evening with your partner to foster this connection."
  },
  {
    theme: "Mundane Frustration",
    cycle: "Early REM",
    quote: "I was trying to pack a suitcase, but every time I put a shirt in, it would fly back out. I was terrified of missing a flight that didn't exist.",
    analysis: "This reflects a feeling of lack of control in your waking life. Repetitive, failing tasks in dreams usually correlate to overwhelmed task-management.",
    healthImpact: "Interrupted your transition into deep sleep. Heart rate spiked to 75bpm, causing mild physical restlessness.",
    recommendation: "Brain-dump your to-do list onto paper before going to sleep tonight to signal to your brain that tasks are 'stored'.",
    coherence: 95,
    anxiety: 60,
    lucidity: 15,
    people: ["Self"],
    symbols: ["Suitcase", "Shirts", "Airport"],
    emotions: ["Frustration", "Helplessness", "Stress"],
    relationshipAdvice: "You feel like you're carrying the mental load. Ask your partner to share some of the household or logistical responsibilities today."
  },
  {
    theme: "Aquatic Flight",
    cycle: "Deep Sleep / REM edge",
    quote: "Flying over a crystal-clear ocean, then suddenly diving in. I realized I could breathe underwater and swam among glowing, bioluminescent coral reefs.",
    analysis: "A lucid-adjacent dream showing high emotional adaptability. Water represents emotion, and breathing underwater shows you are comfortably handling current life changes.",
    healthImpact: "Profoundly restorative. Your breathing rate synchronized perfectly, indicating deep physical and mental relaxation.",
    recommendation: "Your nervous system is in a great state. Use this high-energy day for creative work or intense physical exercise.",
    coherence: 60,
    anxiety: 5,
    lucidity: 90,
    people: ["Self"],
    symbols: ["Ocean", "Flying", "Coral Reefs"],
    emotions: ["Freedom", "Peace", "Awe"],
    relationshipAdvice: "You have the emotional capacity to handle deep topics today. If there's an issue you've been avoiding, now is a safe time to discuss it."
  },
  {
    theme: "Nostalgic Echo",
    cycle: "Late REM",
    quote: "I was back in my childhood home, but the rooms were infinite. My childhood dog was there, looking young and healthy, leading me through the halls.",
    analysis: "Your brain is revisiting foundational memories to find comfort. The expanding rooms suggest you are integrating your past with your current growth.",
    healthImpact: "Very calming. Caused a significant drop in blood pressure and promoted excellent physical recovery during the latter half of the night.",
    recommendation: "Journaling about positive past memories today could further boost your baseline mood.",
    coherence: 80,
    anxiety: 15,
    lucidity: 30,
    people: ["Childhood Dog", "Family (implied)"],
    symbols: ["Childhood Home", "Hallways", "Expanding Rooms"],
    emotions: ["Nostalgia", "Comfort", "Warmth"],
    relationshipAdvice: "You are drawing on foundational security. Share a favorite childhood memory with your partner to build a stronger emotional bridge."
  },
  {
    theme: "Public Vulnerability",
    cycle: "Mid REM",
    quote: "I was pushed onto a grand theater stage. I didn't know the lines to the play, but the audience was cheering and throwing roses anyway.",
    analysis: "Imposter syndrome with a twist. You fear you aren't prepared, but your subconscious recognizes that you are accepted and valued by your peers regardless.",
    healthImpact: "Initial spike in heart rate followed by a massive release of tension. A mentally exhausting but emotionally resolving cycle.",
    recommendation: "You might wake up feeling emotionally tender. Take your time with your morning routine.",
    coherence: 85,
    anxiety: 70,
    lucidity: 25,
    people: ["Audience"],
    symbols: ["Stage", "Roses", "Scripts"],
    emotions: ["Vulnerability", "Surprise", "Relief"],
    relationshipAdvice: "You might be afraid of disappointing your partner, but they support you more than you realize. Open up about your insecurities."
  },
  {
    theme: "Abstract Void",
    cycle: "Deep REM",
    quote: "Floating in a void of pure color that changed based on my emotions. I felt completely dissolved, like I was interconnected with the entire universe.",
    analysis: "A rare ego-dissolution dream, often associated with deep meditative states or significant personal breakthroughs in waking life.",
    healthImpact: "Exceptional neurological reset. Brain wave patterns showed high theta activity, similar to deep meditation. Incredible for long-term brain health.",
    recommendation: "You are primed for high-level strategic thinking today. Trust your intuition.",
    coherence: 20,
    anxiety: 10,
    lucidity: 85,
    people: ["None"],
    symbols: ["Colors", "Void", "Floating"],
    emotions: ["Oneness", "Serenity", "Detachment"],
    relationshipAdvice: "You are operating on a high spiritual plane. Don't sweat the small stuff or minor annoyances in your relationship today."
  },
  {
    theme: "Claustrophobic Shift",
    cycle: "Early REM",
    quote: "Trapped in an elevator that suddenly started moving sideways like a train. The floor began filling with sand, and the buttons melted when I touched them.",
    analysis: "A feeling of being forced in a direction you didn't choose. The melting buttons show a perceived loss of agency in a current waking situation.",
    healthImpact: "High stress load detected. You likely tossed and turned physically during this phase, reducing the quality of your physical recovery.",
    recommendation: "Identify one small thing you can control today and execute it perfectly to regain a sense of agency.",
    coherence: 95,
    anxiety: 90,
    lucidity: 10,
    people: ["Self"],
    symbols: ["Elevator", "Sand", "Melting Buttons"],
    emotions: ["Trap", "Panic", "Confusion"],
    relationshipAdvice: "You feel a lack of control, which might cause you to be overly controlling with your partner. Acknowledge this dynamic and let them lead."
  },
  {
    theme: "Gravity Defiance",
    cycle: "Late REM",
    quote: "I was running a marathon, but gravity turned off. I won the race simply by pushing off the ground and floating gracefully across the finish line.",
    analysis: "A triumph dream indicating overcoming a major obstacle. The lack of gravity shows that a problem you thought was heavy is actually easily manageable.",
    healthImpact: "Highly energizing. Hormonal balance optimized during this cycle, leading to a natural waking state without the need for an alarm.",
    recommendation: "Capitalize on this energy. Tackle your hardest tasks first thing this morning.",
    coherence: 70,
    anxiety: 20,
    lucidity: 65,
    people: ["Competitors"],
    symbols: ["Finish Line", "Zero Gravity", "Running"],
    emotions: ["Triumph", "Lightness", "Power"],
    relationshipAdvice: "You have the energy to lift your partner up today. Do an unexpected favor for them to share your momentum."
  }
];

export default function AIOverview() {
  const { isDark } = useTheme();
  // Select a random dream on mount
  const dream = useMemo(() => DREAMS[Math.floor(Math.random() * DREAMS.length)], []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#2D1B4E] to-[#1A0B2E] rounded-[2rem] p-6 text-white relative"
        style={{
          boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.05)' : '0 10px 25px -5px rgba(88,28,135,0.3), inset 0 2px 0 rgba(255,255,255,0.1)'
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300" />
            <h2 className="text-lg font-semibold tracking-tight text-white">AI Dream Synthesis</h2>
          </div>
          <InfoTooltip
            content="AI analyzes your dream patterns, emotional content, and sleep cycles to provide personalized insights and recommendations."
            iconClassName="text-purple-300 hover:text-white"
          />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex gap-4 items-start">
            <Quote className="w-6 h-6 text-purple-400/50 rotate-180 shrink-0 mt-1" fill="currentColor" />
            <p className="text-base font-medium leading-relaxed text-purple-50 italic">
              "{dream.quote}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <Brain className="w-5 h-5 text-purple-300 mb-2" />
              <div className="text-[10px] uppercase font-bold text-purple-300/70 mb-1">Theme</div>
              <div className="text-sm font-semibold text-white">{dream.theme}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <RefreshCw className="w-5 h-5 text-blue-300 mb-2" />
              <div className="text-[10px] uppercase font-bold text-blue-300/70 mb-1">Cycle</div>
              <div className="text-sm font-semibold text-white">{dream.cycle}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
              <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Coherence</div>
              <div className="text-sm font-semibold text-white">{dream.coherence}%</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
              <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Lucidity</div>
              <div className="text-sm font-semibold text-white">{dream.lucidity}%</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
              <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Anxiety</div>
              <div className="text-sm font-semibold text-white">{dream.anxiety}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`rounded-[2rem] p-6 border relative transition-colors ${isDark ? 'bg-zinc-900 border-white/5 text-slate-200' : 'bg-white border-slate-50 text-slate-600'}`}
        style={{
          boxShadow: isDark ? '0 8px 20px -4px rgba(0,0,0,0.3)' : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
            <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Psychological Analysis</h2>
          </div>
          <InfoTooltip
            content="Psychological analysis interprets the symbolic meaning of your dreams and their connection to your mental and emotional well-being."
            iconClassName={isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}
          />
        </div>
        <p className="text-sm leading-relaxed mb-4">
          {dream.analysis}
        </p>

        <div className={`space-y-3 mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Extracted Entities</span>
            <div className="flex flex-wrap gap-1.5">
              {dream.people.concat(dream.symbols).map((item, i) => (
                <span key={i} className={`text-[11px] font-medium px-2 py-1 rounded-md ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className={`rounded-[2rem] p-6 border relative transition-colors bg-gradient-to-br ${isDark ? 'from-indigo-900/20 to-transparent border-indigo-500/20 text-indigo-100' : 'from-indigo-50 to-white border-indigo-100 text-indigo-900'}`}
        style={{
          boxShadow: isDark ? '0 8px 20px -4px rgba(0,0,0,0.3)' : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
          <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-indigo-900'}`}>Personal & Relational Advice</h2>
        </div>
        <p className="text-sm leading-relaxed">
          {dream.relationshipAdvice}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.27 }}
        className={`rounded-[2rem] p-6 border relative transition-colors ${isDark ? 'bg-zinc-900 border-white/5 text-slate-300' : 'bg-white border-slate-50 text-slate-600'}`}
        style={{
          boxShadow: isDark ? '0 8px 20px -4px rgba(0,0,0,0.3)' : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
          <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>BCI Daily Experiences Context</h2>
        </div>
        <p className="text-sm leading-relaxed">
          {dream.dailyContext || "Neural records indicate exposure to highly stimulating visual environments and subtle unresolved conversational cues during your waking hours."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`rounded-[2rem] p-6 border relative transition-colors ${isDark ? 'bg-zinc-900 border-white/5 text-slate-300' : 'bg-white border-slate-50 text-slate-600'}`}
        style={{
          boxShadow: isDark ? '0 8px 20px -4px rgba(0,0,0,0.3)' : '0 8px 20px -4px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Health Impact</h2>
          </div>
          <InfoTooltip
            content="Health impact shows how your sleep patterns affect your physical well-being, including heart rate, cortisol levels, and recovery metrics."
            iconClassName={isDark ? 'text-slate-400 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}
          />
        </div>
        <p className="text-sm leading-relaxed mb-4">
          {dream.healthImpact}
        </p>
        
        <div className={`rounded-2xl p-4 border flex gap-3 ${isDark ? 'bg-rose-900/20 border-rose-900/50' : 'bg-rose-50 border-rose-100'}`}>
          <ShieldAlert className={`w-5 h-5 shrink-0 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
          <div>
            <div className={`text-xs font-bold uppercase mb-1 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>Recommendation</div>
            <div className={`text-sm font-medium leading-snug ${isDark ? 'text-rose-200' : 'text-rose-600/90'}`}>
              {dream.recommendation}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}