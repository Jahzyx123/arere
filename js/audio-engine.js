/* ==========================================================================
   AUDIO ENGINE  (v2 — expanded)
   Pure Web Audio API synthesis (zero external audio files, zero dependencies)
   that renders short, original approximations of each sound in the library,
   plus a lookahead-scheduled 16-step groove transport so sounds can be heard
   layered against a beat.

   v2 additions:
     - snare, vocal (formant-ish) engines, plus many new perc / fx / texture
       types needed by the expanded sound library
     - per-sound reverb / delay / drive / pan / stereo-width helpers
     - a richer groove scheduler with swing, per-step velocity, and patterns
       tuned per category (off-beat hats, rolling 16th hats, gated pads, etc.)
     - better previews: chord/long sounds stay musical, noise sources reused

   These are synthesis sketches for reference, not reproductions of any
   copyrighted sample, patch, or recording.
   ========================================================================== */

class TechnoAudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.reverbBus = null;
    this.delayBus = null;
    this.noiseBuffer = null;
    this.pinkNoiseBuffer = null;
    this.brownNoiseBuffer = null;

    this.lookahead = 25.0;          // ms, scheduler tick
    this.scheduleAheadTime = 0.12;  // seconds, how far ahead we schedule audio
    this.grooveState = {
      playing: false, bpm: 128, swing: 0.0, step: 0, nextStepTime: 0,
      barCount: 0, layers: {}, pattern: 'four-on-floor'
    };
    this._grooveInterval = null;
    this.onStep = null; // UI hook: (step:number) => void
  }

  // ---------------------------------------------------------------- SETUP
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.85;

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 24;
    comp.ratio.value = 5;
    comp.attack.value = 0.003;
    comp.release.value = 0.22;
    this.master.connect(comp);

    // A small convolution "hall" used by any sound that asks for reverb.
    this.reverbBus = this.ctx.createConvolver();
    this.reverbBus.buffer = this._buildImpulse(2.4, 2.2);
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = 0.5;
    const reverbTone = this.ctx.createBiquadFilter();
    reverbTone.type = 'lowpass';
    reverbTone.frequency.value = 4500;
    this.reverbBus.connect(reverbTone);
    reverbTone.connect(reverbGain);
    reverbGain.connect(comp);
    this._reverbReturnGain = reverbGain;

    // A tempo-sync-ish dotted delay bus.
    this.delayBus = this.ctx.createDelay(2.0);
    this.delayBus.delayTime.value = 0.375;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.35;
    const delayTone = this.ctx.createBiquadFilter();
    delayTone.type = 'lowpass';
    delayTone.frequency.value = 3200;
    const delayOut = this.ctx.createGain();
    delayOut.gain.value = 0.4;
    this.delayBus.connect(delayTone);
    delayTone.connect(feedback);
    feedback.connect(this.delayBus);
    feedback.connect(delayOut);
    delayOut.connect(comp);

    comp.connect(this.ctx.destination);
    this._buildNoiseBuffers();
  }

  resume() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  _buildImpulse(duration, decay) {
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const t = i / length;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    return impulse;
  }

  _buildNoiseBuffers() {
    const len = this.ctx.sampleRate * 3;
    const whiteBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const wd = whiteBuf.getChannelData(0);
    for (let i = 0; i < len; i++) wd[i] = Math.random() * 2 - 1;
    this.noiseBuffer = whiteBuf;

    const pinkBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const pd = pinkBuf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.pinkNoiseBuffer = pinkBuf;

    const brownBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const bd = brownBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      bd[i] = last * 3.5;
    }
    this.brownNoiseBuffer = brownBuf;
  }

  _noiseSource(color) {
    const src = this.ctx.createBufferSource();
    src.buffer = color === 'pink' ? this.pinkNoiseBuffer
      : color === 'brown' ? this.brownNoiseBuffer
      : this.noiseBuffer;
    src.loop = true;
    src.loopEnd = src.buffer.duration;
    return src;
  }

  // A band-limited pulse wave of the given duty cycle (0..1), built from its
  // Fourier cosine series. Used for PWM-style leads.
  _pulseWave(width) {
    const d = Math.min(0.95, Math.max(0.02, width));
    const size = 512;
    const real = new Float32Array(size);
    const imag = new Float32Array(size);
    for (let k = 1; k < size / 2; k++) {
      real[k] = (2 / (Math.PI * k)) * Math.sin(Math.PI * k * d);
    }
    return this.ctx.createPeriodicWave(real, imag);
  }

  _makeDistortion(amount) {
    const ws = this.ctx.createWaveShaper();
    const k = Math.max(amount, 0.001) * 100;
    const n = 44100;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    ws.curve = curve;
    ws.oversample = '4x';
    return ws;
  }

  // Route a node through optional drive / reverb / delay / pan, then to `out`.
  _applyEffects(input, p, out) {
    let node = input;
    if (p.drive) {
      const dist = this._makeDistortion(p.drive);
      node.connect(dist);
      node = dist;
    }
    if (p.reverb) {
      const send = this.ctx.createGain();
      send.gain.value = Math.min(1, p.reverb) * 0.9;
      node.connect(send);
      send.connect(this.reverbBus);
    }
    if (p.delay) {
      const send = this.ctx.createGain();
      send.gain.value = Math.min(1, p.delay) * 0.7;
      node.connect(send);
      send.connect(this.delayBus);
    }
    let tail = node;
    if (p.pan !== undefined || p.width) {
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (panner) {
        panner.pan.value = p.pan || 0;
        node.connect(panner);
        tail = panner;
      }
    }
    tail.connect(out);
  }

  _gainAt(time, peak, attack, decay, destination, peakAt) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + (peakAt || attack || 0.003));
    if (decay) g.gain.exponentialRampToValueAtTime(0.001, time + (peakAt || attack || 0.003) + decay);
    g.connect(destination);
    return g;
  }

  // ----------------------------------------------------------------- KICK
  kick(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const startFreq = p.startFreq || 160, endFreq = p.endFreq || 48;
    const ampDecay = p.ampDecay || 0.3;

    const osc = ctx.createOscillator();
    osc.type = p.waveform || 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 20), time + (p.pitchDecay || 0.05));

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(1, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + ampDecay);

    let body = osc;
    if (p.drive) {
      const dist = this._makeDistortion(p.drive);
      osc.connect(dist);
      body = dist;
    }
    body.connect(gain);

    let afterGain = gain;
    if (p.tone) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = p.tone;
      gain.connect(lp);
      afterGain = lp;
    }
    afterGain.connect(out);

    osc.start(time); osc.stop(time + ampDecay + 0.05);

    if (p.click) {
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(p.click * 0.7, time);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
      const src = this._noiseSource('white');
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 2000;
      src.connect(hp); hp.connect(clickGain); clickGain.connect(out);
      src.start(time); src.stop(time + 0.02);
    }

    if (p.sub) {
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine'; subOsc.frequency.setValueAtTime(endFreq, time);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.0001, time);
      subGain.gain.exponentialRampToValueAtTime(p.sub, time + 0.01);
      subGain.gain.exponentialRampToValueAtTime(0.001, time + ampDecay * 1.4);
      subOsc.connect(subGain); subGain.connect(out);
      subOsc.start(time); subOsc.stop(time + ampDecay * 1.4 + 0.05);
    }
    return ampDecay + 0.1;
  }

  // ------------------------------------------------------------ HAT/CYMBAL
  hat(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const decay = p.decay || 0.08;
    const src = this._noiseSource(p.noiseType || 'white');
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = (p.filterFreq || 8000) * 0.55;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = p.filterFreq || 8000; bp.Q.value = p.filterQ || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(p.velocity ? p.velocity * 0.8 : 0.75, time + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, time + decay);
    src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(out);
    src.start(time); src.stop(time + decay + 0.05);

    if (p.metallic || p.bell) {
      const ratios = p.bell ? [1, 2.76, 4.07, 5.4] : [1, 1.41, 2.3, 3.7, 5.1];
      const base = (p.filterFreq || 8000) / (p.bell ? 4 : 3);
      ratios.forEach((r, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine'; o.frequency.value = base * r;
        const og = ctx.createGain();
        og.gain.setValueAtTime((p.bell ? 0.22 : 0.14) / (i + 1), time);
        og.gain.exponentialRampToValueAtTime(0.001, time + decay * 0.85);
        o.connect(og); og.connect(out);
        o.start(time); o.stop(time + decay * 0.85 + 0.05);
      });
    }
    if (p.reverb) this._applyEffects(g, p, out);
    return decay + 0.1;
  }

  // --------------------------------------------------------------- SNARE
  snare(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const decay = p.decay || 0.2;

    // tonal body (two detuned triangles for "snare wires/body")
    [0, -0.3].forEach((det, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.setValueAtTime((p.tone || 185) * (1 + det), time);
      o.frequency.exponentialRampToValueAtTime((p.tone || 185) * 0.6 * (1 + det), time + decay);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.34 - i * 0.1, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + decay * 0.8);
      o.connect(g);
      if (p.drive) {
        const d = this._makeDistortion(p.drive);
        g.connect(d); d.connect(out);
      } else g.connect(out);
      o.start(time); o.stop(time + decay + 0.05);
    });

    // noise snap
    const src = this._noiseSource('white');
    const bp = ctx.createBiquadFilter();
    bp.type = p.toneFilter ? 'bandpass' : 'highpass';
    bp.frequency.value = p.toneFilter || 1800;
    bp.Q.value = p.toneFilter ? 2 : 0.7;
    const ng = ctx.createGain();
    const snap = p.snap === undefined ? 0.6 : p.snap;
    ng.gain.setValueAtTime(0.0001, time);
    ng.gain.exponentialRampToValueAtTime(0.5 + (p.noise || 0.6) * 0.4, time + 0.004);
    ng.gain.exponentialRampToValueAtTime(0.001, time + decay);
    src.connect(bp); bp.connect(ng);
    if (p.drive) {
      const d = this._makeDistortion(p.drive * 0.7);
      ng.connect(d); d.connect(out);
    } else ng.connect(out);
    src.start(time); src.stop(time + decay + 0.05);

    if (p.clap) {
      for (let i = 0; i < 4; i++) {
        const t = time + i * 0.008;
        const cs = this._noiseSource('white');
        const cf = ctx.createBiquadFilter();
        cf.type = 'bandpass'; cf.frequency.value = 1500; cf.Q.value = 3;
        const cg = ctx.createGain();
        cg.gain.setValueAtTime(0.25, t);
        cg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        cs.connect(cf); cf.connect(cg); cg.connect(out);
        cs.start(t); cs.stop(t + 0.05);
      }
    }
    if (p.reverb) this._applyEffects(ng, p, out);
    return decay + 0.15;
  }

  // ----------------------------------------------------------- PERCUSSION
  perc(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const decay = p.decay || 0.15;
    switch (p.type) {
      case 'clap': {
        const count = Math.min(p.bursts || 4, 6);
        for (let i = 0; i < count; i++) {
          const t = time + i * 0.011;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = p.filterFreq || 1500; bp.Q.value = 3;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.55, t + 0.003);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.045);
        }
        const tailT = time + count * 0.011 + 0.02;
        const tailSrc = this._noiseSource('white');
        const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = (p.filterFreq || 1500) * 0.9; bp2.Q.value = 1.4;
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.0001, tailT);
        g2.gain.exponentialRampToValueAtTime(0.4, tailT + 0.005);
        g2.gain.exponentialRampToValueAtTime(0.001, tailT + decay);
        tailSrc.connect(bp2); bp2.connect(g2);
        if (p.reverb) { g2.connect(this.reverbBus); }
        g2.connect(out);
        tailSrc.start(tailT); tailSrc.stop(tailT + decay + 0.05);
        return decay + 0.2;
      }
      case 'rim': {
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = p.filterFreq || 2200; bp.Q.value = 4;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.5, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + decay + 0.03);

        const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = p.pitch || 900;
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.3, time);
        og.gain.exponentialRampToValueAtTime(0.001, time + decay * 0.7);
        o.connect(og); og.connect(out);
        o.start(time); o.stop(time + decay + 0.02);
        return decay + 0.1;
      }
      case 'tom': {
        const o = ctx.createOscillator(); o.type = 'triangle';
        const startF = (p.pitch || 220) * 1.6;
        o.frequency.setValueAtTime(startF, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 220, time + 0.05);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'metal': {
        const ratios = [1, 1.6, 2.45, 3.9, 5.2];
        const base = p.pitch || 500;
        ratios.forEach((r, i) => {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * r;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.22 / (i * 0.7 + 1), time);
          g.gain.exponentialRampToValueAtTime(0.001, time + decay * (1 - i * 0.1));
          o.connect(g); g.connect(out);
          o.start(time); o.stop(time + decay + 0.1);
        });
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.filterFreq || 3000;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.28, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
        src.connect(hp); hp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.03);
        return decay + 0.15;
      }
      case 'wood': {
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = p.filterFreq || 2800; bp.Q.value = 8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + decay + 0.02);

        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = p.pitch || 1500;
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.2, time);
        og.gain.exponentialRampToValueAtTime(0.001, time + decay * 0.6);
        o.connect(og); og.connect(out);
        o.start(time); o.stop(time + decay + 0.02);
        return decay + 0.1;
      }
      case 'blip': {
        const o = ctx.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime((p.pitch || 1100) * 1.5, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 1100, time + 0.02);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.filterFreq || 5000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.4, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.02);
        return decay + 0.1;
      }
      case 'cowbell': {
        // classic two-square cowbell
        const freqs = [p.pitch || 800, (p.pitch || 800) * 1.41];
        freqs.forEach((f, i) => {
          const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.25, time);
          g.gain.exponentialRampToValueAtTime(0.001, time + decay);
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = (p.filterFreq || 3500) * (i ? 1.2 : 1); bp.Q.value = 4;
          o.connect(bp); bp.connect(g); g.connect(out);
          o.start(time); o.stop(time + decay + 0.02);
        });
        return decay + 0.1;
      }
      case 'tambourine': {
        const jingles = [1, 1.5, 2.2, 3.1];
        jingles.forEach((r, i) => {
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = (p.pitch || 2400) * r;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.14 / (i + 1), time);
          g.gain.exponentialRampToValueAtTime(0.001, time + decay);
          o.connect(g); g.connect(out);
          o.start(time); o.stop(time + decay + 0.05);
        });
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.filterFreq || 9000;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.22, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + decay * 0.7);
        src.connect(hp); hp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'scrape': {
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.setValueAtTime((p.pitch || 500) * 0.6, time);
        bp.frequency.exponentialRampToValueAtTime((p.filterFreq || 4000), time + decay);
        bp.Q.value = 8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.5, time + decay * 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        const d = this._makeDistortion(0.6);
        src.connect(bp); bp.connect(d); d.connect(g); g.connect(out);
        src.start(time); src.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'djembe': {
        const o = ctx.createOscillator(); o.type = 'triangle';
        o.frequency.setValueAtTime((p.pitch || 300) * 1.5, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 300, time + 0.04);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.filterFreq || 2000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        // slap noise
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.25, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        o.connect(f); f.connect(g); g.connect(out);
        src.connect(hp); hp.connect(ng); ng.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        src.start(time); src.stop(time + 0.04);
        return decay + 0.1;
      }
      case 'zap': {
        const o = ctx.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime((p.pitch || 1400) * 2.2, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 1400, time + 0.04);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.filterFreq || 6000; f.Q.value = 8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.45, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.02);
        return decay + 0.1;
      }
      case 'shaker': {
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.value = p.filterFreq || 8000; bp.Q.value = 2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.4, time + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + decay + 0.03);
        return decay + 0.08;
      }
      case 'guiro': {
        // long scraped noise with a moving bandpass (the "rack-tat" of a guiro)
        const strokes = p.strokes || 3;
        const strokeDur = decay / strokes;
        for (let i = 0; i < strokes; i++) {
          const t = time + i * strokeDur;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 8;
          bp.frequency.setValueAtTime(p.pitch || 1800, t);
          bp.frequency.linearRampToValueAtTime((p.pitch || 1800) * 2.4, t + strokeDur * 0.8);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.35, t + 0.004);
          g.gain.exponentialRampToValueAtTime(0.001, t + strokeDur * 0.9);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + strokeDur + 0.02);
        }
        return decay + 0.1;
      }
      case 'cabasa': {
        // dense metallic beads shaking — many short high-Q bursts
        const shakes = 10;
        for (let i = 0; i < shakes; i++) {
          const t = time + (i / shakes) * decay;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
          bp.frequency.value = (p.pitch || 6000) * (0.7 + Math.random() * 0.6); bp.Q.value = 12;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.3, t + 0.002);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.05);
        }
        return decay + 0.1;
      }
      case 'tabla': {
        // pitched Indian drum: a sine/triangle with a quick pitch drop + a "na" click
        const o = ctx.createOscillator(); o.type = 'triangle';
        o.frequency.setValueAtTime((p.pitch || 220) * 1.25, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 220, time + 0.04);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.filterFreq || 2600;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        const src = this._noiseSource('pink');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.2, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        src.connect(hp); hp.connect(ng); ng.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        src.start(time); src.stop(time + 0.04);
        return decay + 0.1;
      }
      case 'cuica': {
        // Brazilian friction drum — a rising-then-falling pitched "yelp"
        const o = ctx.createOscillator(); o.type = 'triangle';
        const peak = (p.pitch || 320) * 1.8;
        o.frequency.setValueAtTime(p.pitch || 320, time);
        o.frequency.linearRampToValueAtTime(peak, time + decay * 0.4);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 320, time + decay);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 4;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(0.5, time + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'castanet': {
        // very short high wooden clack — two near-simultaneous clicks
        for (let i = 0; i < 2; i++) {
          const t = time + i * 0.012;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
          bp.frequency.value = (p.pitch || 2200) * (i ? 1.1 : 1); bp.Q.value = 14;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.7, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.03);
        }
        return 0.12;
      }
      case 'eclap': {
        // electronic/clap-along: a tight synthesized clap without noise bursts
        const o = ctx.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime(p.pitch || 1200, time);
        o.frequency.exponentialRampToValueAtTime((p.pitch || 1200) * 0.5, time + 0.06);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = p.filterFreq || 1800; f.Q.value = 6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.5, time + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + 0.22);
        return 0.25;
      }
      case 'talking': {
        // talking-drum-ish: a pitched bend with resonant vowel-like filtering
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime((p.pitch || 180) * 0.8, time);
        o.frequency.linearRampToValueAtTime((p.pitch || 180) * 1.4, time + decay * 0.5);
        o.frequency.linearRampToValueAtTime(p.pitch || 180, time + decay);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass';
        f.frequency.setValueAtTime(800, time);
        f.frequency.linearRampToValueAtTime(1500, time + decay * 0.5);
        f.frequency.linearRampToValueAtTime(900, time + decay);
        f.Q.value = 8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(0.5, time + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'stick': {
        // crossed drumsticks — two hard wooden clicks at different pitches
        [0, 0.03].forEach((off, i) => {
          const t = time + off;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
          bp.frequency.value = (p.pitch || 2600) * (i ? 1.25 : 1); bp.Q.value = 16;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.6, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.04);
        });
        return 0.15;
      }
      case 'agogo': {
        // two-tone agogo bell — high then low wooden-bell ping
        [1, 0.72].forEach((mult, i) => {
          const t = time + i * 0.07;
          const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = (p.pitch || 900) * mult;
          const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = (p.pitch || 900) * mult * 2; f.Q.value = 6;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.3, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          o.connect(f); f.connect(g); g.connect(out);
          o.start(t); o.stop(t + 0.22);
        });
        return 0.35;
      }
      case 'kick-perc': {
        // electronic 808-ish tom / percussive kick used as tonal percussion
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime((p.pitch || 180) * 1.4, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 180, time + 0.05);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'claves': {
        // two resonant high wooden clicks a few ms apart
        [0, 0.018].forEach((off, i) => {
          const t = time + off;
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = (p.pitch || 2500) * (i ? 1.06 : 1);
          const f = ctx.createBiquadFilter(); f.type = 'bandpass';
          f.frequency.value = (p.pitch || 2500) * 1.1; f.Q.value = 30;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.5, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          o.connect(f); f.connect(g); g.connect(out);
          o.start(t); o.stop(t + 0.06);
        });
        return 0.15;
      }
      case 'triangle': {
        // a single struck metal triangle — bright inharmonic ping with long ring
        const ratios = [1, 2.1, 3.3, 5.2];
        ratios.forEach((r, i) => {
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = (p.pitch || 1800) * r;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.22 / (i + 1), time);
          g.gain.exponentialRampToValueAtTime(0.001, time + decay * (1 - i * 0.1));
          o.connect(g); g.connect(out);
          o.start(time); o.stop(time + decay + 0.1);
        });
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.value = (p.pitch || 1800) * 2; bp.Q.value = 20;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.15, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.04);
        return decay + 0.1;
      }
      case 'vibraslap': {
        // wooden rattle — many short, slightly random resonant knocks
        const knocks = 14;
        for (let i = 0; i < knocks; i++) {
          const t = time + i * 0.025;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
          bp.frequency.value = (p.pitch || 1600) * (0.7 + Math.random() * 0.6); bp.Q.value = 18;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.5, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.05);
        }
        return decay + 0.1;
      }
      case 'jingle': {
        // sleigh bells / jingle — many tiny high metallic pings in a cluster
        const bells = 9;
        for (let i = 0; i < bells; i++) {
          const t = time + Math.random() * 0.08;
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = (p.pitch || 5000) * (0.7 + Math.random() * 0.8);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          o.connect(g); g.connect(out);
          o.start(t); o.stop(t + 0.16);
        }
        return decay + 0.1;
      }
      case 'surdo': {
        // deep Brazilian bass drum — round low tone with soft attack
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime((p.pitch || 110) * 1.2, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 110, time + 0.09);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        return decay + 0.1;
      }
      case 'repinique': {
        // high, bright samba drum — a tonal snap with a sharp attack
        const o = ctx.createOscillator(); o.type = 'triangle';
        o.frequency.setValueAtTime((p.pitch || 360) * 1.5, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 360, time + 0.03);
        const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 800;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.55, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + decay);
        o.connect(f); f.connect(g); g.connect(out);
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4000; bp.Q.value = 2;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.2, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        o.start(time); o.stop(time + decay + 0.05);
        src.start(time); src.stop(time + 0.03);
        return decay + 0.1;
      }
      case 'tamborim': {
        // small, dry, high-pitched samba frame drum — a sharp dry slap
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.value = p.pitch || 2800; bp.Q.value = 6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + 0.05);
        return 0.1;
      }
      case 'caxixi': {
        // woven basket shaker — soft, grainy, mid-frequency rattle
        const grains = 22;
        for (let i = 0; i < grains; i++) {
          const t = time + (i / grains) * decay;
          const src = this._noiseSource('pink');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
          bp.frequency.value = 3000 + Math.random() * 3000; bp.Q.value = 4;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.18 + Math.random() * 0.16, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.05);
        }
        return decay + 0.1;
      }
      case 'clave-electro': {
        // an electronic clave / rim — a short pitched tone with a hard click
        const o = ctx.createOscillator(); o.type = 'square';
        o.frequency.value = p.pitch || 1400;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass';
        f.frequency.value = p.filterFreq || 3000; f.Q.value = 10;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.4, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + 0.06);
        return 0.1;
      }
      case 'foot': {
        // a soft foot-stomp / body percussion — low thud + short noise slap
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(140, time);
        o.frequency.exponentialRampToValueAtTime(70, time + 0.05);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        o.connect(g); g.connect(out);
        const src = this._noiseSource('brown');
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.3, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        src.connect(lp); lp.connect(ng); ng.connect(out);
        o.start(time); o.stop(time + 0.2);
        src.start(time); src.stop(time + 0.06);
        return 0.3;
      }
      case 'congas': {
        // paired hand drums: a low open tone then a high slap
        const play = (t, f, vel, dur) => {
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.setValueAtTime(f * 1.5, t);
          o.frequency.exponentialRampToValueAtTime(f, t + 0.03);
          const g = ctx.createGain();
          g.gain.setValueAtTime(vel, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur);
          o.connect(g); g.connect(out);
          o.start(t); o.stop(t + dur + 0.05);
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 1.4;
          const ng = ctx.createGain();
          ng.gain.setValueAtTime(vel * 0.4, t);
          ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
          src.connect(bp); bp.connect(ng); ng.connect(out);
          src.start(t); src.stop(t + 0.04);
        };
        play(time, p.pitch || 220, 0.65, 0.28);
        play(time + 0.12, (p.pitch || 220) * 1.5, 0.55, 0.22);
        return 0.45;
      }
      case 'bongo': {
        const f1 = p.pitch || 400, f2 = (p.pitch || 400) * 1.35;
        [f1, f2].forEach((f, i) => {
          const t = time + i * 0.09;
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.setValueAtTime(f * 1.4, t);
          o.frequency.exponentialRampToValueAtTime(f, t + 0.02);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.55, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          o.connect(g); g.connect(out);
          o.start(t); o.stop(t + 0.2);
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 2;
          const ng = ctx.createGain();
          ng.gain.setValueAtTime(0.3, t);
          ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
          src.connect(bp); bp.connect(ng); ng.connect(out);
          src.start(t); src.stop(t + 0.04);
        });
        return 0.3;
      }
      case 'udu': {
        // clay-pot drum: hollow "boing" with a pitch-bend resonant body
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime((p.pitch || 220) * 1.8, time);
        o.frequency.exponentialRampToValueAtTime(p.pitch || 220, time + 0.04);
        o.frequency.exponentialRampToValueAtTime((p.pitch || 220) * 0.8, time + 0.3);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.32);
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + 0.4);
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 3;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.35, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.07);
        return 0.5;
      }
      case 'kalimba': {
        // thumb-piano tine: bright sine with a quick metallic decay partial
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = p.pitch || 660;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.5));
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + (p.decay || 0.5) + 0.05);
        const o2 = ctx.createOscillator(); o2.type = 'triangle';
        o2.frequency.value = (p.pitch || 660) * 3.02;
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.2, time);
        g2.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        o2.connect(g2); g2.connect(out);
        o2.start(time); o2.stop(time + 0.12);
        return (p.decay || 0.5) + 0.1;
      }
      case 'marimba': {
        // wooden-bar mallet: fundamental + a soft octave, hollow resonance
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = p.pitch || 440;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.7));
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + (p.decay || 0.7) + 0.05);
        [4, 9.5].forEach((m, i) => {
          const o2 = ctx.createOscillator(); o2.type = 'sine';
          o2.frequency.value = (p.pitch || 440) * Math.pow(2, m / 12);
          const g2 = ctx.createGain();
          g2.gain.setValueAtTime(0.22 / (i + 1), time);
          g2.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.7) * 0.6);
          o2.connect(g2); g2.connect(out);
          o2.start(time); o2.stop(time + (p.decay || 0.7) * 0.6 + 0.05);
        });
        return (p.decay || 0.7) + 0.1;
      }
      case 'steelpan': {
        // steel drum: bright metallic partials over a fundamental
        const base = p.pitch || 520;
        [0, 2.1, 4.7, 7.1].forEach((m, i) => {
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = base * Math.pow(2, m / 12);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.4 / (i + 1), time);
          g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.9) * (1 - i * 0.12));
          o.connect(g); g.connect(out);
          o.start(time); o.stop(time + (p.decay || 0.9) + 0.1);
        });
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'highpass'; bp.frequency.value = 4000;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.18, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.04);
        return (p.decay || 0.9) + 0.1;
      }
      case 'glass': {
        // glassy bottle/glass hit: high sine + inharmonic bright partial
        const base = p.pitch || 1500;
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = base;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.5, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.5));
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + (p.decay || 0.5) + 0.05);
        const o2 = ctx.createOscillator(); o2.type = 'sine';
        o2.frequency.value = base * 2.42;
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.25, time);
        g2.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.5) * 0.6);
        o2.connect(g2); g2.connect(out);
        o2.start(time); o2.stop(time + (p.decay || 0.5) * 0.6 + 0.05);
        return (p.decay || 0.5) + 0.1;
      }
      case 'snap': {
        // finger snap: a tight high-frequency crack
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.55, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + 0.07);
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(500, time);
        o.frequency.exponentialRampToValueAtTime(300, time + 0.05);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.3, time);
        og.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        o.connect(og); og.connect(out);
        o.start(time); o.stop(time + 0.07);
        return 0.15;
      }
      case 'stomp': {
        // a hard body stomp on a floor — low thump + mid knock
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(180, time);
        o.frequency.exponentialRampToValueAtTime(60, time + 0.08);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + 0.35);
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 1.5;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.4, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.08);
        return 0.4;
      }
      case 'crash': {
        // big cymbal crash: bright noise swell with a long metallic tail
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4500;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.55, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 1.6));
        src.connect(hp); hp.connect(g); g.connect(out);
        src.start(time); src.stop(time + (p.decay || 1.6) + 0.1);
        const ratios = [1, 1.7, 2.3, 3.4, 4.9];
        ratios.forEach((r, i) => {
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = (p.pitch || 800) * r;
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.12 / (i + 1), time);
          og.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 1.6) * 0.7);
          o.connect(og); og.connect(out);
          o.start(time); o.stop(time + (p.decay || 1.6) * 0.7 + 0.1);
        });
        if (p.reverb) { const s = ctx.createGain(); s.gain.value = p.reverb; g.connect(s); s.connect(this.reverbBus); }
        return (p.decay || 1.6) + 0.2;
      }
      case 'rainstick': {
        // rain stick: a slow cascade of falling grains
        const count = Math.floor((p.duration || 1.2) * 30);
        for (let i = 0; i < count; i++) {
          const t = time + (i / count) * (p.duration || 1.2);
          const s = this._noiseSource('white');
          const f = ctx.createBiquadFilter(); f.type = 'bandpass';
          f.frequency.value = 2500 + Math.random() * 4000; f.Q.value = 7;
          const gg = ctx.createGain();
          gg.gain.setValueAtTime(0.16 + Math.random() * 0.2, t);
          gg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          s.connect(f); f.connect(gg); gg.connect(out);
          s.start(t); s.stop(t + 0.05);
        }
        return (p.duration || 1.2) + 0.2;
      }
      case 'gong': {
        // large gong: low fundamental with slowly-beating partials
        const base = p.pitch || 130;
        [1, 1.35, 2.1, 2.9, 4.3].forEach((r, i) => {
          const o = ctx.createOscillator(); o.type = 'sine';
          o.frequency.value = base * r;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.5 / (i + 1), time);
          g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 3.2) * (1 - i * 0.1));
          o.connect(g); g.connect(out);
          o.start(time); o.stop(time + (p.decay || 3.2) + 0.2);
        });
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 2;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.3, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.12);
        if (p.reverb) { const s = ctx.createGain(); s.gain.value = p.reverb; ng.connect(s); s.connect(this.reverbBus); }
        return (p.decay || 3.2) + 0.3;
      }
      default: return 0.1;
    }
  }

  // ------------------------------------------------------------ BASS/SUB
  bass(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;

    const playNote = (t, freq, dur, extra) => {
      extra = extra || {};
      const voices = [];
      const o1 = ctx.createOscillator(); o1.type = p.waveform || 'sawtooth'; o1.frequency.setValueAtTime(freq, t);
      if (p.glide) { o1.frequency.setValueAtTime(freq * 0.85, t); o1.frequency.exponentialRampToValueAtTime(freq, t + 0.08); }
      voices.push(o1);
      if (p.detuneVoices) {
        const o2 = ctx.createOscillator(); o2.type = p.waveform || 'sawtooth'; o2.frequency.value = freq; o2.detune.value = 12;
        const o3 = ctx.createOscillator(); o3.type = p.waveform || 'sawtooth'; o3.frequency.value = freq; o3.detune.value = -12;
        voices.push(o2, o3);
      }

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.Q.value = p.filterQ || 4;
      const baseCutoff = p.filterCutoff || 500;
      filter.frequency.setValueAtTime(baseCutoff + (p.filterEnvAmount || 0), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(baseCutoff, 60), t + (p.filterEnvDecay || 0.15));

      if (p.lfo) {
        const lfo = ctx.createOscillator(); lfo.type = 'square'; lfo.frequency.value = extra.lfoRate || 5;
        const lfoAmt = ctx.createGain(); lfoAmt.gain.value = baseCutoff * 1.8;
        lfo.connect(lfoAmt); lfoAmt.connect(filter.frequency);
        lfo.start(t); lfo.stop(t + dur + 0.1);
      }

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(extra.vel !== undefined ? 0.55 + extra.vel * 0.25 : 0.75, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      voices.forEach(v => v.connect(filter));

      if (p.ringMod) {
        const ringOsc = ctx.createOscillator(); ringOsc.type = 'sine'; ringOsc.frequency.value = freq * 2.3;
        const ringGain = ctx.createGain(); ringGain.gain.value = 0.35;
        ringOsc.connect(ringGain); ringGain.connect(filter);
        ringOsc.start(t); ringOsc.stop(t + dur + 0.1);
      }

      if (p.drive) {
        const dist = this._makeDistortion(p.drive);
        filter.connect(dist); dist.connect(g);
      } else {
        filter.connect(g);
      }
      g.connect(out);
      voices.forEach(v => { v.start(t); v.stop(t + dur + 0.05); });

      if (p.sub) {
        const subOsc = ctx.createOscillator(); subOsc.type = 'sine'; subOsc.frequency.value = freq / 2;
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.0001, t);
        subGain.gain.exponentialRampToValueAtTime(p.sub, t + 0.01);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        subOsc.connect(subGain); subGain.connect(out);
        subOsc.start(t); subOsc.stop(t + dur + 0.05);
      }
      if (p.chord) {
        [7, 10].forEach(semi => {
          const co = ctx.createOscillator(); co.type = p.waveform || 'triangle';
          co.frequency.value = freq * Math.pow(2, semi / 12);
          const cg = ctx.createGain();
          cg.gain.setValueAtTime(0.0001, t);
          cg.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
          cg.gain.exponentialRampToValueAtTime(0.001, t + dur);
          co.connect(cg); cg.connect(out);
          co.start(t); co.stop(t + dur + 0.05);
        });
      }
    };

    const base = p.baseFreq || 55;
    const semiFreq = (s) => base * Math.pow(2, s / 12);
    if (p.pattern === 'rolling') {
      const steps = [0, 0, 3, 0, 0, 2, 0, 5];
      const stepDur = 0.16;
      steps.forEach((semi, i) => playNote(time + i * stepDur, semiFreq(semi), stepDur * 0.85));
      return steps.length * stepDur + 0.2;
    }
    if (p.pattern === 'acid16') {
      const steps = [0, 0, 3, 0, 5, 0, 3, 0, 0, 2, 3, 0, 7, 5, 3, 0];
      const stepDur = 0.115;
      steps.forEach((semi, i) => playNote(time + i * stepDur, semiFreq(semi), stepDur * 0.9, { vel: (i % 4 === 0 ? 0.4 : 0.15), lfoRate: 12 }));
      return steps.length * stepDur + 0.2;
    }
    if (p.pattern === 'sequence') {
      const steps = [0, 0, 7, 0, 5, 0, 3, 0, 0, 0, 7, 10, 7, 5, 3, 0];
      const stepDur = 0.14;
      steps.forEach((semi, i) => playNote(time + i * stepDur, semiFreq(semi), stepDur * 0.8, { vel: i % 2 ? 0.1 : 0.3 }));
      return steps.length * stepDur + 0.2;
    }
    if (p.pattern === 'offbeat') {
      const stepDur = 0.25; // eighth notes
      for (let i = 1; i < 8; i += 2) playNote(time + i * stepDur, base, stepDur * 0.9, { vel: 0.3 });
      return 8 * stepDur + 0.2;
    }
    if (p.pattern === 'acidOffbeat') {
      // squelchy offbeat acid: resonant offbeats with a pitch accent on the 4th
      const stepDur = 0.25;
      for (let i = 1; i < 8; i += 2) {
        const semi = (i === 7) ? 12 : (i === 3 ? 7 : 0);
        playNote(time + i * stepDur, semiFreq(semi), stepDur * 0.75, { vel: 0.35, lfoRate: 10 });
      }
      return 8 * stepDur + 0.2;
    }
    if (p.pattern === 'subPulse') {
      // pumping 8th-note sub: same low note pulsing, slight velocity swing
      const stepDur = 0.25;
      for (let i = 0; i < 8; i++) {
        playNote(time + i * stepDur, base, stepDur * 0.8, { vel: i % 2 ? 0.2 : 0.45 });
      }
      return 8 * stepDur + 0.2;
    }
    if (p.pattern === 'long') {
      playNote(time, base, 1.8);
      return 2.0;
    }
    // single
    const dur = p.chord ? 0.9 : 0.6;
    playNote(time, base, dur);
    return dur + 0.2;
  }

  // -------------------------------------------------------- LEAD/STAB/ARP
  lead(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;

    const playVoice = (t, freq, dur, intervals) => {
      const ivs = intervals && intervals.length ? intervals : [0];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.Q.value = p.acid ? 14 : (p.sync ? 6 : 2);
      const baseCutoff = p.filterCutoff || 2000;
      filter.frequency.setValueAtTime(baseCutoff + (p.filterEnvAmount || 0), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(baseCutoff * 0.55, 200), t + dur);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5 / ivs.length + 0.08, t + (p.attack || 0.005));
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      ivs.forEach(semi => {
        // PWM: crossfade a narrow and wide pulse with an LFO for a real
        // moving pulse-width effect.
        if (p.pwm) {
          const f = freq * Math.pow(2, semi / 12);
          const narrow = ctx.createOscillator(); narrow.setPeriodicWave(this._pulseWave(p.pwmWidth || 0.18));
          const wide = ctx.createOscillator(); wide.setPeriodicWave(this._pulseWave(0.5));
          narrow.frequency.value = f; wide.frequency.value = f;
          const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = p.pwmRate || 4;
          const nGain = ctx.createGain(); nGain.gain.value = 0.5;
          const wGain = ctx.createGain(); wGain.gain.value = 0.5;
          const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.5;
          lfo.connect(lfoAmt);
          lfoAmt.connect(nGain.gain); lfoAmt.connect(wGain.gain);
          // invert for the wide path
          const inv = ctx.createGain(); inv.gain.value = -1;
          lfoAmt.connect(inv); inv.connect(wGain.gain);
          narrow.connect(nGain); nGain.connect(filter);
          wide.connect(wGain); wGain.connect(filter);
          narrow.start(t); narrow.stop(t + dur + 0.1);
          wide.start(t); wide.stop(t + dur + 0.1);
          lfo.start(t); lfo.stop(t + dur + 0.1);
          return;
        }
        // super/ensemble stack several detuned voices
        const voiceCount = p.super ? 5 : (p.ensemble ? 4 : 1);
        for (let v = 0; v < voiceCount; v++) {
          const o = ctx.createOscillator();
          o.type = p.bell ? 'sine' : (p.waveform || 'sawtooth');
          const f = freq * Math.pow(2, semi / 12);
          o.frequency.value = f;
          const detune = p.detune
            ? (v - (voiceCount - 1) / 2) * p.detune + (Math.random() * 2 - 1) * (p.ensemble ? 6 : 1)
            : 0;
          o.detune.value = detune;
          o.connect(filter);
          o.start(t); o.stop(t + dur + 0.1);
        }
        if (p.bell) {
          const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2.756;
          const g2 = ctx.createGain(); g2.gain.value = 0.15;
          o2.connect(g2); g2.connect(filter);
          o2.start(t); o2.stop(t + dur * 0.6 + 0.1);
        }
        if (p.sync) {
          // a hard-sync-like bright partial: a second oscillator tracking a higher multiple
          const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = freq * 2.01;
          const g2 = ctx.createGain(); g2.gain.value = 0.18;
          o2.connect(g2); g2.connect(filter);
          o2.start(t); o2.stop(t + dur + 0.1);
        }
      });
      filter.connect(g);
      let node = g;
      if (p.reverb || p.delay) {
        if (p.reverb) {
          const s = ctx.createGain(); s.gain.value = p.reverb * 0.6; g.connect(s); s.connect(this.reverbBus);
        }
        if (p.delay) {
          const s = ctx.createGain(); s.gain.value = p.delay * 0.5; g.connect(s); s.connect(this.delayBus);
        }
      }
      node.connect(out);
    };

    const base = p.baseFreq || 330;
    if (p.subtype === 'arp') {
      const pattern = p.intervals && p.intervals.length ? p.intervals : [0, 3, 7, 10];
      const seq = [0, 1, 2, 3, 2, 1, 3, 0].map(i => pattern[i % pattern.length]);
      const stepDur = p.stepDur || 0.115;
      seq.forEach((semi, i) => playVoice(time + i * stepDur, base, stepDur * 1.4, [semi]));
      return seq.length * stepDur + 0.3;
    }
    const dur = p.decay || 0.3;
    playVoice(time, base, dur, p.intervals);
    return dur + 0.3;
  }

  // ---------------------------------------------------------- PAD/DRONE
  pad(time, p, destination, previewDur) {
    const ctx = this.ctx, out = destination || this.master;
    const dur = previewDur || 3.2;
    const intervals = p.intervals && p.intervals.length ? p.intervals : [0];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = p.filterCutoff || 1500; filter.Q.value = 1;

    if (p.lfoRate) {
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = p.lfoRate;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = p.lfoDepth || 100;
      lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
      lfo.start(time); lfo.stop(time + dur + 1);
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.32, time + (p.attack || 1));
    g.gain.setValueAtTime(0.32, time + Math.max(dur - (p.release || 1.5), (p.attack || 1)));
    g.gain.exponentialRampToValueAtTime(0.0005, time + dur);
    filter.connect(g); g.connect(out);

    if (p.reverb !== false) {
      const rev = ctx.createGain(); rev.gain.value = 0.5;
      g.connect(rev); rev.connect(this.reverbBus);
    }

    const voiceCount = p.voices || 3;
    intervals.forEach(semi => {
      for (let v = 0; v < voiceCount; v++) {
        const o = ctx.createOscillator();
        if (p.metallic) o.type = 'sine';
        else if (p.organ) o.type = v % 2 ? 'triangle' : 'square';
        else if (p.piano) o.type = v % 2 ? 'sine' : 'triangle';
        else o.type = p.waveform || 'sawtooth';
        o.frequency.value = (p.baseFreq || 150) * Math.pow(2, semi / 12);
        o.detune.value = (v - (voiceCount - 1) / 2) * (p.detune || 8);
        o.connect(filter);
        o.start(time); o.stop(time + dur + 0.2);
      }
    });

    // extra character layers
    if (p.choir || p.piano) {
      const vib = ctx.createOscillator(); vib.type = 'sine'; vib.frequency.value = p.choir ? 5 : 5.5;
      const vibAmt = ctx.createGain(); vibAmt.gain.value = 6;
      vib.connect(vibAmt);
      intervals.forEach((semi) => {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = (p.baseFreq || 150) * Math.pow(2, semi / 12) * 2;
        vibAmt.connect(o.detune);
        const og = ctx.createGain(); og.gain.value = 0.05;
        o.connect(og); og.connect(filter);
        o.start(time); o.stop(time + dur + 0.2);
      });
      vib.start(time); vib.stop(time + dur + 0.2);
    }
    if (p.airy || p.organ) {
      const src = this._noiseSource('pink');
      const nf = ctx.createBiquadFilter(); nf.type = 'bandpass';
      nf.frequency.value = (p.filterCutoff || 1500) * 1.4; nf.Q.value = 0.7;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.0001, time);
      ng.gain.linearRampToValueAtTime(0.06, time + (p.attack || 1));
      ng.gain.exponentialRampToValueAtTime(0.0005, time + dur);
      src.connect(nf); nf.connect(ng); ng.connect(g);
      src.start(time); src.stop(time + dur + 0.2);
    }
    return dur + 0.3;
  }

  // ------------------------------------------------------------- VOCAL-ish
  // A compact, clearly-synthetic "vocal" made from a couple of saw/triangle
  // oscillators through fixed bandpass formants. It suggests a vowel/chop; it
  // is not intelligible speech and does not sample any real voice.
  vocal(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const dur = p.decay || 0.4;
    const freq = p.pitch || 262;
    const female = p.gender !== 'male';
    const formantScale = (female ? 1.2 : 0.85) * (p.formant || 1);

    // vowel formant centers (F1, F2, F3)
    const vowels = {
      ah: [700, 1220, 2600],
      oh: [570, 840, 2410],
      ee: [270, 2290, 3010],
      oo: [300, 870, 2240],
    };
    const formants = vowels[p.vowel] || vowels.ah;

    const src = ctx.createOscillator();
    src.type = p.whisper ? 'sawtooth' : (female ? 'sawtooth' : 'square');
    src.frequency.setValueAtTime(freq, time);
    if (p.shout) {
      // shouted chant: a sharp pitch rise into a held, slightly fallen note,
      // brighter formants and heavier drive for aggression
      src.frequency.setValueAtTime(freq * 0.85, time);
      src.frequency.exponentialRampToValueAtTime(freq * 1.15, time + 0.06);
      src.frequency.exponentialRampToValueAtTime(freq * 1.0, time + Math.min(dur * 0.6, 0.3));
    }
    if (p.chop || p.hook) {
      // quick pitch dip on each chop syllable
      const chops = p.chop ? 5 : 3;
      for (let i = 0; i <= chops; i++) {
        const t = time + (i / chops) * dur * 0.7;
        src.frequency.setValueAtTime(freq * (i % 2 ? 0.98 : 1.02), t);
      }
    }
    if (p.spoken) src.frequency.linearRampToValueAtTime(freq * 0.9, time + dur);

    const srcGain = ctx.createGain();
    srcGain.gain.setValueAtTime(0.0001, time);
    srcGain.gain.linearRampToValueAtTime(p.whisper ? 0.12 : 0.5, time + (p.pad ? 0.4 : 0.03));
    srcGain.gain.setValueAtTime(p.whisper ? 0.1 : 0.45, time + Math.max(dur - 0.08, 0.1));
    srcGain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.connect(srcGain);

    let last = srcGain;
    if (p.whisper) {
      // breathy: noise through formants, low pitched tone
      const noise = this._noiseSource('pink');
      const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2000; nf.Q.value = 0.7;
      const ng = ctx.createGain(); ng.gain.value = 0.35;
      noise.connect(nf); nf.connect(ng); ng.connect(srcGain);
      noise.start(time); noise.stop(time + dur + 0.05);
    }

    const chain = ctx.createGain(); chain.gain.value = 0.8;
    formants.forEach((f, i) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = f * formantScale;
      bp.Q.value = i === 2 ? 12 : 8;
      const fg = ctx.createGain();
      fg.gain.value = i === 0 ? 0.9 : (i === 1 ? 0.6 : 0.35);
      last.connect(bp); bp.connect(fg); fg.connect(chain);
    });

    let node = chain;
    if (p.drive || p.shout) {
      const d = this._makeDistortion(p.shout ? 0.55 : p.drive); chain.connect(d); node = d;
    }
    node.connect(out);

    if (p.reverb) {
      const s = ctx.createGain(); s.gain.value = p.reverb * 0.7;
      chain.connect(s); s.connect(this.reverbBus);
    }
    if (p.pad) {
      const s = ctx.createGain(); s.gain.value = 0.6;
      chain.connect(s); s.connect(this.reverbBus);
    }

    src.start(time); src.stop(time + dur + 0.05);
    return dur + 0.2;
  }

  // ------------------------------------------------------------ FX/RISER
  fx(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const dur = p.duration || 2.5;
    const noiseMix = p.noiseMix === undefined ? 1 : p.noiseMix;
    switch (p.type) {
      case 'riser': case 'sweep': {
        const src = this._noiseSource('white');
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass'; filter.Q.value = p.type === 'sweep' ? 6 : 1.2;
        filter.frequency.setValueAtTime(p.startFreq || 200, time);
        filter.frequency.exponentialRampToValueAtTime(p.endFreq || 8000, time + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.45, time + dur * 0.9);
        g.gain.linearRampToValueAtTime(0.0001, time + dur);
        src.connect(filter); filter.connect(g); g.connect(out);
        src.start(time); src.stop(time + dur + 0.1);

        if (noiseMix < 1) {
          const o = ctx.createOscillator(); o.type = 'sawtooth';
          o.frequency.setValueAtTime(p.startFreq || 200, time);
          o.frequency.exponentialRampToValueAtTime(p.endFreq || 8000, time + dur);
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.0001, time);
          og.gain.exponentialRampToValueAtTime(0.3 * (1 - noiseMix), time + dur * 0.9);
          og.gain.linearRampToValueAtTime(0.0001, time + dur);
          o.connect(og); og.connect(out);
          o.start(time); o.stop(time + dur + 0.1);
        }
        return dur + 0.2;
      }
      case 'downlifter': {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(p.startFreq || 2000, time);
        o.frequency.exponentialRampToValueAtTime(Math.max(p.endFreq, 20) || 30, time + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.65, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);

        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(noiseMix, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        src.connect(hp); hp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.15);
        return dur + 0.2;
      }
      case 'downlifterNoise': {
        const src = this._noiseSource('white');
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
        filter.frequency.setValueAtTime(p.startFreq || 9000, time);
        filter.frequency.exponentialRampToValueAtTime(p.endFreq || 200, time + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.5, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        src.connect(filter); filter.connect(g); g.connect(out);
        src.start(time); src.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'reverseCymbal': {
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
        bp.frequency.setValueAtTime(p.startFreq || 4000, time);
        bp.frequency.linearRampToValueAtTime(p.endFreq || 9000, time + dur);
        bp.Q.value = 1;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.55, time + dur * 0.95);
        g.gain.setValueAtTime(0.0001, time + dur);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + dur + 0.05);
        return dur + 0.15;
      }
      case 'pump': {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = p.startFreq || 300;
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1200;
        const g = ctx.createGain();
        const pumps = 4, pumpDur = dur / pumps;
        g.gain.setValueAtTime(0.0001, time);
        for (let i = 0; i < pumps; i++) {
          const t0 = time + i * pumpDur;
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.linearRampToValueAtTime(0.32, t0 + pumpDur * 0.15);
          g.gain.exponentialRampToValueAtTime(0.04, t0 + pumpDur * 0.9);
        }
        o.connect(filter); filter.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'clang': {
        const ratios = [1, 1.83, 2.4, 3.76, 5.4, 6.8];
        const base = (p.startFreq || 1200) / 6;
        ratios.forEach((r, i) => {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * r;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.28 / (i * 0.6 + 1), time);
          g.gain.exponentialRampToValueAtTime(0.001, time + dur * (1 - i * 0.1));
          o.connect(g); g.connect(out);
          o.start(time); o.stop(time + dur + 0.1);
        });
        return dur + 0.2;
      }
      case 'tensionRiser': {
        const hits = 14;
        for (let i = 0; i < hits; i++) {
          const frac = i / hits;
          const t = time + dur * frac * frac;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = p.startFreq || 2000; bp.Q.value = 2;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.28 + 0.3 * frac, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.07);
        }
        return dur + 0.15;
      }
      case 'snareRush': {
        const beats = 18;
        for (let i = 0; i < beats; i++) {
          const t = time + dur * Math.pow(i / beats, 2.2);
          const v = 0.25 + (i / beats) * 0.5;
          this.snare(t, { decay: 0.09 + (i / beats) * 0.1, tone: 200, noise: 0.8, snap: 0.7, velocity: v }, out);
        }
        return dur + 0.2;
      }
      case 'siren': {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(p.startFreq || 440, time);
        const segs = 4;
        for (let i = 1; i <= segs; i++) {
          const t = time + dur * (i / segs);
          o.frequency.linearRampToValueAtTime(i % 2 ? (p.endFreq || 880) : (p.startFreq || 440), t);
        }
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600; f.Q.value = 4;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(0.3, time + 0.1);
        g.gain.setValueAtTime(0.3, time + dur - 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'boom': {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(p.startFreq || 120, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 35, time + dur * 0.6);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.9, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(g); g.connect(out);
        const src = this._noiseSource('brown');
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.5 * noiseMix, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        src.connect(lp); lp.connect(ng); ng.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        src.start(time); src.stop(time + 0.3);
        return dur + 0.2;
      }
      case 'vinylStop': case 'tapeStop': {
        const src = this._noiseSource('pink');
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(p.startFreq || 600, time);
        o.frequency.exponentialRampToValueAtTime(Math.max(40, p.endFreq || 80), time + dur);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(3000, time); f.frequency.exponentialRampToValueAtTime(400, time + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.35, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(f); f.connect(g); g.connect(out);
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1000; bp.Q.value = 1;
        const ng = ctx.createGain(); ng.gain.value = 0.15 * noiseMix;
        src.connect(bp); bp.connect(ng); ng.connect(g);
        o.start(time); o.stop(time + dur + 0.1);
        src.start(time); src.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'laser': {
        const o = ctx.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime(p.startFreq || 2400, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 300, time + dur);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 4000; f.Q.value = 6;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.4, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.05);
        return dur + 0.1;
      }
      case 'arpRush': {
        const notes = 16;
        for (let i = 0; i < notes; i++) {
          const t = time + (i / notes) * dur;
          const freq = (p.startFreq || 220) * Math.pow(2, (i / notes) * 4);
          const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = freq;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur / notes);
          const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3000 + i * 200;
          o.connect(f); f.connect(g); g.connect(out);
          o.start(t); o.stop(t + dur / notes + 0.02);
        }
        return dur + 0.2;
      }
      case 'glitch': {
        const hits = 10;
        for (let i = 0; i < hits; i++) {
          const t = time + (i / hits) * dur;
          const src = this._noiseSource(i % 2 ? 'white' : 'pink');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
          bp.frequency.value = 500 + Math.random() * 4000; bp.Q.value = 4 + Math.random() * 8;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.3, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.03 + Math.random() * 0.05);
          const d = this._makeDistortion(0.5);
          src.connect(bp); bp.connect(d); d.connect(g); g.connect(out);
          src.start(t); src.stop(t + 0.08);
        }
        return dur + 0.1;
      }
      case 'horn': {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(p.startFreq || 110, time);
        o.frequency.linearRampToValueAtTime(p.endFreq || 90, time + dur);
        const f1 = ctx.createBiquadFilter(); f1.type = 'lowpass'; f1.frequency.value = 900;
        const f2 = ctx.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 300; f2.Q.value = 3; f2.gain.value = 8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(0.4, time + 0.2);
        g.gain.setValueAtTime(0.4, time + dur - 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(f1); f1.connect(f2); f2.connect(g); g.connect(out);
        if (noiseMix) {
          const n = this._noiseSource('brown');
          const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 400;
          const ng = ctx.createGain(); ng.gain.value = 0.12;
          n.connect(nf); nf.connect(ng); ng.connect(g);
          n.start(time); n.stop(time + dur + 0.1);
        }
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'vinylScratch': {
        // a back-and-forth record scratch: filtered noise swept up then down
        const segs = 2;
        for (let i = 0; i < segs; i++) {
          const t = time + (i / segs) * dur;
          const sd = dur / segs;
          const src = this._noiseSource('white');
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 5;
          bp.frequency.setValueAtTime(i % 2 ? (p.endFreq || 6000) : (p.startFreq || 800), t);
          bp.frequency.exponentialRampToValueAtTime(i % 2 ? (p.startFreq || 800) : (p.endFreq || 6000), t + sd);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.4, t + 0.02);
          g.gain.setValueAtTime(0.4, t + sd - 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t + sd);
          src.connect(bp); bp.connect(g); g.connect(out);
          src.start(t); src.stop(t + sd + 0.05);
        }
        return dur + 0.2;
      }
      case 'gunshot': {
        // short, very loud transient: sharp noise crack + sub thump
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.8, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        src.connect(hp); hp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.1);
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(120, time);
        o.frequency.exponentialRampToValueAtTime(40, time + 0.15);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.7, time);
        og.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        o.connect(og); og.connect(out);
        o.start(time); o.stop(time + 0.35);
        return 0.5;
      }
      case 'stutterKick': {
        // rapid retriggered mini-kicks that accelerate into a drop
        const hits = 10;
        for (let i = 0; i < hits; i++) {
          const t = time + dur * Math.pow(i / hits, 2);
          this.kick(t, { startFreq: 160, endFreq: 50, pitchDecay: 0.04, ampDecay: 0.12, drive: 0.3, click: 0.4, sub: 0.4 }, out);
        }
        return dur + 0.3;
      }
      case 'beep': {
        // clean warning/alarm beep that repeats
        const reps = Math.max(2, Math.floor(dur / 0.25));
        for (let i = 0; i < reps; i++) {
          const t = time + i * (dur / reps);
          const o = ctx.createOscillator(); o.type = 'square';
          o.frequency.value = p.startFreq || 1000;
          const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = p.startFreq || 1000; f.Q.value = 4;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.25, t + 0.005);
          g.gain.exponentialRampToValueAtTime(0.001, t + (dur / reps) * 0.5);
          o.connect(f); f.connect(g); g.connect(out);
          o.start(t); o.stop(t + (dur / reps) * 0.6);
        }
        return dur + 0.2;
      }
      case 'noiseImpact': {
        // a single huge noise hit with a fast downward whoosh (cinematic impact without sub)
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'lowpass';
        bp.frequency.setValueAtTime(p.startFreq || 8000, time);
        bp.frequency.exponentialRampToValueAtTime(p.endFreq || 400, time + 0.4);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
        src.connect(bp); bp.connect(g); g.connect(out);
        src.start(time); src.stop(time + 0.7);
        return 0.8;
      }
      case 'phoneRing': {
        // two-tone telephone-style ring, useful as a quirky techno accent
        const freqs = [p.startFreq || 440, p.endFreq || 480];
        const reps = Math.max(2, Math.floor(dur / 0.3));
        for (let i = 0; i < reps; i++) {
          const t = time + i * (dur / reps);
          freqs.forEach((freq, j) => {
            const o = ctx.createOscillator(); o.type = 'sine';
            o.frequency.value = freq;
            const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 20;
            const g = ctx.createGain();
            const seg = (dur / reps) / 2;
            g.gain.setValueAtTime(0.0001, t + j * seg);
            g.gain.linearRampToValueAtTime(0.18, t + j * seg + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, t + (j + 1) * seg - 0.01);
            o.connect(f); f.connect(g); g.connect(out);
            o.start(t + j * seg); o.stop(t + (j + 1) * seg);
          });
        }
        return dur + 0.2;
      }
      case 'reverbedClap': {
        // a single big reverb clap used as a transition accent
        const t0 = time;
        for (let i = 0; i < 5; i++) {
          const t = t0 + i * 0.012;
          this.perc(t, { type: 'clap', filterFreq: 1600, decay: 0.4, bursts: 5, reverb: true }, out);
        }
        return dur + 0.2;
      }
      case 'risingTone': {
        // a clean saw tone rising an octave or two with a slow volume swell
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(p.startFreq || 220, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 880, time + dur);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3000; f.Q.value = 3;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.35, time + dur * 0.9);
        g.gain.linearRampToValueAtTime(0.0001, time + dur);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'pulseAlarm': {
        // a pulsing single-pitch alarm (heartbeat-like) over the duration
        const pulses = Math.max(3, Math.floor(dur / 0.18));
        for (let i = 0; i < pulses; i++) {
          const t = time + i * (dur / pulses);
          const o = ctx.createOscillator(); o.type = 'square';
          o.frequency.value = p.startFreq || 800;
          const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = p.startFreq || 800; f.Q.value = 8;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.22, t + 0.005);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          o.connect(f); f.connect(g); g.connect(out);
          o.start(t); o.stop(t + 0.12);
        }
        return dur + 0.2;
      }
      case 'subSwell': {
        // a slow sub swell: low sine rising in volume, no pitch change
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = p.startFreq || 55;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.linearRampToValueAtTime(0.6, time + dur * 0.8);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'feedbackSweep': {
        // a feedback-like rising whine: high resonant self-oscillating character
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(p.startFreq || 300, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 4000, time + dur);
        const f = ctx.createBiquadFilter(); f.type = 'bandpass';
        f.frequency.setValueAtTime(p.startFreq || 300, time);
        f.frequency.exponentialRampToValueAtTime(p.endFreq || 4000, time + dur);
        f.Q.value = 18;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.3, time + dur * 0.9);
        g.gain.linearRampToValueAtTime(0.0001, time + dur);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'snapImpact': {
        // a short finger-snap/crackle impact (transient only)
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        src.connect(hp); hp.connect(g); g.connect(out);
        src.start(time); src.stop(time + 0.08);
        return 0.2;
      }
      case 'impact': {
        // cinematic impact: deep sub thump + noise transient + low tail
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(p.startFreq || 150, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 40, time + 0.4);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.75, time);
        og.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 1.4));
        o.connect(og); og.connect(out);
        o.start(time); o.stop(time + (p.decay || 1.4) + 0.1);
        const src = this._noiseSource('white');
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.5, time);
        ng.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(time); src.stop(time + 0.25);
        if (p.reverb) { const s = ctx.createGain(); s.gain.value = p.reverb; og.connect(s); s.connect(this.reverbBus); }
        return (p.decay || 1.4) + 0.2;
      }
      case 'subDrop': {
        // 808-style sub drop: a sine falling a full octave-plus
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(p.startFreq || 200, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 32, time + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.7, time + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        o.connect(g);
        if (p.drive) {
          const d = this._makeDistortion(p.drive); g.connect(d); d.connect(out);
        } else {
          g.connect(out);
        }
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'reverseBass': {
        // reversed bass swell: low saw rising in pitch and volume
        const o = ctx.createOscillator(); o.type = p.waveform || 'sawtooth';
        o.frequency.setValueAtTime(p.startFreq || 50, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 160, time + dur);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.filterCutoff || 400; f.Q.value = 2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.5, time + dur * 0.9);
        g.gain.linearRampToValueAtTime(0.0001, time + dur);
        o.connect(f); f.connect(g); g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'whiteBurst': {
        // a hard white-noise burst with a fast decay (impact/crash shaker)
        const src = this._noiseSource('white');
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.filterFreq || 1000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.65, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + (p.decay || 0.3));
        src.connect(hp); hp.connect(g); g.connect(out);
        src.start(time); src.stop(time + (p.decay || 0.3) + 0.05);
        return (p.decay || 0.3) + 0.1;
      }
      case 'formantRiser': {
        // vocal-ish formant sweep: two bandpass formants gliding upward
        const base = p.startFreq || 400;
        const end = p.endFreq || 1800;
        const src = this._noiseSource('white');
        const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass';
        f1.frequency.setValueAtTime(base, time);
        f1.frequency.exponentialRampToValueAtTime(end, time + dur);
        f1.Q.value = 10;
        const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass';
        f2.frequency.setValueAtTime(base * 1.6, time);
        f2.frequency.exponentialRampToValueAtTime(end * 1.4, time + dur);
        f2.Q.value = 8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.4, time + dur * 0.9);
        g.gain.linearRampToValueAtTime(0.0001, time + dur);
        src.connect(f1); f1.connect(f2); f2.connect(g); g.connect(out);
        src.start(time); src.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      case 'pitchBomb': {
        // descending pitch bomb: saw/square falling hard with distortion
        const o = ctx.createOscillator(); o.type = p.waveform || 'square';
        o.frequency.setValueAtTime(p.startFreq || 1200, time);
        o.frequency.exponentialRampToValueAtTime(p.endFreq || 60, time + dur);
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 4000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, time);
        g.gain.exponentialRampToValueAtTime(0.45, time + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, time + dur);
        if (p.drive) {
          const d = this._makeDistortion(p.drive); f.connect(d); d.connect(g);
          o.connect(f);
        } else {
          o.connect(f); f.connect(g);
        }
        g.connect(out);
        o.start(time); o.stop(time + dur + 0.1);
        return dur + 0.2;
      }
      default: return dur;
    }
  }

  // ------------------------------------------------------- TEXTURE/AMBIENCE
  texture(time, p, destination) {
    const ctx = this.ctx, out = destination || this.master;
    const dur = p.duration || 4;

    if (p.type === 'tapeHiss') {
      // bright hiss with a slow, subtle level warble (old tape noise)
      const src = this._noiseSource('white');
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = p.filterFreq || 5500;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.22, time + 0.6);
      g.gain.setValueAtTime(0.22, time + Math.max(dur - 0.6, 0.6));
      g.gain.exponentialRampToValueAtTime(0.0005, time + dur);
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = p.lfoRate || 0.3;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.07;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      src.connect(hp); hp.connect(g); g.connect(out);
      lfo.start(time); lfo.stop(time + dur + 0.2);
      src.start(time); src.stop(time + dur + 0.1);
      return dur + 0.2;
    }
    if (p.type === 'ocean') {
      // slow ocean swell: brown noise, lowpass, deep amplitude modulation
      const src = this._noiseSource('brown');
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = p.filterFreq || 700;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.4, time + 1);
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = p.lfoRate || 0.12;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.18;
      lfo.connect(lfoGain); lfoGain.connect(g.gain);
      const lfo2 = ctx.createOscillator(); lfo2.type = 'sine'; lfo2.frequency.value = (p.lfoRate || 0.12) * 1.7;
      const lfo2Gain = ctx.createGain(); lfo2Gain.gain.value = 0.1;
      lfo2.connect(lfo2Gain); lfo2Gain.connect(g.gain);
      src.connect(lp); lp.connect(g); g.connect(out);
      lfo.start(time); lfo.stop(time + dur + 0.2);
      lfo2.start(time); lfo2.stop(time + dur + 0.2);
      src.start(time); src.stop(time + dur + 0.1);
      g.gain.setValueAtTime(0.4, time + Math.max(dur - 1, 1));
      g.gain.exponentialRampToValueAtTime(0.0005, time + dur);
      return dur + 0.2;
    }

    const isLow = (p.type === 'hum' || p.type === 'rumble' || p.type === 'drone' || p.type === 'underwater');
    const src = this._noiseSource(p.type === 'rain' || p.type === 'wind' ? 'pink' : (isLow ? 'brown' : 'white'));
    const filter = ctx.createBiquadFilter();
    filter.type = p.type === 'metalRing' ? 'peaking' : (isLow ? 'lowpass' : 'bandpass');
    filter.frequency.value = p.filterFreq || 1500;
    filter.Q.value = p.filterQ || 1;

    let lfo;
    if (p.lfoRate) {
      lfo = ctx.createOscillator(); lfo.type = p.type === 'wind' ? 'sawtooth' : 'sine'; lfo.frequency.value = p.lfoRate;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = (p.filterFreq || 1500) * (p.lfoDepth || 0.3);
      lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
      lfo.start(time); lfo.stop(time + dur + 0.5);
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.38, time + 0.5);
    g.gain.setValueAtTime(0.38, time + Math.max(dur - 0.6, 0.5));
    g.gain.exponentialRampToValueAtTime(0.0005, time + dur);
    src.connect(filter); filter.connect(g); g.connect(out);
    src.start(time); src.stop(time + dur + 0.1);

    if (p.baseFreq) {
      const o = ctx.createOscillator(); o.type = p.type === 'metalRing' ? 'triangle' : 'sine';
      o.frequency.value = p.baseFreq;
      if (p.warble && lfo) lfo.connect(o.detune);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, time);
      og.gain.linearRampToValueAtTime(p.type === 'metalRing' ? 0.18 : 0.28, time + 0.6);
      og.gain.setValueAtTime(0.28, time + Math.max(dur - 0.6, 0.6));
      og.gain.exponentialRampToValueAtTime(0.0005, time + dur);
      if (p.type === 'metalRing') {
        [2.4, 4.1, 5.9].forEach(r => {
          const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = p.baseFreq * r;
          const g2 = ctx.createGain(); g2.gain.value = 0.08;
          o2.connect(g2); g2.connect(filter);
          o2.start(time); o2.stop(time + dur + 0.1);
        });
      }
      o.connect(og); og.connect(out);
      o.start(time); o.stop(time + dur + 0.1);
    }

    if (p.type === 'granular' || p.type === 'digitalDust') {
      const rate = p.lfoRate || 8;
      const grains = Math.floor(dur * rate);
      for (let i = 0; i < grains; i++) {
        const t = time + i / rate + (Math.random() - 0.5) * 0.02;
        const gsrc = this._noiseSource('white');
        const gf = ctx.createBiquadFilter(); gf.type = 'bandpass';
        gf.frequency.value = (p.filterFreq || 4000) * (0.5 + Math.random());
        gf.Q.value = p.type === 'digitalDust' ? 8 : 2;
        const gg = ctx.createGain();
        const amp = p.type === 'digitalDust' ? (Math.random() < 0.3 ? 0.35 : 0.08) : 0.3;
        gg.gain.setValueAtTime(amp, t);
        gg.gain.exponentialRampToValueAtTime(0.001, t + (p.type === 'digitalDust' ? 0.03 : 0.04));
        gsrc.connect(gf); gf.connect(gg); gg.connect(out);
        gsrc.start(t); gsrc.stop(t + 0.05);
      }
    }
    if (p.type === 'crackle' || p.type === 'crowd' || p.type === 'night') {
      const pops = p.type === 'night' ? Math.floor(dur * 14) : Math.floor(dur * 26);
      for (let i = 0; i < pops; i++) {
        const t = time + Math.random() * dur;
        const psrc = this._noiseSource('white');
        const pf = ctx.createBiquadFilter();
        pf.type = 'bandpass';
        pf.frequency.value = p.type === 'night' ? (5000 + Math.random() * 3000) : (3000 + Math.random() * 5000);
        pf.Q.value = p.type === 'crowd' ? 1 : 6;
        const pg = ctx.createGain();
        const amp = p.type === 'crowd' ? 0.05 + Math.random() * 0.08 : (p.type === 'night' ? 0.04 + Math.random() * 0.06 : 0.06 + Math.random() * 0.12);
        pg.gain.setValueAtTime(amp, t);
        pg.gain.exponentialRampToValueAtTime(0.001, t + (p.type === 'crowd' ? 0.12 : 0.02));
        psrc.connect(pf); pf.connect(pg); pg.connect(out);
        psrc.start(t); psrc.stop(t + 0.15);
      }
    }
    if (p.type === 'staticRadio') {
      for (let i = 0; i < 12; i++) {
        const t = time + Math.random() * dur;
        const s = this._noiseSource('white');
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = p.filterFreq; f.Q.value = p.filterQ || 6;
        const gg = ctx.createGain(); gg.gain.value = 0.25;
        s.connect(f); f.connect(gg); gg.connect(out);
        s.start(t); s.stop(t + 0.04);
      }
    }
    return dur + 0.2;
  }

  // ------------------------------------------------------------- DISPATCH
  preview(sound, destination, atTime) {
    this.resume();
    const time = atTime !== undefined ? atTime : this.ctx.currentTime + 0.03;
    const p = sound.params || {};
    switch (sound.engine) {
      case 'kick': return this.kick(time, p, destination);
      case 'hat': return this.hat(time, p, destination);
      case 'snare': return this.snare(time, p, destination);
      case 'perc': return this.perc(time, p, destination);
      case 'bass': return this.bass(time, p, destination);
      case 'lead': return this.lead(time, p, destination);
      case 'pad': return this.pad(time, p, destination);
      case 'vocal': return this.vocal(time, p, destination);
      case 'fx': return this.fx(time, p, destination);
      case 'texture': return this.texture(time, p, destination);
      default: return 0;
    }
  }

  // ==================================================== GROOVE TRANSPORT
  _stepDuration() { return 60 / this.grooveState.bpm / 4; }

  startGroove(bpm) {
    this.resume();
    this.grooveState.bpm = bpm || this.grooveState.bpm;
    this.grooveState.playing = true;
    this.grooveState.step = 0;
    this.grooveState.barCount = 0;
    this.grooveState.nextStepTime = this.ctx.currentTime + 0.05;
    if (this._grooveInterval) clearInterval(this._grooveInterval);
    this._grooveInterval = setInterval(() => this._grooveTick(), this.lookahead);
  }

  stopGroove() {
    this.grooveState.playing = false;
    if (this._grooveInterval) clearInterval(this._grooveInterval);
    this._grooveInterval = null;
  }

  setBpm(bpm) { this.grooveState.bpm = bpm; }
  setSwing(sw) { this.grooveState.swing = sw; }

  setGrooveLayer(category, sound) { this.grooveState.layers[category] = sound; }
  clearGrooveLayer(category) { delete this.grooveState.layers[category]; }
  getGrooveLayer(category) { return this.grooveState.layers[category]; }

  // --------------------------------------------------- PREVIEW QUEUE
  // Plays a list of sounds one after another (capped per sound) so users
  // can quickly audition a whole filtered category.
  previewQueue(sounds, callbacks) {
    this.stopPreviewQueue();
    this.resume();
    this._previewQueue = sounds.slice();
    this._previewIndex = 0;
    this._previewCbs = callbacks || {};
    this._playNextQueued();
  }
  _playNextQueued() {
    if (!this._previewQueue || this._previewIndex >= this._previewQueue.length) {
      this.stopPreviewQueue(true);
      return;
    }
    const sound = this._previewQueue[this._previewIndex];
    const dur = this.preview(sound, this.master);
    if (this._previewCbs.onStart) this._previewCbs.onStart(sound.id, this._previewIndex);
    this._previewIndex++;
    // cap long pads/textures so category auditions keep moving
    const wait = Math.max(350, Math.min((dur || 0.5) * 1000, 2200));
    this._previewTimeout = setTimeout(() => this._playNextQueued(), wait);
  }
  stopPreviewQueue(silent) {
    if (this._previewTimeout) clearTimeout(this._previewTimeout);
    this._previewTimeout = null;
    this._previewQueue = null;
    this._previewIndex = 0;
    if (!silent && this._previewCbs && this._previewCbs.onStop) this._previewCbs.onStop();
    this._previewCbs = null;
  }
  get isPreviewQueueRunning() { return !!(this._previewQueue && this._previewTimeout); }

  _grooveTick() {
    while (this.grooveState.nextStepTime < this.ctx.currentTime + this.scheduleAheadTime) {
      const step = this.grooveState.step;
      const time = this.grooveState.nextStepTime;
      // swing delays odd 16th steps
      const swing = this.grooveState.swing || 0;
      const adjustedTime = (step % 2 === 1) ? time + this._stepDuration() * swing * 0.5 : time;
      this._scheduleStep(step, adjustedTime);
      this.grooveState.nextStepTime += this._stepDuration();
      this.grooveState.step = (this.grooveState.step + 1) % 16;
      if (this.grooveState.step === 0) this.grooveState.barCount++;
    }
  }

  _scheduleStep(step, time) {
    if (this.onStep) {
      const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
      setTimeout(() => this.onStep(step), delayMs);
    }
    const layers = this.grooveState.layers;
    const bar = this.grooveState.barCount;

    // KICK (downbeats)
    if ([0, 4, 8, 12].includes(step)) {
      const s = layers.kick;
      if (s) this.preview(s, this.master, time);
      else this.kick(time, { startFreq: 150, endFreq: 48, pitchDecay: 0.05, ampDecay: 0.26, drive: 0.15, click: 0.4, sub: 0.4 }, this.master);
    }

    // SNARE (backbeat)
    if ([4, 12].includes(step)) {
      if (layers.snare) this.preview(layers.snare, this.master, time);
      else if (layers.perc && layers.perc.engine === 'snare') this.preview(layers.perc, this.master, time);
    }

    // HATS — off-beat by default, rolling if the layered sound looks like a closed/psy hat
    const hat = layers.hat;
    if (hat) {
      const decay = hat.params && hat.params.decay;
      const rolling = step % 2 === 1 && decay && decay <= 0.08; // closed hats -> 16ths
      const offbeat = [2, 6, 10, 14].includes(step);
      if (rolling || offbeat) this.preview(hat, this.master, time);
    } else if ([2, 6, 10, 14].includes(step)) {
      this.hat(time, { decay: 0.09, filterFreq: 8000, filterQ: 1, metallic: false, noiseType: 'white' }, this.master);
    }

    // PERCUSSION — claps sit on the backbeat; hand drums / blips play a
    // syncopated pattern so layered percussion grooves instead of doubling
    // the snare.
    if (layers.perc && layers.perc.engine !== 'snare') {
      const percType = layers.perc.params && layers.perc.params.type;
      const isClap = percType === 'clap';
      const backbeat = [4, 12].includes(step);
      const syncopated = [3, 7, 11].includes(step);
      if ((isClap && backbeat && !layers.snare) || (!isClap && syncopated)) {
        this.preview(layers.perc, this.master, time);
      }
    }

    // BASS
    // - rolling/acid16/sequence patterns schedule their own 8 or 16 notes, so
    //   trigger them once per bar on step 0.
    // - offbeat pattern schedules its own offbeats, once per bar on step 0.
    // - long/single notes hit on step 0 and step 8 (two per bar).
    const bassPat = layers.bass && layers.bass.params && layers.bass.params.pattern;
    const sequencedBass = bassPat === 'rolling' || bassPat === 'acid16' ||
                          bassPat === 'sequence' || bassPat === 'offbeat' ||
                          bassPat === 'acidOffbeat' || bassPat === 'subPulse';
    if (layers.bass) {
      if (sequencedBass) {
        if (step === 0) this.preview(layers.bass, this.master, time);
      } else if (step === 0 || step === 8) {
        this.preview(layers.bass, this.master, time);
      }
    }

    if (step === 0) {
      if (layers.pad) this.preview(layers.pad, this.master, time);
      if (layers.vocal && bar % 4 === 0) this.preview(layers.vocal, this.master, time);
      if (layers.fx && bar % 4 === 0) this.preview(layers.fx, this.master, time);
      if (layers.texture && bar % 2 === 0) this.preview(layers.texture, this.master, time);
      if (layers.lead) this.preview(layers.lead, this.master, time);
    }
    if (step === 8) {
      if (layers.lead && layers.lead.subtype !== 'arp') this.preview(layers.lead, this.master, time);
    }
  }
}

window.audioEngine = new TechnoAudioEngine();
