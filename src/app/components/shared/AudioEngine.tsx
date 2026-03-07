/**
 * Procedural Audio Engine using Web Audio API
 * Generates ambient sounds without needing audio files
 */

type NoiseType = "white" | "pink" | "brown";

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeNodes: AudioNode[] = [];
let activeSourceId: string | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMasterGain(): GainNode {
  if (!masterGain) {
    const ctx = getContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

function stopAllNodes() {
  activeNodes.forEach((node) => {
    try {
      if (node instanceof AudioBufferSourceNode) node.stop();
      if (node instanceof OscillatorNode) node.stop();
      node.disconnect();
    } catch {
      // Already stopped
    }
  });
  activeNodes = [];
}

function createNoiseBuffer(ctx: AudioContext, type: NoiseType, durationSec = 4): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * durationSec;
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;

      if (type === "white") {
        data[i] = white * 0.5;
      } else if (type === "pink") {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      } else {
        // Brown noise
        b0 += white * 0.02;
        b0 = Math.max(-1, Math.min(1, b0));
        data[i] = b0 * 0.5;
      }
    }
  }
  return buffer;
}

function playLoopingNoise(ctx: AudioContext, type: NoiseType, filterFreq?: number, filterType?: BiquadFilterType): AudioNode[] {
  const buffer = createNoiseBuffer(ctx, type);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const nodes: AudioNode[] = [source];

  let lastNode: AudioNode = source;

  if (filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = filterType || "lowpass";
    filter.frequency.value = filterFreq;
    filter.Q.value = 1;
    lastNode.connect(filter);
    lastNode = filter;
    nodes.push(filter);
  }

  lastNode.connect(getMasterGain());
  source.start();
  return nodes;
}

function playRainSound(ctx: AudioContext, intensity: number = 0.6) {
  // Rain = filtered noise + occasional "drops" via high-frequency bursts
  const noiseNodes = playLoopingNoise(ctx, "pink", 2000 * intensity + 800, "lowpass");

  // Add a subtle high-frequency layer for "drops"
  const dropBuffer = createNoiseBuffer(ctx, "white", 4);
  const dropSource = ctx.createBufferSource();
  dropSource.buffer = dropBuffer;
  dropSource.loop = true;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "bandpass";
  highpass.frequency.value = 4000;
  highpass.Q.value = 2;

  const dropGain = ctx.createGain();
  dropGain.gain.value = 0.08 * intensity;

  dropSource.connect(highpass);
  highpass.connect(dropGain);
  dropGain.connect(getMasterGain());
  dropSource.start();

  return [...noiseNodes, dropSource, highpass, dropGain];
}

function playOceanWaves(ctx: AudioContext) {
  // Brown noise modulated with an LFO for wave-like feel
  const buffer = createNoiseBuffer(ctx, "brown", 8);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;

  // LFO to modulate filter frequency for wave effect
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08; // Very slow wave

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 400;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  source.connect(filter);
  filter.connect(getMasterGain());
  source.start();
  lfo.start();

  return [source, filter, lfo, lfoGain];
}

function playBinauralBeat(ctx: AudioContext, baseFreq: number, beatFreq: number) {
  // Two slightly different frequency oscillators, one per ear
  const oscL = ctx.createOscillator();
  const oscR = ctx.createOscillator();
  oscL.type = "sine";
  oscR.type = "sine";
  oscL.frequency.value = baseFreq;
  oscR.frequency.value = baseFreq + beatFreq;

  const merger = ctx.createChannelMerger(2);
  const gainL = ctx.createGain();
  const gainR = ctx.createGain();
  gainL.gain.value = 0.3;
  gainR.gain.value = 0.3;

  oscL.connect(gainL);
  oscR.connect(gainR);
  gainL.connect(merger, 0, 0);
  gainR.connect(merger, 0, 1);
  merger.connect(getMasterGain());

  oscL.start();
  oscR.start();

  return [oscL, oscR, gainL, gainR, merger];
}

function playCampfire(ctx: AudioContext) {
  // Crackling = bursts of filtered white noise
  const nodes = playLoopingNoise(ctx, "brown", 400, "lowpass");

  // High-frequency crackle layer
  const crackle = createNoiseBuffer(ctx, "white", 4);
  const crackleSource = ctx.createBufferSource();
  crackleSource.buffer = crackle;
  crackleSource.loop = true;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3000;
  bp.Q.value = 5;

  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.04;

  // Modulate crackle volume for intermittent effect
  const lfo = ctx.createOscillator();
  lfo.type = "sawtooth";
  lfo.frequency.value = 3;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.03;
  lfo.connect(lfoGain);
  lfoGain.connect(crackleGain.gain);

  crackleSource.connect(bp);
  bp.connect(crackleGain);
  crackleGain.connect(getMasterGain());
  crackleSource.start();
  lfo.start();

  return [...nodes, crackleSource, bp, crackleGain, lfo, lfoGain];
}

function playAmbientDrone(ctx: AudioContext, baseFreq: number = 55) {
  const nodes: AudioNode[] = [];

  // Multiple detuned oscillators for a rich pad
  [0, 5, -3, 12].forEach((detune) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = baseFreq;
    osc.detune.value = detune;

    const gain = ctx.createGain();
    gain.gain.value = 0.12;

    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start();
    nodes.push(osc, gain);
  });

  // Add a gentle pink noise bed
  const noiseNodes = playLoopingNoise(ctx, "pink", 300, "lowpass");

  // Reduce noise volume
  const lastFilter = noiseNodes[noiseNodes.length - 1];
  if (lastFilter) {
    // reconnect through a quiet gain
    lastFilter.disconnect();
    const quietGain = ctx.createGain();
    quietGain.gain.value = 0.15;
    lastFilter.connect(quietGain);
    quietGain.connect(getMasterGain());
    nodes.push(quietGain);
  }

  return [...nodes, ...noiseNodes];
}

function playWindSound(ctx: AudioContext) {
  const buffer = createNoiseBuffer(ctx, "pink", 6);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 400;
  filter.Q.value = 0.5;

  // Slow modulation for gusting effect
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const volGain = ctx.createGain();
  volGain.gain.value = 0.6;

  source.connect(filter);
  filter.connect(volGain);
  volGain.connect(getMasterGain());
  source.start();
  lfo.start();

  return [source, filter, lfo, lfoGain, volGain];
}

// ---------- PUBLIC API ----------

const SOUND_MAP: Record<string, () => AudioNode[]> = {};

function buildSoundMap() {
  const ctx = getContext();
  return {
    // Rain variants
    "rain-1": () => playRainSound(ctx, 0.3),
    "rain-2": () => playRainSound(ctx, 0.6),
    "rain-3": () => playRainSound(ctx, 1.0),
    "rain-4": () => playRainSound(ctx, 0.5),
    "rain-5": () => playRainSound(ctx, 0.4),
    "rain-6": () => playRainSound(ctx, 0.9),
    // Nature
    "nature-1": () => playOceanWaves(ctx),
    "nature-2": () => [...playLoopingNoise(ctx, "brown", 300, "lowpass"), ...playWindSound(ctx).map(n => { if (n instanceof GainNode) n.gain.value *= 0.3; return n; })],
    "nature-3": () => playCampfire(ctx),
    "nature-4": () => playOceanWaves(ctx), // river ≈ lighter ocean
    "nature-5": () => playWindSound(ctx),
    "nature-6": () => [...playLoopingNoise(ctx, "pink", 1800, "bandpass")],
    // White Noise
    "white-1": () => playLoopingNoise(ctx, "white"),
    "white-2": () => playLoopingNoise(ctx, "pink"),
    "white-3": () => playLoopingNoise(ctx, "brown"),
    "white-4": () => playLoopingNoise(ctx, "brown", 800, "lowpass"),
    // Binaural
    "bin-1": () => playBinauralBeat(ctx, 200, 2),    // Delta
    "bin-2": () => playBinauralBeat(ctx, 200, 6),    // Theta
    "bin-3": () => playBinauralBeat(ctx, 200, 10),   // Alpha
    "bin-4": () => playBinauralBeat(ctx, 216, 0),     // 432Hz
    // Ambient
    "amb-1": () => playAmbientDrone(ctx, 55),
    "amb-2": () => playAmbientDrone(ctx, 110),
    "amb-3": () => playAmbientDrone(ctx, 82.4),
    "amb-4": () => playAmbientDrone(ctx, 65.4),
  };
}

export function enginePlay(trackId: string) {
  stopAllNodes();
  const ctx = getContext();
  const map = buildSoundMap();
  const generator = map[trackId];
  if (generator) {
    activeNodes = generator();
    activeSourceId = trackId;
  } else {
    // Fallback: pink noise
    activeNodes = playLoopingNoise(ctx, "pink", 1000, "lowpass");
    activeSourceId = trackId;
  }
}

export function engineStop() {
  stopAllNodes();
  activeSourceId = null;
}

export function enginePause() {
  if (audioCtx && audioCtx.state === "running") {
    audioCtx.suspend();
  }
}

export function engineResume() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function engineSetVolume(vol: number) {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, vol));
  }
}

export function engineGetActiveId() {
  return activeSourceId;
}
