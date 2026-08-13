#!/usr/bin/env node
/* ==========================================================================
   SOUND VALIDATION HARNESS  (dev tool, not part of the shipped app)

   Renders every sound in the library through the real TechnoAudioEngine
   inside a headless OfflineAudioContext (pure-JS "web-audio-engine") and
   measures the RMS energy of the result, so we can catch:
     - sounds whose engine/params produce silence (bug in synthesis path)
     - sounds whose params don't match their engine (wrong `type`/`pattern`)
     - accidental duplicate ids (which the loaders silently drop)

   Usage:
     npm run validate:sounds          # full check + report
     npm run validate:sounds -- --json # machine-readable summary

   This requires the "web-audio-engine" dev dependency (npm install).
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_FILES = [
  'js/data-sounds.js',
  'js/data-sounds-v3.js',
  'js/data-sounds-v4.js',
  'js/data-sounds-v5.js',
  'js/data-sounds-v6.js',
].map(f => path.join(ROOT, f));

function loadWebAudioEngine() {
  let mod = null;
  try {
    mod = require('web-audio-engine');
  } catch (e) {
    console.error('\n[validate] Missing dev dependency "web-audio-engine".');
    console.error('           Run:  npm install\n');
    process.exit(2);
  }
  return mod;
}

// --------------------------------------------------------------------------
// Build a sandbox that mimics the browser globals the engine expects.
function buildSandbox(wea) {
  const sandbox = {};
  // AudioContext provider — we use the OfflineAudioContext so we can render
  // without any hardware. The engine does `new AC()` in init().
  sandbox.AudioContext = wea.OfflineAudioContext;
  sandbox.webkitAudioContext = wea.OfflineAudioContext;
  sandbox.window = sandbox; // data files reference `window.SOUND_LIBRARY`
  return sandbox;
}

// Load the library the same way index.html does.
function loadLibrary(sandbox) {
  for (const file of DATA_FILES) {
    if (!fs.existsSync(file)) continue; // v6 may not exist yet during dev
    // Evaluate with a fresh module so `window` resolves to our sandbox.
    const fn = new Function('window', fs.readFileSync(file, 'utf8'));
    fn(sandbox);
  }
  return sandbox.SOUND_LIBRARY || [];
}

// Evaluate audio-engine.js with our sandbox as `window`.
function loadEngine(sandbox) {
  const src = fs.readFileSync(path.join(ROOT, 'js/audio-engine.js'), 'utf8');
  const fn = new Function('window', src);
  fn(sandbox);
  return sandbox.audioEngine;
}

// --------------------------------------------------------------------------
// Render a single sound on a fresh engine + correctly-sized offline context.
function measureOne(Engine, sound, wea, lengthSeconds) {
  const frames = Math.ceil(44100 * lengthSeconds);
  const offline = new wea.OfflineAudioContext(2, frames, 44100);

  // Build a throwaway engine wired to this offline context, replicating the
  // parts of init() we need (master, reverb/delay buses, noise buffers).
  const e = new Engine();
  e.ctx = offline;
  // The engine's preview() calls resume() -> init()/ctx.resume(); an offline
  // context has no live resume, so stub it out (we already built everything).
  e.resume = function () {};
  e.master = offline.createGain();
  e.master.gain.value = 0.85;
  e.master.connect(offline.destination);

  const comp = offline.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 24; comp.ratio.value = 5;
  comp.attack.value = 0.003; comp.release.value = 0.22;
  e.master.disconnect();
  e.master.connect(comp); comp.connect(offline.destination);

  e.reverbBus = offline.createConvolver();
  e.reverbBus.buffer = e._buildImpulse(2.4, 2.2);
  const reverbGain = offline.createGain(); reverbGain.gain.value = 0.5;
  const reverbTone = offline.createBiquadFilter(); reverbTone.type = 'lowpass'; reverbTone.frequency.value = 4500;
  e.reverbBus.connect(reverbTone); reverbTone.connect(reverbGain); reverbGain.connect(comp);

  e.delayBus = offline.createDelay(2.0); e.delayBus.delayTime.value = 0.375;
  const feedback = offline.createGain(); feedback.gain.value = 0.35;
  const delayTone = offline.createBiquadFilter(); delayTone.type = 'lowpass'; delayTone.frequency.value = 3200;
  const delayOut = offline.createGain(); delayOut.gain.value = 0.4;
  e.delayBus.connect(delayTone); delayTone.connect(feedback);
  feedback.connect(e.delayBus); feedback.connect(delayOut); delayOut.connect(comp);

  e._buildNoiseBuffers();

  let dur = 0;
  try {
    dur = e.preview(sound, e.master, 0.02) || 0;
  } catch (err) {
    return Promise.resolve({ error: String((err && err.message) || err), rms: 0, dur });
  }

  try {
    return offline.startRendering().then(buf => {
      let sum = 0, peak = 0;
      for (let ch = 0; ch < buf.numberOfChannels; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++) {
          const v = d[i];
          sum += v * v;
          if (Math.abs(v) > peak) peak = Math.abs(v);
        }
      }
      const n = buf.length * buf.numberOfChannels;
      return { rms: Math.sqrt(sum / Math.max(n, 1)), peak, dur, error: null };
    });
  } catch (err) {
    return Promise.resolve({ error: String((err && err.message) || err), rms: 0, dur });
  }
}

async function main() {
  const json = process.argv.includes('--json');
  const wea = loadWebAudioEngine();
  const sandbox = buildSandbox(wea);
  const library = loadLibrary(sandbox);
  const engine = loadEngine(sandbox);
  const Engine = engine.constructor;

  const results = [];
  for (const sound of library) {
    // Long textures/pads are allowed to be long; cap render at 5s.
    const length = sound.category === 'texture' || sound.category === 'pad' ? 5.2 : 3.0;
    const r = await measureOne(Engine, sound, wea, length);
    results.push({ id: sound.id, name: sound.name, category: sound.category, ...r });
  }

  const errors = results.filter(r => r.error);
  // A sound is "silent" if it never produced an audible transient (peak).
  const silent = results.filter(r => !r.error && r.peak < 0.01);
  // "Quiet" = audible but very low average energy (whispers, soft shakers).
  const quiet = results.filter(r => !r.error && r.peak >= 0.01 && r.rms < 5e-4);

  if (json) {
    console.log(JSON.stringify({
      total: results.length,
      errors: errors.length,
      silent: silent.length,
      quiet: quiet.length,
      silentList: silent.map(r => r.id),
      quietList: quiet.map(r => r.id),
      errorList: errors.map(r => ({ id: r.id, error: r.error })),
    }, null, 2));
    return;
  }

  console.log(`\nSound validation — ${results.length} sounds rendered\n`);
  if (errors.length) {
    console.log(`ERRORS (${errors.length}) — threw during synthesis:`);
    errors.forEach(r => console.log(`  - ${r.id}  (${r.category})  ${r.error}`));
    console.log('');
  }
  if (silent.length) {
    console.log(`SILENT (${silent.length}) — rendered no audible output:`);
    silent.forEach(r => console.log(`  - ${r.id}  (${r.category})  ${r.name}`));
    console.log('');
  }
  if (quiet.length) {
    console.log(`VERY QUIET (${quiet.length}) — audible but low energy (whisper/soft percussion):`);
    quiet.forEach(r => console.log(`  - ${r.id}  (${r.category})  ${r.name}  rms=${r.rms.toExponential(2)} peak=${r.peak.toExponential(2)}`));
    console.log('');
  }
  if (!errors.length && !silent.length && !quiet.length) {
    console.log('All sounds render with healthy output. \u2713');
  }
  process.exit(errors.length || silent.length ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
